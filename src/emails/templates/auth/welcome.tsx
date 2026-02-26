// src/emails/templates/auth/welcome.tsx - Enhanced version
import { EmailLayout } from "../../components/layout";
import { EmailButton } from "../../components/button";
import { globalStyles, theme } from "../../components/styles";
import { Section, Text, Heading, Img, Row, Column } from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
  dashboardUrl?: string;
}

export const WelcomeEmail = ({ 
  name, 
  dashboardUrl = "https://roastandrecover.com/" 
}: WelcomeEmailProps) => (
  <EmailLayout
    previewText="Welcome to Roast & Recover - Your ritual journey begins"
    logoText="ROAST & RECOVER"
    footerText="CRAFT YOUR RITUAL"
  >
    {/* Hero Section */}
    <Section style={{ marginBottom: theme.spacing.xl }}>
     
    </Section>

    <Heading style={globalStyles.h1}>Welcome, {name}! 🌿</Heading>
    
    <Text style={globalStyles.text}>
      You've joined a community dedicated to the art of the slow morning 
      and the intentional reset. Every tool we craft is designed to bring 
      presence to your daily rituals.
    </Text>

    {/* Feature Grid */}
    <Section style={{ margin: `${theme.spacing.xl} 0` }}>
      <Row>
        <Column align="center" style={{ padding: theme.spacing.sm }}>
          <Text style={{ fontSize: "32px", margin: 0 }}>☕</Text>
          <Text style={{ ...globalStyles.text, fontSize: "14px", fontWeight: "bold", margin: "8px 0 4px" }}>
            Coffee Rituals
          </Text>
          <Text style={{ ...globalStyles.text, fontSize: "12px", margin: 0 }}>
            Moka pots, titanium flasks, and pour-over sets
          </Text>
        </Column>
        <Column align="center" style={{ padding: theme.spacing.sm }}>
          <Text style={{ fontSize: "32px", margin: 0 }}>🍵</Text>
          <Text style={{ ...globalStyles.text, fontSize: "14px", fontWeight: "bold", margin: "8px 0 4px" }}>
            Tea Ceremony
          </Text>
          <Text style={{ ...globalStyles.text, fontSize: "12px", margin: 0 }}>
            Portable sets, glass vessels, and walnut accessories
          </Text>
        </Column>
        <Column align="center" style={{ padding: theme.spacing.sm }}>
          <Text style={{ fontSize: "32px", margin: 0 }}>🪵</Text>
          <Text style={{ ...globalStyles.text, fontSize: "14px", fontWeight: "bold", margin: "8px 0 4px" }}>
            Ritual Objects
          </Text>
          <Text style={{ ...globalStyles.text, fontSize: "12px", margin: 0 }}>
            Sculptural pieces for mindful spaces
          </Text>
        </Column>
      </Row>
    </Section>

    {/* Call to Action */}
    <Section style={globalStyles.buttonContainer}>
      <EmailButton href={dashboardUrl}>
        EXPLORE THE COLLECTION
      </EmailButton>
    </Section>

    {/* Testimonial */}
    <Section style={{ 
      ...globalStyles.orderBox,
      marginTop: theme.spacing.xl,
      fontStyle: "italic"
    }}>
      <Text style={{ ...globalStyles.textLeft, margin: 0 }}>
        "Roast & Recover transformed my morning routine. It's not just coffee—it's a ritual."
      </Text>
      <Text style={{ ...globalStyles.textLeft, margin: "8px 0 0", fontSize: "12px" }}>
        — Alex Chen, early member
      </Text>
    </Section>
  </EmailLayout>
);