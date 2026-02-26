// src/hooks/use-upgrade-modal.tsx
import { UpgradeModal } from "@/components/upgrade-modal";
import { TRPCClientError } from "@trpc/client";
import { useState } from "react";

interface UseUpgradeModalOptions {
  title?: string;
  description?: string;
  features?: string[];
}

export const useUpgradeModal = (options?: UseUpgradeModalOptions) => {
  const [open, setOpen] = useState(false);

  const handleError = (error: unknown) => {
    if (error instanceof TRPCClientError) {
      // Check for subscription required errors
      if (error.data?.code === "FORBIDDEN" || 
          error.message.includes("subscription") ||
          error.message.includes("premium")) {
        setOpen(true);
        return true;
      }
    }
    return false;
  };

  const modal = (
    <UpgradeModal
      open={open}
      onOpenChange={setOpen}
      title={options?.title}
      description={options?.description}
      features={options?.features}
    />
  );

  return { handleError, modal, setOpen };
};