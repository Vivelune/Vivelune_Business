"use client"

import { ExecutionStatus } from "@/generated/prisma/enums";
import { 
    CheckCircle2Icon, 
    ClockIcon, 
    Loader2Icon, 
    XCircleIcon, 
    TerminalIcon, 
    ZapIcon, 
    ActivityIcon,
    ShieldCheck,
    Cpu,
    Timer,
    Database,
    ChevronRight,
    Search
} from "lucide-react";
import { useSuspenseExecution } from "../hooks/use-executions";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const getStatusStyles = (status: ExecutionStatus) => {
    switch (status) {
        case ExecutionStatus.SUCCESS:
            return { icon: CheckCircle2Icon, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
        case ExecutionStatus.FAILED:
            return { icon: XCircleIcon, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" };
        case ExecutionStatus.RUNNING:
            return { icon: Loader2Icon, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" };
        default:
            return { icon: ClockIcon, color: "text-zinc-500", bg: "bg-zinc-500/10", border: "border-zinc-500/20" };
    }
}

export const ExecutionView = ({ executionId }: { executionId: string }) => {
    const { data: execution } = useSuspenseExecution(executionId);
    const [showStackTrace, setShowStackTrace] = useState(false);
    const styles = getStatusStyles(execution.status);
    const Icon = styles.icon;

    const duration = execution.completedAt
        ? Math.round((new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000)
        : null;

    return (
        <Card className="rounded-2xl border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden text-zinc-300">
            {/* Top Tactical Status Bar */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-800/50 bg-black/20">
                <div className="flex items-center gap-6">
                    <div className={cn("size-12 rounded-xl border flex items-center justify-center shadow-inner transition-all", styles.bg, styles.border)}>
                        <Icon className={cn("size-6", styles.color, execution.status === ExecutionStatus.RUNNING && "animate-spin")} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <p className="text-[10px] font-black uppercase tracking-[3px] text-zinc-500">System_Protocol</p>
                            <Badge className={cn("text-[9px] px-1.5 py-0 h-4 border-none font-black uppercase tracking-tighter", styles.bg, styles.color)}>
                                {execution.status}
                            </Badge>
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-100 flex items-center gap-3">
                            {execution.status === ExecutionStatus.SUCCESS ? "Operational" : execution.status}
                            <span className="text-zinc-800 font-light select-none">/</span>
                            <span className="text-xs font-mono text-zinc-500">ID:{executionId.slice(0, 8)}</span>
                        </h2>
                    </div>
                </div>
                
                <div className="hidden md:flex flex-col items-end">
                    <p className="text-[10px] font-black uppercase tracking-[3px] text-zinc-500 mb-2">Event_Handshake</p>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-[10px] text-zinc-400">
                        <ShieldCheck className="size-3 text-emerald-500/50" />
                        {execution.inngestEventId}
                    </div>
                </div>
            </div>

            <CardContent className="p-8 space-y-10">
                {/* Telemetry Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Workflow_Origin", value: execution.workflow.name, icon: ZapIcon, link: `/workflows/${execution.workflowId}` },
                        { label: "Session_Start", value: formatDistanceToNow(execution.startedAt, { addSuffix: true }), icon: Timer },
                        { label: "Compute_Model", value: "Node_Executor_v2", icon: Cpu },
                        { label: "Net_Latency", value: duration !== null ? `${duration}s` : "Calculating...", icon: ActivityIcon },
                    ].map((item, i) => (
                        <div key={i} className="p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30 group hover:border-zinc-700 transition-colors">
                            <div className="flex items-center gap-2 mb-2 text-zinc-600 group-hover:text-zinc-400 transition-colors">
                                <item.icon className="size-3" />
                                <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                            </div>
                            {item.link ? (
                                <Link href={item.link} className="text-[13px] font-bold uppercase tracking-tight text-zinc-200 hover:text-white flex items-center gap-1">
                                    {item.value} <ChevronRight className="size-3 text-zinc-700" />
                                </Link>
                            ) : (
                                <p className="text-[13px] font-bold uppercase tracking-tight text-zinc-200">{item.value}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* ERROR CONSOLE RE-ENGINEERED */}
                {execution.error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-3 bg-red-500/10 border-b border-red-500/10">
                            <div className="flex items-center gap-2">
                                <TerminalIcon className="size-4 text-red-500" />
                                <span className="text-[10px] font-black uppercase tracking-[3px] text-red-500/80">Exception_Interrupt</span>
                            </div>
                            <Badge variant="outline" className="text-[9px] border-red-500/30 text-red-500">CRITICAL_FAULT</Badge>
                        </div>
                        <div className="p-5">
                            <p className="text-sm font-mono text-red-400 leading-relaxed bg-black/40 p-4 rounded-lg border border-red-500/10">
                                {execution.error}
                            </p>

                            {execution.errorStack && (
                                <Collapsible open={showStackTrace} onOpenChange={setShowStackTrace} className="mt-4">
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" className="h-8 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-200 gap-2">
                                            <Search className="size-3" />
                                            {showStackTrace ? "Collapse_Trace" : "Expand_Stack_Trace"}
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <pre className="text-[11px] font-mono text-zinc-500 overflow-auto mt-4 p-5 rounded-lg bg-black border border-zinc-800 leading-5">
                                            {execution.errorStack}
                                        </pre>
                                    </CollapsibleContent>
                                </Collapsible>
                            )}
                        </div>
                    </div>
                )}

                {/* DATA LEDGER */}
                {execution.output && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Database className="size-4 text-zinc-400" />
                                <h3 className="text-[10px] font-black uppercase tracking-[4px] text-zinc-100">Final_Output_Payload</h3>
                            </div>
                            <span className="text-[9px] font-mono text-zinc-600">application/json</span>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-b from-zinc-800 to-transparent rounded-xl opacity-50" />
                            <div className="relative border border-zinc-800 bg-black/60 rounded-xl p-6 shadow-inner">
                                <pre className="text-[12px] font-mono text-zinc-400 leading-6 overflow-auto custom-scrollbar">
                                    {JSON.stringify(execution.output, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>

            {/* Bottom Tech-Footer */}
            <div className="px-8 py-4 border-t border-zinc-800/50 bg-black/20 flex items-center justify-between">
                <div className="flex items-center gap-4 text-zinc-600">
                    <span className="text-[9px] font-black uppercase tracking-widest">Core_Engine: v4.1.2</span>
                    <Separator orientation="vertical" className="h-3 bg-zinc-800" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Cluster: us-east-1</span>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                   <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase">System_Sync_Active</span>
                </div>
            </div>
        </Card>
    );
}