/**
 * TypeScript definitions for the experimental Chrome AI APIs.
 * Most of these are now provided by @types/dom-chromium-ai.
 */

declare global {
  interface Window {
    readonly LanguageModel: typeof LanguageModel
    readonly LanguageDetector: typeof LanguageDetector
    readonly Translator: typeof Translator
  }
}

export {}
