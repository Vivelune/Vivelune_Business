// src/hooks/use-price.ts
import { useQuery } from '@tanstack/react-query';

export interface PriceInfo {
  id: string;
  nickname: string | null;
  currency: string;
  unitAmount: number | null;
  recurring: {
    interval: 'day' | 'week' | 'month' | 'year';
    interval_count: number;
  } | null;
  productId: string;
  productName: string | null;
  active: boolean;
  metadata: Record<string, string>;
}

export const usePrice = (priceId?: string) => {
  return useQuery({
    queryKey: ['stripe-price', priceId],
    queryFn: async (): Promise<{ price: PriceInfo | null }> => {
      if (!priceId) return { price: null };
      
      const response = await fetch(`/api/stripe/price?priceId=${priceId}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch price');
      }
      
      const data = await response.json();
      return data;
    },
    enabled: !!priceId,
    staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour (prices don't change often)
    refetchOnWindowFocus: false,
  });
};