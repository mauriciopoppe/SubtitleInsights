import { AISegment } from "./types";

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
        console.log(segment);

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

      const getMultilineValue = (key: string) => {
        const pattern = `**${key}**:`;
        const headerIndex = lines.findIndex((l) => l.includes(pattern));
        if (headerIndex === -1) return "";

        const headerLine = lines[headerIndex];
        const sameLineContent = headerLine
          .split(pattern)
          .slice(1)
          .join(pattern)
          .trim();

        const valueLines = [];
        if (sameLineContent) {
          valueLines.push(sameLineContent);
        }

        // Look at subsequent lines until we hit another key or the end
        for (let i = headerIndex + 1; i < lines.length; i++) {
          const line = lines[i];
          // Check if the line starts a new key (e.g., "* **Key**:")
          if (line.trim().startsWith("* **") && line.includes("**:")) {
            break;
          }
          // Only add if it's not empty or if we already have some content
          if (line.trim() !== "" || valueLines.length > 0) {
            // If it's a list item, we keep it as is, otherwise we might want to trim it
            // but for markdown rendering, whitespace can be important (e.g. indentation)
            // however, usually these are within a bullet point, so we trim leading "* " or "- " if it's there?
            // Actually, let's just trim the line and keep it if it's not starting a new property.
            valueLines.push(line.trim());
          }
        }

        // Remove trailing empty lines
        while (
          valueLines.length > 0 &&
          valueLines[valueLines.length - 1] === ""
        ) {
          valueLines.pop();
        }

        return valueLines.join("\n");
      };

      const getValue = (key: string) => {
        const pattern = `**${key}**:`;
        const line = lines.find((l) => l.includes(pattern));
        if (!line) return "";
        const parts = line.split(pattern);
        return parts.slice(1).join(pattern).trim();
      };

      const segmentationStr = getValue("Segmentation");

      segments.push({
        text,
        start: this.parseTimestamp(getValue("Timestamp Start")),
        end: this.parseTimestamp(getValue("Timestamp End")),
        translation: getValue("Translation"),
        literal_translation: getValue("Literal Translation"),
        segmentation: segmentationStr ? segmentationStr.split(/\s+/) : [],
        contextual_analysis: getMultilineValue("Contextual Analysis"),
        grammatical_gotchas: getMultilineValue("Grammatical Gotchas"),
      });
    }

    return segments;
  }

  /**
   * Parses a timestamp string into seconds.
   * Supports HH:MM:SS.SSS and MM:SS.SSS formats.
   */
  private parseTimestamp(ts: string): number {
    if (!ts) return 0;

    // Matches optional HH:, mandatory MM:SS.SSS
    const match = ts.match(/^(?:(\d{2}):)?(\d{2}):(\d{2})\.(\d{3})$/);
    if (match) {
      const h = match[1] ? parseInt(match[1], 10) : 0;
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
