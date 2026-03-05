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
import { PlusIcon, ShieldCheck, AlertCircle, CheckCircle2, WebhookIcon, Cpu, Activity, Terminal } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WebhookSecretSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  provider?: 'clerk' | 'stripe' | 'github' | 'all';
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  description?: string;
}

export function WebhookSecretSelector({
  value,
  onChange,
  provider = 'all',
  placeholder = "SELECT_VAULT_NODE...",
  disabled = false,
  label = "Webhook_Auth_Secret",
  description = "Module requires encrypted signing secret for request verification."
}: WebhookSecretSelectorProps) {
  const { data: credentials, isLoading, error } = useWebhookSecrets();
  const [isOpen, setIsOpen] = useState(false);
  
  const filteredCredentials = credentials?.filter(cred => {
    if (provider === 'all') return true;
    return cred.name.toLowerCase().includes(provider.toLowerCase());
  });

  const selectedCredential = credentials?.find(cred => cred.id === value);

  // LOADING STATE: Industrial Skeleton
  if (isLoading) {
    return (
      <div className="space-y-2 border border-zinc-900 p-3 bg-black/20">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-none bg-zinc-800" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-3/4 bg-zinc-800" />
            <Skeleton className="h-2 w-1/2 bg-zinc-900" />
          </div>
        </div>
      </div>
    );
  }

  // ERROR STATE: System Alert
  if (error) {
    return (
      <div className="p-4 border border-red-900/50 bg-red-950/10 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
        <div>
          <p className="text-[10px] font-black uppercase text-red-500 tracking-widest">Auth_Sync_Error</p>
          <p className="text-[8px] font-bold text-zinc-600 uppercase">Failed to reach vault_db</p>
        </div>
      </div>
    );
  }

  // EMPTY STATE: Initialize Procedure
  if (!filteredCredentials?.length) {
    return (
      <div className="border border-zinc-800 bg-zinc-950 p-6 flex flex-col items-center text-center">
        <div className="size-10 border border-zinc-800 flex items-center justify-center mb-4">
          <WebhookIcon className="w-5 h-5 text-zinc-600" />
        </div>
        <h4 className="text-[10px] font-black uppercase tracking-[2px] text-zinc-400">No_Secrets_Defined</h4>
        <p className="text-[8px] font-bold text-zinc-600 uppercase mt-2 mb-4 max-w-[220px]">
          Identity credentials must be established before module uplink.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          asChild
          className="rounded-none border-zinc-800 hover:border-[#FF6B00] hover:text-[#FF6B00] text-[9px] font-black uppercase"
        >
          <Link href="/credentials/new?type=WEBHOOK_SECRET">
            <PlusIcon className="h-3 w-3 mr-2" />
            Init_New_Secret
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-2">
        {label && (
          <div className="flex items-center justify-between">
            <label className="text-[9px] font-black uppercase tracking-[3px] text-zinc-500 flex items-center gap-2">
              <Terminal className="w-3 h-3 text-[#FF6B00]" />
              {label}
            </label>
            <Badge className="bg-zinc-900 rounded-none border-zinc-800 text-[8px] font-black text-zinc-500 uppercase tracking-tighter">
              NODES::{filteredCredentials.length}
            </Badge>
          </div>
        )}

        <Select 
          value={value} 
          onValueChange={onChange} 
          disabled={disabled}
          onOpenChange={setIsOpen}
        >
          <SelectTrigger className={cn(
            "h-auto min-h-[54px] px-3 py-2 rounded-none bg-black border-zinc-800 hover:border-zinc-600 focus:ring-0 focus:border-[#FF6B00] transition-all",
            disabled && "opacity-40 grayscale",
            isOpen && "border-[#FF6B00] shadow-[0_0_15px_rgba(255,107,0,0.1)]"
          )}>
            <SelectValue placeholder={placeholder}>
              {selectedCredential && (
                <div className="flex items-center gap-3">
                  <div className="size-8 border border-zinc-800 bg-zinc-900 flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-[#FF6B00]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[11px] font-black uppercase tracking-widest italic">{selectedCredential.name}</p>
                    <p className="text-[8px] font-bold text-zinc-600 uppercase">
                      Auth_Sig::Encrypted_GCM
                    </p>
                  </div>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>

          <SelectContent className="rounded-none border-zinc-800 bg-black p-1 min-w-[300px] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="px-2 py-2 border-b border-zinc-900 mb-1">
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest italic flex items-center gap-2">
                <Activity className="size-3" /> Select_Available_Cipher
              </p>
            </div>
            
            {filteredCredentials.map((credential) => (
              <SelectItem 
                key={credential.id} 
                value={credential.id}
                className="rounded-none cursor-pointer py-3 px-2 focus:bg-[#FF6B00]/10 focus:text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 border border-zinc-900 bg-zinc-950 flex items-center justify-center">
                    <ShieldCheck className={cn(
                      "w-4 h-4",
                      credential.id === value ? "text-[#FF6B00]" : "text-zinc-700"
                    )} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-black uppercase tracking-widest">{credential.name}</p>
                      {credential.id === value && (
                        <div className="size-1 bg-[#FF6B00] animate-pulse" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[7px] font-bold text-zinc-600 uppercase tracking-tighter">
                      <span>SYNC_DATE::{new Date(credential.createdAt).toLocaleDateString()}</span>
                      <span className="text-zinc-800">|</span>
                      <span className="text-[#FF6B00]/60">{provider.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}

            <div className="h-[1px] bg-zinc-900 my-1" />

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="w-full justify-start gap-2 px-2 py-2 h-auto rounded-none hover:bg-zinc-900 text-zinc-500 hover:text-[#FF6B00]"
            >
              <Link href="/credentials/new?type=WEBHOOK_SECRET" className="text-[9px] font-black uppercase tracking-widest">
                <PlusIcon className="h-3 w-3" />
                Initialize_New_Cipher
              </Link>
            </Button>
          </SelectContent>
        </Select>

        {/* Dynamic Status Ticker */}
        <div className="flex items-center justify-between px-1">
          {description && (
            <p className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className={cn("w-3 h-3", value ? "text-emerald-500" : "text-zinc-800")} />
              {value ? `Uplink_Established::${selectedCredential?.name}` : description}
            </p>
          )}
          {value && (
             <span className="text-[7px] font-black text-emerald-500 uppercase animate-pulse">Connection_Secure</span>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}