// // src/lib/email-renderer.tsx
// import { render } from "@react-email/components";
// import { WelcomeEmail } from "@/emails/welcome-email";
// import { SummaryEmail } from "@/emails/summary-email";
// import { NotificationEmail } from "@/emails/notification-email";

// export type EmailTemplate = "welcome" | "summary" | "notification";

// export interface RenderEmailOptions {
//   template: EmailTemplate;
//   data: Record<string, any>;
// }

// export async function renderEmail({ template, data }: RenderEmailOptions): Promise<string> {
//   switch (template) {
//     case "welcome":
//       return await render(
//         <WelcomeEmail
//           name={data.name}
//           dashboardLink={data.dashboardLink}
//         />
//       );
      
//     case "summary":
//       return await render(
//         <SummaryEmail
//           name={data.name}
//           summary={data.summary}
//           workflowName={data.workflowName}
//           executionId={data.executionId}
//           appUrl={data.appUrl}
//         />
//       );
      
//     case "notification":
//       return await render(
//         <NotificationEmail
//           name={data.name}
//           message={data.message}
//           actionUrl={data.actionUrl}
//           actionText={data.actionText}
//         />
//       );
      
//     default:
//       throw new Error(`Unknown template: ${template}`);
//   }
// }

// // Also export a default object if needed
// export default { renderEmail };