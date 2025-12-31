import { translatorService } from "./translator";
import { grammarExplainer } from "./explainer";
import { isComplexSentence } from "./utils";
import { Config } from "../config";
import { store } from "../store";

interface ProcessingTask {
  index: number;
  translate: boolean;
  grammar: boolean;
}

export class AIManager {
  private isProcessing = false;
  private pendingIndices = new Set<number>();
  private translateBuffer = 10;
  private grammarBuffer = 2;

  constructor() {}

  public async onTimeUpdate(currentTimeMs: number) {
    // Only process Japanese content
    if (store.sourceLanguage && !store.sourceLanguage.startsWith("ja")) {
      return;
    }

    const allSegments = store.getAllSegments();
    if (allSegments.length === 0) return;

    // Find current segment index
    const currentIndex = allSegments.findIndex(
      (s) => currentTimeMs >= s.start && currentTimeMs <= s.end,
    );

    let targetIndex = currentIndex;
    if (currentIndex === -1) {
      // If no current segment, find the next upcoming one to start prefetching from
      targetIndex = allSegments.findIndex((s) => s.start > currentTimeMs);
      if (targetIndex === -1) targetIndex = 0; // Fallback to start
    }

    // console.log(`[LLE] Time: ${Math.round(currentTimeMs)}, Current: ${currentIndex}, Target: ${targetIndex}, Processing: ${this.isProcessing}`);

    await this.triggerPrefetch(targetIndex);
  }

  private async triggerPrefetch(startIndex: number) {
    if (this.isProcessing) return;

    const allSegments = store.getAllSegments();
    const toProcess: ProcessingTask[] = [];

    const isGrammarEnabled = await Config.getIsGrammarExplainerEnabled();

    // Single loop up to the maximum buffer (translateBuffer)
    for (
      let i = startIndex;
      i < Math.min(startIndex + this.translateBuffer, allSegments.length);
      i++
    ) {
      const seg = allSegments[i];
      const needsTranslation = translatorService.isReady() && !seg.translation;

      const inGrammarRange = i < startIndex + this.grammarBuffer;
      const needsGrammar =
        isGrammarEnabled &&
        grammarExplainer.isReady() &&
        !seg.contextual_analysis &&
        isComplexSentence(seg.text) &&
        inGrammarRange;

      if ((needsTranslation || needsGrammar) && !this.pendingIndices.has(i)) {
        toProcess.push({
          index: i,
          translate: !!needsTranslation,
          grammar: !!needsGrammar,
        });
      }
    }

    if (toProcess.length > 0) {
      await this.processQueue(toProcess);
    }
  }

  private async processQueue(tasks: ProcessingTask[]) {
    this.isProcessing = true;

    try {
      // Process all indices in parallel
      await Promise.all(tasks.map((task) => this.processSegment(task)));
    } finally {
      this.isProcessing = false;
    }
  }

  private async processSegment(task: ProcessingTask) {
    const { index, translate, grammar } = task;
    const allSegments = store.getAllSegments();
    const segment = allSegments[index];
    if (!segment) return;

    this.pendingIndices.add(index);
    // console.log(`[LLE] Processing segment ${index}...`);

    try {
      const tasks: Promise<any>[] = [];

      const withTimeout = (promise: Promise<any>, ms: number) => {
        return Promise.race([
          promise,
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), ms),
          ),
        ]);
      };

      if (translate) {
        tasks.push(
          (async () => {
            try {
              const translation = await withTimeout(
                translatorService.translate(segment.text),
                10000,
              );
              store.updateSegmentTranslation(index, translation);
            } catch (e) {
              console.error(`[LLE] Translation failed for ${index}:`, e);
            }
          })(),
        );
      }

      if (grammar) {
        tasks.push(
          (async () => {
            try {
              const analysis = await withTimeout(
                grammarExplainer.explainGrammar(segment.text),
                10000,
              );
              store.updateSegmentAnalysis(index, analysis);
            } catch (e) {
              console.error(
                `[LLE] Grammar explanation failed for ${index}:`,
                e,
              );
            }
          })(),
        );
      }

      await Promise.all(tasks);
    } catch (error) {
      console.error(
        `[LLE][AIManager] Failed to process segment ${index}`,
        error,
      );
    } finally {
      this.pendingIndices.delete(index);
    }
  }
}

export const translationManager = new AIManager();
