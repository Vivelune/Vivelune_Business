// src/components/app-side.tsx
"use client"

import {
    CreditCardIcon,
    FolderOpenIcon,
    HistoryIcon,
    KeyIcon,
    LogOutIcon,
    StarIcon,
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
        title: "Main",
        items: [
            {
                title: "Workflows",
                icons: FolderOpenIcon,
                url: "/workflows",
            },
            {
                title: "Credentials",
                icons: KeyIcon,
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
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="gap-x-4 h-20 px-4">
                            <Link prefetch href="/">
                                <Image 
                                    src="/logo-primary.png" 
                                    alt="Vivelune Business Logo" 
                                    width={50} 
                                    height={50} 
                                    className='' 
                                />
                                <span className="text-xl uppercase font-bold">Vivelune</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarHeader>
                
                <SidebarContent>
                    {menuItems.map((group) => (
                        <SidebarGroup key={group.title}>
                            <SidebarGroupContent>
                                <SidebarMenu>
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
                                                className="gap-x-4 h-10 px-4"
                                            >
                                                <Link href={item.url} prefetch>
                                                    <item.icons className="size-4" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenu>
                        {/* Show upgrade button only if no active subscription and not loading */}
                        {!hasActiveSubscription && !isLoading && (
                            <SidebarMenuItem>
                                <SidebarMenuButton 
                                    tooltip="Upgrade to Pro"
                                    className="gap-x-4 bg-primary/10 text-primary hover:bg-primary/20"
                                    onClick={handleUpgradeClick}
                                >
                                    <StarIcon className="h-4 w-4" />
                                    <span>Get Vivelune Pro</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}

                        {/* Show loading state */}
                        {isLoading && (
                            <SidebarMenuItem>
                                <SidebarMenuButton 
                                    tooltip="Loading..."
                                    className="gap-x-4 opacity-50"
                                    disabled
                                >
                                    <StarIcon className="h-4 w-4" />
                                    <span>Loading...</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}

                        {/* Sign out button - always visible */}
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                tooltip="Sign Out" 
                                className="gap-x-4" 
                                onClick={handleSignOut}
                            >
                                <LogOutIcon className="h-4 w-4" />
                                <span>Sign Out</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </>
    );
};