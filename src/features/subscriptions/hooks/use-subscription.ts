import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"

export const useSubscription = () => {
  const trpc = useTRPC()
  
  return useQuery(trpc.subscriptions.getStatus.queryOptions())
}

export const useHasActiveSubscription = () => {
  const { data, isLoading } = useSubscription()

  return {
    hasActiveSubscription: data?.hasActiveSubscription ?? false,
    isLoading,
  }
}