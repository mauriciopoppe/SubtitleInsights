import { AISegment } from "./ai";

/**
 * Renders a list of AI segments into an HTML string with Furigana and word spacing.
 * Uses <ruby> for readings and literal spaces for segmentation.
 */
export function renderSegmentedText(segments: AISegment[]): string {
  return segments
    .map((segment) => {
      const { word, reading } = segment;
      if (reading) {
        return `<ruby>${word}<rt>${reading}</rt></ruby>`;
      }
      return `<span>${word}</span>`;
    })
    .join("&nbsp;"); // Using non-breaking space for clear separation
}
