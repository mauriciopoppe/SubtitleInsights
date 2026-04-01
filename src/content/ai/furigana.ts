import { aiLogger } from '../logger'
import { AISegment } from '../types'
import { kuroshiroService } from './kuroshiro'

export class JapaneseFuriganaService {
  async checkAvailability(): Promise<Availability> {
    // Kuroshiro is considered available as it's a bundled library.
    return 'available'
  }

  async initialize(): Promise<boolean> {
    try {
      await kuroshiroService.init()
      return true
    } catch (error) {
      aiLogger('ERROR: Error initializing furigana service (kuroshiro):', error)
      return false
    }
  }

  async resetSession() {
    // No-op for kuroshiro as it's a stateless library (except for the dictionary)
  }

  async destroy() {
    // No-op
  }

  async generateFurigana(text: string): Promise<AISegment[][]> {
    try {
      const result = await kuroshiroService.convert(text)
      
      const segments: AISegment[] = []
      // Parser for the <ruby> tags from kuroshiro output
      // Format: <ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby>
      const regex = /<ruby>([^<]+)<rp>\(<\/rp><rt>([^<]+)<\/rt><rp>\)<\/rp><\/ruby>|([^<]+)/g
      let match

      while ((match = regex.exec(result)) !== null) {
        if (match[1] && match[2]) {
          // Ruby block
          segments.push({
            word: match[1],
            reading: match[2]
          })
        } else if (match[3]) {
          // Plain text
          segments.push({ word: match[3] })
        }
      }

      // Wrap in a single group to prevent spaces in renderer
      return [segments]
    } catch (error) {
      aiLogger('ERROR: Error generating furigana:', error)
      // Fallback to original text as a single segment
      return [[{ word: text }]]
    }
  }

  isReady(): boolean {
    return kuroshiroService.ready
  }
}

export const furiganaService = new JapaneseFuriganaService()
