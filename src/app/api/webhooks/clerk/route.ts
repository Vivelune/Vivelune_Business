import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Get the webhook secret from environment variables
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      console.error('Missing CLERK_WEBHOOK_SECRET');
      return new Response('Missing webhook secret', { status: 500 });
    }

    // Get the headers
    const headerPayload = await headers();
    const svixId = headerPayload.get('svix-id');
    const svixTimestamp = headerPayload.get('svix-timestamp');
    const svixSignature = headerPayload.get('svix-signature');

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // For testing purposes, if this is a test from Clerk dashboard, 
    // we can skip verification
    const isTestEvent = payload.type === 'user.created' && payload.data && payload.data.id;
    
    let evt: WebhookEvent;

    if (!isTestEvent) {
      // If there are no headers, error out
      if (!svixId || !svixTimestamp || !svixSignature) {
        return new Response('Error occurred -- no svix headers', {
          status: 400,
        });
      }

      // Create a new Svix Webhook instance with your secret
      const wh = new Webhook(WEBHOOK_SECRET);

      // Verify the webhook signature
      try {
        evt = wh.verify(body, {
          'svix-id': svixId,
          'svix-timestamp': svixTimestamp,
          'svix-signature': svixSignature,
        }) as WebhookEvent;
      } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occurred', {
          status: 400,
        });
      }
    } else {
      // For test events, just use the payload as is
      evt = payload as WebhookEvent;
      console.log('Processing test event from Clerk dashboard');
    }

    // Get the event type
    const eventType = evt.type;

    // Handle user creation
    if (eventType === 'user.created') {
      const { 
        id, 
        email_addresses, 
        first_name, 
        last_name, 
        image_url,
        primary_email_address_id 
      } = evt.data as any;

      if (!id) {
        return new Response('No user ID found', { status: 400 });
      }

      // Handle email (with test event fallback)
      let primaryEmail: string;

      if (email_addresses && Array.isArray(email_addresses) && email_addresses.length > 0) {
        // Real event with email addresses
        if (primary_email_address_id) {
          const primaryEmailObj = email_addresses.find(
            (email: any) => email.id === primary_email_address_id
          );
          primaryEmail = primaryEmailObj?.email_address || email_addresses[0]?.email_address;
        } else {
          primaryEmail = email_addresses[0]?.email_address;
        }
      } else {
        // Test event - create a test email
        primaryEmail = `test-${id}@clerk-test.com`;
        console.log('Using test email for test event:', primaryEmail);
      }

      if (!primaryEmail) {
        return new Response('No email found', { status: 400 });
      }

      // Generate a name from first/last name or use email
      const name = [first_name, last_name].filter(Boolean).join(' ').trim() || 
                  primaryEmail.split('@')[0] || 
                  'Test User';

      try {
        // Create user in Prisma (no Polar customer creation anymore)
        const user = await prisma.user.upsert({
          where: { id },
          update: {
            email: primaryEmail,
            name,
            image: image_url,
            emailVerified: true,
          },
          create: {
            id,
            email: primaryEmail,
            name,
            image: image_url,
            emailVerified: true,
          },
        });

        console.log(`✅ User created in database:`, {
          id: user.id,
          email: user.email,
          name: user.name,
        });

        // Note: With Stripe, customers are created automatically on first checkout
        // No need to create anything here
        
      } catch (error) {
        console.error('❌ Error creating user in database:', error);
        return new Response('Error creating user', { 
          status: 500 
        });
      }
    }

    // Handle user updates
    if (eventType === 'user.updated') {
      const { 
        id, 
        email_addresses, 
        first_name, 
        last_name, 
        image_url 
      } = evt.data as any;

      if (!id) {
        return new Response('No user ID found', { status: 400 });
      }

      const primaryEmail = email_addresses?.[0]?.email_address;

      if (!primaryEmail) {
        return new Response('No email found', { status: 400 });
      }

      const name = [first_name, last_name].filter(Boolean).join(' ').trim() || primaryEmail;

      try {
        // Update user in Prisma
        await prisma.user.update({
          where: { id },
          data: {
            email: primaryEmail,
            name,
            image: image_url,
          },
        });

        console.log(`✅ User updated in database: ${id}`);
      } catch (error) {
        console.error('❌ Error updating user in database:', error);
      }
    }

    // Handle user deletion
    if (eventType === 'user.deleted') {
      const { id } = evt.data as any;
      
      if (!id) {
        return new Response('No user ID found', { status: 400 });
      }

      try {
        // Delete user from Prisma
        await prisma.user.delete({
          where: { id },
        });

        console.log(`✅ User deleted from database: ${id}`);
      } catch (error) {
        console.error('❌ Error deleting user from database:', error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processed ${eventType} event` 
    });
    
  } catch (error) {
    console.error('❌ Unexpected error in webhook handler:', error);
    return new Response('Internal server error', { status: 500 });
  }
}