import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { NodeStatus } from "./node-status-indicator";
import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react";

interface BaseNodeProps extends ComponentProps<"div"> {
  status?: NodeStatus;
}

/**
 * BaseNode
 * The primary container for ritual steps. 
 * Refined with sharp corners and high-contrast status indicators.
 */
export function BaseNode({ className, status, ...props }: BaseNodeProps) {
  return (
    <div
      className={cn(
        "bg-[#E7E1D8] text-[#1C1C1C] border-[#DCD5CB] relative rounded-none border shadow-sm transition-all",
        "hover:border-[#1C1C1C] focus:outline-none focus:ring-1 focus:ring-[#1C1C1C]",
        className,
      )}
      tabIndex={0}
      {...props}
    >
      {props.children}
      
      {/* Status Indicators: Pinned to a charcoal block for technical contrast */}
      {status && status !== "initial" && (
        <div className="absolute -bottom-1.5 -right-1.5 bg-[#1C1C1C] p-1 shadow-sm">
          {status === "error" && (
            <XCircleIcon className="size-3 text-red-400 stroke-[3px]" />
          )}
          {status === "success" && (
            <CheckCircle2Icon className="size-3 text-emerald-400 stroke-[3px]" />
          )}
          {status === "loading" && (
            <Loader2Icon className="size-3 text-[#E7E1D8] animate-spin stroke-[3px]" />
          )}
        </div>
      )}
    </div>
  );
}

/**
 * BaseNodeHeader
 * Header layout with a subtle background shift to define the action area.
 */
export function BaseNodeHeader({
  className,
  ...props
}: ComponentProps<"header">) {
  return (
    <header
      {...props}
      className={cn(
        "mx-0 my-0 flex flex-row items-center justify-between gap-4 border-b border-[#DCD5CB]/60 bg-[#DCD5CB]/10 px-4 py-2.5",
        className,
      )}
    />
  );
}

/**
 * BaseNodeHeaderTitle
 * Editorial-style titles: Small, bold, and tracked out.
 */
export function BaseNodeHeaderTitle({
  className,
  ...props
}: ComponentProps<"h3">) {
  return (
    <h3
      data-slot="base-node-title"
      className={cn(
        "select-none flex-1 text-[10px] font-bold uppercase tracking-[2px] text-[#1C1C1C]", 
        className
      )}
      {...props}
    />
  );
}

/**
 * BaseNodeContent
 * High-legibility content area with refined vertical spacing.
 */
export function BaseNodeContent({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-content"
      className={cn("flex flex-col gap-y-3 p-4 text-[12px] font-medium leading-relaxed", className)}
      {...props}
    />
  );
}

/**
 * BaseNodeFooter
 * Sharp border-top separator for terminal node actions.
 */
export function BaseNodeFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-footer"
      className={cn(
        "flex flex-col items-center gap-y-2 border-t border-[#DCD5CB] px-4 pt-3 pb-4",
        className,
      )}
      {...props}
    />
  );
}