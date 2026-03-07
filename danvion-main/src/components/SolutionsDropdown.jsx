import { motion, AnimatePresence } from "framer-motion";
import { Cpu, CircuitBoard, Code, Wifi, Zap, Box, Network, Hammer, Lightbulb } from "lucide-react";
import { EXTERNAL_LINKS } from "../config/links";

/**
 * SolutionsDropdown Component
 * Dropdown menu with categorized solutions and consultation box
 * Used in Header navigation
 */
export default function SolutionsDropdown({ isVisible = true, onClose }) {
  // Category data structure - simplified
  const capabilityCategories = [
    {
      name: "EMBEDDED SYSTEMS",
      items: [
        {
          title: "Edge AI Integration",
          description: "Deploy intelligent processing at the edge for real-time insights.",
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
      <div className="max-w-full mx-auto px-2 sm:px-3 md:px-4 lg:px-6 py-4 sm:py-5 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3 sm:gap-4 lg:gap-6 min-w-0">
          {/* Left: 3 Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 min-w-0 overflow-x-auto">
            {capabilityCategories.map((category, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                className="space-y-4"
              >
                {/* Category Header */}
                <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                  {category.name}
                </h3>

                {/* Items */}
                <div className="space-y-3">
                  {category.items.map((item, itemIdx) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={itemIdx} className="flex items-start gap-2">
                        <IconComponent className="w-4 h-4 text-gray-700 flex-shrink-0 mt-1" />
                        <div className="flex-1 max-w-sm">
                          <h4 className="text-sm font-bold text-gray-900 mb-0.5">{item.title}</h4>
                          <p className="text-xs text-gray-600 leading-snug">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Consultation Box */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="w-full min-w-0 h-full"
          >
            <div className="h-full p-3 sm:p-4 bg-white border-2 border-gray-200 rounded-2xl flex flex-col justify-between">
              <div>
                {/* Header */}
                <h3 className="consultation-heading text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight break-words">
                  Book a free 30 minute consultation
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-600 mb-3">
                  Discuss your project with our engineering team.
                </p>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-3 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-xs sm:text-sm tracking-wide uppercase flex items-center justify-center gap-1.5"
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
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Floating Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[1320px] max-h-[75vh] overflow-hidden z-50 rounded-2xl shadow-2xl"
          >
            <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide">{content}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
