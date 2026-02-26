// src/emails/types/index.ts
export type EmailTemplate = 
  | "welcome"
  | "summary"
  | "notification"
  | "abandoned-cart"
  | "order-confirmation"
  | "shipping-update"
  | "product-care"
  | "custom"; // Add custom if needed for the dialog

export interface EmailData {
  to: string | string[];
  from?: string;
  subject: string;
  template: EmailTemplate;
  data: Record<string, any>;
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
}

export interface EmailResponse {
  id: string;
  from: string;
  to: string[];
  subject: string;
  createdAt: Date;
}