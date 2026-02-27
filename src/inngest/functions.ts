import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/prisma";
import { topologicalSort } from "./utils";
import { ExecutionStatus, NodeType } from "@/generated/prisma/enums";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { geminiChannel } from "./channels/gemini";
import { openAiChannel } from "./channels/openai";
import { anthropicChannel } from "./channels/anthropic";
import { deepseekChannel } from "./channels/deepseek";
import { discordChannel } from "./channels/discord";
import { slackChannel } from "./channels/slack";
import { clerkChannel } from "./channels/clerk";

export const executeWorkflow = inngest.createFunction(
  { 
    id: "execute-workflow", 
    retries: process.env.NODE_ENV === "development" ? 0 : 3,
    onFailure: async({ event, step }) => {
      console.log(`❌ Workflow execution failed for event: ${event.data.event.id}`);
      
      // Safely update execution only if it exists
      const execution = await prisma.execution.findUnique({
        where: { inngestEventId: event.data.event.id }
      });
      
      if (execution) {
        return prisma.execution.update({
          where: { inngestEventId: event.data.event.id },
          data: {
            status: ExecutionStatus.FAILED,
            error: event.data.error.message,
            errorStack: event.data.error.stack,
          }
        });
      } else {
        console.log(`⚠️ No execution record found for event ${event.data.event.id}, skipping failure update`);
        return null;
      }
    }
  },
  { 
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
      openAiChannel(),
      anthropicChannel(),
      deepseekChannel(),
      discordChannel(),
      slackChannel(),
      clerkChannel(),
    ]
  },
  async ({ event, step, publish }) => {
    const inngestEventId = event.id;
    const workflowId = event.data.workflowId;

    console.log(`🚀 Starting workflow execution:`, { workflowId, inngestEventId });

    if (!inngestEventId || !workflowId) {
      throw new NonRetriableError("Event ID or Workflow ID is missing");
    }

    // Step 1: Check if workflow exists before creating execution
    const workflow = await step.run("check-workflow-exists", async () => {
      return prisma.workflow.findUnique({
        where: { id: workflowId },
        select: { id: true, userId: true }
      });
    });

    if (!workflow) {
      console.log(`⚠️ Workflow ${workflowId} not found, skipping execution`);
      return { 
        skipped: true, 
        reason: "Workflow not found",
        workflowId 
      };
    }

    // Step 2: Create execution record
    await step.run("create-execution", async () => {
      return prisma.execution.create({
        data: {
          workflowId,
          inngestEventId,
          status: ExecutionStatus.RUNNING
        }
      });
    });

    // Step 3: Prepare workflow (get nodes and sort topologically)
    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflowWithData = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: {
          nodes: true,
          connections: true,
        }
      });

      if (workflowWithData.nodes.length === 0) {
        throw new NonRetriableError("Workflow has no nodes to execute");
      }

      return topologicalSort(workflowWithData.nodes, workflowWithData.connections);
    });

    // Step 4: Get user ID (already have from workflow check, but keep for clarity)
    const userId = workflow.userId;

    // Step 5: Initialize context with any initial data from the trigger
    let context = event.data.initialData || {};

    // Step 6: Execute each node in order
    for (const node of sortedNodes) {
      console.log(`⚙️ Executing node: ${node.id} (${node.type})`);
      
      try {
        const executor = getExecutor(node.type as NodeType);
        context = await executor({
          data: node.data as Record<string, unknown>,
          nodeId: node.id,
          context,
          userId,
          step,
          publish,
        });
        console.log(`✅ Node ${node.id} executed successfully`);
      } catch (nodeError) {
        console.error(`❌ Node ${node.id} failed:`, nodeError);
        
        // Update execution with node failure
        await step.run("update-execution-failure", async () => {
          return prisma.execution.update({
            where: { inngestEventId },
            data: {
              status: ExecutionStatus.FAILED,
              error: `Node ${node.id} (${node.type}) failed: ${nodeError instanceof Error ? nodeError.message : 'Unknown error'}`,
              errorStack: nodeError instanceof Error ? nodeError.stack : undefined,
              completedAt: new Date(),
            }
          });
        });
        
        throw nodeError; // Re-throw to trigger onFailure handler
      }
    }

    // Step 7: Update execution with success
    await step.run("update-execution", async () => {
      return prisma.execution.update({
        where: { inngestEventId, workflowId },
        data: {
          status: ExecutionStatus.SUCCESS,
          completedAt: new Date(),
          output: context
        }
      });
    });

    console.log(`✅ Workflow ${workflowId} completed successfully`);

    return {
      workflowId,
      result: context,
    };
  },
);