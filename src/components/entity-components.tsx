"use client"

import { 
    AlertTriangleIcon, 
    Loader2Icon, 
    MoreVerticalIcon, 
    PackageOpenIcon, 
    PlusIcon, 
    SearchIcon, 
    TrashIcon, 
    ArrowRightIcon, 
    TerminalIcon,
    BoxSelectIcon 
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { cn } from "@/lib/utils";
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

/**
 * ENTITY CONTAINER
 */
export const EntityContainer = ({
    children,
    header,
    search,
    pagination,
}: { children: React.ReactNode; header?: React.ReactNode; search?: React.ReactNode; pagination?: React.ReactNode }) => {
    return (
        <div className="p-4 md:px-10 md:py-8 h-full bg-[#09090B]">
            <div className="mx-auto max-w-screen-2xl flex flex-col gap-y-8 h-full">
                {header}
                <div className="flex flex-col gap-y-4 h-full">
                    {search}
                    {children}
                </div>
                {pagination}
            </div>
        </div>
    )
}

/**
 * ENTITY HEADER
 */
type EntityHeaderProps = {
    title: string;
    description?: string;
    newButtonLabel?: string;
    disabled?: boolean;
    isCreating?: boolean;
} & (
    | { onNew: () => void; newButtonHref?: never }
    | { newButtonHref: string; onNew?: never }
    | { onNew?: never; newButtonHref?: never }
)

export const EntityHeader = ({
    title,
    description,
    onNew,
    newButtonHref,
    newButtonLabel,
    disabled,
    isCreating,
}: EntityHeaderProps) => {
    return (
        <div className="flex flex-row items-center justify-between gap-x-4 border-b border-zinc-800 pb-8 mb-2">
            <div className="flex flex-col">
                <h1 className="text-2xl font-black uppercase tracking-[4px] italic text-zinc-100">
                    {title}
                </h1>
                {description && (
                    <p className="text-[10px] font-bold uppercase tracking-[2.5px] text-zinc-500 mt-2">
                        {description}
                    </p>
                )}
            </div>
            {(onNew || newButtonHref) && (
                <Button 
                    disabled={isCreating || disabled} 
                    className="bg-[#FF6B00] text-black hover:bg-[#FF8533] rounded-none h-11 px-8 font-black uppercase text-[11px] tracking-widest transition-all group shadow-[0_0_20px_rgba(255,107,0,0.15)]"
                    onClick={onNew}
                    asChild={!!newButtonHref}
                >
                    {newButtonHref ? (
                        <Link href={newButtonHref} prefetch>
                            <PlusIcon className="mr-2 size-4 stroke-[3px]" />
                            {newButtonLabel || "Initialize"}
                        </Link>
                    ) : (
                        <div className="flex items-center">
                            <PlusIcon className="mr-2 size-4 stroke-[3px]" />
                            {newButtonLabel || "Initialize"}
                        </div>
                    )}
                </Button>
            )}
        </div>
    )
}

/**
 * ENTITY LIST
 */
export function EntityList<T>({
    items, 
    renderItem,
    getKey,
    emptyView,
    className,
}: { items: T[]; renderItem: (item: T, index: number) => React.ReactNode; getKey?: (item: T, index: number) => string | number; emptyView?: React.ReactNode; className?: string }) {
    if (items.length === 0 && emptyView) {
        return <div className="flex-1 flex justify-center items-center py-20">{emptyView}</div>
    }
    return (
        <div className={cn("flex flex-col gap-y-3", className)}>
            {items.map((item, index) => (
                <div key={getKey ? getKey(item, index) : index}>
                    {renderItem(item, index)}
                </div>
            ))}
        </div>
    )
}

/**
 * EMPTY VIEW (The missing component)
 */
export const EmptyView = ({ message, onNew }: { message?: string; onNew?: () => void }) => {
    return (
        <div className="w-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-900 bg-zinc-950/20 text-center">
            <div className="size-16 border border-zinc-800 flex items-center justify-center mb-6 bg-black">
                <BoxSelectIcon className="size-8 text-zinc-700 opacity-50" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[4px] text-zinc-400 mb-2">Null Vector Detected</h3>
            <p className="text-[10px] uppercase tracking-widest text-zinc-600 max-w-[240px] leading-relaxed mb-8">
                {message || "No records identified in current data segment."}
            </p>
            {onNew && (
                <Button 
                    onClick={onNew}
                    variant="outline"
                    className="rounded-none border-zinc-800 text-zinc-400 hover:text-[#FF6B00] hover:border-[#FF6B00] uppercase text-[9px] font-black tracking-widest"
                >
                    Create First Entry
                </Button>
            )}
        </div>
    )
}

/**
 * ENTITY ITEM
 */
export const EntityItem = ({
    href,
    title,
    subtitle,
    image,
    actions,
    onRemove,
    isRemoving,
    className,
}: any) => {
    return (
        <Link href={href} prefetch className="group block">
            <div className={cn(
                "relative flex flex-row items-center justify-between p-5 bg-[#0D0D0F] border border-zinc-900 transition-all hover:border-[#FF6B00]/40 hover:bg-zinc-900/40",
                isRemoving && "opacity-40 grayscale pointer-events-none", 
                className
            )}>
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-transparent group-hover:bg-[#FF6B00] transition-colors" />
                <div className="flex items-center gap-5">
                    {image && <div className="size-10 border border-zinc-800 flex items-center justify-center bg-black">{image}</div>}
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[2px] text-zinc-100 group-hover:text-[#FF6B00] transition-colors">{title}</h3>
                        {subtitle && <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-tight mt-1">{subtitle}</div>}
                    </div>
                </div>
                <div className="flex items-center gap-x-4">
                    {actions}
                    <ArrowRightIcon className="size-3 text-zinc-800 group-hover:text-[#FF6B00] group-hover:translate-x-1 transition-all" />
                    {onRemove && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-700 hover:text-red-500 rounded-none">
                                    <MoreVerticalIcon className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#09090B] border-zinc-800 rounded-none min-w-[160px]">
                                <DropdownMenuItem onClick={onRemove} className="text-red-500 focus:bg-red-500/10 focus:text-red-500 uppercase text-[10px] font-black tracking-widest cursor-pointer">
                                    <TrashIcon className="mr-2 size-3" />
                                    Purge Record
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </Link>
    )
}

/**
 * TELEMETRY VIEWS (Loading/Error)
 */
export const LoadingView = ({ message = "EXECUTING_QUERY..." }: { message?: string }) => (
    <div className="flex flex-col justify-center items-center h-64 border border-zinc-900 bg-zinc-950/40">
        <Loader2Icon className="size-8 animate-spin text-[#FF6B00] mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[4px] text-[#FF6B00] animate-pulse">{message}</p>
    </div>
);

export const ErrorView = ({ message = "SYSTEM_FAILURE" }: { message?: string }) => (
    <div className="flex flex-col justify-center items-center h-64 border border-red-900/20 bg-red-950/10">
        <AlertTriangleIcon className="size-8 text-red-600 mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[4px] text-red-600">{message}</p>
    </div>
);

/**
 * ENTITY SEARCH & PAGINATION
 */
export const EntitySearch = ({ value, onChange, placeholder = "FILTER_RECORDS..." }: any) => (
    <div className="relative">
        <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
        <Input
            className="w-full md:w-[280px] bg-zinc-900/30 border-zinc-800 rounded-none pl-10 text-[10px] uppercase font-bold tracking-widest placeholder:text-zinc-700 focus-visible:ring-1 focus-visible:ring-[#FF6B00]"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

export const EntityPagination = ({ page, totalPages, onPageChange, disabled }: any) => (
    <div className="flex items-center justify-between py-6 border-t border-zinc-900 mt-6">
        <div className="text-[9px] font-black uppercase tracking-[3px] text-zinc-700 italic">
            Sequence <span className="text-zinc-400">{page}</span> // Total <span className="text-zinc-400">{totalPages || 1}</span>
        </div>
        <div className="flex gap-3">
            <Button disabled={page === 1 || disabled} onClick={() => onPageChange(page - 1)} className="bg-transparent border border-zinc-800 text-zinc-600 hover:text-white rounded-none text-[9px] font-black h-9 px-4">Prev_Step</Button>
            <Button disabled={page === totalPages || totalPages === 0 || disabled} onClick={() => onPageChange(page + 1)} className="bg-transparent border border-zinc-800 text-zinc-600 hover:text-white rounded-none text-[9px] font-black h-9 px-4">Next_Step</Button>
        </div>
    </div>
);