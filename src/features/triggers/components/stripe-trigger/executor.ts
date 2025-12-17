import { NodeExecutor } from "@/features/executions/types";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";

type StripeTriggerData = Record<string, unknown>;

export const stripeTriggerExecutor: NodeExecutor<StripeTriggerData> = async({
    nodeId,
    context, 
    step,
    publish,
}) =>{

    await publish(
        stripeTriggerChannel().status({
            nodeId,
            status: "loading",
        })
    )
    // Publish loading state for manual trigger
    const result = await step.run("google-form-trigger", async()=>context)

    await publish(
        stripeTriggerChannel().status({
            nodeId,
            status: "success",
        })
    )
    return result
}