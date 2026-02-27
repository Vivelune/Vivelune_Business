"use client"

import { ExecutionStatus } from "@/generated/prisma/enums";
import { 
    CheckCircle2Icon, 
    ClockIcon, 
    Loader2Icon, 
    XCircleIcon, 
    TerminalIcon, 
    ZapIcon, 
    ActivityIcon 
} from "lucide-react";
import { useSuspenseExecution } from "../hooks/use-executions";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Technical Status Icons
 * Replaced generic colors with Vivelune Studio high-contrast tones.
 */
const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
        case ExecutionStatus.SUCCESS:
            return <CheckCircle2Icon className="size-5 text-[#1C1C1C]" />;
        case ExecutionStatus.FAILED:
            return <XCircleIcon className="size-5 text-red-600" />;
        case ExecutionStatus.RUNNING:
            return <Loader2Icon className="size-5 text-[#1C1C1C] animate-spin" />;
        default:
            return <ClockIcon className="size-5 text-[#8E8E8E]" />;
    }
}

const formatStatus = (status: ExecutionStatus) => {
    return status.toUpperCase(); // Maintain architectural uppercase
}

export const ExecutionView = ({ executionId }: { executionId: string }) => {
    const { data: execution } = useSuspenseExecution(executionId);
    const [showStackTrace, setShowStackTrace] = useState(false);

    const duration = execution.completedAt
        ? Math.round(
            (new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000
        )
        : null;

    return (
        <Card className="rounded-none border-[#DCD5CB] shadow-none bg-white overflow-hidden">
            {/* Top Accent Line */}
            <div className={cn(
                "h-1.5 w-full",
                execution.status === ExecutionStatus.FAILED ? "bg-red-600" : "bg-[#1C1C1C]"
            )} />

            <CardHeader className="p-8 border-b border-[#DCD5CB] bg-[#F4F1EE]/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="size-10 bg-white border border-[#DCD5CB] flex items-center justify-center shadow-sm">
                            {getStatusIcon(execution.status)}
                        </div>
                        <div>
                            <CardTitle className="text-[10px] uppercase tracking-[4px] font-black text-[#8E8E8E]">
                                Protocol State
                            </CardTitle>
                            <h2 className="text-2xl font-black uppercase tracking-tight mt-1">
                                {formatStatus(execution.status)}
                            </h2>
                        </div>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-[#8E8E8E]">Event Reference</p>
                        <p className="text-[11px] font-mono font-bold mt-1 uppercase tracking-tighter">{execution.inngestEventId}</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-8 space-y-10">
                {/* Technical Ledger Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-[#8E8E8E]">Workflow Source</p>
                        <Link 
                            prefetch
                            className="text-[13px] font-black uppercase tracking-tight hover:underline flex items-center gap-2"
                            href={`/workflows/${execution.workflowId}`}
                        >
                            <ZapIcon className="size-3" />
                            {execution.workflow.name}
                        </Link>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-[#8E8E8E]">Initiated</p>
                        <p className="text-[13px] font-bold uppercase">
                            {formatDistanceToNow(execution.startedAt, { addSuffix: true })}
                        </p>
                    </div>

                    {execution.completedAt && (
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-[#8E8E8E]">Finalized</p>
                            <p className="text-[13px] font-bold uppercase">
                                {formatDistanceToNow(execution.completedAt, { addSuffix: true })}
                            </p>
                        </div>
                    )}

                    {duration !== null && (
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-[#8E8E8E]">Latency</p>
                            <p className="text-[13px] font-bold uppercase flex items-center gap-2">
                                <ActivityIcon className="size-3" />
                                {duration}s
                            </p>
                        </div>
                    )}
                </div>

                {/* ERROR CONSOLE */}
                {execution.error && (
                    <div className="border border-[#DCD5CB] bg-[#1C1C1C] p-6 rounded-none">
                        <div className="flex items-center gap-2 mb-4">
                            <TerminalIcon className="size-4 text-red-500" />
                            <p className="text-[10px] uppercase tracking-[3px] font-black text-white">Exception Caught</p>
                        </div>
                        <p className="text-[13px] text-red-400 font-mono leading-relaxed">
                            {execution.error}
                        </p>

                        {execution.errorStack && (
                            <Collapsible open={showStackTrace} onOpenChange={setShowStackTrace} className="mt-6">
                                <CollapsibleTrigger asChild>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="rounded-none border-[#DCD5CB]/30 text-[9px] uppercase tracking-widest font-bold text-[#8E8E8E] hover:bg-white hover:text-black transition-all"
                                    >
                                        {showStackTrace ? "Hide Stack Trace" : "View Stack Trace"}
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <pre className="text-[11px] font-mono text-white/60 overflow-auto mt-4 p-4 border border-[#DCD5CB]/10 bg-black/50 leading-5">
                                        {execution.errorStack}
                                    </pre>
                                </CollapsibleContent>
                            </Collapsible>
                        )}
                    </div>
                )}

                {/* OUTPUT DATA LEDGER */}
                {execution.output && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <ActivityIcon className="size-4 text-[#1C1C1C]" />
                            <h3 className="text-[10px] uppercase tracking-[4px] font-black text-[#1C1C1C]">Resulting Payload</h3>
                        </div>
                        <div className="border border-[#DCD5CB] bg-[#F4F1EE]/50 p-6">
                            <pre className="text-[12px] font-mono text-[#1C1C1C] leading-6 overflow-auto">
                                {JSON.stringify(execution.output, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}