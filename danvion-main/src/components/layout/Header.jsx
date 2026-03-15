import { Link, useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useResponsive } from "../../hooks/useResponsive";
import { useState } from "react";
import SolutionsDropdown from "../SolutionsDropdown";
import { PAGE_ROUTES } from "../../config/routes";
import { HEADER_CONFIG } from "../../config/links";

/**
 * Header Component
 * Dark charcoal background with orange accent states
 * Desktop navigation with dropdown menus
 * Mobile uses bottom navigation bar
 */

// Navigation items configuration
const NAVIGATION_ITEMS = [
  { label: "Home", path: PAGE_ROUTES.HOME, isSpecial: false },
  { label: "Solutions", path: null, isSpecial: true }, // Solutions dropdown
  { label: "Products", path: PAGE_ROUTES.PRODUCTS, isSpecial: false },
  { label: "Blogs", path: PAGE_ROUTES.BLOGS, isSpecial: false },
  {
    label: "Contact",
    path: "/",
    isScroll: true,
    scrollTo: HEADER_CONFIG.CONTACT_SECTION_ID,
    isSpecial: false,
  },
];

// Button style constants - Optimized responsive sizing
const BUTTON_CLASSES =
  "px-2.5 sm:px-3 md:px-4 lg:px-5 py-1.5 sm:py-2 rounded-lg font-medium text-white text-xs sm:text-sm md:text-base lg:text-base border border-transparent transition-all whitespace-nowrap";

export default function Header() {
  const location = useLocation();
  const { isMobile } = useResponsive();
  const [showSolutions, setShowSolutions] = useState(false);
  const canUseSolutionsDropdown = !isMobile;

  const handleSolutionsClick = (e) => {
    e.preventDefault();
    setShowSolutions(!showSolutions);
  };

  const handleNavClick = (item, e) => {
    setShowSolutions(false);

    if (item.isScroll) {
      e.preventDefault();
      if (location.pathname === "/") {
        const scrollElement = document.getElementById(item.scrollTo);
        if (scrollElement) {
          scrollElement.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        window.location.href = `/#${item.scrollTo}`;
      }
    } else if (item.path === PAGE_ROUTES.HOME) {
      e.preventDefault();
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.location.href = "/";
      }
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-(--surface-strong) shadow-lg transition-shadow duration-300 border-b border-white/10"
      >
        <div className="w-full flex justify-center">
          <div className="w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="flex justify-between items-center h-12 sm:h-14 md:h-16 lg:h-16">
              {/* Logo */}
              <Link
                to="/"
                className="flex items-center gap-2 sm:gap-3 shrink-0"
                onClick={(e) => handleNavClick({ path: PAGE_ROUTES.HOME }, e)}
              >
                <motion.picture
                  whileHover={!isMobile ? { scale: 1.1, rotate: 5 } : {}}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center shrink-0 h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-10 lg:w-10 bg-white rounded-lg p-1"
                >
                  <source srcSet={HEADER_CONFIG.LOGO_PATH} type="image/webp" />
                  <img
                    src={HEADER_CONFIG.LOGO_FALLBACK}
                    alt={HEADER_CONFIG.LOGO_ALT}
                    width="48"
                    height="48"
                    className="h-full w-full object-contain"
                  />
                </motion.picture>
                <motion.div
                  whileHover={!isMobile ? { scale: 1.05 } : {}}
                  className="font-black text-white text-sm sm:text-lg md:text-xl lg:text-xl tracking-tight leading-none"
                >
                  {HEADER_CONFIG.COMPANY_NAME}
                </motion.div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1.5 md:gap-2 lg:gap-3">
                <nav
                  className="flex items-center gap-1 md:gap-1.5 lg:gap-2"
                  aria-label="Main navigation"
                >
                  {NAVIGATION_ITEMS.map((item) =>
                    item.isSpecial &&
                    item.label === "Solutions" &&
                    canUseSolutionsDropdown ? (
                      // Solutions Button (Toggle)
                      <motion.button
                        key={item.label}
                        onClick={handleSolutionsClick}
                        whileHover={{ scale: 1.05 }}
                        aria-expanded={showSolutions}
                        aria-haspopup="true"
                        className={`header-solutions-btn ${BUTTON_CLASSES} flex items-center gap-0.5 sm:gap-1 ${showSolutions ? "bg-(--brand) text-white border-(--brand)" : "hover:text-(--brand) hover:border-(--brand)/60"}`}
                      >
                        {item.label}{" "}
                        <ChevronDown
                          className={`w-3 sm:w-4 h-3 sm:h-4 transition-transform ${showSolutions ? "rotate-180" : ""}`}
                        />
                      </motion.button>
                    ) : (
                      // Regular Navigation Links
                      <Link
                        key={item.label}
                        to={item.path || "/"}
                        className="relative group"
                        onClick={(e) => handleNavClick(item, e)}
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className={`${BUTTON_CLASSES} ${location.pathname === item.path ? "text-(--brand) border-(--brand)/70 bg-(--brand)/10" : "hover:text-(--brand) hover:border-(--brand)/60"}`}
                        >
                          {item.label}
                        </motion.div>
                      </Link>
                    ),
                  )}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Solutions Dropdown Section */}
      <SolutionsDropdown
        isVisible={canUseSolutionsDropdown && showSolutions}
        onClose={() => setShowSolutions(false)}
      />
    </>
  );
}
