// src/emails/templates/workflow/summary.tsx
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
  
  interface SummaryEmailProps {
    name: string;
    summary: string;
    workflowName: string;
    executionId: string;
    appUrl: string;
  }
  
  export const SummaryEmail = ({
    name,
    summary,
    workflowName,
    executionId,
    appUrl,
  }: SummaryEmailProps) => (
    <Html>
      <Preview>Your workflow "{workflowName}" has completed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={logoText}>ROAST & RECOVER</Text>
          </Section>
  
          <Heading style={h1}>Workflow Complete</Heading>
          
          <Text style={text}>
            Hello {name}, your workflow <strong>"{workflowName}"</strong> has finished executing.
          </Text>
  
          <Section style={summaryBox}>
            <Text style={summaryText}>{summary}</Text>
          </Section>
  
          <Section style={buttonContainer}>
            <Link href={`${appUrl}/executions/${executionId}`} style={button}>
              VIEW FULL RESULTS
            </Link>
          </Section>
  
          <Hr style={hr} />
  
          <Text style={footer}>
            SENT FROM THE STUDIO. <br />
            Where Heat Meets Calm.
          </Text>
        </Container>
      </Body>
    </Html>
  );
  
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
  
  const h1 = {
    color: "#1C1C1C",
    fontSize: "26px",
    fontWeight: "500",
    textAlign: "center" as const,
    margin: "20px 0 30px",
    letterSpacing: "1px",
  };
  
  const text = {
    color: "#4A4A4A",
    fontSize: "15px",
    lineHeight: "1.6",
    textAlign: "center" as const,
    margin: "16px 0",
  };
  
  const summaryBox = {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    border: "1px solid #DCD5CB",
    padding: "30px",
    margin: "30px 0",
  };
  
  const summaryText = {
    ...text,
    margin: 0,
    fontStyle: "italic",
    color: "#1C1C1C",
    textAlign: "left" as const,
    whiteSpace: "pre-wrap" as const,
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