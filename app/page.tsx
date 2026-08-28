import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { TechStackStrip } from "@/components/TechStackStrip";
import { About } from "@/components/About";
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
        <About />
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
