// Components
export { EmailLayout } from "./components/layout";
export { EmailButton } from "./components/button";
export { theme, globalStyles } from "./components/styles";

// Templates - Commerce
export {
  AbandonedCartEmail,
  OrderConfirmationEmail,
  ShippingUpdateEmail,
  ProductCareEmail,
} from "./templates/commerce";

// Types
export type { EmailTemplate, EmailData, EmailResponse } from "./types";

// Utilities
export { emailService } from "./utils/sender";
export { renderEmailTemplate } from "./utils/renderer";