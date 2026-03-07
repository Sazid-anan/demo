import { motion } from "framer-motion";
import Container from "./common/Container";
import { Card } from "./ui/Card";
import { Zap, CircuitBoard, Code, Brain, Smartphone, Signal, Box } from "lucide-react";
import { SITE_CONTENT } from "../config/content";

/**
 * CapabilitiesSection Component
 * Displays end-to-end engineering capabilities with category badges
 */
export default function CapabilitiesSection({ homePage }) {
  const capabilities = [
    {
      title: "System Architecture",
      icon: Zap,
    },
    {
      title: "PCB Design & Layout",
      icon: CircuitBoard,
    },
    {
      title: "Signal & Power Integrity",
      icon: Signal,
    },
    {
      title: "Firmware Development",
      icon: Code,
    },
    {
      title: "IoT Connectivity",
      icon: Smartphone,
    },
    {
      title: "Edge AI Integration",
      icon: Brain,
    },
    {
      title: "Enclosure Design",
      icon: Box,
    },
  ];

  return (
    <section className="pt-6 sm:pt-8 md:pt-10 lg:pt-14 pb-8 sm:pb-8 md:pb-10 lg:pb-14 bg-white">
      <Container className="content-maxwidth capabilities-content">
        <div className="mb-6 sm:mb-7 md:mb-8 lg:mb-10">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            {/* Left: Headline */}
            <div className="w-full lg:flex-1 flex flex-col items-start text-left">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                className="heading-orange text-orange-500 font-semibold leading-[1.2] tracking-tight mb-6 sm:mb-6 md:mb-6 lg:mb-6 text-[22px] sm:text-[26px] md:text-[32px] lg:text-[50px] text-left"
              >
                {homePage?.capabilities_title || "Our Engineering"}
                <br />
                Capabilities
              </motion.h1>
            </div>

            {/* Right: Description */}
            <div className="w-full lg:flex-[1.5] flex flex-col items-start text-left lg:ml-11">
              <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[23px] font-medium text-gray-800 leading-relaxed text-justify">
                {SITE_CONTENT.sharedDescriptions.engineeringSolutions}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-0 sm:mb-0 md:mb-0">
          <Card className="relative w-full max-w-full mx-auto px-3 sm:px-2 md:px-3 lg:px-4 py-3 sm:py-3 md:py-4 lg:py-5 bg-white border-2 border-orange-200/60 shadow-lg shadow-orange-100/50">
            <div className="capabilities-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-7 gap-3 sm:gap-3 md:gap-4 lg:gap-3">
              {capabilities.map((capability, index) => (
                <motion.div
                  key={index}
                  className="capability-cell"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.4 }}
                  whileHover={{ y: -4, scale: 1.05 }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <Card className="capability-card relative aspect-square w-full flex flex-col items-center justify-center gap-2 sm:gap-2 md:gap-2.5 p-4 sm:p-4 md:p-3 lg:p-3 hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 hover:border-orange-500/50 hover:shadow-orange-100/50">
                    <capability.icon className="capability-icon h-10 w-10 sm:h-10 sm:w-10 md:h-11 md:w-11 lg:h-12 lg:w-12 text-orange-500 flex-shrink-0" />
                    <h3 className="capability-title text-center text-xs sm:text-xs md:text-sm lg:text-sm font-semibold text-foreground leading-tight px-0.5">
                      {capability.title}
                    </h3>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
