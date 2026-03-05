"use client"

import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, ErrorView, LoadingView } from "@/components/entity-components";
import { formatDistanceToNow } from "date-fns";
import { ExecutionStatus } from "@/generated/prisma/enums";
import type { Execution } from "@/generated/prisma/client";
import { useExecutionsParams } from "../hooks/use-executions-params";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { 
    CheckCircle2Icon, 
    ClockIcon, 
    Loader2Icon, 
    XCircleIcon, 
    ActivityIcon, 
    ZapIcon,
    ChevronRight,
    Terminal,
    Database
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * ExecutionsHeader
 * Re-imagined as a system terminal header.
 */
export const ExecutionsHeader = () => {
    return (
        <div className="px-8 py-10 bg-zinc-950 border-b border-zinc-800/50">
            <div className="flex items-center gap-2 mb-2">
                <Terminal className="size-4 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-[4px] text-zinc-500">System_Auditor</span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-100">
                Protocol Logs
            </h1>
            <p className="text-xs text-zinc-500 mt-2 font-medium tracking-tight">
                Historical ledger of ritual executions and neural intelligence cycles.
            </p>
        </div>
    )
}

export const ExecutionsList = () => {
    const executions = useSuspenseExecutions();
    return (
        <div className="bg-zinc-950 min-h-screen">
            <EntityList 
                items={executions.data.items}
                getKey={(execution) => execution.id}
                renderItem={(execution) => <ExecutionItem data={execution} />}
                emptyView={<ExecutionsEmpty />}
            />
        </div>
    ) 
}

const getStatusConfig = (status: ExecutionStatus) => {
    switch (status) {
        case ExecutionStatus.SUCCESS:
            return { icon: CheckCircle2Icon, color: "text-emerald-500", label: "Operational" };
        case ExecutionStatus.FAILED:
            return { icon: XCircleIcon, color: "text-red-500", label: "Fault" };
        case ExecutionStatus.RUNNING:
            return { icon: Loader2Icon, color: "text-blue-500", label: "Processing" };
        default:
            return { icon: ClockIcon, color: "text-zinc-600", label: "Queued" };
    }
}

/**
 * ExecutionItem
 * Re-designed as a technical line entry in a dark UI.
 */
export const ExecutionItem = ({
    data
}: {
    data: Execution & {
        workflow: {
            id: string;
            name: string;
        }
    }
}) => {
    const config = getStatusConfig(data.status);
    const StatusIcon = config.icon;
    
    const duration = data.completedAt
        ? Math.round((new Date(data.completedAt).getTime() - new Date(data.startedAt).getTime()) / 1000)
        : null;

    return (
        <EntityItem 
            href={`/executions/${data.id}`} 
            className="group relative bg-zinc-950 hover:bg-zinc-900/50 border-b border-zinc-900 transition-all duration-200 py-6 px-8 overflow-hidden"
            title={
                <div className="flex items-center gap-3">
                    <span className="text-[13px] font-black uppercase tracking-tight text-zinc-200 group-hover:text-white transition-colors">
                        {config.label}
                    </span>
                    <Badge variant="outline" className={cn(
                        "text-[8px] font-black uppercase tracking-widest px-1.5 py-0 h-4 border-zinc-800",
                        data.status === ExecutionStatus.SUCCESS && "text-emerald-500",
                        data.status === ExecutionStatus.FAILED && "text-red-500",
                        data.status === ExecutionStatus.RUNNING && "text-blue-500"
                    )}>
                        {data.status}
                    </Badge>
                </div>
            }
            subtitle={
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider mt-2">
                    <span className="text-zinc-400 flex items-center gap-1.5 group-hover:text-zinc-100 transition-colors">
                        <ZapIcon className="size-3 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                        {data.workflow.name}
                    </span>
                    <span className="text-zinc-800">/</span>
                    <span className="text-zinc-500 font-mono tracking-tighter">
                        {formatDistanceToNow(data.startedAt, { addSuffix: true })}
                    </span>
                    {duration !== null && (
                        <>
                            <span className="text-zinc-800">/</span>
                            <span className="flex items-center gap-1.5 text-zinc-500">
                                <ActivityIcon className="size-3 text-zinc-600" />
                                {duration}s Latency
                            </span>
                        </>
                    )}
                </div>
            }
            image={
                <div className={cn(
                    "size-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-zinc-700 shadow-inner",
                    data.status === ExecutionStatus.FAILED && "bg-red-500/5 border-red-500/20"
                )}>
                    <StatusIcon className={cn(
                        "size-5",
                        config.color,
                        data.status === ExecutionStatus.RUNNING && "animate-spin"
                    )} />
                </div>
            }
            /* Action indicator visible on hover */
            actions={
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black uppercase tracking-[2px] text-zinc-600">View_Report</span>
                    <ChevronRight className="size-4 text-zinc-600" />
                </div>
            }
        />
    )
}

export const ExecutionsPagination = () => {
    const executions = useSuspenseExecutions();
    const [params, setParams] = useExecutionsParams();
    
    return (
        <div className="bg-zinc-950 border-t border-zinc-900 p-6">
            <EntityPagination
                disabled={executions.isFetching}
                totalPages={executions.data.totalPages}
                page={executions.data.page}
                onPageChange={(page : number) => setParams({ ...params, page })}
            />
        </div>
    )
}

export const ExecutionsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="max-w-6xl mx-auto my-10 px-4">
            <EntityContainer
                header={<ExecutionsHeader />}
                pagination={<ExecutionsPagination />}
            >
                <div className="relative border border-zinc-800 bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl">
                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Database className="size-24 text-white" />
                    </div>
                    {children}
                </div>
            </EntityContainer>
        </div>
    )
}

export const ExecutionsLoading = () => (
    <div className="h-64 flex flex-col items-center justify-center bg-zinc-950 border border-zinc-800 rounded-2xl">
        <Loader2Icon className="size-8 text-emerald-500 animate-spin mb-4" />
        <span className="text-[10px] font-black tracking-[4px] text-zinc-500 uppercase">Decrypting_Logs...</span>
    </div>
)

export const ExecutionsError = () => (
    <ErrorView message="LOG_ACCESS_DENIED: Critical fault in vault decryption."/>
)

export const ExecutionsEmpty = () => (
    <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="size-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
            <Database className="size-6 text-zinc-700" />
        </div>
        <p className="max-w-xs text-xs text-zinc-500 font-medium leading-relaxed">
            Vault is currently empty. No execution history detected. <br/> 
            <span className="text-emerald-500/50 italic">Initialize a workflow to generate logs.</span>
        </p>
    </div>
)