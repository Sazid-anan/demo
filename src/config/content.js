/**
 * Content Configuration
 * Centralized place to manage all website text content
 * Easy to update and maintain - just edit the values below
 */

export const SITE_CONTENT = {
  // Company Information
  company: {
    name: "DANVION",
    tagline:
      "Leading provider of Edge AI solutions and product development services.",
    description:
      "We specialize in Edge AI solutions, embedded systems, and complete product development from concept to production.",
  },

  // Contact Information
  contact: {
    email: "sazid@danvion.com",
    phone: "+60148914600",
    phoneDisplay: "+60148914600",
    location: "79/Ka Siddiqia, Sonabangla Lane, Khulna",
  },

  // Header Navigation
  navigation: {
    home: "Home",
    contact: "Contact",
    products: "Products",
    blogs: "Blogs",
    blog: "Blog",
  },

  // Hero Section
  hero: {
    badge: "Certified & Trusted",
    title: "Edge AI Product Development",
    subtitle: "From Vision to Reality",
    description:
      "We specialize in Edge AI solutions, embedded systems, and complete product development from concept to production.",
    cta: {
      primary: "Get Started",
      secondary: "Book a Call",
      linkedin: "Connect on LinkedIn",
    },
  },

  // Contact Section
  contactSection: {
    title: "Get In Touch",
    description:
      "Ready to bring your product idea to life? Let's discuss your project and explore how we can help you succeed.",
    form: {
      name: "Name",
      namePlaceholder: "Your Name",
      email: "Email",
      emailPlaceholder: "your@email.com",
      phone: "Phone (Optional)",
      phonePlaceholder: "+1 234 567 8900",
      message: "Message",
      messagePlaceholder: "Tell us about your project...",
      submit: "Send Message",
      sending: "Sending...",
      successMessage: "Message sent successfully! We'll get back to you soon.",
    },
  },

  // Capabilities Section
  capabilities: {
    title: "End-to-End Engineering",
    subtitle: "From Hardware to Cloud",
    items: [
      {
        title: "PCB Design & Layout",
        category: "Hardware",
        description:
          "Custom circuit board design from concept to production. Multi-layer PCBs, high-speed signals, and power-efficient layouts.",
      },
      {
        title: "Embedded Systems",
        category: "Hardware",
        description:
          "Complete embedded system development with ARM, RISC-V, and custom ASIC solutions tailored to your requirements.",
      },
      {
        title: "Firmware Development",
        category: "Firmware",
        description:
          "Real-time firmware for microcontrollers and processors. RTOS, bare-metal, and custom bootloader development.",
      },
      {
        title: "Edge AI Integration",
        category: "AI",
        description:
          "Deploy machine learning models on edge devices. TensorFlow Lite, optimized neural networks, and custom accelerators.",
      },
      {
        title: "IoT & Connectivity",
        category: "Connectivity",
        description:
          "Wireless protocols (WiFi, BLE, LoRa, NB-IoT), cloud integration, and secure device communication.",
      },
      {
        title: "Security Implementation",
        category: "Security",
        description:
          "Hardware security modules, secure boot, encryption, and compliance with industry standards.",
      },
      {
        title: "Power Management",
        category: "Power",
        description:
          "Ultra-low power design, battery optimization, energy harvesting, and power distribution systems.",
      },
      {
        title: "Sensor Integration",
        category: "Sensors",
        description:
          "Multi-sensor fusion, calibration, signal processing, and custom sensor interfaces for diverse applications.",
      },
    ],
  },

  // Phases Section
  phases: {
    title: "Our Development Process",
    subtitle: "Structured Approach to Success",
    items: [
      {
        number: "01",
        title: "Discovery & Planning",
        description:
          "We analyze your requirements, define specifications, and create a comprehensive development roadmap.",
      },
      {
        number: "02",
        title: "Design & Prototyping",
        description:
          "Our team designs hardware, firmware architecture, and creates functional prototypes for validation.",
      },
      {
        number: "03",
        title: "Development & Testing",
        description:
          "Full-scale development with rigorous testing, quality assurance, and iterative improvements.",
      },
      {
        number: "04",
        title: "Production & Support",
        description:
          "Manufacturing setup, quality control, and ongoing technical support for your product.",
      },
    ],
  },

  // Footer
  footer: {
    sections: {
      navigation: {
        title: "Navigation",
        links: [
          { label: "Home", path: "/" },
          { label: "Products", path: "/products" },
          { label: "Blog", path: "/blogs" },
          { label: "Contact", path: "#contact" },
        ],
      },
      resources: {
        title: "Resources",
        links: [
          { label: "Get in Touch", path: "#contact" },
          {
            label: "About Us",
            path: "https://www.linkedin.com/company/danvion",
            external: true,
          },
        ],
      },
      getInTouch: {
        title: "Get in Touch",
      },
    },
    bottom: {
      copyright: "© {year} Danvion Ltd. All rights reserved.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
    },
    connect: "Connect",
  },

  // Products Page
  products: {
    title: "Our Products",
    subtitle: "Innovative Solutions",
    description:
      "Explore our range of Edge AI and IoT products designed for various industries.",
  },

  // Blogs Page
  blogs: {
    title: "Latest Insights",
    subtitle: "Blog & Resources",
    description:
      "Stay updated with the latest trends in Edge AI, IoT, and product development.",
    readMore: "Read More",
    readingTime: "{minutes} min read",
  },

  // Image Slider Section
  imageSlider: {
    title: "Our Team",
    subtitle: "Meet the Experts",
  },

  // Testimonials Section
  testimonials: {
    title: "What Our Clients Say",
    subtitle: "Real Stories, Real Results",
  },

  // Common
  common: {
    loading: "Loading...",
    error: "Something went wrong",
    learnMore: "Learn More",
    viewAll: "View All",
    backToTop: "Back to Top",
    scrollDown: "Scroll Down",
  },
};
