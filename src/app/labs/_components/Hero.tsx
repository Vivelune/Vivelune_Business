"use client";

import { useEffect, useRef } from "react";

const SUBJECTS = ["AI & Machine Learning", "App Development", "E-Commerce", "Languages", "Data Science", "UI/UX Design"];

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
      ref.current.style.transform = "translateY(28px)";
      setTimeout(() => {
        if (!ref.current) return;
        ref.current.style.transition = "opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)";
        ref.current.style.opacity = "1";
        ref.current.style.transform = "translateY(0)";
      }, 200 + i * 150);
    });
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(201,169,110,0.07)_0%,transparent_65%)] pointer-events-none" />

      {/* Corner accents */}
      <div className="absolute top-24 left-10 w-16 h-16 border-l border-t border-gold/20 pointer-events-none" />
      <div className="absolute top-24 right-10 w-16 h-16 border-r border-t border-gold/20 pointer-events-none" />

      <p
        ref={eyebrowRef}
        className="text-gold text-xs tracking-[0.28em] uppercase font-body mb-6"
      >
        Premium 1-to-1 Education Platform
      </p>

      <h1
        ref={titleRef}
        className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[1.02] tracking-[-0.02em] mb-6 max-w-5xl"
      >
        Learn anything.
        <br />
        <em className="not-italic text-gold">Master everything.</em>
      </h1>

      <p
        ref={subRef}
        className="text-white/45 font-body text-base md:text-lg max-w-xl leading-relaxed mb-10"
      >
        ViveLune Labs connects ambitious learners with expert instructors for private,
        structured 1-to-1 sessions — across AI, development, e-commerce, languages, and beyond.
      </p>

      <div ref={actionsRef} className="flex flex-col sm:flex-row items-center gap-4 mb-16">
        <button
          onClick={() => scrollTo("pricing")}
          className="bg-[#c9a96e] hover:[#e8c98a] text-black text-xs tracking-widest uppercase font-medium px-8 py-4 transition-all duration-300 hover:-translate-y-1 font-body"
        >
          View Plans
        </button>
        <button
          onClick={() => scrollTo("subjects")}
          className="border border-white/15 hover:border-white/35 text-white/50 hover:text-white text-xs tracking-widest uppercase px-8 py-4 transition-all duration-300 font-body font-light"
        >
          Explore Subjects
        </button>
      </div>

      {/* Subject tags */}
      <div ref={tagsRef} className="flex flex-wrap justify-center gap-2 max-w-2xl">
        {SUBJECTS.map((s) => (
          <span
            key={s}
            className="text-xs tracking-wide text-white/30 border border-white/10 px-3 py-1.5 font-body hover:text-[#c9a96e]  hover:border-[#c9a96e]/30 transition-colors duration-300 cursor-default"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-10 bg-linear-to-b from-gold/60 to-transparent animate-pulse" />
        <span className="text-white/50 text-[10px] tracking-[0.2em] uppercase font-body">Scroll</span>
      </div>
    </section>
  );
}
