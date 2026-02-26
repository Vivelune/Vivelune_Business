import {
    Html,
    Body,
    Container,
    Section,
    Text,
    Hr,
    Preview,
  } from "@react-email/components";
  import { globalStyles } from "./styles";
  
  interface LayoutProps {
    children: React.ReactNode;
    previewText?: string;
    logoText?: string;
    footerText?: string;
    backgroundColor?: string;
  }
  
  export const EmailLayout = ({
    children,
    previewText,
    logoText = "ROAST & RECOVER",
    footerText = "CRAFT YOUR RITUAL",
    backgroundColor,
  }: LayoutProps) => (
    <Html>
      {previewText && <Preview>{previewText}</Preview>}
      <Body style={{ ...globalStyles.main, ...(backgroundColor && { backgroundColor }) }}>
        <Container style={globalStyles.container}>
          <Section style={{ textAlign: "center" as const }}>
            <Text style={globalStyles.logoText}>{logoText}</Text>
          </Section>
  
          {children}
  
          <Hr style={globalStyles.hr} />
  
          <Text style={globalStyles.footer}>{footerText}</Text>
        </Container>
      </Body>
    </Html>
  );