// src/features/executions/components/email/executor.ts
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { Resend } from "resend";
import { emailChannel } from "@/inngest/channels/email";
import { renderEmailTemplate } from "@/emails/utils/renderer";
import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(jsonString);
});

type EmailTemplateType = 
  | "custom" 
  | "welcome" 
  | "summary" 
  | "notification"
  | "abandoned-cart"
  | "order-confirmation"
  | "shipping-update"
  | "product-care";

type EmailData = {
  variableName?: string;
  credentialId?: string;
  from?: string;
  to?: string;
  subject?: string;
  template?: EmailTemplateType;
  templateData?: string;
  html?: string;
};

/**
 * Safely parse template data that might be:
 * - Valid JSON string
 * - Array (wrap in { items })
 * - Primitive (wrap in { value })
 * - Already an object
 */
function safelyParseTemplateData(templateDataStr: string): Record<string, any> {
  let parsed: any;
  
  try {
    parsed = JSON.parse(templateDataStr);
  } catch (error) {
    // If it's not valid JSON, maybe it's a plain string or number
    console.log("📧 Template data is not JSON, treating as primitive:", templateDataStr);
    return { value: templateDataStr };
  }

  // Handle different data shapes
  if (Array.isArray(parsed)) {
    console.log("📧 Template data is an array with", parsed.length, "items");
    return { items: parsed };
  }

  if (typeof parsed !== 'object' || parsed === null) {
    console.log("📧 Template data is primitive:", typeof parsed);
    return { value: parsed };
  }

  // It's already an object, return as-is
  console.log("📧 Template data is an object with keys:", Object.keys(parsed));
  return parsed;
}

export const emailExecutor: NodeExecutor<EmailData> = async ({
  data,
  nodeId,
  context,
  userId,
  step,
  publish,
}) => {
  const startTime = Date.now();
  console.log(`📧 [Email Node ${nodeId}] Starting execution`);

  await publish(
    emailChannel().status({
      nodeId,
      status: "loading",
    })
  );

  try {
    // Validation
    if (!data.variableName) {
      throw new NonRetriableError("Email node: Variable name is missing");
    }

    if (!data.credentialId) {
      throw new NonRetriableError("Email node: Resend credential is missing");
    }

    if (!data.to) {
      throw new NonRetriableError("Email node: Recipient (to) is missing");
    }

    if (!data.subject) {
      throw new NonRetriableError("Email node: Subject is missing");
    }

    const template = data.template || "custom";
    
    if (template === "custom" && !data.html) {
      throw new NonRetriableError("Email node: HTML content is missing for custom template");
    }

    if (template !== "custom" && !data.templateData) {
      throw new NonRetriableError(`Email node: Template data is missing for ${template} template`);
    }

    // Get Resend credential
    console.log(`📧 [Email Node ${nodeId}] Fetching credential: ${data.credentialId}`);
    const credential = await step.run("get-resend-credential", async () => {
      return prisma.credential.findUnique({
        where: {
          id: data.credentialId,
          userId,
          type: "RESEND",
        },
      });
    });

    if (!credential) {
      throw new NonRetriableError("Email node: Resend credential not found");
    }

    // Initialize Resend
    const resend = new Resend(decrypt(credential.value));

    // Compile basic fields
    const from = data.from
      ? Handlebars.compile(data.from)(context)
      : "Roast & Recover <studio@roastandrecover.com>";

    const to = Handlebars.compile(data.to)(context);
    const subject = Handlebars.compile(data.subject)(context);
    
    let html: string;
    
    if (template === "custom") {
      // Custom HTML template
      html = Handlebars.compile(data.html!)(context);
      console.log(`📧 [Email Node ${nodeId}] Rendered custom HTML (${html.length} chars)`);
    } else {
      // Pre-built template
      console.log(`📧 [Email Node ${nodeId}] Using template: ${template}`);
      console.log(`📧 [Email Node ${nodeId}] Raw template data:`, data.templateData);
      
      // Compile template data with Handlebars first
      const templateDataStr = Handlebars.compile(data.templateData!)(context);
      console.log(`📧 [Email Node ${nodeId}] Compiled template data string:`, templateDataStr);
      
      // Safely parse the template data
      const templateData = safelyParseTemplateData(templateDataStr);
      console.log(`📧 [Email Node ${nodeId}] Parsed template data:`, JSON.stringify(templateData, null, 2));
      
      // Add app URL if not provided
      if (!templateData.appUrl) {
        templateData.appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vivelune.com';
      }
      
      // Render the template
      try {
        html = await renderEmailTemplate(template, templateData);
        console.log(`📧 [Email Node ${nodeId}] Rendered template (${html.length} chars)`);
      } catch (renderError) {
        console.error(`📧 [Email Node ${nodeId}] Template rendering failed:`, renderError);
        throw new NonRetriableError(`Failed to render template: ${renderError instanceof Error ? renderError.message : 'Unknown error'}`);
      }
    }

    // Send email
    console.log(`📧 [Email Node ${nodeId}] Sending email to: ${to}`);
    const result = await step.run("send-email", async () => {
      const { data: emailResponse, error } = await resend.emails.send({
        from,
        to: [to],
        subject,
        html,
      });

      if (error) {
        throw new Error(error.message);
      }

      const duration = Date.now() - startTime;
      console.log(`📧 [Email Node ${nodeId}] Email sent successfully in ${duration}ms, ID: ${emailResponse?.id}`);

      return {
        ...context,
        [data.variableName!]: {
          sent: true,
          id: emailResponse?.id,
          to,
          subject,
          template: template !== "custom" ? template : undefined,
          from,
          timestamp: new Date().toISOString(),
          duration,
        },
      };
    });

    await publish(
      emailChannel().status({
        nodeId,
        status: "success",
      })
    );

    return result;

  } catch (error) {
    console.error(`📧 [Email Node ${nodeId}] Error:`, error);
    
    await publish(
      emailChannel().status({
        nodeId,
        status: "error",
      })
    );

    if (error instanceof NonRetriableError) {
      throw error;
    }
    
    throw new NonRetriableError(
      `Email node failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};