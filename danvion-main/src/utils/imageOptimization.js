export const generateResponsiveSources = (basePath, breakpoints = [320, 640, 1024, 1440]) => {
  const webpSrcset = breakpoints.map((bp) => `${basePath}-${bp}w.webp ${bp}w`).join(", ");

  const jpgSrcset = breakpoints.map((bp) => `${basePath}-${bp}w.jpg ${bp}w`).join(", ");

  return {
    webp: webpSrcset,
    jpg: jpgSrcset,
    sizes: "(max-width: 320px) 100vw, (max-width: 640px) 90vw, (max-width: 1024px) 80vw, 70vw",
  };
};

export const generateSizesAttribute = (layout = "full-width") => {
  const layouts = {
    hero: "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1440px",
    card: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
    thumbnail: "(max-width: 640px) 80px, 120px",
    "full-width": "100vw",
  };
  return layouts[layout] || layouts["full-width"];
};

export const getPlaceholderDataUrl = (color = "#e5e7eb") => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Crect fill='${encodeURIComponent(
    color,
  )}' width='10' height='10'/%3E%3C/svg%3E`;
};

export const isWebPSupported = () => {
  if (typeof window === "undefined") return false;

  const canvas = document.createElement("canvas");
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      return canvas.toDataURL("image/webp").indexOf("image/webp") === 5;
    }
  }
  return false;
};

export const calculateAspectRatio = (width, height) => {
  if (!width || !height) return "56.25%"; // Default 16:9
  return `${(height / width) * 100}%`;
};

export const getBlurHashStyle = (width, height) => {
  const ratio = height && width ? (height / width) * 100 : 56.25;
  return {
    position: "relative",
    overflow: "hidden",
    paddingBottom: `${ratio}%`,
  };
};

export const preloadCriticalImages = (imagePaths) => {
  if (typeof document === "undefined") return;

  imagePaths.forEach((path) => {
    if (!path) return;

    // Preload both WebP and fallback
    const linkWebP = document.createElement("link");
    linkWebP.rel = "preload";
    linkWebP.as = "image";
    linkWebP.href = path.replace(/\.\w+$/, ".webp");
    linkWebP.type = "image/webp";
    document.head.appendChild(linkWebP);

    const linkFallback = document.createElement("link");
    linkFallback.rel = "preload";
    linkFallback.as = "image";
    linkFallback.href = path;
    document.head.appendChild(linkFallback);
  });
};

export const hasNativeLazyLoad = () => {
  return "loading" in HTMLImageElement.prototype;
};

export const getOptimalImageFormat = () => {
  if (typeof window === "undefined") return "jpg";
  return isWebPSupported() ? "webp" : "jpg";
};
