import { ProfileManager } from "../profiles";
import { store } from "../store";
import { trimThinkingProcess } from "./utils";

const SUPPORTED_LANGUAGES = ["en", "ja", "es"];

export class GrammarExplainer {
  private rootSession: LanguageModelSession | null = null;
  private workingSession: LanguageModelSession | null = null;

  async checkAvailability(): Promise<LanguageModelAvailability> {
    try {
      if (typeof window.LanguageModel !== "undefined") {
        const profile = await ProfileManager.getActiveProfile();

        const isSourceSupported = SUPPORTED_LANGUAGES.includes(
          profile.sourceLanguage,
        );
        const isTargetSupported = SUPPORTED_LANGUAGES.includes(
          profile.targetLanguage,
        );

        let sourceLangForModel = profile.sourceLanguage;
        if (!isSourceSupported) {
          sourceLangForModel = "en";
        }

        if (!isTargetSupported) {
          store.setWarning(
            `Target language "${profile.targetLanguage}" not supported by Explainer. Only en, ja, es are supported.`,
          );
          return "unavailable";
        }
        if (!isSourceSupported) {
          store.setWarning(
            `Source language "${profile.sourceLanguage}" not supported by Explainer. Falling back to "en" for analysis.`,
          );
        }

        return await window.LanguageModel.availability({
          languages: [profile.targetLanguage, sourceLangForModel],
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

      const isSourceSupported = SUPPORTED_LANGUAGES.includes(
        profile.sourceLanguage,
      );

      if (!isSourceSupported) {
        store.setWarning(
          `Source language "${profile.sourceLanguage}" not supported by Explainer. Falling back to "en".`,
        );
      }

      const sourceLangForModel = isSourceSupported
        ? profile.sourceLanguage
        : "en";

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
            languages: [profile.targetLanguage, sourceLangForModel],
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
      console.log("[SI] GrammarExplainer: Session reset via clone.");
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

    const { inputUsage, inputQuota } = this.workingSession;
    if (inputUsage / inputQuota > 0.8) {
      // Reset if usage exceeds 80%
      console.log(
        `[SI] GrammarExplainer: Input usage at ${inputUsage}/${inputQuota}. Resetting session.`,
      );
      await this.resetSession();
      if (!this.workingSession) {
        throw new Error("Language Model session failed to reset");
      }
    }

    try {
      const response = await this.workingSession.prompt(`Sentence: ${text}`);
      return trimThinkingProcess(response);
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
