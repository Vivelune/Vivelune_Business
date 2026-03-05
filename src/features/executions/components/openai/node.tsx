"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState, useCallback } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { OpenAiDialog, OpenAiFormValues } from "./dialog";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";
import { fetchOpenAiRealtimeToken } from "./actions";

type OpenAiNodeData = {
    variableName?: string;
    systemPrompt?: string;
    userPrompt?: string;
    credentialId?: string;
    model?: string;
};

type OpenAiNodeType = Node<OpenAiNodeData>;

export const OpenAiNode = memo((props: NodeProps<OpenAiNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleSubmit = useCallback((values: OpenAiFormValues) => {
        setNodes((nodes) => nodes.map((node) => {
            if (node.id === props.id) {
                return {
                    ...node,
                    data: { ...node.data, ...values }
                };
            }
            return node;
        }));
        setDialogOpen(false);
    }, [props.id, setNodes]);

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: OPENAI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchOpenAiRealtimeToken,
    });

    const handleOpenSettings = useCallback(() => setDialogOpen(true), []);

    const nodeData = props.data;
    
    // Model + Prompt snippet description
    const modelName = nodeData?.model ? nodeData.model.replace('gpt-', '') : "gpt-4o-mini";
    const description = nodeData?.userPrompt
        ? `${modelName}: "${nodeData.userPrompt.substring(0, 30)}..."`
        : "Configuration required";

    return (
        <>
            <OpenAiDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/openaiwhite.svg"
                name="OpenAI"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});

OpenAiNode.displayName = "OpenAiNode";