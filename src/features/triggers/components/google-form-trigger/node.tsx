"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState, useCallback } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleFormTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/google-form-trigger";
import { fetchGoogleFormTriggerRealtimeToken } from "./actions";

export interface GoogleFormNodeData extends Record<string, unknown> {
  variableName?: string;
}

type GoogleFormTriggerNodeProps = NodeProps<Node<GoogleFormNodeData>>;

export const GoogleFormTrigger = memo((props: GoogleFormTriggerNodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchGoogleFormTriggerRealtimeToken,
  });

  const handleOpenSettings = useCallback(() => setDialogOpen(true), []);

  const handleSubmit = useCallback((values: { variableName: string }) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return { ...node, data: { ...node.data, ...values } };
        }
        return node;
      })
    );
  }, [props.id, setNodes]);

  const nodeData = props.data || {};
  const variableName = nodeData.variableName || "googleForm";
  
  // Description fixed to be a string
  const displayDescription = `SUBMISSION → {{${variableName}}}`;

  return (
    <>
      <GoogleFormTriggerDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseTriggerNode
        {...props}
        id={props.id}
        icon="/googleform.svg"
        name="Google_Form"
        description={displayDescription}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

GoogleFormTrigger.displayName = "GoogleFormTrigger";