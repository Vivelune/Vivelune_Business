"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSuspenseWorkflow, useUpdateWorkflow, useUpdateWorkflowName } from "@/features/workflows/hooks/use-workflows"
import { useAtomValue } from "jotai"
import { SaveIcon, Loader2Icon } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { editorAtom } from "../store/atoms"
import { cn } from "@/lib/utils"

export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
    const editor = useAtomValue(editorAtom);
    const saveWorkflow = useUpdateWorkflow();

    const handleSave = () => {
        if (!editor) return;

        const nodes = editor.getNodes();
        const edges = editor.getEdges();

        saveWorkflow.mutate({
            id: workflowId,
            nodes,
            edges,
        })
    }

    return (
        <div className="ml-auto">
            <Button 
                size="sm" 
                onClick={handleSave} 
                disabled={saveWorkflow.isPending}
                className="bg-[#1C1C1C] text-[#E7E1D8] hover:bg-[#333] rounded-none px-6 h-9 uppercase text-[10px] tracking-[2px] font-bold transition-all border border-[#1C1C1C]"
            >
                {saveWorkflow.isPending ? (
                    <Loader2Icon className="size-3.5 animate-spin" />
                ) : (
                    <SaveIcon className="size-3.5 mr-2" />
                )}
                {saveWorkflow.isPending ? "Archiving..." : "Save Changes"}
            </Button>
        </div>
    )
}

export const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId);
    const updateWorkflow = useUpdateWorkflowName()

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(workflow.name)
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (workflow.name) setName(workflow.name)
    }, [workflow.name]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing])

    const handleSave = async () => {
        if (name === workflow.name) {
            setIsEditing(false);
            return;
        }
        try {
            await updateWorkflow.mutateAsync({ id: workflowId, name });
        } catch {
            setName(workflow.name);
        } finally {
            setIsEditing(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSave();
        else if (e.key === "Escape") {
            setName(workflow.name);
            setIsEditing(false);
        }
    }

    if (isEditing) {
        return (
            <Input
                disabled={updateWorkflow.isPending}
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="h-8 w-auto min-w-[150px] bg-white border-[#DCD5CB] rounded-none text-xs focus-visible:ring-1 focus-visible:ring-[#1C1C1C]"
            />
        )
    }

    return (
        <BreadcrumbItem
            onClick={() => setIsEditing(true)}
            className="cursor-pointer group"
        >
            <span className="text-[12px] font-medium tracking-tight text-[#1C1C1C] border-b border-transparent group-hover:border-[#1C1C1C] transition-all pb-0.5 italic">
                {workflow.name}
            </span>
        </BreadcrumbItem>
    )
}

export const EditorBreadcrumbs = ({ workflowId }: { workflowId: string }) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild className="text-[10px] uppercase tracking-[3px] font-bold text-[#8E8E8E] hover:text-[#1C1C1C] transition-colors">
                        <Link prefetch href="/workflows">
                            Workflows
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-[#DCD5CB]">
                    <span className="text-[10px]">/</span>
                </BreadcrumbSeparator>
                <EditorNameInput workflowId={workflowId} />
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export const EditorHeader = ({ workflowId }: { workflowId: string }) => {
    return (
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-[#DCD5CB] px-6 bg-[#F4F1EE]">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="text-[#1C1C1C] hover:bg-[#E7E1D8] rounded-none transition-colors" />
                <div className="h-6 w-[1px] bg-[#DCD5CB]" />
            </div>
            <div className="flex flex-row items-center justify-between gap-x-4 w-full">
                <EditorBreadcrumbs workflowId={workflowId} />
                <div className="flex items-center gap-4">
                    <span className="hidden md:block text-[9px] uppercase tracking-[2px] text-[#8E8E8E] font-medium">
                        Ritual Mode
                    </span>
                    <EditorSaveButton workflowId={workflowId} />
                </div>
            </div>
        </header>
    )
}