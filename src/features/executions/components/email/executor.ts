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

export const emailExecutor: NodeExecutor<EmailData> = async ({
  data,
  nodeId,
  context,
  userId,
  step,
  publish,
}) => {
  await publish(
    emailChannel().status({
      nodeId,
      status: "loading",
    })
  );

  // Validation
  if (!data.variableName) {
    await publish(emailChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Email node: Variable name is missing");
  }

  if (!data.credentialId) {
    await publish(emailChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Email node: Resend credential is missing");
  }

  if (!data.to) {
    await publish(emailChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Email node: Recipient (to) is missing");
  }

  if (!data.subject) {
    await publish(emailChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Email node: Subject is missing");
  }

  // Validate based on template type
  const template = data.template || "custom";
  
  if (template === "custom" && !data.html) {
    await publish(emailChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Email node: HTML content is missing for custom template");
  }

  if (template !== "custom" && !data.templateData) {
    await publish(emailChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError(`Email node: Template data is missing for ${template} template`);
  }

  // Get Resend credential from database
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
    await publish(emailChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Email node: Resend credential not found");
  }

  // Initialize Resend with user's API key
  const resend = new Resend(decrypt(credential.value));

  // Compile basic fields with Handlebars
  const from = data.from
    ? Handlebars.compile(data.from)(context)
    : "Roast & Recover <hello@roastandrecover.com>";

  const to = Handlebars.compile(data.to)(context);
  const subject = Handlebars.compile(data.subject)(context);
  
  // Generate HTML based on template or custom HTML
  let html: string;
  
  if (template === "custom") {
    // Compile custom HTML with Handlebars
    html = Handlebars.compile(data.html!)(context);
  } else {
    // Parse template data JSON (which may contain Handlebars variables)
    const templateDataStr = Handlebars.compile(data.templateData!)(context);
    
    let templateData: Record<string, any>;
    try {
      templateData = JSON.parse(templateDataStr);
    } catch (error) {
      console.error("Failed to parse template data JSON:", error);
      await publish(emailChannel().status({ nodeId, status: "error" }));
      throw new NonRetriableError(`Email node: Invalid JSON in template data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Add app URL if not provided
    if (!templateData.appUrl) {
      templateData.appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://roastandrecover.com';
    }
    
    // Render the template
    try {
      html = await renderEmailTemplate(
        template as any,
        templateData
      );
    } catch (error) {
      console.error("Failed to render email template:", error);
      await publish(emailChannel().status({ nodeId, status: "error" }));
      throw new NonRetriableError(`Email node: Failed to render template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Store variable name for later use
  const variableName = data.variableName;

  try {
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

      return {
        ...context,
        [variableName]: {
          sent: true,
          id: emailResponse?.id,
          to,
          subject,
          template: template !== "custom" ? template : undefined,
          from,
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
    console.error("Email execution error:", error);
    await publish(
      emailChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
};