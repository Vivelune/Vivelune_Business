'use client'

import { ClerkProvider as BaseClerkProvider } from '@clerk/nextjs'

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseClerkProvider
      afterSignInUrl="/workflows"
      afterSignUpUrl="/workflows"
      signInUrl="/login"
      signUpUrl="/signup"
      appearance={{
        elements: {
          formButtonPrimary: 'bg-black hover:bg-gray-800 text-white',
          footerActionLink: 'text-primary hover:text-primary/90',
        },
      }}
    >
      {children}
    </BaseClerkProvider>
  )
}