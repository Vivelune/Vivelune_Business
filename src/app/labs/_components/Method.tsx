const STEPS = [
  {
    num: "PHASE_01",
    title: "Choose your subject",
    desc: "Select from AI, App Development, E-Commerce, Languages, and more. One plan covers your chosen discipline.",
  },
  {
    num: "PHASE_02",
    title: "Pick your plan",
    desc: "1, 2, or 3 sessions per week — each 55 minutes of uninterrupted, private instruction.",
  },
  {
    num: "PHASE_03",
    title: "Receive your Zoom access",
    desc: "We send dedicated credentials for your private classroom. Same link every session — no hunting for meeting IDs.",
  },
  {
    num: "PHASE_04",
    title: "Learn & communicate directly",
    desc: "Reach your instructor anytime via WhatsApp or email. Monthly payment links sent manually — no auto-billing ever.",
  },
];

export default function Method() {
  return (
    <section id="method" className="py-28 border-t border-white/8">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div className="lg:sticky lg:top-32">
            <p className="font-data text-accent text-[11px] tracking-[0.3em] uppercase mb-5 flex items-center gap-2">
              <span className="w-6 h-px bg-accent" /> Briefing
            </p>
            <h2 className="font-display text-5xl md:text-6xl font-semibold leading-[0.95] mb-6 uppercase">
              Refined learning,
              <br />
              <span className="text-accent">on your schedule</span>
            </h2>
            <p className="text-white/50 font-body text-sm leading-relaxed max-w-sm mb-8">
              Every ViveLune session is private, purposeful, and built around your progression.
              No group dynamics. No distractions. Just expert instruction that moves at your pace.
            </p>
            <div className="flex flex-col gap-3 text-xs font-data">
              <div className="flex items-center gap-3 text-white/35">
                <div className="w-4 h-px bg-accent/60" />
                <span className="tracking-wider uppercase">Make-up guarantee for any missed sessions</span>
              </div>
              <div className="flex items-center gap-3 text-white/35">
                <div className="w-4 h-px bg-accent/60" />
                <span className="tracking-wider uppercase">Cancel any month, no lock-in</span>
              </div>
              <div className="flex items-center gap-3 text-white/35">
                <div className="w-4 h-px bg-accent/60" />
                <span className="tracking-wider uppercase">Wyoming, US registered company</span>
              </div>
            </div>
          </div>

          {/* Right — steps */}
          <div className="flex flex-col">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="relative flex gap-6 py-7 border-b border-white/8 group hover:bg-panel/40 -mx-4 px-4 transition-colors duration-200 cursor-default"
              >
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent/0 group-hover:bg-accent transition-colors duration-200" />
                <span className="font-data text-xs font-semibold text-accent/40 group-hover:text-accent transition-colors duration-200 leading-none pt-1 min-w-[5.5rem] tracking-wider">
                  {step.num}
                </span>
                <div>
                  <p className="font-body font-semibold text-white/75 group-hover:text-white text-sm mb-1.5 tracking-wide transition-colors duration-200 uppercase">
                    {step.title}
                  </p>
                  <p className="font-body text-white/35 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}