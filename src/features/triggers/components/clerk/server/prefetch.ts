// src/features/triggers/components/clerk-trigger/server/prefetch.ts
import { prefetch, trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";

type GetRecentEventsInput = inferInput<typeof trpc.clerk.getRecentEvents>;

export const prefetchClerkEvents = (params: GetRecentEventsInput) => {
  return prefetch(trpc.clerk.getRecentEvents.queryOptions(params));
};

export const prefetchEventStats = (workflowId: string, days: number = 30) => {
  return prefetch(trpc.clerk.getEventStats.queryOptions({ workflowId, days }));
};