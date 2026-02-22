import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`🔔 [${requestId}] Stripe webhook received`);
  
  try {
    const body = await req.text();
    const headerPayload = await headers();
    const signature = headerPayload.get('stripe-signature');

    if (!signature) {
      console.error(`❌ [${requestId}] No stripe-signature header found`);
      return new Response('No signature', { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    console.log(`🔐 [${requestId}] Using webhook secret:`, webhookSecret?.substring(0, 10) + '...');
    
    if (!webhookSecret) {
      console.error(`❌ [${requestId}] STRIPE_WEBHOOK_SECRET not set`);
      return new Response('Webhook secret not configured', { status: 500 });
    }

    // Test database connection first
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log(`✅ [${requestId}] Database connected`);
    } catch (dbConnError) {
      console.error(`❌ [${requestId}] Database connection failed:`, dbConnError);
      return new Response('Database connection failed', { status: 500 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log(`✅ [${requestId}] Webhook signature verified`);
    } catch (err) {
      console.error(`❌ [${requestId}] Webhook signature verification failed:`, err);
      return new Response(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`, { 
        status: 400 
      });
    }

    console.log(`📦 [${requestId}] Stripe event type:`, event.type);
    console.log(`📦 [${requestId}] Event ID:`, event.id);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const userId = session.client_reference_id || session.metadata?.clerkUserId;
        
        console.log(`💰 [${requestId}] Checkout completed!`, {
          userId,
          sessionId: session.id,
          subscriptionId: session.subscription,
          customerId: session.customer,
        });

        // Verify user exists
        if (userId) {
          const userExists = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true }
          });

          if (!userExists) {
            console.log(`📝 [${requestId}] Creating missing user...`);
            await prisma.user.create({
              data: {
                id: userId,
                email: session.customer_details?.email || `${userId}@user.com`,
                name: session.customer_details?.name || 'User',
                emailVerified: true,
                subscriptionStatus: 'inactive',
              },
            });
            console.log(`✅ [${requestId}] Created missing user`);
          }
        }

        if (userId && session.subscription) {
          try {
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            
            // Use type assertion to access subscription properties
            const subscriptionData = subscription as any;
            
            // ✅ FIX: Convert seconds to milliseconds
            const periodEndTimestamp = subscriptionData.current_period_end * 1000;
            const periodEndDate = new Date(periodEndTimestamp);
            
            console.log(`📅 [${requestId}] Date conversion:`, {
              timestamp: subscriptionData.current_period_end,
              timestampMs: periodEndTimestamp,
              date: periodEndDate.toISOString(),
            });

            const updatedUser = await prisma.user.update({
              where: { id: userId },
              data: {
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
                subscriptionStatus: subscriptionData.status,
                subscriptionPeriodEnd: periodEndDate,
              },
            });

            console.log(`✅ [${requestId}] Database updated:`, {
              userId: updatedUser.id,
              status: updatedUser.subscriptionStatus,
              periodEnd: updatedUser.subscriptionPeriodEnd,
            });

          } catch (dbError) {
            console.error(`❌ [${requestId}] Failed to update user:`, dbError);
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.clerkUserId;
        
        // Use type assertion to access subscription properties
        const subscriptionData = subscription as any;
        
        // ✅ FIX: Convert seconds to milliseconds
        const periodEndTimestamp = subscriptionData.current_period_end * 1000;
        const periodEndDate = new Date(periodEndTimestamp);
        
        console.log(`📝 [${requestId}] Subscription ${event.type}:`, {
          userId,
          subscriptionId: subscriptionData.id,
          status: subscriptionData.status,
          periodEnd: periodEndDate.toISOString(),
        });

        if (userId) {
          try {
            const updatedUser = await prisma.user.update({
              where: { id: userId },
              data: {
                subscriptionStatus: subscriptionData.status,
                stripeSubscriptionId: subscriptionData.id,
                stripeCustomerId: subscriptionData.customer as string,
                subscriptionPeriodEnd: periodEndDate,
              },
            });

            console.log(`✅ [${requestId}] Updated user: ${userId} to ${subscriptionData.status}`);
          } catch (dbError) {
            console.error(`❌ [${requestId}] Failed to update user:`, dbError);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.clerkUserId;
        
        console.log(`❌ [${requestId}] Subscription cancelled:`, {
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
            console.log(`✅ [${requestId}] Canceled subscription for user: ${userId}`);
          } catch (dbError) {
            console.error(`❌ [${requestId}] Failed to update canceled subscription:`, dbError);
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const invoiceData = invoice as any;
        console.log(`💰 [${requestId}] Payment succeeded for subscription:`, invoiceData.subscription);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const invoiceData = invoice as any;
        console.log(`⚠️ [${requestId}] Payment failed for subscription:`, invoiceData.subscription);
        break;
      }

      default:
        console.log(`📋 [${requestId}] Unhandled event type:`, event.type);
    }

    return NextResponse.json({ received: true, requestId });
    
  } catch (error) {
    console.error(`❌ [${requestId}] Stripe webhook error:`, error);
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