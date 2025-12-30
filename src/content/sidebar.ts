import { SubtitleSegment } from "./store";
import { renderSegmentedText } from "./render";
import snarkdown from "snarkdown";
import { Config } from "./config";

export class Sidebar {
  private container: HTMLElement;
  private listContainer: HTMLElement;
  private overlayToggle: HTMLElement | null = null;
  private grammarToggle: HTMLElement | null = null;
  private uploadBtn: HTMLElement | null = null;
  private jumpBtn: HTMLElement | null = null;
  private aiStatusIcon: HTMLElement | null = null;
  private warningIcon: HTMLElement | null = null;

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

    // Jump to Active Button
    this.jumpBtn = document.createElement("span");
    this.jumpBtn.className = "lle-sidebar-jump-btn";
    this.jumpBtn.title = "Jump to Active Segment";
    this.jumpBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
      </svg>
      <span>Sync</span>
    `;
    this.jumpBtn.onclick = () => this.scrollToActive();

    // Upload Button
    this.uploadBtn = document.createElement("span");
    this.uploadBtn.className = "lle-sidebar-upload-btn";
    this.uploadBtn.innerText = "Upload";
    this.uploadBtn.title = "Upload Structured Subtitles (Markdown)";
    if (onUploadClick) {
      this.uploadBtn.onclick = onUploadClick;
    }

    // Overlay Toggle Button
    this.overlayToggle = document.createElement("span");
    this.overlayToggle.className = "lle-sidebar-overlay-btn";
    this.overlayToggle.innerText = "Overlay";
    this.overlayToggle.title = "Toggle On-Video Overlay";

    this.initOverlayToggle();

    // Grammar Explainer Toggle Button
    this.grammarToggle = document.createElement("span");
    this.grammarToggle.className = "lle-sidebar-grammar-btn";
    this.grammarToggle.title = "Toggle AI Grammar Explanation";
    this.grammarToggle.innerHTML = `
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M7.5 5.6L10 0l2.5 5.6L18 8l-5.5 2.4L10 16 7.5 10.4 2 8l5.5-2.4z"/>
      </svg>
      <span>AI</span>
    `;
    this.initGrammarToggle();

    // AI Status Icon
    this.aiStatusIcon = document.createElement("span");
    this.aiStatusIcon.className = "lle-sidebar-ai-status";
    this.aiStatusIcon.style.display = "none";
    this.aiStatusIcon.style.marginLeft = "8px";
    this.aiStatusIcon.style.cursor = "help";
    this.aiStatusIcon.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.08-.34.12-.57.12s-.41-.04-.57-.12l-7.9-4.44A1.001 1.001 0 013 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.08.34-.12.57-.12s.41.04.57.12l7.9 4.44c.32.17.53.5.53.88v9zM12 4.15L6.04 7.5 12 10.85l5.96-3.35L12 4.15zM5 15.91l6 3.38v-6.71L5 9.21v6.7zm14 0v-6.7l-6 3.37v6.71l6-3.38z"/>
      </svg>
    `;

    // Warning Icon
    this.warningIcon = document.createElement("span");
    this.warningIcon.className = "lle-sidebar-warning";
    this.warningIcon.style.display = "none";
    this.warningIcon.style.color = "#ffcc00"; // Warning yellow
    this.warningIcon.style.marginLeft = "8px";
    this.warningIcon.style.cursor = "help";
    this.warningIcon.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
    `;

    controls.appendChild(this.jumpBtn);
    controls.appendChild(this.uploadBtn);
    controls.appendChild(this.overlayToggle);
    controls.appendChild(this.grammarToggle);
    controls.appendChild(this.aiStatusIcon);
    controls.appendChild(this.warningIcon);

    header.appendChild(title);
    header.appendChild(controls);

    this.listContainer = document.createElement("div");
    this.listContainer.className = "lle-sidebar-list";

    this.container.appendChild(header);
    this.container.appendChild(this.listContainer);
  }

  public setAIStatus(status: "downloading" | "ready" | "error" | "none", message?: string) {
    if (!this.aiStatusIcon) return;
    if (status === "none") {
      this.aiStatusIcon.style.display = "none";
      return;
    }

    this.aiStatusIcon.style.display = "inline-flex";
    this.aiStatusIcon.title = message || status;

    if (status === "downloading") {
      this.aiStatusIcon.style.color = "#3ea6ff"; // Blue
    } else if (status === "ready") {
      this.aiStatusIcon.style.color = "#2ba640"; // Green
    } else if (status === "error") {
      this.aiStatusIcon.style.color = "#ff4e43"; // Red
    }
  }

  public setWarning(message?: string) {
    if (!this.warningIcon) return;
    if (message) {
      this.warningIcon.style.display = "inline-flex";
      this.warningIcon.title = message;
    } else {
      this.warningIcon.style.display = "none";
      this.warningIcon.title = "";
    }
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

  private async initGrammarToggle() {
    if (!this.grammarToggle) return;

    const updateUI = (enabled: boolean) => {
      this.grammarToggle!.className = `lle-sidebar-grammar-btn ${enabled ? "enabled" : "disabled"}`;
    };

    // Default to false if not set (or true? Spec says provide toggle, let's assume default off for performance or on for discovery?
    // Config defaults to true usually if logic isn't there, but let's check Config implementation)
    // Config.getIsGrammarExplainerEnabled() needs to be implemented in Config first? I did that.
    // Let's assume default true in Config.
    const isEnabled = await Config.getIsGrammarExplainerEnabled();
    updateUI(isEnabled);

    this.grammarToggle.onclick = async () => {
      const current = await Config.getIsGrammarExplainerEnabled();
      const newState = !current;
      await Config.setIsGrammarExplainerEnabled(newState);
      updateUI(newState);
    };

    Config.addGrammarExplainerChangeListener((enabled) => {
      updateUI(enabled);
    });
  }

  public getUploadBtn(): HTMLElement | null {
    return this.uploadBtn;
  }

  public setUploadActive(active: boolean, filename?: string) {
    if (!this.uploadBtn) return;
    if (active) {
      this.uploadBtn.classList.add("active");
      if (filename) {
        this.uploadBtn.title = `Loaded: ${filename}`;
      }
    } else {
      this.uploadBtn.classList.remove("active");
      this.uploadBtn.title = "Upload Structured Subtitles (Markdown)";
    }
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
    this.lastActiveItem = null;
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

  public updateSegment(index: number, segment: SubtitleSegment) {
    const item = this.listContainer.querySelector(`.lle-sidebar-item[data-index="${index}"]`);
    if (!item) return;

    const translation = item.querySelector(".lle-sidebar-translation");
    if (translation) {
      translation.textContent = segment.translation || "";
    }
  }

  private activeItem: HTMLElement | null = null;
  private lastActiveItem: HTMLElement | null = null;

  private scrollToActive() {
    const target = this.activeItem || this.lastActiveItem;
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

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
          this.lastActiveItem = htmlItem;
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
