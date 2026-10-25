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
    name: "Blueprint",
    description:
      "Free: the build document behind a Thaus system (stack, architecture, process) plus a ready-made n8n newsletter signup workflow.",
  },
  {
    name: "Foundation",
    description:
      "A custom website (one page or up to 5 pages) with contact form automation and newsletter signup, domain, SSL, basic SEO and analytics, hosted and monitored. Launch price $990 one-time plus $29/month hosting.",
  },
  {
    name: "Full Haus",
    description:
      "Everything in Foundation plus a welcome email, a weekly AI-written newsletter, booking or business-specific automation, an AI chat assistant, monthly reports and ongoing maintenance. $1,490 setup plus $249/month.",
  },
  {
    name: "Custom",
    description:
      "Hosting on your own infrastructure, weekly reporting, SLA, integrations (CRM, payments, calendars) and multiple AI agents. Projects from $3,000.",
  },
];

export const faqs = [
  {
    q: "What exactly do you build?",
    a: "A complete business system: website, automation (email, CRM, reminders, newsletter), and the infrastructure behind it. Not just a landing page.",
  },
  {
    q: "Who is Thaus for?",
    a: "Service businesses that already get enquiries and lose some of them to slow replies, missed calls or forgotten follow-ups: clinics, med spas, agencies, real estate and similar. If you don't have steady enquiries yet, a system won't fix that, and I'll tell you so on the first call. Start with the free Blueprint instead.",
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
    a: "Blueprint is free. Foundation is a one-time build (launch price $990) plus $29/month hosting. Full Haus is $1,490 setup plus $249/month, including maintenance, AI and monthly reports. Bigger projects start at $3,000. See Pricing above.",
  },
  {
    q: "Where is my website hosted?",
    a: "Foundation and Full Haus run on Thaus infrastructure (Vercel and our automation server), monitored and kept up to date. If you need everything on your own servers, that's the Custom plan.",
  },
  {
    q: "Do I own my website?",
    a: "Yes. Your domain is always yours, and after full payment you own your site's content, design and code. If you ever leave, you get your code and an export of your automations.",
  },
  {
    q: "Can I cancel Full Haus?",
    a: "After the 3-month minimum it's month-to-month with 30 days' notice.",
  },
];
