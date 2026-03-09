// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import Container from "./common/Container";
import { EXTERNAL_LINKS } from "../config/links";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Hero Text Section (REFERENCE DESIGN)
 * Black background with split layout
 * Left: Headline with colored text + CTA button
 * Right: Description text
 * Fully responsive for mobile, tablet, desktop
 * Includes prefers-reduced-motion support for accessibility
 */
export default function HeroTextSection() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section className="hero-logo-gradient w-full py-6 sm:py-8 md:py-10 lg:py-14 overflow-hidden">
      <Container className="content-maxwidth w-full">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 mb-0">
          {/* Left: Headline + Button */}
          <motion.div
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.7,
              delay: prefersReducedMotion ? 0 : 0.1,
            }}
            className="w-full lg:flex-1 flex flex-col items-start text-left"
          >
            {/* Headline with colored text */}
            <h1 className="section-heading-display font-semibold leading-[1.2] tracking-tight mb-6">
              <span className="block text-white">Vision</span>
              <span className="block text-white">Precision</span>
              <span className="block text-(--brand)">Intelligence</span>
            </h1>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.7,
                delay: prefersReducedMotion ? 0 : 0.3,
              }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.03, y: -2 }}
              whileTap={{}}
              onClick={() => window.open(EXTERNAL_LINKS.CALENDLY, "_blank")}
              className="hero-consultation-cta group w-fit px-4 sm:px-5 md:px-6 lg:px-7 py-2.5 sm:py-3 md:py-3.5 lg:py-4 font-bold rounded-full transition-all duration-300 shadow-lg flex items-center gap-2 text-xs sm:text-sm md:text-base lg:text-lg"
            >
              <Calendar className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
              <span className="relative z-10">
                Book a Free Consultation for 30 Minutes
              </span>
            </motion.button>
          </motion.div>

          {/* Right: Description Text - LCP element, no animation */}
          <div className="w-full lg:flex-[1.5] flex flex-col items-start text-left lg:ml-11">
            <p
              className="text-slate-100 font-medium leading-relaxed"
              style={{ fontSize: "clamp(1.0625rem, 0.95rem + 0.4vw, 1.25rem)" }}
            >
              At Danvion, we're pushing the boundaries of artificial
              intelligence at the edge-delivering cutting-edge solutions for the
              world's most complex challenges. With our expertise in embedded
              AI, hardware integration, and real-time processing, we're creating
              smarter, faster, and more efficient products.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
