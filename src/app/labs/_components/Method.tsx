const STEPS = [
  {
    num: "01",
    title: "Choose your subject",
    desc: "Select from AI, App Development, E-Commerce, Languages, and more. One plan covers your chosen discipline.",
  },
  {
    num: "02",
    title: "Pick your plan",
    desc: "1, 2, or 3 sessions per week — each 55 minutes of uninterrupted, private instruction.",
  },
  {
    num: "03",
    title: "Receive your Zoom access",
    desc: "We send dedicated credentials for your private classroom. Same link every session — no hunting for meeting IDs.",
  },
  {
    num: "04",
    title: "Learn & communicate directly",
    desc: "Reach your instructor anytime via WhatsApp or email. Monthly payment links sent manually — no auto-billing ever.",
  },
];

export default function Method() {
  return (
    <section id="method" className="py-28 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div className="lg:sticky lg:top-32">
            <p className="text-[#c9a96e] text-xs tracking-[0.24em] uppercase font-body mb-5">The method</p>
            <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6">
              Refined learning,<br />
              <em className="not-italic text-[#c9a96e]">on your schedule</em>
            </h2>
            <p className="text-white/50 font-body text-sm leading-relaxed max-w-sm mb-8">
              Every ViveLune session is private, purposeful, and built around your progression.
              No group dynamics. No distractions. Just expert instruction that moves at your pace.
            </p>
            <div className="flex flex-col gap-3 text-xs font-body">
              <div className="flex items-center gap-3 text-white/30">
                <div className="w-4 h-px bg-[#c9a96e]/50" />
                <span className="tracking-wider uppercase">Make-up guarantee for any missed sessions</span>
              </div>
              <div className="flex items-center gap-3 text-white/30">
                <div className="w-4 h-px bg-[#c9a96e]/50" />
                <span className="tracking-wider uppercase">Cancel any month, no lock-in</span>
              </div>
              <div className="flex items-center gap-3 text-white/30">
                <div className="w-4 h-px bg-[#c9a96e]/50" />
                <span className="tracking-wider uppercase">Wyoming, US registered company</span>
              </div>
            </div>
          </div>

          {/* Right — steps */}
          <div className="flex flex-col">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="flex gap-6 py-7 border-b border-white/5 group hover:bg-white/[0.015] -mx-4 px-4 transition-colors duration-300 cursor-default"
              >
                <span className="font-display text-3xl font-light text-white/10 group-hover:text-[#c9a96e]/30 transition-colors duration-400 leading-none pt-0.5 min-w-[2rem]">
                  {step.num}
                </span>
                <div>
                  <p className="font-body font-medium text-white/70 group-hover:text-white text-sm mb-1.5 tracking-wide transition-colors duration-300">
                    {step.title}
                  </p>
                  <p className="font-body text-white/30 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
