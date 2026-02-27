// src/app/api/webhooks/clerk-trigger/route.ts
import { getWebhookSecret } from '@/lib/webhook-secrets';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { inngest } from '@/inngest/client';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  // Get query parameters
  const url = new URL(req.url);
  const workflowId = url.searchParams.get('workflowId');
  const variableName = url.searchParams.get('variableName') || 'clerkEvent';
  const secretId = url.searchParams.get('secretId');

  if (!workflowId) {
    return NextResponse.json({ error: 'No workflowId provided' }, { status: 400 });
  }

  // Get the workflow to find the user
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
    select: { userId: true }
  });

  if (!workflow) {
    return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
  }

  // Get headers for verification
  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  // If a secretId is provided, verify the webhook
  if (secretId) {
    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response('Missing svix headers', { status: 400 });
    }

    // Get the saved secret
    const savedSecret = await getWebhookSecret(workflowId, workflow.userId, secretId);

    if (!savedSecret) {
      return new Response('Webhook secret not found', { status: 401 });
    }

    // Verify the webhook
    const wh = new Webhook(savedSecret);
    const payload = await req.json();
    const body = JSON.stringify(payload);

    try {
      wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      });
      console.log('✅ Webhook signature verified');
    } catch (err) {
      console.error('❌ Webhook verification failed:', err);
      return new Response('Invalid signature', { status: 401 });
    }

    // Continue processing with the verified payload
    const evt = payload;
    const eventType = evt.type;

    // Format the data based on event type
    let triggerData: any = {};

    if (eventType.startsWith('user.')) {
      const userData = evt.data;
      const email = userData.email_addresses?.[0]?.email_address || null;
      
      triggerData = {
        userId: userData.id,
        email: email,
        firstName: userData.first_name || null,
        lastName: userData.last_name || null,
        imageUrl: userData.image_url || null,
        username: userData.username || null,
        eventType,
        timestamp: new Date().toISOString(),
        verified: true, // Mark as verified
        raw: userData,
      };
    }

    // Trigger the workflow
    await inngest.send({
      name: "workflows/execute.workflow",
      data: {
        workflowId,
        initialData: {
          [variableName]: triggerData,
        },
      },
      id: `clerk-trigger-${Date.now()}`,
    });

    return NextResponse.json({ success: true, verified: true });
  } else {
    // No secret provided - still trigger but mark as unverified
    console.log('⚠️ No webhook secret provided - skipping verification');
    
    const payload = await req.json();
    const eventType = payload.type;

    let triggerData: any = {
      eventType,
      timestamp: new Date().toISOString(),
      verified: false,
      raw: payload.data,
    };

    if (eventType.startsWith('user.')) {
      const userData = payload.data;
      triggerData = {
        ...triggerData,
        userId: userData.id,
        email: userData.email_addresses?.[0]?.email_address || null,
        firstName: userData.first_name || null,
        lastName: userData.last_name || null,
        imageUrl: userData.image_url || null,
        username: userData.username || null,
      };
    }

    await inngest.send({
      name: "workflows/execute.workflow",
      data: {
        workflowId,
        initialData: {
          [variableName]: triggerData,
        },
      },
      id: `clerk-trigger-${Date.now()}`,
    });

    return NextResponse.json({ success: true, verified: false });
  }
}