import { AISegment } from "./types";

/**
 * Renders a list of AI segments into an HTML string with Furigana and word spacing.
 * The input is an array of arrays, where the inner array represents parts of a single word
 * (no space between them) and the outer array represents separate words (space between them).
 */
export function renderSegmentedText(segments: AISegment[][]): string {
  return segments
    .map((wordGroup) => {
      return wordGroup
        .map((segment) => {
          const { word, reading } = segment;
          if (reading && reading !== word) {
            return `<ruby>${word}<rt>${reading}</rt></ruby>`;
          }
          return word;
        })
        .join(""); // No space within a group
    })
    .join("&nbsp;"); // Space between groups
}
