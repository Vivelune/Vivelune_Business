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
import { WelcomeModal } from "@/components/welcome-modal";

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
        <WelcomeModal/>
                  <Toaster 
                    position="bottom-right"
                    toastOptions={{
                      className: 'rounded-none border border-[#DCD5CB] bg-[#F4F1EE] text-[#1C1C1C] text-[10px] uppercase tracking-wider font-bold',
                      duration: 4000,
                    }}
                  />
        </HydrationProvider>
        </Provider>
        </NuqsAdapter> 
        
        </TRPCReactProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
