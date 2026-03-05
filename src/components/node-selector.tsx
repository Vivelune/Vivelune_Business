"use client"

import { NodeType } from "@/generated/prisma/enums";
import { createId } from "@paralleldrive/cuid2";
import { GitBranchIcon, GlobeIcon, MailIcon, MousePointerIcon, SparklesIcon, ZapIcon, CpuIcon, BoxIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type NodeTypeOption = {
    type: NodeType;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }> | string;
}

const triggerNodes: NodeTypeOption[] = [
    { type: NodeType.MANUAL_TRIGGER, label: "Manual Activation", description: "Direct operator override.", icon: MousePointerIcon },
    { type: NodeType.GOOGLE_FORM_TRIGGER, label: "Google Form", description: "Capture external data ingress.", icon: "/googleform.svg" },
    { type: NodeType.STRIPE_TRIGGER, label: "Stripe Event", description: "Financial transaction telemetry.", icon: "/stripe.svg" },
    { type: NodeType.CLERK_TRIGGER, label: "Clerk Auth", description: "User lifecycle shifts.", icon: "/clerk.jpeg" },
];

const executionNodes: NodeTypeOption[] = [
    { type: NodeType.CONDITIONAL, label: "Logic Gate", description: "Binary branching based on criteria.", icon: GitBranchIcon },
    { type: NodeType.EMAIL, label: "SMTP Dispatch", description: "Outbound communication protocol.", icon: MailIcon },
    { type: NodeType.HTTP_REQUEST, label: "Webhook/HTTP", description: "External API handshakes.", icon: GlobeIcon },
    { type: NodeType.GEMINI, label: "Gemini Pro", description: "Google neural compute engine.", icon: "/gemini.svg" },
    { type: NodeType.OPENAI, label: "OpenAI GPT-4", description: "Advanced language processing.", icon: "/openaiwhite.svg" },
    { type: NodeType.ANTHROPIC, label: "Claude 3.5", description: "Safe reasoning & analysis.", icon: "/anthropic.svg" },
    // ADDED DEEPSEEK HERE
    { type: NodeType.DEEPSEEK, label: "DeepSeek-V3", description: "High-throughput reasoning core.", icon: "/deepseek.svg" },
    { type: NodeType.DISCORD, label: "Discord Hook", description: "Community uplink notification.", icon: "/discord.svg" },
    { type: NodeType.SLACK, label: "Slack Sync", description: "Workspace status update.", icon: "/slack.svg" },
];
interface NodeSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export function NodeSelector({ open, onOpenChange, children }: NodeSelectorProps) {
    const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

    const handleNodeSelect = useCallback((selection: NodeTypeOption) => {
        if (selection.type === NodeType.MANUAL_TRIGGER) {
            const hasManualTrigger = getNodes().some((node) => node.type === NodeType.MANUAL_TRIGGER);
            if (hasManualTrigger) {
                toast.error("PROTOCOL ERROR: Multiple manual triggers restricted.");
                return;
            }
        }

        const flowPosition = screenToFlowPosition({
            x: window.innerWidth / 2 + (Math.random() - 0.5) * 100,
            y: window.innerHeight / 2 + (Math.random() - 0.5) * 100,
        });

        const newNode = {
            id: createId(),
            data: {},
            position: flowPosition,
            type: selection.type,
        };

        setNodes((nodes) => [...nodes, newNode]);
        onOpenChange(false);
    }, [setNodes, getNodes, onOpenChange, screenToFlowPosition]);

    const NodeItem = ({ nodeType }: { nodeType: NodeTypeOption }) => {
        const Icon = nodeType.icon;
        return (
            <div 
                className="group w-full border-b border-zinc-900 cursor-pointer hover:bg-[#FF6B00]/5 transition-all duration-150 relative overflow-hidden"
                onClick={() => handleNodeSelect(nodeType)}
            >
                {/* Active Hover Indicator */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-transparent group-hover:bg-[#FF6B00] shadow-[0_0_10px_#FF6B00]" />
                
                <div className="flex items-center gap-5 py-5 px-8">
                    <div className="shrink-0 size-10 border border-zinc-800 bg-black flex items-center justify-center group-hover:border-[#FF6B00]/50 transition-colors shadow-inner">
                        {typeof Icon === "string" ? (
                            <img src={Icon} alt={nodeType.label} className="size-5 object-contain grayscale brightness-150 group-hover:grayscale-0 group-hover:brightness-100 transition-all" />
                        ) : (
                            <Icon className="size-5 text-zinc-500 group-hover:text-[#FF6B00]" />
                        )}
                    </div>

                    <div className="flex flex-col text-left">
                        <span className="font-black text-[10px] uppercase tracking-[2px] text-zinc-200 group-hover:text-white">
                            {nodeType.label}
                        </span>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-tight font-bold mt-0.5">
                            {nodeType.description}
                        </span>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md bg-[#09090B] border-l border-[#27272A] p-0 flex flex-col">
                
                {/* Header section with heavy industrial feel */}
                <SheetHeader className="p-10 border-b border-[#27272A] space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="px-2 py-0.5 bg-[#FF6B00] text-black text-[9px] font-black uppercase tracking-widest italic">
                            System Library
                        </div>
                        <div className="h-[1px] flex-1 bg-zinc-800" />
                    </div>
                    <SheetTitle className="text-3xl font-black text-white tracking-tighter uppercase italic text-left">
                        Select Component
                    </SheetTitle>
                    <SheetDescription className="text-left text-zinc-500 text-[10px] uppercase tracking-[1px] font-bold leading-relaxed">
                        Inject a new operational node into the current ritual logic chain.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* Trigger Section */}
                    <div className="px-8 py-3 bg-zinc-900/30 flex items-center gap-3 border-b border-zinc-800">
                        <ZapIcon className="size-3 text-[#FF6B00]" />
                        <span className="text-[9px] uppercase tracking-[4px] font-black text-zinc-500">Input Triggers</span>
                    </div>
                    {triggerNodes.map((node) => <NodeItem key={node.type} nodeType={node} />)}
                    
                    {/* Execution Section */}
                    <div className="px-8 py-3 bg-zinc-900/30 flex items-center gap-3 border-b border-zinc-800 mt-4">
                        <CpuIcon className="size-3 text-[#FF6B00]" />
                        <span className="text-[9px] uppercase tracking-[4px] font-black text-zinc-500">Logic Modules</span>
                    </div>
                    {executionNodes.map((node) => <NodeItem key={node.type} nodeType={node} />)}
                </div>
                
                {/* Footer with hardware details */}
                <div className="p-6 border-t border-[#27272A] flex justify-between items-center bg-[#0D0D0F]">
                    <div className="flex items-center gap-2">
                        <div className="size-2 bg-[#FF6B00] animate-pulse rounded-full shadow-[0_0_8px_#FF6B00]" />
                        <span className="text-[8px] uppercase tracking-[2px] font-black text-zinc-600 italic">Vivelune-Core OS v2.4</span>
                    </div>
                    <BoxIcon className="size-4 text-zinc-800" />
                </div>
            </SheetContent>
        </Sheet>
    )
}