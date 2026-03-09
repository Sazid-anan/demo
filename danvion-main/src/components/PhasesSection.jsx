// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Lightbulb, Cpu, Layers, Activity, Box, Factory } from "lucide-react";
import Container from "./common/Container";

const phases = [
  {
    id: 1,
    number: "01",
    title: "Concept Phase",
    icon: Lightbulb,
    color: "bg-blue-700",
    darkColor: "bg-blue-700",
    description:
      "The first step in any design process is to describe and define the functional scope of the product. We will work with you.",
  },
  {
    id: 2,
    number: "02",
    title: "Schematic Capture",
    icon: Cpu,
    color: "bg-cyan-700",
    darkColor: "bg-cyan-700",
    description:
      "We use industry standard circuit simulation tools such as KiCad PSpice and LTSpice to design your schematic and capture it in Altium Designer.",
  },
  {
    id: 3,
    number: "03",
    title: "PCB Design",
    icon: Layers,
    color: "bg-purple-700",
    darkColor: "bg-purple-700",
    description:
      "We design PCBs using Altium Designer, KiCad. Whether it's a high-current, low-noise analog or high-density digital board.",
  },
  {
    id: 4,
    number: "04",
    title: "Simulation",
    icon: Activity,
    color: "bg-pink-700",
    darkColor: "bg-pink-700",
    description:
      "Simulations are an integral part of our design process. We use both industry standard and open-source simulation tools to model complex systems.",
  },
  {
    id: 5,
    number: "05",
    title: "Mechanical Design",
    icon: Box,
    color: "bg-orange-700",
    darkColor: "bg-orange-700",
    description:
      "Our mechanical design workflow brings together all of our expertise from simulations and electronics design.",
  },
  {
    id: 6,
    number: "06",
    title: "Prototyping",
    icon: Factory,
    color: "bg-orange-500",
    darkColor: "bg-orange-500",
    description:
      "Designing hardware requires building and testing hardware. We provide both prototype assembly and testing in-house.",
  },
];

// Phase Card Component - Optimized for Professional Look
const PhaseCard = ({ process, index }) => {
  const IconComponent = process.icon;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group h-full w-full"
    >
      {/* Optimized Card Container - Uniform Height Across All Sizes */}
      <div
        className={`relative h-full min-h-52 sm:min-h-56 md:min-h-60 lg:min-h-56 flex flex-col bg-white rounded-lg md:rounded-xl border-2 p-4 md:p-5 transition-all duration-300 ${isHovered ? "border-orange-500 shadow-2xl shadow-orange-200 transform scale-[1.02] bg-linear-to-br from-white to-orange-50" : "border-gray-300 shadow-lg hover:shadow-xl"}`}
      >
        {/* Number Badge - Compact Size */}
        <div
          className={`absolute top-3 right-3 w-9 h-9 md:w-10 md:h-10 rounded-full ${process.color} flex items-center justify-center font-bold text-sm text-white shadow-lg transition-all duration-300 ${isHovered ? "rotate-12 scale-110" : ""}`}
        >
          {process.number}
        </div>

        {/* Icon Container - Optimized Sizing */}
        <div
          className={`w-12 h-12 md:w-13 md:h-13 mb-3 ${process.color} rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300 ${isHovered ? "shadow-2xl scale-110 rotate-3" : "shadow-lg"}`}
        >
          <IconComponent
            className={`w-6 h-6 md:w-6.5 md:h-6.5 transition-transform duration-300 ${isHovered ? "scale-110 rotate-12" : ""}`}
            strokeWidth={2}
            color="#ffffff"
          />
        </div>

        {/* Content - Optimized Spacing */}
        <div className="space-y-2 flex-1 flex flex-col">
          <h3 className="text-base md:text-lg lg:text-xl font-bold leading-tight text-gray-800">
            {process.title}
          </h3>

          <div
            className={`h-0.5 rounded-full transition-all duration-300 ${isHovered ? "w-14" : "w-10"} ${process.color}`}
          ></div>

          <p
            className="leading-relaxed flex-1 text-gray-600"
            style={{ fontSize: "0.9375rem" }}
          >
            {process.description}
          </p>
        </div>

        {/* Hover Glow Effect */}
        <div
          className={`absolute inset-0 rounded-lg md:rounded-xl transition-opacity duration-300 pointer-events-none ${isHovered ? "opacity-100" : "opacity-0"}`}
          style={{
            background: `radial-gradient(circle at 50% 0%, ${process.color.replace("bg-", "rgba(")}10, 0.1), transparent 70%)`,
          }}
        ></div>
      </div>
    </motion.div>
  );
};

const PhaseSection = () => {
  return (
    <section className="w-full bg-gray-100 font-sans py-6 sm:py-8 md:py-10">
      <Container className="content-maxwidth w-full">
        {/* Header Section with Better Responsive Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-7 md:mb-8 lg:mb-6"
        >
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            {/* Left: Headline */}
            <div className="w-full lg:flex-1 flex flex-col items-start text-left">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                className="section-heading-display heading-orange text-orange-700 section-heading font-semibold leading-[1.2] tracking-tight"
              >
                Our Development Phases
              </motion.h2>
            </div>

            {/* Right: Description */}
            <div className="w-full lg:flex-[1.5] flex flex-col items-start text-left lg:ml-11">
              <p className="paragraph-display text-gray-800 font-medium">
                We streamline your success by handling every detail from initial
                schematics to in-house prototyping and testing
              </p>
            </div>
          </div>
        </motion.div>

        {/* Phase Cards Grid - Optimized Professional Spacing */}
        <div className="mb-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-5">
            {/* Phase Cards */}
            {phases.map((process, index) => (
              <div key={process.id} className="relative w-full">
                <PhaseCard process={process} index={index} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PhaseSection;
