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

  console.log("🔍 Clerk Trigger Webhook received:", {
    workflowId,
    variableName,
    secretId: secretId ? "provided" : "not provided",
    url: req.url
  });

  if (!workflowId) {
    console.error("❌ No workflowId provided");
    return NextResponse.json({ error: 'No workflowId provided' }, { status: 400 });
  }

  // Get the workflow to find the user
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
    select: { userId: true }
  });

  if (!workflow) {
    console.error("❌ Workflow not found:", workflowId);
    return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
  }

  console.log("✅ Workflow found for user:", workflow.userId);

  // Get headers for verification
  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  // If a secretId is provided, verify the webhook
  if (secretId) {
    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error("❌ Missing svix headers");
      return new Response('Missing svix headers', { status: 400 });
    }

    // Get the saved secret
    const savedSecret = await getWebhookSecret(workflowId, workflow.userId, secretId);

    if (!savedSecret) {
      console.error("❌ Webhook secret not found for ID:", secretId);
      return new Response('Webhook secret not found', { status: 401 });
    }

    console.log("✅ Webhook secret found, verifying signature...");

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

    console.log("📦 Received event type:", eventType);
    console.log("📦 Full payload keys:", Object.keys(evt));

    // Format the data based on event type
    let triggerData: any = {};

    if (eventType.startsWith('user.')) {
      const userData = evt.data;
      
      console.log("👤 User data keys:", Object.keys(userData));
      console.log("👤 User ID:", userData.id);
      console.log("👤 Email addresses:", userData.email_addresses);
      
      // ===== IMPROVED EMAIL EXTRACTION =====
      let email = null;
      
      // Method 1: Direct from email_addresses array
      if (userData.email_addresses && Array.isArray(userData.email_addresses) && userData.email_addresses.length > 0) {
        email = userData.email_addresses[0].email_address;
        console.log("✅ Method 1 - Email found in email_addresses array:", email);
      }
      // Method 2: Direct email field
      else if (userData.email) {
        email = userData.email;
        console.log("✅ Method 2 - Email found in direct email field:", email);
      }
      // Method 3: From primary_email_address_id
      else if (userData.primary_email_address_id && userData.email_addresses) {
        const primaryEmail = userData.email_addresses.find(
          (e: any) => e.id === userData.primary_email_address_id
        );
        if (primaryEmail) {
          email = primaryEmail.email_address;
          console.log("✅ Method 3 - Email found via primary_email_address_id:", email);
        }
      }
      // Method 4: From raw data (fallback)
      else if (userData.raw?.email_addresses?.[0]?.email_address) {
        email = userData.raw.email_addresses[0].email_address;
        console.log("✅ Method 4 - Email found in raw data:", email);
      }
      
      console.log("📧 Final extracted email:", email);
      // ===== END IMPROVED EMAIL EXTRACTION =====
      
      triggerData = {
        userId: userData.id,
        email: email,
        firstName: userData.first_name || null,
        lastName: userData.last_name || null,
        imageUrl: userData.image_url || null,
        username: userData.username || null,
        eventType,
        timestamp: new Date().toISOString(),
        verified: true,
        raw: userData,
      };

      console.log("📧 Final trigger data:", {
        userId: triggerData.userId,
        email: triggerData.email,
        firstName: triggerData.firstName,
        lastName: triggerData.lastName,
        eventType: triggerData.eventType,
      });
    } else if (eventType.startsWith('session.')) {
      const sessionData = evt.data;
      triggerData = {
        userId: sessionData.user_id,
        sessionId: sessionData.id,
        eventType,
        timestamp: new Date().toISOString(),
        verified: true,
        raw: sessionData,
      };
      console.log("🔐 Session event for user:", triggerData.userId);
    } else {
      console.log("⚠️ Unhandled event type:", eventType);
      triggerData = {
        eventType,
        timestamp: new Date().toISOString(),
        verified: true,
        raw: evt.data,
      };
    }

    // Trigger the workflow
    console.log(`🚀 Triggering workflow ${workflowId} with variable "${variableName}"`);
    
    const inngestPayload = {
      name: "workflows/execute.workflow",
      data: {
        workflowId,
        initialData: {
          [variableName]: triggerData,
        },
      },
      id: `clerk-trigger-${Date.now()}`,
    };
    
    console.log("📦 Inngest payload:", JSON.stringify(inngestPayload, null, 2));
    
    await inngest.send(inngestPayload);

    return NextResponse.json({ success: true, verified: true });
  } else {
    // No secret provided - still trigger but mark as unverified
    console.log('⚠️ No webhook secret provided - skipping verification');
    
    const payload = await req.json();
    const eventType = payload.type;

    console.log("📦 Unverified event type:", eventType);

    let triggerData: any = {
      eventType,
      timestamp: new Date().toISOString(),
      verified: false,
      raw: payload.data,
    };

    if (eventType.startsWith('user.')) {
      const userData = payload.data;
      
      // ===== IMPROVED EMAIL EXTRACTION FOR UNVERIFIED =====
      let email = null;
      
      // Method 1: Direct from email_addresses array
      if (userData.email_addresses && Array.isArray(userData.email_addresses) && userData.email_addresses.length > 0) {
        email = userData.email_addresses[0].email_address;
        console.log("✅ Method 1 - Email found in email_addresses array:", email);
      }
      // Method 2: Direct email field
      else if (userData.email) {
        email = userData.email;
        console.log("✅ Method 2 - Email found in direct email field:", email);
      }
      // Method 3: From primary_email_address_id
      else if (userData.primary_email_address_id && userData.email_addresses) {
        const primaryEmail = userData.email_addresses.find(
          (e: any) => e.id === userData.primary_email_address_id
        );
        if (primaryEmail) {
          email = primaryEmail.email_address;
          console.log("✅ Method 3 - Email found via primary_email_address_id:", email);
        }
      }
      // Method 4: From raw data (fallback)
      else if (userData.raw?.email_addresses?.[0]?.email_address) {
        email = userData.raw.email_addresses[0].email_address;
        console.log("✅ Method 4 - Email found in raw data:", email);
      }
      
      console.log("📧 Unverified - Final extracted email:", email);
      // ===== END IMPROVED EMAIL EXTRACTION =====
      
      triggerData = {
        ...triggerData,
        userId: userData.id,
        email: email,
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