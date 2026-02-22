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

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get userId from multiple possible locations
        const userId = session.client_reference_id || session.metadata?.clerkUserId;
        
        console.log(`💰 [${requestId}] Checkout completed!`, {
          userId,
          sessionId: session.id,
          subscriptionId: session.subscription,
          customerId: session.customer,
          client_reference_id: session.client_reference_id,
          metadata: session.metadata,
        });

        // Verify user exists in database
        if (userId) {
          const userExists = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true }
          });

          if (!userExists) {
            console.error(`❌ [${requestId}] User not found in database:`, userId);
            // You might want to create the user here as a fallback
            console.log(`📝 [${requestId}] Attempting to create missing user...`);
            
            try {
              const newUser = await prisma.user.create({
                data: {
                  id: userId,
                  email: `${userId}@stripe-user.com`,
                  name: 'Stripe User',
                  emailVerified: true,
                  subscriptionStatus: 'inactive',
                },
              });
              console.log(`✅ [${requestId}] Created missing user:`, newUser.id);
            } catch (createError) {
              console.error(`❌ [${requestId}] Failed to create user:`, createError);
            }
          } else {
            console.log(`✅ [${requestId}] User found in database:`, userExists.email);
          }
        }

        if (userId && session.subscription) {
          try {
            // Get full subscription details from Stripe
            console.log(`🔍 [${requestId}] Fetching subscription details:`, session.subscription);
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            
            // Use type assertion to access subscription properties
            const subscriptionData = subscription as any;
            
            console.log(`📦 [${requestId}] Subscription data:`, {
              id: subscriptionData.id,
              status: subscriptionData.status,
              current_period_end: subscriptionData.current_period_end,
              customer: subscriptionData.customer,
            });

            // Update user in database with detailed logging
            console.log(`📝 [${requestId}] Updating user in database:`, userId);
            
            const updatedUser = await prisma.user.update({
              where: { id: userId },
              data: {
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
                subscriptionStatus: subscriptionData.status,
                subscriptionPeriodEnd: new Date(subscriptionData.current_period_end * 1000),
              },
            });

            console.log(`✅ [${requestId}] Database updated successfully:`, {
              userId: updatedUser.id,
              status: updatedUser.subscriptionStatus,
              subscriptionId: updatedUser.stripeSubscriptionId,
              customerId: updatedUser.stripeCustomerId,
              periodEnd: updatedUser.subscriptionPeriodEnd,
            });

          } catch (dbError) {
            console.error(`❌ [${requestId}] Failed to update user in database:`, {
              error: dbError instanceof Error ? dbError.message : dbError,
              code: dbError instanceof Error ? (dbError as any).code : undefined,
              userId,
              subscriptionId: session.subscription,
            });
          }
        } else {
          console.log(`⚠️ [${requestId}] Missing userId or subscription:`, {
            hasUserId: !!userId,
            hasSubscription: !!session.subscription,
          });
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Get userId from subscription metadata
        const userId = subscription.metadata?.clerkUserId;
        
        // Use type assertion to access subscription properties
        const subscriptionData = subscription as any;
        
        console.log(`📝 [${requestId}] Subscription ${event.type}:`, {
          userId,
          subscriptionId: subscriptionData.id,
          status: subscriptionData.status,
          metadata: subscriptionData.metadata,
          customer: subscriptionData.customer,
          current_period_end: subscriptionData.current_period_end,
        });

        if (userId) {
          try {
            // First check if user exists
            const userExists = await prisma.user.findUnique({
              where: { id: userId },
              select: { id: true }
            });

            if (!userExists) {
              console.log(`⚠️ [${requestId}] User not found, creating...`);
              await prisma.user.create({
                data: {
                  id: userId,
                  email: `${userId}@stripe-user.com`,
                  name: 'Stripe User',
                  emailVerified: true,
                  subscriptionStatus: subscriptionData.status,
                },
              });
            }

            // Update subscription
            const updatedUser = await prisma.user.update({
              where: { id: userId },
              data: {
                subscriptionStatus: subscriptionData.status,
                stripeSubscriptionId: subscriptionData.id,
                stripeCustomerId: subscriptionData.customer as string,
                subscriptionPeriodEnd: new Date(subscriptionData.current_period_end * 1000),
              },
            });

            console.log(`✅ [${requestId}] Updated subscription status for user: ${userId}`, {
              status: updatedUser.subscriptionStatus,
              subscriptionId: updatedUser.stripeSubscriptionId,
            });
          } catch (dbError) {
            console.error(`❌ [${requestId}] Failed to update user subscription:`, dbError);
          }
        } else {
          console.log(`⚠️ [${requestId}] No userId found in subscription metadata`);
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
            const updatedUser = await prisma.user.update({
              where: { id: userId },
              data: {
                subscriptionStatus: 'canceled',
                stripeSubscriptionId: null,
              },
            });
            console.log(`✅ [${requestId}] Marked subscription as canceled for user: ${userId}`);
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

    console.log(`✅ [${requestId}] Webhook processed successfully`);
    return NextResponse.json({ received: true, requestId });
    
  } catch (error) {
    console.error(`❌ [${requestId}] Stripe webhook error:`, error);
    return NextResponse.json(
      { error: 'Internal server error', requestId },
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