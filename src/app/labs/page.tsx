import ContactCTA from "./_components/ContactCTA";
import Hero from "./_components/Hero";
import Method from "./_components/Method";
import Navbar from "./_components/Navbar";
import Pricing from "./_components/Pricing";
import StatsBar from "./_components/StatsBar";
import Subjects from "./_components/Subjects";

export default function LandingPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar/>
      <Hero />
      <StatsBar />
      <Subjects />
      <Method />
      <Pricing />
      <ContactCTA />
    </main>
  );
}
