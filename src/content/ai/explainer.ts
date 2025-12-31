import { ProfileManager } from "../profiles";
import { store } from "../store";

const SUPPORTED_LANGUAGES = ["en", "ja", "es"];

export class GrammarExplainer {
  private rootSession: LanguageModelSession | null = null;
  private workingSession: LanguageModelSession | null = null;
  private promptCount = 0;

  async checkAvailability(): Promise<LanguageModelAvailability> {
    try {
      if (typeof window.LanguageModel !== "undefined") {
        const profile = await ProfileManager.getActiveProfile();
        
        const isSourceSupported = SUPPORTED_LANGUAGES.includes(profile.sourceLanguage);
        const isTargetSupported = SUPPORTED_LANGUAGES.includes(profile.targetLanguage);

        if (!isSourceSupported || !isTargetSupported) {
          const unsupported = !isSourceSupported ? profile.sourceLanguage : profile.targetLanguage;
          store.setWarning(`Language Model does not support "${unsupported}". Only en, ja, es are supported.`);
          return "unavailable";
        }

        return await window.LanguageModel.availability({
          languages: [profile.targetLanguage, profile.sourceLanguage],
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

      const profile = await ProfileManager.getActiveProfile();

      const isSourceSupported = SUPPORTED_LANGUAGES.includes(profile.sourceLanguage);
      const isTargetSupported = SUPPORTED_LANGUAGES.includes(profile.targetLanguage);

      if (!isSourceSupported || !isTargetSupported) {
        return false;
      }

      const params = await window.LanguageModel.params();
      const options: LanguageModelCreateOptions = {
        initialPrompts: [
          {
            role: "system",
            content: profile.systemPrompt,
          },
        ],
        expectedInputs: [
          {
            type: "text",
            languages: [
              "en" /* system prompt, must always be in english*/,
              profile.sourceLanguage,
            ],
          },
        ],
        expectedOutputs: [
          { type: "text", languages: [profile.targetLanguage] },
        ],
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
      console.log(
        "[LLE] GrammarExplainer: Prompt count limit reached (50). Resetting session.",
      );
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
