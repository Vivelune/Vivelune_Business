import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { polarClient } from "./polar";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    
    trustedOrigins: [
        process.env.NODE_ENV === "development"
            ? process.env.BETTER_AUTH_URL_DEVELOPMENT
            : process.env.BETTER_AUTH_URL,
    ].filter(Boolean) as string[],

    emailAndPassword: {
        enabled: true,
    },
    
    socialProviders: {
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID_PRODUCTION as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET_PRODUCTION as string,
        }, 
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID_PRODUCTION as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET_PRODUCTION as string,
        }, 
    },
    
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            customer: {
                enabled: true,
            },
            use: [
                checkout({
                    products: [
                        {
                            productId: "e1a5782b-7524-4aa0-88da-50291670c359",
                            slug: "Vivelune-Pro"
                        }
                    ],
                    successUrl: (() => {
                        const url = process.env.NODE_ENV === 'development' 
                            ? process.env.POLAR_SUCCESS_URL_DEVELOPMENT
                            : process.env.POLAR_SUCCESS_URL;
                        
                        if (!url) {
                            throw new Error(
                                `POLAR_SUCCESS_URL${process.env.NODE_ENV === 'development' ? '_DEVELOPMENT' : ''} is not defined`
                            );
                        }
                        return url;
                    })(),
                    authenticatedUsersOnly: true
                }),
                portal(),
            ],
        })
    ]
});