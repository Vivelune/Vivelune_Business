"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Scale, Users, CreditCard, Ban, AlertTriangle, Gavel, ArrowRight } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export default function TermsPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.from(".fade-item", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      })

      // Hover effect for the cards (Logic remains untouched)
      const cards = gsap.utils.toArray<HTMLElement>(".term-card")
      cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { borderColor: "var(--primary)", backgroundColor: "var(--secondary)", duration: 0.3 })
        })
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { borderColor: "var(--border)", backgroundColor: "transparent", duration: 0.3 })
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const terms = [
    {
      title: "Use of Services",
      icon: <Scale className="w-5 h-5 text-primary" />,
      text: "Use Vivelune only lawfully. No misuse, illegal activity, or interference with service orchestration."
    },
    {
      title: "Accounts",
      icon: <Users className="w-5 h-5 text-primary" />,
      text: "You are responsible for your credentials and all activity under your account. Keep your access keys secure."
    },
    {
      title: "Subscription and Payment",
      icon: <CreditCard className="w-5 h-5 text-primary" />,
      text: "Premium features may require payment; payments are non-refundable unless explicitly stated in your plan."
    },
    {
      title: "Termination",
      icon: <Ban className="w-5 h-5 text-primary" />,
      text: "Accounts may be suspended or terminated for violations without notice to protect our network integrity."
    },
    {
      title: "Limitation of Liability",
      icon: <AlertTriangle className="w-5 h-5 text-primary" />,
      text: "Vivelune is provided 'as is'; we are not liable for indirect, incidental, or consequential workflow damages."
    },
    {
      title: "Governing Law",
      icon: <Gavel className="w-5 h-5 text-primary" />,
      text: "These terms are governed by United States law. Disputes will be resolved within United States courts."
    }
  ]

  return (
    <main ref={containerRef} className="bg-background text-foreground min-h-screen relative selection:bg-primary/30">
      {/* Dynamic Background Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* NAVBAR */}
      <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <Link href="/welcome" className="flex items-center gap-2 group">
            <div className="w-5 h-5 bg-primary rounded-full group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold tracking-tighter">Vivelune</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/docs" className="hover:text-primary transition-colors">Docs</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
            <Link
              href="/signup"
              className="bg-foreground text-background hover:bg-primary hover:text-primary-foreground px-5 py-2 rounded-full font-bold transition-all"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* HEADER SECTION */}
      <div className="pt-40 pb-16 px-6 max-w-4xl mx-auto">
        <div className="fade-item flex items-center gap-2 mb-4">
          <div className="h-px w-8 bg-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Legal Terms</span>
        </div>
        <h1 className="fade-item text-4xl md:text-6xl font-black tracking-tight mb-6">
          Terms of <span className="text-primary">Service</span>
        </h1>
        <p className="fade-item text-muted-foreground text-lg max-w-2xl leading-relaxed">
          By using Vivelune, you agree to these rules. We’ve kept them concise to respect your time—please read them carefully.
        </p>
      </div>

      {/* TERMS GRID */}
      <div className="px-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 pb-48">
        {terms.map((term, i) => (
          <div 
            key={i} 
            className="fade-item term-card border border-border p-8 rounded-3xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="mb-6 p-3 w-fit rounded-2xl bg-secondary/50 border border-border/50">
                {term.icon}
              </div>
              <h2 className="text-xl font-bold mb-3">{term.title}</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {term.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="border-t border-border/50 bg-card/50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-1">
            <span className="font-black text-xl tracking-tighter">Vivelune</span>
            <span className="text-xs text-muted-foreground">© {new Date().getFullYear()} Orchestrating Intelligence.</span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition">Terms</Link>
            <Link href="/agreement" className="hover:text-primary transition text-primary">User Agreement</Link>
            <Link href="/docs" className="hover:text-primary transition">Docs</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}