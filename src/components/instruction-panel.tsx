"use client";

import { useState, useEffect } from "react";
import { 
  HelpCircleIcon, 
  XIcon, 
  ChevronRightIcon, 
  LightbulbIcon,
  SparklesIcon,
  BookOpenIcon,
  CodeIcon,
  ExternalLinkIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface InstructionStep {
  number: number;
  text: string;
  highlight?: string;
  action?: () => void;
}

interface InstructionPanelProps {
  title: string;
  steps: InstructionStep[];
  context?: string;
  videoUrl?: string;
  docUrl?: string;
  onDismiss?: () => void;
  className?: string;
}

export const InstructionPanel = ({
  title,
  steps,
  context,
  videoUrl,
  docUrl,
  onDismiss,
  className
}: InstructionPanelProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn("instruction-panel", className)}
    >
      {/* Header */}
      <div className="instruction-panel-header">
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-3 text-[#E7E1D8]" />
          <span className="instruction-panel-title">{title}</span>
        </div>
        <button 
          onClick={() => {
            setIsVisible(false);
            onDismiss?.();
          }}
          className="text-[#E7E1D8]/50 hover:text-[#E7E1D8] transition-colors"
        >
          <XIcon className="size-3" />
        </button>
      </div>

      {/* Context */}
      {context && (
        <div className="px-4 py-3 bg-[#E7E1D8]/5 border-b border-[#DCD5CB]/20">
          <p className="text-[10px] uppercase tracking-wider text-[#E7E1D8]/60 flex items-center gap-1">
            <LightbulbIcon className="size-3" />
            {context}
          </p>
        </div>
      )}

      {/* Steps */}
      <div className="instruction-panel-content">
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              "instruction-step",
              currentStep === index && "bg-white/5"
            )}
            onClick={() => {
              setCurrentStep(index);
              step.action?.();
            }}
          >
            <span className="instruction-step-number">{step.number}</span>
            <div className="flex-1">
              <p className="instruction-step-text">
                {step.text.split(/(\{\{[^}]+\}\})/g).map((part, i) => {
                  if (part.startsWith('{{') && part.endsWith('}}')) {
                    return (
                      <code key={i} className="instruction-highlight">
                        {part}
                      </code>
                    );
                  }
                  return part;
                })}
              </p>
            </div>
            <ChevronRightIcon className="size-3 text-[#E7E1D8]/40" />
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-[#DCD5CB]/20 p-3 flex items-center justify-between">
        <div className="flex gap-2">
          {docUrl && (
            <a
              href={docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] uppercase tracking-wider text-[#E7E1D8]/60 hover:text-[#E7E1D8] flex items-center gap-1 transition-colors"
            >
              <BookOpenIcon className="size-3" />
              Docs
            </a>
          )}
          {videoUrl && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] uppercase tracking-wider text-[#E7E1D8]/60 hover:text-[#E7E1D8] flex items-center gap-1 transition-colors"
            >
              <ExternalLinkIcon className="size-3" />
              Video
            </a>
          )}
        </div>
        <div className="text-[8px] uppercase tracking-wider text-[#E7E1D8]/30">
          Step {currentStep + 1}/{steps.length}
        </div>
      </div>
    </motion.div>
  );
};

// Contextual Help Icon Component
export const HelpIcon = ({ content }: { content: string }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span className="relative inline-block">
      <span
        className="help-icon"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        ?
      </span>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="tooltip-enhanced"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};