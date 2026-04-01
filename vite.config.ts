import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import preact from '@preact/preset-vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
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
      preact: 'preact'
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
