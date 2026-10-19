export interface PortfolioItem {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  thumbnail: string;
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
      "AI-generated video ads and UGC content for e-commerce brands, delivered in days instead of weeks.",
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
];
