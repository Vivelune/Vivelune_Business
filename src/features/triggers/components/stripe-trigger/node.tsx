"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState, useCallback } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { StripeTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchStripeTriggerRealtimeToken } from "./actions";
import { STRIPE_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/stripe-trigger";

export interface StripeNodeData extends Record<string, unknown> {
  variableName?: string;
}

type StripeTriggerNodeProps = NodeProps<Node<StripeNodeData>>;

export const StripeTriggerNode = memo((props: StripeTriggerNodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: STRIPE_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchStripeTriggerRealtimeToken,
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
  const variableName = nodeData.variableName || "stripe";
  
  // Description fixed to be a string for BaseTriggerNode
  const displayDescription = `PAYMENT → {{${variableName}}}`;

  return (
    <>
      <StripeTriggerDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseTriggerNode
        {...props}
        id={props.id}
        icon="/stripe.svg"
        name="Stripe_Ingress"
        description={displayDescription}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
              />
    </>
  );
});

StripeTriggerNode.displayName = "StripeTriggerNode";