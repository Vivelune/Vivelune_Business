"use client"

import { NodeSelector } from "@/components/node-selector"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { memo, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * AddNodeButton
 * The primary entry point for expanding a ritual.
 * Refined with the sharp Vivelune edges and technical hover states.
 */
export const AddNodeButton = memo(() => {
    const [selectorOpen, setSelectorOpen] = useState(false);

    return (
        <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
            <div className="relative group">
                {/* Visual Label (Technical Subtext) */}
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-[10px] uppercase tracking-[3px] font-bold text-[#1C1C1C] bg-[#E7E1D8] px-2 py-1 border border-[#DCD5CB]">
                        Expand Ritual
                    </span>
                </div>

                <Button 
                    onClick={() => setSelectorOpen(true)}
                    className={cn(
                        "size-12 rounded-none bg-[#1C1C1C] text-[#E7E1D8] border border-[#1C1C1C]",
                        "hover:bg-[#333] hover:text-white transition-all duration-300",
                        "shadow-xl flex items-center justify-center",
                        selectorOpen && "bg-[#333] scale-95"
                    )} 
                    size="icon" 
                    variant="ghost" 
                >
                    <PlusIcon className={cn(
                        "size-5 transition-transform duration-500 ease-out",
                        selectorOpen ? "rotate-45" : "rotate-0"
                    )} />
                    
                    {/* Decorative Corner Detail */}
                    <div className="absolute bottom-0 left-0 p-[1.5px]">
                        <div className="size-1 bg-[#E7E1D8]/20" />
                    </div>
                </Button>
            </div>
        </NodeSelector>
    )
})

AddNodeButton.displayName = "AddNodeButton"