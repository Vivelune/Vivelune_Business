// src/features/executions/components/email/types.ts
import { z } from "zod";

// Define the template enum
export const templateEnum = z.enum([
  "custom",
  "welcome",
  "summary",
  "notification",
  "abandoned-cart",
  "order-confirmation",
  "shipping-update",
  "product-care"
]);

export type TemplateType = z.infer<typeof templateEnum>;

// Form schema
export const emailFormSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[a-zA-Z_$][A-Za-z0-9_$]*$/, {
      message: "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores",
    }),
  credentialId: z.string().min(1, "Resend API credential is required"),
  from: z.string().email("Must be a valid email"),
  fromName: z.string().optional(),
  to: z.string().min(1, "Recipient email is required"),
  subject: z.string().min(1, "Subject is required"),
  template: templateEnum,
  templateData: z.string().optional(),
  html: z.string().optional(),
}).refine((data) => {
  if (data.template === "custom") {
    return !!data.html;
  }
  return true;
}, {
  message: "HTML content is required for custom template",
  path: ["html"],
});

export type EmailFormValues = z.infer<typeof emailFormSchema>;

// Node data type (must extend Record<string, unknown> for React Flow)
export interface EmailNodeData extends Record<string, unknown> {
  variableName?: string;
  credentialId?: string;
  from?: string;
  fromName?: string;
  to?: string;
  subject?: string;
  template?: TemplateType;
  templateData?: string;
  html?: string;
}