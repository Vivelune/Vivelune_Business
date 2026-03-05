"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState, useCallback } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { SlackDialog, SlackFormValues } from "./dialog";
import { SLACK_CHANNEL_NAME } from "@/inngest/channels/slack";
import { fetchSlackRealtimeToken } from "./actions";

type SlackNodeData = {
    webhookUrl?: string;
    content?: string;
    variableName?: string;
};
 
type SlackNodeType = Node<SlackNodeData>;

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleSubmit = useCallback((values: SlackFormValues) => {
        setNodes((nodes) => nodes.map((node) => {
            if (node.id === props.id) {
                return {
                    ...node, 
                    data: { ...node.data, ...values }
                }
            }
            return node;
        }))
        setDialogOpen(false);
    }, [props.id, setNodes]);

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: SLACK_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchSlackRealtimeToken,
    });

    const handleOpenSettings = useCallback(() => setDialogOpen(true), []);

    const nodeData = props.data;
    const description = nodeData?.content
        ? `Message: "${nodeData.content.substring(0, 40)}${nodeData.content.length > 40 ? '...' : ''}"`
        : "Pending Setup";

    return (
        <>
            <SlackDialog
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            /> 
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/slack.svg"
                name="Slack"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
});

SlackNode.displayName = "SlackNode";