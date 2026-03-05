"use client";

import React from 'react';
import { SidebarTrigger } from './ui/sidebar';
import { UserButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { Terminal, Activity } from 'lucide-react';

const AppHeader = () => {
    return (
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[#27272A] bg-[#09090B] px-6 sticky top-0 z-50">
            {/* Sidebar Toggle with Industrial Hover */}
            <SidebarTrigger className="h-9 w-9 rounded-none border border-zinc-800 hover:border-[#FF6B00] hover:bg-[#FF6B00]/5 hover:text-[#FF6B00] transition-all" />
            
            {/* System Status Indicator (Optional Visual Flair) */}
            <div className="hidden md:flex items-center gap-4 px-4 border-l border-zinc-800 ml-2">
                <div className="flex items-center gap-2">
                    <Activity className="size-3 text-[#FF6B00] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[2px] text-zinc-500">
                        System: <span className="text-zinc-200">Nominal</span>
                    </span>
                </div>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-4">
                {/* Visual Separator for the User Action Zone */}
                <div className="h-4 w-[1px] bg-zinc-800 mx-2" />
                
                <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                        baseTheme: dark,
                        elements: {
                            // Match the avatar to the "Square/Rigid" aesthetic
                            avatarBox: "w-9 h-9 rounded-none border border-zinc-800 hover:border-[#FF6B00] transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)]",
                            userButtonPopoverCard: "border border-[#27272A] bg-[#09090B] shadow-2xl rounded-none mt-2",
                            userButtonPopoverActionButton: "hover:bg-[#FF6B00]/10 hover:text-[#FF6B00] rounded-none py-3",
                            userButtonPopoverActionButtonText: "text-[11px] uppercase tracking-widest font-bold",
                            userButtonTrigger: "focus:shadow-none focus:outline-none",
                        }
                    }}
                />
            </div>
        </header>
    );
};

export default AppHeader;