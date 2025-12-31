/**
 * Checks if a Japanese sentence is "complex" enough to warrant an AI grammar explanation.
 * Complexity is defined as length > 5 characters OR containing at least one common particle.
 */
export function isComplexSentence(text: string): boolean {
  if (!text) return false;

  // Rule 1: Always analyze long sentences (> 10 chars)
  if (text.length > 10) return true;

  // Rule 2: For medium length (4-10 chars), check for particles
  // We skip very short strings (< 4) to avoid "はい" (Yes), "いいえ" (No), etc.
  if (text.length >= 4) {
    const commonParticles = /[はがをにへともでからまでより]/;
    if (commonParticles.test(text)) return true;
  }

  return false;
}
