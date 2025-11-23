

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { requireAuth } from "@/lib/auth-utils"
import { caller } from "@/trpc/server"
import { LogoutButton } from "./logout"


const Page = async  () => {
    
await requireAuth()

const data = await caller.getUsers();
  
  return (
    <div className='min-h-screen flex min-w-full flex-col
    items-center justify-center gap-y-6'>
      <h1 className='text-2xl mb-4'>Protected Page</h1>
      
      <div>{JSON.stringify(data, null, 2)}</div>
      <LogoutButton/>
    </div>
  )
}

export default Page
