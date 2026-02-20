import { auth } from '@clerk/nextjs/server'
import { initTRPC, TRPCError } from '@trpc/server'
import { cache } from 'react'
import superjson from 'superjson'
import prisma from '@/lib/server/prisma'
import { hasActiveSubscription } from '@/lib/server/subscription-check'

// Define the context type
export type TRPCContext = {
  userId: string | null
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    clerkId: string
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
  } | null
}

export const createTRPCContext = cache(async (): Promise<TRPCContext> => {
  const { userId } = await auth()
  
  if (!userId) {
    return { userId: null, user: null }
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      clerkId: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
    }
  })

  return { 
    userId, 
    user: user || null 
  }
})

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
})

export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  console.log('Protected procedure - ctx:', { 
    hasUserId: !!ctx.userId, 
    hasUser: !!ctx.user,
    userId: ctx.userId,
    userEmail: ctx.user?.email 
  })

  if (!ctx.userId) {
    console.error('No userId in context')
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource.',
    })
  }

  if (!ctx.user) {
    console.error('No user in database for clerkId:', ctx.userId)
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User not found in database.',
    })
  }

  return next({
    ctx: {
      ...ctx,
      auth: {
        userId: ctx.userId,
        user: ctx.user,
      },
    },
  })
})

export const premiumProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  console.log('Premium procedure - ctx:', { 
    hasUserId: !!ctx.userId, 
    hasUser: !!ctx.user,
    userId: ctx.userId,
    userEmail: ctx.user?.email 
  })

  if (!ctx.userId) {
    console.error('No userId in context')
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource.',
    })
  }

  if (!ctx.user) {
    console.error('No user in database for clerkId:', ctx.userId)
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User not found in database.',
    })
  }
  // ctx.user is guaranteed to exist because of protectedProcedure
  const hasSubscription = await hasActiveSubscription(ctx.user.id)
  
  if (!hasSubscription) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Active subscription required',
    })
  }

  return next({
    ctx: {
      ...ctx,
      hasSubscription: true,
    },
  })
})