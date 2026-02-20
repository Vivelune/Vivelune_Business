'use client'

import { SignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  return (
    <div className="flex flex-col gap-6">
      <SignIn 
        appearance={{
          elements: {
            rootBox: 'mx-auto w-full',
            card: 'shadow-none border-0',
          }
        }}
      />
    </div>
  )
}