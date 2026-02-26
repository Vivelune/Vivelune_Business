// src/features/credentials/hooks/use-resend-credentials.ts
import { useCredentialsByType } from "./use-credentials";
import { CredentialType } from "@/generated/prisma/enums";

export const useResendCredentials = () => {
  return useCredentialsByType(CredentialType.RESEND);
};