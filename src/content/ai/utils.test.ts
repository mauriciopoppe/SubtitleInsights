import { describe, it, expect } from 'vitest'
import { trimThinkingProcess } from './utils'

describe('trimThinkingProcess', () => {
  it('should remove leading content in brackets', () => {
    const input = '[Thinking...] Actual response'
    const expected = 'Actual response'
    expect(trimThinkingProcess(input)).toBe(expected)
  })

  it('should remove multiple leading bracketed sections', () => {
    const input = '[Thought 1] [Thought 2] Real answer'
    const expected = 'Real answer'
    expect(trimThinkingProcess(input)).toBe(expected)
  })

  it('should not remove brackets in the middle of the text', () => {
    const input = 'Here is [some] info'
    expect(trimThinkingProcess(input)).toBe(input)
  })

  it('should handle empty or null input', () => {
    expect(trimThinkingProcess('')).toBe('')
  })

  it('should handle text with no brackets', () => {
    const input = 'Just plain text'
    expect(trimThinkingProcess(input)).toBe(input)
  })

  it('should handle user example with nested brackets', () => {
    const input = '[Au sein de [cette société] [imbriquée dans [une autre société]], un an [de progrès] se fait [en une semaine]]. The phrase "Au sein de"...'
    const expected = 'The phrase "Au sein de"...'
    expect(trimThinkingProcess(input)).toBe(expected)
  })
})
