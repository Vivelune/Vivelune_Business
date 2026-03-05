"use client"

import { PlusIcon } from "lucide-react"
import { PlaceholderNode } from "./react-flow/placeholder-node"
import { memo, useState } from "react"
import { NodeProps, useNodes } from "@xyflow/react"
import { WorkflowNode } from "./workflow-node"
import { NodeSelector } from "./node-selector"
import { cn } from "@/lib/utils"

/**
 * InitialNode: THE SEED
 * This node represents the "Zero State" of the canvas.
 * It strictly renders only when the node array contains only itself.
 */
export const InitialNode = memo((props: NodeProps) => {
    const [selectorOpen, setSelectorOpen] = useState(false)
    
    // Hook into the React Flow state to count active nodes
    const nodes = useNodes();
    
    /** * LOGIC: If there is more than 1 node, it means a real node 
     * (Trigger/Action) has been added. The Initializer is no longer required.
     */
    if (nodes.length > 1) return null;

    return (
        <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
            <WorkflowNode showToolbar={false} >
                <PlaceholderNode 
                    {...props}
                    onClick={() => setSelectorOpen(true)}
                    className={cn(
                        "group relative size-24 flex items-center justify-center transition-all duration-500",
                        "bg-[#050505] border-2 border-dashed border-zinc-900",
                        "hover:border-[#FF6B00] hover:bg-black",
                        "rounded-none cursor-pointer overflow-hidden",
                        "animate-in fade-in zoom-in duration-1000"
                    )}
                >
                    {/* Industrial Texture */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:8px_8px]" />

                    {/* Security Brackets */}
                    <div className="absolute top-0 left-0 size-3 border-t-2 border-l-2 border-zinc-800 group-hover:border-[#FF6B00] transition-colors" />
                    <div className="absolute bottom-0 right-0 size-3 border-b-2 border-r-2 border-zinc-800 group-hover:border-[#FF6B00] transition-colors" />

                    <div className="flex flex-col items-center gap-3">
                        <div className="relative flex items-center justify-center">
                            <PlusIcon className="size-6 text-zinc-700 group-hover:text-[#FF6B00] group-hover:rotate-90 transition-all duration-500 z-10" />
                            <div className="absolute size-10 bg-[#FF6B00]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        
                        <div className="flex flex-col items-center">
                            <span className="text-[3px] font-black uppercase tracking-[3px] text-zinc-600 group-hover:text-zinc-200 transition-colors">
                                Start_Sequence
                            </span>
                            <span className="text-[4px] font-bold text-zinc-800 uppercase tracking-widest mt-1">
                                [ Manual_Input_Required ]
                            </span>
                        </div>
                    </div>

                    {/* Telemetry Ticker */}
                    <div className="absolute top-2 right-3 flex items-center gap-2">
                         <div className="flex flex-col items-end">
                            <span className="text-[5px] font-black text-zinc-800 uppercase leading-none">Status</span>
                            <span className="text-[6px] font-black text-zinc-700 group-hover:text-[#FF6B00] uppercase tracking-tighter">Ready</span>
                         </div>
                         <div className="size-1.5 bg-zinc-900 group-hover:bg-[#FF6B00] group-hover:shadow-[0_0_8px_#FF6B00] transition-all" />
                    </div>

                    {/* Bottom Data Strip */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-950 group-hover:bg-[#FF6B00]/20 transition-colors" />
                </PlaceholderNode>
            </WorkflowNode>
        </NodeSelector>
    )
})

InitialNode.displayName = "InitialNode";