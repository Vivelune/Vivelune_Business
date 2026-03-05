// src/features/executions/components/conditional/actions.ts
"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { conditionalChannel } from "@/inngest/channels/conditional";

export type ConditionalToken = Realtime.Token<typeof conditionalChannel, ["status"]>;

export async function fetchConditionalRealtimeToken(): Promise<ConditionalToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: conditionalChannel(),
    topics: ["status"] as ["status"],
  });
  return token;
}