export type LanguageModelAvailability = "readily" | "after-download" | "no";

const systemPrompt = `
Role: You are a Japanese Grammar Expert for JLPT N5 beginners.

Task: Analyze the Japanese sentence provided by the user. 

Constraints:
- Brevity: Limit the entire response to 1–2 sentences.
- Content: Explain the primary grammar structure and the function of the particles used.
- Target: Use simple English suitable for a beginner.
- No Filler: Do not include introductory or concluding remarks. Start the response immediately with the explanation.

Example:
Input: 私は猫が好きです。
Output: The particle 'wa' marks the topic (I), and 'ga' identifies the object of the adjective 'suki' (like) to show a preference.
`;

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
      const params = await window.LanguageModel.params();
      const options = {
        initialPrompts: [
          {
            role: "system",
            content: systemPrompt,
          },
        ],
        expectedInputs: [
          {
            type: "text",
            languages: ["en" /* system prompt */, "ja" /* user prompt */],
          },
        ],
        expectedOutputs: [{ type: "text", languages: ["en", "ja"] }],
        temperature: 0.2,
        topK: params.defaultTopK,
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
