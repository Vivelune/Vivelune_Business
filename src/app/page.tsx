"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { requireAuth } from "@/lib/auth-utils"
import { caller } from "@/trpc/server"
import { LogoutButton } from "./logout"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { toast } from "sonner"


const Page =  () => {
    

const trpc = useTRPC()

const queryClient = useQueryClient()
const {data} = useQuery(trpc.getWorkflows.queryOptions())




const testAi= useMutation(trpc.testAi.mutationOptions(
  
  {
    onSuccess:()=>{
     toast.success("Success! AI Job Queued ")
    }
  }
))


const create = useMutation(trpc.createWorkflow.mutationOptions(
  {
    onSuccess:()=>{
     toast.success("Hooray! Workflow creation triggered.")
    }
  }
))
  
  return (
    <div className='min-h-screen flex min-w-full flex-col
    items-center justify-center gap-y-6'>
      <h1 className='text-2xl mb-4'>Protected Page</h1>
      
      <div>{JSON.stringify(data, null, 2)}</div>
      <Button disabled={testAi.isPending} onClick={()=>testAi.mutate()}>Test AI</Button>
      <Button disabled={create.isPending} onClick={()=>create.mutate()} >
        Create Workflow
      </Button>
      <LogoutButton/>
    </div>
  )
}

export default Page
