// src/hooks/use-trpc-error.ts
import { useRouter } from 'next/navigation';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'sonner';

export const useTRPCError = () => {
  const router = useRouter();

  const handleError = (error: unknown) => {
    if (error instanceof TRPCClientError) {
      // Handle account not initialized
      if (error.message === 'ACCOUNT_NOT_INITIALIZED') {
        console.log('🔄 Account not initialized, redirecting to login...');
        toast.error('Account setup taking longer than expected. Please sign in again.');
        router.push('/login?reason=account_not_initialized');
        return true;
      }

      // Handle other TRPC errors
      switch (error.data?.code) {
        case 'UNAUTHORIZED':
          toast.error('Please sign in to continue');
          router.push('/login');
          break;
        case 'FORBIDDEN':
          toast.error('You need an active subscription to access this feature');
          break;
        default:
          toast.error(error.message || 'An error occurred');
      }
      return true;
    }
    return false;
  };

  return { handleError };
};