// src/features/triggers/components/stripe-trigger/executor.ts
import { NodeExecutor } from "@/features/executions/types";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";
import { NonRetriableError } from "inngest";

type StripeTriggerData = Record<string, unknown>;

/**
 * Stripe Trigger Executor
 * 
 * This executor processes Stripe webhook events and makes the data available
 * to subsequent nodes in the workflow.
 * 
 * Available in context as: {{stripe.*}}
 * 
 * Example:
 * - {{stripe.amount}} - Payment amount
 * - {{stripe.customerEmail}} - Customer email
 * - {{stripe.eventType}} - Event type (checkout.session.completed, etc.)
 * - {{json stripe}} - Full Stripe event data
 */
export const stripeTriggerExecutor: NodeExecutor<StripeTriggerData> = async({
    nodeId,
    context, 
    step,
    publish,
}) => {
    // Log execution start
    console.log(`⚡ [Stripe Trigger] Starting execution for node: ${nodeId}`);
    
    // Publish loading status for real-time UI updates
    await publish(
        stripeTriggerChannel().status({
            nodeId,
            status: "loading",
        })
    );

    try {
        // Run the trigger logic in a step for better observability
        const result = await step.run("stripe-trigger-process", async() => {
            
            // Log available data for debugging
            console.log("📦 [Stripe Trigger] Context keys available:", Object.keys(context));
            
            // Check if Stripe data exists in context
            if (!context.stripe) {
                console.warn("⚠️ [Stripe Trigger] No stripe data found in context");
                
                // Return context unchanged but with warning
                return {
                    ...context,
                    stripe: {
                        error: "No Stripe data received",
                        timestamp: new Date().toISOString(),
                    }
                };
            }

            // Log Stripe event details for debugging
            const stripeData = context.stripe as Record<string, any>;
            console.log("💰 [Stripe Trigger] Event type:", stripeData.eventType);
            console.log("💰 [Stripe Trigger] Customer:", stripeData.customerEmail || stripeData.customerId);
            console.log("💰 [Stripe Trigger] Amount:", stripeData.amount ? `${stripeData.amount/100} ${stripeData.currency}` : 'N/A');
            
            // Validate required fields (optional - depends on your needs)
            if (!stripeData.eventType) {
                console.warn("⚠️ [Stripe Trigger] Missing eventType in Stripe data");
            }

            // Ensure metadata is properly formatted
            if (stripeData.metadata && typeof stripeData.metadata === 'object') {
                console.log("📋 [Stripe Trigger] Metadata keys:", Object.keys(stripeData.metadata));
            }

            // Create a clean, well-structured return object
            const enrichedContext = {
                ...context,
                stripe: {
                    // Basic fields (always available)
                    amount: stripeData.amount ?? null,
                    currency: stripeData.currency ?? null,
                    customerId: stripeData.customerId ?? null,
                    customerEmail: stripeData.customerEmail ?? null,
                    customerName: stripeData.customerName ?? null,
                    eventType: stripeData.eventType ?? null,
                    status: stripeData.status ?? null,
                    paymentIntent: stripeData.paymentIntent ?? null,
                    
                    // Shipping info
                    shippingName: stripeData.shippingName ?? null,
                    shippingAddress: stripeData.shippingAddress ?? null,
                    
                    // Metadata (custom data you added)
                    metadata: stripeData.metadata ?? {},
                    
                    // Full data for advanced use
                    fullData: stripeData.fullData ?? {},
                    
                    // Event metadata
                    eventId: stripeData.eventId ?? null,
                    timestamp: stripeData.timestamp ?? null,
                    livemode: stripeData.livemode ?? null,
                    
                    // Helper flags
                    isLiveMode: stripeData.livemode === true,
                    isTestMode: stripeData.livemode === false,
                    
                    // Timestamp for when this was processed
                    processedAt: new Date().toISOString(),
                }
            };

            console.log("✅ [Stripe Trigger] Successfully processed Stripe event");
            return enrichedContext;
        });

        // Publish success status
        await publish(
            stripeTriggerChannel().status({
                nodeId,
                status: "success",
            })
        );

        console.log(`✅ [Stripe Trigger] Completed for node: ${nodeId}`);
        return result;

    } catch (error) {
        // Log the error
        console.error("❌ [Stripe Trigger] Error:", error);
        
        // Publish error status
        await publish(
            stripeTriggerChannel().status({
                nodeId,
                status: "error",
            })
        );

        // Throw a non-retriable error (won't retry on failure)
        throw new NonRetriableError(
            `Stripe trigger failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
};