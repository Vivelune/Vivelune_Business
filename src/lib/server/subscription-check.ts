import prisma from './prisma'

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    // Check if user has an active subscription in your database
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        currentPeriodEnd: {
          gt: new Date(),
        },
      },
    })
    
    return !!subscription
  } catch (error) {
    console.error('Error checking subscription:', error)
    return false
  }
}

// For testing/development only - uncomment if needed
// export async function hasActiveSubscription(userId: string): Promise<boolean> {
//   return true // TEMPORARY for testing
// }