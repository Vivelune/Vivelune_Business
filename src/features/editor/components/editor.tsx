"use client"

import { ErrorView, LoadingView } from "@/components/entity-components"
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows"
import { useState, useCallback, useMemo } from 'react';
import { 
    ReactFlow, 
    applyNodeChanges, 
    applyEdgeChanges, 
    addEdge, 
    type Edge, 
    type Node,
    type NodeChange,
    type EdgeChange,
    type Connection, 
    Background,
    Controls,
    MiniMap,
    Panel,
    BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";
import { NodeType } from "@/generated/prisma/enums";
import { ExecuteWorkflowButton } from "./execute-workflow-button";

export const EditorLoading = () => {
    return <LoadingView message="Initializing Studio..." />
}

export const EditorError = () => {
    return <ErrorView message="Studio connection interrupted" />
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId);
    const setEditor = useSetAtom(editorAtom);

    const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
    const [edges, setEdges] = useState<Edge[]>(workflow.edges);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nodesSnapshot) =>
            applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((edgesSnapshot) =>
            applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params: Connection) => setEdges((edgesSnapshot) =>
            addEdge({ 
                ...params, 
                style: { stroke: '#1C1C1C', strokeWidth: 1.5 },
                animated: true 
            }, edgesSnapshot)),
        [],
    );

    const hasManualTrigger = useMemo(() => {
        return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER)
    }, [nodes]);

    return (
        <div className="size-full bg-[#F4F1EE]">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                snapGrid={[20, 20]}
                snapToGrid
                panOnScroll
                nodeTypes={nodeComponents}
                fitView
                onInit={setEditor}
                // We'll use this class to style the selection box in CSS instead of props
                className="vivelune-canvas"
                proOptions={{
                    hideAttribution: true,
                }}
            >
                <Background 
                    variant={BackgroundVariant.Dots} 
                    gap={20} 
                    size={1} 
                    color="#DCD5CB" 
                />

                <Controls 
                    showInteractive={false}
                    className="bg-white border border-[#DCD5CB] shadow-none rounded-none overflow-hidden"
                />

                <MiniMap 
                    style={{
                        backgroundColor: '#F4F1EE',
                    }}
                    nodeColor="#1C1C1C"
                    maskColor="rgba(244, 241, 238, 0.7)"
                    className="rounded-none border border-[#DCD5CB]"
                />

                <Panel position="top-right" className="m-6">
                    <AddNodeButton />
                </Panel>

                {hasManualTrigger && (
                    <Panel position="bottom-center" className="mb-8">
                        <ExecuteWorkflowButton workflowId={workflowId} />
                    </Panel>
                )}
            </ReactFlow>

            <div className="absolute bottom-6 left-6 pointer-events-none">
                <p className="text-[10px] font-black uppercase tracking-[4px] text-[#1C1C1C]/20">
                    Vivelune Workflow Studio
                </p>
            </div>
        </div>
    )
}