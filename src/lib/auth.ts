import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import {checkout, polar, portal} from "@polar-sh/better-auth"
import { polarClient } from "./polar";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword:{
    enabled: true,
    autoSignIn: true,
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
                            productId: "a3ee241c-5572-47a8-a607-343207ac0dd6",
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