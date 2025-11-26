import React from 'react'
import { SidebarTrigger } from './ui/sidebar'

const AppHeader = () => {
  return (
    <div>
        <header className='flex h-13 shrink-0 items-center gap-2 border-b px-4 bg-background'>
            <SidebarTrigger/>
        </header>
      
    </div>
  )
}

export default AppHeader
