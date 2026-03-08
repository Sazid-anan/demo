import { useState, useEffect } from "react";

export function useResponsive() {
  const [windowSize, setWindowSize] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  }));

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Device type detection - synced with Tailwind breakpoints
  const isMobile = windowSize.width < 640; // Mobile: <640px
  const isTablet = windowSize.width >= 640 && windowSize.width < 1024; // sm-md: 640px-1023px
  const isDesktop = windowSize.width >= 1024; // lg+: 1024px+

  // Precise breakpoint detection - synced with Tailwind config
  const getBreakpoint = () => {
    if (windowSize.width < 640) return "xs"; // Mobile
    if (windowSize.width < 768) return "sm"; // Tablet start
    if (windowSize.width < 1024) return "md"; // Tablet mid
    return "lg"; // Desktop and up
  };

  return {
    isMobile,
    isTablet,
    isDesktop,
    width: windowSize.width,
    height: windowSize.height,
    breakpoint: getBreakpoint(),
  };
}

/**
 * useMediaQuery Hook
 * Custom media query hook for specific breakpoints
 *
 * @param {string} query - Media query string (e.g., '(min-width: 768px)')
 * @returns {boolean} - Whether the media query matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => (typeof window !== "undefined" ? window.matchMedia(query).matches : false));

  useEffect(() => {
    const media = window.matchMedia(query);


    // Define listener
    const listener = (e) => setMatches(e.matches);

    // Add listener
    if (media.addEventListener) {
      media.addEventListener("change", listener);
    } else {
      media.addListener(listener); // Fallback for older browsers
    }

    // Cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}

export default useResponsive;
