// src/app/api/stripe/subscription/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function GET() {
  try {
    console.log('🔍 Subscription status API called');

    // 1. Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      console.log('❌ No userId found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ User authenticated:', userId);

    // 2. Search for ANY subscriptions (not just active) for this user
    const subscriptions = await stripe.subscriptions.list({
      limit: 100,
      status: 'all', // Get all statuses, not just active
      expand: ['data.customer', 'data.items.data.price'],
    });

    // 3. Filter subscriptions that belong to this user
    const userSubscription = subscriptions.data.find(
      sub => sub.metadata?.clerkUserId === userId
    );

    if (userSubscription) {
      console.log('✅ Subscription found:', {
        id: userSubscription.id,
        status: userSubscription.status,
        priceId: userSubscription.items.data[0]?.price.id,
      });

      // Get the current period end from the subscription items (correct for this API version)
      const firstItem = userSubscription.items?.data?.[0];
      const currentPeriodEnd = firstItem?.current_period_end 
        ? new Date(firstItem.current_period_end * 1000) 
        : new Date();

      // 4. Return subscription info
      return NextResponse.json({ 
        subscription: {
          id: userSubscription.id,
          status: userSubscription.status,
          currentPeriodEnd,
          cancelAtPeriodEnd: userSubscription.cancel_at_period_end,
          priceId: userSubscription.items.data[0]?.price.id,
          productId: userSubscription.items.data[0]?.price.product,
        }
      });
    } else {
      console.log('ℹ️ No subscription found for user');
      // Return 200 with null subscription (not 404)
      return NextResponse.json({ subscription: null });
    }
    
  } catch (error) {
    console.error('❌ Subscription API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}