import { requireUnauth } from '@/lib/auth-utils'
import { SignIn } from '@clerk/nextjs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'



const Page = async ({ searchParams }: { searchParams: Promise<{ reason?: string }> }) => {
  await requireUnauth()
  const { reason } = await searchParams
  
  return (
    <div className='flex justify-center items-center min-h-screen'>
      {reason === 'account_not_initialized' && (
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your account is taking longer than expected to initialize. 
            Please try signing in again.
          </AlertDescription>
        </Alert>
      )}
        <SignIn/>
    </div>
    
  )
}

export default Page
