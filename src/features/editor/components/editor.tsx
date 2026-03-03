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
import { InstructionPanel } from "@/components/instruction-panel";
import { 
    HelpCircleIcon, 
    AlertTriangleIcon,
    SparklesIcon,
    MousePointerIcon,
    GitBranchIcon,
    SettingsIcon,
    NetworkIcon,
    PlayCircleIcon,
    UndoIcon,
    RedoIcon,
    ZoomInIcon,
    ZoomOutIcon,
    Maximize2Icon,
    GridIcon,
    LayersIcon,
    SaveIcon,
    CheckCircle2Icon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "sonner";

// Define your node data types
type WorkflowNodeData = Record<string, unknown>;
type WorkflowNodeType = Node<WorkflowNodeData>;
type WorkflowEdgeType = Edge;

export const EditorLoading = () => {
    return (
        <div className="size-full bg-[#F4F1EE] flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="relative">
                    <div className="size-16 border-2 border-[#DCD5CB] border-t-[#1C1C1C] animate-spin rounded-full" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="size-2 bg-[#1C1C1C] animate-pulse" />
                    </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[4px] text-[#1C1C1C]/60 animate-pulse">
                    Initializing Studio...
                </p>
            </div>
        </div>
    );
};

export const EditorError = () => {
    return (
        <div className="size-full bg-[#F4F1EE] flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md p-8 border border-red-200 bg-red-50">
                <AlertTriangleIcon className="size-12 text-red-500 mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-[4px] text-red-600">
                    Studio Connection Interrupted
                </p>
                <p className="text-[11px] text-red-600/80">
                    Failed to load workflow. Please try refreshing the page.
                </p>
                <Button 
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white rounded-none text-[10px] uppercase tracking-wider px-6"
                >
                    Retry Connection
                </Button>
            </div>
        </div>
    );
};

// Mini Toolbar Component for quick actions
const MiniToolbar = ({ 
    onUndo, 
    onRedo, 
    onZoomIn, 
    onZoomOut, 
    onFitView,
    onToggleGrid,
    showGrid,
    onToggleMiniMap,
    showMiniMap,
    onSave
}: {
    onUndo?: () => void;
    onRedo?: () => void;
    onZoomIn?: () => void;
    onZoomOut?: () => void;
    onFitView?: () => void;
    onToggleGrid?: () => void;
    showGrid?: boolean;
    onToggleMiniMap?: () => void;
    showMiniMap?: boolean;
    onSave?: () => void;
}) => {
    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-1 bg-white border border-[#DCD5CB] shadow-lg p-1">
            <TooltipProvider>
                {/* Undo/Redo */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button 
                            onClick={onUndo}
                            className="size-8 flex items-center justify-center hover:bg-[#E7E1D8] transition-colors disabled:opacity-30"
                            disabled={!onUndo}
                        >
                            <UndoIcon className="size-4" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="rounded-none border-[#DCD5CB] bg-[#1C1C1C] text-[#E7E1D8] text-[8px] uppercase tracking-wider">
                        Undo (⌘Z)
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <button 
                            onClick={onRedo}
                            className="size-8 flex items-center justify-center hover:bg-[#E7E1D8] transition-colors disabled:opacity-30"
                            disabled={!onRedo}
                        >
                            <RedoIcon className="size-4" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="rounded-none border-[#DCD5CB] bg-[#1C1C1C] text-[#E7E1D8] text-[8px] uppercase tracking-wider">
                        Redo (⌘⇧Z)
                    </TooltipContent>
                </Tooltip>

                <div className="w-px h-8 bg-[#DCD5CB] mx-1" />

                {/* Zoom Controls */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button 
                            onClick={onZoomIn}
                            className="size-8 flex items-center justify-center hover:bg-[#E7E1D8] transition-colors"
                        >
                            <ZoomInIcon className="size-4" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="rounded-none border-[#DCD5CB] bg-[#1C1C1C] text-[#E7E1D8] text-[8px] uppercase tracking-wider">
                        Zoom In (+)
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <button 
                            onClick={onZoomOut}
                            className="size-8 flex items-center justify-center hover:bg-[#E7E1D8] transition-colors"
                        >
                            <ZoomOutIcon className="size-4" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="rounded-none border-[#DCD5CB] bg-[#1C1C1C] text-[#E7E1D8] text-[8px] uppercase tracking-wider">
                        Zoom Out (-)
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <button 
                            onClick={onFitView}
                            className="size-8 flex items-center justify-center hover:bg-[#E7E1D8] transition-colors"
                        >
                            <Maximize2Icon className="size-4" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="rounded-none border-[#DCD5CB] bg-[#1C1C1C] text-[#E7E1D8] text-[8px] uppercase tracking-wider">
                        Fit to View
                    </TooltipContent>
                </Tooltip>

                <div className="w-px h-8 bg-[#DCD5CB] mx-1" />

                {/* Display Options */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button 
                            onClick={onToggleGrid}
                            className={cn(
                                "size-8 flex items-center justify-center transition-colors",
                                showGrid ? "bg-[#1C1C1C] text-[#E7E1D8]" : "hover:bg-[#E7E1D8]"
                            )}
                        >
                            <GridIcon className="size-4" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="rounded-none border-[#DCD5CB] bg-[#1C1C1C] text-[#E7E1D8] text-[8px] uppercase tracking-wider">
                        Toggle Grid
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <button 
                            onClick={onToggleMiniMap}
                            className={cn(
                                "size-8 flex items-center justify-center transition-colors",
                                showMiniMap ? "bg-[#1C1C1C] text-[#E7E1D8]" : "hover:bg-[#E7E1D8]"
                            )}
                        >
                            <LayersIcon className="size-4" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="rounded-none border-[#DCD5CB] bg-[#1C1C1C] text-[#E7E1D8] text-[8px] uppercase tracking-wider">
                        Toggle Minimap
                    </TooltipContent>
                </Tooltip>

                <div className="w-px h-8 bg-[#DCD5CB] mx-1" />

                {/* Save */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button 
                            onClick={onSave}
                            className="size-8 flex items-center justify-center hover:bg-[#E7E1D8] transition-colors"
                        >
                            <SaveIcon className="size-4" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="rounded-none border-[#DCD5CB] bg-[#1C1C1C] text-[#E7E1D8] text-[8px] uppercase tracking-wider">
                        Save (⌘S)
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

// Node Counter Component
const NodeCounter = ({ nodes, edges }: { nodes: WorkflowNodeType[]; edges: WorkflowEdgeType[] }) => {
    const triggerCount = nodes.filter(n => n.type?.toString().includes('TRIGGER')).length;
    const aiCount = nodes.filter(n => ['OPENAI', 'ANTHROPIC', 'GEMINI', 'DEEPSEEK'].includes(n.type as string)).length;
    const actionCount = nodes.filter(n => ['HTTP_REQUEST', 'DISCORD', 'SLACK', 'EMAIL'].includes(n.type as string)).length;

    return (
        <div className="absolute bottom-4 left-4 bg-white border border-[#DCD5CB] shadow-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-[8px] uppercase tracking-wider text-[#8E8E8E]">
                <LayersIcon className="size-3" />
                <span>Workflow Stats</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                    <div className="text-xs font-black">{nodes.length}</div>
                    <div className="text-[7px] uppercase tracking-wider text-[#8E8E8E]">Total</div>
                </div>
                <div className="text-center">
                    <div className="text-xs font-black">{triggerCount}</div>
                    <div className="text-[7px] uppercase tracking-wider text-[#8E8E8E]">Triggers</div>
                </div>
                <div className="text-center">
                    <div className="text-xs font-black">{aiCount}</div>
                    <div className="text-[7px] uppercase tracking-wider text-[#8E8E8E]">AI</div>
                </div>
                <div className="text-center">
                    <div className="text-xs font-black">{actionCount}</div>
                    <div className="text-[7px] uppercase tracking-wider text-[#8E8E8E]">Actions</div>
                </div>
                <div className="text-center">
                    <div className="text-xs font-black">{edges.length}</div>
                    <div className="text-[7px] uppercase tracking-wider text-[#8E8E8E]">Connections</div>
                </div>
            </div>
        </div>
    );
};

// Connection Guide Component
const ConnectionGuide = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {
    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-[#1C1C1C] border border-[#DCD5CB] shadow-2xl p-4 max-w-md"
        >
            <div className="flex items-start gap-3">
                <div className="size-8 bg-[#E7E1D8] flex items-center justify-center">
                    <GitBranchIcon className="size-4 text-[#1C1C1C]" />
                </div>
                <div className="flex-1">
                    <h4 className="text-[10px] font-black uppercase tracking-[2px] text-[#E7E1D8] mb-2">
                        How to Connect Nodes
                    </h4>
                    <div className="space-y-2 text-[9px] text-[#E7E1D8]/80">
                        <p className="flex items-start gap-2">
                            <span className="text-[#E7E1D8] font-black">1.</span>
                            <span>Hover over a node to reveal connection handles</span>
                        </p>
                        <p className="flex items-start gap-2">
                            <span className="text-[#E7E1D8] font-black">2.</span>
                            <span>Click and drag from the <span className="bg-[#E7E1D8] text-[#1C1C1C] px-1">right handle</span> (source)</span>
                        </p>
                        <p className="flex items-start gap-2">
                            <span className="text-[#E7E1D8] font-black">3.</span>
                            <span>Release on the <span className="bg-[#E7E1D8] text-[#1C1C1C] px-1">left handle</span> of another node (target)</span>
                        </p>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-px bg-[#DCD5CB]/30" />
                        <button 
                            onClick={onClose}
                            className="text-[8px] uppercase tracking-wider text-[#E7E1D8]/60 hover:text-[#E7E1D8]"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Inner component that uses useReactFlow hook
const EditorContent = ({ 
    workflowId, 
    nodes, 
    edges, 
    setNodes, 
    setEdges, 
    showInstructions, 
    setShowInstructions, 
    showConnectionGuide, 
    setShowConnectionGuide, 
    showMiniMap, 
    setShowMiniMap, 
    showGrid, 
    setShowGrid, 
    selectedNode, 
    setSelectedNode, 
    history, 
    historyIndex, 
    saveToHistory, 
    handleUndo, 
    handleRedo,
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
                    style: { stroke: '#1C1C1C', strokeWidth: 1.5 },
                    animated: true,
                    label: '→'
                }, edgesSnapshot) as WorkflowEdgeType[];
                
                setShowConnectionGuide(false);
                
                setTimeout(() => {
                    setSelectedNode(params.target);
                    setTimeout(() => setSelectedNode(null), 500);
                }, 100);
                
                setTimeout(saveToHistory, 100);
                return newEdges;
            });
        },
        [saveToHistory, setEdges, setShowConnectionGuide, setSelectedNode],
    );

    const onNodeClick = useCallback((event: React.MouseEvent, node: WorkflowNodeType) => {
        setSelectedNode(node.id);
    }, [setSelectedNode]);

    const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: WorkflowNodeType) => {
        // Trigger node settings (handled by individual nodes)
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
    }, [setSelectedNode]);

    const hasManualTrigger = useMemo(() => {
        return nodes.some((node: WorkflowNodeType) => node.type === NodeType.MANUAL_TRIGGER)
    }, [nodes]);

    const handleSave = useCallback(() => {
        toast.success("Workflow saved", {
            icon: <CheckCircle2Icon className="size-4" />
        });
    }, []);

    const handleToggleGrid = useCallback(() => {
        setShowGrid(!showGrid);
    }, [showGrid, setShowGrid]);

    // Cast nodeComponents to the expected type
    const typedNodeComponents = nodeComponents as NodeTypes;

    return (
        <>
            {/* Mini Toolbar */}
            

            {/* Help Button */}
            <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="absolute top-20 right-4 z-10 size-10 bg-[#1C1C1C] border border-[#DCD5CB] flex items-center justify-center hover:bg-[#333] transition-colors group shadow-lg"
            >
                <HelpCircleIcon className="size-4 text-[#E7E1D8]" />
                <span className="absolute right-full mr-2 whitespace-nowrap bg-[#1C1C1C] text-[#E7E1D8] text-[8px] uppercase tracking-wider px-2 py-1 border border-[#DCD5CB] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Toggle Guide
                </span>
            </button>

            {/* React Flow Canvas */}
            <ReactFlow<WorkflowNodeType, WorkflowEdgeType>
                nodes={nodes.map((node: WorkflowNodeType) => ({
                    ...node,
                    className: cn(
                        node.id === selectedNode && 'tutorial-highlight',
                        node.type?.toString().includes('TRIGGER') && 'trigger-node',
                        ['OPENAI', 'ANTHROPIC', 'GEMINI', 'DEEPSEEK'].includes(node.type as string) && 'ai-node',
                        ['HTTP_REQUEST', 'DISCORD', 'SLACK', 'EMAIL'].includes(node.type as string) && 'action-node'
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
                className="vivelune-canvas"
                proOptions={{ hideAttribution: true }}
                defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                minZoom={0.2}
                maxZoom={2}
            >
                <Background 
                    variant={showGrid ? BackgroundVariant.Dots : BackgroundVariant.Cross}
                    gap={showGrid ? 20 : 50} 
                    size={1} 
                    color="#DCD5CB" 
                />

                <Controls 
                    showInteractive={false}
                    className="bg-white border border-[#DCD5CB] shadow-none rounded-none overflow-hidden hidden md:block"
                    position="bottom-left"
                />

                {showMiniMap && (
                    <MiniMap 
                        style={{
                            backgroundColor: '#F4F1EE',
                        }}
                        nodeColor={(node) => {
                            if (node.type?.toString().includes('TRIGGER')) return '#1C1C1C';
                            if (['OPENAI', 'ANTHROPIC', 'GEMINI', 'DEEPSEEK'].includes(node.type as string)) return '#4A4A4A';
                            return '#8E8E8E';
                        }}
                        maskColor="rgba(244, 241, 238, 0.7)"
                        className="rounded-none border border-[#DCD5CB] absolute bottom-20 left-4 w-48 h-32"
                        position="bottom-left"
                    />
                )}

                {/* Add Node Button */}
                <Panel position="top-right" className="m-20">
                    <div data-add-node>
                        <AddNodeButton />
                    </div>
                </Panel>

                {/* Execute Button */}
                {hasManualTrigger && (
                    <Panel position="bottom-center" className="mb-8" data-execute>
                        <ExecuteWorkflowButton workflowId={workflowId} />
                    </Panel>
                )}

                {/* Node Legend */}
                <Panel position="top-left" className="m-4">
                    <div className="bg-white border border-[#DCD5CB] p-3 space-y-2 shadow-lg">
                        <p className="text-[8px] uppercase tracking-wider font-bold text-[#1C1C1C] flex items-center gap-1">
                            <LayersIcon className="size-3" />
                            Node Legend
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-[7px] uppercase tracking-wider">
                            <div className="flex items-center gap-1">
                                <div className="size-2 bg-[#1C1C1C]" />
                                <span>Trigger</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="size-2 bg-[#4A4A4A]" />
                                <span>AI Model</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="size-2 bg-[#8E8E8E]" />
                                <span>Integration</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="size-2 border border-[#1C1C1C]" />
                                <span>Action</span>
                            </div>
                        </div>
                    </div>
                </Panel>

                {/* Viewport Info */}
                <Panel position="bottom-right" className="m-4">
                    <div className="bg-white border border-[#DCD5CB] px-3 py-2 text-[8px] uppercase tracking-wider">
                        <span className="text-[#8E8E8E]">v2.0</span>
                        <span className="mx-2">|</span>
                        <span className="font-mono">{Math.round(reactFlowInstance?.getViewport()?.zoom * 100 || 100)}%</span>
                    </div>
                </Panel>
            </ReactFlow>

            {/* Node Counter */}
            <NodeCounter nodes={nodes} edges={edges} />

            {/* Watermark */}
            <div className="absolute bottom-4 right-4 pointer-events-none opacity-20">
                <p className="text-[8px] font-black uppercase tracking-[4px] text-[#1C1C1C]">
                    Vivelune Studio • {new Date().getFullYear()}
                </p>
            </div>
        </>
    );
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId);
    const setEditor = useSetAtom(editorAtom);

    const [nodes, setNodes] = useState<WorkflowNodeType[]>(workflow.nodes);
    const [edges, setEdges] = useState<WorkflowEdgeType[]>(workflow.edges);
    const [showInstructions, setShowInstructions] = useState(false);
    const [showConnectionGuide, setShowConnectionGuide] = useState(false);
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

    // Undo/Redo
    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            const prevState = history[historyIndex - 1];
            setNodes(prevState.nodes);
            setEdges(prevState.edges);
            setHistoryIndex(prev => prev - 1);
        }
    }, [history, historyIndex]);

    const handleRedo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const nextState = history[historyIndex + 1];
            setNodes(nextState.nodes);
            setEdges(nextState.edges);
            setHistoryIndex(prev => prev + 1);
        }
    }, [history, historyIndex]);

    // Auto-show welcome for new workflows
    useEffect(() => {
        if (!hasShownWelcome && nodes.length <= 1) {
            setShowInstructions(true);
            setHasShownWelcome(true);
        }
    }, [nodes.length, hasShownWelcome, setHasShownWelcome]);

    // Save to history on changes
    useEffect(() => {
        if (history.length === 0 && nodes.length > 0) {
            saveToHistory();
        }
    }, [history.length, nodes.length, saveToHistory]);

    const instructionSteps = [
        {
            number: 1,
            text: "Start by adding a trigger node (Manual, Webhook, or Scheduled)",
            icon: MousePointerIcon,
            action: () => {
                const addButton = document.querySelector('[data-add-node]');
                if (addButton) {
                    (addButton as HTMLElement).click();
                }
            }
        },
        {
            number: 2,
            text: "Connect nodes by dragging from the {{right handle}} to {{left handle}}",
            icon: GitBranchIcon,
            action: () => setShowConnectionGuide(true)
        },
        {
            number: 3,
            text: "Double-click any node to configure its settings and API credentials",
            icon: SettingsIcon
        },
        {
            number: 4,
            text: "Add AI nodes to process data with GPT-4, Claude, or Gemini",
            icon: SparklesIcon,
        },
        {
            number: 5,
            text: "Connect to external services via HTTP, Discord, Slack, or Email",
            icon: NetworkIcon,
        },
        {
            number: 6,
            text: "Click {{Execute Ritual}} to test your workflow",
            icon: PlayCircleIcon,
            action: () => {
                const executeButton = document.querySelector('[data-execute]');
                if (executeButton) {
                    (executeButton as HTMLElement).scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    ];

    return (
        <div className="size-full bg-[#F4F1EE] relative">
            {/* Welcome/Instruction Panel */}
            <AnimatePresence>
                {showInstructions && (
                    <InstructionPanel
                        title="Welcome to the Studio"
                        context="Build your first automation ritual"
                        steps={instructionSteps}
                        docUrl="/docs/workflows"
                        videoUrl="https://vivelune.com/tutorials/first-workflow"
                        onDismiss={() => setShowInstructions(false)}
                    />
                )}
            </AnimatePresence>

            {/* Connection Guide */}
            <AnimatePresence>
                {showConnectionGuide && (
                    <ConnectionGuide 
                        isVisible={showConnectionGuide} 
                        onClose={() => setShowConnectionGuide(false)} 
                    />
                )}
            </AnimatePresence>

            {/* ReactFlowProvider wraps the content that uses useReactFlow */}
            <ReactFlowProvider>
                <EditorContent 
                    workflowId={workflowId}
                    nodes={nodes}
                    edges={edges}
                    setNodes={setNodes}
                    setEdges={setEdges}
                    showInstructions={showInstructions}
                    setShowInstructions={setShowInstructions}
                    showConnectionGuide={showConnectionGuide}
                    setShowConnectionGuide={setShowConnectionGuide}
                    showMiniMap={showMiniMap}
                    setShowMiniMap={setShowMiniMap}
                    showGrid={showGrid}
                    setShowGrid={setShowGrid}
                    selectedNode={selectedNode}
                    setSelectedNode={setSelectedNode}
                    history={history}
                    historyIndex={historyIndex}
                    saveToHistory={saveToHistory}
                    handleUndo={handleUndo}
                    handleRedo={handleRedo}
                    setEditor={setEditor}
                />
            </ReactFlowProvider>
        </div>
    );
};