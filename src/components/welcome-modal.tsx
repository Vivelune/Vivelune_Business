"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  XIcon, 
  ArrowRightIcon, 
  SparklesIcon,
  WorkflowIcon,
  KeyIcon,
  HistoryIcon,
  ZapIcon,
  GlobeIcon,
  MailIcon,
  BotIcon
} from "lucide-react";
import { Button } from "./ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";

interface WelcomeModalProps {
  onComplete?: () => void;
}

export const WelcomeModal = ({ onComplete }: WelcomeModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [hasSeenWelcome, setHasSeenWelcome] = useLocalStorage('vivelune-welcome-seen', false);

  useEffect(() => {
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, [hasSeenWelcome]);

  const steps = [
    {
      title: "Welcome to Vivelune Studio",
      description: "The intelligent automation platform for modern rituals",
      icon: SparklesIcon,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-[#8E8E8E] leading-relaxed">
            Vivelune helps you create automated workflows that connect AI models, 
            APIs, and services into powerful, observable processes.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[
              { icon: WorkflowIcon, label: "Visual Workflows" },
              { icon: BotIcon, label: "AI Integration" },
              { icon: GlobeIcon, label: "API Connections" },
              { icon: MailIcon, label: "Email Automation" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-2 border border-[#DCD5CB]">
                <item.icon className="size-3 text-[#1C1C1C]" />
                <span className="text-[9px] uppercase tracking-wider font-bold">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Step 1: Add Your Credentials",
      description: "Connect your AI providers and services",
      icon: KeyIcon,
      content: (
        <div className="space-y-4">
          <div className="bg-[#E7E1D8]/30 p-4 border border-[#DCD5CB]">
            <p className="text-xs font-mono mb-2">👉 Start here:</p>
            <ol className="space-y-2 text-[11px] text-[#4A4A4A]">
              <li className="flex items-start gap-2">
                <span className="text-[#1C1C1C] font-black">1.</span>
                <span>Navigate to <code className="bg-white px-1">Credentials</code> in the sidebar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1C1C1C] font-black">2.</span>
                <span>Click <span className="bg-[#1C1C1C] text-[#E7E1D8] px-1">New Credential</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1C1C1C] font-black">3.</span>
                <span>Add your API keys for OpenAI, Anthropic, Resend, etc.</span>
              </li>
            </ol>
          </div>
          <p className="text-[10px] text-[#8E8E8E] italic">
            🔐 All credentials are encrypted at rest and never exposed in logs
          </p>
        </div>
      )
    },
    {
      title: "Step 2: Create Your First Workflow",
      description: "Design your automation ritual",
      icon: WorkflowIcon,
      content: (
        <div className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 border border-[#DCD5CB]">
              <div className="size-6 bg-[#1C1C1C] text-[#E7E1D8] flex items-center justify-center text-[10px] font-black">1</div>
              <div>
                <p className="text-xs font-bold">Add a Trigger Node</p>
                <p className="text-[10px] text-[#8E8E8E]">Manual, Webhook, or Scheduled</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border border-[#DCD5CB]">
              <div className="size-6 bg-[#1C1C1C] text-[#E7E1D8] flex items-center justify-center text-[10px] font-black">2</div>
              <div>
                <p className="text-xs font-bold">Connect AI Models</p>
                <p className="text-[10px] text-[#8E8E8E]">Process data with GPT-4, Claude, Gemini</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border border-[#DCD5CB]">
              <div className="size-6 bg-[#1C1C1C] text-[#E7E1D8] flex items-center justify-center text-[10px] font-black">3</div>
              <div>
                <p className="text-xs font-bold">Add Actions</p>
                <p className="text-[10px] text-[#8E8E8E]">Send emails, post to Discord/Slack, call APIs</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Step 3: Execute & Monitor",
      description: "Watch your automation in action",
      icon: HistoryIcon,
      content: (
        <div className="space-y-4">
          <div className="bg-[#1C1C1C] p-4">
            <pre className="text-[10px] text-[#E7E1D8] font-mono leading-relaxed">
{`> Initializing workflow...
> Processing with GPT-4...
> ✓ Email sent to customer
> ✓ Discord notification posted
> ✓ Execution complete (2.4s)`}
            </pre>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#8E8E8E]">
            <ZapIcon className="size-3" />
            Check the <span className="font-mono bg-[#E7E1D8] px-1">Executions</span> tab for detailed logs
          </div>
        </div>
      )
    }
  ];

  const currentStep = steps[step];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="welcome-modal" onClick={() => setIsOpen(false)}>
          <motion.div
            className="welcome-modal-content"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <div className="h-1.5 bg-[#1C1C1C] w-full" />
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-[#1C1C1C] flex items-center justify-center">
                    <currentStep.icon className="size-5 text-[#E7E1D8]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-[2px]">
                      {currentStep.title}
                    </h2>
                    <p className="text-[10px] uppercase tracking-wider text-[#8E8E8E] mt-1">
                      {currentStep.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setHasSeenWelcome(true);
                    onComplete?.();
                  }}
                  className="text-[#8E8E8E] hover:text-[#1C1C1C] transition-colors"
                >
                  <XIcon className="size-4" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex gap-1 mb-8">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 flex-1 transition-all",
                      i <= step ? "bg-[#1C1C1C]" : "bg-[#DCD5CB]"
                    )}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="min-h-[250px]">
                {currentStep.content}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#DCD5CB]">
                <div className="text-[10px] uppercase tracking-wider text-[#8E8E8E]">
                  Step {step + 1} of {steps.length}
                </div>
                <div className="flex gap-3">
                  {step < steps.length - 1 ? (
                    <Button
                      onClick={() => setStep(step + 1)}
                      className="bg-[#1C1C1C] text-[#E7E1D8] hover:bg-[#333] rounded-none px-6 h-10 text-[10px] uppercase tracking-widest font-bold"
                    >
                      Next Step
                      <ArrowRightIcon className="ml-2 size-3" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setIsOpen(false);
                        setHasSeenWelcome(true);
                        onComplete?.();
                      }}
                      className="bg-[#1C1C1C] text-[#E7E1D8] hover:bg-[#333] rounded-none px-8 h-10 text-[10px] uppercase tracking-widest font-bold"
                    >
                      Start Building
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};