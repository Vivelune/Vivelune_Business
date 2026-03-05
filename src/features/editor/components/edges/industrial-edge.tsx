"use client";

import React from 'react';
import { 
  BaseEdge, 
  EdgeLabelRenderer, 
  getBezierPath, 
  type EdgeProps 
} from '@xyflow/react';
import { cn } from "@/lib/utils";

/**
 * IndustrialEdge
 * A high-fidelity data cable that adapts its hue based on logical state.
 * Emereld = True Path | Crimson = False Path | Zinc = Default
 */
export function IndustrialEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
  animated,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Determine signal color based on Handle ID metadata
  const isTrue = data?.isTruePath;
  const isFalse = data?.isFalsePath;

  const strokeColor = isTrue 
    ? "#10b981" // Emerald-500
    : isFalse 
    ? "#ef4444" // Red-500
    : "#52525b"; // Zinc-500 (Default)

  return (
    <>
      {/* 1. Shadow/Glow Layer (Blurs the line slightly for CRT effect) */}
      <path
        id={id + "_glow"}
        style={{ ...style, stroke: strokeColor, strokeWidth: selected ? 6 : 4 }}
        className="fill-none opacity-20 blur-[2px] transition-all duration-300"
        d={edgePath}
      />

      {/* 2. Base Cable Layer */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth: 2,
          strokeOpacity: selected ? 1 : 0.8,
        }}
        className={cn(
          "transition-all duration-300",
          selected ? "stroke-[3px]" : "stroke-[2px]"
        )}
      />

      {/* 3. The "Signal Pulse" (Animated Overlay) */}
      <path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={2}
        strokeDasharray="10, 20"
        className={cn(
          "pointer-events-none opacity-0 transition-opacity duration-500",
          (animated || selected) && "opacity-100 animate-industrial-flow"
        )}
      />

      {/* 4. Label Renderer (Optional: For adding data badges on the line) */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {selected && (
            <div className="bg-[#09090B] border border-zinc-800 px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter text-zinc-500 shadow-xl">
              Signal_Active
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}