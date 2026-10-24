export interface PortfolioItem {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  // Omit until the screenshot exists in /public/portfolio; the card shows a
  // placeholder instead.
  thumbnail?: string;
  status: "Live" | "Demo" | "In progress";
}

// TODO(zynnth): add a real screenshot at /public/portfolio/zynnth.png once
// the site is ready to show.
export const portfolioItems: PortfolioItem[] = [
  {
    id: "zynnth",
    title: "Zynnth",
    url: "https://zynnth.com",
    description:
      "A site for an AI video ad agency that sells without a single sales call. Visitors watch sample ads, compare flat package prices and get every common question answered on the page, then pick a package and send a brief in under five minutes. The owner gets a ready-to-start order instead of a discovery call, and every newsletter sign-up gets a welcome email automatically.",
    tags: ["Web", "AI Video", "E-commerce"],
    thumbnail: "/portfolio/zynnth.png",
    status: "Live",
  },
  {
    id: "velure",
    title: "Velure Med Spa",
    url: "https://velure-medspa.vercel.app",
    description:
      "A med spa site that runs the front desk by itself. Clients book online and get a confirmation, a reminder before the visit and a review request after it. Every enquiry gets an instant reply and lands in your CRM, an AI assistant answers questions day and night, and the weekly newsletter writes itself.",
    tags: ["Booking", "n8n", "AI Chat", "CRM"],
    thumbnail: "/portfolio/velure.png",
    status: "Demo",
  },
  {
    id: "glossworks",
    title: "GlossWorks Detail Studio",
    url: "https://glossworks-detailing-sigma.vercel.app",
    description:
      "A detailing studio site that sells without the phone. Customers pick a package, add-ons and a time slot in a six-step booking flow, buy gift vouchers and send custom requests with photos. Each feature shows the automation behind it: booking confirmations and reminders, voucher codes, review requests and an instant reply to every enquiry.",
    tags: ["Booking", "Vouchers", "Reviews", "AI Chat"],
    thumbnail: "/portfolio/glossworks.png",
    status: "Demo",
  },
  {
    id: "halden-stone",
    title: "Halden & Stone",
    url: "https://halden-stone.vercel.app",
    description:
      "A design-build studio site made to turn high-value visitors into booked calls. An animated floor plan walks you through a finished home, buyers browse homes for sale and book private viewings, and future owners pick a call slot or send plans and photos for a quote. Each feature shows the automation behind it: calendar booking with text reminders, inquiry triage, a double opt-in newsletter and review requests after handover.",
    tags: ["Booking", "Lead intake", "Listings", "AI Chat"],
    thumbnail: "/portfolio/halden-stone.png",
    status: "Demo",
  },
];
