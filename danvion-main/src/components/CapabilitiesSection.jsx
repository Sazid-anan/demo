// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Container from "./common/Container";
import { Card } from "./ui/Card";
import {
  Zap,
  CircuitBoard,
  Code,
  Brain,
  Smartphone,
  Signal,
  Box,
} from "lucide-react";
import { SITE_CONTENT } from "../config/content";

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

/**
 * CapabilitiesSection Component
 * Displays end-to-end engineering capabilities with category badges
 */
export default function CapabilitiesSection({ homePage }) {
  return (
    <section className="pt-6 sm:pt-8 md:pt-10 lg:pt-14 pb-8 sm:pb-8 md:pb-10 lg:pb-14 bg-white">
      <Container className="content-maxwidth capabilities-content">
        <div className="mb-2 sm:mb-2.5 md:mb-3 lg:mb-4">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            {/* Left: Headline */}
            <div className="w-full lg:flex-1 flex flex-col items-start text-left">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                className="section-heading-display heading-orange text-orange-500 font-semibold leading-[1.2] tracking-tight mb-6"
              >
                {homePage?.capabilities_title || "Our Engineering"}
                <br />
                Capabilities
              </motion.h2>
            </div>

            {/* Right: Description */}
            <div className="w-full lg:flex-[1.5] flex flex-col items-start text-left lg:ml-11">
              <p className="capabilities-description-copy font-medium text-gray-800 leading-relaxed">
                {SITE_CONTENT.sharedDescriptions.engineeringSolutions}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-0">
          <Card className="relative w-full max-w-full mx-auto px-3 sm:px-2 md:px-3 lg:px-4 py-3 md:py-4 lg:py-5 bg-white border-2 border-orange-200/60 shadow-lg shadow-orange-100/50">
            <div className="capabilities-grid grid grid-cols-2 lg:grid-cols-7 gap-3 md:gap-4 lg:gap-3">
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
                  <Card className="capability-card relative aspect-square w-full flex flex-col items-center justify-center gap-2 md:gap-2.5 p-4 md:p-3 hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 hover:border-orange-500/50 hover:shadow-orange-100/50">
                    <capability.icon className="capability-icon h-10 w-10 md:h-11 md:w-11 lg:h-12 lg:w-12 text-orange-500 shrink-0" />
                    <h3 className="capability-title text-center text-xs md:text-sm font-semibold text-foreground leading-snug px-1">
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
