// src/features/triggers/components/clerk/node.tsx
"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { ClerkTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchClerkRealtimeToken } from "./actions";
import { CLERK_CHANNEL_NAME } from "@/inngest/channels/clerk";
import { UserIcon } from "lucide-react";

export interface ClerkNodeData extends Record<string, unknown> {
  variableName?: string;
  eventType?: string;
  includeMetadata?: boolean;
  includeUserData?: boolean;
}

type ClerkTriggerNodeProps = NodeProps<Node<ClerkNodeData>>;

export const ClerkTriggerNode = memo((props: ClerkTriggerNodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: CLERK_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchClerkRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: ClerkNodeData) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      })
    );
    setDialogOpen(false);
    
  };

  const nodeData = props.data || {};
  const eventType = nodeData.eventType as string | undefined;
  
  const description = eventType 
    ? `On ${eventType.replace(/\./g, ' ')}`
    : "Configure Clerk trigger";

  return (
    <>
      <ClerkTriggerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={{
          variableName: nodeData.variableName as string,
          eventType: eventType as any,
          includeMetadata: nodeData.includeMetadata as boolean,
          includeUserData: nodeData.includeUserData as boolean,
        }}
      />

      <BaseTriggerNode
        {...props}
        icon="/clerk.jpeg"
        name="Clerk"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

ClerkTriggerNode.displayName = "ClerkTriggerNode";