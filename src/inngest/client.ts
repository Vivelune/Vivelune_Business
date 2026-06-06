import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ 
    id: "vivelune",
    // Look, no hands! The middleware is handled natively now.
});