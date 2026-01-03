/**
 * Checks if a Japanese sentence is "complex" enough to warrant an AI grammar explanation.
 * Complexity is defined as length > 5 characters OR containing at least one common particle.
 */
export function isComplexSentence(text: string): boolean {
  if (!text) return false

  // Rule 1: Always analyze long sentences (> 10 chars)
  if (text.length > 10) return true

  // Rule 2: For medium length (4-10 chars), check for particles
  // We skip very short strings (< 4) to avoid "はい" (Yes), "いいえ" (No), etc.
  if (text.length >= 4) {
    const commonParticles = /[はがをにへともでからまでより]/
    if (commonParticles.test(text)) return true
  }

  return false
}

/**
 * Some models prepend their response with a "thinking" process enclosed in brackets
 * or by repeating the original input text.
 * This function cleans the response by removing such leading content.
 */
export function trimThinkingProcess(
  text: string,
  originalInput: string
): string {
  if (!text) return text

  let currentText = text.trim()

  // 1. Remove thinking blocks in brackets: [Thinking...]
  let foundBlock = true
  while (foundBlock && currentText.startsWith('[')) {
    let depth = 0
    let endFound = false

    for (let i = 0; i < currentText.length; i++) {
      if (currentText[i] === '[') {
        depth++
      } else if (currentText[i] === ']') {
        depth--
        if (depth === 0) {
          currentText = currentText.slice(i + 1).trim()
          currentText = currentText.replace(/^[.:]\s*/, '')
          endFound = true
          break
        }
      }
    }
    if (!endFound) foundBlock = false
  }

  // 2. Remove repeated input if present at the very beginning
  const trimmedInput = originalInput.trim()
  if (currentText.startsWith(trimmedInput)) {
    // Check if it's an exact match followed by whitespace or newline
    // to avoid partial word matching if that were possible
    const afterInput = currentText.slice(trimmedInput.length).trim()
    if (afterInput !== currentText) {
      currentText = afterInput
    }
  }

  return currentText
}
