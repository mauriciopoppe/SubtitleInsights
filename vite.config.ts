import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import preact from '@preact/preset-vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'
import manifest from './manifest.json'

export default defineConfig({
  plugins: [
    preact(),
    crx({ manifest }),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/kuromoji/dict/*.dat.gz',
          dest: 'dict'
        }
      ]
    })
  ],
  resolve: {
    alias: {
      'preact/hooks': 'preact/hooks',
      preact: 'preact',
      // kuromoji uses Node.js 'path.join' to construct dictionary paths.
      // In the browser environment, we provide a minimal shim to ensure dictionary loading works correctly.
      path: path.resolve(__dirname, 'src/content/path-shim.ts')
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173
    },
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
})
