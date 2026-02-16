import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

/**
 * Header Component
 * Main navigation for the website
 * Responsive with mobile menu
 */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "#contact", label: "Contact" },
    { path: "/products", label: "Products" },
    { path: "/blogs", label: "Blogs" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1280px] px-4">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-1.5 sm:gap-2"
              onClick={(e) => {
                e.preventDefault();
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
                className="h-6 w-6 sm:h-10 sm:w-10"
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -10, 10, -10, 0],
                }}
                transition={{
                  scale: { duration: 0.2 },
                  rotate: { duration: 0.6 },
                }}
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="font-bold text-brand-black text-[10px] sm:text-[14px] md:text-[16px] lg:text-[20px]"
              >
                DANVION
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 lg:gap-8">
              <nav className="flex gap-1 sm:gap-2">
                {navLinks.map((link) => {
                  if (link.label === "Home") {
                    return (
                      <a
                        key={link.path}
                        href={link.path}
                        className="relative group"
                        onClick={(e) => {
                          e.preventDefault();
                          setMobileMenuOpen(false);
                          if (location.pathname === "/") {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          } else {
                            window.location.href = "/";
                          }
                        }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-medium transition-all duration-300 glass-orange-outline text-xs sm:text-sm md:text-base lg:text-lg`}
                        >
                          <span className="relative z-10 font-semibold">
                            {link.label}
                          </span>
                        </motion.div>
                      </a>
                    );
                  }
                  if (link.path.startsWith("#")) {
                    return (
                      <a
                        key={link.path}
                        href={link.path}
                        className="relative group"
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(
                            link.path.substring(1),
                          );
                          if (el) {
                            el.scrollIntoView({ behavior: "smooth" });
                          }
                          setMobileMenuOpen(false);
                          if (location.pathname !== "/") {
                            window.location.href = `/${link.path}`;
                          }
                        }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-medium transition-all duration-300 glass-orange-outline text-xs sm:text-sm md:text-base lg:text-lg`}
                        >
                          <span className="relative z-10 font-semibold">
                            {link.label}
                          </span>
                        </motion.div>
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="relative group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`px-5 py-2 rounded-full font-medium transition-all duration-300 glass-orange-outline text-[12px] sm:text-[14px] md:text-[14px] lg:text-[16px]`}
                      >
                        <span className="relative z-10 font-semibold">
                          {link.label}
                        </span>
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              className="md:hidden flex flex-col gap-1.5 p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span
                className={`w-6 h-0.5 bg-[#FF6F00] transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
              ></span>
              <span
                className={`w-6 h-0.5 bg-[#FF6F00] transition-all ${mobileMenuOpen ? "opacity-0" : ""}`}
              ></span>
              <span
                className={`w-6 h-0.5 bg-[#FF6F00] transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              ></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Rendered via Portal */}
      {mobileMenuOpen &&
        createPortal(
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              id="mobile-nav"
              className="md:hidden fixed right-0 top-0 bottom-0 w-[280px] sm:w-[320px] bg-white/70 backdrop-blur-2xl shadow-2xl overflow-y-auto z-[9999] border-l border-white/50"
            >
              {/* Menu Header */}
              <div className="sticky top-0 bg-white/50 backdrop-blur-md border-b border-white/30 px-6 py-4 flex items-center justify-between z-10">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2"
                >
                  <img src="/logo.png" alt="Danvion" className="h-8 w-8" />
                  <span className="font-bold text-brand-black text-[14px] sm:text-[16px]">
                    Menu
                  </span>
                </motion.div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-white/50 transition-colors"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-6 h-6 text-brand-orange"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>

              {/* Menu Items */}
              <nav className="px-4 py-6 space-y-2">
                {navLinks.map((link, index) => {
                  const linkContent = (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      whileTap={{ scale: 0.97 }}
                      className="relative group px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-4 rounded-xl font-semibold transition-all duration-300 bg-white/40 hover:bg-white/60 border border-white/40 hover:border-orange-200/60 hover:shadow-lg hover:shadow-orange-100/30 backdrop-blur-sm overflow-hidden text-xs sm:text-sm md:text-base lg:text-base"
                    >
                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                      <div className="relative z-10 flex items-center justify-between">
                        <span className="text-brand-black">{link.label}</span>
                        <svg
                          className="w-5 h-5 text-brand-orange opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </motion.div>
                  );

                  if (link.label === "Home") {
                    return (
                      <a
                        key={link.path}
                        href={link.path}
                        onClick={(e) => {
                          e.preventDefault();
                          setMobileMenuOpen(false);
                          if (location.pathname === "/") {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          } else {
                            window.location.href = "/";
                          }
                        }}
                      >
                        {linkContent}
                      </a>
                    );
                  }
                  if (link.path.startsWith("#")) {
                    return (
                      <a
                        key={link.path}
                        href={link.path}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(
                            link.path.substring(1),
                          );
                          if (el) {
                            el.scrollIntoView({ behavior: "smooth" });
                          }
                          setMobileMenuOpen(false);
                          if (location.pathname !== "/") {
                            window.location.href = `/${link.path}`;
                          }
                        }}
                      >
                        {linkContent}
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {linkContent}
                    </Link>
                  );
                })}
              </nav>

              {/* Menu Footer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-0 left-0 right-0 p-6 bg-white/30 backdrop-blur-md border-t border-white/30"
              >
                <div className="text-center text-[12px] sm:text-[13px] md:text-[14px] text-gray-500">
                  <p className="font-semibold text-brand-orange mb-1">
                    Danvion Ltd
                  </p>
                  <p>Edge AI Solutions</p>
                </div>
              </motion.div>
            </motion.div>
          </>,
          document.body,
        )}
    </motion.header>
  );
}
