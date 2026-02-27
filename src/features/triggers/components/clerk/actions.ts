"use server";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { clerkChannel } from "@/inngest/channels/clerk";

export type ClerkToken = Realtime.Token<typeof clerkChannel, ["status"]>;

export async function fetchClerkRealtimeToken(): Promise<ClerkToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: clerkChannel(),
    topics: ["status"] as ["status"],
  });
  return token;
}