// "use client";

// import { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { 
//   ArrowRightIcon, SparklesIcon, ZapIcon, ShieldIcon, 
//   WorkflowIcon, CloudIcon, CheckCircle2, BotIcon,
//   LayersIcon, MousePointer2, CpuIcon
// } from "lucide-react";

// gsap.registerPlugin(ScrollTrigger);

// export default function LandingPage() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const mouseGlowRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     // 1. Smooth Mouse Follower
//     const moveGlow = (e: MouseEvent) => {
//       gsap.to(mouseGlowRef.current, {
//         x: e.clientX,
//         y: e.clientY,
//         duration: 0.8,
//         ease: "power2.out"
//       });
//     };
//     window.addEventListener("mousemove", moveGlow);

//     const ctx = gsap.context(() => {
//       // 2. Text Reveal Animation
//       const tl = gsap.timeline();
//       tl.from(".hero-heading span", {
//         y: 100,
//         opacity: 0,
//         duration: 1.2,
//         stagger: 0.1,
//         ease: "expo.out",
//       })
//       .from(".hero-sub", {
//         opacity: 0,
//         y: 20,
//         duration: 1,
//       }, "-=0.8")
//       .from(".hero-btns", {
//         opacity: 0,
//         y: 20,
//         duration: 1,
//       }, "-=0.8");

//       // 3. Floating Node Logic
//       gsap.to(".node-float", {
//         y: -15,
//         duration: 2.5,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//         stagger: { each: 0.4, from: "random" }
//       });

//       // 4. Data Flow Path Animation
//       gsap.fromTo(".flow-line", 
//         { strokeDashoffset: 1000 },
//         { strokeDashoffset: 0, duration: 4, repeat: -1, ease: "none" }
//       );
//     }, containerRef);

//     return () => {
//       ctx.revert();
//       window.removeEventListener("mousemove", moveGlow);
//     };
//   }, []);

//   return (
//     <main ref={containerRef} className="relative bg-[#050505] text-white selection:bg-purple-500/50 overflow-hidden">
      
//       {/* Interactive Background Glow */}
//       <div 
//         ref={mouseGlowRef} 
//         className="fixed top-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0"
//       />

//       {/* Grid Overlay */}
//       <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-10" />
//       <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

//       {/* Navigation */}
//       <nav className="fixed top-0 inset-x-0 z-[100] border-b border-white/5 bg-black/20 backdrop-blur-md">
//         <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
//           <div className="flex items-center gap-2 group cursor-pointer">
//             <div className="size-7 bg-white rounded flex items-center justify-center group-hover:rotate-[360deg] transition-transform duration-700">
//               <WorkflowIcon className="size-4 text-black" />
//             </div>
//             <span className="text-lg font-bold tracking-tighter">Vivelune</span>
//           </div>
          
//           <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-zinc-500">
//             {["Product", "Solutions", "Enterprise", "Pricing"].map((item) => (
//               <Link key={item} href="#" className="hover:text-white transition-colors uppercase tracking-widest">{item}</Link>
//             ))}
//           </div>

//           <button className="text-[13px] font-bold px-5 py-2 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all duration-300">
//             Login
//           </button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative pt-40 pb-20 px-6 z-20">
//         <div className="max-w-6xl mx-auto text-center">
//           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-xs font-mono mb-8 animate-pulse">
//             <span className="relative flex h-2 w-2">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
//             </span>
//             V2.0 Engine is now live
//           </div>

//           <h1 className="hero-heading text-6xl md:text-[100px] font-bold tracking-[ -0.04em] leading-[0.85] mb-10 overflow-hidden">
//             <span className="block italic font-serif text-zinc-500">Intelligent</span>
//             <span className="block">Operations.</span>
//           </h1>

//           <p className="hero-sub text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 font-light">
//             Automate the complex. Connect LLMs to your production data with 
//             <span className="text-white"> zero-latency</span> execution.
//           </p>

//           <div className="hero-btns flex flex-col sm:flex-row gap-4 justify-center items-center">
//             <button className="group relative h-14 px-10 bg-white text-black rounded-full font-bold overflow-hidden transition-transform hover:scale-105">
//               <span className="relative z-10">Start for free</span>
//               <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
//             </button>
//             <button className="h-14 px-10 rounded-full border border-white/10 font-bold hover:border-white/40 transition-colors">
//               Request Demo
//             </button>
//           </div>
//         </div>

//         {/* Interactive "Brain" Diagram */}
//         <div className="mt-24 max-w-4xl mx-auto relative h-[400px] border border-white/5 bg-zinc-900/20 rounded-[40px] backdrop-blur-sm overflow-hidden">
//            {/* Connecting Lines */}
//            <svg className="absolute inset-0 w-full h-full p-20 opacity-30">
//               <path className="flow-line" d="M 50,50 Q 400,50 400,200 T 750,350" fill="none" stroke="url(#grad)" strokeWidth="2" strokeDasharray="10,10" />
//               <defs>
//                 <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
//                   <stop offset="0%" stopColor="#8B5CF6" />
//                   <stop offset="100%" stopColor="#3B82F6" />
//                 </linearGradient>
//               </defs>
//            </svg>

//            {/* Animated Nodes */}
//            <div className="node-float absolute top-20 left-20 p-4 bg-zinc-800 border border-white/10 rounded-2xl shadow-2xl flex items-center gap-4">
//               <div className="size-10 bg-purple-600 rounded-lg flex items-center justify-center">
//                 <BotIcon className="size-6 text-white" />
//               </div>
//               <div>
//                 <div className="text-xs text-zinc-500 font-mono">NODE_01</div>
//                 <div className="text-sm font-bold uppercase tracking-wider">GPT-4o Agent</div>
//               </div>
//            </div>

//            <div className="node-float absolute bottom-20 right-20 p-4 bg-zinc-800 border border-white/10 rounded-2xl shadow-2xl flex items-center gap-4">
//               <div className="size-10 bg-blue-600 rounded-lg flex items-center justify-center">
//                 <LayersIcon className="size-6 text-white" />
//               </div>
//               <div>
//                 <div className="text-xs text-zinc-500 font-mono">NODE_02</div>
//                 <div className="text-sm font-bold uppercase tracking-wider">Vector DB Sync</div>
//               </div>
//            </div>
//         </div>
//       </section>

//       {/* Stats / Proof Bento */}
//       <section className="py-20 px-6">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="p-8 rounded-[32px] bg-zinc-900/40 border border-white/5 flex flex-col justify-between h-64">
//              <div className="size-12 rounded-full bg-white/5 flex items-center justify-center">
//                 <ZapIcon className="size-6 text-amber-400" />
//              </div>
//              <div>
//                 <h3 className="text-4xl font-bold tracking-tighter">1.2ms</h3>
//                 <p className="text-zinc-500 text-sm">Average Node Latency</p>
//              </div>
//           </div>
//           <div className="p-8 rounded-[32px] bg-gradient-to-br from-purple-900/20 to-zinc-900/40 border border-white/5 flex flex-col justify-between h-64">
//              <div className="size-12 rounded-full bg-white/5 flex items-center justify-center">
//                 <CpuIcon className="size-6 text-purple-400" />
//              </div>
//              <div>
//                 <h3 className="text-4xl font-bold tracking-tighter">50M+</h3>
//                 <p className="text-zinc-500 text-sm">Monthly Automations</p>
//              </div>
//           </div>
//           <div className="p-8 rounded-[32px] bg-zinc-900/40 border border-white/5 flex flex-col justify-between h-64">
//              <div className="size-12 rounded-full bg-white/5 flex items-center justify-center">
//                 <ShieldIcon className="size-6 text-emerald-400" />
//              </div>
//              <div>
//                 <h3 className="text-4xl font-bold tracking-tighter">100%</h3>
//                 <p className="text-zinc-500 text-sm">Data Residency Control</p>
//              </div>
//           </div>
//         </div>
//       </section>

//       {/* The Footer - Minimalist */}
//       <footer className="py-20 px-6 border-t border-white/5 text-center">
//           <div className="mb-10 opacity-30 grayscale hover:grayscale-0 transition-all flex justify-center gap-12 flex-wrap">
//             {/* Logo Wall Placeholders */}
//             <span className="font-bold text-xl uppercase tracking-[0.2em]">OpenAI</span>
//             <span className="font-bold text-xl uppercase tracking-[0.2em]">Stripe</span>
//             <span className="font-bold text-xl uppercase tracking-[0.2em]">Linear</span>
//             <span className="font-bold text-xl uppercase tracking-[0.2em]">Supabase</span>
//           </div>
//           <p className="text-zinc-600 text-xs tracking-widest uppercase">© 2026 Vivelune Lab — Built for the future of AI</p>
//       </footer>
//     </main>
//   );
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import gsap from "gsap";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   ArrowRightIcon, SparklesIcon, ZapIcon, 
//   WorkflowIcon, BotIcon, TerminalIcon,
//   CheckCircle2, QuoteIcon, ActivityIcon
// } from "lucide-react";

// export default function LandingPage() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [terminalLogs, setTerminalLogs] = useState<string[]>(["Initializing Vivelune Kernel...", "Establishing Neural Link..."]);

//   // 1. Terminal Simulation Logic
//   useEffect(() => {
//     const messages = [
//       "Fetching RoastandRecover feedback...",
//       "AI Sentiment: Negative (Frustrated)",
//       "Triggering Recovery Workflow...",
//       "Generating empathetic response via Claude 3.5...",
//       "Draft sent to Slack #recovery-ops",
//       "Syncing with Google Sheets...",
//       "Status: Resolved. Customer retention +1"
//     ];
//     let i = 0;
//     const interval = setInterval(() => {
//       setTerminalLogs(prev => [...prev.slice(-5), `> ${messages[i % messages.length]}`]);
//       i++;
//     }, 2500);
//     return () => clearInterval(interval);
//   }, []);

//   // 2. GSAP Cinematic Entrances
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.from(".hero-text", {
//         y: 100,
//         opacity: 0,
//         duration: 1.5,
//         ease: "power4.out",
//         stagger: 0.2
//       });

//       gsap.from(".glass-panel", {
//         scrollTrigger: {
//           trigger: ".glass-panel",
//           start: "top 80%",
//         },
//         scale: 0.9,
//         opacity: 0,
//         duration: 1,
//         ease: "expo.out"
//       });
//     }, containerRef);
//     return () => ctx.revert();
//   }, []);

//   return (
//     <main ref={containerRef} className="bg-[#020202] text-zinc-100 selection:bg-orange-500/30">
      
//       {/* Background Architecture */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,rgba(120,50,255,0.08)_0,transparent_70%)]" />
//         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
//       </div>

//       {/* Nav */}
//       <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-black/40 backdrop-blur-xl">
//         <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="size-10 rounded-xl bg-gradient-to-br from-orange-500 to-purple-600 p-[1px]">
//               <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
//                 <WorkflowIcon className="size-5 text-white" />
//               </div>
//             </div>
//             <span className="text-xl font-black tracking-tighter uppercase">Vivelune</span>
//           </div>
//           <div className="flex items-center gap-6">
//             <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition">Sign In</Link>
//             <Link href="/signup" className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-orange-500 hover:text-white transition-all">
//               Join the Beta
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative pt-48 pb-32 px-6">
//         <div className="max-w-5xl mx-auto text-center">
//           <motion.div 
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-500 text-[10px] font-bold uppercase tracking-widest mb-10"
//           >
//             <ActivityIcon className="size-3" /> System Status: Optimal
//           </motion.div>

//           <h1 className="hero-text text-7xl md:text-[120px] font-bold tracking-tight leading-[0.8] mb-12">
//             The World’s <br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 to-zinc-600">Smartest Layer.</span>
//           </h1>

//           <div className="grid md:grid-cols-2 gap-12 mt-24 text-left items-center">
//             <div className="hero-text">
//               <h3 className="text-2xl font-bold mb-6 text-orange-500">The Vivelune Protocol</h3>
//               <p className="text-zinc-400 text-lg leading-relaxed mb-8">
//                 Stop building brittle "zaps." Vivelune uses a self-healing neural engine to orchestrate 
//                 your company’s logic, handling errors and edge cases automatically.
//               </p>
//               <div className="flex gap-4">
//                 <div className="size-12 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center">
//                   <BotIcon className="size-6 text-purple-400" />
//                 </div>
//                 <div className="size-12 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center">
//                   <ZapIcon className="size-6 text-orange-400" />
//                 </div>
//               </div>
//             </div>

//             {/* LIVE TERMINAL COMPONENT */}
//             <div className="glass-panel relative rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl overflow-hidden font-mono text-[13px]">
//               <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
//                 <div className="flex gap-2">
//                   <div className="size-2.5 rounded-full bg-zinc-700" />
//                   <div className="size-2.5 rounded-full bg-zinc-700" />
//                 </div>
//                 <span className="text-zinc-500 text-[10px] uppercase tracking-tighter">Live_Process_Monitor</span>
//               </div>
//               <div className="p-6 h-64 overflow-hidden space-y-2">
//                 <AnimatePresence mode="popLayout">
//                   {terminalLogs.map((log, idx) => (
//                     <motion.div
//                       key={log + idx}
//                       initial={{ opacity: 0, x: -10 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       exit={{ opacity: 0 }}
//                       className={idx === terminalLogs.length - 1 ? "text-orange-400" : "text-zinc-500"}
//                     >
//                       {log}
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ROASTANDRECOVER SPECIALIST SECTION */}
//       <section className="py-40 px-6 relative bg-zinc-100 text-black rounded-[60px] mx-4 overflow-hidden">
//         <div className="absolute top-0 right-0 p-20 opacity-10">
//           <QuoteIcon className="size-96 text-black" />
//         </div>
        
//         <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
//           <div className="lg:col-span-5">
//             <div className="size-16 bg-black rounded-3xl flex items-center justify-center mb-8 rotate-3 shadow-xl">
//               <Image src="/randr.png" alt="R&R" width={32} height={32} className="invert" />
//             </div>
//             <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
//               Roastand<br/>Recover <span className="text-zinc-400">×</span> Vivelune
//             </h2>
//             <p className="text-xl text-zinc-600 mb-10 leading-relaxed italic">
//               "We needed a way to turn angry customer reviews into brand loyalty. 
//               Vivelune didn't just automate the email; it understood the emotion 
//               and alerted our team when a human touch was needed."
//             </p>
//             <div className="flex items-center gap-4">
//               <div className="size-12 rounded-full bg-zinc-300 overflow-hidden border-2 border-white" />
//               <div>
//                 <p className="font-bold">Alex Rivera</p>
//                 <p className="text-sm text-zinc-500">Founder, RoastandRecover</p>
//               </div>
//             </div>
//           </div>

//           <div className="lg:col-span-7 grid grid-cols-2 gap-4">
//             <div className="p-10 bg-white rounded-[40px] shadow-sm border border-zinc-200">
//                <div className="text-6xl font-black mb-2 tracking-tighter">98%</div>
//                <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">Sentiment Accuracy</p>
//             </div>
//             <div className="p-10 bg-orange-500 text-white rounded-[40px] shadow-xl shadow-orange-500/20 translate-y-12">
//                <div className="text-6xl font-black mb-2 tracking-tighter">4.2m</div>
//                <p className="text-orange-100 font-bold uppercase text-xs tracking-widest">Reviews Processed</p>
//             </div>
//             <div className="col-span-2 mt-12 p-1 bg-black/5 rounded-3xl overflow-hidden">
//                 <div className="bg-white p-8 rounded-[22px] flex items-center justify-between">
//                     <span className="font-bold">Workflow Health</span>
//                     <div className="flex gap-1">
//                         {[1,1,1,1,1,1,1,0.8,1,1,1,1,1].map((v, i) => (
//                             <div key={i} className="w-1.5 h-8 bg-emerald-500 rounded-full" style={{ opacity: v }} />
//                         ))}
//                     </div>
//                 </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Final CTA */}
//       <section className="py-60 px-6 text-center">
//         <h2 className="text-6xl md:text-[140px] font-black tracking-tighter mb-16 opacity-10 select-none absolute left-0 right-0 -z-10 overflow-hidden whitespace-nowrap">
//             VIVELUNE VIVELUNE VIVELUNE VIVELUNE VIVELUNE
//         </h2>
//         <div className="relative z-10">
//             <h2 className="text-4xl md:text-6xl font-bold mb-12 tracking-tight">Step into the engine room.</h2>
//             <Link href="/signup" className="inline-flex items-center gap-3 px-12 py-6 bg-orange-500 rounded-full text-xl font-black hover:scale-105 hover:bg-orange-600 transition-all shadow-2xl shadow-orange-500/20">
//                 Deploy Your First Node <ArrowRightIcon className="size-6" />
//             </Link>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="py-12 border-t border-white/5 px-6">
//         <div className="max-w-7xl mx-auto flex justify-between items-center opacity-40">
//             <span className="font-bold tracking-tighter">VIVELUNE LABS</span>
//             <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
//                 <Link href="#">Twitter</Link>
//                 <Link href="#">Discord</Link>
//                 <Link href="#">Legal</Link>
//             </div>
//         </div>
//       </footer>
//     </main>
//   );
// }


// "use client";

// import { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import gsap from "gsap";
// import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
// import { 
//   ArrowRightIcon, SparklesIcon, ZapIcon, 
//   WorkflowIcon, BotIcon, TerminalIcon,
//   CheckCircle2, QuoteIcon, ActivityIcon,
//   CpuIcon, GlobeIcon, CommandIcon
// } from "lucide-react";

// export default function LandingPage() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const magneticButton = useRef<HTMLButtonElement>(null);
//   const [terminalLogs, setTerminalLogs] = useState<string[]>(["[SYSTEM]: Kernel v4.0 active", "[LINK]: Neural pipeline open"]);
  
//   const { scrollYProgress } = useScroll();
//   const rotateX = useTransform(scrollYProgress, [0, 0.2], [15, 0]);
//   const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.2]);

//   // 1. Terminal Loop (The "Live Pulse")
//   useEffect(() => {
//     const messages = [
//       "Analyzing R&R data stream...",
//       "Detected: Sentiment Shift (Negative)",
//       "Vivelune Agent: Drafting Recovery...",
//       "Context: Order #8829 delay",
//       "API Call: Stripe (Issue Refund)",
//       "API Call: Slack (Notify Success)",
//       "Neural Node: Closed Loop Success"
//     ];
//     let i = 0;
//     const interval = setInterval(() => {
//       setTerminalLogs(prev => [...prev.slice(-5), `> ${messages[i % messages.length]}`]);
//       i++;
//     }, 2000);
//     return () => clearInterval(interval);
//   }, []);

//   // 2. Magnetic Button Logic
//   useEffect(() => {
//     const btn = magneticButton.current;
//     if (!btn) return;

//     const handleMouse = (e: MouseEvent) => {
//       const { clientX, clientY } = e;
//       const { left, top, width, height } = btn.getBoundingClientRect();
//       const x = clientX - (left + width / 2);
//       const y = clientY - (top + height / 2);
      
//       const distance = Math.sqrt(x * x + y * y);
//       if (distance < 150) {
//         gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.5, ease: "power2.out" });
//       } else {
//         gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
//       }
//     };
//     window.addEventListener("mousemove", handleMouse);
//     return () => window.removeEventListener("mousemove", handleMouse);
//   }, []);

//   return (
//     <main ref={containerRef} className="bg-[#000] text-zinc-100 selection:bg-purple-500/50">
      
//       {/* Cinematic Background */}
//       <div className="fixed inset-0 pointer-events-none z-0">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1a1033_0%,transparent_50%)]" />
//         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
//         <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />
//       </div>

//       <nav className="fixed top-0 w-full z-[100] px-6 py-8">
//         <div className="max-w-7xl mx-auto flex items-center justify-between mix-blend-difference">
//           <div className="flex items-center gap-2 group cursor-none">
//             <WorkflowIcon className="size-6 text-white group-hover:rotate-90 transition-transform duration-500" />
//             <span className="text-2xl font-black tracking-tighter uppercase italic">Vivelune</span>
//           </div>
//           <div className="flex items-center gap-10 text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-400">
//             {["Protocol", "Nodes", "Safety"].map(link => (
//               <Link key={link} href="#" className="hover:text-white transition-colors">{link}</Link>
//             ))}
//             <button className="px-6 py-2 bg-white text-black rounded-full hover:scale-110 transition-transform">Access</button>
//           </div>
//         </div>
//       </nav>

//       {/* 3D Hero Section */}
//       <section className="relative pt-64 pb-32 px-6 perspective-1000">
//         <motion.div style={{ rotateX }} className="max-w-6xl mx-auto text-center relative z-10">
//           <h1 className="text-[12vw] md:text-[160px] font-black tracking-tighter leading-[0.75] mb-20 text-balance">
//             BUILD THE <br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20">AUTONOMOUS.</span>
//           </h1>

//           <div className="grid lg:grid-cols-12 gap-12 mt-40 text-left">
//             <div className="lg:col-span-4 space-y-8">
//               <div className="p-6 rounded-3xl border border-white/5 bg-zinc-900/30 backdrop-blur-xl">
//                 <CommandIcon className="size-8 text-purple-500 mb-4" />
//                 <h3 className="text-xl font-bold mb-2 uppercase tracking-tighter">Zero-Code Intelligence</h3>
//                 <p className="text-zinc-500 text-sm leading-relaxed">Stop scripting APIs. Instruct our neural layer in plain English and watch it build the connectors for you.</p>
//               </div>
//               <div className="p-6 rounded-3xl border border-white/5 bg-zinc-900/30 backdrop-blur-xl">
//                 <GlobeIcon className="size-8 text-blue-500 mb-4" />
//                 <h3 className="text-xl font-bold mb-2 uppercase tracking-tighter">Global Residency</h3>
//                 <p className="text-zinc-500 text-sm leading-relaxed">Deploy nodes in any region. Maintain 100% data sovereignty with localized AI processing.</p>
//               </div>
//             </div>

//             {/* LIVE CONSOLE */}
//             <div className="lg:col-span-8 group relative">
//               <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[32px] blur opacity-20 group-hover:opacity-40 transition" />
//               <div className="relative h-[400px] rounded-[30px] bg-black border border-white/10 overflow-hidden font-mono">
//                 <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-zinc-900/50">
//                   <div className="size-2 rounded-full bg-red-500/50" />
//                   <div className="size-2 rounded-full bg-amber-500/50" />
//                   <div className="size-2 rounded-full bg-emerald-500/50" />
//                   <span className="ml-4 text-[10px] text-zinc-500 uppercase tracking-widest">vivelune_cli --live --verbose</span>
//                 </div>
//                 <div className="p-8 space-y-3">
//                   <AnimatePresence mode="popLayout">
//                     {terminalLogs.map((log, i) => (
//                       <motion.div
//                         key={log + i}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         exit={{ opacity: 0, scale: 0.95 }}
//                         className={`text-sm ${i === terminalLogs.length - 1 ? 'text-white' : 'text-zinc-600'}`}
//                       >
//                         <span className="text-purple-500 mr-3">➜</span> {log}
//                       </motion.div>
//                     ))}
//                   </AnimatePresence>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </section>

//       {/* THE ROASTANDRECOVER SPOTLIGHT - THE "NIGHT MODE" TESTIMONIAL */}
//       <section className="py-40 px-6 overflow-hidden">
//         <div className="max-w-7xl mx-auto rounded-[60px] bg-gradient-to-br from-zinc-900 to-black border border-white/5 p-12 md:p-24 relative">
//           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(249,115,22,0.1)_0,transparent_50%)]" />
          
//           <div className="relative z-10 grid lg:grid-cols-2 gap-24 items-center">
//             <div>
//               <div className="inline-flex items-center gap-4 mb-12">
//                 <div className="size-14 bg-white rounded-2xl flex items-center justify-center -rotate-6 group hover:rotate-0 transition-transform">
//                   <Image src="/randr.png" alt="R&R" width={32} height={32} />
//                 </div>
//                 <span className="text-2xl font-black uppercase italic tracking-tighter text-white">RoastandRecover</span>
//               </div>
//               <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 leading-[0.9]">
//                 "WE STOPPED <br /><span className="text-orange-500 underline decoration-zinc-800">LOSING CUSTOMERS.</span>"
//               </h2>
//               <p className="text-xl text-zinc-400 leading-relaxed mb-12">
//                 "Before Vivelune, 40% of negative reviews went unaddressed. Now, every single customer gets a personalized, AI-negotiated recovery offer within 120 seconds. Our LTV jumped by 22% in the first quarter."
//               </p>
//               <div className="flex gap-12 border-t border-white/5 pt-12">
//                 <div>
//                   <div className="text-4xl font-black text-white">+22%</div>
//                   <div className="text-xs font-bold text-zinc-600 uppercase mt-2">Revenue Retention</div>
//                 </div>
//                 <div>
//                   <div className="text-4xl font-black text-white">2 Min</div>
//                   <div className="text-xs font-bold text-zinc-600 uppercase mt-2">Avg. Response Time</div>
//                 </div>
//               </div>
//             </div>

//             <div className="relative">
//               <div className="relative aspect-square rounded-[40px] bg-white/[0.02] border border-white/5 p-8 flex flex-col justify-center overflow-hidden">
//                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.05)_0,transparent_100%)]" />
//                 {/* Visual Workflow abstraction */}
//                 <div className="space-y-4 relative z-10">
//                   {[
//                     { label: "Trigger: Low Sentiment", color: "bg-red-500" },
//                     { label: "AI Decision: Refund Policy Check", color: "bg-purple-500" },
//                     { label: "Action: Draft Email", color: "bg-blue-500" },
//                     { label: "Status: Recovered", color: "bg-emerald-500" },
//                   ].map((node, i) => (
//                     <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 translate-x-12 opacity-0 animate-in fade-in slide-in-from-right duration-700" style={{ animationDelay: `${i * 200}ms`, animationFillMode: 'forwards' }}>
//                       <div className={`size-3 rounded-full ${node.color} animate-pulse`} />
//                       <span className="font-mono text-xs uppercase tracking-widest">{node.label}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* MAGNETIC CTA */}
//       <section className="py-80 px-6 text-center">
//         <div className="max-w-4xl mx-auto flex flex-col items-center">
//           <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-16 italic">
//             READY TO DEPLOY?
//           </h2>
//           <button 
//             ref={magneticButton}
//             className="group relative h-32 w-32 md:h-48 md:w-48 bg-orange-500 rounded-full flex items-center justify-center transition-shadow hover:shadow-[0_0_80px_rgba(249,115,22,0.4)]"
//           >
//             <span className="text-black font-black text-xl md:text-2xl group-hover:scale-110 transition-transform">GO.</span>
//             <div className="absolute inset-0 border border-white/20 rounded-full animate-ping opacity-20" />
//           </button>
//         </div>
//       </section>

//       <footer className="py-20 px-6 border-t border-white/5 text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-700 text-center">
//         vivelune-neural-v4.0.2 // secure-transmission-only // 2026
//       </footer>

//     </main>
//   );
// }
// "use client";

// import { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import gsap from "gsap";
// import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
// import { 
//   ArrowRightIcon, WorkflowIcon, BotIcon, 
//   QuoteIcon, CpuIcon, GlobeIcon, TrendingUpIcon 
// } from "lucide-react";

// export default function LandingPage() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const magneticButton = useRef<HTMLButtonElement>(null);
//   const [workflowCount, setWorkflowCount] = useState(1245670);
//   const [terminalLogs, setTerminalLogs] = useState<string[]>(["[KERNEL]: v4.0.2 Initialized", "[SYNC]: Node-77 Cluster Online"]);
  
//   const { scrollYProgress } = useScroll();
//   const rotateX = useTransform(scrollYProgress, [0, 0.2], [10, 0]);
//   const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.98]);

//   // 1. Live Ticker Logic
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setWorkflowCount(prev => prev + Math.floor(Math.random() * 3) + 1);
//     }, 1500);
//     return () => clearInterval(interval);
//   }, []);

//   // 2. Terminal Loop
//   useEffect(() => {
//     const messages = [
//       "Inbound: RoastandRecover webhook received",
//       "Analysis: 1-Star Rating detected",
//       "Action: Fetching customer LTV from Stripe...",
//       "Logic: High-Value Customer found ($2k+)",
//       "Vivelune: Generating recovery path 'Alpha'...",
//       "Result: Personal refund + Credit offer sent",
//       "Dashboard: LTV saved. Workflow complete."
//     ];
//     let i = 0;
//     const interval = setInterval(() => {
//       setTerminalLogs(prev => [...prev.slice(-6), `> ${messages[i % messages.length]}`]);
//       i++;
//     }, 2200);
//     return () => clearInterval(interval);
//   }, []);

//   // 3. The "GO" Magnetic Logic (Enhanced Proximity)
//   useEffect(() => {
//     const btn = magneticButton.current;
//     if (!btn) return;
//     const handleMouse = (e: MouseEvent) => {
//       const { clientX, clientY } = e;
//       const { left, top, width, height } = btn.getBoundingClientRect();
//       const x = clientX - (left + width / 2);
//       const y = clientY - (top + height / 2);
//       const distance = Math.sqrt(x * x + y * y);
      
//       if (distance < 300) {
//         gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.6, ease: "power3.out" });
//       } else {
//         gsap.to(btn, { x: 0, y: 0, duration: 1.2, ease: "elastic.out(1, 0.3)" });
//       }
//     };
//     window.addEventListener("mousemove", handleMouse);
//     return () => window.removeEventListener("mousemove", handleMouse);
//   }, []);

//   return (
//     <main ref={containerRef} className="bg-[#000] text-zinc-100 selection:bg-orange-500/50">
      
//       {/* GLOBAL TICKER */}
//       <div className="fixed top-0 w-full z-[110] bg-orange-500 text-black py-1 overflow-hidden">
//         <div className="flex whitespace-nowrap animate-marquee font-black text-[10px] uppercase tracking-[0.2em]">
//           {[...Array(10)].map((_, i) => (
//             <span key={i} className="mx-8 flex items-center gap-2">
//               <TrendingUpIcon className="size-3" />
//               Workflows Executed: {workflowCount.toLocaleString()} 
//               <span className="opacity-40">// System Load: 12% // Region: Global-Edge-01</span>
//             </span>
//           ))}
//         </div>
//       </div>

//       <div className="fixed inset-0 pointer-events-none z-0">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1a1033_0%,transparent_50%)]" />
//         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] mix-blend-overlay" />
//       </div>

//       <nav className="fixed top-8 w-full z-[100] px-6">
//         <div className="max-w-7xl mx-auto h-16 rounded-full border border-white/5 bg-black/40 backdrop-blur-2xl px-8 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <WorkflowIcon className="size-5 text-orange-500" />
//             <span className="text-xl font-black tracking-tighter uppercase italic">Vivelune</span>
//           </div>
//           <button className="text-[10px] font-bold px-6 py-2 bg-white text-black rounded-full hover:bg-orange-500 hover:text-white transition-all uppercase tracking-widest">
//             Login
//           </button>
//         </div>
//       </nav>

//       {/* Hero */}
//       <section className="relative pt-64 pb-32 px-6">
//         <motion.div style={{ rotateX, scale }} className="max-w-7xl mx-auto text-center">
//           <h1 className="text-[14vw] md:text-[200px] font-black tracking-tighter leading-[0.75] mb-24 pointer-events-none">
//             ACTUAL <br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-800">INTELLIGENCE.</span>
//           </h1>

//           <div className="grid lg:grid-cols-2 gap-20 text-left items-end">
//             <div className="space-y-8">
//               <p className="text-2xl text-zinc-400 font-light leading-relaxed max-w-lg">
//                 The autonomous backbone for RoastandRecover and the next generation of AI-first companies.
//               </p>
//               <div className="flex gap-4">
//                  <div className="px-6 py-3 rounded-2xl bg-zinc-900 border border-white/5 text-sm font-bold flex items-center gap-3">
//                     <CpuIcon className="size-4 text-orange-500" /> Neural Routing
//                  </div>
//                  <div className="px-6 py-3 rounded-2xl bg-zinc-900 border border-white/5 text-sm font-bold flex items-center gap-3">
//                     <GlobeIcon className="size-4 text-blue-500" /> Global Nodes
//                  </div>
//               </div>
//             </div>

//             {/* LIVE CONSOLE */}
//             <div className="relative group">
//               <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-purple-600 rounded-[32px] blur opacity-10 group-hover:opacity-20 transition" />
//               <div className="relative rounded-[30px] bg-black border border-white/10 overflow-hidden shadow-2xl">
//                 <div className="px-6 py-4 bg-zinc-900/50 border-b border-white/5 flex justify-between">
//                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">vivelune_neural_shell</span>
//                    <div className="flex gap-1">
//                       <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
//                    </div>
//                 </div>
//                 <div className="p-8 h-64 font-mono text-[11px] space-y-2">
//                   <AnimatePresence mode="popLayout">
//                     {terminalLogs.map((log, i) => (
//                       <motion.div
//                         key={log + i}
//                         initial={{ opacity: 0, x: -10 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         className={i === terminalLogs.length - 1 ? "text-orange-500" : "text-zinc-600"}
//                       >
//                         {log}
//                       </motion.div>
//                     ))}
//                   </AnimatePresence>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </section>

//       {/* ROASTANDRECOVER SPOTLIGHT */}
//       <section className="py-40 px-6">
//         <div className="max-w-7xl mx-auto rounded-[80px] bg-zinc-100 text-black p-12 md:p-32 relative overflow-hidden">
//           <div className="relative z-10 grid lg:grid-cols-12 gap-16 items-center">
//             <div className="lg:col-span-7">
//               <div className="flex items-center gap-4 mb-12">
//                 <Image src="/randr.png" alt="R&R" width={48} height={48} className="rounded-2xl" />
//                 <span className="text-sm font-black uppercase tracking-widest text-zinc-400">Scale Partner</span>
//               </div>
//               <h2 className="text-6xl md:text-[90px] font-black tracking-tighter leading-[0.85] mb-12">
//                 RECOVERING <br />
//                 <span className="italic font-serif text-zinc-400">EVERY</span> DOLLAR.
//               </h2>
//               <div className="grid grid-cols-2 gap-8 border-t border-zinc-200 pt-12">
//                  <div>
//                     <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Saved Hours</div>
//                     <div className="text-5xl font-black italic">40.2h</div>
//                  </div>
//                  <div>
//                     <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Churn Reduction</div>
//                     <div className="text-5xl font-black italic">14.8%</div>
//                  </div>
//               </div>
//             </div>
//             <div className="lg:col-span-5">
//               <div className="bg-black text-white p-10 rounded-[50px] shadow-2xl rotate-2">
//                 <QuoteIcon className="size-10 text-orange-500 mb-6" />
//                 <p className="text-xl font-medium leading-relaxed mb-8">
//                   "Vivelune isn't a tool; it's a digital employee that handles our entire recovery lifecycle without a single manual click."
//                 </p>
//                 <p className="font-bold text-xs tracking-widest uppercase opacity-40">Alex Rivera // CEO, R&R</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* THE ICONIC ORANGE MAGNETIC CTA */}
//       <section className="py-80 px-6 text-center">
//         <div className="max-w-4xl mx-auto flex flex-col items-center">
//           <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-16 italic">
//             READY TO DEPLOY?
//           </h2>
//           <button 
//             ref={magneticButton}
//             className="group relative h-48 w-48 bg-orange-500 rounded-full flex flex-col items-center justify-center transition-shadow hover:shadow-[0_0_80px_rgba(249,115,22,0.4)]"
//           >
//             <span className="text-black font-black text-3xl group-hover:scale-110 transition-transform">GO.</span>
//             <div className="absolute inset-0 border border-white/20 rounded-full animate-ping opacity-20 pointer-events-none" />
//           </button>
//         </div>
//       </section>

//       <footer className="py-20 px-6 border-t border-white/5 opacity-40 text-[10px] font-bold uppercase tracking-[0.4em] text-center">
//         vivelune-labs // neural-core-v4 // 2026
//       </footer>

//       <style jsx global>{`
//         @keyframes marquee {
//           0% { transform: translateX(0); }
//           100% { transform: translateX(-50%); }
//         }
//         .animate-marquee {
//           display: inline-flex;
//           animation: marquee 30s linear infinite;
//         }
//       `}</style>
//     </main>
//   );
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import gsap from "gsap";
// import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
// import { 
//   ArrowRightIcon, QuoteIcon, CpuIcon, GlobeIcon, TrendingUpIcon 
// } from "lucide-react";
// import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";

// export default function LandingPage() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const magneticButton = useRef<HTMLButtonElement>(null);
//   const [workflowCount, setWorkflowCount] = useState(1245670);
//   const [terminalLogs, setTerminalLogs] = useState<string[]>(["[KERNEL]: v4.0.2 Initialized", "[SYNC]: Node-77 Cluster Online"]);
  
//   const { scrollYProgress } = useScroll();
//   const rotateX = useTransform(scrollYProgress, [0, 0.2], [10, 0]);
//   const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.98]);

//   // Real-Time Ticker Logic
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setWorkflowCount(prev => prev + Math.floor(Math.random() * 3) + 1);
//     }, 1500);
//     return () => clearInterval(interval);
//   }, []);

//   // Neural Console Simulation
//   useEffect(() => {
//     const messages = [
//       "Inbound: RoastandRecover webhook received",
//       "Analysis: 1-Star Rating detected",
//       "Action: Fetching customer LTV from Stripe...",
//       "Logic: High-Value Customer found ($2k+)",
//       "Vivelune: Generating recovery path 'Alpha'...",
//       "Result: Personal refund + Credit offer sent",
//       "Dashboard: LTV saved. Workflow complete."
//     ];
//     let i = 0;
//     const interval = setInterval(() => {
//       setTerminalLogs(prev => [...prev.slice(-6), `> ${messages[i % messages.length]}`]);
//       i++;
//     }, 2200);
//     return () => clearInterval(interval);
//   }, []);

//   // The Iconic "GO" Magnetic Logic
//   useEffect(() => {
//     const btn = magneticButton.current;
//     if (!btn) return;
//     const handleMouse = (e: MouseEvent) => {
//       const { clientX, clientY } = e;
//       const { left, top, width, height } = btn.getBoundingClientRect();
//       const x = clientX - (left + width / 2);
//       const y = clientY - (top + height / 2);
//       const distance = Math.sqrt(x * x + y * y);
      
//       if (distance < 350) {
//         gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.6, ease: "power3.out" });
//       } else {
//         gsap.to(btn, { x: 0, y: 0, duration: 1.2, ease: "elastic.out(1, 0.3)" });
//       }
//     };
//     window.addEventListener("mousemove", handleMouse);
//     return () => window.removeEventListener("mousemove", handleMouse);
//   }, []);

//   return (
//     <main ref={containerRef} className="bg-[#000] text-zinc-100 selection:bg-orange-500/50">
      
//       {/* 1. GLOBAL REAL-TIME TICKER */}
//       <div className="fixed top-0 w-full z-[110] bg-orange-500 text-black py-1 overflow-hidden">
//         <div className="flex whitespace-nowrap animate-marquee font-black text-[10px] uppercase tracking-[0.2em]">
//           {[...Array(10)].map((_, i) => (
//             <span key={i} className="mx-8 flex items-center gap-2">
//               <TrendingUpIcon className="size-3" />
//               Workflows Executed: {workflowCount.toLocaleString()} 
//               <span className="opacity-40">// System Load: 12% // Region: Global-Edge-01</span>
//             </span>
//           ))}
//         </div>
//       </div>

//       <div className="fixed inset-0 pointer-events-none z-0">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1a1033_0%,transparent_50%)]" />
//         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] mix-blend-overlay" />
//       </div>

//       {/* 2. ENHANCED NAV WITH CLERK & YOUR LOGO */}
//       <nav className="fixed top-10 w-full z-[100] px-6">
//         <div className="max-w-7xl mx-auto h-16 rounded-full border border-white/5 bg-black/40 backdrop-blur-2xl px-8 flex items-center justify-between shadow-2xl">
//           <Link href="/" className="flex items-center gap-3 group">
//             <Image 
//               src="/logo-primary.png" 
//               alt="Vivelune Logo" 
//               width={28} 
//               height={28} 
//               className="group-hover:rotate-12 transition-transform duration-500"
//             />
//             <span className="text-xl font-black tracking-tighter uppercase italic">Vivelune</span>
//           </Link>
          
//           <div className="hidden md:flex items-center gap-8 text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">
//             <Link href="#features" className="hover:text-white transition">Engine</Link>
//             <Link href="#roast-recover" className="hover:text-white transition">Case Studies</Link>
//           </div>

//           <div className="flex items-center gap-4">
//             <SignedOut>
//               <div className="text-[10px] font-bold px-5 py-2 bg-white text-black rounded-full hover:bg-orange-500 hover:text-white transition-all uppercase tracking-widest cursor-pointer">
//                 <SignInButton mode="modal" />
//               </div>
//             </SignedOut>
//             <SignedIn>
//               <div className="flex items-center gap-4">
//                 <Link href="/workflows" className="text-[10px] font-bold text-zinc-400 hover:text-white uppercase tracking-widest">Dashboard</Link>
//                 <UserButton afterSignOutUrl="/" />
//               </div>
//             </SignedIn>
//           </div>
//         </div>
//       </nav>

//       {/* 3. HERO SECTION */}
//       <section className="relative pt-72 pb-32 px-6">
//         <motion.div style={{ rotateX, scale }} className="max-w-7xl mx-auto text-center">
//           <h1 className="text-[14vw] md:text-[200px] font-black tracking-tighter leading-[0.75] mb-24 pointer-events-none">
//             ACTUAL <br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-800">INTELLIGENCE.</span>
//           </h1>

//           <div className="grid lg:grid-cols-2 gap-20 text-left items-end">
//             <div className="space-y-8">
//               <p className="text-2xl text-zinc-400 font-light leading-relaxed max-w-lg">
//                 The autonomous backbone for <span className="text-white font-medium italic">RoastandRecover</span> and the next generation of AI-first companies.
//               </p>
//               <div className="flex gap-4">
//                  <div className="px-6 py-3 rounded-2xl bg-zinc-900 border border-white/5 text-sm font-bold flex items-center gap-3">
//                     <CpuIcon className="size-4 text-orange-500" /> Neural Routing
//                  </div>
//                  <div className="px-6 py-3 rounded-2xl bg-zinc-900 border border-white/5 text-sm font-bold flex items-center gap-3">
//                     <GlobeIcon className="size-4 text-blue-500" /> Global Nodes
//                  </div>
//               </div>
//             </div>

//             {/* NEURAL CONSOLE */}
//             <div className="relative group">
//               <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-purple-600 rounded-[32px] blur opacity-10 group-hover:opacity-20 transition" />
//               <div className="relative rounded-[30px] bg-black border border-white/10 overflow-hidden shadow-2xl">
//                 <div className="px-6 py-4 bg-zinc-900/50 border-b border-white/5 flex justify-between">
//                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">vivelune_neural_shell</span>
//                    <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
//                 </div>
//                 <div className="p-8 h-64 font-mono text-[11px] space-y-2">
//                   <AnimatePresence mode="popLayout">
//                     {terminalLogs.map((log, i) => (
//                       <motion.div
//                         key={log + i}
//                         initial={{ opacity: 0, x: -10 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         className={i === terminalLogs.length - 1 ? "text-orange-500" : "text-zinc-600"}
//                       >
//                         {log}
//                       </motion.div>
//                     ))}
//                   </AnimatePresence>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </section>

//       {/* 4. ROASTANDRECOVER SPOTLIGHT */}
//       <section id="roast-recover" className="py-40 px-6">
//         <div className="max-w-7xl mx-auto rounded-[80px] bg-zinc-100 text-black p-12 md:p-32 relative overflow-hidden">
//           <div className="relative z-10 grid lg:grid-cols-12 gap-16 items-center">
//             <div className="lg:col-span-7">
//               <div className="flex items-center gap-4 mb-12">
//                 <Image src="/randr.png" alt="R&R" width={48} height={48} className="rounded-2xl" />
//                 <span className="text-sm font-black uppercase tracking-widest text-zinc-400 underline underline-offset-8">Partnership</span>
//               </div>
//               <h2 className="text-6xl md:text-[90px] font-black tracking-tighter leading-[0.85] mb-12">
//                 RECOVERING <br />
//                 <span className="italic font-serif text-zinc-400">EVERY</span> DOLLAR.
//               </h2>
//               <div className="grid grid-cols-2 gap-8 border-t border-zinc-200 pt-12">
//                  <div>
//                     <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Saved Hours</div>
//                     <div className="text-5xl font-black italic">40.2h</div>
//                  </div>
//                  <div>
//                     <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Churn Reduction</div>
//                     <div className="text-5xl font-black italic">14.8%</div>
//                  </div>
//               </div>
//             </div>
//             <div className="lg:col-span-5">
//               <div className="bg-black text-white p-10 rounded-[50px] shadow-2xl rotate-2">
//                 <QuoteIcon className="size-10 text-orange-500 mb-6" />
//                 <p className="text-xl font-medium leading-relaxed mb-8">
//                   "Vivelune isn't a tool; it's a digital employee that handles our entire recovery lifecycle without a single manual click."
//                 </p>
//                 <p className="font-bold text-xs tracking-widest uppercase opacity-40">Alex Rivera // CEO, R&R</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 5. THE MAGNETIC "GO" BUTTON */}
//       <section className="py-80 px-6 text-center">
//         <div className="max-w-4xl mx-auto flex flex-col items-center">
//           <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-16 italic">
//             READY TO DEPLOY?
//           </h2>
//           <button 
//             ref={magneticButton}
//             className="group relative h-48 w-48 bg-orange-500 rounded-full flex flex-col items-center justify-center transition-shadow hover:shadow-[0_0_80px_rgba(249,115,22,0.4)]"
//           >
//             <span className="text-black font-black text-3xl group-hover:scale-110 transition-transform">GO.</span>
//             <div className="absolute inset-0 border border-white/20 rounded-full animate-ping opacity-20 pointer-events-none" />
//           </button>
//         </div>
//       </section>

//       {/* FOOTER */}
//       <footer className="py-20 px-6 border-t border-white/5 opacity-40 text-[10px] font-bold uppercase tracking-[0.4em] text-center">
//         vivelune-labs // neural-core-v4 // {new Date().getFullYear()}
//       </footer>

//       <style jsx global>{`
//         @keyframes marquee {
//           0% { transform: translateX(0); }
//           100% { transform: translateX(-50%); }
//         }
//         .animate-marquee {
//           display: inline-flex;
//           animation: marquee 30s linear infinite;
//         }
//       `}</style>
//     </main>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRightIcon, QuoteIcon, CpuIcon, GlobeIcon, 
  TrendingUpIcon, CheckCircle2, CommandIcon
} from "lucide-react";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";

export default function ViveluneLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const magneticButton = useRef<HTMLButtonElement>(null);
  const [workflowCount, setWorkflowCount] = useState(1245670);
  const [terminalLogs, setTerminalLogs] = useState<string[]>(["[KERNEL]: v4.0.2 Initialized", "[SYNC]: Node-77 Cluster Online"]);
  
  const { scrollYProgress } = useScroll();
  const rotateX = useTransform(scrollYProgress, [0, 0.2], [10, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.98]);

  // 1. Real-Time Ticker Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkflowCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // 2. Neural Console Logic
  useEffect(() => {
    const messages = [
      "Inbound: RoastandRecover webhook received",
      "Analysis: 1-Star Rating detected",
      "Action: Fetching customer LTV from Stripe...",
      "Logic: High-Value Customer found ($2k+)",
      "Vivelune: Generating recovery path 'Alpha'...",
      "Result: Personal refund + Credit offer sent",
      "Dashboard: LTV saved. Workflow complete."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setTerminalLogs(prev => [...prev.slice(-6), `> ${messages[i % messages.length]}`]);
      i++;
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // 3. Magnetic "GO" Button Physics
  useEffect(() => {
    const btn = magneticButton.current;
    if (!btn) return;
    const handleMouse = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = btn.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      const distance = Math.sqrt(x * x + y * y);
      
      if (distance < 350) {
        gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.6, ease: "power3.out" });
      } else {
        gsap.to(btn, { x: 0, y: 0, duration: 1.2, ease: "elastic.out(1, 0.3)" });
      }
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <main ref={containerRef} className="bg-[#000] text-zinc-100 selection:bg-orange-500/50 overflow-x-hidden">
      
      {/* GLOBAL TICKER */}
      <div className="fixed top-0 w-full z-[110] bg-orange-500 text-black py-1 overflow-hidden shadow-xl">
        <div className="flex whitespace-nowrap animate-marquee font-black text-[10px] uppercase tracking-[0.2em]">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-8 flex items-center gap-2">
              <TrendingUpIcon className="size-3" />
              Workflows Executed: {workflowCount.toLocaleString()} 
              <span className="opacity-40">// System Load: 12% // Region: Global-Edge-01</span>
            </span>
          ))}
        </div>
      </div>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1a1033_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] mix-blend-overlay" />
      </div>

      {/* NAV BAR */}
      <nav className="fixed top-10 w-full z-[100] px-6">
        <div className="max-w-7xl mx-auto h-16 rounded-full border border-white/5 bg-black/40 backdrop-blur-2xl px-8 flex items-center justify-between shadow-2xl">
          <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src="/logo-primary.png" 
              alt="Vivelune" 
              width={28} 
              height={28} 
              className="group-hover:rotate-12 transition-transform duration-500"
            />
            <span className="text-xl font-black tracking-tighter uppercase italic">Vivelune</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">
            <Link href="#features" className="hover:text-white transition">Protocol</Link>
            <Link href="#roast-recover" className="hover:text-white transition">Partnerships</Link>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <div className="text-[10px] font-bold px-6 py-2.5 bg-white text-black rounded-full hover:bg-orange-500 hover:text-white transition-all uppercase tracking-widest cursor-pointer shadow-lg shadow-white/5">
                <SignInButton mode="modal" />
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-6">
                <Link href="/dashboard" className="text-[10px] font-bold text-zinc-400 hover:text-white uppercase tracking-[0.2em] transition">Dashboard</Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-72 pb-32 px-6">
        <motion.div style={{ rotateX, scale }} className="max-w-7xl mx-auto text-center">
          <h1 className="text-[14vw] md:text-[200px] font-black tracking-tighter leading-[0.75] mb-24 pointer-events-none select-none">
            ACTUAL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-800">INTELLIGENCE.</span>
          </h1>

          <div className="grid lg:grid-cols-2 gap-20 text-left items-end">
            <div className="space-y-10">
              <p className="text-2xl text-zinc-400 font-light leading-relaxed max-w-lg">
                The autonomous backbone for <span className="text-white font-medium italic">RoastandRecover</span> and the elite generation of AI-first infrastructure.
              </p>
              <div className="flex gap-4">
                 <div className="px-6 py-4 rounded-3xl bg-zinc-900 border border-white/5 text-[11px] font-black uppercase tracking-widest flex items-center gap-3">
                    <CpuIcon className="size-4 text-orange-500" /> Neural Routing
                 </div>
                 <div className="px-6 py-4 rounded-3xl bg-zinc-900 border border-white/5 text-[11px] font-black uppercase tracking-widest flex items-center gap-3">
                    <GlobeIcon className="size-4 text-blue-500" /> Global Nodes
                 </div>
              </div>
            </div>

            {/* NEURAL CONSOLE */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-purple-600 rounded-[32px] blur opacity-10 group-hover:opacity-30 transition duration-1000" />
              <div className="relative rounded-[30px] bg-black border border-white/10 overflow-hidden shadow-2xl">
                <div className="px-6 py-4 bg-zinc-900/50 border-b border-white/5 flex justify-between items-center">
                   <div className="flex gap-2">
                      <div className="size-2 rounded-full bg-zinc-800" />
                      <div className="size-2 rounded-full bg-zinc-800" />
                   </div>
                   <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.3em]">Vivelune_Shell_v4</span>
                </div>
                <div className="p-8 h-64 font-mono text-[11px] space-y-2.5 overflow-hidden">
                  <AnimatePresence mode="popLayout">
                    {terminalLogs.map((log, i) => (
                      <motion.div
                        key={log + i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={i === terminalLogs.length - 1 ? "text-orange-500" : "text-zinc-600"}
                      >
                        {log}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* THE PRESTIGE BENTO CASE STUDY (RoastandRecover) */}
      <section id="roast-recover" className="py-40 px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto rounded-[60px] md:rounded-[100px] bg-[#0A0A0A] border border-white/5 p-1 md:p-2 shadow-2xl">
          <div className="bg-zinc-100 rounded-[58px] md:rounded-[98px] text-black overflow-hidden grid lg:grid-cols-12">
            
            {/* LEFT: Content */}
            <div className="lg:col-span-7 p-8 md:p-24">
              <div className="flex items-center gap-4 mb-16">
                <Image src="/randr.png" alt="R&R" width={40} height={40} className="rounded-xl shadow-lg" />
                <div className="h-px w-12 bg-zinc-300" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Scale Partnership</span>
              </div>
              
              <h2 className="text-6xl md:text-[110px] font-black tracking-[-0.06em] leading-[0.8] mb-12">
                RECOVER <br />
                <span className="text-zinc-400 font-serif italic">WITHOUT</span> <br />
                LIMITS.
              </h2>

              <p className="text-2xl text-zinc-600 font-light leading-snug mb-16 max-w-lg">
                Vivelune acts as the cognitive layer for <span className="text-black font-bold italic underline underline-offset-4 decoration-zinc-300">RoastandRecover</span>, ensuring no customer falls through the cracks.
              </p>

              <div className="grid grid-cols-2 gap-12 pt-12 border-t border-zinc-200">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Saved Operations</div>
                  <div className="text-6xl font-black italic tracking-tighter">40.2h<span className="text-xl text-zinc-400">/wk</span></div>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Revenue Saved</div>
                  <div className="text-6xl font-black italic tracking-tighter">18%<span className="text-xl text-zinc-400">+</span></div>
                </div>
              </div>
            </div>

            {/* RIGHT: Visual Logic Bento */}
            <div className="lg:col-span-5 bg-zinc-200/50 p-8 flex flex-col justify-center gap-4 relative">
              <motion.div 
                whileInView={{ x: [20, 0], opacity: [0, 1] }}
                className="bg-white p-6 rounded-[32px] shadow-sm border border-zinc-200 flex items-center gap-4 rotate-2"
              >
                <div className="size-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold italic">!</div>
                <div>
                  <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Negative Feedback</div>
                  <div className="text-sm font-bold tracking-tight">"This is unacceptable service..."</div>
                </div>
              </motion.div>

              <motion.div 
                whileInView={{ x: [-20, 0], opacity: [0, 1] }}
                className="bg-black text-white p-7 rounded-[32px] shadow-2xl flex items-center gap-5 -rotate-2 z-10"
              >
                <div className="size-12 bg-orange-500 rounded-2xl flex items-center justify-center text-black">
                  <CpuIcon className="size-6" />
                </div>
                <div>
                  <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Vivelune Reasoning</div>
                  <div className="text-sm font-bold tracking-tight">Deploying Recovery Script Alpha-9</div>
                </div>
              </motion.div>

              <motion.div 
                whileInView={{ x: [20, 0], opacity: [0, 1] }}
                className="bg-emerald-500 p-6 rounded-[32px] shadow-xl shadow-emerald-500/20 flex items-center gap-4 rotate-1"
              >
                <div className="size-10 bg-white rounded-full flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="size-5" />
                </div>
                <div className="text-white">
                  <div className="text-[9px] font-black opacity-70 uppercase tracking-widest mb-1">Status: Recovered</div>
                  <div className="text-sm font-bold tracking-tight">Customer Retention Secured</div>
                </div>
              </motion.div>

              <div className="mt-8 p-10 bg-white rounded-[40px] shadow-sm italic text-lg leading-relaxed border border-zinc-200">
                <QuoteIcon className="size-8 text-orange-500 mb-6" />
                "Vivelune isn't a tool; it's a digital employee that never sleeps."
                <div className="mt-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 not-italic">Alex Rivera // CEO, R&R</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL MAGNETIC CTA */}
      <section className="py-80 px-6 text-center relative">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mb-12 text-[10px] font-black tracking-[0.6em] text-zinc-800 uppercase"
          >
            Awaiting Command // Node 01 Ready
          </motion.div>
          <h2 className="text-5xl md:text-9xl font-black tracking-tighter mb-20 italic">
            READY TO DEPLOY?
          </h2>
          <button 
            ref={magneticButton}
            className="group relative h-48 w-48 md:h-64 md:w-64 bg-orange-500 rounded-full flex flex-col items-center justify-center transition-all duration-300 hover:shadow-[0_0_100px_rgba(249,115,22,0.5)]"
          >
            <span className="text-black font-black text-4xl md:text-5xl group-hover:scale-110 transition-transform">GO.</span>
            <div className="absolute inset-0 border border-white/20 rounded-full animate-ping opacity-20 pointer-events-none" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 border-t border-white/5 opacity-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.5em]">
          <div>Vivelune Labs ©2026</div>
          <div className="flex gap-12">
            <Link href="#" className="hover:text-white transition">Twitter</Link>
            <Link href="#" className="hover:text-white transition">GitHub</Link>
            <Link href="#" className="hover:text-white transition">Privacy</Link>
          </div>
          <div className="italic">Neural Core Active</div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 40s linear infinite;
        }
        html { scroll-behavior: smooth; }
      `}</style>
    </main>
  );
}