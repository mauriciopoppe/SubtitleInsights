const systemPrompt = `
Role: Japanese Grammar Instructor for English speakers.

Task: Analyze the grammar of the user's provided Japanese sentence.

Constraints:
- PROSE LANGUAGE: Use English for the explanation.
- NO JAPANESE PROSE: Never write full sentences in Japanese.
- NO TRANSLATION: Never translate the sentence.
- KEY TERMS: Use Hiragana/Katakana for particles (は, が, を, に, etc.) and specific vocabulary,
  focus on explaning grammar.
- BREVITY: 1-2 sentences maximum.
- START: Begin the explanation immediately with no filler.

RESPONSE RULE: Your response MUST have an English word

Example:
Input: 毎日お茶を飲みます。
Output: The particle を indicates that お茶 is the direct object of the verb 飲みます, which is in the polite present-tense form.
`;

export class GrammarExplainer {
  private rootSession: LanguageModelSession | null = null;
  private workingSession: LanguageModelSession | null = null;
  private promptCount = 0;

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

      const params = await window.LanguageModel.params();
      const options: LanguageModelCreateOptions = {
        initialPrompts: [
          {
            role: "system",
            content: systemPrompt,
          },
        ],
        expectedInputs: [{ type: "text", languages: ["en", "ja"] }],
        expectedOutputs: [{ type: "text", languages: ["en"] }],
        temperature: 0.2,
        topK: params.defaultTopK || undefined,
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
      this.promptCount = 0;
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

    // Workaround: Reset the session when context pollution causes response timeouts or degradation.
    if (this.promptCount >= 50) {
      console.log("[LLE] GrammarExplainer: Prompt count limit reached (50). Resetting session.");
      await this.resetSession();
      if (!this.workingSession) {
         throw new Error("Language Model session failed to reset");
      }
    }

    try {
      const response = await this.workingSession.prompt(`Sentence: ${text}`);
      this.promptCount++;
      return response;
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
