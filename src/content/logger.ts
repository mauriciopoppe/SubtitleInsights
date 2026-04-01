import debug from 'debug'

let currentVerbosity = 0

interface LeveledLogger {
  (formatter: string | object, ...args: unknown[]): void
  V: (level: number) => { info: (formatter: string | object, ...args: unknown[]) => void }
}

const createLogger = (namespace: string): LeveledLogger => {
  const d = debug(namespace)
  const logger = (formatter: string | object, ...args: unknown[]) => {
    // Default to logging if no verbosity check is used
    if (currentVerbosity >= 0) {
      d(formatter, ...args)
    }
  }

  logger.V = (level: number) => ({
    info: (formatter: string | object, ...args: unknown[]) => {
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

/**
 * Updates the current verbosity level.
 */
export const setVerbosity = (level: number) => {
  currentVerbosity = level
}

/**
 * Initializes the logger with values from Config.
 * This is separate to avoid circular dependencies.
 */
export const initLogger = (config: { verbosity: number; isDebugMode: boolean }) => {
  setVerbosity(config.verbosity)
  if (config.isDebugMode) {
    enableDebug()
  } else {
    disableDebug()
  }
}

// Enable logging if the flag is set in localStorage (for content scripts)
export const enableDebug = (namespaces = 'si:*') => {
  debug.enable(namespaces)
}

export const disableDebug = () => {
  debug.disable()
}
