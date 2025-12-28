import { aiClient, AISegment } from "./ai";

export interface SubtitleSegment {
  start: number;
  end: number;
  text: string;
  translation?: string;
  segmentedData?: AISegment[];
  // Structured data fields
  furigana?: string;
  natural_translation?: string;
  literal_translation?: string;
  components?: any;
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
        segment.segmentedData = segmentedData;
      } catch (e) {
        console.error(
          "[LLE][SubtitleStore] Failed to process segment",
          segment.text,
          e,
        );
        if (!segment.translation) segment.translation = "Error";
        if (!segment.segmentedData)
          segment.segmentedData = [{ word: segment.text }];
      }
    }

    this.isTranslating = false;
  }

  loadStructuredData(data: SubtitleSegment[]) {
    this.clear();
    this.segments = [...data].sort((a, b) => a.start - b.start);
    this._isStructured = true;
    console.log(`[LLE][SubtitleStore] Loaded ${this.segments.length} structured segments.`);
  }

  getSegmentAt(timeMs: number): SubtitleSegment | undefined {
    // simple linear search for MVP, can optimize with binary search later
    return this.segments.find(seg => timeMs >= seg.start && timeMs <= seg.end);
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
