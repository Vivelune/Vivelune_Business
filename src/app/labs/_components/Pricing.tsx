"use client";

import { useState } from "react";

const PLANS = [
  {
    sessions: "1",
    label: "Starter",
    priceUSD: 58,
    cadApprox: "≈ CA$80",
    period: "per month",
    subtitle: "1 session per week · 55 min each · 4 sessions/month",
    features: [
      "Private 1-to-1 instruction",
      "Dedicated Zoom classroom",
      "WhatsApp & email access",
      "Monthly manual payment link",
      "Cancel anytime",
    ],
    featured: false,
  },
  {
    sessions: "2",
    label: "Standard",
    priceUSD: 108,
    cadApprox: "≈ CA$150",
    period: "per month",
    subtitle: "2 sessions per week · 55 min each · 8 sessions/month",
    features: [
      "Private 1-to-1 instruction",
      "Dedicated Zoom classroom",
      "WhatsApp & email access",
      "Make-up session guarantee",
      "Monthly manual payment link",
      "Cancel anytime",
    ],
    featured: true,
  },
  {
    sessions: "3",
    label: "Intensive",
    priceUSD: 158,
    cadApprox: "≈ CA$220",
    period: "per month",
    subtitle: "3 sessions per week · 55 min each · 12 sessions/month",
    features: [
      "Private 1-to-1 instruction",
      "Dedicated Zoom classroom",
      "Priority WhatsApp access",
      "Make-up session guarantee",
      "Monthly manual payment link",
      "Cancel anytime",
    ],
    featured: false,
  },
];

export default function Pricing() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="pricing" className="py-28 border-t border-white/5 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#c9a96e] text-xs tracking-[0.24em] uppercase font-body mb-4">Investment</p>
          <h2 className="font-display text-4xl md:text-6xl font-light mb-4">
            Simple, <em className="not-italic text-[#c9a96e]">honest</em> pricing
          </h2>
          <div className="w-10 h-px bg-[#c9a96e]/40 mx-auto my-6" />
          <p className="text-white/35 font-body text-sm max-w-md mx-auto leading-relaxed">
            1-to-1 classes starting as low as{" "}
            <span className="text-white/70 font-medium">$58 USD / month</span>.
            No subscriptions. No auto-billing. Just great instruction.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/5">
          {PLANS.map((plan, i) => (
            <div
              key={plan.sessions}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative p-8 lg:p-10 transition-all duration-500 cursor-default
                ${i < PLANS.length - 1 ? "border-r border-white/5" : ""}
                ${plan.featured
                  ? "bg-[#0e0d08] border-t-2 border-t-[#c9a96e]"
                  : hoveredIndex === i
                  ? "bg-zinc-950"
                  : "bg-black"
                }`}
            >
              {plan.featured && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-[#c9a96e] text-black text-[9px] tracking-[0.2em] uppercase font-medium px-4 py-1 font-body whitespace-nowrap">
                  Most Popular
                </div>
              )}

              {/* Plan header */}
              <div className="mb-8">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#c9a96e]/70 font-body mb-1">
                  {plan.sessions} {plan.sessions === "1" ? "session" : "sessions"} / week
                </p>
                <p className="font-display text-xl font-light text-white/60 mb-6">
                  {plan.label}
                </p>

                {/* Price */}
                <div className="flex items-start gap-1 mb-1">
                  <span className="text-white/40 font-body text-lg mt-1.5">$</span>
                  <span className="font-display text-6xl font-light text-white leading-none">
                    {plan.priceUSD}
                  </span>
                  <span className="text-white/30 font-body text-sm mt-auto mb-1 ml-1">USD</span>
                </div>
                <p className="text-white/20 font-body text-xs mb-1">{plan.cadApprox}</p>
                <p className="text-white/20 font-body text-xs tracking-wide">{plan.period}</p>
              </div>

              {/* Subtitle */}
              <div className="border-t border-white/5 pt-6 mb-6">
                <p className="text-white/30 font-body text-xs leading-relaxed">{plan.subtitle}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-xs font-body text-white/40">
                    <span className="text-[#c9a96e]/60 mt-0.5 leading-none">—</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={`mailto:hello@vivelune.com?subject=Enrolment — ${plan.sessions} Session${plan.sessions !== "1" ? "s" : ""}/Week (${plan.label})`}
                className={`block w-full text-center text-xs tracking-widest uppercase py-3.5 transition-all duration-300 font-body font-medium
                  ${plan.featured
                    ? "bg-[#c9a96e] hover:bg-[#e8c98a] text-black"
                    : "border border-white/10 hover:border-white/25 text-white/40 hover:text-white/70"
                  }`}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>

        <p className="text-center mt-6 text-white/15 font-body text-xs tracking-wide">
          Canadian dollar amounts are approximate. All sessions are 55 minutes. Payments issued monthly — no recurring charges.
        </p>
      </div>
    </section>
  );
}
