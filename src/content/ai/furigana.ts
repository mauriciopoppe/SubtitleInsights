import { aiLogger } from '../logger'
import { AISegment } from '../types'

export class JapaneseFuriganaService {
  private rootSession: LanguageModel | null = null
  private workingSession: LanguageModel | null = null

  async checkAvailability(): Promise<Availability> {
    try {
      if (typeof window.LanguageModel !== 'undefined') {
        return await window.LanguageModel.availability({
          expectedInputs: [{ type: 'text', languages: ['ja'] }]
        })
      }
      return 'unavailable'
    } catch (error) {
      aiLogger('ERROR: Error checking furigana model availability:', error)
      return 'unavailable'
    }
  }

  async initialize(): Promise<boolean> {
    try {
      if (this.rootSession) {
        return true
      }

      if (typeof window.LanguageModel === 'undefined') {
        return false
      }

      aiLogger('Initializing Furigana LanguageModel...')

      const systemPrompt = `
Role: Japanese Morphological Analyzer.
Task: Provide Hiragana readings for Kanji in the input Japanese text using precise Anki format.
Output Format: A JSON object with a "text" property.
Rules:
1. Wrap readings in square brackets immediately after ONLY the Kanji characters.
2. IMPORTANT: If a word has Kanji and Kana, only put the reading after the Kanji part (e.g. " 皆[みな]さん", " 行[い]きます").
3. Put a space BEFORE each Kanji block that has a reading.
4. Readings must be in Hiragana.
5. JSON only, no prose.

Example:
Input: 彼は学校へ行きました。
Output: {"text": " 彼[かれ]は 学校[がっこう]へ 行[い]きました。"}
`.trim()

      const params = await window.LanguageModel.params()
      const options: LanguageModelCreateOptions = {
        initialPrompts: [
          {
            role: 'system',
            content: systemPrompt
          }
        ],
        expectedInputs: [{ type: 'text', languages: ['ja'] }],
        expectedOutputs: [{ type: 'text', languages: ['ja'] }],
        temperature: 0.1,
        topK: params.defaultTopK || undefined
      }

      this.rootSession = await window.LanguageModel.create(options)

      if (this.rootSession) {
        await this.resetSession()
        return true
      }

      return false
    } catch (error) {
      aiLogger('ERROR: Error initializing furigana model:', error)
      return false
    }
  }

  async resetSession() {
    if (!this.rootSession) {
      await this.initialize()
      return
    }

    try {
      if (this.workingSession) {
        this.workingSession.destroy()
        this.workingSession = null
      }

      this.workingSession = await this.rootSession.clone()
      aiLogger('FuriganaService: Session reset via clone.')
    } catch (error) {
      aiLogger('ERROR: Error resetting furigana session:', error)
    }
  }

  async destroy() {
    if (this.workingSession) {
      this.workingSession.destroy()
      this.workingSession = null
    }
    if (this.rootSession) {
      this.rootSession.destroy()
      this.rootSession = null
    }
  }

  /**
   * Converts Katakana to Hiragana.
   */
  private toHiragana(text: string): string {
    return text.replace(/[\u30a1-\u30f6]/g, match => {
      const code = match.charCodeAt(0) - 0x60
      return String.fromCharCode(code)
    })
  }

  async generateFurigana(text: string): Promise<AISegment[][]> {
    if (!this.workingSession) {
      throw new Error('Furigana session not initialized')
    }

    try {
      const rawResponse = await this.workingSession.prompt(text)
      
      // Extract JSON object
      const jsonMatch = rawResponse.match(/\{.*\}/s)
      const jsonStr = jsonMatch ? jsonMatch[0] : rawResponse
      const parsed = JSON.parse(jsonStr)
      const ankiText = parsed.text || text

      const segments: AISegment[] = []
      // Standard Anki Furigana parsing logic:
      // A space (optional) followed by Kanji/Kana and then its reading in brackets: " ?[Kanji/Kana]+[reading]"
      // Everything else is just text.
      const regex = / ?([\u3040-\u30FF\u4E00-\u9FAF]+)\[([^\]]+)\]|([^\u3040-\u30FF\u4E00-\u9FAF[]+)|([\u3040-\u30FF\u4E00-\u9FAF]+)/gu
      let match

      while ((match = regex.exec(ankiText)) !== null) {
        if (match[1] && match[2]) {
          // Kanji/Kana word with [Reading]
          const word = match[1]
          const reading = this.toHiragana(match[2])

          // If the AI gave a reading for a word that contains both Kanji and Kana (e.g. 皆さん[みなさん]),
          // we should ideally only apply the reading to the Kanji part.
          const mixedMatch = word.match(/^([\u4E00-\u9FAF]+)([\u3040-\u30FF]+)$/)
          if (mixedMatch) {
            // Case: 皆さん[みなさん] -> we want 皆[みな]さん
            if (reading.endsWith(mixedMatch[2])) {
              segments.push({
                word: mixedMatch[1],
                reading: reading.slice(0, reading.length - mixedMatch[2].length)
              })
              segments.push({ word: mixedMatch[2] })
            } else {
              segments.push({ word, reading })
            }
          } else if (/[\u4E00-\u9FAF]/.test(word)) {
            segments.push({ word, reading })
          } else {
            segments.push({ word })
          }
        } else if (match[3]) {
          // Punctuation or other non-Japanese characters
          segments.push({ word: match[3] })
        } else if (match[4]) {
          // Japanese characters without reading
          segments.push({ word: match[4] })
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
    return this.workingSession !== null
  }
}

export const furiganaService = new JapaneseFuriganaService()
