// src/features/triggers/components/clerk/hooks/use-clerk-trigger.ts
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

interface UseClerkEventsOptions {
  workflowId: string;
  limit?: number;
}

export const useClerkEvents = ({ workflowId, limit = 10 }: UseClerkEventsOptions) => {
  const trpc = useTRPC();
  
  return useQuery(
    trpc.clerk.getRecentEvents.queryOptions({ workflowId, limit })
  );
};

export const useClerkEventStats = (workflowId: string, days: number = 30) => {
  const trpc = useTRPC();
  
  return useQuery(
    trpc.clerk.getEventStats.queryOptions({ workflowId, days })
  );
};

export const useClerkSampleEvent = (eventType: string) => {
  const trpc = useTRPC();
  
  return useQuery({
    ...trpc.clerk.getSampleEvent.queryOptions({ eventType: eventType as any }),
    enabled: !!eventType,
  });
};

export const useTestClerkWebhook = () => {
  return useQuery({
    queryKey: ['clerk-webhook-test'],
    queryFn: async () => {
      const response = await fetch('/api/webhooks/clerk/test');
      if (!response.ok) {
        throw new Error('Failed to test webhook');
      }
      return response.json();
    },
    enabled: false,
  });
};