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
  BotIcon,
  TerminalIcon
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
      title: "Vivelune Initialization",
      description: "Establishing link to high-fidelity automation core",
      icon: SparklesIcon,
      content: (
        <div className="space-y-4">
          <p className="text-xs text-zinc-400 leading-relaxed font-medium uppercase tracking-tight">
            Vivelune orchestrates complex logic between AI models and hardware APIs. 
            Prepare for high-density workflow execution.
          </p>
          <div className="grid grid-cols-2 gap-2 mt-6">
            {[
              { icon: WorkflowIcon, label: "Logic Chains" },
              { icon: BotIcon, label: "Neural Compute" },
              { icon: GlobeIcon, label: "Remote Hooks" },
              { icon: MailIcon, label: "Protocol Alerts" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border border-zinc-800 bg-zinc-900/50 hover:border-[#FF6B00]/50 transition-colors group">
                <item.icon className="size-3 text-zinc-500 group-hover:text-[#FF6B00]" />
                <span className="text-[9px] uppercase tracking-[2px] font-black text-zinc-300">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Auth & Credentials",
      description: "Secure handshake with external providers",
      icon: KeyIcon,
      content: (
        <div className="space-y-4">
          <div className="bg-[#FF6B00]/5 p-5 border border-[#FF6B00]/20">
            <p className="text-[10px] font-black text-[#FF6B00] mb-3 uppercase tracking-widest italic flex items-center gap-2">
              <TerminalIcon className="size-3" /> System Requirements:
            </p>
            <ol className="space-y-3 text-[10px] text-zinc-300 font-bold uppercase tracking-wider">
              <li className="flex items-start gap-3">
                <span className="text-[#FF6B00]">01</span>
                <span>Access <span className="text-white border-b border-zinc-700">Credentials</span> via sidebar</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FF6B00]">02</span>
                <span>Inject <span className="bg-zinc-800 px-1 text-zinc-100">Provider Keys</span> (OpenAI/Anthropic)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FF6B00]">03</span>
                <span>Verify encrypted uplink status</span>
              </li>
            </ol>
          </div>
          <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black flex items-center gap-2">
             AES-256 Encryption Active
          </p>
        </div>
      )
    },
    {
      title: "Ritual Construction",
      description: "Assembling multi-node logic trees",
      icon: WorkflowIcon,
      content: (
        <div className="space-y-2">
          {[
            { t: "Trigger Node", d: "Manual, Webhook, or Chronos-Schedule" },
            { t: "Compute Layer", d: "Process via GPT-4o or Claude 3.5" },
            { t: "Action Protocol", d: "Dispatch via SMTP, Slack, or Webhook" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 border border-zinc-800 bg-zinc-900/20">
              <div className="size-7 border border-zinc-700 flex items-center justify-center text-[11px] font-black text-zinc-400 italic bg-zinc-800/50">
                {i + 1}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-100">{item.t}</p>
                <p className="text-[9px] text-zinc-500 uppercase tracking-tight">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Telemetry & Logs",
      description: "Real-time execution monitoring",
      icon: HistoryIcon,
      content: (
        <div className="space-y-4">
          <div className="bg-black p-5 border border-zinc-800 shadow-inner">
            <pre className="text-[10px] text-[#FF6B00] font-mono leading-relaxed overflow-hidden">
{`[SYS] Initializing ritual_09...
[AI] Running Neural Inference...
[OK] Dispatching SMTP Packet
[OK] 200/SUCCESS (2.4s)
[IDLE] Awaiting next trigger...`}
            </pre>
          </div>
          <div className="flex items-center gap-3 text-[9px] text-zinc-500 uppercase tracking-[2px] font-black">
            <ZapIcon className="size-3 text-[#FF6B00]" />
            Monitor via <span className="text-zinc-200">Execution Archives</span>
          </div>
        </div>
      )
    }
  ];

  const currentStep = steps[step];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            className="w-full max-w-lg bg-[#09090B] border border-[#27272A] relative overflow-hidden shadow-[0_0_50px_-12px_rgba(255,107,0,0.3)]"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
          >
            {/* Top Accent Scanline */}
            <div className="h-1 bg-[#FF6B00] w-full shadow-[0_0_15px_rgba(255,107,0,0.5)]" />
            
            <div className="p-10">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-5">
                  <div className="size-14 border border-[#FF6B00] flex items-center justify-center bg-[#FF6B00]/5 shadow-[0_0_15px_rgba(255,107,0,0.1)]">
                    <currentStep.icon className="size-6 text-[#FF6B00]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-[3px] italic text-zinc-100">
                      {currentStep.title}
                    </h2>
                    <p className="text-[10px] uppercase tracking-[2px] text-zinc-500 font-bold mt-1">
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
                  className="text-zinc-600 hover:text-[#FF6B00] transition-colors"
                >
                  <XIcon className="size-5" />
                </button>
              </div>

              {/* Technical Progress Indicator */}
              <div className="flex gap-2 mb-10">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 flex-1 transition-all duration-500",
                      i <= step ? "bg-[#FF6B00] shadow-[0_0_8px_rgba(255,107,0,0.4)]" : "bg-zinc-800"
                    )}
                  />
                ))}
              </div>

              {/* Main Content Area */}
              <div className="min-h-[220px]">
                {currentStep.content}
              </div>

              {/* Bottom Control Bar */}
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-zinc-900">
                <div className="text-[9px] font-black uppercase tracking-[3px] text-zinc-600">
                  Step {step + 1} <span className="mx-2 text-zinc-800">|</span> 0{steps.length}
                </div>
                <div className="flex gap-4">
                  {step < steps.length - 1 ? (
                    <Button
                      onClick={() => setStep(step + 1)}
                      className="bg-[#FF6B00] text-black hover:bg-[#FF8533] rounded-none px-8 h-12 text-[10px] uppercase tracking-[2px] font-black group"
                    >
                      Advance Phase
                      <ArrowRightIcon className="ml-2 size-3 transition-transform group-hover:translate-x-1" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setIsOpen(false);
                        setHasSeenWelcome(true);
                        onComplete?.();
                      }}
                      className="bg-[#FF6B00] text-black hover:bg-[#FF8533] rounded-none px-10 h-12 text-[10px] uppercase tracking-[2px] font-black shadow-[0_0_20px_rgba(255,107,0,0.2)]"
                    >
                      Commence Operations
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