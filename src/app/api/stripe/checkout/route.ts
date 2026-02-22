// src/app/api/stripe/checkout/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  try {
    console.log('🚀 Stripe checkout API called');

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId } = await req.json();
    
    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    console.log('🔍 Creating Stripe checkout session for user:', userId);
    
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      client_reference_id: userId,
      metadata: {
        clerkUserId: userId,
      },
      // IMPORTANT: These settings ensure metadata is copied to the subscription
      subscription_data: {
        metadata: {
          clerkUserId: userId,  // This copies the userId to the subscription
        },
      },
    });

    console.log('✅ Stripe checkout session created:', {
      id: session.id,
      url: session.url,
      client_reference_id: session.client_reference_id,
      metadata: session.metadata,
      subscription_data: {
        metadata: { clerkUserId: userId }, // This will be on the subscription
      },
    });

    return NextResponse.json({ url: session.url });
    
  } catch (error) {
    console.error('❌ Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}