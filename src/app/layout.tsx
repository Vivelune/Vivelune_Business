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

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Vivelune – Automate Workflows, Orchestrate Intelligence',
  description: 'Vivelune is a modern automation workflow builder that connects AI, APIs, and services into reliable, observable flows.',
  icons: { icon: '/vivelune-logo-square.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} antialiased bg-background text-foreground selection:bg-primary/30`}>
        <ThemeProvider>
          <ClerkProvider>
            <TRPCReactProvider>
              <NuqsAdapter>
                <Provider>
                  <HydrationProvider>
                    {/* Subtle Radial Gradient for Depth */}
                    <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
                    {children}
                    <WelcomeModal />
                    <Toaster 
                      position="bottom-right"
                      toastOptions={{
                        className: 'rounded-xl border border-border bg-card/80 backdrop-blur-md text-foreground text-xs font-medium shadow-2xl',
                        duration: 4000,
                      }}
                    />
                  </HydrationProvider>
                </Provider>
              </NuqsAdapter>
            </TRPCReactProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}