import { motion } from "framer-motion";
import Container from "./Container";

/**
 * Shared page hero section with consistent typography across screen sizes.
 * Keeps the existing visual style while improving readability on tablets.
 */
export default function PageHero({ title, description, className = "" }) {
  return (
    <section className={`py-8 sm:py-10 md:py-12 ${className}`}>
      <Container className="content-maxwidth">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-7 md:mb-8 lg:mb-10"
        >
          <div className="flex flex-col md:flex-row items-start gap-3 md:gap-6">
            <div className="w-full md:flex-1">
              <h1 className="capabilities-gradient-text font-semibold leading-[1.2] tracking-tight mb-2 sm:mb-3 md:mb-4 lg:mb-6 text-[24px] sm:text-[30px] md:text-[38px] lg:text-[50px]">
                {title}
              </h1>
            </div>
            <div className="w-full md:flex-[1.5] mt-1 md:mt-2">
              <p className="text-left md:text-justify text-[14px] sm:text-[15px] md:text-[17px] lg:text-[20px] font-semibold text-black leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
