"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSuspenseWorkflow, useUpdateWorkflow, useUpdateWorkflowName } from "@/features/workflows/hooks/use-workflows"
import { useAtomValue } from "jotai"
import { SaveIcon, Loader2Icon, Edit2Icon, CheckCircle2, XCircle, Activity, Terminal, Cpu } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { editorAtom } from "../store/atoms"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

/**
 * EditorSaveButton: The Manual Override
 */
export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
    const editor = useAtomValue(editorAtom);
    const saveWorkflow = useUpdateWorkflow();
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const handleSave = () => {
        if (!editor) return;
        const nodes = editor.getNodes();
        const edges = editor.getEdges();

        saveWorkflow.mutate({ id: workflowId, nodes, edges }, {
            onSuccess: () => setLastSaved(new Date())
        });
    }

    return (
        <div className="flex items-center gap-4">
            {lastSaved && (
                <div className="hidden lg:flex items-center gap-2 px-3 border-l border-zinc-800">
                    <div className="size-1 bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">
                        Last_Sync::{lastSaved.toLocaleTimeString()}
                    </span>
                </div>
            )}
            
            <Button
                size="sm"
                onClick={handleSave}
                disabled={saveWorkflow.isPending}
                className={cn(
                    "rounded-none bg-[#FF6B00] hover:bg-[#FF8533] text-black font-black uppercase text-[10px] tracking-widest h-8 px-6 transition-all",
                    saveWorkflow.isPending && "opacity-50"
                )}
            >
                {saveWorkflow.isPending ? (
                    <Loader2Icon className="size-3.5 animate-spin mr-2" />
                ) : (
                    <SaveIcon className="size-3.5 mr-2" />
                )}
                Commit_Changes
            </Button>
        </div>
    )
}

/**
 * EditorNameInput: Direct Database Entry
 */
export const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId);
    const updateWorkflow = useUpdateWorkflowName()
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(workflow.name)
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { if (workflow.name) setName(workflow.name) }, [workflow.name]);
    useEffect(() => { if (isEditing && inputRef.current) inputRef.current.focus(); }, [isEditing])

    const handleSave = async () => {
        if (name === workflow.name) return setIsEditing(false);
        try {
            await updateWorkflow.mutateAsync({ id: workflowId, name });
            setIsEditing(false);
        } catch {
            setName(workflow.name);
            setIsEditing(false);
        }
    }

    if (isEditing) {
        return (
            <div className="flex items-center gap-1">
                <Input
                    ref={inputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => e.key === "Enter" ? handleSave() : e.key === "Escape" && setIsEditing(false)}
                    className="h-7 w-auto min-w-[240px] bg-black border-zinc-700 rounded-none text-[11px] font-black uppercase tracking-widest text-[#FF6B00] focus-visible:ring-0"
                />
            </div>
        )
    }

    return (
        <div className="flex items-center gap-3 group">
            <div 
                onClick={() => setIsEditing(true)}
                className="cursor-pointer flex items-center gap-2"
            >
                <span className="text-[11px] font-black uppercase tracking-[2px] text-zinc-100 italic group-hover:text-[#FF6B00] transition-colors">
                    {workflow.name}
                </span>
                <Edit2Icon className="w-3 h-3 text-zinc-700 group-hover:text-zinc-400" />
            </div>
            
            <Badge className="rounded-none bg-zinc-900 border-zinc-800 text-[8px] font-black text-emerald-500 uppercase h-5">
                <Activity className="w-2.5 h-2.5 mr-1" />
                Active_Link
            </Badge>
        </div>
    )
}

/**
 * EditorHeader: The System Command Bar
 */
export const EditorHeader = ({ workflowId }: { workflowId: string }) => {
    return (
        <header className="sticky top-0 z-50 h-14 bg-[#09090B] border-b border-zinc-900 px-4 flex items-center justify-between">
            {/* Left: System Navigation */}
            <div className="flex items-center gap-4">
                <SidebarTrigger className="rounded-none hover:bg-zinc-900 text-zinc-500 hover:text-[#FF6B00] transition-colors" />
                <div className="h-4 w-[1px] bg-zinc-800" />
                
                <Breadcrumb>
                    <BreadcrumbList className="gap-2">
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/workflows" className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-400">
                                    Archive
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-zinc-800">/</BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <EditorNameInput workflowId={workflowId} />
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Right: Telemetry & Controls */}
            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center gap-2 text-zinc-700">
                        <Terminal className="size-3" />
                        <span className="text-[8px] font-black uppercase tracking-[2px]">Terminal_01</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-zinc-950 border border-zinc-900">
                        <Cpu className="size-3 text-[#FF6B00]" />
                        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">
                            Edit_Mode
                        </span>
                    </div>
                </div>
                
                <EditorSaveButton workflowId={workflowId} />
            </div>
        </header>
    )
}