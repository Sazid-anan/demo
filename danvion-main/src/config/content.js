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
    email: "support@danvion.com",
    location: "128 City Road, London, EC1V 2NX, GB",
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
    title: "Our Engineering",
    subtitle: "Capabilities",
    description:
      "From hardware design to edge AI deployment, we deliver complete engineering solutions that bring intelligent products to life.",
    items: [
      {
        title: "System Architecture",
        icon: "zap",
      },
      {
        title: "PCB Design & Layout",
        icon: "circuit-board",
      },
      {
        title: "Signal & Power Integrity",
        icon: "signal",
      },
      {
        title: "Firmware Development",
        icon: "code",
      },
      {
        title: "IoT Connectivity",
        icon: "smartphone",
      },
      {
        title: "Edge AI Integration",
        icon: "brain",
      },
    ],
    dropdownCategories: [
      {
        name: "EMBEDDED SYSTEMS",
        items: [
          {
            title: "Edge AI Integration",
            description:
              "Deploy intelligent processing at the edge for real-time insights.",
            icon: "cpu",
          },
          {
            title: "PCB Design & Layout",
            description: "Custom circuit board layouts for robust hardware.",
            icon: "circuit-board",
          },
          {
            title: "Firmware Development",
            description: "Optimized code for seamless device performance.",
            icon: "code",
          },
        ],
      },
      {
        name: "CONNECTIVITY",
        items: [
          {
            title: "IoT Connectivity",
            description:
              "Connect devices securely for scalable networks and remote monitoring.",
            icon: "wifi",
          },
          {
            title: "Signal & Power Integrity",
            description:
              "Maintain reliable data transmission and clean power delivery across complex systems.",
            icon: "zap",
          },
          {
            title: "Protocol Integration",
            description:
              "Integrate BLE, Wi-Fi, LoRa, and cellular protocols for production-ready connected products.",
            icon: "activity",
          },
        ],
      },
      {
        name: "ENGINEERING SERVICES",
        items: [
          {
            title: "System Architecture",
            description:
              "Define scalable hardware and software foundations before implementation begins.",
            icon: "network",
          },
          {
            title: "Rapid Prototyping",
            description:
              "Accelerate development with fast iteration, validation, and proof-of-concept builds.",
            icon: "hammer",
          },
          {
            title: "Technical Consulting",
            description:
              "Get senior engineering guidance for complex product decisions and delivery planning.",
            icon: "lightbulb",
          },
        ],
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

  // Shared Descriptions (Used across multiple sections)
  sharedDescriptions: {
    engineeringSolutions:
      "From hardware design to edge AI deployment, we deliver complete engineering solutions that bring intelligent products to life.",
  },
};
