// src/features/triggers/components/clerk/executor.ts
import { NodeExecutor } from "@/features/executions/types";
import { clerkChannel } from "@/inngest/channels/clerk";

interface ClerkNodeData {
  variableName?: string;
  eventType?: string;
  includeMetadata?: boolean;
  includeUserData?: boolean;
}

export const clerkTriggerExecutor: NodeExecutor<ClerkNodeData> = async({
  nodeId,
  context, 
  step,
  publish,
  data, // This contains the node configuration
}) => {
  await publish(
    clerkChannel().status({
      nodeId,
      status: "loading",
    })
  );

  const result = await step.run("clerk-trigger", async() => {
    console.log("👤 Clerk trigger context keys:", Object.keys(context));
    
    // Get the configured variable name from node data
    const variableName = data.variableName || "clerkEvent";
    
    // Check if data exists under the configured variable name
    if (context[variableName]) {
      console.log(`📦 Clerk data available under "${variableName}":`, context[variableName]);
      console.log("📧 Email:", (context[variableName] as any).email);
      console.log("👤 Name:", (context[variableName] as any).firstName, (context[variableName] as any).lastName);
    } 
    // Fallback to "clerk" for backward compatibility
    else if (context.clerk) {
      console.log(`📦 Clerk data available under "clerk" (fallback):`, context.clerk);
      console.log("📧 Email:", (context.clerk as any).email);
      console.log("👤 Name:", (context.clerk as any).firstName, (context.clerk as any).lastName);
      
      // Copy to the configured variable name for consistency
      context[variableName] = context.clerk;
    }
    else {
      console.log(`⚠️ No clerk data found under "${variableName}" or "clerk"`);
      console.log("Available context keys:", Object.keys(context));
    }
    
    return context;
  });

  await publish(
    clerkChannel().status({
      nodeId,
      status: "success",
    })
  );

  return result;
};