'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

import { format } from 'date-fns';
import {
  CreditCard,
  Download,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Calendar,
  FileText,
  Rocket,
  Terminal,
  Activity,
} from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useBillingPortal, useCancelSubscription, useInvoices, useSubscription } from '../use-billing';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function BillingPage() {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const { data: subData, isLoading: subLoading } = useSubscription();
  const { data: invData } = useInvoices();
  const portalMutation = useBillingPortal();
  const cancelMutation = useCancelSubscription();

  const subscription = subData?.subscription;
  const invoices = invData?.invoices || [];

  const getStatusBadge = (status: string) => {
    const base = "rounded-none px-3 py-1 text-[10px] font-black uppercase tracking-widest";
    if (status === 'active') {
      return (
        <Badge className={cn(base, "bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/30 shadow-[0_0_10px_rgba(255,107,0,0.1)]")}>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-[#FF6B00] animate-pulse" />
            Operational
          </span>
        </Badge>
      );
    }
    return <Badge variant="outline" className={cn(base, "border-zinc-800 text-zinc-500")}>{status}</Badge>;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  // Redesign: The "Free Tier" as an "Uninitialized Slot"
  if (!subscription && !subLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] text-zinc-100 p-8 selection:bg-[#FF6B00]/30">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12 flex items-center gap-4">
            <div className="h-10 w-1 bg-[#FF6B00]" />
            <div>
              <h1 className="text-2xl font-black uppercase tracking-[4px] italic">Fiscal_Module</h1>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[2px]">System Resource Management</p>
            </div>
          </header>

          <Card className="rounded-none border-2 border-zinc-800 bg-black/40 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Terminal className="w-32 h-32" />
            </div>

            <CardHeader className="border-b border-zinc-800 pb-8 bg-zinc-900/20">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 border border-[#FF6B00] bg-[#FF6B00]/5 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,107,0,0.1)]">
                  <Activity className="w-8 h-8 text-[#FF6B00]" />
                </div>
                <CardTitle className="text-3xl font-black uppercase tracking-[6px] italic">Standard_Core</CardTitle>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-2">Current Operating Status: Restricted</p>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[3px] text-[#FF6B00]">Allocated_Resources</h3>
                  <ul className="space-y-3">
                    {["5 Active Workflows", "100 Monthly Executions", "Core Integrations"].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-[11px] font-bold uppercase text-zinc-400">
                        <div className="size-1 bg-[#FF6B00]" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-zinc-800 p-6 bg-zinc-900/10">
                  <h3 className="text-[11px] font-black uppercase tracking-[2px] mb-2 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-[#FF6B00]" />
                    Elevate_Tier
                  </h3>
                  <p className="text-[10px] text-zinc-500 leading-relaxed uppercase font-bold tracking-tight mb-6">
                    Unlock full system throughput, unlimited workflow slots, and priority execution kernels.
                  </p>
                  <Button 
                    onClick={() => {}} // handleUpgrade logic
                    className="w-full rounded-none bg-[#FF6B00] hover:bg-[#FF8533] text-black font-black uppercase text-[10px] tracking-[2px] h-12"
                  >
                    Initialize Pro_Kernel
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 py-4 border-t border-zinc-800/50">
                <div className="flex items-center gap-2 grayscale opacity-50">
                   <ShieldCheck className="w-4 h-4" />
                   <span className="text-[8px] font-bold uppercase tracking-widest">Stripe_Verified_Node</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Active state: Simplified and "Flat"
  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-end border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-[4px] italic">System_Billing</h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[2px]">ID: VLV-77-ALPHA</p>
          </div>
          <Button
            onClick={() => portalMutation.mutate()}
            variant="outline"
            className="rounded-none border-zinc-800 bg-transparent hover:bg-[#FF6B00]/10 hover:text-[#FF6B00] hover:border-[#FF6B00] text-[10px] font-black uppercase tracking-widest h-10"
          >
            Terminal_Portal
          </Button>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Plan View */}
          <Card className="lg:col-span-2 rounded-none border border-zinc-800 bg-zinc-900/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6B00]" />
            <CardHeader className="border-b border-zinc-800/50">
              <div className="flex justify-between items-center">
                 <CardTitle className="text-sm font-black uppercase tracking-[3px]">Tier_Status</CardTitle>
                 {getStatusBadge(subscription?.status || 'active')}
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
                <div className="flex items-baseline gap-4">
                    <span className="text-5xl font-black italic">{formatCurrency(subscription?.plan.amount || 0, 'usd')}</span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[2px]">/ Cycle</span>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        <span>Cycle_Progress</span>
                        <span className="text-[#FF6B00]">22 Days Remaining</span>
                    </div>
                    <Progress value={60} className="h-1 rounded-none bg-zinc-800 [&>div]:bg-[#FF6B00]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="border border-zinc-800 p-4 bg-black/20">
                        <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">Payment_Module</p>
                        <p className="text-[11px] font-bold tracking-widest uppercase italic">VISA **** 4242</p>
                    </div>
                    <div className="border border-zinc-800 p-4 bg-black/20">
                        <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">Next_Sync</p>
                        <p className="text-[11px] font-bold tracking-widest uppercase italic">OCT 24, 2026</p>
                    </div>
                </div>
            </CardContent>
          </Card>

          {/* Sidebar: Invoices */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[3px] text-zinc-500 border-b border-zinc-800 pb-2">Log_History</h3>
            <div className="space-y-2">
                {invoices.slice(0, 5).map(inv => (
                    <div key={inv.id} className="p-3 border border-zinc-800 hover:border-zinc-600 transition-colors bg-black/20 flex items-center justify-between group">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-tighter">INV-#{inv.number}</p>
                            <p className="text-[8px] text-zinc-500 font-bold uppercase">{format(new Date(inv.date), 'MM.dd.yy')}</p>
                        </div>
                        <a href={inv.pdf} className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Download className="w-3 h-3 text-[#FF6B00]" />
                        </a>
                    </div>
                ))}
            </div>
            <Button variant="ghost" className="w-full text-[8px] font-black uppercase tracking-[4px] text-zinc-600 hover:text-[#FF6B00]">
                View_All_Archives
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}