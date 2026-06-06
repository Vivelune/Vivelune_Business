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
        <p className="text-gold text-xs tracking-[0.24em] uppercase font-body mb-4">What we teach</p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2 className="font-display text-4xl md:text-6xl font-light leading-tight">
            Every subject.<br />
            <em className="not-italic text-gold">One platform.</em>
          </h2>
          <p className="text-white/35 font-body text-sm max-w-xs leading-relaxed md:text-right">
            Expert instructors across disciplines — all following the same rigorous 1-to-1 methodology.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
        {SUBJECTS.map((s) => (
          <div
            key={s.number}
            className="bg-black p-8 lg:p-10 group hover:bg-zinc-950 transition-colors duration-500 cursor-default"
          >
            <div className="flex items-start justify-between mb-6">
              <span className="font-display text-5xl font-light text-white/30 group-hover:text-[#c9a96e]/70 transition-colors duration-500">
                {s.number}
              </span>
              <div className="w-8 h-px bg-[#c9a96e]/70 mt-4 group-hover:w-16 transition-all duration-500" />
            </div>
            <h3 className="font-display text-2xl font-light text-white mb-3 group-hover:text-[#c9a96e] transition-colors duration-400">
              {s.category}
            </h3>
            <p className="text-white/35 font-body text-sm leading-relaxed mb-6">
              {s.desc}
            </p>
            <div className="flex flex-wrap gap-2">
              {s.topics.map((t) => (
                <span
                  key={t}
                  className="text-[10px] tracking-wider uppercase text-white/25 border border-white/8 px-2.5 py-1 font-body group-hover:border-gold/20 group-hover:text-[#c9a96e]/50 transition-all duration-300"
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
