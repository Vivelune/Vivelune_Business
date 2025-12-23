import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import {checkout, polar, portal} from "@polar-sh/better-auth"
import { polarClient } from "./polar";
import { sendEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  
  emailAndPassword:{
    enabled: true,
    requireEmailVerification: true,

  },
  emailVerification: {
    sendVerificationEmail: async ( { user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
  socialProviders: {
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        }, 
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
 plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            customer: {
      enabled: true,   // ✅ This is required
    },
            use: [
                checkout({
                    products: [
                        {
                            productId: "1d7db47a-da38-47c0-bb92-6f451d5a1d25",
                            slug: "Vivelune-Pro" // Custom slug for easy reference in Checkout URL, e.g. /checkout/Vivelune-Pro
                        }
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL,
                    authenticatedUsersOnly: true
                }),
                portal(),
            ],
        })
    ]
});