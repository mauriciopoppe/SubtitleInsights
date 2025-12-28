export type AIAvailability = "readily" | "after-download" | "no";

export interface AISegment {
  word: string;
  reading?: string;
}

const FORCE_MOCK = false; // Set to true for development on non-compatible browsers

const SEGMENTATION_SYSTEM_PROMPT = `You are a Japanese linguistic expert. Segment the following Japanese sentence into words and provide furigana for Kanji.
Format: JSON array of objects.
Object schema: { "word": string, "reading"?: string }
RULES:
1. 'reading' property is MANDATORY for any word containing Kanji.
2. 'reading' must be in Hiragana.
3. Omit 'reading' ONLY if the word is purely Hiragana/Katakana/Punctuation.
Example:
Input: 日本語を勉強します
Output: [{"word": "日本語", "reading": "にほんご"}, {"word": "を"}, {"word": "勉強", "reading": "べんきょう"}, {"word": "します"}]
Return ONLY the JSON array.`;

export class AIClient {
  private session: any = null;
  private segmentationSession: any = null;
  public isDownloading = false;
  private availability: AIAvailability | null = null;

  async getAvailability(): Promise<AIAvailability> {
    if (FORCE_MOCK) return "no";
    if (this.availability) return this.availability;

    // @ts-ignore
    const lm = window.LanguageModel;
    if (!lm) return "no";

    try {
      const status = await lm.availability();
      if (status === "unavailable") return "no";
      this.availability = status as AIAvailability;
      return this.availability!;
    } catch (e) {
      console.error("[LLE][AIClient] Availability check failed", e);
      return "no";
    }
  }

  async isAvailable(): Promise<boolean> {
    const availability = await this.getAvailability();
    return availability !== "no";
  }

  async getSession(
    systemPrompt: string,
    type: "translation" | "segmentation" = "translation",
  ) {
    if (type === "translation" && this.session) return this.session;
    if (type === "segmentation" && this.segmentationSession)
      return this.segmentationSession;

    const availability = await this.getAvailability();
    if (availability === "no") {
      throw new Error("AI Language Model is not available");
    }

    if (availability === "after-download") {
      this.isDownloading = true;
    }

    try {
      // @ts-ignore
      const session = await window.LanguageModel.create({
        initialPrompts: [{ role: "system", content: systemPrompt }],
        monitor(m: any) {
          m.addEventListener("downloadprogress", (e: any) => {
            console.log(
              `[LLE][AIClient] Download progress: ${e.loaded}/${e.total}`,
            );
          });
        },
      });

      if (type === "translation") this.session = session;
      else this.segmentationSession = session;

      return session;
    } finally {
      this.isDownloading = false;
    }
  }

  async segment(text: string): Promise<AISegment[]> {
    const availability = await this.getAvailability();
    if (availability === "no") {
      return [{ word: text }];
    }

    try {
      const session = await this.getSession(
        SEGMENTATION_SYSTEM_PROMPT,
        "segmentation",
      );
      const result = await session.prompt([{ role: "user", content: text }]);
      return this.parseAISubtitleResponse(result.trim(), text);
    } catch (e) {
      console.error("[LLE][AIClient] Segmentation failed", e);
      this.segmentationSession = null;
      return [{ word: text }];
    }
  }

  private parseAISubtitleResponse(
    response: string,
    originalText: string,
  ): AISegment[] {
    try {
      // Remove any markdown code block markers if present
      const cleaned = response
        .replace(/^```json\n?/, "")
        .replace(/\n?```$/, "")
        .trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [{ word: originalText }];
    } catch (e) {
      console.error(
        "[LLE][AIClient] Failed to parse AI response as JSON",
        response,
        e,
      );
      return [{ word: originalText }];
    }
  }

  async translate(
    text: string,
    mode: "literal" | "natural" = "natural",
  ): Promise<string> {
    const availability = await this.getAvailability();
    if (availability === "no") {
      console.warn(
        "[LLE][AIClient] Prompt API not available. Using MOCK translation.",
      );
      return `[MOCK] ${text} (Translated)`;
    }

    const systemPrompt =
      mode === "natural"
        ? "You are a Japanese to English translator. Provide a natural, fluent English translation of the following Japanese text. Provide ONLY the translation."
        : "You are a Japanese to English translator. Provide a literal, word-for-word English translation of the following Japanese text to help a student understand the grammar. Provide ONLY the translation.";

    try {
      const session = await this.getSession(systemPrompt);
      const result = await session.prompt([{ role: "user", content: text }]);
      return result.trim();
    } catch (e) {
      console.error("[LLE][AIClient] Translation failed", e);
      // Reset session on error as it might be corrupted
      this.session = null;
      throw e;
    }
  }

  async testPromptAPI() {
    try {
      const availability = await this.getAvailability();
      console.log("[AIClient] Prompt API Availability Status:", availability);
      if (availability !== "no") {
        const result = await this.translate("こんにちは、元気ですか？");
        console.log("[AIClient] Test translation:", result);
      }
    } catch (e) {
      console.error("[AIClient] Test failed", e);
    }
  }
}

export const aiClient = new AIClient();
