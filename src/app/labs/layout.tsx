import type { Metadata } from "next";
import { Teko, Rajdhani, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const teko = Teko({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-data",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ViveLune Labs — Premium 1-to-1 Education",
  description:
    "Private, expert-led instruction in AI, App Development, E-Commerce, Languages and more. 1-to-1 sessions starting from $80 USD/month.",
  keywords: [
    "online tutoring",
    "1 to 1 classes",
    "AI courses",
    "language learning",
    "app development",
    "vivelune",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${teko.variable} ${rajdhani.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-void antialiased">{children}</body>
    </html>
  );
}