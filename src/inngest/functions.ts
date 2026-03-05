// src/inngest/functions.ts

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

// Helper function to build a graph of connections
function buildConnectionGraph(connections: any[]) {
  const graph: Record<string, string[]> = {};
  const branchConnections: Record<string, Record<string, string[]>> = {};
  
  for (const conn of connections) {
    // Initialize graph entry if it doesn't exist
    if (!graph[conn.fromNodeId]) {
      graph[conn.fromNodeId] = [];
    }
    
    // ONLY treat as branch connection if it's specifically "true" or "false"
    // These are the special handles from the Conditional node
    if (conn.fromOutput === "true" || conn.fromOutput === "false") {
      if (!branchConnections[conn.fromNodeId]) {
        branchConnections[conn.fromNodeId] = {};
      }
      if (!branchConnections[conn.fromNodeId][conn.fromOutput]) {
        branchConnections[conn.fromNodeId][conn.fromOutput] = [];
      }
      branchConnections[conn.fromNodeId][conn.fromOutput].push(conn.toNodeId);
    } else {
      // ALL other connections (including "source-1", "main", etc.) go to the regular graph
      graph[conn.fromNodeId].push(conn.toNodeId);
    }
  }
  
  return { graph, branchConnections };
}

// Helper to get next nodes based on branch selection
function getNextNodes(
  currentNodeId: string,
  graph: Record<string, string[]>,
  branchConnections: Record<string, Record<string, string[]>>,
  branchSelection?: Record<string, { selected: string }>
): string[] {
  // If this node has branch-specific connections and we have a branch selection
  if (branchConnections[currentNodeId] && branchSelection?.[currentNodeId]) {
    const selectedBranch = branchSelection[currentNodeId].selected;
    const branchTargets = branchConnections[currentNodeId][selectedBranch];
    if (branchTargets && branchTargets.length > 0) {
      return branchTargets;
    }
  }
  
  // Fall back to regular connections
  return graph[currentNodeId] || [];
}

export const executeWorkflow = inngest.createFunction(
  { 
    id: "execute-workflow", 
    retries: process.env.NODE_ENV === "development" ? 0 : 3,
    onFailure: async({ event, step }) => {
      console.log(`❌ Workflow execution failed for event: ${event.data.event.id}`);
      
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

    // Step 1: Check if workflow exists
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

    // Step 3: Prepare workflow data
    const { nodes, connections, connectionGraph, branchConnections } = await step.run("prepare-workflow", async () => {
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

      // Build connection graph for traversal
      const { graph, branchConnections } = buildConnectionGraph(workflowWithData.connections);
      
      return {
        nodes: workflowWithData.nodes,
        connections: workflowWithData.connections,
        connectionGraph: graph,
        branchConnections
      };
    });

    // DEBUG: Log connection information
    console.log("🔍 DEBUG - Full connections data:", JSON.stringify(connections, null, 2));
    console.log("🔍 DEBUG - Connection graph:", JSON.stringify(connectionGraph, null, 2));
    console.log("🔍 DEBUG - Branch connections:", JSON.stringify(branchConnections, null, 2));

    const userId = workflow.userId;
    let context = event.data.initialData || {};
    const branchSelections: Record<string, { selected: string }> = {};

    // Step 4: Find starting nodes (nodes with no incoming connections or trigger nodes)
    const incomingCounts: Record<string, number> = {};
    for (const conn of connections) {
      incomingCounts[conn.toNodeId] = (incomingCounts[conn.toNodeId] || 0) + 1;
    }

    // DEBUG: Log incoming counts
    console.log("🔍 DEBUG - Incoming counts:", incomingCounts);

    // Start with nodes that have no incoming connections
    let nodesToExecute = nodes
      .filter(node => !incomingCounts[node.id])
      .map(node => node.id);

    // DEBUG: Log starting nodes
    console.log("🔍 DEBUG - Starting nodes:", nodesToExecute);
    console.log("🔍 DEBUG - All node IDs:", nodes.map(n => n.id));
    console.log("🔍 DEBUG - All node types:", nodes.map(n => `${n.id}: ${n.type}`));

    // Track executed nodes to avoid cycles
    const executed = new Set<string>();

    // Step 5: Execute nodes in traversal order (not just linear order)
    while (nodesToExecute.length > 0) {
      const currentNodeId = nodesToExecute.shift()!;
      
      if (executed.has(currentNodeId)) {
        console.log(`🔍 DEBUG - Skipping already executed node: ${currentNodeId}`);
        continue;
      }

      const currentNode = nodes.find(n => n.id === currentNodeId);
      if (!currentNode) {
        console.warn(`⚠️ Node ${currentNodeId} not found in workflow data`);
        continue;
      }

      console.log(`⚙️ Executing node: ${currentNode.id} (${currentNode.type})`);

      try {
        const executor = getExecutor(currentNode.type as NodeType);
        const newContext = await executor({
          data: currentNode.data as Record<string, unknown>,
          nodeId: currentNode.id,
          context,
          userId,
          step,
          publish,
        });

        context = newContext;
        
        // If this was a conditional node, capture branch selection
        if (currentNode.type === NodeType.CONDITIONAL && context._branchSelection?.[currentNode.id]) {
          branchSelections[currentNode.id] = context._branchSelection[currentNode.id];
          // Clean up the temporary branch selection from context
          delete context._branchSelection;
          console.log(`🔍 DEBUG - Conditional node ${currentNode.id} selected branch: ${branchSelections[currentNode.id].selected}`);
        }

        executed.add(currentNode.id);
        console.log(`✅ Node ${currentNode.id} executed successfully`);

        // Get next nodes based on branch selection if applicable
        const nextNodes = getNextNodes(
          currentNode.id,
          connectionGraph,
          branchConnections,
          branchSelections
        );

        console.log(`🔍 DEBUG - Next nodes from ${currentNode.id}:`, nextNodes);

        // Add new nodes to execute (avoid duplicates)
        for (const nextId of nextNodes) {
          if (!executed.has(nextId) && !nodesToExecute.includes(nextId)) {
            console.log(`🔍 DEBUG - Adding node ${nextId} to execution queue`);
            nodesToExecute.push(nextId);
          }
        }

        console.log(`🔍 DEBUG - Current execution queue:`, nodesToExecute);

      } catch (nodeError) {
        console.error(`❌ Node ${currentNode.id} failed:`, nodeError);
        
        await step.run("update-execution-failure", async () => {
          return prisma.execution.update({
            where: { inngestEventId },
            data: {
              status: ExecutionStatus.FAILED,
              error: `Node ${currentNode.id} (${currentNode.type}) failed: ${nodeError instanceof Error ? nodeError.message : 'Unknown error'}`,
              errorStack: nodeError instanceof Error ? nodeError.stack : undefined,
              completedAt: new Date(),
            }
          });
        });
        
        throw nodeError;
      }
    }

    // Step 6: Update execution with success
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
    console.log(`🔍 DEBUG - Final context keys:`, Object.keys(context));

    return {
      workflowId,
      result: context,
    };
  },
);