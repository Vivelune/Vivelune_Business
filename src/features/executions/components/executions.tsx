"use client"
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, ErrorView, LoadingView } from "@/components/entity-components";
import { formatDistanceToNow } from "date-fns";
import { ExecutionStatus } from "@/generated/prisma/enums";
import type { Credential, Execution } from "@/generated/prisma/client";
import { useExecutionsParams } from "../hooks/use-executions-params";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon, ActivityIcon, ZapIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ExecutionsHeader
 * Clean, architectural header with wide tracking.
 */
export const ExecutionsHeader = () => {
    return (
        <EntityHeader
            title="Protocol Logs"
            description="Historical ledger of ritual executions and intelligence cycles."
        />
    )
}

export const ExecutionsList = () => {
    const executions = useSuspenseExecutions();
    return (
        <div className="border-t border-[#DCD5CB]">
            <EntityList 
                items={executions.data.items}
                getKey={(execution) => execution.id}
                renderItem={(execution) => <ExecutionItem data={execution} />}
                emptyView={<ExecutionsEmpty />}
            />
        </div>
    ) 
}

export const ExecutionsPagination = () => {
    const executions = useSuspenseExecutions();
    const [params, setParams] = useExecutionsParams();
    
    return (
        <EntityPagination
            disabled={executions.isFetching}
            totalPages={executions.data.totalPages}
            page={executions.data.page}
            onPageChange={(page) => setParams({ ...params, page })}
        />
    )
}

export const ExecutionsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <EntityContainer
            header={<ExecutionsHeader />}
            pagination={<ExecutionsPagination />}
        >
            {children}
        </EntityContainer>
    )
}

export const ExecutionsLoading = () => <LoadingView message="DECRYPTING LOGS..." />
export const ExecutionsError = () => <ErrorView message="LOG ACCESS DENIED: ERROR" />
export const ExecutionsEmpty = () => (
    <EmptyView message="No execution history found in the vault. Initialize a workflow to generate logs." />
)

/**
 * Technical Status Icons
 * Replaced colorful icons with high-contrast, mechanical versions.
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
    return status.toUpperCase();
}

/**
 * ExecutionItem
 * Re-imagined as a line entry in a technical audit log.
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
    const duration = data.completedAt
        ? Math.round((new Date(data.completedAt).getTime() - new Date(data.startedAt).getTime()) / 1000)
        : null;

    return (
        <EntityItem 
            href={`/executions/${data.id}`} 
            className="group hover:bg-[#E7E1D8]/50 border-b border-[#DCD5CB] last:border-0 transition-all duration-200"
            title={formatStatus(data.status)}
            subtitle={
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#8E8E8E] mt-1">
                    <span className="text-[#1C1C1C] flex items-center gap-1">
                        <ZapIcon className="size-3" />
                        {data.workflow.name}
                    </span>
                    <span className="text-[#DCD5CB]">/</span>
                    <span>{formatDistanceToNow(data.startedAt, { addSuffix: true })}</span>
                    {duration !== null && (
                        <>
                            <span className="text-[#DCD5CB]">/</span>
                            <span className="flex items-center gap-1">
                                <ActivityIcon className="size-3" />
                                {duration}S LATENCY
                            </span>
                        </>
                    )}
                </div>
            }
            image={
                <div className={cn(
                    "size-10 bg-white border border-[#DCD5CB] flex items-center justify-center transition-all",
                    data.status === ExecutionStatus.FAILED ? "border-red-200 bg-red-50/50" : "group-hover:border-[#1C1C1C]"
                )}>
                    {getStatusIcon(data.status)}
                </div>
            }
        />
    )
}