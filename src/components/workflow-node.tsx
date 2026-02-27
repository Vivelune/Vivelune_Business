"use client"

import { NodeToolbar, Position } from "@xyflow/react";
import { ReactNode } from "react";
import { Button } from "./ui/button";
import { SettingsIcon, TrashIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowNodeProps {
    children: ReactNode;
    showToolbar?: boolean;
    onDelete?: () => void;
    onSettings?: () => void;
    name?: string;
    description?: string;
};

export function WorkflowNode({
    children,
    showToolbar = true,
    onDelete,
    onSettings,
    name,
    description,
}: WorkflowNodeProps) {
    return (
        <>
            {showToolbar && (
                <NodeToolbar 
                    className="flex gap-x-1 bg-[#1C1C1C] p-1 border border-[#DCD5CB] shadow-xl"
                    offset={10}
                >
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={onSettings}
                        className="size-8 text-[#E7E1D8] hover:bg-[#333] hover:text-white rounded-none"
                    >
                        <SettingsIcon className="size-3.5" />
                    </Button>
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={onDelete}
                        className="size-8 text-[#E7E1D8] hover:bg-red-900/50 hover:text-red-200 rounded-none"
                    >
                        <TrashIcon className="size-3.5" />
                    </Button>
                </NodeToolbar>
            )}

            {/* The actual node content - we wrap it to ensure it feels like a physical object */}
            <div className="relative group transition-all">
                {children}
            </div>

            {name && (
                <NodeToolbar
                    position={Position.Bottom}
                    isVisible
                    className="flex flex-col items-center min-w-[140px] max-w-[220px] bg-[#E7E1D8] border border-[#DCD5CB] px-3 py-2 shadow-sm translate-y-2"
                >
                    <div className="flex items-center gap-2 mb-0.5">
                        <div className="size-1 bg-[#1C1C1C]" />
                        <p className="text-[10px] font-bold uppercase tracking-[2.5px] text-[#1C1C1C] leading-none">
                            {name}
                        </p>
                    </div>
                    
                    {description && (
                        <p className="text-[10px] text-[#8E8E8E] italic font-light truncate w-full text-center px-1">
                            {description}
                        </p>
                    )}

                    {/* Technical "Feet" - purely aesthetic to make it look like a Studio object */}
                    <div className="absolute -top-[1px] left-2 right-2 h-[1px] bg-[#1C1C1C]/10" />
                </NodeToolbar>
            )}
        </>
    )
};