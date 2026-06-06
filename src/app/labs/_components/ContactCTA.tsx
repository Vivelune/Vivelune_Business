export default function ContactCTA() {
  return (
    <>
      {/* CTA */}
      <section
        id="contact"
        className="py-32 border-t border-white/5 relative overflow-hidden text-center px-6"
      >
        {/* Subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(201,169,110,0.05)_0%,transparent_70%)] pointer-events-none" />

        <p className="text-[#c9a96e] text-xs tracking-[0.24em] uppercase font-body mb-5">Ready to begin?</p>
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light leading-tight mb-6 max-w-4xl mx-auto">
          Start your <em className="not-italic text-[#c9a96e]">journey</em>
          <br />
          this week
        </h2>
        <p className="text-white/35 font-body text-sm max-w-md mx-auto leading-relaxed mb-10">
          Reach out directly and we will match you with the right instructor and have your first session scheduled within 24 hours.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a
            href="mailto:hello@vivelune.com?subject=I want to enrol at ViveLune Labs"
            className="bg-[#c9a96e] hover:bg-[#e8c98a] text-black text-xs tracking-widest uppercase font-medium px-10 py-4 transition-all duration-300 hover:-translate-y-1 font-body"
          >
            Send a Message
          </a>
          <a
            href="mailto:hello@vivelune.com"
            className="border border-white/15 hover:border-white/35 text-white/40 hover:text-white text-xs tracking-widest uppercase px-10 py-4 transition-all duration-300 font-body font-light"
          >
            hello@vivelune.com
          </a>
        </div>

        {/* Contact details */}
        <div className="flex flex-col items-center gap-2 text-xs font-body text-white/20 tracking-wide">
          <span>
            General enquiries:{" "}
            <a href="mailto:hello@vivelune.com" className="text-[#c9a96e]/60 hover:text-[#c9a96e] transition-colors duration-200">
              hello@vivelune.com
            </a>
          </span>
          <span>
            Professional:{" "}
            <a href="mailto:atifshafique@vivelune.com" className="text-[#c9a96e]/60 hover:text-[#c9a96e] transition-colors duration-200">
              atifshafique@vivelune.com
            </a>
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="font-display text-sm font-semibold tracking-tight text-white">
            Vive<span className="text-[#c9a96e]">Lune</span>{" "}
            <span className="text-white/25 font-light">Labs</span>
          </span>
          <span className="text-white/15 font-body text-xs tracking-wide">
            © {new Date().getFullYear()} ViveLune Labs · Wyoming, USA · All rights reserved
          </span>
        </div>
      </footer>
    </>
  );
}
