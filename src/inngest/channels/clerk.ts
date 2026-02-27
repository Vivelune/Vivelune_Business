// src/inngest/channels/clerk.ts
import { channel, topic } from "@inngest/realtime";

export const CLERK_CHANNEL_NAME = "clerk-execution";

export const clerkChannel = channel(CLERK_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);