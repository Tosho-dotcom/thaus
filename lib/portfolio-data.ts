export interface PortfolioItem {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  thumbnail: string;
  status: "Live" | "In progress";
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
];
