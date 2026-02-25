// src/features/executions/components/openai/hooks/use-openai-models.ts
import { useQuery } from '@tanstack/react-query';

interface OpenAIModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

export const useOpenAIModels = () => {
  return useQuery({
    queryKey: ['openai-models'],
    queryFn: async (): Promise<OpenAIModel[]> => {
      const response = await fetch('/api/openai/models');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch models');
      }
      const data = await response.json();
      return data.models;
    },
    staleTime: 1000 * 60 * 60, // 1 hour - models don't change often
    retry: 2,
  });
};