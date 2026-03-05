"use client"

import {
    CreditCardIcon,
    LayersIcon,
    HistoryIcon,
    FingerprintIcon,
    LogOutIcon,
    SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
    SidebarGroupContent, SidebarHeader, SidebarMenu, 
    SidebarMenuButton, SidebarMenuItem, useSidebar
} from "@/components/ui/sidebar";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription";
import { useClerk } from "@clerk/nextjs";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { cn } from "@/lib/utils";

const menuItems = [
    {
        title: "Operations",
        items: [
            { title: "Workflows", icons: LayersIcon, url: "/workflows" },
            { title: "Credentials", icons: FingerprintIcon, url: "/credentials" },
            { title: "Executions", icons: HistoryIcon, url: "/executions" },
            { title: "Billing", icons: CreditCardIcon, url: "/billing" },
        ]
    }
];

export const AppSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { signOut } = useClerk();
    const { hasActiveSubscription, isLoading } = useHasActiveSubscription();
    const { setOpen } = useUpgradeModal();
    
    // Grab the state to conditionally hide elements if the built-in 
    // Shadcn utilities aren't catching your custom spans.
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        <Sidebar collapsible="icon" className="border-r border-[#27272A] bg-[#09090B] selection:bg-[#FF6B00]/30">
            <SidebarHeader className="h-20 border-b border-[#27272A] flex flex-col justify-center px-4 bg-[#09090B] overflow-hidden">
                <SidebarMenuItem className="list-none">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="flex aspect-square size-9 shrink-0 items-center justify-center border border-[#FF6B00] bg-[#FF6B00]/10 shadow-[0_0_15px_rgba(255,107,0,0.2)]">
                            <span className="text-[10px] font-black text-[#FF6B00] tracking-tighter">VL-01</span>
                        </div>
                        {/* Only show text when NOT collapsed */}
                        {!isCollapsed && (
                            <div className="flex flex-col gap-y-0 opacity-90 group-hover:opacity-100 transition-opacity">
                                <span className="text-sm font-black tracking-[3px] text-zinc-100 uppercase italic whitespace-nowrap">Vivelune</span>
                                <span className="text-[8px] font-bold text-[#FF6B00] uppercase tracking-[3px] whitespace-nowrap">System Core</span>
                            </div>
                        )}
                    </Link>
                </SidebarMenuItem>
            </SidebarHeader>
            
            <SidebarContent className="px-2 pt-8 bg-[#09090B] overflow-x-hidden">
                {menuItems.map((group) => (
                    <SidebarGroup key={group.title} className="p-0">
                         {!isCollapsed && (
                            <p className="px-4 mb-4 text-[9px] uppercase tracking-[4px] font-black text-zinc-600 whitespace-nowrap">
                                {group.title}
                            </p>
                         )}
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-y-1">
                                {group.items.map((item) => {
                                    const isActive = pathname.startsWith(item.url);
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton 
                                                tooltip={item.title}
                                                isActive={isActive}
                                                asChild
                                                className={cn(
                                                    "relative h-12 px-4 transition-all duration-200 rounded-none group overflow-hidden",
                                                    isActive 
                                                        ? "bg-[#FF6B00]/5 text-[#FF6B00]" 
                                                        : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900",
                                                    // Ensure icon is centered when collapsed
                                                    isCollapsed && "justify-center px-0"
                                                )}
                                            >
                                                <Link href={item.url} className="flex items-center w-full">
                                                    <item.icons className={cn(
                                                        "size-[18px] shrink-0 transition-all",
                                                        isActive ? "text-[#FF6B00] drop-shadow-[0_0_8px_rgba(255,107,0,0.5)]" : "group-hover:text-zinc-100",
                                                        // Margin handling
                                                        !isCollapsed && "mr-4"
                                                    )} />
                                                    {!isCollapsed && (
                                                        <span className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">
                                                            {item.title}
                                                        </span>
                                                    )}
                                                    {/* Active indicator bar */}
                                                    {isActive && !isCollapsed && (
                                                        <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-[#FF6B00]" />
                                                    )}
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="border-t border-[#27272A] p-2 bg-[#0D0D0F] overflow-hidden">
                <SidebarMenu className="gap-y-3">
                    {!hasActiveSubscription && !isLoading && (
                        <SidebarMenuItem>
                            <button 
                                className={cn(
                                    "w-full flex items-center justify-center border border-[#FF6B00] bg-[#FF6B00]/10 text-[#FF6B00] transition-all",
                                    isCollapsed ? "h-10 w-10 mx-auto" : "h-12 gap-x-3 px-3 shadow-[0_0_20px_rgba(255,107,0,0.1)]"
                                )}
                                onClick={() => setOpen(true)}
                                title="Elevate Tier"
                            >
                                <SparklesIcon className="h-4 w-4 shrink-0 fill-current" />
                                {!isCollapsed && <span className="font-black text-[10px] uppercase tracking-[2px] whitespace-nowrap">Elevate Tier</span>}
                            </button>
                        </SidebarMenuItem>
                    )}

                    <SidebarMenuItem>
                        <button 
                            className={cn(
                                "w-full flex items-center text-zinc-600 hover:text-red-500 hover:bg-red-500/5 transition-all group",
                                isCollapsed ? "h-10 w-10 justify-center" : "h-10 px-4 gap-x-4"
                            )}
                            onClick={() => signOut(() => router.push('/'))}
                        >
                            <LogOutIcon className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1" />
                            {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Terminate Session</span>}
                        </button>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};