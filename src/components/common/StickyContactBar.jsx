import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Phone, Mail, Linkedin, Calendar, MessageCircle, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EXTERNAL_LINKS } from "../../config/links";
import { SITE_CONTENT } from "../../config/content";

/**
 * StickyContactBar Component
 * - Mobile: compact FAB + expandable actions
 * - Tablet/Desktop: right-side vertical contact rail
 */
export default function StickyContactBar() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const syncViewport = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false);
    };
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  useEffect(() => {
    if (!isMobile || !isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, isOpen]);


  const contactItems = useMemo(
    () => [
      {
        icon: Phone,
        label: "Call Us",
        detail: SITE_CONTENT.contact.phoneDisplay,
        href: `tel:${SITE_CONTENT.contact.phone}`,
        color: "text-brand-orange",
        showOnMobile: true,
      },
      {
        icon: Mail,
        label: "Email Us",
        detail: SITE_CONTENT.contact.email,
        href: `mailto:${SITE_CONTENT.contact.email}`,
        color: "text-brand-orange",
        showOnMobile: false,
      },
      {
        icon: Linkedin,
        label: "Follow Us",
        href: EXTERNAL_LINKS.LINKEDIN,
        color: "text-brand-orange",
        target: "_blank",
        rel: "noopener noreferrer",
        showOnMobile: false,
      },
      {
        icon: Calendar,
        label: "Book a 30 Minutes Free Consultation Call",
        href: EXTERNAL_LINKS.CALENDLY,
        color: "text-brand-orange",
        target: "_blank",
        rel: "noopener noreferrer",
        showOnMobile: true,
      },
    ],
    [],
  );

  const railItems = contactItems;
  const mobileItems = contactItems.filter((item) => item.showOnMobile);

  const hoverVariants = {
    hover: shouldReduceMotion
      ? {
          boxShadow: "0 0 16px rgba(255, 140, 0, 0.45)",
          backgroundColor: "rgba(255, 140, 0, 0.25)",
          borderColor: "rgba(255, 140, 0, 0.6)",
        }
      : {
          scale: 1.15,
          x: -10,
          rotate: 4,
          boxShadow: "0 0 20px rgba(255, 140, 0, 0.6)",
          backgroundColor: "rgba(255, 140, 0, 0.3)",
          borderColor: "rgba(255, 140, 0, 0.6)",
        },
  };

  if (isMobile) {
    return (
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="sticky-contact-mobile-menu"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2"
              role="menu"
              aria-label="Quick contact actions"
            >
              {mobileItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target={item.target}
                    rel={item.rel}
                    className="flex items-center gap-2 rounded-full bg-black/90 border border-orange-400/40 px-3 py-2 text-white shadow-xl"
                    onClick={() => setIsOpen(false)}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                    role="menuitem"
                    aria-label={item.label}
                  >
                    <Icon className="w-4 h-4 text-brand-orange" />
                    <span className="text-[13px] font-semibold leading-none">
                      {item.label}
                    </span>
                  </motion.a>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-12 h-12 rounded-full bg-brand-orange text-black shadow-xl border border-orange-200 flex items-center justify-center"
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          aria-label="Toggle quick contact"
          aria-expanded={isOpen}
          aria-controls="sticky-contact-mobile-menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        </motion.button>
      </div>
    );
  }

  return (
    <motion.div
      className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40 hidden md:flex flex-col gap-3 sticky-contact-bar"
      initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      aria-label="Sticky contact links"
    >
      {railItems.map((item) => {
        const Icon = item.icon;

        return (
          <motion.a
            key={item.label}
            href={item.href}
            target={item.target}
            rel={item.rel}
            whileHover="hover"
            className="group relative sticky-contact-bar__item"
            title={item.label}
            aria-label={item.label}
            onMouseEnter={() => setHoveredItem(item.label)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <motion.div
              variants={hoverVariants}
              className="sticky-contact-bar__button transition-all duration-300 cursor-pointer"
            >
              <Icon className="sticky-contact-bar__icon" />
            </motion.div>

            <AnimatePresence>
              {hoveredItem === item.label && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, x: 20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20, scale: 0.8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2 bg-gradient-to-br from-orange-400 via-orange-300 to-orange-400 backdrop-blur-xl text-white px-4 py-3 rounded-xl whitespace-nowrap pointer-events-none shadow-[0_4px_16px_rgba(255,140,0,0.3)] border-2 border-orange-300/60"
                >
                  <p className="font-bold text-[13px] text-white uppercase tracking-wider">
                    {item.label}
                  </p>
                  {item.detail && (
                    <p className="text-[14px] font-semibold text-white tracking-wide mt-1">
                      {item.detail}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.a>
        );
      })}
    </motion.div>
  );
}
