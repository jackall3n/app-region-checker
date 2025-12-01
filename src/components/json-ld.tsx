import type { AppStoreApp } from "~/lib/types";

interface WebsiteJsonLdProps {
  url: string;
  name: string;
  description: string;
}

export function WebsiteJsonLd({ url, name, description }: WebsiteJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    description,
    url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/{app_id}`,
      },
      "query-input": "required name=app_id",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface AppJsonLdProps {
  app: AppStoreApp;
  pageUrl: string;
}

export function AppJsonLd({ app, pageUrl }: AppJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.trackName,
    description: app.description?.slice(0, 200),
    applicationCategory: app.primaryGenreName,
    operatingSystem: "iOS, macOS",
    offers: {
      "@type": "Offer",
      price: app.price,
      priceCurrency: app.currency,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: app.userRatingCount > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: app.averageUserRating,
          ratingCount: app.userRatingCount,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    author: {
      "@type": "Organization",
      name: app.artistName,
      url: app.artistViewUrl,
    },
    image: app.artworkUrl512,
    url: pageUrl,
    datePublished: app.releaseDate,
    softwareVersion: app.version,
    contentRating: app.contentAdvisoryRating,
  };

  // Remove undefined fields
  const cleanedJsonLd = JSON.parse(JSON.stringify(jsonLd));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanedJsonLd) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface FAQJsonLdProps {
  faqs: Array<{ question: string; answer: string }>;
}

export function FAQJsonLd({ faqs }: FAQJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
