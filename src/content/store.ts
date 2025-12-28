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
    console.log(`[SubtitleStore] Added ${segments.length} segments. Total: ${this.segments.length}`);
    this.translateNextBatch();
  }

  async translateNextBatch() {
    if (this.isTranslating) return;
    
    // Filter segments that need either translation or segmentation
    const pending = this.segments.filter(s => !s.translation || !s.segmentedData);
    if (pending.length === 0) return;

    this.isTranslating = true;
    const batchSize = 3; // Reduced batch size as we do 2 calls per segment
    const batch = pending.slice(0, batchSize);

    console.log(`[SubtitleStore] Processing batch of ${batch.length} segments...`);

    for (const segment of batch) {
      try {
        const [translation, segmentedData] = await Promise.all([
             segment.translation ? Promise.resolve(segment.translation) : aiClient.translate(segment.text),
             segment.segmentedData ? Promise.resolve(segment.segmentedData) : aiClient.segment(segment.text)
        ]);
        
        segment.translation = translation;
        segment.segmentedData = segmentedData;

      } catch (e) {
        console.error('[SubtitleStore] Failed to process segment', segment.text, e);
        if (!segment.translation) segment.translation = 'Error';
        if (!segment.segmentedData) segment.segmentedData = [{ word: segment.text }];
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
