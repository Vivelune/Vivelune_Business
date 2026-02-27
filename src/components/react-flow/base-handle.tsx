import type { ComponentProps } from "react";
import { Handle, type HandleProps } from "@xyflow/react";

import { cn } from "@/lib/utils";

export type BaseHandleProps = HandleProps;

/**
 * BaseHandle
 * Refactored for the Vivelune "Roast & Recover" aesthetic.
 * Switched from rounded slate to sharp charcoal technical contact points.
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
        // Sharp edges, Charcoal background, Bone border
        "h-3 w-3 rounded-none border border-[#DCD5CB] bg-[#1C1C1C] transition-colors",
        // Interactive state: highlights on hover or connection attempt
        "hover:bg-[#4A4A4A] hover:border-[#1C1C1C]",
        className,
      )}
    >
      {children}
    </Handle>
  );
}