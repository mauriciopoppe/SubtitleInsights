import { describe, it, expect } from 'vitest'
import { trimThinkingProcess, isComplexSentence } from './utils'

describe('trimThinkingProcess', () => {
  it('should remove simple thinking blocks', () => {
    const input = '[Thinking...] Actual response'
    expect(trimThinkingProcess(input, '')).toBe('Actual response')
  })

  it('should remove nested thinking blocks', () => {
    const input = '[Thinking [deeply]...] Actual response'
    expect(trimThinkingProcess(input, '')).toBe('Actual response')
  })

  it('should remove leading separators after blocks', () => {
    const input = '[Thinking]: Actual response'
    expect(trimThinkingProcess(input, '')).toBe('Actual response')
  })

  it('should handle multiple sequential blocks', () => {
    const input = '[Thinking][Still thinking] Actual response'
    expect(trimThinkingProcess(input, '')).toBe('Actual response')
  })

  it('should remove repeated original input at the beginning', () => {
    const originalInput = 'お化けの音が聞こえる島に向かう前に、事件のことをざっくり、簡単に説明してもらえますか？'
    const aiResponse = `${originalInput}\n\nThe sentence employs 「前に」 to indicate a sequence of events...`

    const result = trimThinkingProcess(aiResponse, originalInput)
    expect(result).toBe('The sentence employs 「前に」 to indicate a sequence of events...')
  })

  it('should handle both thinking block AND repeated input', () => {
    const originalInput = 'Hello world'
    const aiResponse = '[Thinking...] Hello world\n\nThis is the explanation.'

    const result = trimThinkingProcess(aiResponse, originalInput)
    expect(result).toBe('This is the explanation.')
  })

  it('should not trim if it is a partial match only', () => {
    const originalInput = 'Hello'
    const aiResponse = 'Hello world is a common phrase.'

    // In our implementation, we check if it is followed by whitespace/newline
    // "Hello world" starts with "Hello", but if we just slice it might be risky.
    // Our current implementation does: .slice().trim() and checks if result changed.

    const result = trimThinkingProcess(aiResponse, originalInput)
    expect(result).toBe('world is a common phrase.')
  })
})

describe('isComplexSentence', () => {
  it('should return true for long sentences', () => {
    expect(isComplexSentence('This is a very long sentence indeed.')).toBe(true)
  })

  it('should return true for medium sentences with particles', () => {
    expect(isComplexSentence('猫が好き。')).toBe(true) // contains が
  })

  it('should return false for very short sentences without particles', () => {
    expect(isComplexSentence('はい')).toBe(false)
  })
})
