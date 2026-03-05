"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { 
  MousePointerIcon, 
  Activity, 
  Terminal, 
  Cpu, 
  ShieldCheck,
  CircleDot
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManualTriggerDialog = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] w-[95vw] p-0 flex flex-col border-zinc-800 bg-zinc-950 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-zinc-800/50 bg-zinc-950 shrink-0">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shadow-lg shadow-orange-500/5">
              <MousePointerIcon className="size-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-sm font-black uppercase tracking-tight text-zinc-100 flex items-center gap-2">
                Manual_Command_Node
                <Badge variant="outline" className="text-[9px] border-orange-500/30 text-orange-400 bg-orange-500/5 py-0">INPUT_V1</Badge>
              </DialogTitle>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="size-3 text-orange-500" /> Standby_Mode
                </span>
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-6 space-y-8">
            
            {/* PROTOCOL INFO */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-1.5 rounded-full bg-orange-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[2px] text-zinc-400">Node_Description</h3>
              </div>
              
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                <p className="text-[11px] text-zinc-300 leading-relaxed font-medium">
                  This node acts as the entry point for ad-hoc executions. When you trigger a run from the Dashboard, this node initializes the sequence.
                </p>
                <div className="flex items-center gap-4 pt-2 border-t border-zinc-800/50">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3 text-emerald-500" />
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">Auth_Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Cpu className="size-3 text-blue-500" />
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">Zero_Latency</span>
                  </div>
                </div>
              </div>
            </section>

            {/* STATUS LOG */}
            <section className="space-y-4 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-1.5 rounded-full bg-orange-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[2px] text-zinc-400">Deployment_Status</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-black border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <CircleDot className="size-2 text-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-zinc-400">Runtime_Engine</span>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black uppercase">Active</Badge>
                </div>
                
                <div className="flex items-center gap-2 px-2">
                  <Terminal className="size-3 text-zinc-600" />
                  <p className="text-[10px] text-zinc-500 font-medium italic">
                    Ready for manual payload injection.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};