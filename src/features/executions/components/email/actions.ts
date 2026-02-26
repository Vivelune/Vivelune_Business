// src/features/executions/components/email/actions.ts
"use server";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { emailChannel } from "@/inngest/channels/email";

export type EmailToken = Realtime.Token<typeof emailChannel, ["status"]>;

export async function fetchEmailRealtimeToken(): Promise<EmailToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: emailChannel(),
    topics: ["status"] as ["status"], // Type assertion to tuple
  });
  return token;
}