import prisma from "@/lib/prisma";
import { generateSlug } from "random-word-slugs";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { PAGINATION } from "@/config/constants";
import { NodeType } from "@/generated/prisma/enums";
import type { Node, Edge } from "@xyflow/react";
import { inngest } from "@/inngest/client";
import { sendWorkflowExecution } from "@/inngest/utils";
import { TRPCError } from "@trpc/server";

export const workflowsRouter = createTRPCRouter({
  execute: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const auth = ctx.auth!;
      
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: auth.userId,
        },
      });

      await sendWorkflowExecution({
        workflowId: input.id,
      });

      return workflow;
    }),

  create: premiumProcedure.mutation(({ ctx }) => {
    const auth = ctx.auth!;
    
    return prisma.workflow.create({
      data: {
        name: generateSlug(3),
        userId: auth.userId,
        nodes: {
          create: {
            type: NodeType.INITIAL,
            position: { x: 0, y: 0 },
            name: NodeType.INITIAL,
          },
        },
      },
    });
  }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      const auth = ctx.auth!;
      
      return prisma.workflow.delete({
        where: {
          id: input.id,
          userId: auth.userId,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        nodes: z.array(
          z.object({
            id: z.string(),
            type: z.string().nullish(),
            position: z.object({ x: z.number(), y: z.number() }),
            data: z.record(z.string(), z.any()).optional(),
          })
        ),
        edges: z.array(
          z.object({
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullish(),
            targetHandle: z.string().nullish(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const auth = ctx.auth!;
      const { id, nodes, edges } = input;

      // First verify the workflow exists and belongs to the user
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id, userId: auth.userId },
      });

      // Get all valid NodeType enum values
      const validNodeTypes = Object.values(NodeType);
      console.log('Valid node types:', validNodeTypes);

      // Validate each node's type
      for (const node of nodes) {
        if (!node.type) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Node ${node.id} has no type specified`,
          });
        }

        if (!validNodeTypes.includes(node.type as NodeType)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Invalid node type: ${node.type}. Valid types are: ${validNodeTypes.join(', ')}`,
          });
        }
      }

      return await prisma.$transaction(async (tx) => {
        // Delete existing nodes
        await tx.node.deleteMany({
          where: { workflowId: id },
        });

        // Create new nodes with validated types
        if (nodes.length > 0) {
          await tx.node.createMany({
            data: nodes.map((node) => ({
              id: node.id,
              workflowId: id,
              name: node.type || "unknown",
              type: node.type as NodeType, // Now safe because we validated above
              position: node.position,
              data: node.data || {},
            })),
          });
        }

        // Delete existing connections
        await tx.connection.deleteMany({
          where: { workflowId: id },
        });

        // Create new connections
        if (edges.length > 0) {
          await tx.connection.createMany({
            data: edges.map((edge) => ({
              workflowId: id,
              fromNodeId: edge.source,
              toNodeId: edge.target,
              fromOutput: edge.sourceHandle || "main",
              toInput: edge.targetHandle || "main",
            })),
          });
        }

        // Update workflow timestamp
        await tx.workflow.update({
          where: { id },
          data: { updatedAt: new Date() },
        });

        return workflow;
      });
    }),

  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      const auth = ctx.auth!;
      
      return prisma.workflow.update({
        where: {
          id: input.id,
          userId: auth.userId,
        },
        data: {
          name: input.name,
        },
      });
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const auth = ctx.auth!;
      
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: auth.userId,
        },
        include: { nodes: true, connections: true },
      });

      const nodes: Node[] = workflow.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position as { x: number; y: number },
        data: (node.data as Record<string, unknown>) || {},
      }));

      const edges: Edge[] = workflow.connections.map((connection) => ({
        id: connection.id,
        source: connection.fromNodeId,
        target: connection.toNodeId,
        sourceHandle: connection.fromOutput,
        targetHandle: connection.toInput,
      }));

      return {
        id: workflow.id,
        name: workflow.name,
        nodes,
        edges,
      };
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      const auth = ctx.auth!;
      const { page, pageSize, search } = input;

      const [items, totalCount] = await Promise.all([
        prisma.workflow.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: auth.userId,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.workflow.count({
          where: {
            userId: auth.userId,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
});