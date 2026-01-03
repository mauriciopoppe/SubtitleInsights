/**
 * Global entry point for the Built-in AI Prompt API.
 * Accessible via `window.LanguageModel` or `window.ai.languageModel`.
 */
declare global {
  interface DownloadMonitor extends EventTarget {
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
      type: 'downloadprogress',
      listener: (event: { loaded: number; total: number }) => void,
    ): void;
  }
}

declare global {
  interface Window {
    readonly LanguageModel: LanguageModelStatic;
  }

  // --- Capabilities and Availability ---
  type LanguageModelAvailability = 'available' | 'downloadable' | 'unavailable'

  interface LanguageModelCapabilities {
    readonly available: LanguageModelAvailability;
    readonly defaultTopK: number | null;
    readonly maxTopK: number | null;
    readonly defaultTemperature: number | null;
    readonly maxTemperature: number | null;
  }

  // --- Multimodal & Multilingual Configuration ---
  type LanguageModelModality = 'text' | 'image' | 'audio'

  interface LanguageModelInputConstraint {
    type: LanguageModelModality;
    /** BCP 47 tags. Current support: "en", "ja", "es". */
    languages?: string[];
  }

  interface LanguageModelOutputConstraint {
    type: 'text'; // Currently, output is restricted to text
    languages?: string[];
  }

  // --- Creation Options ---
  interface LanguageModelCreateOptions {
    systemPrompt?: string;
    initialPrompts?: LanguageModelPrompt[];

    languages?: string[];
    expectedInputs?: LanguageModelInputConstraint[];
    expectedOutputs?: LanguageModelOutputConstraint[];

    temperature?: number;
    topK?: number;
    signal?: AbortSignal;
    monitor?: (m: DownloadMonitor) => void;
  }

  interface LanguageModelPrompt {
    role: 'system' | 'user' | 'assistant';
    content: string;
    /** If true, allows the model to continue a partial assistant response. */
    prefix?: boolean;
  }

  // --- The Core API ---
  interface LanguageModelStatic {
    availability(
      options?: LanguageModelCreateOptions,
    ): Promise<LanguageModelAvailability>;
    capabilities(): Promise<LanguageModelCapabilities>;
    /** Older alias for capabilities(). */
    params(): Promise<LanguageModelCapabilities>;
    create(options?: LanguageModelCreateOptions): Promise<LanguageModelSession>;
  }

  interface LanguageModelSession {
    /** * The total capacity of the session's context window.
     * This is implementation-dependent (usually tokens).
     */
    readonly inputQuota: number;

    /** * How much of the quota has been consumed by the current
     * history and system prompt.
     */
    readonly inputUsage: number;

    /** Sends a prompt and waits for the full response. */
    prompt(
      input: string | Array<string | Blob>,
      options?: LanguageModelPromptOptions,
    ): Promise<string>;

    /** Sends a prompt and returns a stream of text chunks. */
    promptStreaming(
      input: string | Array<string | Blob>,
      options?: LanguageModelPromptOptions,
    ): ReadableStream<string>;

    /** * Reports how much of the quota a specific input would consume
     * BEFORE you actually send it.
     */
    measureInputUsage(input: string): Promise<number>;

    clone(): Promise<LanguageModelSession>;
    destroy(): void;
  }

  interface LanguageModelPromptOptions {
    signal?: AbortSignal;
  }
}

/**
 * TypeScript definitions for the experimental Chrome Language Detector API.
 * This API is part of the Built-in AI initiative.
 */
declare global {
  interface Window {
    readonly LanguageDetector: LanguageDetectorStatic;
  }

  type LanguageDetectorAvailability = 'available' | 'downloadable' | 'no'

  interface LanguageDetectorStatic {
    /** * Checks if the language detection model is available,
     * needs to be downloaded, or is unsupported.
     */
    availability(
      options?: LanguageDetectorCreateOptions,
    ): Promise<LanguageDetectorAvailability>;

    /** * Returns the capabilities of the detector, including availability status.
     */
    capabilities(): Promise<LanguageDetectorCapabilities>;

    /** * Initializes a new LanguageDetector session.
     */
    create(options?: LanguageDetectorCreateOptions): Promise<LanguageDetector>;
  }

  interface LanguageDetectorCapabilities {
    readonly available: LanguageDetectorAvailability;
  }

  interface LanguageDetectorCreateOptions {
    /** * Providing a list of BCP 47 language tags can help the implementation
     * optimize by downloading specific language packs if needed.
     */
    expectedInputLanguages?: string[];
    /** An AbortSignal to cancel the creation process. */
    signal?: AbortSignal;
    /** Callback to monitor the download progress of the model. */
    monitor?: (m: DownloadMonitor) => void;
  }

  interface LanguageDetector extends EventTarget {
    /** * Detects the language of the provided text.
     * Returns an array of results sorted by confidence (highest first).
     */
    detect(text: string): Promise<LanguageDetectorResult[]>;

    /**
     * Estimates how many tokens/resources the input text will consume.
     */
    measureInputUsage(text: string): Promise<number>;

    /** * Explicitly destroys the detector and frees up memory.
     */
    destroy(): void;

    /** The languages the detector was optimized for during creation. */
    readonly expectedInputLanguages: ReadonlyArray<string>;
  }

  interface LanguageDetectorResult {
    /** BCP 47 language tag (e.g., "en", "ja", "fr"). */
    detectedLanguage: string;
    /** Confidence score between 0.0 and 1.0. */
    confidence: number;
  }
}

export {}
