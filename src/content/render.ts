import { AISegment } from "./types";

/**
 * Renders a list of AI segments into an HTML string with Furigana and word spacing.
 * The input is an array of arrays, where the inner array represents parts of a single word
 * (no space between them) and the outer array represents separate words (space between them).
 */
export function renderSegmentedText(segments: AISegment[][]): string {
  return segments
    .map((wordGroup) => {
      const groupHTML = wordGroup
        .map((segment) => {
          const { word, reading } = segment;
          if (reading) {
            return `<ruby>${word}<rt>${reading}</rt></ruby>`;
          }
          return `<span>${word}</span>`;
        })
        .join(""); // No space within a group
      return `<span>${groupHTML}</span>`;
    })
    .join("&nbsp;"); // Space between groups
}
