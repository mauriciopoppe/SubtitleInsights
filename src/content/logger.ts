import debug from 'debug'
import { Config } from './config'

let currentVerbosity = 0

// Initialize verbosity from config if available (fails in tests where chrome is not defined)
if (typeof chrome !== 'undefined' && chrome.storage) {
  Config.get()
    .then(config => {
      if (config) {
        currentVerbosity = config.verbosity
      }
    })
    .catch(() => {
      // Ignore errors in environments where config might not be available
    })

  // Subscribe to config changes
  Config.subscribe(config => {
    if (config) {
      currentVerbosity = config.verbosity
    }
  })
}

interface LeveledLogger {
  (formatter: any, ...args: any[]): void
  V: (level: number) => { info: (formatter: any, ...args: any[]) => void }
}

const createLogger = (namespace: string): LeveledLogger => {
  const d = debug(namespace)
  const logger = (formatter: any, ...args: any[]) => {
    if (currentVerbosity >= 0) {
      d(formatter, ...args)
    }
  }

  logger.V = (level: number) => ({
    info: (formatter: any, ...args: any[]) => {
      if (currentVerbosity >= level) {
        d(formatter, ...args)
      }
    }
  })

  return logger as LeveledLogger
}

export const aiLogger = createLogger('si:ai')
export const contentLogger = createLogger('si:content')
export const bgLogger = createLogger('si:bg')
export const videoLogger = createLogger('si:video')
export const storeLogger = createLogger('si:store')

// Enable logging if the flag is set in localStorage (for content scripts)
// Note: In Chrome extensions, content scripts have their own localStorage.
// We will also provide a way to enable this via the settings UI.
export const enableDebug = (namespaces = 'si:*') => {
  debug.enable(namespaces)
}

export const disableDebug = () => {
  debug.disable()
}
