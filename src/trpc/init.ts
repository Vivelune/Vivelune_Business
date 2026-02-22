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
    };
  } | null;
  subscription?: {
    status: string | null;
    customerId: string | null;
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
  const { userId } = await auth(); // Clerk auth

  if (!userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource.",
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      subscriptionStatus: true,
      stripeCustomerId: true,
    },
  });

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User account not found.",
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
  if (!ctx.auth) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required.",
    });
  }

  const { user } = ctx.auth;
  const isActive = user.subscriptionStatus === "active";

  if (!isActive) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Active subscription required.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      subscription: {
        status: user.subscriptionStatus,
        customerId: user.stripeCustomerId,
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