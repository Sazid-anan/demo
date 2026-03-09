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
        let html = await readFile(htmlPath, "utf8");

        // Inject modulepreload for entry JS chunk to break dependency chain
        const entryJsMatch = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
        if (entryJsMatch) {
          const entryJs = entryJsMatch[1];
          html = html.replace(
            "</head>",
            `<link rel="modulepreload" href="${entryJs}">\n</head>`,
          );
        }

        // Run critters for critical CSS inlining and preload strategy
        const critters = new Critters({
          path: path.resolve(process.cwd(), "dist"),
          preload: "swap",
          pruneSource: true,
          compress: true,
          mergeStylesheets: true,
        });
        let optimizedHtml = await critters.process(html);

        // Remove existing asset CSS noscript fallbacks first to avoid nested noscript tags.
        optimizedHtml = optimizedHtml.replace(
          /<noscript>\s*<link[^>]*href=["']((?:\/)?assets\/[^"']+\.css)["'][^>]*>\s*<\/noscript>/g,
          "",
        );

        // Force any remaining asset stylesheet links to non-blocking preload pattern.
        optimizedHtml = optimizedHtml.replace(
          /<link([^>]*?)rel=["']stylesheet["']([^>]*?)href=["']((?:\/)?assets\/[^"']+\.css)["']([^>]*)>/g,
          (_match, before, between, href, after) => {
            const attrs = `${before} ${between} ${after}`;
            const hasCrossorigin = /\bcrossorigin\b/.test(attrs);
            const crossorigin = hasCrossorigin ? " crossorigin" : "";

            return `<link rel="preload" as="style" href="${href}"${crossorigin} onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="${href}"${crossorigin}></noscript>`;
          },
        );

        await writeFile(htmlPath, optimizedHtml, "utf8");
        console.log(
          "Critical CSS inlined and non-blocking CSS fallback applied",
        );
      } catch (error) {
        console.warn("CSS optimization:", error.message);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), crittersInlinePlugin()],
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
        // Simplified code splitting - only 2 chunks (entry + vendor)
        manualChunks(id) {
          // All node_modules go into single vendor chunk
          if (id.includes("node_modules")) {
            return "vendor";
          }
          // All other code stays in main
        },
        // Prevent automatic chunk splitting
      },
    },
    // Performance tweaks
    chunkSizeWarningLimit: 1000,
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
    // Exclude to reduce pre-bundle size
    exclude: ["firebase"],
  },
});
