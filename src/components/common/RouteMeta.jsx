import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DEFAULT_META = {
  title: "Danvion Ltd.",
  description:
    "Danvion Ltd. delivers hardware design, embedded systems, and edge AI engineering solutions.",
  type: "website",
  indexable: true,
  image: "/logo.png",
};

const ROUTE_META = [
  {
    match: (pathname) => pathname === "/",
    title: "Danvion Ltd. | Home",
    description:
      "Danvion Ltd. builds intelligent products with hardware design, firmware, and edge AI engineering.",
    type: "website",
    indexable: true,
    image: "/logo.png",
  },
  {
    match: (pathname) => pathname.startsWith("/products"),
    title: "Danvion Ltd. | Products",
    description:
      "Explore Danvion products and engineering capabilities across embedded systems and edge AI.",
    type: "website",
    indexable: true,
    image: "/logo.png",
  },
  {
    match: (pathname) => pathname.startsWith("/blogs"),
    title: "Danvion Ltd. | Blogs",
    description:
      "Read Danvion insights on hardware, firmware, product engineering, and AI deployment.",
    type: "article",
    indexable: true,
    image: "/logo.png",
  },
  {
    match: (pathname) => pathname.startsWith("/admin/login"),
    title: "Danvion Ltd. | Admin Login",
    description: "Secure login for Danvion admin dashboard.",
    type: "website",
    indexable: false,
    image: "/logo.png",
  },
  {
    match: (pathname) => pathname.startsWith("/admin"),
    title: "Danvion Ltd. | Admin Dashboard",
    description: "Content management dashboard for Danvion website administrators.",
    type: "website",
    indexable: false,
    image: "/logo.png",
  },
];

function upsertMeta(selector, attrs) {
  let tag = document.head.querySelector(selector);

  if (!tag) {
    tag = document.createElement("meta");
    document.head.appendChild(tag);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    tag.setAttribute(key, value);
  });
}

function upsertCanonical(url) {
  let tag = document.head.querySelector('link[rel="canonical"]');

  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }

  tag.setAttribute("href", url);
}

export default function RouteMeta() {
  const location = useLocation();

  useEffect(() => {
    const routeMeta =
      ROUTE_META.find((entry) => entry.match(location.pathname)) || DEFAULT_META;

    const canonicalUrl = `${window.location.origin}${location.pathname}`;
    const pageUrl = `${canonicalUrl}${location.search}`;
    const imageUrl = routeMeta.image.startsWith("http")
      ? routeMeta.image
      : `${window.location.origin}${routeMeta.image}`;

    document.title = routeMeta.title;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: routeMeta.description,
    });

    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: routeMeta.indexable ? "index,follow" : "noindex,nofollow",
    });

    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: routeMeta.title,
    });

    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: routeMeta.description,
    });

    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: routeMeta.type,
    });

    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: pageUrl,
    });

    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: "Danvion Ltd.",
    });

    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: imageUrl,
    });

    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });

    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: routeMeta.title,
    });

    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: routeMeta.description,
    });

    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: imageUrl,
    });

    upsertCanonical(canonicalUrl);
  }, [location.pathname, location.search]);

  return null;
}
