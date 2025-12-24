import {Polar} from "@polar-sh/sdk"

export const polarClient = new Polar({
    accessToken: process.env.NODE_ENV ==="development" ? process.env.POLAR_ACCESS_TOKEN : process.env.POLAR_ACCESS_TOKEN,
    server:process.env.NODE_ENV=== "development" ? "sandbox" :"sandbox", // TODO: CHANGE IN PRODUCTION
})