import { aiClient, AISegment } from "./ai";

export interface SubtitleSegment {
  start: number;
  end: number;
  text: string;
  translation?: string;
  segmentedData?: AISegment[][]; // Outer = visual blocks, Inner = parts of the block
  // Structured data fields
  segmentation?: string[];
  literal_translation?: string;
  contextual_analysis?: string;
  grammatical_gotchas?: string;
}

export class SubtitleStore {
  private segments: SubtitleSegment[] = [];
  private isTranslating = false;
  private _isStructured = false;

  get isStructured() {
    return this._isStructured;
  }

  addSegments(segments: SubtitleSegment[]) {
    this.segments = [...this.segments, ...segments].sort(
      (a, b) => a.start - b.start,
    );
    console.log(
      `[LLE][SubtitleStore] Added ${segments.length} segments. Total: ${this.segments.length}`,
    );
  }

  async updatePlaybackTime(currentTimeMs: number) {
    if (this.isTranslating || this._isStructured) return;

    // Find current and next few segments that need processing
    // 1. Find index of current segment (or the next one if between segments)
    const currentIndex = this.segments.findIndex((s) => s.end >= currentTimeMs);
    if (currentIndex === -1) return;

    // 2. Look ahead N segments
    const LOOKAHEAD = 5;
    const MIN_BATCH_SIZE = 3;
    const candidates = this.segments.slice(
      currentIndex,
      currentIndex + LOOKAHEAD,
    );

    // 3. Filter for pending ones
    const pending = candidates.filter(
      (s) => !s.translation || !s.segmentedData,
    );

    if (pending.length === 0) return;

    const currentSegment = this.segments[currentIndex];
    const isCurrentPending =
      !currentSegment.translation || !currentSegment.segmentedData;

    if (pending.length >= MIN_BATCH_SIZE || isCurrentPending) {
      await this.processBatch(pending);
    }
  }

  async processBatch(batch: SubtitleSegment[]) {
    if (this.isTranslating || this._isStructured) return;
    this.isTranslating = true;

    console.log(
      `[LLE][SubtitleStore] Processing lazy batch of ${batch.length} segments...`,
    );

    for (const segment of batch) {
      try {
        // Double check if processed in race condition
        if (segment.translation && segment.segmentedData) continue;

        const [translation, segmentedData] = await Promise.all([
          segment.translation
            ? Promise.resolve(segment.translation)
            : aiClient.translate(segment.text),
          segment.segmentedData
            ? Promise.resolve(segment.segmentedData)
            : aiClient.segment(segment.text),
        ]);

        segment.translation = translation;
        // AI segments are flat, each is its own visual block
        // @ts-ignore (AIClient returns AISegment[])
        segment.segmentedData = segmentedData.map((s) => [s]);
      } catch (e) {
        console.error(
          "[LLE][SubtitleStore] Failed to process segment",
          segment.text,
          e,
        );
        if (!segment.translation) segment.translation = "Error";
        if (!segment.segmentedData)
          segment.segmentedData = [[{ word: segment.text }]];
      }
    }

    this.isTranslating = false;
  }

  loadStructuredData(data: any[]) {
    this.clear();
    this.segments = data
      .map((s) => {
        const segment: SubtitleSegment = {
          start: s.start * 1000,
          end: s.end * 1000,
          text: s.text,
          translation: s.translation,
          segmentation: s.segmentation,
          literal_translation: s.literal_translation,
          contextual_analysis: s.contextual_analysis,
          grammatical_gotchas: s.grammatical_gotchas,
        };

        if (Array.isArray(s.segmentation)) {
          segment.segmentedData = s.segmentation.map((token) =>
            this.parseFurigana(token),
          );
        }
        return segment;
      })
      .sort((a, b) => a.start - b.start);
    this._isStructured = true;
    console.log(
      `[LLE][SubtitleStore] Loaded ${this.segments.length} structured segments.`,
    );
  }

  /**
   * Parses a Markdown file content into SubtitleSegment objects.
   */
  parseMarkdownStructuredData(content: string): SubtitleSegment[] {
    const segments: SubtitleSegment[] = [];
    // Split by "## [Text]" but keep the text
    const sections = content.split(/^##\s+/m).slice(1);

    for (const section of sections) {
      const lines = section.split("\n");
      const text = lines[0].trim();

      const getValue = (key: string) => {
        const pattern = `**${key}**:`;
        const line = lines.find((l) => l.includes(pattern));
        if (!line) return "";
        const parts = line.split(pattern);
        return parts.slice(1).join(pattern).trim();
      };

      // Special handling for Grammatical Gotchas (can be on same line or multiline list)
      const gotchasHeader = "**Grammatical Gotchas**:";
      const gotchasLine = lines.find((l) => l.includes(gotchasHeader));
      let grammatical_gotchas = "";

      if (gotchasLine) {
        const sameLineContent = gotchasLine.split(gotchasHeader).slice(1).join(gotchasHeader).trim();
        if (sameLineContent) {
          grammatical_gotchas = sameLineContent;
        } else {
          const gotchasIndex = lines.indexOf(gotchasLine);
          const gotchasLines = [];
          for (let i = gotchasIndex + 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (
              line.startsWith("-") ||
              line.startsWith("*") ||
              /^\d+\./.test(line)
            ) {
              gotchasLines.push(line);
            } else if (line === "" && gotchasLines.length > 0) {
              continue;
            } else if (line !== "") {
              break;
            }
          }
          grammatical_gotchas = gotchasLines.join("\n");
        }
      }

      const segmentationStr = getValue("Segmentation");

      segments.push({
        text,
        start: this.parseTimestamp(getValue("Timestamp Start")),
        end: this.parseTimestamp(getValue("Timestamp End")),
        translation: getValue("Translation"),
        literal_translation: getValue("Literal Translation"),
        segmentation: segmentationStr ? segmentationStr.split(/\s+/) : [],
        contextual_analysis: getValue("Contextual Analysis"),
        grammatical_gotchas,
      });
    }

    return segments;
  }

  /**
   * Parses a timestamp string into seconds.
   * Strictly supports HH:MM:SS.SSS format.
   */
  private parseTimestamp(ts: string): number {
    if (!ts) return 0;

    const match = ts.match(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})/);
    if (match) {
      const h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const s = parseInt(match[3], 10);
      const ms = parseInt(match[4], 10);
      return h * 3600 + m * 60 + s + ms / 1000;
    }

    return 0;
  }

  private parseFurigana(token: string): AISegment[] {
    const parts: AISegment[] = [];
    let lastIndex = 0;
    // Matches "KanjiBlock(Reading)"
    // Using Unicode property escape \p{Ideographic} to catch all Kanji.
    // The 'u' flag is required for Unicode property escapes.
    const regex = /([\p{Ideographic}\u3005]+)\(([^()]+)\)/gu;
    let match;

    while ((match = regex.exec(token)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ word: token.slice(lastIndex, match.index) });
      }
      parts.push({ word: match[1], reading: match[2] });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < token.length) {
      parts.push({ word: token.slice(lastIndex) });
    }
    return parts;
  }

  getSegmentAt(timeMs: number): SubtitleSegment | undefined {
    // simple linear search for MVP, can optimize with binary search later
    return this.segments.find(
      (seg) => timeMs >= seg.start && timeMs <= seg.end,
    );
  }

  getAllSegments(): SubtitleSegment[] {
    return this.segments;
  }

  clear() {
    this.segments = [];
    this._isStructured = false;
  }

  // Helper to parse YouTube format
  static parseYouTubeJSON(json: any): SubtitleSegment[] {
    if (!json.events) return [];

    return json.events
      .filter((e: any) => e.segs && e.segs[0] && e.segs[0].utf8)
      .map((e: any) => {
        const start = e.tStartMs;
        const duration = e.dDurationMs || 0;
        // Combine all text segments
        const text = e.segs.map((s: any) => s.utf8).join("");
        return {
          start,
          end: start + duration,
          text,
        };
      });
  }
}

export const store = new SubtitleStore();
