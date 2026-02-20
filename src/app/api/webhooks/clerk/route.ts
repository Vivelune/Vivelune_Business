import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import prisma from '@/lib/server/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    // Get the headers
    const headerPayload = await headers()
    const svixId = headerPayload.get('svix-id')
    const svixTimestamp = headerPayload.get('svix-timestamp')
    const svixSignature = headerPayload.get('svix-signature')

    // If there are no headers, error out
    if (!svixId || !svixTimestamp || !svixSignature) {
      return new NextResponse('Error occurred -- no svix headers', {
        status: 400,
      })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    // Create a new Svix instance with your webhook secret
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '')

    let evt: WebhookEvent

    // Verify the webhook
    try {
      evt = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as WebhookEvent
    } catch (err) {
      console.error('Error verifying webhook:', err)
      return new NextResponse('Error occurred', {
        status: 400,
      })
    }

    // Handle the webhook
    const eventType = evt.type

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data
      
      // Get primary email
      const primaryEmail = email_addresses?.[0]?.email_address
      
      if (!primaryEmail) {
        return new NextResponse('No email address', { status: 400 })
      }

      // Generate a name from firstName and lastName
      const name = [first_name, last_name].filter(Boolean).join(' ') || primaryEmail

      // Upsert user in database
      await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email: primaryEmail,
          firstName: first_name,
          lastName: last_name,
          name: name,
          imageUrl: image_url,
        },
        create: {
          clerkId: id,
          email: primaryEmail,
          firstName: first_name,
          lastName: last_name,
          name: name,
          imageUrl: image_url,
        },
      })

      console.log(`User ${eventType}:`, primaryEmail)
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data
      await prisma.user.delete({ 
        where: { clerkId: id } 
      })
      console.log('User deleted:', id)
    }

    return new NextResponse('Webhook received', { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}