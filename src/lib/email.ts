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

  const from =
    process.env.NODE_ENV === "production"
      ? "Vivelune <no-reply@mail.vivelune.com>" // ← after domain verification
      : "Vivelune <onboarding@resend.dev>";     // ← testing/sandbox

  const base = {
    from,
    to,
    subject,
  };

  const payload = html
    ? {
        ...base,
        html,
      }
    : {
        ...base,
        text: text!,
      };

  const { data, error } = await resend.emails.send(payload);

  if (error) {
    console.error("Resend send error:", error);
    throw new Error(error.message);
  }

  return data;
}
