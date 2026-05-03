import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SubtitleStore } from './store'
import ccFrenchPodcast from './fixtures/cc_french_podcast.json'

describe('SubtitleStore', () => {
  let store: SubtitleStore

  beforeEach(() => {
    store = new SubtitleStore()
  })

  describe('parseSRTData', () => {
    it('should parse valid SRT content correctly', () => {
      const srt = `1
00:00:01,000 --> 00:00:04,000
Hello World

2
00:00:05,500 --> 00:00:09,100
Second subtitle
with multiple lines`

      const result = store.parseSRTData(srt)

      expect(result.errors).toHaveLength(0)
      expect(result.segments).toHaveLength(2)

      expect(result.segments[0]).toEqual({
        start: 1,
        end: 4,
        text: 'Hello World'
      })

      expect(result.segments[1]).toEqual({
        start: 5.5,
        end: 9.1,
        text: 'Second subtitle\nwith multiple lines'
      })
    })

    it('should handle missing index lines', () => {
      const srt = `00:00:01,000 --> 00:00:04,000
Hello World

00:00:05,500 --> 00:00:09,100
Second subtitle`

      const result = store.parseSRTData(srt)

      expect(result.errors).toHaveLength(0)
      expect(result.segments).toHaveLength(2)
      expect(result.segments[0].text).toBe('Hello World')
      expect(result.segments[1].text).toBe('Second subtitle')
    })

    it('should report errors for malformed timestamps', () => {
      const srt = `1
invalid --> timestamp
Hello World`

      const result = store.parseSRTData(srt)

      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.segments).toHaveLength(0)
    })

    it('should parse timestamps with dots (WebVTT style fallback)', () => {
      const srt = `1
00:00:01.500 --> 00:00:02.500
Hello`
      const result = store.parseSRTData(srt)
      expect(result.segments[0].start).toBe(1.5)
      expect(result.segments[0].end).toBe(2.5)
    })
  })

  describe('parseYouTubeJSON', () => {
    it('should parse valid YouTube JSON correctly', () => {
      const payload = {
        events: [
          {
            tStartMs: 1000,
            dDurationMs: 2000,
            segs: [{ utf8: 'Hello' }, { utf8: ' World', tOffsetMs: 500 }]
          }
        ]
      }

      const { segments: result } = SubtitleStore.parseYouTubeJSON(payload)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        start: 1000,
        end: 3000,
        text: 'Hello World'
      })
    })

    it('should skip segments that contain only empty lines or whitespace', () => {
      const payload = {
        events: [
          {
            tStartMs: 1000,
            dDurationMs: 1000,
            segs: [{ utf8: 'Valid Text' }]
          },
          {
            tStartMs: 2000,
            dDurationMs: 1000,
            segs: [{ utf8: '\n' }]
          },
          {
            tStartMs: 3000,
            dDurationMs: 1000,
            segs: [{ utf8: ' ' }]
          },
          {
            tStartMs: 4000,
            dDurationMs: 1000,
            segs: [{ utf8: '\n\n' }]
          },
          {
            tStartMs: 5000,
            dDurationMs: 1000,
            segs: [{ utf8: 'More Text' }]
          }
        ]
      }

      const { segments: result } = SubtitleStore.parseYouTubeJSON(payload)

      expect(result).toHaveLength(2)
      expect(result[0].text).toBe('Valid Text')
      expect(result[1].text).toBe('More Text')
    })

    it('should handle events without segs or with empty segs', () => {
      const payload = {
        events: [
          { tStartMs: 1000, dDurationMs: 1000 },
          { tStartMs: 2000, dDurationMs: 1000, segs: [] },
          { tStartMs: 3000, dDurationMs: 1000, segs: [{}] }
        ]
      }

      const { segments: result } = SubtitleStore.parseYouTubeJSON(payload)
      expect(result).toHaveLength(0)
    })

    it('should handle rolling subtitles by truncating overlapping segments', () => {
      const payload = {
        events: [
          {
            tStartMs: 1000,
            dDurationMs: 10000, // Normally ends at 11000
            segs: [{ utf8: 'First Line' }]
          },
          {
            tStartMs: 5000,
            dDurationMs: 10000, // Normally ends at 15000
            segs: [{ utf8: 'Second Line' }]
          }
        ]
      }

      const { segments: result } = SubtitleStore.parseYouTubeJSON(payload)

      expect(result).toHaveLength(2)
      // First line should be truncated to end when second line starts
      expect(result[0]).toEqual({
        start: 1000,
        end: 5000,
        text: 'First Line'
      })
      // Second line should keep its duration as there's no third line
      expect(result[1]).toEqual({
        start: 5000,
        end: 15000,
        text: 'Second Line'
      })
    })

    it('should group auto-generated subtitles in pairs of two lines', () => {
      const payload = {
        events: [
          {
            tStartMs: 1000,
            dDurationMs: 1000,
            segs: [{ utf8: 'Line 1', acAsrConf: 0 }]
          },
          {
            tStartMs: 2000,
            dDurationMs: 1000,
            segs: [{ utf8: 'Line 2', acAsrConf: 0 }]
          },
          {
            tStartMs: 3000,
            dDurationMs: 1000,
            segs: [{ utf8: 'Line 3', acAsrConf: 0 }]
          },
          {
            tStartMs: 4000,
            dDurationMs: 1000,
            segs: [{ utf8: 'Line 4', acAsrConf: 0 }]
          },
          {
            tStartMs: 5000,
            dDurationMs: 1000,
            segs: [{ utf8: 'Line 5', acAsrConf: 0 }]
          }
        ]
      }

      const { segments: result, isAutoGenerated } = SubtitleStore.parseYouTubeJSON(payload, 2)

      expect(isAutoGenerated).toBe(true)
      expect(result).toHaveLength(3)
      // Line 1 & 2 grouped
      expect(result[0]).toEqual({
        start: 1000,
        end: 3000, // End of Line 2
        text: 'Line 1 Line 2'
      })
      // Line 3 & 4 grouped
      expect(result[1]).toEqual({
        start: 3000,
        end: 5000, // End of Line 4
        text: 'Line 3 Line 4'
      })
      // Line 5 left alone
      expect(result[2]).toEqual({
        start: 5000,
        end: 6000, // End of Line 5
        text: 'Line 5'
      })
    })

    it('should group auto-generated subtitles in groups of three lines', () => {
      const payload = {
        events: [
          {
            tStartMs: 1000,
            dDurationMs: 1000,
            segs: [{ utf8: 'Line 1', acAsrConf: 0 }]
          },
          {
            tStartMs: 2000,
            dDurationMs: 1000,
            segs: [{ utf8: 'Line 2', acAsrConf: 0 }]
          },
          {
            tStartMs: 3000,
            dDurationMs: 1000,
            segs: [{ utf8: 'Line 3', acAsrConf: 0 }]
          },
          {
            tStartMs: 4000,
            dDurationMs: 1000,
            segs: [{ utf8: 'Line 4', acAsrConf: 0 }]
          }
        ]
      }

      const { segments: result } = SubtitleStore.parseYouTubeJSON(payload, 3)

      expect(result).toHaveLength(2)
      // Line 1, 2, 3 grouped
      expect(result[0]).toEqual({
        start: 1000,
        end: 4000,
        text: 'Line 1 Line 2 Line 3'
      })
      expect(result[1].text).toBe('Line 4')
    })

    it('should group real auto-generated subtitles from cc_french_podcast.json in pairs', () => {
      // The fixture is the payload itself (or close to it)
      const { segments: result, isAutoGenerated } = SubtitleStore.parseYouTubeJSON({ events: ccFrenchPodcast.events }, 2)

      expect(isAutoGenerated).toBe(true)
      // Each grouped segment should have 2 lines of text (separated by space as per current logic)
      // and we expect the number of segments to be roughly half the number of events
      const originalEvents = ccFrenchPodcast.events.filter(e => e.segs && e.segs.some(s => s.utf8?.trim())).length
      expect(result.length).toBe(Math.ceil(originalEvents / 2))

      expect(result[0].text).toContain('Salut tout le monde, bienvenue')
      expect(result[0].text).toContain('dans un nouvel épisode')
    })

    it('should collapse whitespace-only segments between text segments and group them', () => {
      const payload = {
        events: [
          {
            tStartMs: 1000,
            dDurationMs: 1000,
            segs: [{ utf8: 'Part 1', acAsrConf: 0 }]
          },
          {
            tStartMs: 2000,
            dDurationMs: 500,
            segs: [{ utf8: '\n' }] // Should be collapsed into Part 1
          },
          {
            tStartMs: 3000,
            dDurationMs: 1000,
            segs: [{ utf8: 'Part 2', acAsrConf: 0 }]
          }
        ]
      }

      const { segments: result } = SubtitleStore.parseYouTubeJSON(payload, 2)

      // Segments: [Part 1, \n, Part 2]
      // Collapsing: [\n] merges into [Part 1] -> [Part 1 (extended), Part 2]
      // Grouping: [Part 1, Part 2] -> [Part 1 + Part 2]
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        start: 1000,
        end: 4000, // End of Part 2
        text: 'Part 1 Part 2'
      })
    })
  })

  describe('UI State Management', () => {
    it('should initialize with default values', () => {
      expect(store.aiStatus).toEqual({ status: 'none' })
      expect(store.warning).toBeUndefined()
      expect(store.systemMessage).toBeNull()
      expect(store.isUploadActive).toBe(false)
      expect(store.uploadFilename).toBeUndefined()
      expect(store.isAutoGenerated).toBe(false)
    })

    it('should update AI status and notify listeners', () => {
      const listener = vi.fn()
      store.addChangeListener(listener)

      store.setAIStatus('ready', 'AI is ready')

      expect(store.aiStatus).toEqual({
        status: 'ready',
        message: 'AI is ready'
      })
      expect(listener).toHaveBeenCalled()
    })

    it('should update warning and notify listeners', () => {
      const listener = vi.fn()
      store.addChangeListener(listener)

      store.setWarning('Something is wrong')

      expect(store.warning).toBe('Something is wrong')
      expect(listener).toHaveBeenCalled()
    })

    it('should update system message and notify listeners', () => {
      const listener = vi.fn()
      store.addChangeListener(listener)

      store.setSystemMessage('Processing...')

      expect(store.systemMessage).toBe('Processing...')
      expect(listener).toHaveBeenCalled()
    })

    it('should update upload status and notify listeners', () => {
      const listener = vi.fn()
      store.addChangeListener(listener)

      store.setUploadStatus(true, 'test.srt')

      expect(store.isUploadActive).toBe(true)
      expect(store.uploadFilename).toBe('test.srt')
      expect(listener).toHaveBeenCalled()
    })

    it('should reset UI states on clear', () => {
      store.setAIStatus('ready')
      store.setWarning('Warn')
      store.setSystemMessage('Msg')
      store.setUploadStatus(true, 'file.srt')

      store.clear()

      expect(store.aiStatus).toEqual({ status: 'none' })
      expect(store.warning).toBeUndefined()
      expect(store.systemMessage).toBeNull()
      expect(store.isUploadActive).toBe(false)
      expect(store.uploadFilename).toBeUndefined()
    })
  })

  describe('applyOffset', () => {
    it('should shift all segments by the given positive offset', () => {
      const segments = [
        { start: 1000, end: 3000, text: 'First' },
        { start: 5000, end: 7000, text: 'Second' }
      ]
      store.replaceSegments(segments)

      const listener = vi.fn()
      store.addChangeListener(listener)

      store.applyOffset(2000)

      const updated = store.getAllSegments()
      expect(updated[0]).toEqual({ start: 3000, end: 5000, text: 'First' })
      expect(updated[1]).toEqual({ start: 7000, end: 9000, text: 'Second' })
      expect(listener).toHaveBeenCalled()
    })

    it('should shift all segments by the given negative offset', () => {
      const segments = [
        { start: 3000, end: 5000, text: 'First' },
        { start: 7000, end: 9000, text: 'Second' }
      ]
      store.replaceSegments(segments)

      store.applyOffset(-1000)

      const updated = store.getAllSegments()
      expect(updated[0]).toEqual({ start: 2000, end: 4000, text: 'First' })
      expect(updated[1]).toEqual({ start: 6000, end: 8000, text: 'Second' })
    })

    it('should handle negative start times after shift (should just shift blindly)', () => {
      const segments = [{ start: 1000, end: 3000, text: 'First' }]
      store.replaceSegments(segments)

      store.applyOffset(-2000)

      const updated = store.getAllSegments()
      expect(updated[0]).toEqual({ start: -1000, end: 1000, text: 'First' })
    })

    it('should do nothing if there are no segments', () => {
      const listener = vi.fn()
      store.addChangeListener(listener)

      store.applyOffset(1000)

      expect(store.getAllSegments()).toHaveLength(0)
      expect(listener).not.toHaveBeenCalled()
    })
  })
})
