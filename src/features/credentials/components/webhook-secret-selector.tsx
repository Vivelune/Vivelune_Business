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
import { PlusIcon, KeyIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { data: credentials, isLoading } = useWebhookSecrets();

  // Filter by provider if needed (you can add a `provider` field to credentials if needed)
  const filteredCredentials = credentials?.filter(cred => {
    if (provider === 'all') return true;
    // You can filter by name or add a provider field to credentials
    return cred.name.toLowerCase().includes(provider);
  });

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (!filteredCredentials?.length) {
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