import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import Critters from "critters";

function crittersInlinePlugin() {
  return {
    name: "critters-inline-css",
    apply: "build",
    async closeBundle() {
      const htmlPath = path.resolve(process.cwd(), "dist/index.html");

      try {
        const html = await readFile(htmlPath, "utf8");
        const critters = new Critters({
          path: path.resolve(process.cwd(), "dist"),
          preload: "swap",
        });
        const optimizedHtml = await critters.process(html);
        await writeFile(htmlPath, optimizedHtml, "utf8");
      } catch {
        // Skip critical CSS inlining when dist output is missing.
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), crittersInlinePlugin()],
  server: {
    proxy: {
      // Local dev proxy to avoid browser CORS restrictions for API calls.
      "/api": {
        target: "https://danvion.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        dead_code: true,
        passes: 2,
      },
      mangle: true,
    },
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
        // Optimized code splitting - separate chunks by type
        manualChunks(id) {
          // Vendor: React ecosystem (core)
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom")
          ) {
            return "vendor-react";
          }
          // Vendor: State management
          if (id.includes("@reduxjs/toolkit") || id.includes("react-redux")) {
            return "vendor-state";
          }
          // Vendor: Routing
          if (id.includes("react-router-dom")) {
            return "vendor-router";
          }
          // Vendor: UI & Animations (heavy - load later)
          if (id.includes("framer-motion") || id.includes("lucide-react")) {
            return "vendor-ui";
          }
          // Vendor: Utilities (markdown, sanitization)
          if (id.includes("marked") || id.includes("dompurify")) {
            return "vendor-utils";
          }
          // Admin: Separate chunk - only load when admin section accessed
          if (id.includes("/admin/")) {
            return "chunk-admin";
          }
          // Pages: Route-specific chunks (don't mix with main)
          if (id.includes("/pages/")) {
            const pageName = id.match(/pages\/(\w+)/)?.[1] || "page";
            return `page-${pageName.toLowerCase()}`;
          }
          // Components: Separate UI components
          if (id.includes("/components/") && !id.includes("ErrorBoundary")) {
            return "components";
          }
          // Redux slices
          if (id.includes("/redux/slices/")) {
            return "redux-slices";
          }
          // Keep ErrorBoundary, hooks and services near main for critical functionality
        },
      },
    },
    // Performance tweaks
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    // Rollup optimizations
    modulePreload: { polyfill: false },
    // Target modern browsers only (reduces polyfills)
    target: ["es2020", "edge88", "firefox78", "chrome90", "safari14"],
  },
  // Base optimization
  base: "/",
  // Optimization for dependencies - pre-bundle heavy dependencies
  optimizeDeps: {
    // Include heavy dependencies for pre-bundling
    include: [
      "react",
      "react-dom",
      "@reduxjs/toolkit",
      "react-redux",
      "react-router-dom",
      "framer-motion",
      "lucide-react",
      "marked",
      "dompurify",
      "react-helmet-async",
      "@reduxjs/toolkit/query",
    ],
  },
});
