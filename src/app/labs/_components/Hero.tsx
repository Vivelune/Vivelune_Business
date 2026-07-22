"use client";

import { useEffect, useRef } from "react";

const SUBJECTS = [
  "AI & MACHINE LEARNING",
  "APP DEVELOPMENT",
  "E-COMMERCE",
  "LANGUAGES",
  "DATA SCIENCE",
  "UI/UX DESIGN",
];

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [eyebrowRef, titleRef, subRef, actionsRef, tagsRef];
    els.forEach((ref, i) => {
      if (!ref.current) return;
      ref.current.style.opacity = "0";
      ref.current.style.transform = "translateY(20px)";
      setTimeout(() => {
        if (!ref.current) return;
        ref.current.style.transition =
          "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)";
        ref.current.style.opacity = "1";
        ref.current.style.transform = "translateY(0)";
      }, 150 + i * 110);
    });
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 overflow-hidden bg-grid-tactical">
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] bg-[radial-gradient(ellipse,rgba(255,59,78,0.08)_0%,transparent_65%)] pointer-events-none" />

      {/* Diagonal scan line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      {/* Reticle corner brackets */}
      <div className="absolute top-20 left-8 w-10 h-10 border-l-2 border-t-2 border-accent/50 pointer-events-none" />
      <div className="absolute top-20 right-8 w-10 h-10 border-r-2 border-t-2 border-accent/50 pointer-events-none" />
      <div className="absolute bottom-24 left-8 w-10 h-10 border-l-2 border-b-2 border-white/10 pointer-events-none" />
      <div className="absolute bottom-24 right-8 w-10 h-10 border-r-2 border-b-2 border-white/10 pointer-events-none" />

      <p
        ref={eyebrowRef}
        className="font-data text-accent text-[11px] tracking-[0.35em] uppercase mb-7 flex items-center gap-2"
      >
        <span className="w-6 h-px bg-accent" />
        Premium 1-to-1 Education Platform
        <span className="w-6 h-px bg-accent" />
      </p>

      <h1
        ref={titleRef}
        className="font-display text-7xl md:text-9xl lg:text-[10rem] font-semibold leading-[0.92] tracking-tight mb-6 max-w-5xl uppercase"
      >
        Learn anything.
        <br />
        <span className="text-accent">Master everything.</span>
      </h1>

      <p
        ref={subRef}
        className="text-white/50 font-body text-base md:text-lg max-w-xl leading-relaxed mb-10"
      >
        ViveLune Labs connects ambitious learners with expert instructors for private,
        structured 1-to-1 sessions — across AI, development, e-commerce, languages, and beyond.
      </p>

      <div ref={actionsRef} className="flex flex-col sm:flex-row items-center gap-4 mb-16">
        <button
          onClick={() => scrollTo("pricing")}
          className="notch bg-accent hover:bg-[#e8c98a] text-white text-xs tracking-[0.2em] uppercase font-semibold px-9 py-4 transition-colors duration-200 font-body"
        >
          View Plans
        </button>
        <button
          onClick={() => scrollTo("subjects")}
          className="notch border border-white/15 hover:border-white/35 text-white/55 hover:text-white text-xs tracking-[0.2em] uppercase px-9 py-4 transition-all duration-200 font-body font-medium"
        >
          Explore Subjects
        </button>
      </div>

      {/* Subject tags */}
      <div ref={tagsRef} className="flex flex-wrap justify-center gap-2 max-w-2xl">
        {SUBJECTS.map((s) => (
          <span
            key={s}
            className="font-data text-[10px] tracking-wider text-white/35 border border-white/10 px-3 py-1.5 hover:text-accent hover:border-accent/40 transition-colors duration-200 cursor-default"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-10 bg-gradient-to-b from-accent/70 to-transparent animate-pulse" />
        <span className="font-data text-white/40 text-[10px] tracking-[0.25em] uppercase">
          Scroll
        </span>
      </div>
    </section>
  );
}