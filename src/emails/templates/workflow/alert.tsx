// src/emails/templates/workflow/alert.tsx
import {
    Html,
    Body,
    Container,
    Text,
    Link,
    Preview,
    Heading,
    Section,
    Hr,
  } from "@react-email/components";
  
  interface AlertEmailProps {
    name: string;
    alertType: "error" | "warning" | "info" | "success";
    title: string;
    message: string;
    details?: string;
    actionUrl?: string;
    actionText?: string;
    timestamp?: string;
  }
  
  export const AlertEmail = ({
    name,
    alertType = "info",
    title,
    message,
    details,
    actionUrl,
    actionText = "VIEW DETAILS",
    timestamp,
  }: AlertEmailProps) => {
    // Get alert-specific styles
    const getAlertStyles = () => {
      switch (alertType) {
        case "error":
          return {
            icon: "⚠️",
            borderColor: "#B91C1C",
            bgColor: "rgba(185, 28, 28, 0.05)",
            textColor: "#991B1B",
          };
        case "warning":
          return {
            icon: "⚡",
            borderColor: "#B45309",
            bgColor: "rgba(180, 83, 9, 0.05)",
            textColor: "#92400E",
          };
        case "success":
          return {
            icon: "✅",
            borderColor: "#065F46",
            bgColor: "rgba(6, 95, 70, 0.05)",
            textColor: "#065F46",
          };
        case "info":
        default:
          return {
            icon: "ℹ️",
            borderColor: "#1C1C1C",
            bgColor: "rgba(28, 28, 28, 0.03)",
            textColor: "#1C1C1C",
          };
      }
    };
  
    const alertStyles = getAlertStyles();
  
    return (
      <Html>
        <Preview>{title} — Roast & Recover Alert</Preview>
        <Body style={main}>
          <Container style={container}>
            <Section style={logoSection}>
              <Text style={logoText}>ROAST & RECOVER</Text>
            </Section>
  
            <Section style={alertHeader}>
              <Text style={alertIcon}>{alertStyles.icon}</Text>
              <Heading style={{ ...h1, marginTop: "10px" }}>{title}</Heading>
            </Section>
  
            <Section 
              style={{
                ...alertBox,
                borderColor: alertStyles.borderColor,
                backgroundColor: alertStyles.bgColor,
              }}
            >
              <Text style={{ ...alertMessage, color: alertStyles.textColor }}>
                {message}
              </Text>
            </Section>
  
            {details && (
              <Section style={detailsBox}>
                <Text style={detailsTitle}>Details:</Text>
                <Text style={detailsText}>{details}</Text>
              </Section>
            )}
  
            {timestamp && (
              <Text style={timestampText}>
                {timestamp}
              </Text>
            )}
  
            {actionUrl && (
              <Section style={buttonContainer}>
                <Link href={actionUrl} style={button}>
                  {actionText}
                </Link>
              </Section>
            )}
  
            <Hr style={hr} />
  
            <Text style={footer}>
              This is an automated alert from your Roast & Recover workflow.
              <br />
              Craft Your Ritual.
            </Text>
          </Container>
        </Body>
      </Html>
    );
  };
  
  // Styles
  const main = {
    backgroundColor: "#F4F1EE",
    fontFamily: 'Avenir, "Helvetica Neue", Helvetica, Arial, sans-serif',
    padding: "40px 20px",
  };
  
  const container = {
    backgroundColor: "#E7E1D8",
    border: "1px solid #DCD5CB",
    margin: "0 auto",
    padding: "40px",
    maxWidth: "600px",
  };
  
  const logoSection = {
    textAlign: "center" as const,
    marginBottom: "30px",
  };
  
  const logoText = {
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "4px",
    color: "#1C1C1C",
    textTransform: "uppercase" as const,
    margin: "0",
  };
  
  const alertHeader = {
    textAlign: "center" as const,
    marginBottom: "20px",
  };
  
  const alertIcon = {
    fontSize: "48px",
    lineHeight: "1",
    margin: "0",
  };
  
  const h1 = {
    color: "#1C1C1C",
    fontSize: "24px",
    fontWeight: "500",
    textAlign: "center" as const,
    margin: "20px 0 30px",
    letterSpacing: "1px",
  };
  
  const alertBox = {
    border: "2px solid",
    padding: "24px",
    margin: "20px 0",
    borderRadius: "0px",
  };
  
  const alertMessage = {
    fontSize: "16px",
    lineHeight: "1.6",
    textAlign: "center" as const,
    margin: "0",
    fontWeight: "500",
  };
  
  const detailsBox = {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    border: "1px solid #DCD5CB",
    padding: "20px",
    margin: "20px 0",
  };
  
  const detailsTitle = {
    color: "#1C1C1C",
    fontSize: "14px",
    fontWeight: "600",
    margin: "0 0 10px 0",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
  };
  
  const detailsText = {
    color: "#4A4A4A",
    fontSize: "14px",
    lineHeight: "1.6",
    margin: "0",
    fontFamily: "monospace",
    whiteSpace: "pre-wrap" as const,
  };
  
  const timestampText = {
    color: "#8E8E8E",
    fontSize: "12px",
    textAlign: "center" as const,
    margin: "10px 0",
  };
  
  const buttonContainer = {
    textAlign: "center" as const,
    margin: "30px 0 20px",
  };
  
  const button = {
    backgroundColor: "#1C1C1C",
    color: "#E7E1D8",
    padding: "14px 28px",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "2px",
    textDecoration: "none",
    textTransform: "uppercase" as const,
    display: "inline-block",
  };
  
  const hr = {
    borderColor: "#DCD5CB",
    margin: "30px 0 20px",
  };
  
  const footer = {
    color: "#8E8E8E",
    fontSize: "10px",
    textAlign: "center" as const,
    letterSpacing: "1px",
    lineHeight: "1.6",
    textTransform: "uppercase" as const,
  };