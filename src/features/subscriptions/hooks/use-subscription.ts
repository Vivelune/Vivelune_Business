// src/features/subscriptions/hooks/use-subscription.ts
import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

export interface SubscriptionInfo {
  id: string;
  status: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  priceId: string;
  productId: string;
}

export const useSubscription = () => {
  const { user } = useUser();

  return useQuery({
    queryKey: ['stripe-subscription', user?.id],
    queryFn: async (): Promise<{ subscription: SubscriptionInfo | null }> => {
      console.log('🔍 Fetching subscription status for user:', user?.id);
      
      const response = await fetch('/api/stripe/subscription');
      
      if (!response.ok) {
        // If any error, return null subscription (don't throw)
        console.error('❌ Subscription API error:', await response.text());
        return { subscription: null };
      }
      
      const data = await response.json();
      console.log('📦 Subscription data received:', data);
      
      return data;
    },
    enabled: !!user,
    refetchInterval: 60000, // Refetch every minute
    retry: false, // Don't retry on failure
  });
};

export const useHasActiveSubscription = () => {
  const { data, isLoading, error, ...rest } = useSubscription();
  
  // Consider both 'active' and 'trialing' as active
  const hasActiveSubscription = data?.subscription?.status === 'active' || 
                                data?.subscription?.status === 'trialing';
  
  console.log('📊 Subscription status:', {
    hasActiveSubscription,
    status: data?.subscription?.status,
    isLoading,
    error,
  });

  return {
    hasActiveSubscription,
    subscription: data?.subscription,
    isLoading,
    error,
    ...rest,
  };
};