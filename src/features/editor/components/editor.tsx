"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { useState, useCallback, useMemo, useEffect } from 'react';
import { 
    ReactFlow, 
    ReactFlowProvider,
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
    BackgroundVariant,
    useReactFlow,
    type ReactFlowInstance,
    type NodeTypes
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";
import { NodeType } from "@/generated/prisma/enums";
import { ExecuteWorkflowButton } from "./execute-workflow-button";
import { HelpCircleIcon, AlertTriangleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLocalStorage } from "@/hooks/use-local-storage";

// Define your node data types
type WorkflowNodeData = Record<string, unknown>;
type WorkflowNodeType = Node<WorkflowNodeData>;
type WorkflowEdgeType = Edge;

export const EditorLoading = () => {
    return (
        <div className="size-full bg-background flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="relative">
                    <div className="size-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
                <p className="text-sm text-muted-foreground">Loading workflow...</p>
            </div>
        </div>
    );
};

export const EditorError = () => {
    return (
        <div className="size-full bg-background flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md p-6">
                <AlertTriangleIcon className="size-12 text-destructive mx-auto" />
                <p className="text-sm font-medium text-destructive">Failed to load workflow</p>
                <p className="text-xs text-muted-foreground">Please try refreshing the page</p>
                <Button 
                    onClick={() => window.location.reload()}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                >
                    Retry
                </Button>
            </div>
        </div>
    );
};

// Inner component that uses useReactFlow hook
const EditorContent = ({ 
    workflowId, 
    nodes, 
    edges, 
    setNodes, 
    setEdges, 
    showMiniMap, 
    setShowMiniMap, 
    showGrid, 
    setShowGrid, 
    selectedNode, 
    setSelectedNode, 
    saveToHistory, 
    setEditor 
}: any) => {
    const reactFlowInstance = useReactFlow<WorkflowNodeType, WorkflowEdgeType>();

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            setNodes((nodesSnapshot: WorkflowNodeType[]) => {
                const newNodes = applyNodeChanges(changes, nodesSnapshot) as WorkflowNodeType[];
                setTimeout(saveToHistory, 100);
                return newNodes;
            });
        },
        [saveToHistory, setNodes],
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            setEdges((edgesSnapshot: WorkflowEdgeType[]) => {
                const newEdges = applyEdgeChanges(changes, edgesSnapshot) as WorkflowEdgeType[];
                setTimeout(saveToHistory, 100);
                return newEdges;
            });
        },
        [saveToHistory, setEdges],
    );

    const onConnect = useCallback(
        (params: Connection) => {
            setEdges((edgesSnapshot: WorkflowEdgeType[]) => {
                const newEdges = addEdge({ 
                    ...params, 
                    // Industrial Orange or Zinc-500
                    style: { 
                        stroke: '#FF6B00', 
                        strokeWidth: 2,
                        filter: 'drop-shadow(0 0 4px rgba(255, 107, 0, 0.2))' 
                    },
                    animated: true,
                    // Adding a class for advanced CSS control
                    className: "industrial-edge" 
                }, edgesSnapshot) as WorkflowEdgeType[];
                
                setTimeout(() => {
                    setSelectedNode(params.target);
                    setTimeout(() => setSelectedNode(null), 500);
                }, 100);
                
                setTimeout(saveToHistory, 100);
                return newEdges;
            });
        },
        [saveToHistory, setEdges, setSelectedNode],
    );
    const onNodeClick = useCallback((event: React.MouseEvent, node: WorkflowNodeType) => {
        setSelectedNode(node.id);
    }, [setSelectedNode]);

    const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: WorkflowNodeType) => {
        // Node settings are handled by individual node components
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
    }, [setSelectedNode]);

    const hasManualTrigger = useMemo(() => {
        return nodes.some((node: WorkflowNodeType) => node.type === NodeType.MANUAL_TRIGGER)
    }, [nodes]);

    // Cast nodeComponents to the expected type
    const typedNodeComponents = nodeComponents as NodeTypes;

    return (
        <>
            
            {/* React Flow Canvas */}
            <ReactFlow<WorkflowNodeType, WorkflowEdgeType>
                nodes={nodes.map((node: WorkflowNodeType) => ({
                    ...node,
                    className: cn(
                        node.id === selectedNode && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                    )
                }))}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onNodeDoubleClick={onNodeDoubleClick}
                onPaneClick={onPaneClick}
                snapGrid={showGrid ? [20, 20] : undefined}
                snapToGrid={showGrid}
                panOnScroll
                nodeTypes={typedNodeComponents}
                fitView
                onInit={(instance) => {
                    setEditor(instance as ReactFlowInstance);
                    setTimeout(() => instance.fitView({ padding: 0.2 }), 100);
                }}
                className="vivelune-canvas bg-background"
                proOptions={{ hideAttribution: true }}
                defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                minZoom={0.2}
                maxZoom={2}
            >
                <Background 
        variant={BackgroundVariant.Lines} // Lines look more technical than dots
        gap={40} 
        size={1} 
        color="#18181B" // Zinc-900 for a subtle grid
    />

                

                

                {/* Add Node Button - Simple and clean */}
                <Panel position="center-left" className="ml-10">
                    <div data-add-node>
                        <AddNodeButton nodeCount={0} />
                    </div>
                </Panel>

                {/* Execute Button - Only shows when manual trigger exists */}
                {hasManualTrigger && (
                    <Panel position="bottom-center" className="mb-4" data-execute>
                        <ExecuteWorkflowButton workflowId={workflowId} />
                    </Panel>
                )}
            </ReactFlow>
        </>
    );
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId);
    const setEditor = useSetAtom(editorAtom);

    const [nodes, setNodes] = useState<WorkflowNodeType[]>(workflow.nodes);
    const [edges, setEdges] = useState<WorkflowEdgeType[]>(workflow.edges);
    const [showMiniMap, setShowMiniMap] = useState(true);
    const [showGrid, setShowGrid] = useState(true);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [history, setHistory] = useState<Array<{ nodes: WorkflowNodeType[]; edges: WorkflowEdgeType[] }>>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [hasShownWelcome, setHasShownWelcome] = useLocalStorage('vivelune-editor-welcome', false);

    // Save state to history
    const saveToHistory = useCallback(() => {
        setHistory(prev => {
            const newHistory = prev.slice(0, historyIndex + 1);
            return [...newHistory, { nodes, edges }];
        });
        setHistoryIndex(prev => prev + 1);
    }, [nodes, edges, historyIndex]);

    // Auto-show welcome for new workflows (simple toast instead of panel)
    useEffect(() => {
        if (!hasShownWelcome && nodes.length <= 1) {
            setHasShownWelcome(true);
            // You could show a simple toast here if desired
        }
    }, [nodes.length, hasShownWelcome, setHasShownWelcome]);

    // Save to history on changes
    useEffect(() => {
        if (history.length === 0 && nodes.length > 0) {
            saveToHistory();
        }
    }, [history.length, nodes.length, saveToHistory]);

    return (
        <div className="size-full bg-background relative">
            <ReactFlowProvider>
                <EditorContent 
                    workflowId={workflowId}
                    nodes={nodes}
                    edges={edges}
                    setNodes={setNodes}
                    setEdges={setEdges}
                    
                    showMiniMap={showMiniMap}
                    setShowMiniMap={setShowMiniMap}
                    showGrid={showGrid}
                    setShowGrid={setShowGrid}
                    selectedNode={selectedNode}
                    setSelectedNode={setSelectedNode}
                    saveToHistory={saveToHistory}
                    setEditor={setEditor}
                />
            </ReactFlowProvider>
        </div>
    );
};