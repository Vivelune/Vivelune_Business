// src/emails/templates/workflow/notification.tsx
import { EmailLayout } from "../../components/layout";
import { EmailButton } from "../../components/button";
import { globalStyles } from "../../components/styles";
import { Section, Text, Heading } from "@react-email/components";

interface NotificationEmailProps {
  name: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}

export const NotificationEmail = ({
  name,
  message,
  actionUrl,
  actionText = "VIEW DETAILS",
}: NotificationEmailProps) => (
  <EmailLayout
    previewText="New notification from Roast & Recover"
    logoText="ROAST & RECOVER"
    footerText="CRAFT YOUR RITUAL"
  >
    <Heading style={globalStyles.h1}>Hello {name},</Heading>
    
    <Text style={globalStyles.text}>{message}</Text>

    {actionUrl && (
      <Section style={globalStyles.buttonContainer}>
        <EmailButton href={actionUrl}>
          {actionText}
        </EmailButton>
      </Section>
    )}
  </EmailLayout>
);