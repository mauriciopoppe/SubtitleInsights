import { SubtitleSegment } from "./store";
import { renderSegmentedText } from "./render";
import snarkdown from "snarkdown";
import { Config } from "./config";

export class Sidebar {
  private container: HTMLElement;
  private listContainer: HTMLElement;
  private overlayToggle: HTMLElement | null = null;
  private uploadBtn: HTMLElement | null = null;

  constructor(onUploadClick?: () => void) {
    this.container = document.createElement("div");
    this.container.id = "lle-sidebar";
    this.container.style.display = "none"; // Hidden by default

    const header = document.createElement("div");
    header.className = "lle-sidebar-header";

    const title = document.createElement("div");
    title.className = "lle-sidebar-title";
    title.innerText = "LLE Transcript";

    const controls = document.createElement("div");
    controls.className = "lle-sidebar-controls";

    // Upload Button
    this.uploadBtn = document.createElement("span");
    this.uploadBtn.className = "lle-sidebar-upload-btn";
    this.uploadBtn.innerText = "UP";
    this.uploadBtn.title = "Upload Structured Subtitles (Markdown)";
    if (onUploadClick) {
      this.uploadBtn.onclick = onUploadClick;
    }

    // Overlay Toggle
    this.overlayToggle = document.createElement("span");
    this.overlayToggle.className = "lle-sidebar-overlay-btn";
    this.overlayToggle.innerText = "Overlay";
    this.overlayToggle.title = "Toggle On-Video Overlay";

    this.initOverlayToggle();

    controls.appendChild(this.uploadBtn);
    controls.appendChild(this.overlayToggle);

    header.appendChild(title);
    header.appendChild(controls);

    this.listContainer = document.createElement("div");
    this.listContainer.className = "lle-sidebar-list";

    this.container.appendChild(header);
    this.container.appendChild(this.listContainer);
  }

  private async initOverlayToggle() {
    if (!this.overlayToggle) return;

    const updateUI = (enabled: boolean) => {
      this.overlayToggle!.className = `lle-sidebar-overlay-btn ${enabled ? "enabled" : "disabled"}`;
    };

    const isEnabled = await Config.getIsOverlayEnabled();
    updateUI(isEnabled);

    this.overlayToggle.onclick = async () => {
      const current = await Config.getIsOverlayEnabled();
      const newState = !current;
      await Config.setIsOverlayEnabled(newState);
      updateUI(newState);
    };

    Config.addOverlayChangeListener((enabled) => {
      updateUI(enabled);
    });
  }

  public getUploadBtn(): HTMLElement | null {
    return this.uploadBtn;
  }

  public getElement(): HTMLElement {
    return this.container;
  }

  public setVisible(visible: boolean) {
    this.container.style.display = visible ? "flex" : "none";
  }

  public clear() {
    this.listContainer.innerHTML = "";
    this.activeItem = null;
  }

  public render(segments: SubtitleSegment[]) {
    this.clear();
    segments.forEach((segment, index) => {
      const item = document.createElement("div");
      item.className = "lle-sidebar-item";
      item.dataset.index = index.toString();
      item.dataset.start = segment.start.toString();
      item.dataset.end = segment.end.toString();

      // Original text with Furigana
      const original = document.createElement("div");
      original.className = "lle-sidebar-original";
      if (segment.segmentedData) {
        original.innerHTML = renderSegmentedText(segment.segmentedData);
      } else {
        original.innerText = segment.text;
      }

      // Natural Translation
      const translation = document.createElement("div");
      translation.className = "lle-sidebar-translation";
      translation.innerText = segment.translation || "";

      // Literal Translation
      const literal = document.createElement("div");
      literal.className = "lle-sidebar-literal";
      literal.innerText = segment.literal_translation || "";

      item.appendChild(original);
      item.appendChild(translation);
      if (segment.literal_translation) {
        item.appendChild(literal);
      }

      // Contextual Analysis
      if (segment.contextual_analysis) {
        const analysis = document.createElement("div");
        analysis.className = "lle-sidebar-analysis";
        analysis.innerHTML = snarkdown(segment.contextual_analysis);
        item.appendChild(analysis);
      }

      // Grammatical Gotchas
      if (segment.grammatical_gotchas) {
        const gotchas = document.createElement("div");
        gotchas.className = "lle-sidebar-gotchas";
        gotchas.innerHTML = snarkdown(segment.grammatical_gotchas);
        item.appendChild(gotchas);
      }

      this.listContainer.appendChild(item);
    });
  }

  private activeItem: HTMLElement | null = null;

  public highlight(currentTimeMs: number) {
    const items = this.listContainer.querySelectorAll(".lle-sidebar-item");
    let foundActive = false;

    items.forEach((item) => {
      const htmlItem = item as HTMLElement;
      const start = parseFloat(htmlItem.getAttribute("data-start") || "0");
      const end = parseFloat(htmlItem.getAttribute("data-end") || "0");

      if (currentTimeMs >= start && currentTimeMs <= end) {
        foundActive = true;
        if (this.activeItem !== htmlItem) {
          if (this.activeItem) {
            this.activeItem.classList.remove("active");
          }
          htmlItem.classList.add("active");
          this.activeItem = htmlItem;
          // htmlItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });

    if (!foundActive && this.activeItem) {
      this.activeItem.classList.remove("active");
      this.activeItem = null;
    }
  }
}
