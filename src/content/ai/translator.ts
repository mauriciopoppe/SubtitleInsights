export type TranslationAvailability =
  | "available"
  | "downloadable"
  | "downloading"
  | "unavailable";

export class MyTranslator {
  private translator: any = null;
  private sourceLanguage: string;
  private targetLanguage: string;

  constructor(sourceLanguage: string = "ja", targetLanguage: string = "en") {
    this.sourceLanguage = sourceLanguage;
    this.targetLanguage = targetLanguage;
  }

  async checkAvailability(): Promise<TranslationAvailability> {
    // @ts-ignore
    if (typeof Translator === "undefined") {
      return "unavailable";
    }

    // @ts-ignore
    return await Translator.availability({
      sourceLanguage: this.sourceLanguage,
      targetLanguage: this.targetLanguage,
    });
  }

  async initialize(
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<boolean> {
    try {
      // @ts-ignore
      if (typeof Translator === "undefined") {
        return false;
      }

      const options: any = {
        sourceLanguage: this.sourceLanguage,
        targetLanguage: this.targetLanguage,
      };

      if (onProgress) {
        options.monitor = (m: any) => {
          m.addEventListener("downloadprogress", (e: any) => {
            onProgress(e.loaded, e.total);
          });
        };
      }

      // @ts-ignore
      this.translator = await Translator.create(options);

      return true;
    } catch (error) {
      console.error("Error initializing translator:", error);
      return false;
    }
  }

  async translate(text: string): Promise<string> {
    if (!this.translator) {
      throw new Error("Translator not initialized");
    }

    try {
      return await this.translator.translate(text);
    } catch (error) {
      console.error("Error translating text:", error);
      throw error;
    }
  }

  isReady(): boolean {
    return this.translator !== null;
  }
}

export const translatorService = new MyTranslator();
