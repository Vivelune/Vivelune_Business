import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import prisma from '@/lib/server/prisma'
import { headers } from 'next/headers'
import { PlanType, SubscriptionStatus } from '@/generated/prisma/enums'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return new NextResponse('No signature', { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return new NextResponse('Invalid signature', { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.userId
        const subscriptionId = session.subscription as string

        if (userId && subscriptionId) {
          // Get subscription details from Stripe
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          
          // Map Stripe status to your enum
          const status = mapStripeStatusToEnum(subscription.status)
          
          // Determine plan type based on price ID or product
          const planType = determinePlanType(subscription.items.data[0].price.id)
          
          // Store subscription in database
          await prisma.subscription.create({
            data: {
              userId,
              stripeSubscriptionId: subscriptionId,
              stripeCustomerId: session.customer as string,
              stripePriceId: subscription.items.data[0].price.id,
              stripeProductId: subscription.items.data[0].price.product as string,
              status,
              planType,
              interval: subscription.items.data[0].plan.interval,
              currentPeriodStart: new Date(subscription.start_date * 1000),
              currentPeriodEnd: new Date(),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            },
          })

          // Update user with subscription ID
          await prisma.user.update({
            where: { id: userId },
            data: { stripeSubscriptionId: subscriptionId },
          })
        }
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const subscriptionId = subscription.id

        // Map Stripe status to your enum
        const status = mapStripeStatusToEnum(subscription.status)

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            status,
            currentPeriodStart: new Date(subscription.start_date * 1000),
            currentPeriodEnd: new Date(),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        })
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new NextResponse('Webhook error', { status: 500 })
  }
}

// Helper function to map Stripe status to your enum
function mapStripeStatusToEnum(stripeStatus: string): SubscriptionStatus {
  const statusMap: Record<string, SubscriptionStatus> = {
    'active': 'ACTIVE',
    'past_due': 'PAST_DUE',
    'canceled': 'CANCELED',
    'unpaid': 'UNPAID',
    'incomplete': 'INCOMPLETE',
    'incomplete_expired': 'INCOMPLETE_EXPIRED',
    'trialing': 'TRIALING',
    'paused': 'PAUSED',
  }
  
  return statusMap[stripeStatus] || 'ACTIVE'
}

// Helper function to determine plan type based on price ID
function determinePlanType(priceId: string): PlanType {
  // You can customize this based on your price IDs
  // For example:
  // if (priceId.includes('pro_monthly')) return 'PRO'
  // if (priceId.includes('enterprise')) return 'ENTERPRISE'
  
  // For now, default to PRO
  return 'PRO'
}