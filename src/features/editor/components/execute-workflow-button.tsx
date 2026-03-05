"use client"

import { Button } from "@/components/ui/button"
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows"
import { Loader2Icon, ZapIcon, Activity, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export const ExecuteWorkflowButton = ({
    workflowId
}: {
    workflowId: string
}) => {
    const executeWorkflow = useExecuteWorkflow()
    
    const handleExecute = () => {
        executeWorkflow.mutate({
            id: workflowId,
        })
    }

    return (
        <TooltipProvider>
            <div className="relative group">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            size="sm" 
                            onClick={handleExecute} 
                            disabled={executeWorkflow.isPending}
                            className={cn(
                                "relative h-8 px-4 rounded-none bg-black border border-emerald-900/50 text-emerald-500",
                                "hover:bg-emerald-500 hover:text-black hover:border-emerald-500",
                                "transition-all duration-300",
                                "disabled:opacity-40 disabled:grayscale disabled:pointer-events-none",
                                "flex items-center gap-2 overflow-hidden",
                                executeWorkflow.isPending && "cursor-wait"
                            )}
                        >
                            {/* Scanning line effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent -translate-y-full group-hover:animate-[scan_2s_linear_infinite] pointer-events-none" />

                            {executeWorkflow.isPending ? (
                                <Loader2Icon className="size-3 animate-spin" />
                            ) : (
                                <Play className="size-3 fill-current" />
                            )}

                            <span className="text-[10px] font-black uppercase tracking-[2px]">
                                {executeWorkflow.isPending ? "Running_Task" : "Ignite_Flow"}
                            </span>

                            {/* Status Dot */}
                            {!executeWorkflow.isPending && (
                                <div className="ml-1 size-1 bg-emerald-500 rounded-full animate-pulse" />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent 
                        side="top" 
                        className="rounded-none border-zinc-800 bg-black text-[8px] font-black uppercase tracking-widest text-zinc-400"
                    >
                        <p>Manual_Override_Execute</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    )
}