"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/90 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-18 flex items-center justify-between py-5">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-semibold tracking-tight text-white">
            Vive<span className="text-gold">Lune</span>{" "}
            <span className="text-white/40 font-light">Labs</span>
          </span>
        </div>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {["Subjects", "Method", "Pricing", "Contact"].map((item) => (
            <li key={item}>
              <button
                onClick={() => scrollTo(item.toLowerCase())}
                className="text-xs tracking-widest uppercase text-white/40 hover:text-white transition-colors duration-300 font-body"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={() => scrollTo("pricing")}
          className="bg-[#c9a96e] hover:bg-[#e8c98a] text-black text-xs tracking-widest uppercase font-medium px-6 py-3 transition-all duration-300 hover:-translate-y-0.5 font-body"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}
