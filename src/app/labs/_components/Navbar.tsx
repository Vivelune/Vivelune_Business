"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-void/95 backdrop-blur-xl border-b border-white/8"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-18 flex items-center justify-between py-5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-4 h-4 border border-accent/70">
            <span className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t border-l border-accent" />
            <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b border-r border-accent" />
          </div>
          <span className="font-display text-2xl font-semibold tracking-wide text-white uppercase">
            Vive<span className="text-accent">Lune</span>{" "}
            <span className="text-white/40 font-normal">Labs</span>
          </span>
        </div>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-9 list-none">
          {["Subjects", "Method", "Pricing", "Contact"].map((item, i) => (
            <li key={item}>
              <button
                onClick={() => scrollTo(item.toLowerCase())}
                className="group flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-white/45 hover:text-white transition-colors duration-200 font-body font-medium"
              >
                <span className="font-data text-[10px] text-accent/0 group-hover:text-accent/80 transition-colors duration-200">
                  0{i + 1}
                </span>
                {item}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={() => scrollTo("pricing")}
          className="notch-sm bg-accent hover:bg-[#e8c98a] text-white text-xs tracking-[0.18em] uppercase font-semibold px-6 py-3 transition-colors duration-200 font-body"
        >
          Enlist Now
        </button>
      </div>
    </nav>
  );
}