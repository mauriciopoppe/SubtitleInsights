export interface SubtitleSegment {
  start: number;
  end: number;
  text: string;
  translation?: string;
}

export class SubtitleStore {
  private segments: SubtitleSegment[] = [];

  addSegments(segments: SubtitleSegment[]) {
    this.segments = [...this.segments, ...segments].sort((a, b) => a.start - b.start);
    console.log(`[SubtitleStore] Added ${segments.length} segments. Total: ${this.segments.length}`);
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
