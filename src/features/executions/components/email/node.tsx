"use client";

import { Node, NodeProps, useReactFlow, Position } from "@xyflow/react";
import { memo, useState, useCallback } from "react";
import { Mail } from "lucide-react";

import { BaseExecutionNode } from "../base-execution-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { EmailDialog } from "./dialog";
import { EMAIL_CHANNEL_NAME } from "@/inngest/channels/email";
import { fetchEmailRealtimeToken } from "./actions";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { EmailNodeData, EmailFormValues } from "./types";

type EmailNodeType = Node<EmailNodeData>;

export const EmailNode = memo((props: NodeProps<EmailNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const handleSubmit = useCallback((values: EmailFormValues) => {
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
  }, [props.id, setNodes]);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: EMAIL_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchEmailRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const nodeData = props.data;
  const isConfigured = !!(nodeData?.to && nodeData?.subject && nodeData?.credentialId);
  
  // Compact, industrial description
  const description = isConfigured
    ? `TO: ${nodeData.to?.slice(0, 15)}... | SUB: ${nodeData.subject?.slice(0, 15)}...`
    : "STATUS: AWAITING_RELAY_CONFIG";

  return (
    <>
      <EmailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      
      <BaseExecutionNode
        {...props}
        icon={Mail}
        name="SMTP_Relay"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        // Custom border to distinguish the node type
      
      >
        {/* INPUT HANDLE */}
        <BaseHandle
          type="target"
          position={Position.Left}
          id="input"
          className="!w-2.5 !h-2.5 !bg-zinc-800 !border !border-zinc-500 hover:!border-rose-500 transition-colors"
        />

        {/* OUTPUT HANDLE (Passes the transmission result) */}
        <BaseHandle
          type="source"
          position={Position.Right}
          id="output"
          className="!bg-rose-500/20 !border !border-rose-500/50 !w-3 !h-3 hover:!bg-rose-500 transition-all"
        >
          
        </BaseHandle>

        {/* Configuration Alert Overlay (Subtle) */}
        {!isConfigured && (
          <div className="absolute -top-1 -left-1 flex items-center gap-1.5 px-2 py-0.5 bg-amber-500 text-black text-[7px] font-black uppercase tracking-tighter">
            <span className="size-1 bg-black rounded-full animate-ping" />
            Config_Required
          </div>
        )}
      </BaseExecutionNode>
    </>
  );
});

EmailNode.displayName = "EmailNode";