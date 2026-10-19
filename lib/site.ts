// Single source of truth for the facts search engines and AI assistants read:
// page metadata, JSON-LD, robots/sitemap, /llms.txt and the FAQ section.

export const siteUrl = "https://www.thaus.co";
export const siteName = "Thaus";

export const siteTitle =
  "Thaus | Websites, automation and AI systems for service businesses";

export const siteDescription =
  "Thaus is a digital product studio that builds complete business systems for clinics, med spas, agencies and other service businesses: a custom website, booking and contact automation, CRM, newsletter and AI chat, built with Next.js, n8n and Claude and documented in public.";

export const siteKeywords = [
  "business system",
  "website with automation",
  "small business automation",
  "n8n automation agency",
  "n8n workflows",
  "AI chatbot for website",
  "CRM automation",
  "booking automation",
  "med spa website",
  "clinic website",
  "Next.js developer",
  "web design for service businesses",
];

export const socialLinks = {
  instagram: "https://instagram.com/thaus.co",
  tiktok: "https://tiktok.com/@thaus.co",
  github: "https://github.com/thaus-co",
};

export const services = [
  {
    name: "Free templates and examples",
    description:
      "Checklists, n8n workflow templates and build documentation from real projects, published on GitHub.",
  },
  {
    name: "Website template with automation",
    description:
      "A ready-made website template plus the n8n automation workflow and setup guide behind it, for self-install.",
  },
  {
    name: "Starter Kit",
    description:
      "A complete, ready-to-deploy system: website build, core contact and notification automation, deployment and handoff documentation.",
  },
  {
    name: "Custom business system",
    description:
      "A fully custom website with a complete automation suite (forms, booking, reminders, CRM, newsletter), deployment, domain setup and a documented build process.",
  },
];

export const faqs = [
  {
    q: "What exactly do you build?",
    a: "A complete business system: website, automation (email, CRM, reminders, newsletter), and the infrastructure behind it. Not just a landing page.",
  },
  {
    q: "Who is Thaus for?",
    a: "Local and service businesses that want one connected system instead of five disconnected tools: clinics, med spas, agencies, real estate and more. If you're not sure it fits, just ask.",
  },
  {
    q: "How long does a project take?",
    a: "Most complete systems take 2 to 4 weeks from brief to launch, documented the whole way.",
  },
  {
    q: "What's included in the automation side?",
    a: "Contact forms, booking flows, confirmation emails, reminders, lead databases, and newsletter systems, wired together with tools like n8n and Notion instead of bolted on separately.",
  },
  {
    q: "Can you add an AI chat assistant to my website?",
    a: "Yes. The chat assistant on this site is an example: it runs on Claude through an n8n AI agent, answers from a knowledge base you can edit in Notion, captures leads and is rate-limited so it can't run up costs. The same setup can be built for your business.",
  },
  {
    q: "What technology do you use?",
    a: "Next.js, TypeScript and Tailwind CSS for the website, n8n for automation, Notion as a lightweight CRM and content source, Claude for AI features, and Vercel for hosting.",
  },
  {
    q: "Can I see real examples?",
    a: "Yes. Every project is documented in public. Check the Work section above, the workflows on GitHub, or follow the Build Log newsletter.",
  },
  {
    q: "What does it cost?",
    a: "Every project is scoped individually, depending on what you need built. See the Services section above for the options, then get in touch for a quote.",
  },
];
