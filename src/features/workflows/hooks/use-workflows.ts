// src/features/workflows/hooks/use-workflows.ts

import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";
import { useRouter } from "next/navigation";
import { TRPCClientError } from "@trpc/client";

// Helper to handle account initialization errors
const handleTRPCError = (error: unknown, router: ReturnType<typeof useRouter>) => {
  if (error instanceof TRPCClientError) {
    if (error.message === 'ACCOUNT_NOT_INITIALIZED') {
      console.log('🔄 Account not initialized, redirecting to login...');
      toast.error('Account setup is taking longer than expected. Please sign in again.');
      router.push('/login?reason=account_not_initialized');
      return true;
    }
  }
  return false;
};

export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowsParams();
  const router = useRouter();
  
  try {
    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
  } catch (error) {
    handleTRPCError(error, router);
    throw error; // Re-throw to maintain suspense boundary
  }
}

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const router = useRouter();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" Created`);
        queryClient.invalidateQueries(
          trpc.workflows.getMany.queryOptions({}),
        );
      },
      onError: (error) => {
        if (!handleTRPCError(error, router)) {
          toast.error(`Failed to create workflow: ${error.message}`);
        }
      }
    })
  );
}

// Hook to remove workflow
export const useRemoveWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    trpc.workflows.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" Removed`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryFilter({ id: data.id }),
        );
      },
      onError: (error) => {
        if (!handleTRPCError(error, router)) {
          toast.error(`Failed to remove workflow: ${error.message}`);
        }
      }
    })
  );
}

export const useSuspenseWorkflow = (id: string) => {
  const trpc = useTRPC();
  const router = useRouter();
  
  try {
    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
  } catch (error) {
    handleTRPCError(error, router);
    throw error;
  }
};

export const useUpdateWorkflowName = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const router = useRouter();

  return useMutation(
    trpc.workflows.updateName.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" updated`);
        queryClient.invalidateQueries(
          trpc.workflows.getMany.queryOptions({}),
        );
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error) => {
        if (!handleTRPCError(error, router)) {
          toast.error(`Failed to update workflow: ${error.message}`);
        }
      }
    })
  );
}

export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const router = useRouter();

  return useMutation(
    trpc.workflows.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" saved`);
        queryClient.invalidateQueries(
          trpc.workflows.getMany.queryOptions({}),
        );
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error) => {
        if (!handleTRPCError(error, router)) {
          toast.error(`Failed to save workflow: ${error.message}`);
        }
      }
    })
  );
}

export const useExecuteWorkflow = () => {
  const trpc = useTRPC();
  const router = useRouter();

  return useMutation(
    trpc.workflows.execute.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" executed`);
      },
      onError: (error) => {
        if (!handleTRPCError(error, router)) {
          toast.error(`Failed to execute workflow: ${error.message}`);
        }
      }
    })
  );
}   