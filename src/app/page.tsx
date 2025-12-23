"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import gsap from "gsap"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function Page() {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: session } = await authClient.getSession()
        setIsAuthenticated(!!session)
        if (session?.user?.name) {
          setUserName(session.user.name)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [])

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

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
          setIsAuthenticated(false)
          setUserName(null)
        }
      }
    })
  }

  // Show loading state briefly
  if (isLoading) {
    return (
      <main className="bg-white text-black overflow-x-hidden min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-white text-black overflow-x-hidden">
      {/* ================= NAV ================= */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-gray-300">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <div className="text-xl font-semibold tracking-tight cursor-pointer">
            <Link href="/">Vivelune</Link>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <Link href="/docs" className="hover:text-gray-900 transition">
              Docs
            </Link>
            <Link href="/contact" className="hover:text-gray-900 transition">
              Contact
            </Link>
            
            {/* Conditionally show login button or user dropdown */}
            {!isAuthenticated ? (
              <>
                <Link href="/login" className="hover:text-gray-900 transition">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md shadow-md shadow-gray-400/20 transition"
                >
                  Start Free Trial
                </Link>
              </>
            ) : (
              <>
                <Link href="/workflows" className="hover:text-gray-900 transition">
                  Dashboard
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-gray-700">Hi, {userName?.split(' ')[0] || 'Builder'}!</span>
                  <Link
                    href="/workflows"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md shadow-blue-400/20 transition"
                  >
                    Create Workflow
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900 transition text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="pt-44 pb-36 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {isAuthenticated ? (
            <>
              <h1 className="hero-item text-5xl md:text-6xl font-semibold tracking-tight">
                Welcome back, {userName?.split(' ')[0] || 'Builder'}!
                <br />
                <span className="font-normal text-blue-600">Ready to create something amazing?</span>
              </h1>

              <p className="hero-item mt-6 text-lg text-gray-600">
                Your automation canvas awaits. Transform ideas into intelligent workflows that work for you.
              </p>

              <div className="hero-item mt-10 flex justify-center gap-4">
                <Link
                  href="/workflows"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg shadow-lg shadow-blue-400/30 transition transform hover:-translate-y-1"
                >
                  🚀 Build Your First Workflow
                </Link>
                <Link
                  href="/docs"
                  className="border border-gray-300 px-6 py-3 rounded-md hover:border-blue-500 hover:text-blue-600 transition"
                >
                  Explore Templates
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="hero-item text-5xl md:text-6xl font-semibold tracking-tight">
                Automate workflows.
                <br />
                <span className="font-normal">Orchestrate intelligence.</span>
              </h1>

              <p className="hero-item mt-6 text-lg text-gray-600">
                Vivelune is a modern automation workflow builder that connects AI, APIs, and services into reliable, observable flows.
              </p>

              <div className="hero-item mt-10 flex justify-center gap-4">
                <Link
                  href="/signup"
                  className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-md shadow-lg shadow-gray-400/20 transition"
                >
                  Start 14-Day Free Trial
                </Link>
                <Link
                  href="/docs"
                  className="border border-gray-300 px-6 py-3 rounded-md hover:border-gray-900 transition"
                >
                  View Docs
                </Link>
              </div>
            </>
          )}
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
              <div key={i} className="text-2xl font-semibold tracking-wide text-gray-500 opacity-80">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="px-6 pb-32 grid gap-6 max-w-6xl mx-auto md:grid-cols-3">
        {isAuthenticated ? (
          // Authenticated user features - focused on creation
          <>
            <Feature 
              title="Visual Workflow Canvas" 
              description="Drag, drop, and connect nodes to bring your automation ideas to life instantly." 
              icon="🎨"
            />
            <Feature 
              title="AI-Powered Automation" 
              description="Integrate GPT-4, Claude, Gemini, and more - no code required, just creativity." 
              icon="🤖"
            />
            <Feature 
              title="Smart Templates" 
              description="Jumpstart with pre-built workflows for customer support, data processing, and alerts." 
              icon="📋"
            />
            <Feature 
              title="Real-time Execution" 
              description="Watch your workflows run live with detailed logs and status indicators." 
              icon="⚡"
            />
            <Feature 
              title="Team Collaboration" 
              description="Share workflows with your team, collaborate in real-time, and scale together." 
              icon="👥"
            />
            <Feature 
              title="Enterprise Ready" 
              description="Bank-level security, audit logs, and compliance for production workflows." 
              icon="🛡️"
            />
          </>
        ) : (
          // Guest features - focused on benefits
          <>
            <Feature 
              title="Visual Workflow Builder" 
              description="Design automation flows visually with full control and clarity." 
              icon="🎨"
            />
            <Feature 
              title="AI-Native Automation" 
              description="Integrate AI models like OpenAI, Claude, Gemini, and custom APIs effortlessly." 
              icon="🤖"
            />
            <Feature 
              title="Event-Driven Core" 
              description="React instantly to webhooks, schedules, and system events." 
              icon="⚡"
            />
            <Feature 
              title="Production Observability" 
              description="Track logs, retries, branching paths, and failures with ease." 
              icon="📊"
            />
            <Feature 
              title="Secure by Default" 
              description="Secrets, permissions, and isolation are built-in from the start." 
              icon="🔒"
            />
            <Feature 
              title="Infinite Scale" 
              description="Grow from startups to enterprise workloads without re-architecture." 
              icon="📈"
            />
          </>
        )}
      </section>

      {/* ================= CTA ================= */}
      {isAuthenticated ? (
        // Authenticated user CTA - focused on getting started
        <section className="px-6 pb-32">
          <div className="max-w-4xl mx-auto text-center rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-12 shadow-lg shadow-blue-200/30">
            <h2 className="text-3xl font-semibold text-gray-900">
              Your First Workflow is Waiting
            </h2>
            <p className="mt-4 text-gray-700">
              What will you automate today? Customer support? Data processing? Marketing automation?
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <Link 
                href="/workflows" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg shadow-lg shadow-blue-400/30 transition transform hover:-translate-y-1"
              >
                🎯 Start Building Now
              </Link>
              <Link 
                href="/docs" 
                className="border border-blue-300 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transition"
              >
                Explore Use Cases
              </Link>
            </div>
          </div>
        </section>
      ) : (
        // Guest CTA - focused on trial
        <section className="px-6 pb-32 text-center">
          <h2 className="text-3xl font-semibold">Simple pricing</h2>
          <p className="mt-4 text-gray-600">Start free. Upgrade when ready.</p>

          <div className="mt-10 max-w-md mx-auto rounded-2xl border border-gray-300 bg-white p-10 shadow-md shadow-gray-200/20">
            <div className="text-4xl font-semibold">19.99</div>
            <div className="text-sm text-gray-600">per month</div>

            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li>✔ 14-day free trial</li>
              <li>✔ Unlimited workflows</li>
              <li>✔ AI integrations</li>
              <li>✔ Logs & execution history</li>
            </ul>

            <Link
              href="/signup"
              className="inline-block mt-8 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-md shadow-md shadow-gray-400/20 transition"
            >
              Start Free Trial
            </Link>
          </div>
        </section>
      )}

      {/* ================= FINAL CTA ================= */}
      <section className="px-6 pb-32">
        <div className="max-w-4xl mx-auto text-center rounded-2xl border border-gray-300 bg-white p-12 shadow-md shadow-gray-200/20">
          {isAuthenticated ? (
            <>
              <h2 className="text-3xl font-semibold">
                The Future of Work is Automated
              </h2>
              <p className="mt-4 text-gray-600">
                Join thousands of innovators who are transforming their businesses with intelligent automation.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link 
                  href="/workflows" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-lg shadow-lg shadow-blue-400/30 transition"
                >
                  🚀 Launch Your Workflow Studio
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-semibold">
                Build automation you can trust
              </h2>
              <p className="mt-4 text-gray-600">
                Vivelune powers workflows where reliability and intelligence matter.
              </p>

              <div className="mt-8 flex justify-center gap-4">
                <Link href="/signup" className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-md shadow-md shadow-gray-400/20 transition">
                  Get Started
                </Link>
                <Link href="/contact" className="border border-gray-300 px-6 py-3 rounded-md hover:border-gray-900 transition">
                  Contact Sales
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-gray-300 px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6 text-sm text-gray-500">
          <span>© {new Date().getFullYear()} Vivelune</span>
          <div className="flex gap-6 flex-wrap">
            <Link href="/privacy" className="hover:text-gray-900 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-900 transition">
              Terms of Service
            </Link>
            <Link href="/agreement" className="hover:text-gray-900 transition">
              User Agreement
            </Link>
            <Link href="/docs" className="hover:text-gray-900 transition">
              Docs
            </Link>
            <Link href="/contact" className="hover:text-gray-900 transition">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

/* ================= FEATURE COMPONENT ================= */
function Feature({ 
  title, 
  description, 
  icon 
}: { 
  title: string; 
  description: string; 
  icon?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-300 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/20">
      {icon && <div className="text-2xl mb-3">{icon}</div>}
      <h3 className="font-medium">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  )
}