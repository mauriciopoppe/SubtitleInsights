import { aiClient, AISegment } from './ai';

export interface SubtitleSegment {
  start: number;
  end: number;
  text: string;
  translation?: string;
  segmentedData?: AISegment[];
}

export class SubtitleStore {
  private segments: SubtitleSegment[] = [];
  private isTranslating = false;

  addSegments(segments: SubtitleSegment[]) {
    this.segments = [...this.segments, ...segments].sort((a, b) => a.start - b.start);
    console.log(`[LLE][SubtitleStore] Added ${segments.length} segments. Total: ${this.segments.length}`);
    // Removed automatic translation trigger
  }

  async updatePlaybackTime(currentTimeMs: number) {
    if (this.isTranslating) return;

    // Find current and next few segments that need processing
    // 1. Find index of current segment (or the next one if between segments)
    const currentIndex = this.segments.findIndex(s => s.end >= currentTimeMs);
    if (currentIndex === -1) return;

    // 2. Look ahead N segments
    const LOOKAHEAD = 5;
    const candidates = this.segments.slice(currentIndex, currentIndex + LOOKAHEAD);
    
    // 3. Filter for pending ones
    const pending = candidates.filter(s => !s.translation || !s.segmentedData);

    if (pending.length > 0) {
      await this.processBatch(pending);
    }
  }

  async processBatch(batch: SubtitleSegment[]) {
    if (this.isTranslating) return;
    this.isTranslating = true;

    console.log(`[LLE][SubtitleStore] Processing lazy batch of ${batch.length} segments...`);

    for (const segment of batch) {
      try {
        // Double check if processed in race condition
        if (segment.translation && segment.segmentedData) continue;

        const [translation, segmentedData] = await Promise.all([
             segment.translation ? Promise.resolve(segment.translation) : aiClient.translate(segment.text),
             segment.segmentedData ? Promise.resolve(segment.segmentedData) : aiClient.segment(segment.text)
        ]);
        
        segment.translation = translation;
        segment.segmentedData = segmentedData;

      } catch (e) {
        console.error('[LLE][SubtitleStore] Failed to process segment', segment.text, e);
        if (!segment.translation) segment.translation = 'Error';
        if (!segment.segmentedData) segment.segmentedData = [{ word: segment.text }];
      }
    }

    this.isTranslating = false;
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
              const text = e.segs.map((s: any) => s.utf8).join('');
              return {
                  start,
                  end: start + duration,
                  text
              };
          });
  }
}

export const store = new SubtitleStore();
