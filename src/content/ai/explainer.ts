export type LanguageModelAvailability = "readily" | "after-download" | "no";

export class GrammarExplainer {
  private session: any = null;

  async checkAvailability(): Promise<LanguageModelAvailability> {
    try {
      // @ts-ignore
      if (typeof window.LanguageModel !== "undefined") {
        // @ts-ignore
        const availability = await window.LanguageModel.availability();
        return availability;
      }

      // @ts-ignore
      if (typeof window.ai !== "undefined" && window.ai.languageModel) {
        // @ts-ignore
        const capabilities = await window.ai.languageModel.capabilities();
        return capabilities.available;
      }

      return "no";
    } catch (error) {
      console.error("Error checking language model availability:", error);
      return "no";
    }
  }

  async initialize(): Promise<boolean> {
    try {
      const options = {
        systemPrompt: "You are a Japanese grammar expert. Provide a very concise (1-2 sentences) summary of the main grammar points and particles in the provided sentence for a beginner student (JLPT N5 level). Focus on brevity and clarity. Do not use conversational filler.",
        temperature: 0,
        topK: 1
      };

      // @ts-ignore
      if (typeof window.LanguageModel !== "undefined") {
        // @ts-ignore
        this.session = await window.LanguageModel.create(options);
        return true;
      }

      // @ts-ignore
      if (typeof window.ai !== "undefined" && window.ai.languageModel) {
        // @ts-ignore
        this.session = await window.ai.languageModel.create(options);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error initializing language model:", error);
      return false;
    }
  }

  async destroy() {
    if (this.session) {
      // @ts-ignore
      await this.session.destroy();
      this.session = null;
    }
  }

  async explainGrammar(text: string): Promise<string> {
    if (!this.session) {
      throw new Error("Language Model session not initialized");
    }

    try {
      // @ts-ignore
      const result = await this.session.prompt(text);
      return result;
    } catch (error) {
      console.error("Error explaining grammar:", error);
      throw error;
    }
  }

  isReady(): boolean {
    return this.session !== null;
  }
}

export const grammarExplainer = new GrammarExplainer();
