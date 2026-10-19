import {
  faqs,
  services,
  siteDescription,
  siteName,
  siteUrl,
  socialLinks,
} from "@/lib/site";
import { portfolioItems } from "@/lib/portfolio-data";

const orgId = `${siteUrl}/#organization`;

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": orgId,
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/logo/wordmark_cursor.svg`,
      image: `${siteUrl}/og.png`,
      description: siteDescription,
      slogan: "Complete business systems, built in public.",
      areaServed: "Worldwide",
      knowsAbout: [
        "Web development",
        "Next.js",
        "Business process automation",
        "n8n",
        "CRM automation",
        "Booking automation",
        "Email automation",
        "AI chatbots",
        "Claude",
        "Notion",
      ],
      sameAs: Object.values(socialLinks),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.name,
            description: service.description,
            provider: { "@id": orgId },
          },
        })),
      },
      subjectOf: portfolioItems.map((item) => ({
        "@type": "CreativeWork",
        name: item.title,
        url: item.url,
        description: item.description,
      })),
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: siteDescription,
      inLanguage: "en",
      publisher: { "@id": orgId },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
