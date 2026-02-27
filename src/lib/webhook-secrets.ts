// src/lib/webhook-secrets.ts
import prisma from "./prisma";
import { encrypt, decrypt } from "./encryption";

export type WebhookProvider = 'clerk' | 'stripe' | 'github' | 'custom';

export interface WebhookSecret {
  id: string;
  provider: WebhookProvider;
  secret: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function saveWebhookSecret(
  workflowId: string,
  userId: string,
  provider: WebhookProvider,
  secret: string,
  description?: string
) {
  // Get current workflow
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId, userId }
  });

  if (!workflow) {
    throw new Error('Workflow not found');
  }

  // Parse existing secrets or create new object
  const secrets = (workflow.webhookSecrets as Record<string, any>) || {};
  
  // Generate a unique ID for this secret
  const secretId = `${provider}_${Date.now()}`;
  
  // Encrypt the secret before storing
  const encryptedSecret = encrypt(secret);

  // Store the secret
  secrets[secretId] = {
    id: secretId,
    provider,
    secret: encryptedSecret,
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Update workflow
  await prisma.workflow.update({
    where: { id: workflowId },
    data: { webhookSecrets: secrets }
  });

  return secretId;
}

export async function getWebhookSecret(
  workflowId: string,
  userId: string,
  secretId: string
): Promise<string | null> {
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId, userId }
  });

  if (!workflow) {
    return null;
  }

  const secrets = (workflow.webhookSecrets as Record<string, any>) || {};
  const secret = secrets[secretId];

  if (!secret) {
    return null;
  }

  // Decrypt the secret
  return decrypt(secret.secret);
}

export async function listWebhookSecrets(
  workflowId: string,
  userId: string,
  provider?: WebhookProvider
) {
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId, userId }
  });

  if (!workflow) {
    return [];
  }

  const secrets = (workflow.webhookSecrets as Record<string, any>) || {};
  
  return Object.values(secrets)
    .filter((secret: any) => !provider || secret.provider === provider)
    .map((secret: any) => ({
      id: secret.id,
      provider: secret.provider,
      description: secret.description,
      createdAt: new Date(secret.createdAt),
      updatedAt: new Date(secret.updatedAt),
      // Don't include the actual secret in the list
    }));
}

export async function deleteWebhookSecret(
  workflowId: string,
  userId: string,
  secretId: string
) {
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId, userId }
  });

  if (!workflow) {
    throw new Error('Workflow not found');
  }

  const secrets = (workflow.webhookSecrets as Record<string, any>) || {};
  delete secrets[secretId];

  await prisma.workflow.update({
    where: { id: workflowId },
    data: { webhookSecrets: secrets }
  });

  return true;
}