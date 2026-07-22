const STATS = [
  { num: "55", label: "MINUTES / SESSION" },
  { num: "1:1", label: "PRIVATE INSTRUCTION" },
  { num: "50+", label: "SUBJECT CATEGORIES" },
  { num: "CUSTOM", label: "SESSIONS / WEEK" },
];

export default function StatsBar() {
  return (
    <div className="border-y border-white/8 grid grid-cols-2 md:grid-cols-4 bg-panel">
      {STATS.map((s, i) => (
        <div
          key={s.label}
          className={`relative py-8 px-6 text-center group ${
            i < STATS.length - 1 ? "border-r border-white/8" : ""
          }`}
        >
          <span className="absolute top-3 left-1/2 -translate-x-1/2 font-data text-accent/0 group-hover:text-accent/60 text-[9px] transition-colors duration-200">
            //
          </span>
          <span className="font-display text-4xl md:text-5xl font-semibold text-accent block mb-1 tracking-tight">
            {s.num}
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-data">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}