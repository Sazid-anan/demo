import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useResponsive } from "../../hooks/useResponsive";

// Constants
const SCROLL_THRESHOLD = {
  MOBILE: 200,
  DESKTOP: 300,
};

/**
 * Back to Top Button
 * Smooth scroll to top with fade in/out on scroll
 * Responsive: Smaller size and different position on mobile
 */
export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { isMobile } = useResponsive();

  const toggleVisibility = () => {
    // Show button earlier on mobile (200px) vs desktop (300px)
    const threshold = isMobile ? SCROLL_THRESHOLD.MOBILE : SCROLL_THRESHOLD.DESKTOP;
    if (window.scrollY > threshold) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: isMobile ? 0.2 : 0.3 }} // Faster on mobile
          onClick={scrollToTop}
          className={`
            fixed z-40 bg-brand-orange/80 backdrop-blur-lg text-brand-black rounded-full 
            shadow-lg hover:shadow-xl hover:bg-brand-orange/90 flex items-center justify-center 
            font-bold orange-pop-hover transition-all border border-white/20
            ${isMobile ? "bottom-20 right-4 w-10 h-10 text-[20px]" : "bottom-8 right-8 w-12 h-12 text-[24px]"}
          `}
          title="Back to top"
          aria-label="Scroll back to top of page"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}
