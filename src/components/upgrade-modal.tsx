"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
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
  description = "Expand your studio capabilities with unlimited rituals and premium intelligence.",
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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount / 100);
  };

  const handleUpgrade = async () => {
    if (!priceId) {
      toast.error('Studio configuration missing price ID');
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
    
      if (!response.ok) {
        toast.error(data.error || 'Failed to initialize checkout');
        setIsLoading(false);
        return;
      }
    
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error('Unable to connect to checkout services');
      setIsLoading(false);
    }
  };

  const getPriceDisplay = () => {
    if (isLoadingPrice) {
      return (
        <div className="flex items-center justify-center gap-2 py-2">
          <Loader2 className="h-4 w-4 animate-spin text-[#1C1C1C]" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Querying Stripe...</span>
        </div>
      );
    }

    if (price?.unitAmount && price?.currency) {
      const amount = formatCurrency(price.unitAmount, price.currency);
      const interval = price.recurring?.interval ? `/${price.recurring.interval}` : '';
      
      return (
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[4px] font-black text-[#1C1C1C]/40 mb-1">
            {price.nickname || 'Premium Subscription'}
          </p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-light tracking-tighter text-[#1C1C1C]">{amount}</span>
            <span className="text-xs font-medium text-[#8E8E8E] uppercase tracking-widest">{interval}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[4px] font-black text-[#1C1C1C]/40 mb-1">Pro Access</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-light tracking-tighter text-[#1C1C1C]">$29</span>
          <span className="text-xs font-medium text-[#8E8E8E] uppercase tracking-widest">/mo</span>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#F4F1EE] border-none rounded-none p-0 overflow-hidden shadow-2xl">
        <div className="h-2 bg-[#1C1C1C]" />
        
        <div className="p-8">
          <DialogHeader>
            <div className="mx-auto flex h-14 w-14 items-center justify-center bg-[#1C1C1C] mb-6">
              <Sparkles className="h-6 w-6 text-[#E7E1D8]" />
            </div>
            <DialogTitle className="text-center text-2xl font-medium tracking-tight text-[#1C1C1C]">
              {title}
            </DialogTitle>
            <DialogDescription className="text-center text-[#8E8E8E] font-light mt-2 italic">
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-8">
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  <div className="size-5 flex items-center justify-center border border-[#DCD5CB] group-hover:border-[#1C1C1C] transition-colors">
                    <div className="size-1.5 bg-[#1C1C1C]" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wide text-[#4A4A4A]">{feature}</span>
                </div>
              ))}
            </div>

            <div className="border-y border-[#DCD5CB] py-8 my-4">
              {getPriceDisplay()}
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-3 sm:flex-col">
            <Button 
              onClick={handleUpgrade} 
              className="w-full bg-[#1C1C1C] text-[#E7E1D8] hover:bg-[#333] rounded-none h-12 uppercase text-[11px] tracking-[3px] font-bold transition-all group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <div className="flex items-center">
                  Secure Pro Access
                  <ArrowRight className="ml-2 size-3 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
            
            <button
              onClick={() => onOpenChange(false)}
              className="w-full text-[10px] uppercase tracking-widest text-[#8E8E8E] hover:text-[#1C1C1C] transition-colors font-bold py-2"
            >
              Return to Studio
            </button>
          </DialogFooter>
          
          <div className="mt-6 flex items-center justify-center gap-2 opacity-40">
            <ShieldCheck className="size-3 text-[#1C1C1C]" />
            <span className="text-[9px] uppercase tracking-[1px] font-bold text-[#1C1C1C]">Encrypted via Stripe</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};