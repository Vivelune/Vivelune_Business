// src/components/upgrade-modal.tsx
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
import { Sparkles, CheckCircle2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  features?: string[];
}

export const UpgradeModal = ({
  open,
  onOpenChange,
  title = "Upgrade to Vivelune Pro",
  description = "Unlock unlimited workflows, all AI models, and premium features.",
  features = [
    "Unlimited workflows",
    "All AI models (OpenAI, Anthropic, Gemini, DeepSeek)",
    "Advanced execution history",
    "Priority support",
    "Team collaboration (coming soon)",
  ],
}: UpgradeModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Starting Stripe checkout with price ID:', process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID);
      
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID 
        }),
      });
    
      const data = await response.json();
    
      if (!response.ok) {
        console.error('❌ Checkout failed:', data);
        toast.error(data.error || data.details || 'Failed to create checkout');
        setIsLoading(false);
        return;
      }
    
      if (data.url) {
        console.log('✅ Redirecting to Stripe checkout URL:', data.url);
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('❌ Checkout error:', error);
      toast.error('Failed to start checkout process');
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">Pro Plan</p>
            <p className="text-2xl font-bold mt-1">
              $29<span className="text-sm font-normal text-muted-foreground">/month</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Cancel anytime. No questions asked.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button 
            onClick={handleUpgrade} 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              "Processing..."
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Upgrade Now
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};