import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useResponsive } from "../../hooks/useResponsive";
import { useState } from "react";
import SolutionsDropdown from "../SolutionsDropdown";

/**
 * Header Component (NEW DESIGN)
 * Orange background with white navigation
 * Desktop navigation with dropdown menus
 * Mobile uses bottom navigation bar
 */
export default function Header() {
  const location = useLocation();
  const { isMobile, isTablet } = useResponsive();
  const [showSolutions, setShowSolutions] = useState(false);

  const handleSolutionsClick = (e) => {
    e.preventDefault();
    setShowSolutions(!showSolutions);
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-orange-500 shadow-lg transition-shadow duration-300"
      >
        <div className="w-full flex justify-center">
          <div className="w-full max-w-7xl px-2 sm:px-3 md:px-4 lg:px-6">
            <div className="flex justify-between items-center h-14 sm:h-16 md:h-18 lg:h-20">
              {/* Logo */}
              <Link
                to="/"
                className="flex items-center gap-1 sm:gap-2 md:gap-2 flex-shrink-0"
                onClick={(e) => {
                  e.preventDefault();
                  setShowSolutions(false);
                  if (location.pathname === "/") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    window.location.href = "/";
                  }
                }}
              >
                <motion.img
                  src="/logo.png"
                  alt="Danvion Logo"
                  width="40"
                  height="40"
                  className="h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 bg-white rounded-lg p-0.5 sm:p-1"
                  whileHover={!isMobile ? { scale: 1.1, rotate: 5 } : {}}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="font-black text-white text-sm sm:text-lg md:text-2xl lg:text-3xl tracking-tight"
                >
                  Danvion
                </motion.div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden sm:flex items-center gap-0.5 sm:gap-1 md:gap-2 lg:gap-4">
                <nav
                  className="flex items-center gap-0.5 sm:gap-1 md:gap-2"
                  aria-label="Main navigation"
                >
                  {/* Home */}
                  <Link
                    to="/"
                    className="relative group"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowSolutions(false);
                      if (location.pathname === "/") {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      } else {
                        window.location.href = "/";
                      }
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-white text-xs sm:text-sm md:text-base lg:text-lg hover:bg-orange-600 transition-all whitespace-nowrap"
                    >
                      Home
                    </motion.div>
                  </Link>

                  {/* Solutions Button (Toggle) */}
                  <motion.button
                    onClick={handleSolutionsClick}
                    whileHover={{ scale: 1.05 }}
                    aria-expanded={showSolutions}
                    aria-haspopup="true"
                    className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-white text-xs sm:text-sm md:text-base lg:text-lg hover:bg-orange-600 transition-all flex items-center gap-0.5 sm:gap-1 whitespace-nowrap ${showSolutions ? "bg-orange-600" : ""}`}
                  >
                    Solutions{" "}
                    <ChevronDown
                      className={`w-3 sm:w-4 h-3 sm:h-4 transition-transform ${showSolutions ? "rotate-180" : ""}`}
                    />
                  </motion.button>

                  {/* Products */}
                  <Link
                    to="/products"
                    className="relative group"
                    onClick={() => setShowSolutions(false)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-white text-xs sm:text-sm md:text-base lg:text-lg hover:bg-orange-600 transition-all whitespace-nowrap"
                    >
                      Products
                    </motion.div>
                  </Link>

                  {/* Blogs */}
                  <Link
                    to="/blogs"
                    className="relative group"
                    onClick={() => setShowSolutions(false)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-white text-xs sm:text-sm md:text-base lg:text-lg hover:bg-orange-600 transition-all whitespace-nowrap"
                    >
                      Blogs
                    </motion.div>
                  </Link>

                  {/* Contact */}
                  <Link
                    to="/"
                    className="relative group"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowSolutions(false);
                      if (location.pathname === "/") {
                        const contactEl = document.getElementById("contact");
                        if (contactEl) {
                          contactEl.scrollIntoView({ behavior: "smooth" });
                        }
                      } else {
                        window.location.href = "/#contact";
                      }
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-white text-xs sm:text-sm md:text-base lg:text-lg hover:bg-orange-600 transition-all whitespace-nowrap"
                    >
                      Contact
                    </motion.div>
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Solutions Dropdown Section */}
      <SolutionsDropdown isVisible={showSolutions} onClose={() => setShowSolutions(false)} />
    </>
  );
}
