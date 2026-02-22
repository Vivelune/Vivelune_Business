import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  try {
    console.log('🔔 Stripe webhook received');
    
    const body = await req.text();
    const headerPayload = await headers();
    const signature = headerPayload.get('stripe-signature');

    if (!signature) {
      console.error('❌ No stripe-signature header found');
      return new Response('No signature', { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    console.log(process.env.STRIPE_WEBHOOK_SECRET, "STRIPE_WEBHOOK_SECRET")
    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET not set');
      return new Response('Webhook secret not configured', { status: 500 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('✅ Webhook signature verified');
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return new Response(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`, { 
        status: 400 
      });
    }

    console.log('📦 Stripe event type:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get userId from multiple possible locations
        const userId = session.client_reference_id || session.metadata?.clerkUserId;
        
        console.log('💰 Checkout completed!', {
          userId,
          sessionId: session.id,
          subscriptionId: session.subscription,
          customerId: session.customer,
          client_reference_id: session.client_reference_id,
          metadata: session.metadata,
        });

        if (userId && session.subscription) {
          try {
            // Get full subscription details from Stripe
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            
            // Use type assertion for Stripe object
            const subscriptionData = subscription as any;
            
            // Update user in database
            const updatedUser = await prisma.user.update({
              where: { id: userId },
              data: {
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
                subscriptionStatus: subscriptionData.status,
                subscriptionPeriodEnd: new Date(subscriptionData.current_period_end * 1000),
              },
            });

            console.log(`✅ Updated subscription for user: ${userId}`, {
              status: subscriptionData.status,
              periodEnd: new Date(subscriptionData.current_period_end * 1000),
            });
          } catch (dbError) {
            console.error('❌ Failed to update user in database:', dbError);
          }
        } else {
          console.log('⚠️ No userId found in session or no subscription:', {
            client_reference_id: session.client_reference_id,
            metadata: session.metadata,
            hasSubscription: !!session.subscription,
          });
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Get userId from subscription metadata (set via subscription_data in checkout)
        const userId = subscription.metadata?.clerkUserId;
        
        // Use type assertion for Stripe object
        const subscriptionData = subscription as any;
        
        console.log('📝 Subscription updated:', {
          userId,
          subscriptionId: subscriptionData.id,
          status: subscriptionData.status,
          metadata: subscriptionData.metadata,
        });

        if (userId) {
          try {
            await prisma.user.update({
              where: { id: userId },
              data: {
                subscriptionStatus: subscriptionData.status,
                stripeSubscriptionId: subscriptionData.id,
                stripeCustomerId: subscriptionData.customer as string,
                subscriptionPeriodEnd: new Date(subscriptionData.current_period_end * 1000),
              },
            });
            console.log(`✅ Updated subscription status for user: ${userId} to ${subscriptionData.status}`);
          } catch (dbError) {
            console.error('❌ Failed to update user subscription:', dbError);
          }
        } else {
          console.log('⚠️ No userId found in subscription metadata');
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.clerkUserId;
        
        console.log('❌ Subscription cancelled:', {
          userId,
          subscriptionId: subscription.id,
        });

        if (userId) {
          try {
            await prisma.user.update({
              where: { id: userId },
              data: {
                subscriptionStatus: 'canceled',
                stripeSubscriptionId: null,
              },
            });
            console.log(`✅ Marked subscription as canceled for user: ${userId}`);
          } catch (dbError) {
            console.error('❌ Failed to update canceled subscription:', dbError);
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const invoiceData = invoice as any;
        console.log('💰 Payment succeeded for subscription:', invoiceData.subscription);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const invoiceData = invoice as any;
        console.log('⚠️ Payment failed for subscription:', invoiceData.subscription);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('❌ Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Stripe webhook endpoint is ready',
    hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    timestamp: new Date().toISOString()
  });
}