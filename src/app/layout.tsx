import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Provider } from "jotai";
import { ClerkProvider } from "@/providers/clerk-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { HydrationProvider } from "@/providers/hydration-provider";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: 'Vivelune – Automate Workflows, Orchestrate Intelligence',
  description: 'Vivelune is a modern automation workflow builder that connects AI, APIs, and services into reliable, observable flows.',
  icons: {
    icon: '/vivelune-logo-square.png', // Place favicon.ico in public/
  },
  openGraph: {
    title: 'Vivelune – Automate Workflows, Orchestrate Intelligence',
    description: 'Vivelune is a modern automation workflow builder that connects AI, APIs, and services into reliable, observable flows.',
    url: 'https://www.vivelune.com',
    siteName: 'Vivelune',
    images: [
      {
        url: '/vivelune-logo-square.png', // Place your Open Graph image in public/
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vivelune – Automate Workflows, Orchestrate Intelligence',
    description: 'Vivelune is a modern automation workflow builder that connects AI, APIs, and services into reliable, observable flows.',
    images: ['/vivelune-logo-square.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"  >
      <body
        className={` ${geistMono.variable} antialiased `}
      >
        <ClerkProvider>

        <TRPCReactProvider>
          <NuqsAdapter>
            <Provider>
            <HydrationProvider>
        {children}
        <Toaster/>
        </HydrationProvider>
        </Provider>
        </NuqsAdapter> 
        
        </TRPCReactProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
