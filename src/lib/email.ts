import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set");
}

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailProps = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: SendEmailProps) {
  if (!text && !html) {
    throw new Error("Either `text` or `html` must be provided");
  }

  const from = "Vivelune <no-reply@vivelune.com>";

  console.log("📨 Sending email", { to, from, subject });

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    ...(html ? { html } : { text: text! }),
  });

  if (error) {
    console.error("❌ Resend error:", error);
    throw new Error(error.message);
  }

  console.log("✅ Email sent:", data?.id);
  return data;
}
