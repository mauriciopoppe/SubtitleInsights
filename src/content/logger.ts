import debug from 'debug'

export const aiLogger = debug('si:ai')
export const contentLogger = debug('si:content')
export const bgLogger = debug('si:bg')
export const videoLogger = debug('si:video')
export const storeLogger = debug('si:store')

// Enable logging if the flag is set in localStorage (for content scripts)
// Note: In Chrome extensions, content scripts have their own localStorage.
// We will also provide a way to enable this via the settings UI.
export const enableDebug = (namespaces = 'si:*') => {
  debug.enable(namespaces)
}

export const disableDebug = () => {
  debug.disable()
}
