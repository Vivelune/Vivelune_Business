export default function ContactCTA() {
  return (
    <>
      {/* CTA */}
      <section
        id="contact"
        className="py-32 border-t border-white/8 relative overflow-hidden text-center px-6 bg-grid-tactical"
      >
        {/* Subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[radial-gradient(ellipse,rgba(255,59,78,0.08)_0%,transparent_70%)] pointer-events-none" />

        {/* Reticle brackets */}
        <div className="absolute top-16 left-8 w-8 h-8 border-l-2 border-t-2 border-accent/40 pointer-events-none" />
        <div className="absolute top-16 right-8 w-8 h-8 border-r-2 border-t-2 border-accent/40 pointer-events-none" />

        <p className="font-data text-accent text-[11px] tracking-[0.3em] uppercase mb-5 flex items-center justify-center gap-2">
          <span className="w-6 h-px bg-accent" /> Ready to begin? <span className="w-6 h-px bg-accent" />
        </p>
        <h2 className="font-display text-6xl md:text-8xl lg:text-9xl font-semibold leading-[0.92] mb-6 max-w-4xl mx-auto uppercase">
          Start your <span className="text-accent">journey</span>
          <br />
          this week
        </h2>
        <p className="text-white/40 font-body text-sm max-w-md mx-auto leading-relaxed mb-10">
          Reach out directly and we will match you with the right instructor and have your first session scheduled within 24 hours.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a
            href="mailto:hello@vivelune.com?subject=I want to enrol at ViveLune Labs"
            className="notch bg-accent hover:bg-[#e8c98a] text-white text-xs tracking-[0.2em] uppercase font-semibold px-10 py-4 transition-colors duration-200 font-body"
          >
            Send a Message
          </a>
          <a
            href="mailto:hello@vivelune.com"
            className="notch border border-white/15 hover:border-white/35 text-white/45 hover:text-white text-xs tracking-[0.2em] uppercase px-10 py-4 transition-all duration-200 font-body font-medium"
          >
            hello@vivelune.com
          </a>
        </div>

        {/* Contact details */}
        <div className="flex flex-col items-center gap-2 text-xs font-data text-white/25 tracking-wide">
          <span>
            General enquiries:{" "}
            <a
              href="mailto:hello@vivelune.com"
              className="text-accent/70 hover:text-accent transition-colors duration-200"
            >
              hello@vivelune.com
            </a>
          </span>
          <span>
            Professional:{" "}
            <a
              href="mailto:atifshafique@vivelune.com"
              className="text-accent/70 hover:text-accent transition-colors duration-200"
            >
              atifshafique@vivelune.com
            </a>
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-6 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="font-display text-lg font-semibold tracking-tight text-white uppercase">
            Vive<span className="text-accent">Lune</span>{" "}
            <span className="text-white/25 font-normal">Labs</span>
          </span>
          <span className="text-white/20 font-data text-[11px] tracking-wide">
            © {new Date().getFullYear()} ViveLune Labs · Wyoming, USA · All rights reserved
          </span>
        </div>
      </footer>
    </>
  );
}