// src/app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`🚀 [${requestId}] Clerk webhook received at:`, new Date().toISOString());
  
  try {
    // Log headers
    const headerPayload = await headers();
    console.log(`📋 [${requestId}] Headers:`, {
      'svix-id': headerPayload.get('svix-id'),
      'svix-timestamp': headerPayload.get('svix-timestamp'),
      'content-type': headerPayload.get('content-type'),
    });

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      console.error(`❌ [${requestId}] Missing CLERK_WEBHOOK_SECRET`);
      return new Response('Missing webhook secret', { status: 500 });
    }

    const svixId = headerPayload.get('svix-id');
    const svixTimestamp = headerPayload.get('svix-timestamp');
    const svixSignature = headerPayload.get('svix-signature');

    const payload = await req.json();
    const body = JSON.stringify(payload);
    
    console.log(`📦 [${requestId}] Raw payload:`, JSON.stringify(payload, null, 2));

    // Verify webhook signature
    let evt: WebhookEvent;
    
    if (svixId && svixTimestamp && svixSignature) {
      try {
        const wh = new Webhook(WEBHOOK_SECRET);
        evt = wh.verify(body, {
          'svix-id': svixId,
          'svix-timestamp': svixTimestamp,
          'svix-signature': svixSignature,
        }) as WebhookEvent;
        console.log(`✅ [${requestId}] Webhook signature verified`);
      } catch (err) {
        console.error(`❌ [${requestId}] Signature verification failed:`, err);
        return new Response('Invalid signature', { status: 401 });
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚠️ [${requestId}] Development mode - accepting without signature`);
        evt = payload as WebhookEvent;
      } else {
        console.error(`❌ [${requestId}] Missing webhook headers`);
        return new Response('Missing headers', { status: 401 });
      }
    }

    const { type, data } = evt;
    console.log(`📨 [${requestId}] Processing event:`, { type, data: JSON.stringify(data).substring(0, 200) });

    // Handle user events
    if (type.startsWith('user.')) {
      const userData = data as any;
      const { id } = userData;

      if (!id) {
        console.error(`❌ [${requestId}] No user ID in webhook`);
        return NextResponse.json({ success: true });
      }

      console.log(`👤 [${requestId}] Processing user:`, { id, type });

      if (type === 'user.deleted') {
        try {
          await prisma.user.delete({ where: { id } });
          console.log(`✅ [${requestId}] User deleted: ${id}`);
        } catch (error) {
          console.error(`❌ [${requestId}] Failed to delete user:`, error);
        }
        return NextResponse.json({ success: true });
      }

      if (type === 'user.created' || type === 'user.updated') {
        // Get email
        const email = userData.email_addresses?.[0]?.email_address;
        if (!email) {
          console.error(`❌ [${requestId}] No email for user ${id}`);
          return NextResponse.json({ success: true });
        }

        // Generate name
        const firstName = userData.first_name || '';
        const lastName = userData.last_name || '';
        const name = [firstName, lastName].filter(Boolean).join(' ').trim() || 
                    email.split('@')[0] || 
                    'User';

        console.log(`📝 [${requestId}] Attempting to upsert user:`, {
          id,
          email,
          name,
          image: userData.image_url,
        });

        try {
          // Test database connection first
          await prisma.$queryRaw`SELECT 1`;
          console.log(`✅ [${requestId}] Database connection OK`);

          const user = await prisma.user.upsert({
            where: { id },
            update: {
              email,
              name,
              image: userData.image_url,
              emailVerified: true,
            },
            create: {
              id,
              email,
              name,
              image: userData.image_url,
              emailVerified: true,
              subscriptionStatus: 'inactive',
            },
          });

          console.log(`✅ [${requestId}] User upsert successful:`, {
            id: user.id,
            email: user.email,
            name: user.name,
          });

          // Verify user was actually created
          const verifyUser = await prisma.user.findUnique({
            where: { id },
            select: { id: true, email: true }
          });
          
          console.log(`🔍 [${requestId}] Verification query:`, verifyUser);

        } catch (dbError) {
          console.error(`❌ [${requestId}] Database error:`, {
            error: dbError,
            message: dbError instanceof Error ? dbError.message : 'Unknown error',
            stack: dbError instanceof Error ? dbError.stack : undefined,
          });
        }
      }
    }

    console.log(`✅ [${requestId}] Webhook processing complete`);
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error(`❌ [${requestId}] Unhandled webhook error:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Clerk webhook endpoint ready',
    timestamp: new Date().toISOString(),
  });
}