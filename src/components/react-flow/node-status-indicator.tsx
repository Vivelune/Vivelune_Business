import { type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export type NodeStatus = "loading" | "success" | "error" | "initial";

export type NodeStatusVariant = "overlay" | "border";

export type NodeStatusIndicatorProps = {
  status?: NodeStatus;
  variant?: NodeStatusVariant;
  children: ReactNode;
  className?: string;
};

/**
 * SpinnerLoadingIndicator
 * A prestigious overlay that treats the node like an object being processed.
 */
export const SpinnerLoadingIndicator = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="relative">
      <StatusBorder className="border-[#1C1C1C]/20">{children}</StatusBorder>

      {/* Vivelune Matte Blur Overlay */}
      <div className="bg-[#F4F1EE]/60 absolute inset-0 z-50 backdrop-blur-[2px]" />
      
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        {/* Subtle ping effect using the Charcoal palette */}
        <span className="absolute inline-block h-12 w-12 animate-ping rounded-full bg-[#1C1C1C]/5" />
        <LoaderCircle className="size-6 animate-spin text-[#1C1C1C] stroke-[1.5px]" />
      </div>
    </div>
  );
};

/**
 * BorderLoadingIndicator
 * A technical spinning gradient around the sharp edges of the node.
 */
export const BorderLoadingIndicator = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <>
      <div className="absolute -top-1 -left-1 h-[calc(100%+8px)] w-[calc(100%+8px)]">
        <style>
          {`
            @keyframes spin {
              from { transform: translate(-50%, -50%) rotate(0deg); }
              to { transform: translate(-50%, -50%) rotate(360deg); }
            }
            .studio-spinner {
              animation: spin 2s linear infinite;
              position: absolute;
              left: 50%;
              top: 50%;
              width: 150%;
              aspect-ratio: 1;
              transform-origin: center;
            }
          `}
        </style>
        <div className={cn("absolute inset-0 overflow-hidden rounded-none", className)}>
          {/* Using a sophisticated Charcoal to Transparent gradient */}
          <div className="studio-spinner rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,rgba(28,28,28,0.4)_0deg,rgba(28,28,28,0)_360deg)]" />
        </div>
      </div>
      {children}
    </>
  );
};

/**
 * StatusBorder
 * Sharp, 1px technical borders for status feedback.
 */
const StatusBorder = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <>
      <div
        className={cn(
          "absolute -top-1 -left-1 h-[calc(100%+8px)] w-[calc(100%+8px)] rounded-none border-[1px] pointer-events-none",
          className,
        )}
      />
      {children}
    </>
  );
};

export const NodeStatusIndicator = ({
  status,
  variant = "border",
  children,
  className
}: NodeStatusIndicatorProps) => {
  switch (status) {
    case "loading":
      switch (variant) {
        case "overlay":
          return <SpinnerLoadingIndicator>{children}</SpinnerLoadingIndicator>;
        case "border":
          return <BorderLoadingIndicator className={className}>{children}</BorderLoadingIndicator>;
        default:
          return <>{children}</>;
      }
    case "success":
      // Refined Emerald from the Vivelune palette
      return (
        <StatusBorder className={cn("border-emerald-600/40", className)}>{children}</StatusBorder>
      );
    case "error":
      // Refined Crimson for technical errors
      return (
        <StatusBorder className={cn("border-red-600/40", className)}>{children}</StatusBorder>
      );
    default:
      return <>{children}</>;
  }
};