// src/features/billing/hooks/use-billing.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Subscription {
  id: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date | null;
  plan: {
    id: string;
    name: string;
    amount: number;
    currency: string;
    interval: string;
    product: string;
  };
  paymentMethod: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;
  upcomingInvoice: {
    amount: number;
    currency: string;
    date: Date;
  } | null;
}

export interface Invoice {
  id: string;
  number: string;
  date: Date;
  amount: number;
  currency: string;
  status: string;
  pdf: string;
  hostedUrl: string;
}

export const useSubscription = () => {
  return useQuery({
    queryKey: ['billing', 'subscription'],
    queryFn: async (): Promise<{ subscription: Subscription | null }> => {
      const response = await fetch('/api/billing/subscription');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch subscription');
      }
      return response.json();
    },
  });
};

export const useInvoices = () => {
  return useQuery({
    queryKey: ['billing', 'invoices'],
    queryFn: async (): Promise<{ invoices: Invoice[] }> => {
      const response = await fetch('/api/billing/invoices');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch invoices');
      }
      return response.json();
    },
  });
};

export const useBillingPortal = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create portal session');
      }
      const data = await response.json();
      return data.url;
    },
    onSuccess: (url) => {
      window.location.href = url;
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cancelAtPeriodEnd: boolean) => {
      const response = await fetch('/api/billing/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancelAtPeriodEnd }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update subscription');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing', 'subscription'] });
    },
  });
};