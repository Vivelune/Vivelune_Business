import { Resend } from "resend";
import { EmailData, EmailResponse } from "../types";
import { renderEmailTemplate } from "./renderer";

const resend = new Resend(process.env.RESEND_API_KEY!);

export class EmailService {
  private defaultFrom = "Roast & Recover <studio@roastandrecover.com>";

  async send(emailData: EmailData): Promise<EmailResponse> {
    try {
      const html = await renderEmailTemplate(emailData.template, emailData.data);

      const { data, error } = await resend.emails.send({
        from: emailData.from || this.defaultFrom,
        to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
        subject: emailData.subject,
        html,
        cc: emailData.cc,
        bcc: emailData.bcc,
        replyTo: emailData.replyTo,
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        id: data?.id || "",
        from: emailData.from || this.defaultFrom,
        to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
        subject: emailData.subject,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
  }

  async sendBulk(emailDataArray: EmailData[]): Promise<EmailResponse[]> {
    return Promise.all(emailDataArray.map((data) => this.send(data)));
  }
}

export const emailService = new EmailService();