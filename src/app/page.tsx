"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, Command, Activity, ArrowUpRight, 
  ShieldCheck, Box, Zap, Globe, 
  Layers, Binary, Database, HardDrive,
  Dna, Fingerprint, Eye, Scan, ChevronRight
} from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ViveluneBrandedLanding() {
  const router = useRouter();
  const [latency, setLatency] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => +(prev + (Math.random() * 0.4 - 0.2)).toFixed(2));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-[#050505] text-zinc-500 selection:bg-[#FF6B00]/40 min-h-screen font-sans antialiased overflow-x-hidden">
      
      {/* BRAND SCANNER: VERTICAL SCAN LINE */}
      <motion.div 
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="fixed left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6B00]/20 to-transparent z-[150] pointer-events-none"
      />

      {/* VIVELUNE HUD MARKS */}
      <div className="fixed inset-0 pointer-events-none z-[100] border-[1px] border-zinc-900/30 m-2 md:m-6">
        <div className="absolute top-0 left-0 p-4 flex gap-1">
          <div className="size-1 bg-[#FF6B00]" />
          <div className="size-1 bg-zinc-800" />
        </div>
        <div className="absolute bottom-0 right-0 p-4 text-[8px] font-mono text-zinc-800 tracking-tighter uppercase">
          Proprietary_Engine // (C) Vivelune_Logic
        </div>
      </div>

      {/* NAVIGATION: THE "ORBIT" BLADE */}
      <nav className="fixed top-0 w-full z-[110] bg-black/40 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-screen-2xl mx-auto h-14 px-6 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="size-7 bg-[#FF6B00] flex items-center justify-center -skew-x-12 group-hover:skew-x-0 transition-transform duration-500">
                  <Command className="size-4 text-black stroke-[3px]" />
                </div>
                <div className="absolute -inset-1 border border-[#FF6B00]/30 -z-10 animate-pulse" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-[4px] uppercase text-white italic">Vivelune</span>
                <span className="text-[7px] font-bold text-[#FF6B00] tracking-[2px] uppercase">Titan_Core</span>
              </div>
            </div>
            
          
          </div>

          <div className="flex items-center gap-6">
            <SignedOut>
              <Button onClick={() => router.push('/signup')} className="bg-transparent border border-zinc-800 hover:border-[#FF6B00] text-white rounded-none text-[9px] font-black px-6 h-9 transition-all flex gap-3 uppercase tracking-widest">
                <Scan className="size-3 text-[#FF6B00]" />
                Sync_Session
              </Button>
            </SignedOut>
            <SignedIn><UserButton /></SignedIn>
          </div>
        </div>
      </nav>

      {/* HERO: THE BRAND MONOLITH */}
      <section className="relative pt-48 pb-20 px-6">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-px bg-zinc-900 border border-zinc-900 shadow-[0_0_50px_-20px_rgba(255,107,0,0.1)]">
            
            <div className="flex-1 bg-black p-12 md:p-24 relative overflow-hidden">
               {/* Watermark branding */}
               <div className="absolute bottom-10 right-10 text-[120px] font-black text-white/[0.02] pointer-events-none select-none italic">
                 VVLN
               </div>
               
               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] w-12 bg-[#FF6B00]" />
                    <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-[5px]">Core_Protocol_v4</span>
                  </div>
                  
                  <h1 className="text-[10vw] md:text-[120px] font-black leading-[0.8] tracking-[-0.07em] text-white uppercase italic mb-12">
                    SOVEREIGN <br />
                    <span className="text-zinc-800">DATA_</span>
                    <span className="text-[#FF6B00]">SYNC.</span>
                  </h1>

                  <p className="max-w-md text-xs font-mono text-zinc-500 uppercase leading-relaxed mb-12">
                    // The premier autonomous layer for AI enterprise. <br />
                    // Secure your logic, automate your impact.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link href="/signup">
                    <button className="relative group bg-white px-10 py-5 text-black text-[11px] font-black uppercase tracking-widest overflow-hidden transition-all">
                      <span className="relative z-10">Initialize_Titan</span>
                      <div className="absolute inset-0 bg-[#FF6B00] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                    </Link>
                    <Link href="/docs">
                    <button className="border border-zinc-800 text-white px-10 py-5 text-[11px] font-black uppercase tracking-widest hover:bg-zinc-900 transition-all">
                      Specs_Manifesto
                    </button>
                    </Link>
                  </div>
               </motion.div>
            </div>

            {/* BRAND TELEMETRY CARD */}
            <div className="lg:w-96 bg-[#080808] p-10 flex flex-col justify-between border-l border-zinc-900 relative overflow-hidden group">
   
   {/* Subtle background glow when "Ready" */}
   <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

   <div className="space-y-12 relative z-10">
      <div className="group">
        <div className="flex justify-between items-center mb-4">
          <Fingerprint className="size-5 text-[#FF6B00]" />
          <span className="text-[8px] font-mono text-zinc-700 uppercase">Identity_Unverified</span>
        </div>
        <div className="h-[1px] w-full bg-zinc-900 group-hover:bg-[#FF6B00]/30 transition-colors" />
      </div>

      <div className="space-y-2">
        <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Signal_Strength</div>
        <div className="text-5xl font-black text-white italic">{latency}ms</div>
      </div>

      {/* THE UPDATED INTEGRITY CHECK / LOGIN TRIGGER */}
      <div className="space-y-4 pt-10 border-t border-zinc-900">
        <div className="flex justify-between items-center">
          <div className="text-[9px] font-black text-white uppercase tracking-widest">System_Integrity</div>
          <motion.span 
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-[10px] font-mono text-emerald-500 font-bold"
          >
            100%
          </motion.span>
        </div>
        
        <div className="h-1 bg-zinc-900 relative overflow-hidden">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 bg-emerald-500 shadow-[0_0_10px_#10b981]" 
          />
        </div>

        {/* THE PUSH TO LOGIN */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="pt-4"
        >
          <Button 
            onClick={() => router.push('/sign-in')}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black rounded-none font-black text-[10px] tracking-[3px] uppercase h-12 shadow-[0_10px_20px_-10px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Authorize_Session
          </Button>
          <p className="text-[7px] font-mono text-zinc-600 text-center mt-3 uppercase tracking-tighter">
            Click to bypass restricted guest view
          </p>
        </motion.div>
      </div>
   </div>
   
   <div className="pt-10 opacity-30 group-hover:opacity-100 transition-opacity">
      <ShieldCheck className="size-6 text-emerald-500" />
   </div>
</div>

          </div>
        </div>
      </section>

      {/* BRAND PHILOSOPHY: THE "ORBITAL" BENTO */}
      <section className="py-20 px-6">
        <div className="max-w-screen-2xl mx-auto grid md:grid-cols-3 gap-px bg-zinc-900">
          {[
            { label: "DNA_ENCRYPTION", val: "E2EE+", icon: Dna },
            { label: "NEURAL_NODES", val: "1,024", icon: Layers },
            { label: "QUANTUM_GATE", val: "STABLE", icon: Zap }
          ].map((item, i) => (
            <div key={i} className="bg-black p-12 group hover:bg-[#FF6B00]/5 transition-all">
              <item.icon className="size-5 text-[#FF6B00] mb-8" />
              <div className="text-[9px] font-black text-zinc-600 uppercase tracking-[4px] mb-2">{item.label}</div>
              <div className="text-3xl font-black text-white italic">{item.val}</div>
            </div>
          ))}
        </div>
      </section>
{/* CASE STUDY: INCIDENT REPORT // PROJECT_AETHER */}
<section className="py-32 px-6 relative">
  <div className="max-w-screen-2xl mx-auto">
    
    {/* HEADER: MISSION PROFILE */}
    <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8 border-l-2 border-[#FF6B00] pl-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[6px]">Asset_Recovery_Successful</span>
        </div>
        <h2 className="text-6xl md:text-9xl font-black text-white italic tracking-tighter uppercase leading-[0.8]">
          ROAST <br /> <span className="text-[#FF6B00]">&</span> RECOVER.
        </h2>
      </div>
      <div className="bg-zinc-900/50 p-6 border border-zinc-800 backdrop-blur-sm">
        <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-[2px] leading-relaxed">
          Sector: Fintech_Automations <br />
          Node_ID: R&R_ALPHA_7 <br />
          Variable: Churn_Mitigation_v2
        </p>
      </div>
    </div>

    {/* THE TACTICAL SHARD GRID */}
    <div className="grid lg:grid-cols-12 gap-px bg-zinc-800 border border-zinc-800 shadow-[0_0_80px_-30px_rgba(16,185,129,0.1)]">
      
      {/* 01. THE LEAK (PROBLEM) */}
      <div className="lg:col-span-4 bg-[#050505] p-12 flex flex-col justify-between group">
        <div>
          <div className="flex items-center gap-4 mb-10">
            <div className="size-8 border border-zinc-800 flex items-center justify-center text-red-500 font-mono text-xs group-hover:border-red-500 transition-colors">!</div>
            <span className="text-[10px] font-black text-white uppercase tracking-[4px]">The_Leak</span>
          </div>
          <p className="text-xs font-mono leading-relaxed text-zinc-500 uppercase">
            R&R was hemorrhaging <span className="text-white">$40k+ monthly</span> due to failed payment retries and rigid "one-size-fits-all" dunning sequences.
            <br /><br />
            Human intervention was required for <span className="text-red-500">82% of disputes</span>, slowing down the recovery cycle to 14 days.
          </p>
        </div>
        <div className="mt-12 text-[8px] font-black text-zinc-800 uppercase tracking-[5px]">Status: Pre_Vivelune</div>
      </div>

      {/* 02. THE RECOVERY (EXECUTION) */}
      <div className="lg:col-span-5 bg-black p-12 relative overflow-hidden">
        {/* Animated Background Scan */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        <h3 className="text-xs font-black text-white uppercase tracking-[4px] mb-12 relative z-10">Autonomous_Resolution_Path</h3>
        
        <div className="space-y-1 relative z-10">
          {[
            { label: "STRIPE_WEBHOOK_INGESTION", delay: "0.2s" },
            { label: "LTV_BASED_LOGIC_ROUTING", delay: "0.4s" },
            { label: "AI_NEGOTIATION_HANDOFF", delay: "0.6s" },
            { label: "LEDGER_RECONCILIATION", delay: "0.8s" },
          ].map((step, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="flex items-center justify-between border border-zinc-900 bg-black/50 p-4 hover:border-[#FF6B00]/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="size-1 bg-[#FF6B00]" />
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{step.label}</span>
              </div>
              <ChevronRight className="size-3 text-zinc-800" />
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex gap-4">
           <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase tracking-widest">
             End_to_End_Sync
           </div>
           <div className="px-3 py-1 bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] text-[8px] font-black uppercase tracking-widest">
             No_Code_Logic
           </div>
        </div>
      </div>

      {/* 03. THE PAYOUT (RESULT) */}
      <div className="lg:col-span-3 bg-[#080808] p-12 flex flex-col justify-between border-l border-zinc-900">
        <div className="space-y-12">
          <div className="group cursor-default">
            <div className="text-6xl font-black text-white italic tracking-tighter group-hover:text-emerald-500 transition-colors">+$124k</div>
            <div className="text-[9px] font-black text-zinc-700 uppercase tracking-[3px] mt-2">Revenue_Recovered_Q4</div>
          </div>
          <div className="group cursor-default">
            <div className="text-6xl font-black text-white italic tracking-tighter group-hover:text-[#FF6B00] transition-colors">94.2%</div>
            <div className="text-[9px] font-black text-zinc-700 uppercase tracking-[3px] mt-2">Auto_Resolution_Rate</div>
          </div>
        </div>
        
        <Link href="/case-studies/roastandrecover">
        <button className="w-full mt-12 py-4 border border-zinc-800 hover:border-white text-white text-[10px] font-black uppercase tracking-[4px] transition-all flex items-center justify-center gap-3">
          <Scan className="size-3" />
          Full_Audit_Log
        </button>
        </Link>
      </div>

    </div>

    {/* FOOTER QUOTE */}
    <div className="mt-1 flex items-center justify-end">
      <div className="bg-zinc-900 px-8 py-4 border border-t-0 border-zinc-800 max-w-xl">
        <p className="text-[10px] font-mono italic text-zinc-500 uppercase leading-relaxed">
          "Vivelune didn't just automate our emails; it automated our decision-making. We recovered six figures in churned revenue without a single support ticket."
          <span className="block mt-2 font-black text-zinc-400">— Head of Ops, R&R</span>
        </p>
      </div>
    </div>
  </div>
</section>
      {/* FOOTER: THE BRAND SIGN-OFF */}
      <footer className="py-20 px-6 border-t border-zinc-900 bg-black">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-start">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="size-5 bg-[#FF6B00] -skew-x-12" />
              <span className="text-sm font-black uppercase tracking-[6px] text-white italic">Vivelune</span>
            </div>
            <p className="text-[10px] font-mono text-zinc-700 uppercase leading-loose max-w-sm">
              The Sovereign Operating System for Intelligence. <br />
              Manufactured by Vivelune Logic Corp. <br />
              Universal Rights Reserved // 2026.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-20 mt-12 md:mt-0">
             {['Network', 'Terminal'].map(cat => (
               <div key={cat} className="space-y-6">
                 <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-2">{cat}</h4>
                 <ul className="space-y-3 text-[9px] font-bold text-zinc-800 uppercase tracking-widest">
                   <li className="hover:text-[#FF6B00] cursor-pointer">Protocol_v4</li>
                   <li className="hover:text-[#FF6B00] cursor-pointer">Security_Audit</li>
                 </ul>
               </div>
             ))}
          </div>
        </div>
      </footer>
    </main>
  );
}