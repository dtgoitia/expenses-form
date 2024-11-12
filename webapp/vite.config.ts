import react from "@vitejs/plugin-react-swc";
import type { UserConfig as ViteConfig } from "vite";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import { VitePWA } from "vite-plugin-pwa";
import type { InlineConfig as VitestConfig } from "vitest";

const port = 3000;

// rationale: https://stackoverflow.com/a/74453402/8038693
interface FullConfig extends ViteConfig {
  test: VitestConfig;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      // e.g. use TypeScript check
      typescript: true,
    }),
    VitePWA({
      devOptions: { enabled: true },

      registerType: "prompt", // default

      workbox: {
        globPatterns: [
          "**/*.{js,css,html}", // default
        ],
      },
    }),
  ],
  server: {
    port,
    host: true, // expose in LAN -- needed to run containerized
  },
  preview: {
    port,
    host: true, // expose in LAN
  },
  base: "/expenses-form",
  test: {
    environment: "jsdom",
    globals: true,
  },
} as FullConfig);
