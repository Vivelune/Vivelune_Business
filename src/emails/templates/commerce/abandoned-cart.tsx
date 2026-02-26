import { EmailLayout } from "../../components/layout";
import { EmailButton } from "../../components/button";
import { globalStyles } from "../../components/styles";
import { Section, Text, Heading } from "@react-email/components";

interface AbandonedCartEmailProps {
  name: string;
  cartUrl: string;
  itemCount?: number;
  itemNames?: string[];
}

export const AbandonedCartEmail = ({
  name,
  cartUrl,
  itemCount,
  itemNames,
}: AbandonedCartEmailProps) => (
  <EmailLayout
    previewText="Pause for a moment? Your cart is waiting."
    logoText="ROAST & RECOVER"
    footerText="CRAFT YOUR RITUAL"
  >
    <Heading style={globalStyles.h1}>Don't rush the decision.</Heading>

    <Text style={globalStyles.text}>
      Hello {name}, we noticed you left
      {itemCount ? ` ${itemCount} items` : " something"} behind. Our
      collection is curated in small batches to ensure quality—we've held your
      items for now.
    </Text>

    {itemNames && itemNames.length > 0 && (
      <Section style={globalStyles.orderBox}>
        {itemNames.map((item, index) => (
          <Text key={index} style={{ ...globalStyles.textLeft, margin: "4px 0" }}>
            • {item}
          </Text>
        ))}
      </Section>
    )}

    <Section style={globalStyles.buttonContainer}>
      <EmailButton href={cartUrl}>RETURN TO CART</EmailButton>
    </Section>

    <Text style={{ ...globalStyles.text, fontSize: "12px", marginTop: "20px" }}>
      Your cart will be available for 24 hours.
    </Text>
  </EmailLayout>
);