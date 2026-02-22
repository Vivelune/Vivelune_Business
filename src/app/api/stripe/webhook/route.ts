import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover", 
});

export async function POST(req: Request) {
  const requestId = Math.random().toString(36).substring(7);
  const body = await req.text();
  const headerPayload = await headers();
  const signature = headerPayload.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response('Webhook Error: Missing configuration', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown'}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id || session.metadata?.clerkUserId;

        if (!userId) break;

        // Ensure user exists
        await prisma.user.upsert({
          where: { id: userId },
          update: {},
          create: {
            id: userId,
            email: session.customer_details?.email || `${userId}@user.com`,
            name: session.customer_details?.name || 'User',
            subscriptionStatus: 'inactive',
          },
        });

        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          await updateSubscriptionInDb(userId, subscription, requestId);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        // FIX: Use Stripe.Subscription (removed the extra .Stripe)
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.clerkUserId;

        if (userId) {
          await updateSubscriptionInDb(userId, subscription, requestId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.clerkUserId;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionStatus: 'canceled',
              stripeSubscriptionId: null,
            },
          });
        }
        break;
      }
    }
  } catch (error) {
    console.error(`❌ [${requestId}] Webhook Handler Error:`, error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/**
 * Helper with explicit type for Stripe.Subscription
 */
async function updateSubscriptionInDb(
  userId: string, 
  subscription: Stripe.Subscription, 
  requestId: string
) {
  // Stripe timestamps are in seconds; JS Date needs milliseconds.
  // We use the optional chaining or a null check to ensure we don't pass NaN.
  const periodEndSeconds = subscription.trial_end;
  
  if (!periodEndSeconds) {
    throw new Error(`Missing current_period_end for subscription ${subscription.id}`);
  }

  const periodEndDate = new Date(periodEndSeconds * 1000);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      subscriptionPeriodEnd: periodEndDate,
    },
  });

  console.log(`✅ [${requestId}] User ${userId} updated. Status: ${subscription.status}`);
  return updatedUser;
}