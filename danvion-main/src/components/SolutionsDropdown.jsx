// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  CircuitBoard,
  Code,
  Wifi,
  Zap,
  Box,
  Network,
  Hammer,
  Lightbulb,
} from "lucide-react";
import { EXTERNAL_LINKS } from "../config/links";

/**
 * SolutionsDropdown Component
 * Dropdown menu with categorized solutions and consultation box
 * Used in Header navigation
 */
export default function SolutionsDropdown({ isVisible = true, onClose }) {
  const capabilityCategories = [
    {
      name: "EMBEDDED SYSTEMS",
      items: [
        {
          title: "Edge AI Integration",
          description:
            "Deploy intelligent processing at the edge for real-time insights.",
          icon: Cpu,
        },
        {
          title: "PCB Design",
          description: "Custom circuit board layouts for robust hardware.",
          icon: CircuitBoard,
        },
        {
          title: "Firmware Development",
          description: "Optimized code for seamless device performance.",
          icon: Code,
        },
      ],
    },
    {
      name: "CONNECTIVITY",
      items: [
        {
          title: "IoT Integration",
          description: "Connect devices securely for scalable networks.",
          icon: Wifi,
        },
        {
          title: "Signal Integrity",
          description: "Ensure reliable data transmission and power delivery.",
          icon: Zap,
        },
        {
          title: "Enclosure Design",
          description: "Precision housings for advanced electronics.",
          icon: Box,
        },
      ],
    },
    {
      name: "ENGINEERING SERVICES",
      items: [
        {
          title: "System Architecture",
          description: "Strategic planning for scalable hardware solutions.",
          icon: Network,
        },
        {
          title: "Prototyping",
          description: "Accelerate development with rapid iteration.",
          icon: Hammer,
        },
        {
          title: "Consulting",
          description: "Expert guidance for complex engineering challenges.",
          icon: Lightbulb,
        },
      ],
    },
  ];

  const content = (
    <div className="bg-white border-2 border-gray-200 shadow-xl">
      <div className="max-w-full mx-auto px-3 sm:px-5 md:px-6 lg:px-7 py-4 sm:py-5 md:py-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] xl:grid-cols-[2.15fr_1fr] gap-5 md:gap-6 min-w-0">
          {/* Left: 3 categories */}
          <div className="solutions-categories-grid grid grid-cols-1 gap-4 md:gap-5 min-w-0">
            {capabilityCategories.map((category, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.28 }}
                className="space-y-3.5 min-w-0 px-1.5 py-1 sm:px-2 sm:py-1.5"
              >
                <p
                  className={`font-semibold text-slate-500 uppercase leading-none mb-2.5 md:mb-3 min-h-3.5 md:min-h-4 whitespace-nowrap ${
                    category.name === "ENGINEERING SERVICES"
                      ? "text-[8px] md:text-[9px] tracking-[0.08em]"
                      : "text-[9px] md:text-[10px] tracking-widest"
                  }`}
                >
                  {category.name}
                </p>

                <div className="flex flex-col gap-3">
                  {category.items.map((item, itemIdx) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={itemIdx}
                        className="grid grid-cols-[1.25rem_1fr] gap-2.5 md:gap-3 min-w-0 content-start"
                      >
                        <IconComponent className="w-4 h-4 md:w-4.5 md:h-4.5 text-slate-700 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div
                            role="heading"
                            aria-level={3}
                            className="text-[16px] font-semibold text-slate-900 mb-0.5 leading-[1.3] min-h-8 wrap-break-word"
                          >
                            {item.title}
                          </div>
                          <div className="text-[13px] text-slate-600 leading-snug min-h-14 wrap-break-word">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Consultation box */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.24, duration: 0.35 }}
            className="w-full min-w-0 self-start"
          >
            <div className="p-3 md:p-3.5 lg:p-4 bg-white border-2 border-gray-200 rounded-2xl flex flex-col gap-3">
              <div>
                <h3 className="consultation-heading text-[1rem] sm:text-[1.05rem] lg:text-[1.12rem] font-semibold text-slate-900 mb-1.5 md:mb-2 leading-[1.15] tracking-[-0.01em]">
                  Book a free 30 minute consultation
                </h3>
                <p className="text-[12px] md:text-[13px] text-slate-600 leading-normal">
                  Discuss your project with our engineering team.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="w-full px-4 py-1.5 md:py-2 bg-orange-700 hover:bg-orange-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-[10px] md:text-[11px] tracking-[0.05em] uppercase flex items-center justify-center gap-2"
                onClick={() => window.open(EXTERNAL_LINKS.CALENDLY, "_blank")}
              >
                <span>Book now</span>
                <span>→</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="solutions-dropdown-shell fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] md:w-[calc(100%-3rem)] lg:w-[84%] max-w-6xl max-h-[80vh] overflow-hidden z-50 rounded-xl sm:rounded-2xl shadow-2xl"
          >
            <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
              {content}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
