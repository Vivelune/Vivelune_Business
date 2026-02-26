import { EmailLayout } from "../../components/layout";
import { EmailButton } from "../../components/button";
import { globalStyles } from "../../components/styles";
import { Section, Text, Heading } from "@react-email/components";

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

interface OrderConfirmationEmailProps {
  name: string;
  orderId: string;
  total: string;
  items?: OrderItem[];
  trackingUrl?: string;
  estimatedDelivery?: string;
}

export const OrderConfirmationEmail = ({
  name,
  orderId,
  total,
  items,
  trackingUrl,
  estimatedDelivery,
}: OrderConfirmationEmailProps) => (
  <EmailLayout
    previewText="Order Confirmed — Preparing your tools."
    logoText="ROAST & RECOVER"
    footerText="QUALITY TAKES TIME"
  >
    <Heading style={globalStyles.h1}>Your ritual is in motion.</Heading>

    <Text style={globalStyles.text}>
      Thank you for your order, {name}. We are currently preparing your items
      for their journey.
    </Text>

    <Section style={globalStyles.orderBox}>
      <Text style={{ ...globalStyles.textLeft, margin: "5px 0", fontWeight: "bold" }}>
        Order #{orderId}
      </Text>

      {items && items.length > 0 ? (
        items.map((item, index) => (
          <Text key={index} style={{ ...globalStyles.textLeft, margin: "4px 0" }}>
            {item.quantity}x {item.name} — {item.price}
          </Text>
        ))
      ) : (
        <Text style={globalStyles.textLeft}>Total: {total}</Text>
      )}

      {items && items.length > 0 && (
        <Text
          style={{
            ...globalStyles.textLeft,
            marginTop: "12px",
            fontWeight: "bold",
          }}
        >
          Total: {total}
        </Text>
      )}
    </Section>

    {estimatedDelivery && (
      <Text style={globalStyles.text}>
        Estimated delivery: {estimatedDelivery}
      </Text>
    )}

    <Section style={globalStyles.buttonContainer}>
      <EmailButton
        href={trackingUrl || "https://roastandrecover.com/account/orders"}
      >
        TRACK ORDER
      </EmailButton>
    </Section>
  </EmailLayout>
);