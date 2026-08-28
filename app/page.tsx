import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { TechStackStrip } from "@/components/TechStackStrip";
import { HowItWorks } from "@/components/HowItWorks";
import { Portfolio } from "@/components/Portfolio";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <Hero />
        <TechStackStrip />
        {/* About temporarily hidden — component kept in components/About.tsx.
            To restore: re-add the import and render <About /> here. */}
        <HowItWorks />
        <Portfolio />
        <Pricing />
        <FAQ />
        <Contact />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
