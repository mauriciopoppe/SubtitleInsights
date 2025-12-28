export class AIClient {
  private session: any = null;

  async isAvailable(): Promise<boolean> {
    // @ts-ignore
    const capabilities = await window.ai?.languageModel?.capabilities();
    return capabilities && capabilities.available !== 'no';
  }

  async getSession(systemPrompt: string) {
    if (this.session) return this.session;

    // @ts-ignore
    this.session = await window.ai.languageModel.create({
      systemPrompt: systemPrompt
    });
    return this.session;
  }

  async translate(text: string, mode: 'literal' | 'natural' = 'natural'): Promise<string> {
    const isAvailable = await this.isAvailable();
    if (!isAvailable) {
      console.warn('[AIClient] Prompt API not available. Using MOCK translation.');
      return `[MOCK] ${text} (Translated)`;
    }

    const systemPrompt = mode === 'natural' 
      ? "You are a Japanese to English translator. Provide a natural, fluent English translation of the following Japanese text. Provide ONLY the translation."
      : "You are a Japanese to English translator. Provide a literal, word-for-word English translation of the following Japanese text to help a student understand the grammar. Provide ONLY the translation.";

    const session = await this.getSession(systemPrompt);
    try {
      const result = await session.prompt(text);
      return result.trim();
    } catch (e) {
      console.error('[AIClient] Translation failed', e);
      // Reset session on error as it might be corrupted
      this.session = null;
      throw e;
    }
  }

  async testPromptAPI() {
      try {
          const available = await this.isAvailable();
          console.log('[AIClient] Prompt API Available:', available);
          if (available) {
              const result = await this.translate('こんにちは、元気ですか？');
              console.log('[AIClient] Test translation:', result);
          }
      } catch (e) {
          console.error('[AIClient] Test failed', e);
      }
  }
}

export const aiClient = new AIClient();
