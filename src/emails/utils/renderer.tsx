// src/emails/utils/renderer.ts
import { render } from "@react-email/components";
import { EmailTemplate } from "../types";
import { 
  AbandonedCartEmail,
  OrderConfirmationEmail,
  ShippingUpdateEmail,
  ProductCareEmail 
} from "../templates/commerce";
// Import your other templates
import { WelcomeEmail } from "../templates/auth/welcome";
import { SummaryEmail } from "../templates/workflow/summary";
import { NotificationEmail } from "../templates/workflow/notification";

export async function renderEmailTemplate(
  template: EmailTemplate,
  data: Record<string, any>
): Promise<string> {
  switch (template) {
    // Auth Templates
    case "welcome":
      return await render(
        <WelcomeEmail 
          name={data.name} 
          dashboardUrl={data.dashboardUrl || "https://roastandrecover.com/dashboard"} 
        />
      );
    
    // Workflow Templates
    case "summary":
      return await render(
        <SummaryEmail
          name={data.name}
          summary={data.summary}
          workflowName={data.workflowName}
          executionId={data.executionId}
          appUrl={data.appUrl}
        />
      );
    
    case "notification":
      return await render(
        <NotificationEmail
          name={data.name}
          message={data.message}
          actionUrl={data.actionUrl}
          actionText={data.actionText}
        />
      );
    
    // Commerce Templates
    case "abandoned-cart":
      return await render(
        <AbandonedCartEmail 
          name={data.name} 
          cartUrl={data.cartUrl}
          itemCount={data.itemCount}
          itemNames={data.itemNames}
        />
      );
    
    case "order-confirmation":
      return await render(
        <OrderConfirmationEmail
          name={data.name}
          orderId={data.orderId}
          total={data.total}
          items={data.items}
          trackingUrl={data.trackingUrl}
          estimatedDelivery={data.estimatedDelivery}
        />
      );
    
    case "shipping-update":
      return await render(
        <ShippingUpdateEmail
          name={data.name}
          trackingUrl={data.trackingUrl}
          carrier={data.carrier}
          estimatedDelivery={data.estimatedDelivery}
          orderId={data.orderId}
        />
      );
    
    case "product-care":
      return await render(
        <ProductCareEmail
          name={data.name}
          productName={data.productName}
          material={data.material}
          careGuideUrl={data.careGuideUrl}
        />
      );
    
    default:
      throw new Error(`Template "${template}" not implemented`);
  }
}