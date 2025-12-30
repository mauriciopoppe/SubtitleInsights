import { defineConfig } from "vite"
import { crx } from "@crxjs/vite-plugin"
import preact from "@preact/preset-vite"
import manifest from "./manifest.json"

export default defineConfig({
  plugins: [preact(), crx({ manifest })],
  resolve: {
    alias: {
      "preact/hooks": "preact/hooks",
      "preact": "preact",
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
})
