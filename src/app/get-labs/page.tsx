"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const COUNTRY_CODES = [
  { code: "+1", country: "US", flag: "🇺🇸", label: "United States (+1)" },
  { code: "+1", country: "CA", flag: "🇨🇦", label: "Canada (+1)" },
];

export default function GEDTestPage() {
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
      setError("Please enter a valid email address.");
      return;
    }
    const digitsOnly = form.phone.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/get-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          countryCode: form.countryCode,
          phone: digitsOnly,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      router.push("/get-labs/download-get-labs");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const selectedCountry = COUNTRY_CODES.find((c) => c.country === form.countryCode)!;

  return (
    <main className="relative min-h-screen bg-[#030712] flex flex-col items-center justify-center px-4 py-20 overflow-hidden font-sans antialiased text-slate-200">
      {/* Background Decorative Mesh Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      {/* Main Content Animation Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xl z-10 flex flex-col items-center"
      >
        {/* Top badge */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-blue-950/40 backdrop-blur-md border border-blue-800/40 rounded-full px-4 py-1.5 mb-6 shadow-inner"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">
              Free GED Practice Resource
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400">
            GED English <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Practice Test</span>
          </h1>
          <p className="text-slate-400 text-base max-w-sm mx-auto font-medium leading-relaxed">
            Enter your details below to instantly unlock a full-length, interactive Reasoning Through Language Arts blueprint.
          </p>
        </div>

        {/* Form card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative group overflow-hidden"
        >
          {/* Subtle top border accent ring */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-slate-400 text-xs font-semibold tracking-wide mb-2 uppercase">
                  First name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Jane"
                  required
                  className="w-full bg-slate-950/60 border border-slate-800/80 text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-slate-400 text-xs font-semibold tracking-wide mb-2 uppercase">
                  Last name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Smith"
                  required
                  className="w-full bg-slate-950/60 border border-slate-800/80 text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-slate-400 text-xs font-semibold tracking-wide mb-2 uppercase">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@email.com"
                required
                className="w-full bg-slate-950/60 border border-slate-800/80 text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>

            {/* Phone with country code */}
            <div className="flex flex-col">
              <label className="text-slate-400 text-xs font-semibold tracking-wide mb-2 uppercase">
                Phone number
              </label>
              <div className="flex gap-2.5">
                <div className="relative group">
                  <select
                    name="countryCode"
                    value={form.countryCode}
                    onChange={handleChange}
                    className="appearance-none h-full bg-slate-950/60 border border-slate-800/80 text-white rounded-xl pl-3.5 pr-8 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 cursor-pointer"
                    style={{ minWidth: "95px" }}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.country} value={c.country} className="bg-slate-900 text-white">
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500">
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
                  className="flex-1 bg-slate-950/60 border border-slate-800/80 text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
              <p className="mt-2 text-slate-500 text-xs flex items-center gap-1.5 font-medium pl-1">
                <span>{selectedCountry.flag}</span>
                <span>{selectedCountry.label}</span>
              </p>
            </div>

            {/* Animated Error Alerts */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 overflow-hidden"
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

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30 transition-all duration-200 text-sm mt-3 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Study Blueprint...
                </>
              ) : (
                <>
                  <span>Access Practice Blueprint</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </motion.button>
          </form>

          {/* Privacy Disclaimer Footer */}
          <p className="mt-6 text-slate-500 text-xs text-center leading-relaxed font-medium">
            🔒 High-fidelity testing portal secure. By continuing, you agree to receive educational diagnostics. We never distribute data.
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}