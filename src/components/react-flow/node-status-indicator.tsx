"use client";

import { type ReactNode } from "react";
import { Loader2Icon, AlertTriangleIcon, CheckIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type NodeStatus = "loading" | "success" | "error" | "initial";

export const NodeStatusIndicator = ({
  status,
  children,
  className
}: {
  status?: NodeStatus;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("relative group transition-all duration-500", className)}>
      {/* Side-Glow: A vertical "Status Light" on the left edge */}
      <div 
        className={cn(
          "absolute -left-[2px] top-4 bottom-4 w-[3px] transition-all duration-500 blur-[1px]",
          status === "loading" && "bg-[#FF6B00] animate-pulse shadow-[0_0_10px_#FF6B00]",
          status === "success" && "bg-emerald-500 shadow-[0_0_10px_#10b981]",
          status === "error" && "bg-red-500 shadow-[0_0_10px_#ef4444]",
          (!status || status === "initial") && "bg-zinc-800"
        )} 
      />
      {children}
    </div>
  );
};