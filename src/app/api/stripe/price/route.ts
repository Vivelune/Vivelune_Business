// src/app/api/stripe/price/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const priceId = searchParams.get('priceId');

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Fetching price from Stripe:', priceId);

    // Retrieve the price from Stripe
    const price = await stripe.prices.retrieve(priceId, {
      expand: ['product'],
    });

    // Safely handle product data (could be string, Product, or DeletedProduct)
    let productData = {
      id: typeof price.product === 'string' ? price.product : price.product.id,
      name: null as string | null,
      active: true,
    };

    // If product is expanded and not deleted, get its name
    if (typeof price.product !== 'string' && !price.product.deleted) {
      productData.name = price.product.name;
      productData.active = price.product.active;
    }

    // Format the price data
    const formattedPrice = {
      id: price.id,
      nickname: price.nickname,
      currency: price.currency,
      unitAmount: price.unit_amount,
      recurring: price.recurring,
      productId: productData.id,
      productName: productData.name,
      productActive: productData.active,
      active: price.active,
      metadata: price.metadata,
      createdAt: price.created,
    };

    return NextResponse.json({ price: formattedPrice });
    
  } catch (error) {
    console.error('❌ Error fetching price:', error);
    
    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch price' },
      { status: 500 }
    );
  }
}