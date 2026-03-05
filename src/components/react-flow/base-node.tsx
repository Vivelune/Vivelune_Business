"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { NodeStatus } from "./node-status-indicator";
import { CheckCircle2Icon, Loader2Icon, XCircleIcon, AlertCircleIcon } from "lucide-react";

interface BaseNodeProps extends ComponentProps<"div"> {
  status?: NodeStatus;
}

/**
 * BaseNode
 * The primary chassis for automation modules.
 * Designed as a high-contrast terminal component with an industrial edge.
 */
export function BaseNode({ className, status, ...props }: BaseNodeProps) {
  return (
    <div
      className={cn(
        "bg-[#09090B] text-zinc-100 border-zinc-800 relative rounded-none border-2 transition-all duration-200 shadow-2xl",
        "hover:border-[#FF6B00]/50 hover:shadow-[0_0_20px_rgba(255,107,0,0.1)] focus:outline-none focus:ring-1 focus:ring-[#FF6B00]",
        // Highlight border when active/loading
        status === "loading" && "border-[#FF6B00]",
        status === "error" && "border-red-900",
        className,
      )}
      tabIndex={0}
      {...props}
    >
      {/* Background Micro-Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[grid_12px]" />

      {props.children}
      
      {/* Status Warning Lights: Re-engineered as an integrated corner module */}
      {status && status !== "initial" && (
        <div className={cn(
          "absolute -top-3 -right-3 p-1.5 border-2 shadow-[4px_4px_0px_#000]",
          status === "error" && "bg-red-950 border-red-500",
          status === "success" && "bg-emerald-950 border-emerald-500",
          status === "loading" && "bg-zinc-900 border-[#FF6B00]",
        )}>
          {status === "error" && (
            <XCircleIcon className="size-3.5 text-red-500 stroke-[3px]" />
          )}
          {status === "success" && (
            <CheckCircle2Icon className="size-3.5 text-emerald-500 stroke-[3px]" />
          )}
          {status === "loading" && (
            <Loader2Icon className="size-3.5 text-[#FF6B00] animate-spin stroke-[3px]" />
          )}
        </div>
      )}
    </div>
  );
}

/**
 * BaseNodeHeader
 * The Control Bar. Defined by a subtle zinc tint and tighter spacing.
 */
export function BaseNodeHeader({
  className,
  ...props
}: ComponentProps<"header">) {
  return (
    <header
      {...props}
      className={cn(
        "flex flex-row items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-900/40 px-4 py-2 relative",
        className,
      )}
    >
      {/* Small orange accent bar in the header corner */}
      <div className="absolute top-0 left-0 w-8 h-[2px] bg-[#FF6B00]" />
    </header>
  );
}

/**
 * BaseNodeHeaderTitle
 * System-style titles: Heavy tracking, monospaced-adjacent, purely uppercase.
 */
export function BaseNodeHeaderTitle({
  className,
  ...props
}: ComponentProps<"h3">) {
  return (
    <h3
      data-slot="base-node-title"
      className={cn(
        "select-none flex-1 text-[10px] font-black uppercase tracking-[3px] text-zinc-100 italic", 
        className
      )}
      {...props}
    />
  );
}

/**
 * BaseNodeContent
 * The Data Field. Using tighter leading for a technical density.
 */
export function BaseNodeContent({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-content"
      className={cn(
        "flex flex-col gap-y-3 p-4 text-[11px] font-bold uppercase tracking-tight text-zinc-400 leading-snug", 
        className
      )}
      {...props}
    />
  );
}

/**
 * BaseNodeFooter
 * The Action Interface. Hard separator with a darker footer background.
 */
export function BaseNodeFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-footer"
      className={cn(
        "flex flex-col items-center gap-y-2 border-t border-zinc-900 bg-black/20 px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}