import Container from "./common/Container";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Hero Text Section
 * Displays the main headline and description on a white background
 */

export default function HeroTextSection() {
  return (
    <section className="relative bg-black container-fluid topbanner overflow-hidden">
      <Container className="content-maxwidth hero-topbanner-content">
        <div>
          <div className="flex flex-wrap sm:flex-nowrap items-start gap-3 sm:gap-3 md:gap-4 mt-1 sm:mt-2">
            {/* Left: Headline */}
            <div className="w-full sm:flex-1 flex flex-col items-start text-left sm:w-auto">
              <h1 className="animated-gradient-text font-semibold leading-[1.25] tracking-tight mb-1 sm:mb-2 md:mb-4 lg:mb-6 text-[18px] sm:text-[24px] md:text-[32px] lg:text-[50px]">
                Alchemy for the
                <br />
                Intelligent Age
              </h1>
              {/* Button - hidden on mobile, shown on desktop */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                onClick={() => window.open("https://calendly.com/", "_blank")}
                className="hidden sm:flex group mt-1.5 sm:mt-2 md:mt-4 lg:mt-6 px-1.5 sm:px-4 md:px-5 lg:px-6 py-0.5 sm:py-2 md:py-2.5 lg:py-3 bg-orange-500 font-bold rounded-full transition-all duration-300 items-center gap-0.5 sm:gap-2 hover:shadow-lg hover:bg-white border border-orange-500 cursor-pointer text-xs sm:text-sm md:text-base lg:text-lg"
              >
                <Calendar className="w-2 h-2 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white group-hover:text-orange-500 transition-colors duration-300 flex-shrink-0" />
                <span className="relative z-10 font-semibold text-white group-hover:text-orange-500 transition-colors duration-300 leading-tight">
                  Book a Free Consultation for 30 Minutes
                </span>
              </motion.button>
            </div>

            {/* Right: Description */}
            <div className="w-full sm:flex-[1.5] flex flex-col items-start text-left mt-2 sm:mt-0 sm:w-auto">
              <p className="text-justify text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white leading-snug">
                At Danvion, we're pushing the boundaries of artificial
                intelligence at the edge – delivering cutting-edge solutions for
                the world's most complex challenges. With our expertise in
                embedded AI, hardware integration, and real-time processing,
                we're creating smarter, faster, and more efficient products.
              </p>
            </div>
          </div>

          {/* Button - shown only on mobile, below description */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.open("https://calendly.com/", "_blank")}
            className="flex sm:hidden group mt-2 px-2.5 py-1 bg-orange-500 font-bold rounded-full transition-all duration-300 items-center gap-1 hover:shadow-lg hover:bg-white border border-orange-500 cursor-pointer text-xs"
          >
            <Calendar className="w-2.5 h-2.5 text-white group-hover:text-orange-500 transition-colors duration-300 flex-shrink-0" />
            <span className="relative z-10 font-semibold text-white group-hover:text-orange-500 transition-colors duration-300 leading-tight">
              Book a Free Consultation for 30 Minutes
            </span>
          </motion.button>
        </div>
      </Container>
    </section>
  );
}
