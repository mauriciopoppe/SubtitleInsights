export type LanguageModelAvailability = "readily" | "after-download" | "no";

const systemPrompt = `
Role: Japanese Grammar Instructor for English speakers.

Task: Analyze the grammar of the user's provided Japanese sentence.

Constraints:
- PROSE LANGUAGE: Use English for the explanation.
- KEY TERMS: Use Hiragana/Katakana for particles (は, が, を, に, etc.) and specific vocabulary.
- NO TRANSLATION: Do not provide an English translation of the sentence.
- BREVITY: 1-2 sentences maximum.
- START: Begin the explanation immediately with no filler.

Example:
Input: 毎日お茶を飲みます。
Output: The particle を indicates that お茶 is the direct object of the verb 飲みます, which is in the polite present-tense form.
`;

export class GrammarExplainer {
  private session: any = null;

  async checkAvailability(): Promise<LanguageModelAvailability> {
    try {
      // @ts-ignore
      if (typeof window.LanguageModel !== "undefined") {
        // @ts-ignore
        const availability = await window.LanguageModel.availability({
          languages: ["en", "ja"],
        });
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
      const result = await this.session.prompt(`Sentence: ${text}`);
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
