// src/emails/templates/auth/welcome.tsx
import { EmailLayout } from "../../components/layout";
import { EmailButton } from "../../components/button";
import { globalStyles } from "../../components/styles";
import { Section, Text, Heading } from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
  dashboardUrl?: string;
}

export const WelcomeEmail = ({ 
  name, 
  dashboardUrl = "https://roastandrecover.com/dashboard" 
}: WelcomeEmailProps) => (
  <EmailLayout
    previewText="Welcome to Roast & Recover"
    logoText="ROAST & RECOVER"
    footerText="CRAFT YOUR RITUAL"
  >
    <Heading style={globalStyles.h1}>Welcome, {name}!</Heading>
    
    <Text style={globalStyles.text}>
      You've joined a community dedicated to the art of the slow morning 
      and the intentional reset.
    </Text>

    <Section style={globalStyles.buttonContainer}>
      <EmailButton href={dashboardUrl}>
        EXPLORE THE COLLECTION
      </EmailButton>
    </Section>
  </EmailLayout>
);