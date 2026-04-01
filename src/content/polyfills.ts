/**
 * Polyfills for browser environment to support Node.js-centric libraries like kuromoji.
 */

const pathPolyfill = {
  join: (...args: string[]) => {
    return args
      .filter(arg => !!arg)
      .join('/')
      .replace(/\/+/g, '/')
  }
}

// Attach to all possible global scopes
const g = (typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {}) as any

if (typeof g.path === 'undefined') {
  g.path = pathPolyfill
}

// Some older libs or shims might look at 'self'
if (typeof self !== 'undefined') {
  if (typeof (self as any).path === 'undefined') (self as any).path = pathPolyfill
}

// Mock require for libraries that expect it
if (typeof g.require === 'undefined') {
  g.require = (name: string) => {
    if (name === 'path') return pathPolyfill
    // We don't import kuromoji here to avoid syntax errors, 
    // it should be handled by the bundler or available globally if loaded otherwise.
    if (name === 'kuromoji') return g.kuromoji 
    throw new Error(`Mock require: module ${name} not found`)
  }
}

export {}
