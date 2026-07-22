const SUBJECTS = [
  {
    category: "Artificial Intelligence",
    desc: "Machine learning, prompt engineering, neural networks, and AI-powered product development — from foundations to deployment.",
    topics: ["Machine Learning", "Prompt Engineering", "LLMs", "Computer Vision"],
    number: "01",
  },
  {
    category: "App Development",
    desc: "Build real products. From full-stack web apps to mobile — React, Next.js, APIs, databases, and cloud infrastructure.",
    topics: ["Next.js", "React Native", "APIs", "PostgreSQL"],
    number: "02",
  },
  {
    category: "E-Commerce",
    desc: "Launch and scale online stores. Product strategy, Shopify, conversion optimisation, and paid acquisition systems.",
    topics: ["Shopify", "Conversion CRO", "Paid Ads", "Product Strategy"],
    number: "03",
  },
  {
    category: "Languages",
    desc: "French, Spanish, Mandarin, Arabic and more — structured immersion with native-level instructors at every pace.",
    topics: ["French", "Spanish", "Mandarin", "Arabic"],
    number: "04",
  },
];

export default function Subjects() {
  return (
    <section id="subjects" className="py-28 px-6 lg:px-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-16">
        <p className="font-data text-accent text-[11px] tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
          <span className="w-6 h-px bg-accent" /> Loadout
        </p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2 className="font-display text-5xl md:text-7xl font-semibold leading-[0.95] uppercase">
            Every subject.
            <br />
            <span className="text-accent">One platform.</span>
          </h2>
          <p className="text-white/40 font-body text-sm max-w-xs leading-relaxed md:text-right">
            Expert instructors across disciplines — all following the same rigorous 1-to-1 methodology.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/8 border border-white/8">
        {SUBJECTS.map((s) => (
          <div
            key={s.number}
            className="relative bg-void p-8 lg:p-10 group hover:bg-panel transition-colors duration-300 cursor-default overflow-hidden"
          >
            {/* corner notch accent that appears on hover */}
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[26px] border-l-[26px] border-t-accent/0 border-l-transparent group-hover:border-t-accent/70 transition-all duration-300" />

            <div className="flex items-start justify-between mb-6">
              <span className="font-data text-5xl font-semibold text-white/15 group-hover:text-accent/60 transition-colors duration-300">
                {s.number}
              </span>
              <div className="w-8 h-px bg-accent/60 mt-4 group-hover:w-16 transition-all duration-300" />
            </div>
            <h3 className="font-display text-3xl font-semibold text-white mb-3 uppercase tracking-tight group-hover:text-accent transition-colors duration-200">
              {s.category}
            </h3>
            <p className="text-white/40 font-body text-sm leading-relaxed mb-6">{s.desc}</p>
            <div className="flex flex-wrap gap-2">
              {s.topics.map((t) => (
                <span
                  key={t}
                  className="font-data text-[10px] tracking-wider uppercase text-white/30 border border-white/10 px-2.5 py-1 group-hover:border-accent/30 group-hover:text-accent/70 transition-all duration-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}