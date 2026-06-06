const STATS = [
  { num: "55", label: "Minutes per session" },
  { num: "1:1", label: "Private instruction" },
  { num: "50+", label: "Subject categories" },
  { num: "Custom", label: "Sessions per week" },
];

export default function StatsBar() {
  return (
    <div className="border-y border-white/5 grid grid-cols-2 md:grid-cols-4">
      {STATS.map((s, i) => (
        <div
          key={s.label}
          className={`py-8 px-6 text-center ${
            i < STATS.length - 1 ? "border-r border-white/5" : ""
          }`}
        >
          <span className="font-display text-3xl md:text-4xl font-light text-gold block mb-1">
            {s.num}
          </span>
          <span className="text-[10px] tracking-[0.16em] uppercase text-white/40 font-body">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
