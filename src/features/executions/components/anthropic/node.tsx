"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState, useCallback } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { AnthropicDialog, AnthropicFormValues } from "./dialog";
import { ANTHROPIC_CHANNEL_NAME } from "@/inngest/channels/anthropic";
import { fetchAnthropicRealtimeToken } from "./actions";
import { BrainIcon } from "lucide-react"; // Import the component reference

type AnthropicNodeData = {
    variableName?: string;
    systemPrompt?: string;
    userPrompt?: string;
    credentialId?: string;
};
 
type AnthropicNodeType = Node<AnthropicNodeData>;

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleSubmit = useCallback((values: AnthropicFormValues) => {
        setNodes((nodes) => nodes.map((node) => {
            if (node.id === props.id) {
                return {
                    ...node, 
                    data: { ...node.data, ...values }
                }
            }
            return node;
        }))
    }, [props.id, setNodes]);

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: ANTHROPIC_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchAnthropicRealtimeToken,
    });

    const handleOpenSettings = () => setDialogOpen(true);
    const nodeData = props.data;
    
    const description = nodeData?.userPrompt
        ? `CLAUDE_3.5_HAIKU > "${nodeData.userPrompt.slice(0, 40)}..."`
        : "STATUS::NOT_CONFIGURED";

    return (
        <>
            <AnthropicDialog
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            /> 
            
            <BaseExecutionNode
                {...props}
                id={props.id}
                /**
                 * FIX: Pass the icon component reference directly.
                 * BaseExecutionNode will likely render it as <icon className="..." />
                 */
                icon='/anthropic.svg' 
                name="Anthropic_AI"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});

AnthropicNode.displayName = "AnthropicNode";