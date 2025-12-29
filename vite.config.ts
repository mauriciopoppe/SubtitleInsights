import { defineConfig } from "vite"
import { crx } from "@crxjs/vite-plugin"
import manifest from "./manifest.json"

export default defineConfig({
  plugins: [crx({ manifest })],
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
