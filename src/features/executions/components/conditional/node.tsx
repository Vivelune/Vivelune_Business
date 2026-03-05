"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState, useCallback } from "react"; // Added useCallback
import { BaseExecutionNode } from "../base-execution-node";
import { ConditionalDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { CONDITIONAL_CHANNEL_NAME } from "@/inngest/channels/conditional";
import { fetchConditionalRealtimeToken } from "./actions";
import { GitBranchIcon } from "lucide-react";
import { ConditionalNodeData, ConditionalFormValues } from "./types";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { Position } from "@xyflow/react";

type ConditionalNodeType = Node<ConditionalNodeData>;

export const ConditionalNode = memo((props: NodeProps<ConditionalNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  // Wrapped in useCallback for performance and stability
  const handleSubmit = useCallback((values: ConditionalFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data, // Preserve other data if any
              variableName: values.variableName,
              logicalOperator: values.logicalOperator,
              conditions: values.conditions,
              trueBranchName: values.trueBranchName,
              falseBranchName: values.falseBranchName,
            },
          };
        }
        return node;
      })
    );
    setDialogOpen(false); // Close dialog after successful commit
  }, [props.id, setNodes]);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: CONDITIONAL_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchConditionalRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const nodeData = props.data;
  const conditionCount = nodeData?.conditions?.length || 0;
  
  // Industrialized description string
  const description = conditionCount > 0
    ? `${nodeData.logicalOperator?.toUpperCase() || 'AND'}: ${conditionCount} GATE${conditionCount > 1 ? 'S' : ''}`
    : "IDLE: AWAITING_LOGIC";

  const trueBranchName = nodeData?.trueBranchName || "SUCCESS";
  const falseBranchName = nodeData?.falseBranchName || "FAILURE";

  return (
    <>
      <ConditionalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        icon={GitBranchIcon}
        name="Logic_Engine_v2"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      >
        {/* Input handle (left side) */}
        <BaseHandle
          type="target"
          position={Position.Left}
          id="input"
          className="!w-2.5 !h-2.5 !bg-zinc-800 !border !border-zinc-500 hover:!border-[#FF6B00] transition-colors"
        />

        {/* TRUE output handle (top-right) */}
        <BaseHandle
          type="source"
          position={Position.Right}
          id="true" 
          className="!bg-emerald-500/20 !border !border-emerald-500/50 !w-3 !h-3 hover:!bg-emerald-500 transition-all" 
          title={`Route: ${trueBranchName}`} 
          style={{ top: '20%' }}
        >
          <div className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap text-[7px] font-black uppercase tracking-[2px] text-emerald-500/80">
            {trueBranchName}
          </div>
        </BaseHandle>

        {/* FALSE output handle (bottom-right) */}
        <BaseHandle
          type="source"
          position={Position.Right}
          id="false"
          className="!bg-red-500/20 !border !border-red-500/50 !w-3 !h-3 hover:!bg-red-500 transition-all" 
          title={`Route: ${falseBranchName}`} 
          style={{ bottom: '20%' }}
        >
          <div className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap text-[7px] font-black uppercase tracking-[2px] text-red-500/80">
            {falseBranchName}
          </div>
        </BaseHandle>
      </BaseExecutionNode>
    </>
  );
});

ConditionalNode.displayName = "ConditionalNode";