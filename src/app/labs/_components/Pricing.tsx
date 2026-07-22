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
    priceUSD: 187,
    cadApprox: "≈ CA$260",
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
    <section id="pricing" className="py-28 border-t border-white/8 bg-panel">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-data text-accent text-[11px] tracking-[0.3em] uppercase mb-4 flex items-center justify-center gap-2">
            <span className="w-6 h-px bg-accent" /> Loadout Tiers <span className="w-6 h-px bg-accent" />
          </p>
          <h2 className="font-display text-5xl md:text-7xl font-semibold mb-4 uppercase leading-[0.95]">
            Simple, <span className="text-accent">honest</span> pricing
          </h2>
          <div className="w-10 h-px bg-accent/50 mx-auto my-6" />
          <p className="text-white/40 font-body text-sm max-w-md mx-auto leading-relaxed">
            1-to-1 classes starting as low as{" "}
            <span className="text-white/80 font-semibold">$58 USD / month</span>.
            No subscriptions. No auto-billing. Just great instruction.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan, i) => (
            <div
              key={plan.sessions}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`notch relative p-8 lg:p-10 transition-all duration-300 cursor-default border
                ${
                  plan.featured
                    ? "bg-void border-accent/60"
                    : hoveredIndex === i
                    ? "bg-void border-white/20"
                    : "bg-void border-white/8"
                }`}
            >
              {plan.featured && (
                <div className="absolute top-0 right-0 notch-sm bg-accent text-white text-[9px] tracking-[0.2em] uppercase font-bold px-4 py-1.5 font-data">
                  Top Pick
                </div>
              )}

              {/* Plan header */}
              <div className="mb-8">
                <p className="font-data text-[10px] tracking-[0.2em] uppercase text-accent/80 mb-1">
                  {plan.sessions} {plan.sessions === "1" ? "session" : "sessions"} / week
                </p>
                <p className="font-display text-2xl font-semibold text-white/70 mb-6 uppercase tracking-tight">
                  {plan.label}
                </p>

                {/* Price */}
                <div className="flex items-start gap-1 mb-1">
                  <span className="text-white/40 font-body text-lg mt-1.5">$</span>
                  <span className="font-display text-7xl font-semibold text-white leading-none">
                    {plan.priceUSD}
                  </span>
                  <span className="text-white/30 font-data text-xs mt-auto mb-2 ml-1">USD</span>
                </div>
                <p className="text-white/25 font-data text-[11px] mb-1">{plan.cadApprox}</p>
                <p className="text-white/25 font-data text-[11px] tracking-wide">{plan.period}</p>
              </div>

              {/* Subtitle */}
              <div className="border-t border-white/8 pt-6 mb-6">
                <p className="text-white/35 font-body text-xs leading-relaxed">{plan.subtitle}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-xs font-body text-white/45">
                    <span className="text-accent/70 mt-0.5 leading-none font-data">▸</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={`mailto:hello@vivelune.com?subject=Enrolment — ${plan.sessions} Session${
                  plan.sessions !== "1" ? "s" : ""
                }/Week (${plan.label})`}
                className={`notch-sm block w-full text-center text-xs tracking-[0.18em] uppercase py-3.5 transition-all duration-200 font-body font-semibold
                  ${
                    plan.featured
                      ? "bg-accent hover:bg-[#e8c98a] text-white"
                      : "border border-white/15 hover:border-white/35 text-white/50 hover:text-white"
                  }`}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>

        <p className="text-center mt-8 text-white/20 font-data text-[11px] tracking-wide">
          Canadian dollar amounts are approximate. All sessions are 55 minutes. Payments issued monthly — no recurring charges.
        </p>
      </div>
    </section>
  );
}