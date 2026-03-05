"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { 
  ArrowRightIcon, 
  QuoteIcon, 
  CpuIcon, 
  TrendingUpIcon, 
  CheckCircle2,
  UsersIcon,
  ClockIcon,
  DollarSignIcon,
  BarChart3Icon,
  ZapIcon,
  ShieldIcon,
  MessageSquareIcon,
  DownloadIcon,
  Share2Icon,
  BookmarkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

gsap.registerPlugin(ScrollTrigger);

export default function RoastAndRecoverCaseStudy() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header
      gsap.from(".case-study-header", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out"
      });

      // Animate stats
      gsap.from(".stat-card", {
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out"
      });

      // Timeline animation
      gsap.from(".timeline-item", {
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%",
        },
        opacity: 0,
        x: -50,
        stagger: 0.3,
        duration: 0.8,
        ease: "power3.out"
      });

      // Parallax effect
      gsap.to(".parallax-bg", {
        scrollTrigger: {
          scrub: true
        },
        y: 100,
        ease: "none"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Case study link copied to clipboard!");
  };

  const handleDownload = () => {
    toast.success("PDF download started!");
    // In a real app, you'd trigger a PDF download here
  };

  const handleBookmark = () => {
    toast.success("Added to bookmarks!");
  };

  const handleDemoRequest = () => {
    router.push('/contact?demo=true');
  };

  return (
    <main ref={containerRef} className="bg-white text-black min-h-screen">
      {/* NAVBAR */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-gray-300">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight cursor-pointer">
            Vivelune
          </Link>
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

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="parallax-bg absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5" />
        
        <div className="max-w-4xl mx-auto relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 case-study-header">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <Link href="/case-studies" className="hover:text-gray-900">Case Studies</Link>
            <span>/</span>
            <span className="text-gray-900">Roast & Recover</span>
          </div>

          {/* Header */}
          <div className="mb-12 case-study-header">
            <div className="flex items-center gap-4 mb-6">
              <div className="size-16 bg-orange-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-black text-white">R&R</span>
              </div>
              <div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                  Roast & Recover
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  How we automated customer recovery and saved $2.4M annually
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            
          </div>

          {/* Hero Image */}
          <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl mb-20 case-study-header">
            <Image
              src="/roast.jpg"
              alt="Roast & Recover Dashboard"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-sm opacity-80 mb-2">FEATURED INTEGRATION</p>
              <p className="text-2xl font-bold">AI-Powered Customer Recovery Platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section ref={statsRef} className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-16">
            The <span className="text-orange-500">Impact</span>
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { 
                icon: DollarSignIcon, 
                value: "$2.4M", 
                label: "Annual Revenue Saved",
                change: "+18%"
              },
              { 
                icon: ClockIcon, 
                value: "40.2h", 
                label: "Weekly Operations Saved",
                change: "-65%"
              },
              { 
                icon: UsersIcon, 
                value: "15K+", 
                label: "Customers Retained",
                change: "+92%"
              },
              { 
                icon: TrendingUpIcon, 
                value: "94%", 
                label: "Recovery Rate",
                change: "+47%"
              }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="stat-card bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center"
                >
                  <div className="size-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="size-8 text-orange-500" />
                  </div>
                  <div className="text-4xl font-black mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                  <div className="text-sm font-bold text-green-600">{stat.change}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CHALLENGE SECTION */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-8">
            The <span className="text-orange-500">Challenge</span>
          </h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Roast & Recover, a premium coffee subscription service, was facing a critical issue: 
              negative customer feedback was falling through the cracks, leading to churn and lost revenue.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 my-12">
              <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
                <h3 className="text-xl font-black mb-4 text-red-600">Before Vivelune</h3>
                <ul className="space-y-3">
                  {[
                    "Manual review of 500+ tickets/day",
                    "48hr average response time",
                    "15% customer churn rate",
                    "Missed high-value customer alerts"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-red-500 font-black">✕</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-50 p-8 rounded-3xl border border-green-100">
                <h3 className="text-xl font-black mb-4 text-green-600">After Vivelune</h3>
                <ul className="space-y-3">
                  {[
                    "Automated real-time processing",
                    "<5min average response time",
                    "3% customer churn rate",
                    "Instant VIP customer alerts"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="size-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-12 text-center">
            The <span className="text-orange-500">Solution</span>
          </h2>

          <div className="space-y-12">
            {[
              {
                step: 1,
                title: "Intelligent Routing",
                desc: "Vivelune analyzes incoming feedback, prioritizes by sentiment and customer value, and routes to appropriate queues.",
                icon: CpuIcon
              },
              {
                step: 2,
                title: "Automated Recovery",
                desc: "For high-value customers, the system automatically generates personalized recovery offers and escalation paths.",
                icon: ZapIcon
              },
              {
                step: 3,
                title: "Real-time Analytics",
                desc: "Dashboards provide instant visibility into recovery rates, response times, and revenue impact.",
                icon: BarChart3Icon
              }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-start gap-8"
                >
                  <div className="flex-shrink-0 size-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <Icon className="size-8 text-orange-500" />
                      <h3 className="text-2xl font-black">{item.title}</h3>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black text-white p-16 rounded-[60px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-purple-500/10" />
            
            <QuoteIcon className="size-16 text-orange-500 mb-8 relative z-10" />
            
            <blockquote className="text-3xl md:text-4xl font-light leading-relaxed mb-8 relative z-10">
              "Vivelune isn't just a tool—it's a digital employee that never sleeps. 
              We've transformed our customer recovery process from reactive to proactive, 
              and the results speak for themselves."
            </blockquote>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="size-16 bg-orange-500 rounded-full flex items-center justify-center text-2xl font-black">
                AR
              </div>
              <div>
                <div className="font-black text-lg">Alex Rivera</div>
                <div className="text-gray-400">CEO, Roast & Recover</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNICAL ARCHITECTURE */}
      <section ref={timelineRef} className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-12 text-center">
            Technical <span className="text-orange-500">Architecture</span>
          </h2>

          <div className="space-y-8">
            {[
              {
                title: "Webhook Integration",
                desc: "Google Forms → Vivelune webhook trigger captures customer feedback in real-time"
              },
              {
                title: "AI Analysis",
                desc: "Sentiment analysis and priority scoring using GPT-4 and custom classifiers"
              },
              {
                title: "CRM Enrichment",
                desc: "Fetch customer lifetime value and history from Stripe via API"
              },
              {
                title: "Decision Engine",
                desc: "Route to appropriate workflow based on priority and customer value"
              },
              {
                title: "Action Execution",
                desc: "Generate offers, send emails, create support tickets, notify Slack"
              },
              {
                title: "Analytics Pipeline",
                desc: "Track all events, measure success rates, update dashboards"
              }
            ].map((item, i) => (
              <div key={i} className="timeline-item flex gap-6">
                <div className="flex-shrink-0 w-12 text-center">
                  <div className="size-8 bg-orange-500 rounded-full mx-auto mb-2" />
                  {i < 5 && <div className="w-0.5 h-16 bg-orange-200 mx-auto" />}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-xl font-black mb-2">{item.title}</h3>
                  <p className="text-gray-700">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to transform your <br />
            <span className="text-orange-500">customer recovery?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join Roast & Recover and hundreds of other companies using Vivelune to automate customer success.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            
            <Button
              onClick={() => router.push('/signup')}
              variant="outline"
              className="border-gray-300 hover:bg-gray-50 rounded-full px-10 py-6 text-lg font-black"
            >
              Start Free Trial
              <ArrowRightIcon className="ml-2 size-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-300 px-6 py-10">
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
  );
}