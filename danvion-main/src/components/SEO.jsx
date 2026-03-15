import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";

const SEO = ({
  title,
  description,
  image,
  url,
  keywords,
  structuredData,
  author,
  publishedDate,
  modifiedDate,
  pageType = "website",
  breadcrumbs = [],
}) => {
  const fullTitle = title
    ? `${title} | Danvion`
    : "Danvion - Edge AI Solutions";
  const baseUrl = "https://danvion.com";
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const defaultImage = image || `${baseUrl}/og-image.png`;

  // Default Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Danvion",
    url: baseUrl,
    logo: `${baseUrl}/logo-optimized.png`,
    description:
      "Leading provider of Edge AI solutions and product development services",
    sameAs: ["https://www.linkedin.com/company/danvion"],
    contact: {
      "@type": "ContactPoint",
      url: `${baseUrl}/contact`,
      telephone: "+44-20-XXXX-XXXX",
      contactType: "Customer Support",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "128 City Road",
      addressLocality: "London",
      addressRegion: "EC1V 2NX",
      postalCode: "EC1V 2NX",
      addressCountry: "GB",
    },
  };

  // WebSite Schema with search action
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: baseUrl,
    name: "Danvion",
    description: "Edge AI Solutions & Product Development",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      query_input: "required name=search_term_string",
    },
  };

  // Breadcrumb Schema for navigation
  const getBreadcrumbSchema = () => {
    if (breadcrumbs.length === 0) {
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: baseUrl,
          },
        ],
      };
    }

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    };
  };

  // Article/BlogPosting Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: defaultImage,
    author: {
      "@type": "Organization",
      name: "Danvion",
    },
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
  };

  const getFinalSchemas = () => {
    const schemas = [organizationSchema, websiteSchema, getBreadcrumbSchema()];

    if (structuredData) {
      schemas.push(structuredData);
    } else if (pageType === "article") {
      schemas.push(articleSchema);
    }

    return schemas;
  };

  return (
    <Helmet>
      <html lang="en" />
      <title>{fullTitle}</title>

      {/* Basic Meta Tags */}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      {url && <link rel="canonical" href={fullUrl} />}

      {/* Open Graph Tags */}
      <meta property="og:site_name" content="Danvion" />
      <meta property="og:type" content={pageType} />
      {fullUrl && <meta property="og:url" content={fullUrl} />}
      {fullTitle && <meta property="og:title" content={fullTitle} />}
      {description && <meta property="og:description" content={description} />}
      {defaultImage && <meta property="og:image" content={defaultImage} />}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      {fullTitle && <meta name="twitter:title" content={fullTitle} />}
      {description && <meta name="twitter:description" content={description} />}
      {defaultImage && <meta name="twitter:image" content={defaultImage} />}

      {/* Additional SEO Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />

      {/* Structured Data (JSON-LD) - Multiple schemas for comprehensive SEO */}
      {getFinalSchemas().map((schema, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  structuredData: PropTypes.object,
  author: PropTypes.string,
  publishedDate: PropTypes.string,
  modifiedDate: PropTypes.string,
  pageType: PropTypes.oneOf(["website", "article", "product"]),
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ),
};

SEO.defaultProps = {
  pageType: "website",
  breadcrumbs: [],
};

export default SEO;
