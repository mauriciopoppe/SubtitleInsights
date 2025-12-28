import { aiClient } from './ai';

export interface SubtitleSegment {
  start: number;
  end: number;
  text: string;
  translation?: string;
}

export class SubtitleStore {
  private segments: SubtitleSegment[] = [];
  private isTranslating = false;

  addSegments(segments: SubtitleSegment[]) {
    this.segments = [...this.segments, ...segments].sort((a, b) => a.start - b.start);
    console.log(`[SubtitleStore] Added ${segments.length} segments. Total: ${this.segments.length}`);
    this.translateNextBatch();
  }

  async translateNextBatch() {
    if (this.isTranslating) return;
    
    const untranslated = this.segments.filter(s => !s.translation);
    if (untranslated.length === 0) return;

    this.isTranslating = true;
    const batchSize = 5;
    const batch = untranslated.slice(0, batchSize);

    console.log(`[SubtitleStore] Translating batch of ${batch.length} segments...`);

    for (const segment of batch) {
      try {
        segment.translation = await aiClient.translate(segment.text);
      } catch (e) {
        console.error('[SubtitleStore] Failed to translate segment', segment.text, e);
        segment.translation = 'Error'; // Avoid infinite loop
      }
    }

    this.isTranslating = false;
    // Recursively call to process next batch if any
    this.translateNextBatch();
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
