import prisma from "@/lib/prisma";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { deepseek } from '@ai-sdk/deepseek'

const google = createGoogleGenerativeAI()


export const execute = inngest.createFunction(
  { id: "execute-ai", },
  { event: "execute/ai" },
  async ({ event, step }) => {
    
      const {steps} = await step.ai.wrap("gemini-generate-text", 
        generateText, {
          model: google("gemini-2.5-flash"),
          system:"You are an expert business consultant who helps people come up with unique business ideas based on their background and skills.",
          prompt:`Generate 3 unique business ideas for a person with the following background and skills: Coding skills in JavaScript, Python, and web development. They have experience working on freelance projects and are looking to start a side business while studying at university. The business ideas should be online-based and have low startup costs.`,

        }
      )

      return steps
  }
);
