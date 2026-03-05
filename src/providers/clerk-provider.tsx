'use client';

import { ClerkProvider as BaseClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  
  return (
    <BaseClerkProvider
      appearance={{
        baseTheme: resolvedTheme === 'dark' ? dark : undefined,
        variables: {
          // Tactical Orange Accent
          colorPrimary: '#FF6B00',
          // Matching the Zinc-950/Black background of your EntityContainer
          colorBackground: resolvedTheme === 'dark' ? '#09090B' : '#ffffff',
          colorText: resolvedTheme === 'dark' ? '#F4F4F5' : '#09090B',
          colorInputBackground: resolvedTheme === 'dark' ? '#18181B' : '#f4f4f5',
          colorInputText: resolvedTheme === 'dark' ? '#FFFFFF' : '#09090B',
          // Sharp Industrial Corners
          borderRadius: '0px', 
        },
        elements: {
          formButtonPrimary: 
            "bg-[#FF6B00] hover:bg-[#FF8533] text-black font-black uppercase tracking-widest text-[11px] shadow-[0_0_20px_rgba(255,107,0,0.15)] transition-all",
          card: 
            "border border-zinc-800 shadow-2xl",
          headerTitle: 
            "font-black uppercase tracking-[2px] italic text-zinc-100",
          headerSubtitle: 
            "text-[10px] font-bold uppercase tracking-widest text-zinc-500",
          socialButtonsBlockButton: 
            "border-zinc-800 hover:bg-zinc-900 font-bold uppercase text-[10px] tracking-tight",
          footerActionText: 
            "text-zinc-500 font-bold uppercase text-[10px]",
          footerActionLink: 
            "text-[#FF6B00] hover:text-[#FF8533] font-black uppercase"
        }
      }}
    >
      {children}
    </BaseClerkProvider>
  );
}