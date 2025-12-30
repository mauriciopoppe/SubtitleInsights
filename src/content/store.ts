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
  private _sourceLanguage: string | null = null;
  private changeListeners: (() => void)[] = [];
  private segmentUpdateListeners: ((index: number, segment: SubtitleSegment) => void)[] = [];

  // UI State
  private _aiStatus: { status: "downloading" | "ready" | "error" | "none"; message?: string } = { status: "none" };
  private _warning: string | undefined = undefined;
  private _systemMessage: string | null = null;
  private _isUploadActive = false;
  private _uploadFilename: string | undefined = undefined;

  get sourceLanguage() {
    return this._sourceLanguage;
  }

  get aiStatus() {
    return this._aiStatus;
  }

  get warning() {
    return this._warning;
  }

  get systemMessage() {
    return this._systemMessage;
  }

  get isUploadActive() {
    return this._isUploadActive;
  }

  get uploadFilename() {
    return this._uploadFilename;
  }

  setSourceLanguage(lang: string | null) {
    this._sourceLanguage = lang;
  }

  setAIStatus(status: "downloading" | "ready" | "error" | "none", message?: string) {
    this._aiStatus = { status, message };
    this.notifyListeners();
  }

  setWarning(message: string | undefined) {
    this._warning = message;
    this.notifyListeners();
  }

  setSystemMessage(message: string | null) {
    this._systemMessage = message;
    this.notifyListeners();
  }

  setUploadStatus(active: boolean, filename?: string) {
    this._isUploadActive = active;
    this._uploadFilename = filename;
    this.notifyListeners();
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

  loadCustomSegments(data: any[]) {
    this.clear();
    console.log(
      "[LLE] SubtitleStore: Loading custom segments, count:",
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
    console.log(
      `[LLE][SubtitleStore] Loaded ${this.segments.length} custom segments.`,
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
   * Parses an SRT file content into partial segment objects.
   * Returns objects compatible with loadStructuredData input (seconds for time).
   */
  parseSRTData(content: string): {
    segments: any[];
    errors: string[];
  } {
    const segments: any[] = [];
    const errors: string[] = [];

    // Normalize newlines and split by double newlines
    const blocks = content.trim().replace(/\r\n/g, "\n").split(/\n\n+/);

    blocks.forEach((block, index) => {
      const lines = block.split("\n");
      if (lines.length < 2) {
        // Skip empty or malformed blocks
        return;
      }

      // SRT format:
      // 1
      // 00:00:20,000 --> 00:00:24,400
      // Text line 1
      // Text line 2

      // Heuristic: If the first line is just a number, it's the index.
      // If the first line contains "-->", maybe the index is missing.
      let timeLineIndex = 0;
      if (lines[0].match(/^\d+$/)) {
        timeLineIndex = 1;
      }

      if (timeLineIndex >= lines.length) {
         errors.push(`Block ${index + 1}: Malformed (missing timestamp).`);
         return;
      }

      const timeLine = lines[timeLineIndex];
      const parts = timeLine.split("-->").map((s) => s.trim());
      
      if (parts.length !== 2) {
         errors.push(`Block ${index + 1}: Invalid timestamp format: "${timeLine}".`);
         return;
      }

      const start = this.parseTimestamp(parts[0]);
      const end = this.parseTimestamp(parts[1]);

      if (isNaN(start) || isNaN(end)) {
        errors.push(
          `Block ${index + 1}: Invalid timestamp format in "${timeLine}"`,
        );
        return;
      }

      // Join the rest of the lines as text
      const textLines = lines.slice(timeLineIndex + 1);
      const text = textLines.join("\n").trim();

      if (!text) {
          // It is possible to have empty subtitles in SRT, but usually discouraged.
          // We can skip or include. Let's include with empty text or skip?
          // Existing logic warned about missing text.
          // errors.push(`Block ${index + 1}: Missing text.`);
      }

      segments.push({
        start, // seconds
        end,   // seconds
        text,
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

    return NaN;
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
    this._sourceLanguage = null;
    this._aiStatus = { status: "none" };
    this._warning = undefined;
    this._systemMessage = null;
    this._isUploadActive = false;
    this._uploadFilename = undefined;
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
