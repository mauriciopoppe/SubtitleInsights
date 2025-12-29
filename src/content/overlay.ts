import snarkdown from "snarkdown";
import { SubtitleSegment } from "./store";
import { renderSegmentedText } from "./render";

export class Overlay {
  private container: HTMLElement;
  private translation: HTMLElement;
  private original: HTMLElement;
  private literal: HTMLElement;
  private analysis: HTMLElement;
  private gotchas: HTMLElement;

  constructor() {
    this.container = document.createElement("div");
    this.container.id = "lle-overlay";

    this.translation = document.createElement("div");
    this.translation.className = "lle-translation";

    this.original = document.createElement("div");
    this.original.className = "lle-original";

    this.literal = document.createElement("div");
    this.literal.className = "lle-literal";

    this.analysis = document.createElement("div");
    this.analysis.className = "lle-analysis";

    this.gotchas = document.createElement("div");
    this.gotchas.className = "lle-gotchas";

    this.container.appendChild(this.translation);
    this.container.appendChild(this.original);
    this.container.appendChild(this.literal);
    this.container.appendChild(this.analysis);
    this.container.appendChild(this.gotchas);
  }

  public getElement(): HTMLElement {
    return this.container;
  }

  public setVisible(visible: boolean) {
    this.container.style.display = visible ? "flex" : "none";
  }

  public isVisible(): boolean {
    return this.container.style.display === "flex";
  }

  public clear() {
    this.setVisible(false);
    this.original.innerHTML = "";
    this.translation.innerText = "";
    this.literal.innerText = "";
    this.analysis.innerText = "";
    this.gotchas.innerText = "";
  }

  public update(segment: SubtitleSegment) {
    // Ensure overlay is visible
    if (!this.isVisible()) {
      this.setVisible(true);
    }

    // Update Original Text
    if (segment.segmentedData) {
      this.original.innerHTML = renderSegmentedText(segment.segmentedData);
    } else {
      // Fallback
      this.original.innerHTML = segment.text
        .split("")
        .map((char) => `<span class="lle-word">${char}</span>`)
        .join("");
    }

    // Update Translation Text
    this.translation.innerText = segment.translation || "";

    // Update Additional Fields (only for structured data)
    this.literal.innerText = segment.literal_translation || "";
    this.analysis.innerHTML = segment.contextual_analysis
      ? snarkdown(segment.contextual_analysis)
      : "";
    this.gotchas.innerHTML = segment.grammatical_gotchas
      ? snarkdown(segment.grammatical_gotchas)
      : "";
  }
}
