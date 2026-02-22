import { requireUnauth } from '@/lib/auth-utils'
import { SignIn } from '@clerk/nextjs'



const Page = async () => {

  await requireUnauth()

  return (
    <div className='flex justify-center items-center min-h-screen'>
        <SignIn/>
    </div>
    
  )
}

export default Page
