"use client";

import { AnimatePresence, motion } from "framer-motion";
import { 
  TrendingUp, AlertCircle, ShieldAlert, 
  Terminal, BarChart3, Database, 
  ArrowLeft, Lock, Download, Zap,
  ChevronRight, Activity, Clock, ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function RoastAndRecoverFullCase() {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
const [timeLeft, setTimeLeft] = useState(10); // Countdown for the warning UI

useEffect(() => {
  // Trigger warning after 20 seconds of browsing
  const timer = setTimeout(() => {
    setShowWarning(true);
  }, 10000);

  return () => clearTimeout(timer);
}, []);

  return (
    <main className="bg-[#050505] text-zinc-400 min-h-screen font-sans selection:bg-[#FF6B00]/30 selection:text-white overflow-x-hidden">
      
      {/* 01. NAVIGATION: SYSTEM_BACK_PATH */}
      <nav className="fixed top-0 w-full z-[100] bg-black/80 backdrop-blur-xl border-b border-zinc-900 px-6">
        <div className="max-w-screen-2xl mx-auto h-16 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[4px] text-zinc-500 hover:text-white transition-colors group"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            Return_to_Core
          </button>
          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-4 border-r border-zinc-800 pr-6">
                <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-500/80">Archive_Unlocked</span>
             </div>
             <Button onClick={() => router.push('/sign-in')} className="h-8 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-none px-6 hover:bg-[#FF6B00] transition-all">
                Sync_Session
             </Button>
          </div>
        </div>
      </nav>

      {/* 02. HERO: MISSION_PROFILE */}
      <section className="pt-32 pb-20 px-6 border-b border-zinc-900 relative overflow-hidden">
        {/* Ambient Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="max-w-screen-2xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="size-2 bg-[#FF6B00]" />
                <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-[5px]">Dossier_R&R_099</span>
              </div>
              <h1 className="text-[12vw] md:text-[140px] font-black leading-[0.75] tracking-[-0.08em] text-white uppercase italic">
                ROAST <br /> <span className="text-zinc-800">RECOVER.</span>
              </h1>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900/50 p-8 border border-zinc-800 backdrop-blur-md min-w-[320px] shadow-2xl"
            >
              <div className="space-y-4 text-[10px] font-mono uppercase">
                <div className="flex justify-between border-b border-zinc-800 pb-2 italic">
                  <span className="text-zinc-600">Classification:</span>
                  <span className="text-white">Financial_Recovery</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-2 italic">
                  <span className="text-zinc-600">Entity:</span>
                  <span className="text-white">RoastAndRecover_Inc</span>
                </div>
                <div className="flex justify-between text-emerald-500 font-bold italic">
                  <span>Net_Impact:</span>
                  <span className="tracking-tighter">+$124,000_Q4</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 03. FORENSIC ANALYSIS GRID */}
      <section className="max-w-screen-2xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-12 gap-px bg-zinc-800 border border-zinc-800 shadow-2xl">
          
          {/* Phase 01: The Breach */}
          <div className="lg:col-span-4 bg-[#080808] p-12 group">
            <ShieldAlert className="size-8 text-red-500 mb-10 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-black uppercase tracking-[4px] text-lg mb-6 italic">01. The_Leak</h3>
            <p className="text-xs font-mono leading-relaxed text-zinc-500 uppercase mb-8">
              R&R was hemorrhaging revenue due to a <span className="text-white">static retry system</span>. 
              $40k/month in churn was occurring silently without triggered alerts.
            </p>
            <div className="bg-red-500/5 border-l-2 border-red-500 p-4 text-[10px] font-mono italic">
              "System failed to differentiate between soft and hard declines."
            </div>
          </div>

          {/* Phase 02: Intervention */}
          <div className="lg:col-span-4 bg-black p-12 relative overflow-hidden">
             <div className="size-8 bg-[#FF6B00]/20 border border-[#FF6B00]/40 flex items-center justify-center mb-10">
                <Terminal className="size-4 text-[#FF6B00]" />
             </div>
             <h3 className="text-white font-black uppercase tracking-[4px] text-lg mb-6 italic">02. The_Sync</h3>
             <ul className="space-y-4 text-[10px] font-mono uppercase mb-10">
                <li className="flex items-center gap-3"><ChevronRight className="size-3 text-[#FF6B00]" /> LTV-Weighted Dunning</li>
                <li className="flex items-center gap-3"><ChevronRight className="size-3 text-[#FF6B00]" /> Neural Routing Logic</li>
                <li className="flex items-center gap-3"><ChevronRight className="size-3 text-[#FF6B00]" /> Automated Dispute Bypass</li>
             </ul>
             <div className="h-24 bg-zinc-950 border border-zinc-900 p-4">
                <div className="flex gap-1 items-end h-full">
                  {[40, 70, 45, 90, 65, 80, 30, 50, 20].map((h, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [`${h}%`, `${h+10}%`, `${h}%`] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                      className="flex-1 bg-[#FF6B00]/20 border-t border-[#FF6B00]" 
                    />
                  ))}
                </div>
             </div>
          </div>

          {/* Phase 03: Results */}
          <div className="lg:col-span-4 bg-[#080808] p-12">
            <BarChart3 className="size-8 text-emerald-500 mb-10" />
            <div className="space-y-10">
               <div>
                  <div className="text-7xl font-black text-white italic tracking-tighter">94.2%</div>
                  <div className="text-[9px] font-black text-zinc-700 uppercase tracking-[4px] mt-2">Recovery_Efficiency</div>
               </div>
               <div>
                  <div className="text-7xl font-black text-white italic tracking-tighter">12ms</div>
                  <div className="text-[9px] font-black text-zinc-700 uppercase tracking-[4px] mt-2">Signal_Latency</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04. DEPLOYMENT TIMELINE: 168H_PROTOCOL */}
      <section className="py-24 px-6 border-t border-zinc-900 bg-[#030303]">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-6 mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter shrink-0">
              INTEGRATION_LOG <span className="text-[#FF6B00]">168H</span>
            </h2>
            <div className="h-px w-full bg-zinc-900" />
          </div>

          <div className="grid md:grid-cols-4 gap-12">
            {[
              { hour: "T-00h", label: "Logic_Ingestion", status: "COMPLETE" },
              { hour: "T-24h", label: "Pattern_Analysis", status: "COMPLETE" },
              { hour: "T-72h", label: "Intervention_v1", status: "STABLE" },
              { hour: "T-168h", label: "Autonomous_State", status: "LIVE" }
            ].map((step, i) => (
              <motion.div 
                key={i} 
                whileHover={{ x: 5 }}
                className="border-l border-zinc-800 pl-6 py-2 group"
              >
                <div className="text-[#FF6B00] text-[10px] font-mono mb-2">{step.hour}</div>
                <h4 className="text-white font-black uppercase text-xs tracking-widest mb-4 group-hover:text-[#FF6B00] transition-colors">
                  {step.label}
                </h4>
                <div className={`text-[8px] font-black px-2 py-1 inline-block ${
                  step.status === 'LIVE' ? 'bg-emerald-500 text-black' : 'bg-zinc-900 text-zinc-600'
                }`}>
                  {step.status}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 05. CALL TO ACTION: FINAL_AUTHORIZATION */}
      <section className="py-40 px-6 bg-black relative">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-10">
            <div className="size-20 bg-emerald-500/5 border border-emerald-500/20 rounded-full flex items-center justify-center">
               <ShieldCheck className="size-10 text-emerald-500 animate-pulse" />
            </div>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-8">
            DEPLOY_TITAN <br /> <span className="text-[#FF6B00]">TO_YOUR_CORE.</span>
          </h2>
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[4px] mb-12 max-w-lg mx-auto leading-relaxed">
            Authorization levels are open for public sync. <br /> 
            Join the autonomous financial layer today.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Button 
              onClick={() => router.push('/sign-up')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-none font-black text-[11px] tracking-[5px] px-12 py-8 transition-all shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)]"
            >
              INITIALIZE_SYNC
            </Button>
            <Button 
              onClick={() => router.push('/docs')}
              className="bg-transparent border border-zinc-800 text-zinc-500 hover:text-white rounded-none font-black text-[11px] tracking-[5px] px-12 py-8 transition-all"
            >
              VIEW_SPECS
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 border-t border-zinc-900 bg-[#030303]">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-start opacity-40">
           <div className="space-y-4">
              <span className="text-sm font-black uppercase tracking-[8px] text-white italic">Vivelune</span>
              <p className="text-[9px] font-mono text-zinc-700 uppercase leading-loose">
                Universal Rights Reserved // Vivelune_Logic_Corp <br />
                Security_Audit: Stable_2026
              </p>
           </div>
           <div className="flex gap-12 mt-12 md:mt-0 text-[9px] font-black uppercase tracking-widest">
              <span className="cursor-pointer hover:text-[#FF6B00]">Terminal</span>
              <span className="cursor-pointer hover:text-[#FF6B00]">Network</span>
              <span className="cursor-pointer hover:text-[#FF6B00]">Auth_Logs</span>
           </div>
        </div>
      </footer>
      <AnimatePresence>
  {showWarning && (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-md w-full bg-[#080808] border border-red-500/30 p-10 shadow-[0_0_100px_rgba(239,68,68,0.1)] relative overflow-hidden"
      >
        {/* Warning Scanner Line */}
        <motion.div 
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[1px] bg-red-500/20"
        />

        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="size-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
              <Lock className="size-8 text-red-500 animate-pulse" />
            </div>
          </div>

          <h3 className="text-white font-black uppercase tracking-[4px] text-xl mb-2 italic">
            Session_Expired
          </h3>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-8 leading-relaxed">
            Your temporary <span className="text-red-500">Guest_Decryption_Token</span> has reached its lifecycle limit. 
            Full archive access requires a secure handshake.
          </p>

          <div className="space-y-4">
            <Button 
              onClick={() => router.push('/sign-in')}
              className="w-full bg-red-600 hover:bg-red-500 text-white rounded-none font-black text-[11px] tracking-[4px] py-7 transition-all"
            >
              AUTHORIZE_SESSION_SYNC
            </Button>
            
            <button 
              onClick={() => window.location.reload()}
              className="text-[9px] font-mono text-zinc-700 hover:text-white uppercase tracking-[2px] transition-colors"
            >
              Request_Token_Extension
            </button>
          </div>
        </div>

        {/* Decorative ID Corner */}
        <div className="absolute bottom-2 right-2 text-[8px] font-mono text-zinc-800 uppercase">
          Ref_Error: 403_Auth_Required
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </main>
  );
}