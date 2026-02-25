// src/app/api/billing/subscription/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        subscriptionStatus: true,
        subscriptionPeriodEnd: true,
      },
    });

    if (!user?.stripeSubscriptionId) {
      return NextResponse.json({ subscription: null });
    }

    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId, {
      expand: ['items.data.price.product', 'default_payment_method'],
    });

    // For API version 2026-01-28.clover, period dates are on the subscription items
    const firstItem = subscription.items?.data?.[0];
    const currentPeriodStart = firstItem?.current_period_start;
    const currentPeriodEnd = firstItem?.current_period_end;

    // Get upcoming invoice - using listUpcoming instead (available in all API versions)
    let upcomingInvoice = null;
    try {
      // Cast to any to bypass TypeScript error, or use a different approach
      const invoices = await (stripe.invoices as any).listUpcoming({
        customer: user.stripeCustomerId,
      });
      
      // listUpcoming returns an object with data array in some API versions
      upcomingInvoice = invoices?.data?.[0] || invoices;
    } catch (error) {
      console.log('No upcoming invoice found');
    }

    // Format the response
    const subscriptionData = {
      id: subscription.id,
      status: subscription.status,
      currentPeriodStart: currentPeriodStart ? new Date(currentPeriodStart * 1000) : null,
      currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      plan: {
        id: subscription.items.data[0].price.id,
        name: subscription.items.data[0].price.nickname || 'Pro Plan',
        amount: subscription.items.data[0].price.unit_amount,
        currency: subscription.items.data[0].price.currency,
        interval: subscription.items.data[0].price.recurring?.interval,
        product: subscription.items.data[0].price.product,
      },
      paymentMethod: subscription.default_payment_method ? {
        brand: (subscription.default_payment_method as any).card?.brand,
        last4: (subscription.default_payment_method as any).card?.last4,
        expMonth: (subscription.default_payment_method as any).card?.exp_month,
        expYear: (subscription.default_payment_method as any).card?.exp_year,
      } : null,
      upcomingInvoice: upcomingInvoice ? {
        amount: upcomingInvoice.amount_due,
        currency: upcomingInvoice.currency,
        date: new Date(upcomingInvoice.created * 1000),
      } : null,
    };

    return NextResponse.json({ subscription: subscriptionData });
    
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription details' },
      { status: 500 }
    );
  }
}