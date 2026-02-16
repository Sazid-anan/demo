import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Linkedin, ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { EXTERNAL_LINKS, INTERNAL_LINKS } from "../../config/links";
import { SITE_CONTENT } from "../../config/content";
import Container from "../common/Container";

/**
 * Footer Component
 * Professional glass-morphism footer with social media, links, and contact info
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

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
    hover: { x: 4, color: "#FF8C00" },
  };

  const socialIconVariants = {
    hover: { scale: 1.15, rotate: 5 },
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
              <h3 className="text-label mb-1 sm:mb-2 text-black tracking-wide">
                {SITE_CONTENT.company.name}
              </h3>
              <div className="h-1 w-8 sm:w-10 bg-gradient-to-r from-brand-orange to-orange-500 mb-1 sm:mb-2 rounded-full" />
              <p className="hidden sm:block text-body-xs text-black leading-tight mb-2 sm:mb-3">
                {SITE_CONTENT.company.tagline}
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <p className="text-label text-black font-semibold">
                  {SITE_CONTENT.footer.connect}
                </p>
                <motion.a
                  href={EXTERNAL_LINKS.LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialIconVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="p-2 sm:p-2.5 rounded-lg bg-white/10 hover:bg-brand-orange/20 backdrop-blur-sm border border-white/10 hover:border-brand-orange/30 transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange" />
                </motion.a>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              className="md:col-span-1"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-label mb-1 sm:mb-2 uppercase text-black">
                {SITE_CONTENT.footer.sections.navigation.title}
              </h4>
              <div className="h-1 w-8 sm:w-10 bg-gradient-to-r from-brand-orange to-orange-500 mb-1 sm:mb-2 rounded-full" />
              <nav className="flex flex-col gap-1 sm:gap-1.5 md:gap-2">
                <motion.div variants={linkHoverVariants} whileHover="hover">
                  <Link
                    to="/"
                    className="text-black hover:text-brand-orange text-xs sm:text-xs md:text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight
                        className="w-5 h-5 text-brand-orange"
                        strokeWidth={2.7}
                      />
                    </span>
                    Home
                  </Link>
                </motion.div>
                <motion.div variants={linkHoverVariants} whileHover="hover">
                  <Link
                    to="/products"
                    className="text-black hover:text-brand-orange text-xs sm:text-xs md:text-sm transition-colors flex items-center gap-2 group"
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
                    className="text-black hover:text-brand-orange text-xs sm:text-xs md:text-sm transition-colors flex items-center gap-2 group"
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
                    className="text-black hover:text-brand-orange text-body-xs transition-colors flex items-center gap-2 group"
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
              <h4 className="text-xs sm:text-sm font-bold mb-1 sm:mb-2 uppercase tracking-widest text-black">
                {SITE_CONTENT.footer.sections.resources.title}
              </h4>
              <div className="h-1 w-8 sm:w-10 bg-gradient-to-r from-brand-orange to-orange-500 mb-1 sm:mb-2 rounded-full" />
              <nav className="flex flex-col gap-1 sm:gap-1.5 md:gap-2">
                <motion.div variants={linkHoverVariants} whileHover="hover">
                  <a
                    href={INTERNAL_LINKS.CONTACT}
                    onClick={(event) => handleSectionClick(event, "contact")}
                    className="text-black hover:text-brand-orange text-xs sm:text-xs md:text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    Get in Touch
                  </a>
                </motion.div>
                <motion.div variants={linkHoverVariants} whileHover="hover">
                  <a
                    href="https://www.linkedin.com/company/danvion"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:text-brand-orange text-xs sm:text-xs md:text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    About Us
                  </a>
                </motion.div>
              </nav>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="md:col-span-1"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-label mb-1 sm:mb-2 uppercase text-black">
                {SITE_CONTENT.footer.sections.getInTouch.title}
              </h4>
              <div className="h-1 w-8 sm:w-10 bg-gradient-to-r from-brand-orange to-orange-500 mb-1 sm:mb-2 rounded-full" />
              <div className="flex flex-col gap-1.5 sm:gap-2 lg:gap-2">
                {/* Email */}
                <a
                  href="mailto:sazid@danvion.com"
                  className="flex items-start gap-2 group"
                >
                  <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <p className="text-xs sm:text-2xs text-black uppercase tracking-wider leading-none">
                      Email
                    </p>
                    <p className="text-body-xs text-black group-hover:text-brand-orange transition-colors leading-none break-all">
                      sazid@danvion.com
                    </p>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href="tel:+60148914600"
                  className="flex items-start gap-2 group"
                >
                  <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <p className="text-xs sm:text-2xs text-black uppercase tracking-wider leading-none">
                      Phone
                    </p>
                    <p className="text-body-xs text-black group-hover:text-brand-orange transition-colors leading-none">
                      +60148914600
                    </p>
                  </div>
                </a>

                {/* Address */}
                <div className="flex items-start gap-2">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <p className="text-xs sm:text-2xs text-black uppercase tracking-wider leading-none">
                      Location
                    </p>
                    <p className="text-body-xs text-black leading-tight">
                      79/Ka Siddiqia, Sonabangla Lane, Khulna
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
          <div className="flex flex-col gap-1 sm:gap-1.5 text-center">
            <p className="text-label text-black">
              {SITE_CONTENT.footer.bottom.copyright.replace(
                "{year}",
                currentYear,
              )}
            </p>
            <div className="flex items-center justify-center gap-1.5 sm:gap-1.5 text-label text-black flex-wrap">
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
