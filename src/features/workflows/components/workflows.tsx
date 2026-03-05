"use client"

import { 
    EmptyView, 
    EntityContainer, 
    EntityHeader, 
    EntityItem, 
    EntityList, 
    EntityPagination, 
    EntitySearch, 
    ErrorView, 
    LoadingView 
} from "@/components/entity-components";
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { UseEntitySearch } from "@/hooks/use-entity-search";
import type { Workflow } from "@/generated/prisma/client";
import { WorkflowIcon, TerminalIcon, ActivityIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

/**
 * SEARCH REFINED FOR TACTICAL UI
 */
export const WorkflowsSearch = () => {
    const [params, setParams] = useWorkflowsParams()
    const { searchValue, onSearchChange } = UseEntitySearch({
        params,
        setParams,
    })

    return (
        <EntitySearch 
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search_Workflow_Registry..."
        />
    )
}

/**
 * LIST LOGIC (UNCHANGED)
 */
export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows();

    if (workflows.data.items.length === 0) {
        return <WorkflowsEmpty />
    }

    return (
        <EntityList 
            items={workflows.data.items}
            getKey={(workflow) => workflow.id}
            renderItem={(workflow) => <WorkflowItem data={workflow} />}
            emptyView={<WorkflowsEmpty />}
        />
    )
}

/**
 * HEADER WITH TACTICAL LABELS
 */
export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
    const createWorkflow = useCreateWorkflow();
    const router = useRouter()
    const { handleError, modal } = useUpgradeModal()

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`)
            },
            onError: (error) => {
                handleError(error)
            }
        })
    }

    return (
        <>
            {modal}
            <EntityHeader 
                title="Workflow_Registry"
                description="Initialize and manage operational automation sequences."
                onNew={handleCreate}
                newButtonLabel="Initialize_Sequence"
                disabled={disabled}
                isCreating={createWorkflow.isPending}
            />
        </>
    )
}

/**
 * PAGINATION (UNCHANGED LOGIC)
 */
export const WorkflowsPagination = () => {
    const workflows = useSuspenseWorkflows();
    const [params, setParams] = useWorkflowsParams();

    return (
        <EntityPagination
            disabled={workflows.isFetching}
            totalPages={workflows.data.totalPages}
            page={workflows.data.page}
            onPageChange={(page: number) => setParams({ ...params, page })}
        />
    )
}

/**
 * CONTAINER (UNCHANGED LOGIC)
 */
export const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <EntityContainer
            header={<WorkflowsHeader />}
            search={<WorkflowsSearch />}
            pagination={<WorkflowsPagination />}
        >
            {children}
        </EntityContainer>
    )
}

/**
 * TELEMETRY STATE VIEWS
 */
export const WorkflowsLoading = () => {
    return <LoadingView message="Syncing_Registry..." />
}

export const WorkflowsError = () => {
    return <ErrorView message="Registry_Access_Denied" />
}

/**
 * EMPTY VIEW WITH TACTICAL MESSAGE
 */
export const WorkflowsEmpty = () => {
    const createWorkflow = useCreateWorkflow()
    const router = useRouter()
    const { handleError, modal } = useUpgradeModal();
    
    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onError: (error) => handleError(error),
            onSuccess: (data) => router.push(`/workflows/${data.id}`)
        })
    }

    return (
        <>
            {modal}
            <EmptyView 
                onNew={handleCreate} 
                message="Zero workflows identified in current sector. Deploy your first automated sequence."
            />
        </>
    )
}

/**
 * ITEM REAMPED WITH MONO SUBTITLES
 */
export const WorkflowItem = ({ data }: { data: Workflow }) => {
    const removeWorkflow = useRemoveWorkflow();

    const handleRemove = () => {
        removeWorkflow.mutate({ id: data.id })
    }

    return (
        <EntityItem 
            href={`/workflows/${data.id}`} 
            title={data.name || "Untitled_Sequence"}
            subtitle={
                <div className="flex items-center gap-x-3 font-mono">
                    <span className="flex items-center gap-1">
                        <ActivityIcon className="size-2.5 text-zinc-500" />
                        MOD_{formatDistanceToNow(data.updatedAt, { addSuffix: true }).toUpperCase()}
                    </span>
                    <span className="text-zinc-800">//</span>
                    <span className="flex items-center gap-1">
                        <TerminalIcon className="size-2.5 text-zinc-500" />
                        INIT_{formatDistanceToNow(data.createdAt, { addSuffix: true }).toUpperCase()}
                    </span>
                </div>
            }
            image={
                <div className="flex items-center justify-center">
                    <WorkflowIcon className="size-5 text-zinc-500 group-hover:text-[#FF6B00] transition-colors" />
                </div>
            }
            onRemove={handleRemove}
            isRemoving={removeWorkflow.isPending}
        />
    )
}