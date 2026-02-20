import { createTRPCRouter, protectedProcedure } from "@/trpc/init"
import { hasActiveSubscription } from "@/lib/server/subscription-check"
import { TRPCError } from "@trpc/server"

export const subscriptionsRouter = createTRPCRouter({
  getStatus: protectedProcedure.query(async ({ ctx }) => {
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
    const hasSubscription = await hasActiveSubscription(ctx.user.id)
    
    return {
      hasActiveSubscription: hasSubscription,
    }
  }),
})