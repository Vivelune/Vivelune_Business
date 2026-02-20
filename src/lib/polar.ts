import {Polar} from "@polar-sh/sdk"
console.log("POLAR TOKEN:", process.env.POLAR_ACCESS_TOKEN);
export const polarClient = new Polar({
    accessToken: process.env.NODE_ENV === "development" 
    ? process.env.POLAR_ACCESS_TOKEN
    : process.env.POLAR_ACCESS_TOKEN,
    
    server:process.env.NODE_ENV === "development" ? "sandbox" : "production", // TODO: CHANGE IN PRODUCTION
})