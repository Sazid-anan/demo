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
      /* Responsive Breakpoints - Mobile-First Approach */
      screens: {
        xs: "0px", // Mobile (default/base): 0-575px
        sm: "576px", // Tablet: 576px+
        md: "750px", // Tablet mid-point: 750px+
        lg: "992px", // Desktop: 992px+
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
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        /* Standard Typography Scale - Mobile-First Responsive */
        xs: "0.75rem" /* 12px - Small text/captions */,
        sm: "0.875rem" /* 14px - Small body text */,
        base: "1rem" /* 16px - Body text (default) */,
        lg: "1.125rem" /* 18px - Large body text */,
        xl: "1.25rem" /* 20px - Extra large text */,
        "2xl": "1.5rem" /* 24px - Headings h4 */,
        "3xl": "1.875rem" /* 30px - Headings h3 */,
        "4xl": "2.25rem" /* 36px - Headings h2 */,
        "5xl": "3rem" /* 48px - Headings h1 */,
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
