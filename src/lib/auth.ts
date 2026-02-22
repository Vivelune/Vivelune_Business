import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

// import { sendEmail } from "./email"; // Uncomment when email is configured

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
        // requireEmailVerification: true, // Uncomment when ready
    },
    
    // emailVerification: { // Uncomment when email is configured
    //     sendVerificationEmail: async ({ user, url }) => {
    //         await sendEmail({
    //             to: user.email,
    //             subject: "Verify your email address",
    //             text: `Click the link to verify your email: ${url}`,
    //         });
    //     },
    // },
    
    
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
        
       
    ],
});