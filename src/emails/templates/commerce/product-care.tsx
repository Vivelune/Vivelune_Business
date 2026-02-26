import { EmailLayout } from "../../components/layout";
import { EmailButton } from "../../components/button";
import { globalStyles } from "../../components/styles";
import { Section, Text, Heading } from "@react-email/components";

interface ProductCareEmailProps {
  name: string;
  productName: string;
  careGuideUrl?: string;
  material?: "walnut" | "titanium" | "glass" | "ceramic";
}

export const ProductCareEmail = ({
  name,
  productName,
  careGuideUrl = "https://roastandrecover.com/care-guide",
  material,
}: ProductCareEmailProps) => (
  <EmailLayout
    previewText={`Caring for your ${productName}`}
    logoText="ROAST & RECOVER"
    footerText="DESIGNED TO LAST"
  >
    <Heading style={globalStyles.h1}>A ritual for your tools.</Heading>

    <Text style={globalStyles.text}>
      Now that your {productName} has arrived, here is how to ensure it lasts a
      lifetime.
    </Text>

    <Section style={globalStyles.orderBox}>
      {material === "titanium" && (
        <Text style={globalStyles.textLeft}>
          • Hand wash with mild soap
          {"\n"}• Dry immediately
          {"\n"}• Avoid abrasive materials
          {"\n"}• Store in a dry place
        </Text>
      )}

      {material === "walnut" && (
        <Text style={globalStyles.textLeft}>
          • Wipe with dry cloth
          {"\n"}• Keep away from direct sunlight
          {"\n"}• Apply mineral oil occasionally
          {"\n"}• Avoid excessive moisture
        </Text>
      )}

      {material === "glass" && (
        <Text style={globalStyles.textLeft}>
          • Hand wash recommended
          {"\n"}• Avoid sudden temperature changes
          {"\n"}• Use soft sponge only
          {"\n"}• Dry with lint-free cloth
        </Text>
      )}

      {!material && (
        <Text style={globalStyles.textLeft}>
          Pure titanium and walnut require simple, intentional care. Follow our
          guide for lifelong use.
        </Text>
      )}
    </Section>

    <Section style={globalStyles.buttonContainer}>
      <EmailButton href={careGuideUrl}>READ FULL CARE GUIDE</EmailButton>
    </Section>
  </EmailLayout>
);