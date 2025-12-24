import { Inngest } from "inngest";
import {realtimeMiddleware} from "@inngest/realtime/middleware"

// Create a client to send and receive events
export const inngest = new Inngest({ 
    id: "vivelune",
    eventKey: process.env.INNGEST_EVENT_KEY, // Add this line
    middleware:[realtimeMiddleware()]
});