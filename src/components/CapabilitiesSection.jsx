import { motion } from "framer-motion";
import Container from "./common/Container";
import { Card } from "./ui/Card";
import {
  Zap,
  CircuitBoard,
  Cpu,
  Code,
  Brain,
  Smartphone,
  Shield,
  Battery,
  Wind,
  Timer,
  Terminal,
  Signal,
  BatteryCharging,
  Microchip,
  Bot,
} from "lucide-react";

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
      title: "Embedded Systems",
      icon: Cpu,
    },
    {
      title: "Firmware Development",
      icon: Code,
    },
    {
      title: "IoT",
      icon: Smartphone,
    },
    {
      title: "Edge AI Integration",
      icon: Brain,
    },
    {
      title: "Security & Encryption",
      icon: Shield,
    },
    {
      title: "Power Management",
      icon: Battery,
    },
    {
      title: "Zephyr RTOS",
      icon: Wind,
    },
    {
      title: "FreeRTOS",
      icon: Timer,
    },
    {
      title: "Linux",
      icon: Terminal,
    },
    {
      title: "Signal Integrity",
      icon: Signal,
    },
    {
      title: "Power Integrity",
      icon: BatteryCharging,
    },
    {
      title: "ARM",
      icon: Cpu,
    },
    {
      title: "RISC-V",
      icon: Microchip,
    },
    {
      title: "Agent SDK AI Agents",
      icon: Bot,
    },
  ];

  return (
    <section className="pt-0 sm:pt-3 md:pt-4 lg:pt-6 xl:pt-8 pb-0 sm:pb-4 md:pb-6 lg:pb-8 xl:pb-2 bg-white">
      <Container className="content-maxwidth capabilities-content">
        <div className="mb-0 sm:mb-3 md:mb-4 lg:mb-5">
          <div className="flex flex-row items-start gap-1 sm:gap-3 md:gap-4">
            {/* Left: Headline */}
            <div className="w-full sm:flex-1 flex flex-col items-start text-left sm:w-auto">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                className="capabilities-gradient-text font-semibold leading-[1.2] tracking-tight mb-0 sm:mb-3 md:mb-4 lg:mb-6 text-[18px] sm:text-[24px] md:text-[32px] lg:text-[50px]"
              >
                {homePage?.capabilities_title || "Our Engineering"}
                <br />
                Capabilities
              </motion.h1>
            </div>

            {/* Right: Description */}
            {/* <div className="flex-[1.5] flex flex-col items-start text-left mt-2 md:mt-3">
              <p className="text-justify text-[10px] sm:text-[12px] md:text-[14px] lg:text-[21px] font-semibold text-black mt-2 md:mt-3">
                {homePage?.capabilities_subtitle2 ||
                  "From hardware design to edge AI deployment, we deliver complete engineering solutions that bring intelligent products to life."}
              </p>
            </div> */}
            <div className="w-full sm:flex-[1.5] flex flex-col items-start text-left mt-0 sm:mt-4 sm:w-auto">
              <p className="text-justify text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-black">
                From hardware design to edge AI deployment, we deliver complete
                engineering solutions that bring intelligent products to life.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-0 sm:mb-5 md:mb-7">
          <Card className="relative w-full max-w-[1150px] lg:max-w-[1450px] xl:max-w-[1600px] mx-auto px-0.5 sm:px-1 md:px-2.5 lg:px-3 py-1.5 sm:py-2 md:py-3.5 lg:py-4 bg-white border-2 border-orange-200/60 shadow-lg shadow-orange-100/50">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-1 sm:gap-1.5 md:gap-3 lg:gap-2.5 auto-rows-fr">
              {capabilities.map((capability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.4 }}
                  whileHover={{ y: -4, scale: 1.05 }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <Card className="relative w-full h-full flex flex-col items-center justify-center gap-1.5 sm:gap-2 md:gap-2.5 p-2 sm:p-3 md:p-3.5 hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 hover:border-orange-500/50 hover:shadow-orange-100/50 overflow-hidden">
                    <capability.icon className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-12 lg:w-12 text-orange-500 flex-shrink-0" />
                    <h3 className="text-center text-xs sm:text-sm md:text-base lg:text-sm font-semibold text-foreground leading-tight">
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
