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
 * Header Component (NEW DESIGN)
 * Orange background with white navigation
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

// Button style constants
const BUTTON_CLASSES =
  "px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-white text-sm sm:text-base md:text-lg lg:text-xl hover:bg-orange-800 transition-all whitespace-nowrap";

export default function Header() {
  const location = useLocation();
  const { isMobile } = useResponsive();
  const [showSolutions, setShowSolutions] = useState(false);

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
        className="sticky top-0 z-50 bg-orange-700 shadow-lg transition-shadow duration-300"
      >
        <div className="w-full flex justify-center">
          <div className="w-full max-w-7xl px-2 sm:px-3 md:px-4 lg:px-6">
            <div className="flex justify-between items-center h-14 sm:h-16 md:h-18 lg:h-20">
              {/* Logo */}
              <Link
                to="/"
                className="flex items-center gap-1 sm:gap-2 md:gap-2 shrink-0"
                onClick={(e) => handleNavClick({ path: PAGE_ROUTES.HOME }, e)}
              >
                <motion.picture
                  whileHover={!isMobile ? { scale: 1.1, rotate: 5 } : {}}
                  transition={{ duration: 0.3 }}
                  className="h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 bg-white rounded-lg p-0.5 sm:p-1 block"
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
                  whileHover={{ scale: 1.08 }}
                  className="font-black text-white text-sm sm:text-lg md:text-2xl lg:text-3xl tracking-tight"
                >
                  {HEADER_CONFIG.COMPANY_NAME}
                </motion.div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden sm:flex items-center gap-0.5 sm:gap-1 md:gap-2 lg:gap-4">
                <nav
                  className="flex items-center gap-0.5 sm:gap-1 md:gap-2"
                  aria-label="Main navigation"
                >
                  {NAVIGATION_ITEMS.map((item) =>
                    item.isSpecial && item.label === "Solutions" ? (
                      // Solutions Button (Toggle)
                      <motion.button
                        key={item.label}
                        onClick={handleSolutionsClick}
                        whileHover={{ scale: 1.05 }}
                        aria-expanded={showSolutions}
                        aria-haspopup="true"
                        className={`header-solutions-btn ${BUTTON_CLASSES} flex items-center gap-0.5 sm:gap-1 ${showSolutions ? "bg-orange-800" : ""}`}
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
                          className={BUTTON_CLASSES}
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
        isVisible={showSolutions}
        onClose={() => setShowSolutions(false)}
      />
    </>
  );
}
