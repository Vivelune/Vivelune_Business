
import { credentialsRouter } from '@/features/credentials/server/routers';
import {  createTRPCRouter, } from '../init';

import { workflowsRouter } from '@/features/workflows/server/routers';
import { executionsRouter } from '@/features/executions/server/routers';
import { clerkTriggerRouter } from '@/features/triggers/components/clerk/server/routers';






export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credentials : credentialsRouter,
  executions : executionsRouter,
  clerk: clerkTriggerRouter
 });

// export type definition of API
export type AppRouter = typeof appRouter;