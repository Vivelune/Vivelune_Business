"use client"

import { NodeSelector } from "@/components/node-selector"
import { Button } from "@/components/ui/button"
import { PlusIcon, Terminal, Activity, Cpu, Box } from "lucide-react"
import { memo, useState } from "react"
import { cn } from "@/lib/utils"

interface AddNodeButtonProps {
  /** * nodeCount should be passed from your workflow state (e.g., nodes.length)
   */
  nodeCount: number;
}

/**
 * AddNodeButton: THE INITIALIZER
 * Revamped for the Vivelune Industrial aesthetic.
 * Strictly visible only when the workflow is empty.
 */
export const AddNodeButton = memo(({ nodeCount }: AddNodeButtonProps) => {
  const [selectorOpen, setSelectorOpen] = useState(false);

  // LOGIC: Disappear if system already has established nodes
  if (nodeCount > 0) return null;

  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-in fade-in zoom-in duration-700">
        
        {/* Top visual bus line */}
        <div className="h-20 w-[1px] bg-gradient-to-b from-transparent via-zinc-800 to-zinc-700" />

        <div className="relative group">
          {/* Chassis boundary */}
          <div className="absolute -inset-8 border border-zinc-900 pointer-events-none group-hover:border-zinc-800 transition-colors" />
          
          {/* Status Telemetry */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
            
            <div className="flex gap-1">
               <div className="size-1 bg-[#FF6B00] animate-pulse" />
               <div className="size-1 bg-zinc-800" />
               <div className="size-1 bg-zinc-800" />
            </div>
          </div>

          {/* Main Initializer Button */}
          <Button
            onClick={() => setSelectorOpen(true)}
            className={cn(
              "relative size-24 rounded-none bg-black border-2 border-zinc-800",
              "text-zinc-500 hover:text-[#FF6B00] hover:border-[#FF6B00]",
              "transition-all duration-300 shadow-[0_0_50px_rgba(0,0,0,0.8)]",
              "flex flex-col items-center justify-center gap-2 group",
              selectorOpen && "scale-95 opacity-50"
            )}
            size="icon"
          >
            {/* Hard Corner Accents */}
            <div className="absolute top-0 left-0 size-3 border-t-2 border-l-2 border-zinc-700 group-hover:border-[#FF6B00]" />
            <div className="absolute bottom-0 right-0 size-3 border-b-2 border-r-2 border-zinc-700 group-hover:border-[#FF6B00]" />

            <PlusIcon className={cn(
              "size-8 transition-transform duration-500 ease-out",
              selectorOpen ? "rotate-180" : "group-hover:rotate-90"
            )} />
            
            <span className="text-[9px] font-black uppercase tracking-widest italic">
              Init_Seq
            </span>
          </Button>

          {/* Quick-Start Specs (Right Side) */}
          <div className="absolute left-full ml-10 top-1/2 -translate-y-1/2 hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
            <div className="w-56 bg-zinc-950 border border-zinc-800 p-4 relative overflow-hidden">
               {/* Background detail */}
              <Box className="absolute -right-4 -bottom-4 size-20 text-zinc-900/50 -rotate-12" />
              
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                  <Cpu className="size-3 text-[#FF6B00]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-200">System_Uplink</span>
                </div>
                <p className="text-[8px] font-bold text-zinc-500 uppercase leading-relaxed tracking-wider">
                  Select a trigger node to begin data flow construction. 
                  All nodes are end-to-end encrypted.
                </p>
                <div className="flex items-center gap-2 pt-1">
                    <Activity className="size-3 text-emerald-500" />
                    <span className="text-[7px] font-black text-emerald-500 uppercase">Ready_For_Deployment</span>
                </div>
              </div>
            </div>
            {/* Tech line connector */}
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-10 h-[1px] bg-zinc-800" />
          </div>

          {/* Keyboard Shortcut Hint (Bottom) */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex items-center gap-2 text-zinc-700">
                <Terminal className="size-3" />
                <kbd className="text-[9px] font-mono font-bold tracking-tighter">CMD + N</kbd>
            </div>
          </div>
        </div>

        {/* Bottom visual bus line */}
        <div className="h-32 w-[1px] bg-gradient-to-t from-transparent via-zinc-800 to-zinc-700" />
      </div>
    </NodeSelector>
  )
})

AddNodeButton.displayName = "AddNodeButton"