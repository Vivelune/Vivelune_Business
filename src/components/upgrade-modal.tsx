"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usePrice } from "@/hooks/use-price";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  features?: string[];
  priceId?: string;
}

export const UpgradeModal = ({
  open,
  onOpenChange,
  title = "Ascend to Vivelune Pro",
  description = "Industrial-grade automation for high-stakes workflows.",
  features = [
    "Unlimited automated rituals",
    "Full AI Suite (Claude, GPT-4o, Gemini 1.5 Pro)",
    "Extended execution archives",
    "Concierge technical support",
    "Priority studio access",
  ],
  priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
}: UpgradeModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: priceData, isLoading: isLoadingPrice } = usePrice(priceId);
  const price = priceData?.price;

  const handleUpgrade = async () => {
    if (!priceId) {
      toast.error('Configuration Error: Missing Price ID');
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      toast.error('System Link Failure: Unable to connect to Stripe');
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#09090B] border border-[#27272A] rounded-none p-0 overflow-hidden shadow-[0_0_50px_-12px_rgba(255,107,0,0.2)]">
        {/* Top Accent Bar */}
        <div className="h-1 w-full bg-[#FF6B00] shadow-[0_0_15px_rgba(255,107,0,0.5)]" />
        
        <div className="p-8">
          <DialogHeader className="items-center">
            <div className="flex items-center justify-center size-12 border border-[#FF6B00] bg-[#FF6B00]/5 mb-6 group">
              <Zap className="h-5 w-5 text-[#FF6B00] fill-[#FF6B00]/20 transition-transform group-hover:scale-110" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-zinc-100 uppercase italic">
              {title}
            </DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium text-sm mt-2 max-w-[280px] text-center">
              {description}
            </DialogDescription>
          </DialogHeader>

          {/* Feature Grid */}
          <div className="mt-8 space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 py-2 px-3 border border-zinc-800/50 bg-zinc-900/30 hover:border-zinc-700 transition-colors">
                <div className="size-1.5 bg-[#FF6B00] rounded-full shadow-[0_0_8px_rgba(255,107,0,0.6)]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Section */}
          <div className="mt-8 mb-8 pt-6 border-t border-zinc-800 text-center">
             <div className="inline-block px-2 py-1 bg-[#FF6B00]/10 border border-[#FF6B00]/20 mb-3">
                <span className="text-[9px] uppercase tracking-[3px] font-black text-[#FF6B00]">Standard Operational Rate</span>
             </div>
             <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-black tracking-tighter text-zinc-100">$29</span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">/ Month</span>
             </div>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handleUpgrade} 
              disabled={isLoading}
              className="w-full bg-[#FF6B00] text-black hover:bg-[#FF8533] rounded-none h-14 uppercase text-xs tracking-[2px] font-black transition-all group flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin size-5" />
              ) : (
                <>
                  Initialize Pro Protocol
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
            
            <button
              onClick={() => onOpenChange(false)}
              className="w-full text-[9px] uppercase tracking-[2px] text-zinc-500 hover:text-zinc-200 transition-colors font-bold"
            >
              Cancel Operation
            </button>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-2 py-3 border-t border-zinc-900/50">
            <ShieldCheck className="size-3 text-zinc-600" />
            <span className="text-[8px] uppercase tracking-[1px] font-bold text-zinc-600">Secure Stripe-Layer Encryption</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};