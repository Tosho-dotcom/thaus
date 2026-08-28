import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { fadeUp } from "@/lib/motion";

const tools = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "n8n",
  "Notion",
  "Vercel",
  "GitHub",
  "Claude Code",
];

/**
 * Compact credibility strip directly under the hero. Text-only by design —
 * no logo assets, no marquee — to stay flat and calm like the rest of the site.
 */
export function TechStackStrip() {
  return (
    <Section
      id="tech-stack"
      className="border-y border-line py-8 md:py-10 lg:py-10"
    >
      <Reveal variants={fadeUp} amount={0.4}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <p className="label shrink-0">Built with</p>

          <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 lg:gap-x-4">
            {tools.map((tool, index) => (
              <li key={tool} className="flex items-center gap-x-3 lg:gap-x-4">
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-dim transition-colors duration-200 hover:text-accent">
                  {tool}
                </span>
                {index < tools.length - 1 && (
                  <span aria-hidden className="font-mono text-xs text-line">
                    /
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-4 font-mono text-[0.72rem] tracking-[0.02em] text-dim/70">
          Strategy, content, and automation logic built with Claude.
        </p>
      </Reveal>
    </Section>
  );
}
