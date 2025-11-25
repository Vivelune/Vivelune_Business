import { inngest } from '@/inngest/client';
import {  createTRPCRouter, protectedProcedure } from '../init';
import prisma from '@/lib/prisma';
import { email } from 'zod';
export const appRouter = createTRPCRouter({
 getWorkflows: protectedProcedure.query(({ctx})=>{
  return prisma.workflow.findMany()
 }),

 createWorkflow: protectedProcedure.mutation( async ()=>{
  await inngest.send({
    name:"test/hello.world",
    data:{
      email:"hello@vivelune.com"
    }
  });
 
  return { success:true, message:"Workflow creation triggered via Inngest Function"}
  }),
 });

// export type definition of API
export type AppRouter = typeof appRouter;