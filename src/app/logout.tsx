'use client'

import { useClerk } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export const LogoutButton = () => {
  const { signOut } = useClerk()
  const router = useRouter()

  return (
    <Button onClick={() => signOut(() => router.push('/'))}>
      Logout
    </Button>
  )
}