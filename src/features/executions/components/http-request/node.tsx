"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState, useCallback } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { GlobeIcon } from "lucide-react";
import { HttpRequestFormValues, HttpRequestDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { HTTP_REQUEST_CHANNEL_NAME } from "@/inngest/channels/http-request";
import { fetchHttpRequestRealtimeToken } from "./actions";

type HttpRequestNodeData = {
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
    variableName?: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleSubmit = useCallback((values: HttpRequestFormValues) => {
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
        channel: HTTP_REQUEST_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchHttpRequestRealtimeToken,
    });

    const handleOpenSettings = useCallback(() => setDialogOpen(true), []);

    const nodeData = props.data;

    // Intelligent Description with method highlighting
    const method = nodeData?.method || "GET";
    const endpoint = nodeData?.endpoint || "";
    
    const description = endpoint 
        ? `${method} • ${endpoint.replace(/^https?:\/\//, '').substring(0, 30)}${endpoint.length > 30 ? '...' : ''}`
        : "Endpoint not configured";

    return (
        <>
            <HttpRequestDialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            /> 
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={GlobeIcon}
                name="HTTP Request"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});

HttpRequestNode.displayName = "HttpRequestNode";