"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRightIcon, SparklesIcon, ZapIcon, ShieldIcon, WorkflowIcon, CloudIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const heroRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from(".hero-title", {
        opacity: 0,
        y: 100,
        duration: 1.2,
        ease: "power4.out",
      });
      
      gsap.from(".hero-subtitle", {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });
      
      gsap.from(".hero-cta", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.6,
        ease: "power3.out",
        stagger: 0.2,
      });

      // Marquee animation
      gsap.to(".marquee-track", {
        xPercent: -50,
        duration: 30,
        ease: "linear",
        repeat: -1,
      });

      // Features animation
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Stats animation
      gsap.from(".stat-number", {
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  const brands = [
    { name: "OpenAI", logo: "/openai.svg" },
    { name: "Anthropic", logo: "/anthropic.svg" },
    { name: "Google Gemini", logo: "/gemini.svg" },
    { name: "DeepSeek", logo: "/deepseek.svg" },
    { name: "Slack", logo: "/slack.svg" },
    { name: "Discord", logo: "/discord.svg" },
    { name: "Stripe", logo: "/stripe.svg" },
    { name: "Google Forms", logo: "/googleForm.svg" },
    { name: "RoastandRecover", logo: "/randr.png" }, // Add this logo to public folder
  ];

  const features = [
    {
      icon: WorkflowIcon,
      title: "Visual Workflow Builder",
      description: "Design complex automation flows with an intuitive drag-and-drop interface. No code required.",
    },
    {
      icon: SparklesIcon,
      title: "AI-Native Automation",
      description: "Seamlessly integrate OpenAI, Anthropic, Gemini, and DeepSeek into your workflows.",
    },
    {
      icon: ZapIcon,
      title: "Real-time Execution",
      description: "Watch your workflows execute in real-time with live status updates and detailed logs.",
    },
    {
      icon: ShieldIcon,
      title: "Enterprise Security",
      description: "Your data is encrypted at rest and in transit. SOC2 compliant infrastructure.",
    },
    {
      icon: CloudIcon,
      title: "100+ Integrations",
      description: "Connect with popular services like Slack, Discord, Stripe, and Google Forms.",
    },
    {
      icon: ArrowRightIcon,
      title: "Custom API Support",
      description: "Build custom integrations with our powerful HTTP request node and webhook support.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "1M+", label: "Workflows Executed" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <main className="bg-white text-black overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-primary.png" alt="Vivelune" width={32} height={32} />
            <span className="text-xl font-semibold tracking-tight">Vivelune</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-gray-600 hover:text-black transition">
              Features
            </Link>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-black transition">
              Pricing
            </Link>
            <Link href="/docs" className="text-sm text-gray-600 hover:text-black transition">
              Docs
            </Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-black transition">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <Link
                href="/workflows"
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm transition"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-black transition"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm transition"
                >
                  Start Free Trial
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-8 hero-title">
            <SparklesIcon className="size-4 text-gray-600" />
            <span className="text-sm text-gray-600">The Future of Automation</span>
          </div>

          <h1 className="hero-title text-6xl md:text-7xl font-bold tracking-tight mb-6">
            Automate workflows with
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block mt-2">
              AI-powered intelligence
            </span>
          </h1>

          <p className="hero-subtitle text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Vivelune is a modern automation platform that connects AI models, APIs, and services 
            into reliable, observable workflows. Build complex automations without writing a single line of code.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-lg text-lg font-medium transition inline-flex items-center justify-center gap-2"
            >
              Start Free Trial
              <ArrowRightIcon className="size-5" />
            </Link>
            <Link
              href="#demo"
              className="border border-gray-300 hover:border-gray-900 px-8 py-4 rounded-lg text-lg font-medium transition"
            >
              Watch Demo
            </Link>
          </div>

          {/* Trusted by badge */}
          <p className="hero-subtitle text-sm text-gray-500 mt-12">
            Trusted by innovative companies worldwide
          </p>
        </div>
      </section>

      {/* Logo Marquee */}
      <section className="py-12 border-y border-gray-200">
        <div ref={marqueeRef} className="relative overflow-hidden">
          <div className="marquee-track flex gap-16 w-max px-10">
            {[...brands, ...brands].map((brand, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-500">
                {brand.logo.startsWith('/') ? (
                  <Image src={brand.logo} alt={brand.name} width={24} height={24} />
                ) : null}
                <span className="text-lg font-medium whitespace-nowrap">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need to automate</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features that make workflow automation accessible, reliable, and intelligent.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card p-8 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition">
                  <feature.icon className="size-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="stat-number text-4xl md:text-5xl font-bold text-black mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RoastandRecover Spotlight */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-linear-to-r from-orange-500 to-red-500 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full translate-y-48 -translate-x-48"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                  <Image
                    src="/randr.png"
                    alt="RoastandRecover"
                    width={48}
                    height={48}
                    className="rounded-xl bg-white p-2"
                  />
                  <span className="text-2xl font-bold">RoastandRecover</span>
                </div>
                <h2 className="text-4xl font-bold mb-4">Built for RoastandRecover</h2>
                <p className="text-xl text-white/90 mb-8">
                  Vivelune powers RoastandRecover's automated customer feedback analysis, 
                  sentiment tracking, and recovery workflows. Process thousands of reviews 
                  daily with AI-powered insights.
                </p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold">50K+</div>
                    <div className="text-sm text-white/80">Reviews Processed</div>
                  </div>
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-sm text-white/80">Accuracy Rate</div>
                  </div>
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm text-white/80">Automated Recovery</div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 max-w-md">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold mb-4">How it works</h3>
                  <ul className="space-y-4">
                    {[
                      "Customer review submitted via Google Form",
                      "AI analyzes sentiment and key issues",
                      "Automated recovery email sent to customer",
                      "Data synced to CRM for tracking",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm flex-linear-0">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to automate your workflows?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of companies building intelligent automations with Vivelune.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-lg text-lg font-medium transition"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="border border-gray-300 hover:border-gray-900 px-8 py-4 rounded-lg text-lg font-medium transition"
            >
              Contact Sales
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/logo-primary.png" alt="Vivelune" width={24} height={24} />
                <span className="text-lg font-semibold">Vivelune</span>
              </div>
              <p className="text-sm text-gray-600">
                AI-powered workflow automation for modern businesses.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#features" className="hover:text-black transition">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-black transition">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-black transition">Documentation</Link></li>
                <li><Link href="/changelog" className="hover:text-black transition">Changelog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about" className="hover:text-black transition">About</Link></li>
                <li><Link href="/blog" className="hover:text-black transition">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-black transition">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-black transition">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/privacy" className="hover:text-black transition">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-black transition">Terms</Link></li>
                <li><Link href="/agreement" className="hover:text-black transition">Agreement</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Vivelune. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="https://twitter.com/vivelune" className="text-gray-400 hover:text-gray-600 transition">
                Twitter
              </Link>
              <Link href="https://github.com/vivelune" className="text-gray-400 hover:text-gray-600 transition">
                GitHub
              </Link>
              <Link href="https://linkedin.com/company/vivelune" className="text-gray-400 hover:text-gray-600 transition">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}