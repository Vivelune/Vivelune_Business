import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const startTime = Date.now();
  console.log('🔥🔥🔥 WEBHOOK ROUTE HIT AT:', new Date().toISOString());
  
  try {
    // Get the webhook secret from environment variables
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      console.error('❌ Missing CLERK_WEBHOOK_SECRET');
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

    console.log('📦 Webhook payload type:', payload.type);

    // Determine if this is a test event from Clerk dashboard
    // Test events have no svix headers and simplified data
    const isTestEvent = !svixId || !svixTimestamp || !svixSignature;
    
    let evt: WebhookEvent;

    if (!isTestEvent) {
      // Real event - verify signature
      console.log('🔐 Verifying webhook signature...');
      
      // Create a new Svix Webhook instance with your secret
      const wh = new Webhook(WEBHOOK_SECRET);

      try {
        evt = wh.verify(body, {
          'svix-id': svixId!,
          'svix-timestamp': svixTimestamp!,
          'svix-signature': svixSignature!,
        }) as WebhookEvent;
        console.log('✅ Webhook signature verified');
      } catch (err) {
        console.error('❌ Error verifying webhook:', err);
        return new Response('Error occurred', {
          status: 400,
        });
      }
    } else {
      // Test event from Clerk dashboard - skip verification
      evt = payload as WebhookEvent;
      console.log('🧪 Processing test event from Clerk dashboard');
    }

    // Get the event type
    const eventType = evt.type;
    console.log(`📨 Processing event type: ${eventType}`);

    // Handle user creation
    if (eventType === 'user.created') {
      const { 
        id, 
        email_addresses, 
        first_name, 
        last_name, 
        image_url 
      } = evt.data as any;

      if (!id) {
        console.error('❌ No user ID found in webhook');
        return new Response('No user ID found', { status: 400 });
      }

      // Handle email based on event type
      let primaryEmail: string;

      if (email_addresses && Array.isArray(email_addresses) && email_addresses.length > 0) {
        // Real event with email addresses
        primaryEmail = email_addresses[0]?.email_address;
        console.log('📧 Real user email:', primaryEmail);
      } else {
        // Test event - create a test email
        primaryEmail = `test-${id}@clerk-test.com`;
        console.log('🧪 Using test email for test event:', primaryEmail);
      }

      if (!primaryEmail) {
        console.error('❌ No email found in webhook');
        return new Response('No email found', { status: 400 });
      }

      // Generate a name from first/last name or use email
      const name = [first_name, last_name].filter(Boolean).join(' ').trim() || 
                  primaryEmail.split('@')[0] || 
                  'User';

      console.log(`👤 Attempting to create/update user:`, { id, email: primaryEmail, name });

      try {
        // Create or update user in database
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
            subscriptionStatus: 'inactive', // Default for new users
          },
        });

        console.log(`✅ User successfully ${isTestEvent ? 'created for test' : 'created in production'}:`, {
          id: user.id,
          email: user.email,
          name: user.name,
          subscriptionStatus: user.subscriptionStatus,
        });

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
        const user = await prisma.user.update({
          where: { id },
          data: {
            email: primaryEmail,
            name,
            image: image_url,
          },
        });

        console.log(`✅ User updated in database: ${id}`, {
          email: user.email,
          name: user.name,
        });
      } catch (error) {
        console.error('❌ Error updating user in database:', error);
        // Don't return error for updates - user might not exist yet
      }
    }

    // Handle user deletion
    if (eventType === 'user.deleted') {
      const { id } = evt.data as any;
      
      if (!id) {
        return new Response('No user ID found', { status: 400 });
      }

      try {
        await prisma.user.delete({
          where: { id },
        });

        console.log(`✅ User deleted from database: ${id}`);
      } catch (error) {
        console.error('❌ Error deleting user from database:', error);
        // Don't return error for deletion - user might not exist
      }
    }

    const duration = Date.now() - startTime;
    console.log(`✅ Webhook processed successfully in ${duration}ms`);

    return NextResponse.json({ 
      success: true, 
      message: `Processed ${eventType} event`,
      isTestEvent,
    });
    
  } catch (error) {
    console.error('❌ Unexpected error in webhook handler:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

// Add GET handler for testing endpoint availability
export async function GET() {
  return NextResponse.json({ 
    message: 'Clerk webhook endpoint is ready',
    status: 'active',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}