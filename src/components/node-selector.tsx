"use client"

import { NodeType } from "@/generated/prisma/enums";
import { createId } from "@paralleldrive/cuid2";
import { GlobeIcon, MailIcon, MousePointerIcon, SparklesIcon, ZapIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { toast } from "sonner";
import Image from "next/image";

export type NodeTypeOption = {
    type: NodeType;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }> | string;
}

const triggerNodes: NodeTypeOption[] = [
    {
        type: NodeType.MANUAL_TRIGGER,
        label: "Manual Activation",
        description: "Initiate your ritual with a single click.",
        icon: MousePointerIcon
    },
    {
        type: NodeType.GOOGLE_FORM_TRIGGER,
        label: "Google Form",
        description: "Begin recovery when a form entry is recorded.",
        icon: "/googleform.svg"
    },
    {
        type: NodeType.STRIPE_TRIGGER,
        label: "Stripe Event",
        description: "Trigger flows based on commerce and transactions.",
        icon: "/stripe.svg"
    },
    {
        type: NodeType.CLERK_TRIGGER,
        label: "Clerk Authentication",
        description: "Respond to user sign-ups or profile shifts.",
        icon: "/clerk.jpeg",
    },
];

const executionNodes: NodeTypeOption[] = [
    {
        type: NodeType.EMAIL,
        label: "Send Communication",
        description: "Deliver an intentional email to your recipients.",
        icon: MailIcon,
    },
    {
        type: NodeType.HTTP_REQUEST,
        label: "External Request",
        description: "Connect your ritual to the wider web via HTTP.",
        icon: GlobeIcon,
    },
    {
        type: NodeType.GEMINI,
        label: "Gemini Intelligence",
        description: "Harness Google's most capable AI for generation.",
        icon: "/gemini.svg",
    },
    {
        type: NodeType.OPENAI,
        label: "OpenAI GPT",
        description: "Utilize advanced language models for data processing.",
        icon: "/openai.svg",
    },
    {
        type: NodeType.ANTHROPIC,
        label: "Anthropic Claude",
        description: "Focused on safe, nuanced content generation.",
        icon: "/anthropic.svg",
    },
    {
        type: NodeType.DEEPSEEK,
        label: "DeepSeek",
        description: "Deep learning models for high-efficiency data.",
        icon: "/deepseek.svg",
    },
    {
        type: NodeType.DISCORD,
        label: "Discord Message",
        description: "Notify your community via a Discord channel.",
        icon: "/discord.svg",
    },
    {
        type: NodeType.SLACK,
        label: "Slack Update",
        description: "Push information directly to your Slack workspace.",
        icon: "/slack.svg",
    },
];

interface NodeSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export function NodeSelector({
    open,
    onOpenChange,
    children
}: NodeSelectorProps) {
    const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

    const handleNodeSelect = useCallback((selection: NodeTypeOption) => {
        if (selection.type === NodeType.MANUAL_TRIGGER) {
            const nodes = getNodes();
            const hasManualTrigger = nodes.some(
                (node) => node.type === NodeType.MANUAL_TRIGGER,
            )

            if (hasManualTrigger) {
                toast.error("Only one manual activation is allowed per ritual.");
                return;
            }
        }

        setNodes((nodes) => {
            const hasInitialTrigger = nodes.some(
                (node) => node.type === NodeType.INITIAL,
            )

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const flowPosition = screenToFlowPosition({
                x: centerX + (Math.random() - 0.5) * 200,
                y: centerY + (Math.random() - 0.5) * 200,
            })

            const newNode = {
                id: createId(),
                data: {},
                position: flowPosition,
                type: selection.type,
            }

            if (hasInitialTrigger) {
                return [newNode];
            }

            return [...nodes, newNode]
        });
        onOpenChange(false)
    }, [setNodes, getNodes, onOpenChange, screenToFlowPosition]);

    const NodeItem = ({ nodeType }: { nodeType: NodeTypeOption }) => {
        const Icon = nodeType.icon;
        return (
            <div 
                className="group w-full justify-start h-auto py-6 px-6 rounded-none cursor-pointer border-l-[3px] border-transparent hover:border-l-[#1C1C1C] hover:bg-[#E7E1D8]/50 transition-all duration-200"
                onClick={() => handleNodeSelect(nodeType)}
            >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                    <div className="flex-shrink-0 size-8 flex items-center justify-center bg-white border border-[#DCD5CB] group-hover:border-[#1C1C1C] transition-colors">
                        {typeof Icon === "string" ? (
                            <img src={Icon} alt={nodeType.label} className="size-4 object-contain grayscale group-hover:grayscale-0 transition-all" />
                        ) : (
                            <Icon className="size-4 text-[#1C1C1C]" />
                        )}
                    </div>

                    <div className="flex flex-col items-start text-left">
                        <span className="font-bold text-[11px] uppercase tracking-widest text-[#1C1C1C]">
                            {nodeType.label}
                        </span>
                        <span className="text-[12px] text-[#8E8E8E] leading-snug mt-1 font-light italic">
                            {nodeType.description}
                        </span>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto bg-[#F4F1EE] border-l-[#DCD5CB] p-0">
                <SheetHeader className="p-8 bg-white border-b border-[#DCD5CB]">
                    <div className="flex items-center gap-2 mb-2">
                        <ZapIcon className="size-3 text-[#1C1C1C]" />
                        <span className="text-[10px] uppercase tracking-[3px] font-bold text-[#8E8E8E]">Step Selection</span>
                    </div>
                    <SheetTitle className="text-2xl font-medium text-[#1C1C1C] tracking-tight text-left">
                        Design the Ritual.
                    </SheetTitle>
                    <SheetDescription className="text-left text-[#8E8E8E] font-light">
                        Every great recovery begins with an intentional trigger. Choose how this flow starts.
                    </SheetDescription>
                </SheetHeader>

                <div className="py-2">
                    <div className="px-8 py-4 bg-[#E7E1D8]/30">
                        <span className="text-[9px] uppercase tracking-[4px] font-black text-[#1C1C1C]/40">Initial Triggers</span>
                    </div>
                    {triggerNodes.map((node) => <NodeItem key={node.type} nodeType={node} />)}
                    
                    <div className="px-8 py-4 bg-[#E7E1D8]/30 mt-4">
                        <span className="text-[9px] uppercase tracking-[4px] font-black text-[#1C1C1C]/40">Execution Logic</span>
                    </div>
                    {executionNodes.map((node) => <NodeItem key={node.type} nodeType={node} />)}
                </div>
                
                <div className="p-8 text-center opacity-30">
                    <p className="text-[10px] uppercase tracking-[2px] font-medium text-[#8E8E8E]">Vivelune Studio Tools</p>
                </div>
            </SheetContent>
        </Sheet>
    )
}