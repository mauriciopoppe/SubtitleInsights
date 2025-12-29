import { translatorService } from "./translator";
import { store } from "../store";

export class TranslationManager {
  private isProcessing = false;
  private pendingIndices = new Set<number>();
  private prefetchBuffer = 20;

  constructor() {}

  public async onTimeUpdate(currentTimeMs: number) {
    if (!translatorService.isReady() || store.isStructured) {
      return;
    }

    const allSegments = store.getAllSegments();
    if (allSegments.length === 0) return;

    // Find current segment index
    const currentIndex = allSegments.findIndex(
      (s) => currentTimeMs >= s.start && currentTimeMs <= s.end
    );

    let targetIndex = currentIndex;
    if (currentIndex === -1) {
       // If no current segment, find the next upcoming one to start prefetching from
       targetIndex = allSegments.findIndex(s => s.start > currentTimeMs);
       if (targetIndex === -1) targetIndex = 0; // Fallback to start
    }

    await this.triggerPrefetch(targetIndex);
  }

  private async triggerPrefetch(startIndex: number) {
    if (this.isProcessing) return;

    const allSegments = store.getAllSegments();
    const toTranslate: number[] = [];

    for (let i = startIndex; i < Math.min(startIndex + this.prefetchBuffer, allSegments.length); i++) {
      if (!allSegments[i].translation && !this.pendingIndices.has(i)) {
        toTranslate.push(i);
      }
    }

    if (toTranslate.length > 0) {
      await this.processQueue(toTranslate);
    }
  }

  private async processQueue(indices: number[]) {
    this.isProcessing = true;

    try {
        // Process all indices in parallel
        await Promise.all(indices.map(index => this.translateSegment(index)));
    } finally {
        this.isProcessing = false;
    }
  }

  private async translateSegment(index: number) {
      const allSegments = store.getAllSegments();
      const segment = allSegments[index];
      if (!segment || segment.translation) return;

      this.pendingIndices.add(index);

      try {
          const translation = await translatorService.translate(segment.text);
          store.updateSegmentTranslation(index, translation);
      } catch (error) {
          console.error(`[LLE][TranslationManager] Failed to translate segment ${index}`, error);
      } finally {
          this.pendingIndices.delete(index);
      }
  }
}

export const translationManager = new TranslationManager();
