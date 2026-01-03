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
 * Some models prepend their response with a "thinking" process enclosed in brackets.
 * This function removes any leading content enclosed in [brackets], handling nesting.
 * Example: "[Thinking [deeply]...] Actual response" -> "Actual response"
 */
export function trimThinkingProcess(text: string): string {
  if (!text) return text

  console.log(text)

  let currentText = text.trim()
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
          // Found the matching closing bracket
          currentText = currentText.slice(i + 1).trim()
          // Also remove common separators that might follow the block like "." or ":"
          currentText = currentText.replace(/^[.:]\s*/, '')
          endFound = true
          break
        }
      }
    }

    // If we didn't find a closing bracket for the start, stop loop
    if (!endFound) {
      foundBlock = false
    }
  }

  return currentText
}
