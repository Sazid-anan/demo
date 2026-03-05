/**
 * Schema.org Structured Data Generator
 * Helper functions for creating JSON-LD schemas for SEO
 */

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Danvion Ltd",
  url: "https://danvion.com",
  logo: "https://danvion.com/logo.png",
  description: "Digital solutions and IT services company specializing in web development, mobile apps, and technology consulting.",
  sameAs: [
    "https://www.facebook.com/danvion",
    "https://www.linkedin.com/company/danvion",
    "https://twitter.com/danvion",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    email: "contact@danvion.com",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "100",
  },
};

export const breadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const productSchema = (product) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  image: product.image,
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
  },
});

export const articleSchema = (article) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: article.title,
  description: article.description,
  image: article.image,
  datePublished: article.publishedDate,
  dateModified: article.modifiedDate || article.publishedDate,
  author: {
    "@type": "Person",
    name: article.author,
  },
});

export const faqSchema = (faqs) => ({
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
});

export const localBusinessSchema = (business) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: business.name || "Danvion Ltd",
  description: business.description || "Digital solutions and IT services",
  url: business.url || "https://danvion.com",
  image: business.image || "https://danvion.com/logo.png",
  telephone: business.phone,
  address: {
    "@type": "PostalAddress",
    addressCountry: business.country,
    addressRegion: business.region,
    addressLocality: business.city,
  },
  areaServed: business.areaServed || "Worldwide",
  priceRange: business.priceRange,
});

export const serviceSchema = (service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.name,
  description: service.description,
  provider: {
    "@type": "Organization",
    name: "Danvion Ltd",
    url: "https://danvion.com",
  },
  areaServed: service.areaServed || "Worldwide",
});
