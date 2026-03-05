"use client";

import React, { type ReactNode } from "react";
import {
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";

import { BaseNode } from "./base-node";
import { cn } from "@/lib/utils";

export type PlaceholderNodeProps = Partial<NodeProps> & {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
};

/**
 * PlaceholderNode
 * Represents an "Available Slot" in the automation rack.
 * Styled with industrial dashed borders and a "Power-Up" hover effect.
 */
export function PlaceholderNode({ children, onClick, className }: PlaceholderNodeProps) {
  return (
    <BaseNode
      className={cn(
        "group w-auto h-auto p-8 text-center shadow-none cursor-pointer transition-all duration-300",
        // Base Style: Deep matte background with ghosted dashed borders
        "bg-zinc-950/20 border-dashed border-zinc-800 text-zinc-600",
        // Hover State: Energize the slot with Vivelune Orange
        "hover:border-[#FF6B00] hover:bg-[#FF6B00]/5 hover:text-zinc-100",
        "hover:shadow-[inset_0_0_20px_rgba(255,107,0,0.05)]",
        className
      )}
      onClick={onClick}
    >
      {/* Corner Brackets - Visible only on hover to simulate "Focusing" */}
      <div className="absolute top-0 left-0 size-2 border-t border-l border-transparent group-hover:border-[#FF6B00] transition-colors" />
      <div className="absolute bottom-0 right-0 size-2 border-b border-r border-transparent group-hover:border-[#FF6B00] transition-colors" />

      <div className="flex flex-col items-center justify-center min-w-16 min-h-16 gap-3">
        {children}
        <span className="text-[8px] font-black uppercase tracking-[3px] opacity-0 group-hover:opacity-100 transition-opacity">
          Add_Module
        </span>
      </div>

      {/* Connectivity logic preserved but kept technical */}
      <Handle
        type="target"
        className="opacity-0"
        position={Position.Top}
        isConnectable={false}
      />
      <Handle
        type="source"
        className="opacity-0"
        position={Position.Bottom}
        isConnectable={false}
      />
    </BaseNode>
  );
}