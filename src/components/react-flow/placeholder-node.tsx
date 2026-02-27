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
 * Refactored to represent a "draft" state in the ritual studio.
 * Uses dashed borders and the Bone/Charcoal palette.
 */
export function PlaceholderNode({ children, onClick, className }: PlaceholderNodeProps) {
  return (
    <BaseNode
      className={cn(
        "w-auto h-auto p-6 text-center shadow-none cursor-pointer transition-all duration-300",
        // Visual Style: Transparent bone with a dashed technical border
        "bg-transparent border-dashed border-[#DCD5CB] text-[#8E8E8E]",
        // Hover State: Hardens the border and lightens the background
        "hover:border-[#1C1C1C] hover:bg-[#E7E1D8]/40 hover:text-[#1C1C1C]",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-center min-w-[3rem] min-h-[3rem]">
        {children}
      </div>

      {/* Logic Preserved: Hidden handles for connectivity flow */}
      <Handle
        type="target"
        style={{ visibility: "hidden" }}
        position={Position.Top}
        isConnectable={false}
      />
      <Handle
        type="source"
        style={{ visibility: "hidden" }}
        position={Position.Bottom}
        isConnectable={false}
      />
    </BaseNode>
  );
}