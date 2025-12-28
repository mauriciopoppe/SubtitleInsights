export type AIAvailability = "readily" | "after-download" | "no";

export interface AISegment {
  word: string;
  reading?: string;
}

const FORCE_MOCK = false; // Set to true for development on non-compatible browsers

const SEGMENTATION_SYSTEM_PROMPT = `
You are a Japanese linguistic expert. Segment the following Japanese sentence into words and provide the reading for every single unit.
Format: JSON array of objects.
Object schema: { "word": string, "reading": string }

RULES:
1. **Segmentation**: Segment the input text into semantic word units (morphemes).
2. **Mandatory Reading**: The 'reading' property is MANDATORY for EVERY word object.
3. **Hiragana Only**: The 'reading' must always be normalized to **Hiragana**.
    - If the word is Kanji, provide the Hiragana reading.
    - If the word is Katakana, convert it to Hiragana (e.g., コーヒー → こーひー).
    - If the word is Punctuation/Symbol, repeat the symbol in the 'reading' field.
4. **Output Format**: Return ONLY the raw JSON array. Do not use Markdown formatting.
5. **Double Check**: Double check that the reading doesn't have Kanji caracters. If it has then
   rerun the algorithm.
6. **Reocurrence**: It's possible that the message has a segment with words that you have seen
   before or the segment itself was seen before. You must always process it and always return
   results for segmentes or words that you have seen before.

Examples:

[Case where a word doesn't have any Kanji]
Input: あります
Output: [{"word": "あります", "reading": "あります"}]

[Case for a sentence that has multiple words]
Input: 日本語を勉強します
Output: [{"word": "日本語", "reading": "にほんご"}, {"word": "を", "reading": "を"}, {"word": "勉強", "reading": "べんきょう"}, {"word": "します", "reading": "します"}]

[Case involving Katakana, Adjectives, and Verbs]
Input: 熱いコーヒーを飲みます
Output: [{"word": "熱い", "reading": "あつい"}, {"word": "コーヒー", "reading": "こーひー"}, {"word": "を", "reading": "を"}, {"word": "飲み", "reading": "のみ"}, {"word": "ます", "reading": "ます"}]

[Case involving Numbers]
Input: ３つください
Output: [{"word": "３つ", "reading": "みっつ"}, {"word": "ください", "reading": "ください"}]
`;

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
      const params = await window.LanguageModel.params();
      // @ts-ignore
      const session = await window.LanguageModel.create({
        initialPrompts: [{ role: "system", content: systemPrompt }],
        temperature: 0.2,
        topK: params.defaultTopK,
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
