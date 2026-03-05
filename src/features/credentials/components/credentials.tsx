"use client";

import React from "react";
import { EntityList } from "@/components/entity-components";
import { useRouter } from "next/navigation";
import { UseEntitySearch } from "@/hooks/use-entity-search";
import { formatDistanceToNow } from "date-fns";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useRemoveCredential, useSuspenseCredentials } from "../hooks/use-credentials";
import type { Credential } from "@/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Terminal, 
  Trash2,
  Copy,
  Cpu,
  Activity,
  ShieldAlert,
  ShieldCheck,
  Search,
  Key
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * SEARCH: Industrial Terminal Input
 */
export const CredentialsSearch = () => {
  const [params, setParams] = useCredentialsParams();
  const { searchValue, onSearchChange } = UseEntitySearch({ params, setParams });

  return (
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-zinc-800 pr-2">
        <Search className="w-3 h-3 text-zinc-500" />
      </div>
      <input
        type="text"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="AUTH_SEARCH::PRIMARY_NODE_QUERY..."
        className="w-full pl-12 pr-4 py-3 bg-black border border-zinc-800 rounded-none focus:outline-none focus:border-[#FF6B00] transition-all text-[10px] font-black uppercase tracking-widest placeholder:text-zinc-700"
      />
    </div>
  );
};

/**
 * LIST: Entity Wrapper
 */
export const CredentialsList = () => {
  const credentials = useSuspenseCredentials();

  return (
    <EntityList
      items={credentials.data.items}
      getKey={(credential) => credential.id}
      renderItem={(credential) => <CredentialItem data={credential} />}
      emptyView={<CredentialsEmpty />}
      className="space-y-2"
    />
  );
};

/**
 * ITEM: Secure Auth Module
 */
export const CredentialItem = ({ data }: { data: Credential }) => {
  const removeCredential = useRemoveCredential();

  const handleRemove = () => {
    removeCredential.mutate({ id: data.id });
    toast.success("AUTH_LOG: KEY_DELETED");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.id);
    toast.success("AUTH_LOG: ID_COPIED");
  };

  return (
    <TooltipProvider>
      <div className="relative group">
        <div className={cn(
          "bg-[#09090B] border border-zinc-800 rounded-none relative transition-all duration-200 overflow-hidden",
          "hover:border-zinc-700 hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]",
          removeCredential.isPending && "opacity-40"
        )}>
          {/* Status Line */}
          <div className="h-[2px] w-full bg-zinc-900 group-hover:bg-[#FF6B00] transition-colors" />

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-10 bg-zinc-950 border border-zinc-800 flex items-center justify-center relative">
                <Cpu className="size-5 text-zinc-600 group-hover:text-[#FF6B00] transition-colors" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black uppercase tracking-widest italic">{data.name}</span>
                  <Badge className="bg-zinc-900 text-[8px] border-zinc-800 rounded-none font-black text-zinc-500 uppercase">
                    {data.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1">
                   <div className="flex items-center gap-1.5">
                      <div className="size-1 bg-emerald-500 animate-pulse" />
                      <span className="text-[8px] font-bold text-zinc-600 uppercase">Status::Operational</span>
                   </div>
                   <span className="text-[8px] font-bold text-zinc-800 uppercase italic">
                     Sync::{formatDistanceToNow(new Date(data.updatedAt))} ago
                   </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-none h-8 text-[9px] font-black uppercase tracking-widest border border-zinc-800 hover:border-[#FF6B00] hover:text-[#FF6B00]"
                onClick={handleCopy}
              >
                <Copy className="size-3 mr-2" />
                Copy_ID
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-none h-8 w-8 hover:bg-red-950/30 hover:text-red-500 border border-transparent hover:border-red-900"
                onClick={handleRemove}
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

/**
 * CONTAINER: The Rack-Mount Frame
 */
export const CredentialsContainer = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end border-b border-zinc-900 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-1 bg-[#FF6B00]" />
            <div>
              <h1 className="text-2xl font-black uppercase tracking-[4px] italic">Security_Vault</h1>
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[2px] mt-1 flex items-center gap-2">
                <Activity className="size-3" /> Key Management Terminal v1.0.4
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push(`/credentials/new`)}
            className="rounded-none bg-[#FF6B00] hover:bg-[#FF8533] text-black font-black uppercase text-[10px] tracking-[2px] px-6"
          >
            <Plus className="size-4 mr-2" />
            New_Credential
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <div className="p-4 border border-zinc-900 bg-zinc-950/30">
                <h4 className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-4 italic underline">Telemetry</h4>
                <div className="space-y-4">
                    <div className="flex flex-col">
                        <span className="text-[7px] font-bold text-zinc-600 uppercase">Auth_Level</span>
                        <span className="text-[10px] font-black text-emerald-500 uppercase">Root_Access</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[7px] font-bold text-zinc-600 uppercase">Encryption</span>
                        <span className="text-[10px] font-black text-zinc-400 uppercase">AES_256_GCM</span>
                    </div>
                </div>
            </div>
            <div className="p-4 border border-zinc-800 bg-zinc-900/10 flex gap-3 items-center">
                <ShieldCheck className="size-4 text-zinc-500" />
                <span className="text-[7px] font-bold text-zinc-500 uppercase tracking-widest">End-to-End Encrypted</span>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <CredentialsSearch />
            <div className="min-h-[400px]">
              {children}
            </div>
            <CredentialsPagination />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * PAGINATION: Data Stream Navigation
 */
export const CredentialsPagination = () => {
  const credentials = useSuspenseCredentials();
  const [params, setParams] = useCredentialsParams();

  return (
    <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
      <p className="text-[9px] font-bold text-zinc-600 uppercase">
        Slice::{credentials.data.page} / {credentials.data.totalPages || 1}
      </p>
      <div className="flex gap-1">
        <Button
          variant="outline"
          className="rounded-none h-8 text-[9px] font-black uppercase border-zinc-800 hover:border-[#FF6B00]"
          onClick={() => setParams({ ...params, page: Math.max(1, params.page - 1) })}
          disabled={params.page === 1}
        >
          Prev
        </Button>
        <Button
          variant="outline"
          className="rounded-none h-8 text-[9px] font-black uppercase border-zinc-800 hover:border-[#FF6B00]"
          onClick={() => setParams({ ...params, page: Math.min(credentials.data.totalPages, params.page + 1) })}
          disabled={params.page === credentials.data.totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

/**
 * LOADING: System Boot sequence
 */
export const CredentialsLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 border border-zinc-900">
      <div className="relative size-10 mb-4">
        <div className="absolute inset-0 border border-[#FF6B00]/20" />
        <div className="absolute inset-0 border-t border-[#FF6B00] animate-spin" />
      </div>
      <p className="text-[9px] font-black uppercase tracking-[3px] text-zinc-600 animate-pulse">Loading_Vault...</p>
    </div>
  );
};

/**
 * ERROR: System Breach notification
 */
export const CredentialsError = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 border border-red-900/20 bg-red-950/5">
      <ShieldAlert className="size-8 text-red-600 mb-4" />
      <h3 className="text-[11px] font-black uppercase tracking-[2px] text-red-500">Connection_Lost</h3>
      <p className="text-[8px] font-bold text-zinc-600 uppercase mt-2">Vault database unreachable</p>
    </div>
  );
};

/**
 * EMPTY: Null State
 */
export const CredentialsEmpty = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800">
      <Terminal className="size-10 text-zinc-800 mb-6" />
      <h3 className="text-[11px] font-black uppercase tracking-[2px] text-zinc-500">No_Credentials_Found</h3>
      <Button
        onClick={() => router.push(`/credentials/new`)}
        className="mt-6 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-[9px] font-black uppercase"
      >
        Create_Initial_Key
      </Button>
    </div>
  );
};