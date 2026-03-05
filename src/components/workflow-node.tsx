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
                    className="flex gap-x-1 bg-card border border-border shadow-xl p-1"
                    offset={10}
                >
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={onSettings}
                        className="size-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-none"
                    >
                        <SettingsIcon className="size-3.5" />
                    </Button>
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={onDelete}
                        className="size-8 text-muted-foreground hover:bg-destructive/20 hover:text-destructive rounded-none"
                    >
                        <TrashIcon className="size-3.5" />
                    </Button>
                </NodeToolbar>
            )}

            {/* The actual node content */}
            <div className="relative group transition-all">
                {children}
            </div>

            {name && (
                <NodeToolbar
                    position={Position.Bottom}
                    isVisible
                    className="flex flex-col items-center min-w-[140px] max-w-[220px] bg-popover border border-border px-3 py-2 shadow-sm translate-y-2"
                >
                    <div className="flex items-center gap-2 mb-0.5">
                        <div className="size-1 bg-primary rounded-full" />
                        <p className="text-[10px] font-bold uppercase tracking-[2.5px] text-foreground leading-none">
                            {name}
                        </p>
                    </div>
                    
                    {description && (
                        <p className="text-[10px] text-muted-foreground italic font-light truncate w-full text-center px-1">
                            {description}
                        </p>
                    )}

                    {/* Decorative line */}
                    <div className="absolute -top-px left-2 right-2 h-px bg-border" />
                </NodeToolbar>
            )}
        </>
    )
};