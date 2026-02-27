"use client"

import { Button } from "@/components/ui/button"
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows"
import { FlaskConicalIcon, Loader2Icon, ZapIcon } from "lucide-react"
import { cn } from "@/lib/utils"

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
        <div className="relative group">
            {/* Decorative background glow for high-importance action */}
            <div className="absolute -inset-1 bg-[#1C1C1C]/5 blur-md group-hover:bg-[#1C1C1C]/10 transition-all opacity-0 group-hover:opacity-100" />
            
            <Button 
                size="lg" 
                onClick={handleExecute} 
                disabled={executeWorkflow.isPending}
                className={cn(
                    "relative h-14 px-10 rounded-none overflow-hidden transition-all duration-300",
                    "bg-[#1C1C1C] text-[#E7E1D8] hover:bg-[#333] border border-[#1C1C1C]",
                    "disabled:bg-[#8E8E8E] disabled:border-[#8E8E8E] shadow-2xl",
                    "flex items-center gap-4"
                )}
            >
                {/* Visual feedback for loading state */}
                {executeWorkflow.isPending ? (
                    <Loader2Icon className="size-4 animate-spin text-[#E7E1D8]" />
                ) : (
                    <ZapIcon className="size-4 text-[#E7E1D8] group-hover:scale-110 transition-transform" />
                )}

                <span className="text-[11px] font-bold uppercase tracking-[4px]">
                    {executeWorkflow.isPending ? "Activating Ritual..." : "Execute Ritual"}
                </span>

                {/* Subtle corner detail to match the 'Blueprint' look */}
                <div className="absolute top-0 right-0 p-[2px]">
                    <div className="size-1 bg-[#E7E1D8]/20" />
                </div>
            </Button>
            
            {/* Technical Subtext */}
            <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full text-center text-[9px] uppercase tracking-[1px] font-medium text-[#8E8E8E] opacity-0 group-hover:opacity-100 transition-opacity">
                Process will initiate across all nodes
            </p>
        </div>
    )
}