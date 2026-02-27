// src/features/credentials/components/webhook-secret-selector.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWebhookSecrets } from "../hooks/use-webhook-secrets";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

interface WebhookSecretSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  provider?: 'clerk' | 'stripe' | 'github' | 'all';
  placeholder?: string;
  disabled?: boolean;
}

export function WebhookSecretSelector({
  value,
  onChange,
  provider = 'all',
  placeholder = "Select a webhook secret",
  disabled = false,
}: WebhookSecretSelectorProps) {
  const { data: credentials, isLoading, error } = useWebhookSecrets();
  
  // Add detailed logging
  useEffect(() => {
    console.log("🔍 [WebhookSecretSelector] Component mounted/props updated");
    console.log("🔍 [WebhookSecretSelector] Provider filter:", provider);
    console.log("🔍 [WebhookSecretSelector] Is loading:", isLoading);
    console.log("🔍 [WebhookSecretSelector] Error:", error);
    console.log("🔍 [WebhookSecretSelector] Raw credentials data:", credentials);
    
    if (credentials) {
      console.log("🔍 [WebhookSecretSelector] Number of credentials:", credentials.length);
      credentials.forEach((cred, index) => {
        console.log(`🔍 [WebhookSecretSelector] Credential ${index}:`, {
          id: cred.id,
          name: cred.name,
          type: cred.type,
          createdAt: cred.createdAt
        });
      });
    }
  }, [credentials, isLoading, error, provider]);

  // Filter by provider if needed
  const filteredCredentials = credentials?.filter(cred => {
    if (provider === 'all') return true;
    // Case-insensitive check if name contains provider string
    return cred.name.toLowerCase().includes(provider.toLowerCase());
  });

  console.log("🔍 [WebhookSecretSelector] Filtered credentials count:", filteredCredentials?.length);

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (error) {
    console.error("🔍 [WebhookSecretSelector] Error loading credentials:", error);
    return (
      <div className="text-sm text-red-500 p-2 border border-red-200 rounded">
        Error loading secrets. Please try again.
      </div>
    );
  }

  if (!filteredCredentials?.length) {
    console.log("🔍 [WebhookSecretSelector] No filtered credentials found");
    return (
      <div className="flex flex-col gap-2">
        <div className="text-sm text-muted-foreground">
          No webhook secrets found. Create one in Credentials first.
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/credentials/new?type=WEBHOOK_SECRET">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Webhook Secret
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {filteredCredentials.map((credential) => (
          <SelectItem key={credential.id} value={credential.id}>
            <div className="flex items-center gap-2">
              <Image
                src="/webhook.svg"
                alt="Webhook"
                width={16}
                height={16}
              />
              <span>{credential.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}