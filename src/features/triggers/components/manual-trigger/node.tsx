"use client";

import { NodeProps } from "@xyflow/react";
import { memo, useState, useCallback } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manual-trigger";
import { fetchManualTriggerRealtimeToken } from "./actions";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: MANUAL_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchManualTriggerRealtimeToken,
  });

  const handleOpenSettings = useCallback(() => setDialogOpen(true), []);

  return (
    <>
      <ManualTriggerDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
      />
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="Manual_Entry"
        // Ensure description is a string for BaseTriggerNode
        description="Awaiting manual execution"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";