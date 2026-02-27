"use client"

import {
    CreditCardIcon,
    LayersIcon, // More "ritual/workflow" feel
    HistoryIcon,
    FingerprintIcon, // More "Credential/Security" feel
    LogOutIcon,
    SparklesIcon, // More "Premium" feel than a Star
    LayoutDashboardIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
    SidebarGroupContent, SidebarHeader, SidebarMenu, 
    SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription";
import { useClerk, useUser } from "@clerk/nextjs";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";

const menuItems = [
    {
        title: "The Studio",
        items: [
            {
                title: "Workflows",
                icons: LayersIcon,
                url: "/workflows",
            },
            {
                title: "Credentials",
                icons: FingerprintIcon,
                url: "/credentials",
            },
            {
                title: "Executions",
                icons: HistoryIcon,
                url: "/executions",
            },
            {
                title: "Billing",
                icons: CreditCardIcon,
                url: "/billing",
            },
        ]
    }
];

export const AppSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { signOut } = useClerk();
    const { user } = useUser();
    const { hasActiveSubscription, isLoading } = useHasActiveSubscription();
    const { modal, setOpen } = useUpgradeModal();

    const handleSignOut = () => {
        signOut(() => router.push('/'));
    };

    const handleUpgradeClick = () => {
        setOpen(true);
    };

    return (
        <>
            {modal}
            <Sidebar collapsible="icon" className="border-r border-[#DCD5CB] bg-[#E7E1D8]">
                <SidebarHeader className="border-b border-[#DCD5CB] py-6">
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="gap-x-4 h-12 px-4 hover:bg-transparent active:bg-transparent">
                            <Link prefetch href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-sm bg-[#1C1C1C]">
                                     {/* Replace with your RR Monogram or Logo */}
                                    <span className="text-[10px] font-bold text-[#E7E1D8]">RR</span>
                                </div>
                                <div className="flex flex-col gap-y-0.5">
                                    <span className="text-sm tracking-[3px] uppercase font-semibold text-[#1C1C1C]">Vivelune</span>
                                    <span className="text-[10px] text-[#8E8E8E] leading-none uppercase tracking-wider">Studio</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarHeader>
                
                <SidebarContent className="pt-6">
                    {menuItems.map((group) => (
                        <SidebarGroup key={group.title}>
                             <p className="px-6 mb-2 text-[10px] uppercase tracking-[2px] font-semibold text-[#8E8E8E]">
                                {group.title}
                            </p>
                            <SidebarGroupContent>
                                <SidebarMenu className="px-2">
                                    {group.items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton 
                                                tooltip={item.title}
                                                isActive={
                                                    item.url === "/"
                                                        ? pathname === "/"
                                                        : pathname.startsWith(item.url)
                                                }
                                                asChild
                                                className={`
                                                    gap-x-4 h-11 px-4 transition-all duration-200 rounded-none
                                                    ${pathname.startsWith(item.url) 
                                                        ? "bg-[#1C1C1C] text-[#E7E1D8]" 
                                                        : "text-[#4A4A4A] hover:bg-[#DCD5CB] hover:text-[#1C1C1C]"}
                                                `}
                                            >
                                                <Link href={item.url} prefetch>
                                                    <item.icons className="size-[18px]" />
                                                    <span className="text-xs font-medium tracking-wide">{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}
                </SidebarContent>

                <SidebarFooter className="border-t border-[#DCD5CB] p-4 bg-[#DCD5CB]/30">
                    <SidebarMenu className="gap-y-2">
                        {!hasActiveSubscription && !isLoading && (
                            <SidebarMenuItem>
                                <SidebarMenuButton 
                                    tooltip="Upgrade to Pro"
                                    className="gap-x-4 h-11 bg-[#1C1C1C] text-[#E7E1D8] hover:bg-[#333333] transition-colors rounded-none"
                                    onClick={handleUpgradeClick}
                                >
                                    <SparklesIcon className="h-4 w-4" />
                                    <span className="text-xs uppercase tracking-widest font-bold">Get Pro</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}

                        {isLoading && (
                            <SidebarMenuItem>
                                <SidebarMenuButton 
                                    tooltip="Loading..."
                                    className="gap-x-4 h-11 opacity-50 pointer-events-none"
                                    disabled
                                >
                                    <div className="size-4 rounded-full border border-current border-t-transparent animate-spin" />
                                    <span className="text-xs italic">Loading...</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}

                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                tooltip="Sign Out" 
                                className="gap-x-4 h-11 text-[#8E8E8E] hover:text-[#1C1C1C] hover:bg-transparent transition-colors" 
                                onClick={handleSignOut}
                            >
                                <LogOutIcon className="h-4 w-4" />
                                <span className="text-xs font-medium">Exit Ritual</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </>
    );
};