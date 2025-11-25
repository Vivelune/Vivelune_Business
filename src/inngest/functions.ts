import prisma from "@/lib/prisma";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world", },
  { event: "test/hello.world" },
  async ({ event, step }) => {
        await step.sleep("fetching", "5s");

            await step.sleep("transcribing", "5s");


    await step.sleep("sending to AI", "5s");
    await step.run("create-workflow", ()=>{
      return prisma.workflow.create({
        data:{
          name:"Workflow from Inngest Function"
        }
      })
      
    }
    );
  }
);