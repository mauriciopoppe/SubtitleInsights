import { describe, it, expect, beforeEach } from 'vitest';
import { SubtitleStore } from './store';

describe('SubtitleStore', () => {
  let store: SubtitleStore;

  beforeEach(() => {
    store = new SubtitleStore();
  });

  describe('parseSRTData', () => {
    it('should parse valid SRT content correctly', () => {
      const srt = `1
00:00:01,000 --> 00:00:04,000
Hello World

2
00:00:05,500 --> 00:00:09,100
Second subtitle
with multiple lines`;

      const result = store.parseSRTData(srt);

      expect(result.errors).toHaveLength(0);
      expect(result.segments).toHaveLength(2);

      expect(result.segments[0]).toEqual({
        start: 1,
        end: 4,
        text: 'Hello World',
      });

      expect(result.segments[1]).toEqual({
        start: 5.5,
        end: 9.1,
        text: 'Second subtitle\nwith multiple lines',
      });
    });

    it('should handle missing index lines', () => {
      const srt = `00:00:01,000 --> 00:00:04,000
Hello World

00:00:05,500 --> 00:00:09,100
Second subtitle`;

      const result = store.parseSRTData(srt);

      expect(result.errors).toHaveLength(0);
      expect(result.segments).toHaveLength(2);
      expect(result.segments[0].text).toBe('Hello World');
      expect(result.segments[1].text).toBe('Second subtitle');
    });

    it('should report errors for malformed timestamps', () => {
      const srt = `1
invalid --> timestamp
Hello World`;

      const result = store.parseSRTData(srt);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.segments).toHaveLength(0);
    });
    
    it('should parse timestamps with dots (WebVTT style fallback)', () => {
       const srt = `1
00:00:01.500 --> 00:00:02.500
Hello`;
       const result = store.parseSRTData(srt);
       expect(result.segments[0].start).toBe(1.5);
       expect(result.segments[0].end).toBe(2.5);
    });
  });
});
