/**
 * Global entry point for the Built-in AI Prompt API.
 * Accessible via `window.LanguageModel` or `window.ai.languageModel`.
 */
declare global {
  interface Window {
    readonly LanguageModel: LanguageModelStatic;
  }

  // Common types for availability and capabilities
  type LanguageModelAvailability = "available" | "downloadable" | "unavailable";

  interface LanguageModelCapabilities {
    readonly available: LanguageModelAvailability;
    readonly defaultTopK: number | null;
    readonly maxTopK: number | null;
    readonly defaultTemperature: number | null;
  }

  interface LanguageModelStatic {
    /** Checks if the model is available, downloadable, or unsupported. */
    availability(
      options?: LanguageModelAvailabilityOptions,
    ): Promise<LanguageModelAvailability>;

    /** Returns default and max values for temperature and topK. */
    capabilities(): Promise<LanguageModelCapabilities>;

    /** Older alias for capabilities(). */
    params(): Promise<LanguageModelCapabilities>;

    /** Initializes a new AI session. */
    create(options?: LanguageModelCreateOptions): Promise<LanguageModelSession>;
  }

  interface LanguageModelAvailabilityOptions {
    /** Optional: filter by supported languages (e.g., ["en", "ja"]). */
    languages?: string[];
  }

  interface LanguageModelCreateOptions {
    /** Initial system instructions to set the persona or behavior. */
    systemPrompt?: string;
    /** Provide multi-turn history or examples to the model. */
    initialPrompts?: LanguageModelPrompt[];
    /** A value between 0.0 and 2.0 (default is usually 1.0). */
    temperature?: number;
    /** Limits the model to the top K most likely tokens. */
    topK?: number;
    /** An AbortSignal to cancel the session creation. */
    signal?: AbortSignal;
    /** Callback to monitor the download progress of the model. */
    monitor?: (m: DownloadMonitor) => void;
  }

  interface LanguageModelPrompt {
    role: "system" | "user" | "assistant";
    content: string;
  }

  interface DownloadMonitor extends EventTarget {
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(
      type: "downloadprogress",
      listener: (event: { loaded: number; total: number }) => void
    ): void;
  }

  interface LanguageModelSession {
    /** Sends a prompt to the model and waits for the full response. */
    prompt(
      input: string,
      options?: LanguageModelPromptOptions,
    ): Promise<string>;

    /** Sends a prompt and returns a stream of text chunks. */
    promptStreaming(
      input: string,
      options?: LanguageModelPromptOptions,
    ): ReadableStream<string>;

    /** Reports how many tokens the input would consume. */
    measureInputUsage(input: string): Promise<number>;

    /** Creates a copy of the current session including context. */
    clone(): Promise<LanguageModelSession>;

    /** Explicitly destroys the session to free up memory. */
    destroy(): void;

    /** Total tokens allowed in this session. */
    readonly maxTokens: number;
    /** Tokens remaining in the current context window. */
    readonly tokensLeft: number;
    /** Tokens consumed so far in the session. */
    readonly tokensSoFar: number;
  }

  interface LanguageModelPromptOptions {
    /** An AbortSignal to cancel the specific prompt request. */
    signal?: AbortSignal;
  }
}

export {};
