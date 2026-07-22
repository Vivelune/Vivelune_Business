"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

const COUNTRY_CODES = [
  { code: "+1", country: "US", flag: "🇺🇸", label: "United States (+1)" },
  { code: "+1", country: "CA", flag: "🇨🇦", label: "Canada (+1)" },
];

export default function Grade6Registration() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "US",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!form.email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    const digitsOnly = form.phone.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing Supabase credentials in environment.");
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const { error: dbError } = await supabase.from("student_registrations").insert([
        {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          country_code: form.countryCode,
          phone: digitsOnly,
          created_at: new Date().toISOString(),
        },
      ]);

      if (dbError) throw new Error(dbError.message);

      router.push("/ela-quiz");
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  }

  const selectedCountry = COUNTRY_CODES.find((c) => c.country === form.countryCode)!;

  return (
    <main className="relative min-h-screen bg-[#050B14] flex flex-col items-center justify-center px-4 py-16 overflow-hidden font-sans antialiased text-slate-100">
      {/* Immersive Glowing Background Orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[550px] h-[550px] rounded-full bg-violet-600/20 blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[550px] h-[550px] rounded-full bg-cyan-600/20 blur-[140px] pointer-events-none animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg z-10 flex flex-col items-center"
      >
        {/* Header Badge & Title */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-violet-950/60 backdrop-blur-md border border-violet-500/30 rounded-full px-4 py-1.5 mb-5 shadow-lg shadow-violet-950/40"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-cyan-400 text-xs font-bold tracking-widest uppercase">
              Grade 6 Mastery Suite
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
            Unlock 40 <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">ELA Challenges</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-sm mx-auto font-medium leading-relaxed">
            Enter your details below to jump straight into the interactive assessment dashboard.
          </p>
        </div>

        {/* Glassmorphic Form Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-8 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] relative overflow-hidden"
        >
          {/* Top Edge Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Name Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-slate-300 text-xs font-bold tracking-wider mb-2 uppercase">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Alex"
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition-all duration-200"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-slate-300 text-xs font-bold tracking-wider mb-2 uppercase">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Reader"
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition-all duration-200"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col">
              <label className="text-slate-300 text-xs font-bold tracking-wider mb-2 uppercase">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="alex@student.com"
                required
                className="w-full bg-slate-950/80 border border-slate-800 text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition-all duration-200"
              />
            </div>

            {/* Phone & Country Code */}
            <div className="flex flex-col">
              <label className="text-slate-300 text-xs font-bold tracking-wider mb-2 uppercase">
                Phone Number
              </label>
              <div className="flex gap-2.5">
                <div className="relative">
                  <select
                    name="countryCode"
                    value={form.countryCode}
                    onChange={handleChange}
                    className="appearance-none h-full bg-slate-950/80 border border-slate-800 text-white rounded-xl pl-3.5 pr-8 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition-all duration-200 cursor-pointer"
                    style={{ minWidth: "90px" }}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.country} value={c.country} className="bg-slate-900 text-white">
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(555) 000-0000"
                  required
                  maxLength={14}
                  className="flex-1 bg-slate-950/80 border border-slate-800 text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition-all duration-200"
                />
              </div>
              <p className="mt-2 text-slate-400 text-xs flex items-center gap-1.5 font-medium pl-1">
                <span>{selectedCountry.flag}</span>
                <span>Region locked to {selectedCountry.label}</span>
              </p>
            </div>

            {/* Error Message Box */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                >
                  <p className="text-red-400 text-xs font-semibold flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Action Button */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-violet-600/30 transition-all duration-200 text-sm mt-3 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Securing Profile & Loading Quiz...
                </>
              ) : (
                <>
                  <span>Launch 40 ELA Questions</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-slate-500 text-xs text-center leading-relaxed font-medium">
            🔒 Fully secured via Supabase. We protect student data with absolute privacy standards.
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}