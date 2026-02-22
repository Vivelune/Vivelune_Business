import { auth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import superjson from 'superjson';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export const createTRPCContext = cache(async () => {
  return {};
});

const t = initTRPC.create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const { userId } = await auth();

  if (!userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource.',
    });
  }

  return next({
    ctx: {
      ...ctx,
      auth: { userId },
    },
  });
});

export const premiumProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    try {
      console.log('🔍 Checking premium status for user:', ctx.auth.userId);
      
      // Search for active subscriptions for this user
      const subscriptions = await stripe.subscriptions.list({
        limit: 100,
        status: 'active',
      });

      // Filter subscriptions that belong to this user
      const userSubscription = subscriptions.data.find(
        sub => sub.metadata?.clerkUserId === ctx.auth.userId
      );

      if (!userSubscription) {
        console.log('❌ No active subscription found for user:', ctx.auth.userId);
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Active Subscription Required',
        });
      }

      console.log('✅ Active subscription found:', {
        userId: ctx.auth.userId,
        subscriptionId: userSubscription.id,
        status: userSubscription.status,
      });

      return next({
        ctx: {
          ...ctx,
          subscription: userSubscription,
        },
      });
      
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      
      console.error('❌ Premium check error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to verify subscription status',
      });
    }
  }
);