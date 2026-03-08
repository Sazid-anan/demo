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
}) => {
  const fullTitle = title ? `${title} | Danvion` : "Danvion - Edge AI Solutions";
  const baseUrl = "https://danvion.com";
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const defaultImage = image || `${baseUrl}/og-image.png`;

  // Default Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Danvion",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: "Leading provider of Edge AI solutions and product development services",
    sameAs: ["https://www.linkedin.com/company/danvion"],
    contact: {
      "@type": "ContactPoint",
      url: `${baseUrl}/contact`,
    },
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

  const getFinalSchema = () => {
    if (structuredData) return structuredData;
    if (pageType === "article") return articleSchema;
    return organizationSchema;
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
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">{JSON.stringify(getFinalSchema())}</script>
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
};

SEO.defaultProps = {
  pageType: "website",
};

export default SEO;
