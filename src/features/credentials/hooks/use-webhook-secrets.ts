// src/features/credentials/hooks/use-webhook-secrets.ts
import { useCredentialsByType } from "./use-credentials";
import { CredentialType } from "@/generated/prisma/enums";

export const useWebhookSecrets = () => {
  return useCredentialsByType(CredentialType.WEBHOOK_SECRET);
};

export const useWebhookSecret = (id: string) => {
  const { data: credentials } = useWebhookSecrets();
  return credentials?.find(c => c.id === id);
};