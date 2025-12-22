"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function AgreementPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fade-item", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".fade-item",
          start: "top 85%",
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <main ref={containerRef} className="bg-white text-black min-h-screen">
      {/* NAVBAR */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-gray-300">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <div className="text-xl font-semibold tracking-tight cursor-pointer">
            <Link href="/">Vivelune</Link></div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <Link href="/docs" className="hover:text-gray-900 transition">Docs</Link>
            <Link href="/contact" className="hover:text-gray-900 transition">Contact</Link>
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

      {/* CONTENT */}
      <div className="pt-36 px-6 max-w-3xl mx-auto">
        <h1 className="fade-item text-3xl font-semibold mb-6">User Agreement</h1>

        <div className="fade-item mb-6">
          <h2 className="text-xl font-semibold mb-2">Account Responsibility</h2>
          <p className="text-gray-700">
            You are responsible for account security and all activities under your account.
          </p>
        </div>

        <div className="fade-item mb-6">
          <h2 className="text-xl font-semibold mb-2">Prohibited Activities</h2>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Illegal or malicious use</li>
            <li>Unauthorized access attempts</li>
            <li>Disrupting services</li>
          </ul>
        </div>

        <div className="fade-item mb-6">
          <h2 className="text-xl font-semibold mb-2">Intellectual Property</h2>
          <p className="text-gray-700">
            All content and software belong to Vivelune. No copying or redistribution without permission.
          </p>
        </div>

        <div className="fade-item mb-6">
          <h2 className="text-xl font-semibold mb-2">Termination</h2>
          <p className="text-gray-700">
            Accounts may be suspended or terminated for violations.
          </p>
        </div>

        <div className="fade-item mb-6">
          <h2 className="text-xl font-semibold mb-2">Disclaimer</h2>
          <p className="text-gray-700">
            Vivelune is provided "as is"; no warranties; not responsible for damages from use.
          </p>
        </div>
      </div>

      {/* FOOTER */}
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
