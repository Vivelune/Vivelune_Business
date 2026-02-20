'use client'

import { SignUp } from '@clerk/nextjs'

export function RegisterForm() {
  return (
    <div className="flex flex-col gap-6">
      <SignUp 
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