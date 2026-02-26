import { EmailLayout } from "../../components/layout";
import { EmailButton } from "../../components/button";
import { globalStyles } from "../../components/styles";
import { Section, Text, Heading } from "@react-email/components";

interface ShippingUpdateEmailProps {
  name: string;
  trackingUrl: string;
  carrier?: string;
  estimatedDelivery?: string;
  orderId?: string;
}

export const ShippingUpdateEmail = ({
  name,
  trackingUrl,
  carrier,
  estimatedDelivery,
  orderId,
}: ShippingUpdateEmailProps) => (
  <EmailLayout
    previewText="Your recovery tools are on the way."
    logoText="ROAST & RECOVER"
    footerText="WHERE HEAT MEETS CALM"
  >
    <Heading style={globalStyles.h1}>Out for delivery.</Heading>

    <Text style={globalStyles.text}>
      The wait is nearly over, {name}. Your package has been handed to{" "}
      {carrier || "our courier"}.
      {orderId && ` Order #${orderId}`}
    </Text>

    {estimatedDelivery && (
      <Text style={globalStyles.text}>
        Expected delivery: <strong>{estimatedDelivery}</strong>
      </Text>
    )}

    <Section style={globalStyles.buttonContainer}>
      <EmailButton href={trackingUrl}>TRACK PACKAGE</EmailButton>
    </Section>

    <Text style={globalStyles.text}>
      Prepare your space. Clear your desk. A better ritual is arriving soon.
    </Text>
  </EmailLayout>
);