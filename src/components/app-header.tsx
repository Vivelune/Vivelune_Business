"use client"
import React from 'react'
import { SidebarTrigger } from './ui/sidebar'

const AppHeader = () => {
  return (
    <div>
        <header className='flex h-14 shrink-0 items-center gap-2 border-b border-[#DCD5CB] px-6 bg-[#F4F1EE]/80 backdrop-blur-md sticky top-0 z-10'>
            <SidebarTrigger className="hover:bg-[#E7E1D8] rounded-none transition-colors" />
            <div className="ml-auto">
               <span className="text-[10px] tracking-[3px] uppercase font-bold text-[#1C1C1C]/40">Studio v1.0</span>
            </div>
        </header>
    </div>
  )
}

export default AppHeader