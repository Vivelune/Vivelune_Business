import type { ComponentProps } from "react";
import { Handle, type HandleProps } from "@xyflow/react";

import { cn } from "@/lib/utils";

export type BaseHandleProps = HandleProps;

/**
 * BaseHandle
 * Refactored for the Vivelune Industrial HUD aesthetic.
 * These are the "Contact Points" for the automation engine.
 */
export function BaseHandle({
  className,
  children,
  ...props
}: ComponentProps<typeof Handle>) {
  return (
    <Handle
      {...props}
      className={cn(
        // Core Geometry: Non-rounded, dark zinc, subtle border
        "h-3 w-3 rounded-none border border-zinc-700 bg-[#09090B] transition-all duration-150",
        
        // The "Plug-in" Effect: When hovering or connecting, it glows orange
        "hover:border-[#FF6B00] hover:bg-[#FF6B00]/10 hover:shadow-[0_0_8px_#FF6B00]",
        
        // Connecting state (standard React Flow class)
        "data-[connecting=true]:bg-[#FF6B00] data-[connecting=true]:border-[#FF6B00]",
        
        // Valid connection target
        "data-[valid=true]:border-emerald-500 data-[valid=true]:bg-emerald-500/20",
        
        className,
      )}
    >
      {/* Internal "Contact" dot for extra detail */}
      <div className="absolute inset-0.5 bg-zinc-800 pointer-events-none group-hover:bg-[#FF6B00]/40 transition-colors" />
      
      {children}
    </Handle>
  );
}