// src/providers/hydration-provider.tsx
"use client"

import * as React from "react"

export const HydrationProvider = ({ children }: { children: React.ReactNode }) => {
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    setHydrated(true)
  }, [])

  if (!hydrated) {
    // Return a skeleton or null while hydrating
    return null
  }

  return <>{children}</>
}