"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ShieldCheck, Eye, Lock, RefreshCw, UserCheck, Mail } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export default function PrivacyPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation for header and sections
      gsap.from(".fade-item", {
        opacity: 0,
        y: 20,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
      })

      // Decorative background animation
      gsap.to(".bg-glow", {
        opacity: 0.4,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const sections = [
    {
      title: "Information We Collect",
      icon: <Eye className="w-5 h-5 text-primary" />,
      content: (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-muted-foreground mt-4">
          <li className="flex items-center gap-2 bg-secondary/30 p-3 rounded-lg border border-border/50">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Personal info (name, email)
          </li>
          <li className="flex items-center gap-2 bg-secondary/30 p-3 rounded-lg border border-border/50">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Usage data and analytics
          </li>
          <li className="flex items-center gap-2 bg-secondary/30 p-3 rounded-lg border border-border/50">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Cookies & session data
          </li>
        </ul>
      )
    },
    {
      title: "How We Use Your Information",
      icon: <RefreshCw className="w-5 h-5 text-primary" />,
      content: "We use your information to provide and maintain our services, communicate updates, and comply with legal requirements. Your data fuels the orchestration that makes Vivelune efficient."
    },
    {
      title: "Data Sharing and Disclosure",
      icon: <UserCheck className="w-5 h-5 text-primary" />,
      content: "We never sell your information. We share data only with trusted providers necessary for service operations or when legally required by governing authorities."
    },
    {
      title: "Security Measures",
      icon: <Lock className="w-5 h-5 text-primary" />,
      content: "We implement industry-standard encryption and security protocols. While no system is 100% secure, we treat your workflow data with the highest level of sensitivity."
    }
  ]

  return (
    <main ref={containerRef} className="bg-background text-foreground min-h-screen relative overflow-hidden selection:bg-primary/30">
      {/* Visual Accents */}
      <div className="bg-glow absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="bg-glow absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none shadow-chart-1" />

      {/* NAVBAR */}
      <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <Link href="/welcome" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-6 h-6 bg-primary rounded-sm rotate-45" />
            <span className="text-xl font-bold tracking-tighter">Vivelune</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/docs" className="hover:text-foreground transition">Docs</Link>
            <Link href="/login" className="hover:text-foreground transition">Login</Link>
            <Link
              href="/signup"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:shadow-lg hover:shadow-primary/20 transition active:scale-95"
            >
              Start Free Trial
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <div className="pt-44 pb-20 px-6 max-w-4xl mx-auto text-center">
        <div className="fade-item inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
          <ShieldCheck className="w-3.5 h-3.5" /> Privacy First Platform
        </div>
        <h1 className="fade-item text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="fade-item text-muted-foreground text-lg max-w-2xl mx-auto">
          We believe in absolute transparency. This policy outlines how we protect your digital footprint while you build the future of your workflows.
        </p>
      </div>

      {/* CONTENT LIST */}
      <div className="px-6 max-w-3xl mx-auto space-y-8 pb-40">
        {sections.map((section, idx) => (
          <div 
            key={idx} 
            className="fade-item group bg-card/50 backdrop-blur-sm border border-border p-8 rounded-2xl hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-secondary/50 border border-border/50 group-hover:scale-110 transition-transform">
                {section.icon}
              </div>
              <h2 className="text-xl font-bold">{section.title}</h2>
            </div>
            <div className="text-muted-foreground leading-relaxed">
              {typeof section.content === 'string' ? <p>{section.content}</p> : section.content}
            </div>
          </div>
        ))}

        {/* Contact CTA */}
        <div className="fade-item mt-12 p-8 rounded-2xl border border-dashed border-primary/30 bg-primary/5 text-center">
          <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Questions about your data?</h3>
          <p className="text-muted-foreground mb-4">Our privacy team is ready to assist you with any concerns.</p>
          <a href="mailto:hello@vivelune.com" className="text-primary font-bold hover:underline underline-offset-4">
            hello@vivelune.com
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-border/50 bg-card/30 px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
          <span className="font-medium">© {new Date().getFullYear()} Vivelune Automation</span>
          <div className="flex gap-8 flex-wrap justify-center">
            <Link href="/privacy" className="hover:text-primary transition">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition">Terms</Link>
            <Link href="/docs" className="hover:text-primary transition">Documentation</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}