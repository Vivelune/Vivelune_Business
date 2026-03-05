"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState, useCallback } from "react";
import { Sparkles, Terminal } from "lucide-react";
import { Position } from "@xyflow/react";

import { BaseExecutionNode } from "../base-execution-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { DeepseekDialog, DeepseekFormValues } from "./dialog";
import { DEEPSEEK_CHANNEL_NAME } from "@/inngest/channels/deepseek";
import { fetchDeepseekRealtimeToken } from "./actions";
import { BaseHandle } from "@/components/react-flow/base-handle";

type DeepseekNodeData = {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
  credentialId?: string;
};

type DeepseekNodeType = Node<DeepseekNodeData>;

export const DeepseekNode = memo((props: NodeProps<DeepseekNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const handleSubmit = useCallback((values: DeepseekFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: { ...node.data, ...values },
          };
        }
        return node;
      })
    );
    setDialogOpen(false);
  }, [props.id, setNodes]);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: DEEPSEEK_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchDeepseekRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `PROMPT: ${nodeData.userPrompt.slice(0, 40)}${nodeData.userPrompt.length > 40 ? "..." : ""}`
    : "STATUS: AWAITING_PROMPT";

  return (
    <>
      <DeepseekDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/deepseek.svg" // Swapped for icon component for consistent styling
        name="DeepSeek_LLM"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      >
        {/* INPUT */}
        <BaseHandle
          type="target"
          position={Position.Left}
          id="input"
          className="!w-2.5 !h-2.5 !bg-zinc-800 !border !border-zinc-500 hover:!border-blue-500 transition-colors"
        />

        {/* OUTPUT */}
        <BaseHandle
          type="source"
          position={Position.Right}
          id="output"
          className="!bg-blue-500/20 !border !border-blue-500/50 !w-3 !h-3 hover:!bg-blue-500 transition-all"
        >
          
        </BaseHandle>
      </BaseExecutionNode>
    </>
  );
});

DeepseekNode.displayName = "DeepSeekNode";