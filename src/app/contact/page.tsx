"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"

export default function Page() {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Hero animation */
      gsap.timeline()
        .from(".hero-item", { opacity: 0, y: 50, stagger: 0.15, duration: 1, ease: "power3.out" })

      /* Marquee animation */
      gsap.to(".marquee-track", {
        xPercent: -50,
        duration: 25,
        ease: "linear",
        repeat: -1,
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <main className="bg-white text-black overflow-x-hidden h-screen">
      {/* ================= NAV ================= */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-gray-300">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <div className="text-xl font-semibold tracking-tight cursor-pointer">
            <Link href="/welcome">Vivelune</Link></div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <Link href="/docs" className="hover:text-gray-900 transition">Docs</Link>
            <Link href="/contact" className="hover:text-gray-900 transition font-semibold">Contact</Link>
            <Link href="/login" className="hover:text-gray-900 transition">Login</Link>
            <Link
              href="/signup"
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md shadow-md shadow-gray-400/20 transition"
            >
              Start Free Trial
            </Link>
          </nav>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="pt-44 pb-20 px-6 text-center items-center mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="hero-item text-5xl md:text-6xl font-semibold tracking-tight">
            Get in touch.
          </h1>
          <p className="hero-item mt-6 text-lg text-gray-600">
            We’re here to help you get started, answer questions, and provide support.
            Reach out to us anytime.
          </p>
          <p className="hero-item mt-2 text-gray-600">Email: <a href="mailto:hello@vivelune.com" className="underline">hello@vivelune.com</a></p>
        </div>
      </section>

      {/* ================= LOGO MARQUEE ================= */}
      <section className="pb-32">
        <p className="text-center text-sm text-gray-500 mb-8">
          Trusted and integrated with modern platforms
        </p>
        <div ref={marqueeRef} className="relative overflow-hidden">
          <div className="marquee-track flex gap-16 w-max px-10">
            {[
              "Slack", "GitHub", "Google", "OpenAI", "Gemini",
              "Claude", "DeepSeek", "Discord", "Slack", "GitHub",
              "Google", "OpenAI", "Gemini", "Claude", "DeepSeek", "Discord",
            ].map((brand, i) => (
              <div key={i} className="text-2xl font-semibold tracking-tight text-gray-500 opacity-80">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT FORM ================= */}
      

      {/* ================= FOOTER ================= */}
      <footer className="border-t absolute w-full bottom-0 border-gray-300 px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6 text-sm text-gray-500">
          <span>© {new Date().getFullYear()} Vivelune</span>
          <div className="flex gap-6 flex-wrap">
            <Link href="/privacy" className="hover:text-gray-900 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-900 transition">Terms of Service</Link>
            <Link href="/agreement" className="hover:text-gray-900 transition">User Agreement</Link>
            <Link href="/docs" className="hover:text-gray-900 transition">Docs</Link>
            <Link href="/contact" className="hover:text-gray-900 transition">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
