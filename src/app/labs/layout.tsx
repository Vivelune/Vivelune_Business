import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css"
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ViveLune Labs — Premium 1-to-1 Education",
  description:
    "Private, expert-led instruction in AI, App Development, E-Commerce, Languages and more. 1-to-1 sessions starting from $80 USD/month.",
  keywords: ["online tutoring", "1 to 1 classes", "AI courses", "language learning", "app development", "vivelune"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="bg-black antialiased">{children}</body>
    </html>
  );
}
