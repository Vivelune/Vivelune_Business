import prisma from './server/prisma'

export async function hasProcessedWebhook(eventId: string): Promise<boolean> {
  const event = await prisma.webhookEvent.findUnique({
    where: { stripeEventId: eventId },
  })
  return !!event?.processed
}

export async function markWebhookProcessed(eventId: string, type: string, error?: string) {
  return prisma.webhookEvent.create({
    data: {
      stripeEventId: eventId,
      type,
      processed: !error,
      processedAt: error ? null : new Date(),
      error,
    },
  })
}