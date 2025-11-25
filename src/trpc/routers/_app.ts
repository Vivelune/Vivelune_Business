import { inngest } from '@/inngest/client';
import {  createTRPCRouter, protectedProcedure } from '../init';
import prisma from '@/lib/prisma';
import { email } from 'zod';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { deepseek } from '@ai-sdk/deepseek';






export const appRouter = createTRPCRouter({
testAi: protectedProcedure.mutation(async () => {
  
 await inngest.send({
  name:"execute/ai"})
 return { success:true, message:"Job Queued"}
}),

 


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