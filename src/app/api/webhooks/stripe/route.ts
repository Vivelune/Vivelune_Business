import { sendWorkflowExecution } from "@/inngest/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    try {
        const url = new URL(request.url);
        const workflowId = url.searchParams.get("workflowId");
        if(!workflowId){
            return NextResponse.json(
                {
                    success:false, error:"Missing Required Query Parameter: workflowId" 
                },
                {status:400}
            )
        }

        const body = await request.json();
        
        // Get the Stripe event data
        const eventType = body.type;
        const stripeObject = body.data?.object;

        // Create a flattened structure for easy access in workflows
        const stripeData = {
            // Top-level fields for easy access in templates
            amount: stripeObject?.amount,
            currency: stripeObject?.currency,
            customerId: stripeObject?.customer,
            eventType: eventType,
            paymentIntent: stripeObject?.payment_intent,
            status: stripeObject?.status,
            customerEmail: stripeObject?.billing_details?.email,
            customerName: stripeObject?.billing_details?.name,
            
            // Shipping info
            shippingName: stripeObject?.shipping?.name,
            shippingAddress: stripeObject?.shipping?.address,
            
            // Metadata
            metadata: stripeObject?.metadata || {},
            
            // Full data for complex needs (keeping raw data)
            fullData: stripeObject,
            
            // Event metadata
            eventId: body.id,
            timestamp: body.created,
            livemode: body.livemode,
            apiVersion: body.api_version,
        }

        await sendWorkflowExecution({
            workflowId,
            initialData: {
                stripe: stripeData
            }
        })

        return NextResponse.json(
            {success: true},
            {status: 200},
        )
    } catch (error) {
        console.error("Stripe webhook error:", error);
        return NextResponse.json(
            {
                success: false, error: "Failed to process Stripe event"
            },
            {status: 500}
        )    
    }
}