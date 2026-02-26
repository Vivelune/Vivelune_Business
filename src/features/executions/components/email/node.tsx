// src/features/executions/components/email/node.tsx
"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { MailIcon } from "lucide-react";
import { EmailDialog, EmailFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { EMAIL_CHANNEL_NAME } from "@/inngest/channels/email";
import { fetchEmailRealtimeToken } from "./actions";

type EmailNodeData = {
  variableName?: string;
  from?: string;
  to?: string;
  subject?: string;
  html?: string;
};

type EmailNodeType = Node<EmailNodeData>;

export const EmailNode = memo((props: NodeProps<EmailNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const handleSubmit = (values: EmailFormValues) => {
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
  };

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: EMAIL_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchEmailRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const nodeData = props.data;
  const description = nodeData?.subject
    ? `📧 ${nodeData.subject.slice(0, 50)}...`
    : "Not Configured";

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
        id={props.id}
        icon={MailIcon}
        name="Email"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

EmailNode.displayName = "EmailNode";