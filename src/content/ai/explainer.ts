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
  private rootSession: LanguageModelSession | null = null;
  private workingSession: LanguageModelSession | null = null;

  async checkAvailability(): Promise<LanguageModelAvailability> {
    try {
      if (typeof window.LanguageModel !== "undefined") {
        return await window.LanguageModel.availability({
          languages: ["en", "ja"],
        });
      }
      return "unavailable";
    } catch (error) {
      console.error("Error checking language model availability:", error);
      return "unavailable";
    }
  }

  async initialize(): Promise<boolean> {
    try {
      if (this.rootSession) {
        return true;
      }

      if (typeof window.LanguageModel === "undefined") {
        return false;
      }

      const caps = await window.LanguageModel.capabilities();
      const options: LanguageModelCreateOptions = {
        systemPrompt: systemPrompt,
        temperature: 0.2,
        topK: caps.defaultTopK || undefined,
      };

      this.rootSession = await window.LanguageModel.create(options);

      if (this.rootSession) {
        await this.resetSession();
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error initializing language model:", error);
      return false;
    }
  }

  async resetSession() {
    if (!this.rootSession) {
      await this.initialize();
      return;
    }

    try {
      if (this.workingSession) {
        this.workingSession.destroy();
        this.workingSession = null;
      }

      this.workingSession = await this.rootSession.clone();
      console.log("[LLE] GrammarExplainer: Session reset via clone.");
    } catch (error) {
      console.error("Error resetting grammar explainer session:", error);
    }
  }

  async destroy() {
    if (this.workingSession) {
      this.workingSession.destroy();
      this.workingSession = null;
    }
    if (this.rootSession) {
      this.rootSession.destroy();
      this.rootSession = null;
    }
  }

  async explainGrammar(text: string): Promise<string> {
    if (!this.workingSession) {
      throw new Error("Language Model session not initialized");
    }

    try {
      return await this.workingSession.prompt(`Sentence: ${text}`);
    } catch (error) {
      console.error("Error explaining grammar:", error);
      throw error;
    }
  }

  isReady(): boolean {
    return this.workingSession !== null;
  }
}

export const grammarExplainer = new GrammarExplainer();
