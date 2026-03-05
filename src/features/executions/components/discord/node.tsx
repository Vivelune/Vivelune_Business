"use client";

import { Node, NodeProps, useReactFlow, Position } from "@xyflow/react";
import { memo, useState, useCallback } from "react";
import { MessageSquare } from "lucide-react";

import { BaseExecutionNode } from "../base-execution-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { DiscordDialog, DiscordFormValues } from "./dialog";
import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord";
import { fetchDiscordRealtimeToken } from "./actions";
import { BaseHandle } from "@/components/react-flow/base-handle";

type DiscordNodeData = {
  webhookUrl?: string;
  content?: string;
  username?: string;
  variableName?: string;
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const handleSubmit = useCallback((values: DiscordFormValues) => {
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
    channel: DISCORD_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchDiscordRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const nodeData = props.data;
  const description = nodeData?.content
    ? `MSG: ${nodeData.content.slice(0, 45)}${nodeData.content.length > 45 ? "..." : ""}`
    : "STATUS: UNCONFIGURED";

  return (
    <>
      <DiscordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/discord.svg"
        name="Discord_Uplink"
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
          className="!w-2.5 !h-2.5 !bg-zinc-800 !border !border-zinc-500 hover:!border-[#5865F2] transition-colors"
        />

        {/* OUTPUT (Pass-through) */}
        <BaseHandle
          type="source"
          position={Position.Right}
          id="output"
          className="!bg-[#5865F2]/20 !border !border-[#5865F2]/50 !w-3 !h-3 hover:!bg-[#5865F2] transition-all"
        >
          
        </BaseHandle>
      </BaseExecutionNode>
    </>
  );
});

DiscordNode.displayName = "DiscordNode";