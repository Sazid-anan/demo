/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    "./public/**/*.html",
    "./src/**/**/*.js",
    "./src/**/**/*.jsx",
    "./src/**/**/*.ts",
    "./src/**/**/*.tsx",
  ],
  theme: {
    extend: {
      /* Jacobs-style Responsive Breakpoints (Bootstrap) */
      screens: {
        xs: "0px", // Mobile (default/base)
        sm: "576px", // Tablet start
        md: "768px", // Tablet mid-point
        lg: "992px", // Laptop/Desktop start
        xl: "1200px", // Desktop 1080p
        xxl: "1400px", // Ultra-wide/4K
      },
      colors: {
        /* Design System Colors */
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        border: "var(--border)",
        ring: "var(--ring)",
        destructive: "#d4183d",
        "destructive-foreground": "#ffffff",

        /* Legacy colors for backward compatibility */
        "dark-gray": "#333333",
        "soft-gray": "#f5f5f5",
        "light-gray": "#e8e8e8",
        "edge-blue": "#0066cc",
        "brand-orange": "#ff6600",
        "brand-black": "#1a1a1a",
        "brand-white": "#ffffff",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        /* Jacobs-inspired typography system (62.5% base = 1rem = 10px) */
        xs: "0.8rem" /* 8px */,
        sm: "1rem" /* 10px */,
        base: "1.6rem" /* 16px - Jacobs body font */,
        lg: "1.8rem" /* 18px */,
        xl: "2rem" /* 20px - Jacobs h3 */,
        "2xl": "2.5rem" /* 25px - Jacobs feature h3 */,
        "3xl": "3.5rem" /* 35px - Jacobs section header h2 */,
        "4xl": "4.8rem" /* 48px */,
      },
      borderRadius: {
        xl: "0.625rem",
      },
      textColor: {
        DEFAULT: "var(--foreground)",
      },
      /* Jacobs-inspired responsive spacing (62.5% base) */
      spacing: {
        1.04: "1.04rem",
        1.6: "1.6rem",
        1.68: "1.68rem",
        1.76: "1.76rem",
        1.92: "1.92rem",
        2.4: "2.4rem",
        2.55: "2.55rem",
        2.56: "2.56rem",
        3.04: "3.04rem",
        3.2: "3.2rem",
        4: "4rem",
        4.8: "4.8rem",
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      maxWidth: {
        /* Jacobs page dimensions */
        navbar: "1920px" /* Navbar max-width */,
        content: "1332px" /* Content max-width */,
        menu: "1356px" /* Menu max-width */,
      },
    },
  },
  plugins: [],
};
