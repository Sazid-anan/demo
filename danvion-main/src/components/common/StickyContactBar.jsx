// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, Linkedin, Calendar } from "lucide-react";
import { useState } from "react";
import { EXTERNAL_LINKS } from "../../config/links";
import { SITE_CONTENT } from "../../config/content";
/**
 * StickyContactBar Component
 * Fixed contact buttons on the right side of the screen
 * Responsive: Shows fewer icons on mobile/tablet to reduce clutter
 * - Mobile: Phone + Calendar (2 icons)
 * - Tablet: Phone + Email + Calendar (3 icons)
 * - Desktop: All 4 icons
 */
export default function StickyContactBar() {
  const [hoveredItem, setHoveredItem] = useState(null);

  const contactItems = [
    // {
    //   icon: Phone,
    //   label: "Call Us",
    //   detail: SITE_CONTENT.contact.phoneDisplay,
    //   href: `tel:${SITE_CONTENT.contact.phone}`,
    //   color: "text-brand-orange",
    //   // Show on all devices
    //   showOnMobile: true,
    //   showOnTablet: true,
    // },
    {
      icon: Mail,
      label: "Email Us",
      detail: SITE_CONTENT.contact.email,
      href: `mailto:${SITE_CONTENT.contact.email}`,
      color: "text-brand-orange",
      // Hide on mobile, show on tablet+
      showOnMobile: false,
      showOnTablet: true,
    },
    {
      icon: Linkedin,
      label: "Follow Us",
      href: EXTERNAL_LINKS.LINKEDIN,
      color: "text-brand-orange",
      target: "_blank",
      rel: "noopener noreferrer",
      // Tablet and desktop (hide only on mobile)
      showOnMobile: false,
      showOnTablet: true,
    },
    {
      icon: Calendar,
      label: "Book a 30 Minutes Free Consultation Call",
      tooltipLabel: "Book a Free 30 Minute Consultation",
      href: EXTERNAL_LINKS.CALENDLY,
      color: "text-brand-orange",
      target: "_blank",
      rel: "noopener noreferrer",
      // Show on all devices - important CTA
      showOnMobile: true,
      showOnTablet: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  const hoverVariants = {
    hover: {
      scale: 1.1,
      x: -5,
      rotate: 2,
      boxShadow: "0 0 20px rgba(232, 90, 12, 0.55)",
      backgroundColor: "rgba(232, 90, 12, 0.28)",
      borderColor: "rgba(232, 90, 12, 0.55)",
    },
  };

  return (
    <motion.div
      className="hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 sticky-contact-bar"
      style={{ right: "0px" }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {contactItems.map((item) => {
        const Icon = item.icon;

        // Build responsive visibility classes
        const visibilityClass = [
          // Mobile visibility (base)
          item.showOnMobile ? "flex" : "hidden",
          // Tablet visibility (md breakpoint)
          item.showOnTablet ? "md:flex" : "md:hidden",
          // Desktop always shows all (lg breakpoint)
          "lg:flex",
        ].join(" ");

        return (
          <motion.a
            key={item.label}
            href={item.href}
            target={item.target}
            rel={item.rel}
            variants={itemVariants}
            whileHover="hover"
            className={`group relative sticky-contact-bar__item ${visibilityClass}`}
            title={item.label}
            onMouseEnter={() => setHoveredItem(item.label)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <motion.div
              variants={hoverVariants}
              className="sticky-contact-bar__button transition-all duration-300 cursor-pointer"
            >
              <Icon className="sticky-contact-bar__icon" />
            </motion.div>

            {/* Tooltip with Slide Animation - Hidden on mobile/tablet */}
            <AnimatePresence>
              {hoveredItem === item.label && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="hidden lg:block absolute right-14 top-1/2 -translate-y-1/2 w-max min-w-48 max-w-60 bg-linear-to-br from-orange-400 via-orange-300 to-orange-400 backdrop-blur-xl text-white px-3 py-2 rounded-lg pointer-events-none shadow-[0_4px_16px_rgba(255,140,0,0.3)] border-2 border-orange-300/60 overflow-hidden"
                >
                  <div className="flex items-start gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-white animate-pulse shrink-0 mt-1" />
                    <div className="flex flex-col">
                      <p className="font-bold text-xs text-white uppercase tracking-wide leading-tight wrap-break-word">
                        {item.tooltipLabel || item.label}
                      </p>
                      {item.detail && (
                        <p className="text-xs font-semibold text-white tracking-normal leading-tight mt-0.5 wrap-break-word">
                          {item.detail}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Orange accent bar */}
                  <div className="absolute top-0 left-0 w-0.5 h-full bg-linear-to-b from-white via-orange-200 to-white rounded-l-lg opacity-70" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.a>
        );
      })}

      {/* Decorative line */}
      {/* Removed decorative line */}
    </motion.div>
  );
}
