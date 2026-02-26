import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";
import prisma from "@/lib/prisma";

/* --------------------------- */
/*       Context Type          */
/* --------------------------- */

export type TRPCContext = {
  auth: {
    userId: string;
    user: {
      id: string;
      subscriptionStatus: string | null;
      stripeCustomerId: string | null;
      stripeSubscriptionId: string | null;
    };
  } | null;
  subscription?: {
    status: string | null;
    customerId: string | null;
    subscriptionId: string | null;
  };
};

/* --------------------------- */
/*   Create Base Context       */
/* --------------------------- */

export const createTRPCContext = cache(async (): Promise<TRPCContext> => {
  return {
    auth: null, // default
  };
});

/* --------------------------- */
/*        Init TRPC            */
/* --------------------------- */

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof Error ? error.cause : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;

/* --------------------------- */
/*   Authentication Middleware */
/* --------------------------- */


const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  const { userId } = await auth();

  if (!userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource.",
    });
  }

  // Try to find the user in database
  let user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      subscriptionStatus: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
    },
  });

  // Define max attempts outside the if block so it's available in the error message
  const maxAttempts = 6;

  // If user doesn't exist, wait for webhook to complete
  if (!user) {
    console.log(`⏳ User ${userId} not found yet, waiting for webhook...`);
    
    // Wait up to 3 seconds for webhook to complete (6 attempts * 500ms)
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          subscriptionStatus: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
        },
      });

      if (user) {
        console.log(`✅ User ${userId} found after ${attempt * 500}ms`);
        break;
      }
      
      console.log(`⏳ Attempt ${attempt}/${maxAttempts} - user still not found`);
    }
  }

  // If still no user after waiting all attempts
  if (!user) {
    console.error(`❌ User ${userId} not found in DB after ${maxAttempts} attempts`);
    
    // Create a response that will trigger redirect on client
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "ACCOUNT_NOT_INITIALIZED", // Special message client can detect
    });
  }

  return next({
    ctx: {
      ...ctx,
      auth: {
        userId,
        user,
      },
    },
  });
});


/* --------------------------- */
/*   Subscription Middleware   */
/* --------------------------- */

const hasActiveSubscription = t.middleware(async ({ ctx, next }) => {
  console.log('🔍 Checking subscription status...');
  
  if (!ctx.auth) {
    console.log('❌ No auth context found');
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required.",
    });
  }

  const { user } = ctx.auth;
  console.log('👤 User subscription status from DB:', {
    userId: user.id,
    subscriptionStatus: user.subscriptionStatus,
    stripeCustomerId: user.stripeCustomerId,
    stripeSubscriptionId: user.stripeSubscriptionId,
  });

  const isActive = user.subscriptionStatus === "active";

  if (!isActive) {
    console.log('❌ Subscription not active');
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Active subscription required. Please upgrade to Pro.",
    });
  }

  console.log('✅ Subscription is active, proceeding...');
  return next({
    ctx: {
      ...ctx,
      subscription: {
        status: user.subscriptionStatus,
        customerId: user.stripeCustomerId,
        subscriptionId: user.stripeSubscriptionId,
      },
    },
  });
});

/* --------------------------- */
/*   Exported Procedures       */
/* --------------------------- */

export const protectedProcedure = t.procedure.use(isAuthenticated);
export const premiumProcedure = t.procedure
  .use(isAuthenticated)
  .use(hasActiveSubscription);