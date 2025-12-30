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
  private _sourceLanguage: string | null = null;
  private changeListeners: (() => void)[] = [];
  private segmentUpdateListeners: ((index: number, segment: SubtitleSegment) => void)[] = [];

  get isStructured() {
    return this._isStructured;
  }

  get sourceLanguage() {
    return this._sourceLanguage;
  }

  setSourceLanguage(lang: string | null) {
    this._sourceLanguage = lang;
  }

  addChangeListener(callback: () => void) {
    this.changeListeners.push(callback);
  }

  addSegmentUpdateListener(callback: (index: number, segment: SubtitleSegment) => void) {
    this.segmentUpdateListeners.push(callback);
  }

  private notifyListeners() {
    this.changeListeners.forEach((cb) => cb());
  }

  private notifySegmentUpdate(index: number, segment: SubtitleSegment) {
    this.segmentUpdateListeners.forEach((cb) => cb(index, segment));
  }

  addSegments(newSegments: SubtitleSegment[]) {
    if (newSegments.length === 0) return;

    // Optimization: If the store is empty, just add
    if (this.segments.length === 0) {
      this.segments = newSegments.sort((a, b) => a.start - b.start);
      console.log(
        `[LLE][SubtitleStore] Added ${newSegments.length} segments. Total: ${this.segments.length}`,
      );
      this.notifyListeners();
      return;
    }

    // Check for identical payload (common case for double fetch of full track)
    if (this.segments.length === newSegments.length) {
       const firstOld = this.segments[0];
       const firstNew = newSegments[0];
       // Check if first segment matches, a strong heuristic for identical full track
       if (firstOld.start === firstNew.start && firstOld.text === firstNew.text) {
          console.log('[LLE][SubtitleStore] Duplicate subtitle track detected. Ignoring.');
          return;
       }
    }

    // Merge using Map to ensure uniqueness O(N+M)
    const uniqueSegments = new Map<string, SubtitleSegment>();
    
    // Add existing segments first to preserve their state (e.g. translations)
    this.segments.forEach(s => uniqueSegments.set(`${s.start}:${s.text}`, s));
    
    let addedCount = 0;
    newSegments.forEach(s => {
       const key = `${s.start}:${s.text}`;
       if (!uniqueSegments.has(key)) {
         uniqueSegments.set(key, s);
         addedCount++;
       }
    });

    if (addedCount === 0) {
      console.log('[LLE][SubtitleStore] No new unique segments found.');
      return;
    }

    this.segments = Array.from(uniqueSegments.values()).sort(
      (a, b) => a.start - b.start,
    );
    console.log(
      `[LLE][SubtitleStore] Added ${addedCount} segments. Total: ${this.segments.length}`,
    );
    this.notifyListeners();
  }

  loadStructuredData(data: any[]) {
    this.clear();
    console.log(
      "[LLE] SubtitleStore: Loading structured data, count:",
      data.length,
    );
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
    this.notifyListeners();
  }

  updateSegmentTranslation(index: number, translation: string) {
    if (this.segments[index]) {
      this.segments[index].translation = translation;
      this.notifySegmentUpdate(index, this.segments[index]);
    }
  }

  updateSegmentAnalysis(index: number, analysis: string) {
    if (this.segments[index]) {
      this.segments[index].contextual_analysis = analysis;
      this.notifySegmentUpdate(index, this.segments[index]);
    }
  }

  /**
   * Parses a Markdown file content into SubtitleSegment objects.
   */
  parseMarkdownStructuredData(content: string): {
    segments: SubtitleSegment[];
    errors: string[];
  } {
    const segments: SubtitleSegment[] = [];
    const errors: string[] = [];

    // Split by "## [Text]" but keep the text
    const sections = content.split(/^##\s+/m).slice(1);

    if (sections.length === 0) {
      errors.push("No valid sections found (must start with '## ').");
    }

    sections.forEach((section, index) => {
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
      
      // Try parsing new combined Timestamp format first
      let startStr = "";
      let endStr = "";
      const timestampCombined = getValue("Timestamp");

      if (timestampCombined && timestampCombined.includes("-->")) {
        const parts = timestampCombined.split("-->").map((s) => s.trim());
        if (parts.length >= 2) {
          startStr = parts[0];
          endStr = parts[1];
        }
      } else {
        // Fallback to old separate fields
        startStr = getValue("Timestamp Start");
        endStr = getValue("Timestamp End");
      }

      const start = this.parseTimestamp(startStr);
      const end = this.parseTimestamp(endStr);

      // Validation
      if (!text) {
        errors.push(`Segment ${index + 1}: Missing text.`);
        return; // Skip this segment
      }
      
      const isStartValid = start > 0 || (start === 0 && (startStr.includes("00:00:00.000") || startStr.includes("00:00:00,000")));
      
      if (!startStr || !isStartValid) {
         if (!startStr) {
            errors.push(`Segment ${index + 1} ("${text.substring(0, 20)}..."): Missing timestamp information.`);
            return;
         } else {
            errors.push(`Segment ${index + 1} ("${text.substring(0, 20)}..."): Invalid start timestamp format: "${startStr}".`);
            return;
         }
      }

      if (!endStr) {
          errors.push(`Segment ${index + 1} ("${text.substring(0, 20)}..."): Missing end time.`);
          return;
      }
      if (end < start) {
        errors.push(`Segment ${index + 1} ("${text.substring(0, 20)}..."): End time (${endStr}) is before Start time (${startStr}).`);
        return;
      }

      segments.push({
        text,
        start,
        end,
        translation: getValue("Translation"),
        literal_translation: getValue("Literal Translation"),
        segmentation: segmentationStr ? segmentationStr.split(/\s+/) : [],
        contextual_analysis: getMultilineValue("Contextual Analysis"),
        grammatical_gotchas: getMultilineValue("Grammatical Gotchas"),
      });
    });

    return { segments, errors };
  }

  /**
   * Parses a timestamp string into seconds.
   * Supports HH:MM:SS.SSS and MM:SS.SSS formats.
   */
  private parseTimestamp(ts: string): number {
    if (!ts) return 0;

    // Matches optional HH:, mandatory MM:SS, and optional milliseconds with . or ,
    // Accepting one or more digits for milliseconds (\d+)
    const match = ts.match(/^(?:(\d{2}):)?(\d{2}):(\d{2})(?:[.,](\d+))?$/);
    if (match) {
      const h = match[1] ? parseInt(match[1], 10) : 0;
      const m = parseInt(match[2], 10);
      const s = parseInt(match[3], 10);
      
      let fractionalSeconds = 0;
      if (match[4]) {
        const msValue = parseInt(match[4], 10);
        const msLength = match[4].length;
        fractionalSeconds = msValue / Math.pow(10, msLength);
      }
      
      return h * 3600 + m * 60 + s + fractionalSeconds;
    }

    return 0;
  }

  private parseFurigana(token: string): AISegment[] {
    const parts: AISegment[] = [];
    let lastIndex = 0;
    // Matches "AnyWord(Reading)"
    // Relaxed regex to capture any non-parenthesis characters before the parens
    // This allows "Hiragana(Hiragana)" or "Katakana(Reading)" cases to be parsed
    // so we can strip redundant readings in the render phase.
    const regex = /([^\s()]+)\(([^()]+)\)/gu;
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
    this._sourceLanguage = null;
    this.notifyListeners();
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
