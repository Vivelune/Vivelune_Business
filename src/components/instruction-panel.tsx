"use client";

import { useState } from "react";
import { 
  XIcon, 
  ChevronRightIcon, 
  LightbulbIcon,
  SparklesIcon,
  BookOpenIcon,
  CodeIcon,
  ExternalLinkIcon,
  TerminalIcon
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
      className={cn(
        "fixed right-6 bottom-6 w-80 bg-[#09090B] border border-zinc-800 shadow-[20px_20px_60px_rgba(0,0,0,0.5)] z-40 overflow-hidden",
        className
      )}
    >
      {/* HUD Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <TerminalIcon className="size-3 text-[#FF6B00]" />
          <span className="text-[10px] font-black uppercase tracking-[2px] text-zinc-100 italic">
            {title}
          </span>
        </div>
        <button 
          onClick={() => {
            setIsVisible(false);
            onDismiss?.();
          }}
          className="text-zinc-600 hover:text-[#FF6B00] transition-colors"
        >
          <XIcon className="size-3" />
        </button>
      </div>

      {/* System Context Message */}
      {context && (
        <div className="px-4 py-2 bg-[#FF6B00]/5 border-b border-[#FF6B00]/10">
          <p className="text-[9px] uppercase tracking-wider text-[#FF6B00] font-bold flex items-center gap-2">
            <LightbulbIcon className="size-3" />
            Operator Note: {context}
          </p>
        </div>
      )}

      {/* Process Steps */}
      <div className="divide-y divide-zinc-900">
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              "group relative flex items-start gap-3 p-4 cursor-pointer transition-all duration-200",
              currentStep === index ? "bg-[#FF6B00]/5" : "hover:bg-zinc-900/50"
            )}
            onClick={() => {
              setCurrentStep(index);
              step.action?.();
            }}
          >
            {/* Active Indicator Bar */}
            {currentStep === index && (
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#FF6B00] shadow-[0_0_8px_#FF6B00]" />
            )}

            <span className={cn(
              "text-[10px] font-black italic mt-0.5",
              currentStep === index ? "text-[#FF6B00]" : "text-zinc-700"
            )}>
              {step.number.toString().padStart(2, '0')}
            </span>
            
            <div className="flex-1">
              <p className={cn(
                "text-[11px] leading-relaxed font-bold uppercase tracking-tight",
                currentStep === index ? "text-zinc-100" : "text-zinc-500"
              )}>
                {step.text.split(/(\{\{[^}]+\}\})/g).map((part, i) => {
                  if (part.startsWith('{{') && part.endsWith('}}')) {
                    return (
                      <code key={i} className="bg-zinc-800 text-[#FF6B00] px-1 rounded-sm mx-0.5 font-mono text-[10px]">
                        {part.replace(/{{|}}/g, '')}
                      </code>
                    );
                  }
                  return part;
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* HUD Footer */}
      <div className="border-t border-zinc-900 p-3 flex items-center justify-between bg-[#0D0D0F]">
        <div className="flex gap-4">
          {docUrl && (
            <a
              href={docUrl}
              className="text-[9px] font-black uppercase tracking-[2px] text-zinc-600 hover:text-zinc-200 flex items-center gap-1 transition-colors"
            >
              <BookOpenIcon className="size-3" />
              Docs
            </a>
          )}
          {videoUrl && (
            <a
              href={videoUrl}
              className="text-[9px] font-black uppercase tracking-[2px] text-zinc-600 hover:text-zinc-200 flex items-center gap-1 transition-colors"
            >
              <ExternalLinkIcon className="size-3" />
              Feed
            </a>
          )}
        </div>
        <div className="text-[8px] font-mono text-[#FF6B00]/40 uppercase">
          SEC_{currentStep + 1}_OF_{steps.length}
        </div>
      </div>
    </motion.div>
  );
};

// Tooltip: Simplified for high-contrast visibility
export const HelpIcon = ({ content }: { content: string }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span className="relative inline-block ml-1">
      <span
        className="flex items-center justify-center size-3.5 border border-zinc-700 text-zinc-500 text-[9px] font-black cursor-help hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors bg-zinc-900"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        ?
      </span>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-black border border-[#FF6B00]/30 shadow-[0_0_20px_rgba(0,0,0,0.8)] z-50 pointer-events-none"
          >
            <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-tight leading-normal">
              {content}
            </p>
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};