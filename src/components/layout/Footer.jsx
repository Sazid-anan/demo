import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Linkedin, ArrowRight, Mail, MapPin } from "lucide-react";
import { EXTERNAL_LINKS, INTERNAL_LINKS } from "../../config/links";
import { SITE_CONTENT } from "../../config/content";
import Container from "../common/Container";
import { useResponsive } from "../../hooks/useResponsive";

/**
 * Footer Component
 * Professional glass-morphism footer with social media, links, and contact info
 * Enhanced with responsive optimizations
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const { isMobile } = useResponsive();

  const handleSectionClick = (event, sectionId) => {
    event.preventDefault();
    const el = document.getElementById(sectionId);
    if (location.pathname === "/") {
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const linkHoverVariants = {
    hover: !isMobile ? { x: 4, color: "#FF8C00" } : {}, // Disable on mobile
  };

  const socialIconVariants = {
    hover: !isMobile ? { scale: 1.15, rotate: 5 } : {}, // Disable on mobile
    tap: { scale: 0.95 },
  };

  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="relative mt-1 sm:mt-2 md:mt-2 lg:mt-2 bg-gradient-to-b from-white/40 to-white/20 backdrop-blur-xs border-t border-white/30"
    >
      {/* Content */}
      <Container className="relative content-maxwidth">
        {/* Top accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-brand-orange/40 to-transparent mb-1.5 sm:mb-2 md:mb-2" />

        {/* Main Footer Content */}
        <div className="pt-0.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5 mb-1.5 sm:mb-2 md:mb-2">
            {/* Company Info */}
            <motion.div
              className="lg:col-span-1"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-[12px] font-bold mb-1 sm:mb-1.5 uppercase tracking-widest text-black">
                {SITE_CONTENT.company.name}
              </h4>
              <div className="h-0.5 w-7 sm:w-8 bg-gradient-to-r from-brand-orange to-orange-500 mb-1 sm:mb-1.5 rounded-full" />
              <p className="hidden sm:block text-[12px] text-black leading-tight mb-2 sm:mb-2.5">
                {SITE_CONTENT.company.tagline}
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <p className="text-[12px] text-black font-semibold">
                  {SITE_CONTENT.footer.connect}
                </p>
                <motion.a
                  href={EXTERNAL_LINKS.LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialIconVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-brand-orange/20 backdrop-blur-sm border border-white/10 hover:border-brand-orange/30 transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-brand-orange" />
                </motion.a>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              className="md:col-span-1"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-[12px] font-bold mb-1 sm:mb-1.5 uppercase tracking-widest text-black">
                {SITE_CONTENT.footer.sections.navigation.title}
              </h4>
              <div className="h-0.5 w-7 sm:w-8 bg-gradient-to-r from-brand-orange to-orange-500 mb-1 sm:mb-1.5 rounded-full" />
              <nav className="flex flex-col gap-0.5 sm:gap-1">
                <motion.div variants={linkHoverVariants} whileHover="hover">
                  <Link
                    to="/"
                    className="text-black hover:text-brand-orange text-[12px] transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight
                        className="w-3 h-3 text-brand-orange"
                        strokeWidth={2.5}
                      />
                    </span>
                    Home
                  </Link>
                </motion.div>
                <motion.div variants={linkHoverVariants} whileHover="hover">
                  <Link
                    to="/products"
                    className="text-black hover:text-brand-orange text-[12px] transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    Products
                  </Link>
                </motion.div>
                <motion.div variants={linkHoverVariants} whileHover="hover">
                  <Link
                    to="/blogs"
                    className="text-black hover:text-brand-orange text-[12px] transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    Blog
                  </Link>
                </motion.div>
                <motion.div variants={linkHoverVariants} whileHover="hover">
                  <a
                    href={INTERNAL_LINKS.CONTACT}
                    onClick={(event) => handleSectionClick(event, "contact")}
                    className="text-black hover:text-brand-orange text-[12px] transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    Contact
                  </a>
                </motion.div>
              </nav>
            </motion.div>

            {/* Resources */}
            <motion.div
              className="md:col-span-1"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-[12px] font-bold mb-1 sm:mb-1.5 uppercase tracking-widest text-black">
                {SITE_CONTENT.footer.sections.resources.title}
              </h4>
              <div className="h-0.5 w-7 sm:w-8 bg-gradient-to-r from-brand-orange to-orange-500 mb-1 sm:mb-1.5 rounded-full" />
              <nav className="flex flex-col gap-0.5 sm:gap-1">
                <motion.div variants={linkHoverVariants} whileHover="hover">
                  <a
                    href={INTERNAL_LINKS.CONTACT}
                    onClick={(event) => handleSectionClick(event, "contact")}
                    className="text-black hover:text-brand-orange text-[12px] transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    Get in Touch
                  </a>
                </motion.div>
                <motion.div variants={linkHoverVariants} whileHover="hover">
                  <Link
                    to="/"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="text-black hover:text-brand-orange text-[12px] transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    About Us
                  </Link>
                </motion.div>
              </nav>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="md:col-span-1"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-[12px] font-bold mb-1 sm:mb-1.5 uppercase tracking-widest text-black">
                {SITE_CONTENT.footer.sections.getInTouch.title}
              </h4>
              <div className="h-0.5 w-7 sm:w-8 bg-gradient-to-r from-brand-orange to-orange-500 mb-1 sm:mb-1.5 rounded-full" />
              <div className="flex flex-col gap-1 sm:gap-1.5">
                {/* Email */}
                <a
                  href="mailto:support@danvion.com"
                  className="flex items-start gap-1.5 group"
                >
                  <Mail className="w-2 h-2 text-brand-orange flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <p className="text-[12px] text-black uppercase tracking-wider leading-none mb-0.5">
                      Email
                    </p>
                    <p className="text-[12px] text-black group-hover:text-brand-orange transition-colors leading-tight break-all">
                      support@danvion.com
                    </p>
                  </div>
                </a>

                {/* Address */}
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-2 h-2 text-brand-orange flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <p className="text-[12px] text-black uppercase tracking-wider leading-none mb-0.5">
                      Location
                    </p>
                    <p className="text-[12px] text-black leading-tight">
                      128 City Road, London, EC1V 2NX, GB
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom Footer */}
        <div className="py-0.5 sm:py-1">
          <div className="flex flex-col gap-0.5 sm:gap-1 text-center">
            <p className="text-[12px] text-black">
              {SITE_CONTENT.footer.bottom.copyright.replace(
                "{year}",
                currentYear,
              )}
            </p>
            <div className="flex items-center justify-center gap-1.5 text-[12px] text-black flex-wrap">
              <a href="#" className="hover:text-brand-orange transition-colors">
                {SITE_CONTENT.footer.bottom.privacyPolicy}
              </a>
              <span className="w-0.5 h-0.5 rounded-full bg-black" />
              <a href="#" className="hover:text-brand-orange transition-colors">
                {SITE_CONTENT.footer.bottom.termsOfService}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </motion.footer>
  );
}
