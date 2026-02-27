// src/features/triggers/components/clerk-trigger/server/routers.ts
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { TRPCError } from "@trpc/server";

export const clerkTriggerRouter = createTRPCRouter({
  // Get recent Clerk events for a workflow
  getRecentEvents: protectedProcedure
    .input(z.object({ 
      workflowId: z.string(),
      limit: z.number().default(10)
    }))
    .query(async ({ ctx, input }) => {
      const auth = ctx.auth!;
      
      // Verify workflow belongs to user
      const workflow = await prisma.workflow.findFirst({
        where: {
          id: input.workflowId,
          userId: auth.userId
        }
      });

      if (!workflow) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workflow not found" });
      }

      // Get execution history for this workflow that have clerk event data
      const executions = await prisma.execution.findMany({
        where: {
          workflowId: input.workflowId,
        },
        orderBy: { startedAt: 'desc' },
        take: input.limit
      });

      // Filter and map executions that have clerk event data
      const clerkEvents = executions
        .filter(exec => {
          const output = exec.output as any;
          return output?.clerkEvent != null;
        })
        .map(exec => ({
          id: exec.id,
          eventType: (exec.output as any)?.clerkEvent?.type || 'unknown',
          userId: (exec.output as any)?.clerkEvent?.userId || null,
          userEmail: (exec.output as any)?.clerkEvent?.email || null,
          timestamp: exec.startedAt,
          status: exec.status,
          data: (exec.output as any)?.clerkEvent || null,
        }));

      return {
        events: clerkEvents,
        total: clerkEvents.length,
        workflowId: input.workflowId,
      };
    }),

  // Get event statistics
  getEventStats: protectedProcedure
    .input(z.object({ 
      workflowId: z.string(),
      days: z.number().default(30)
    }))
    .query(async ({ ctx, input }) => {
      const auth = ctx.auth!;
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - input.days);

      const executions = await prisma.execution.findMany({
        where: {
          workflowId: input.workflowId,
          startedAt: { gte: cutoffDate },
        },
      });

      // Count events by type
      const eventCounts: Record<string, number> = {};
      
      executions.forEach(exec => {
        const output = exec.output as any;
        const eventType = output?.clerkEvent?.type || 'unknown';
        eventCounts[eventType] = (eventCounts[eventType] || 0) + 1;
      });

      return {
        totalEvents: executions.length,
        eventCounts,
        period: `${input.days} days`,
      };
    }),

  // Test webhook configuration
  testWebhook: protectedProcedure
    .input(z.object({ 
      webhookSecret: z.string().optional() 
    }))
    .mutation(async ({ input }) => {
      // This would test the webhook connection
      // For now, validate that a secret exists
      return {
        success: !!input.webhookSecret,
        message: input.webhookSecret 
          ? "✓ Webhook secret is configured" 
          : "⚠️ No webhook secret provided. Add CLERK_WEBHOOK_SECRET to your .env file.",
        timestamp: new Date().toISOString(),
      };
    }),

  // Get sample event data for preview
  getSampleEvent: protectedProcedure
    .input(z.object({ 
      eventType: z.enum([
        'user.created',
        'user.updated', 
        'user.deleted',
        'session.created',
        'session.ended',
        'email.created'
      ]) 
    }))
    .query(async ({ input }) => {
      // Return sample data based on event type
      const samples = {
        'user.created': {
          userId: "user_2abc123def456",
          email: "john.doe@example.com",
          firstName: "John",
          lastName: "Doe",
          imageUrl: "https://img.clerk.com/xxx",
          username: "johndoe",
          createdAt: new Date().toISOString(),
          metadata: {
            signupMethod: "email",
            source: "website"
          }
        },
        'user.updated': {
          userId: "user_2abc123def456",
          email: "john.doe@example.com",
          firstName: "John",
          lastName: "Smith", // Updated last name
          imageUrl: "https://img.clerk.com/xxx",
          updatedAt: new Date().toISOString(),
        },
        'user.deleted': {
          userId: "user_2abc123def456",
          deleted: true,
          timestamp: new Date().toISOString(),
        },
        'session.created': {
          userId: "user_2abc123def456",
          sessionId: "sess_2xyz789uvw",
          browser: "Chrome",
          device: "MacOS",
          location: "San Francisco, CA",
          timestamp: new Date().toISOString(),
        },
        'session.ended': {
          userId: "user_2abc123def456",
          sessionId: "sess_2xyz789uvw",
          duration: 3600, // seconds
          timestamp: new Date().toISOString(),
        },
        'email.created': {
          userId: "user_2abc123def456",
          email: "john.doe@example.com",
          verification: {
            status: "pending",
            strategy: "email_code"
          },
          timestamp: new Date().toISOString(),
        }
      };

      return {
        eventType: input.eventType,
        sample: samples[input.eventType],
        note: "This is sample data. Actual data will vary based on your Clerk configuration."
      };
    }),
});