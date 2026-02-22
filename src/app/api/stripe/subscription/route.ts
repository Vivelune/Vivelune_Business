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

    // 2. Search for active subscriptions for this user
    // We can search by metadata.clerkUserId
    const subscriptions = await stripe.subscriptions.list({
      limit: 100,
      status: 'active',
      expand: ['data.customer', 'data.items.data.price'],
    });

    // 3. Filter subscriptions that belong to this user
    const userSubscription = subscriptions.data.find(
      sub => sub.metadata?.clerkUserId === userId
    );

    if (userSubscription) {
      console.log('✅ Active subscription found:', {
        id: userSubscription.id,
        status: userSubscription.status,
        priceId: userSubscription.items.data[0]?.price.id,
      });
    } else {
      console.log('ℹ️ No active subscription found for user');
    }

    // 4. Return subscription info
    return NextResponse.json({ 
      subscription: userSubscription ? {
        id: userSubscription.id,
        status: userSubscription.status,
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: userSubscription.cancel_at_period_end,
        priceId: userSubscription.items.data[0]?.price.id,
        productId: userSubscription.items.data[0]?.price.product,
      } : null
    });
    
  } catch (error) {
    console.error('❌ Subscription API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}