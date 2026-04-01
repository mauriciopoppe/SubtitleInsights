import { aiLogger } from '../logger';
// @ts-expect-error - no types
import Kuroshiro from "kuroshiro";
// @ts-expect-error - no types
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

class KuroshiroService {
    private kuroshiro: any;
    private analyzer: any;
    private isInitialized: boolean = false;
    private initPromise: Promise<void> | null = null;

    constructor() {
        this.kuroshiro = new (Kuroshiro.default || Kuroshiro)();
        
        const dictPath = typeof chrome !== 'undefined' && chrome.runtime 
            ? chrome.runtime.getURL("dict")
            : "dict";

        this.analyzer = new (KuromojiAnalyzer.default || KuromojiAnalyzer)({
            dictPath
        });
    }

    async init(): Promise<void> {
        if (this.isInitialized) return;
        if (this.initPromise) return this.initPromise;

        this.initPromise = (async () => {
            try {
                aiLogger.V(1).info("Initializing Kuroshiro with Kuromoji (Standard Imports)...");
                await this.kuroshiro.init(this.analyzer);
                this.isInitialized = true;
                aiLogger.V(1).info("Kuroshiro initialized.");
            } catch (err) {
                aiLogger.V(1).info("ERROR: Failed to initialize Kuroshiro:", err);
                this.initPromise = null;
                throw err;
            }
        })();

        return this.initPromise;
    }

    async convert(text: string): Promise<string> {
        await this.init();
        return this.kuroshiro.convert(text, { mode: "furigana", to: "hiragana" });
    }

    get ready(): boolean {
        return this.isInitialized;
    }
}

export const kuroshiroService = new KuroshiroService();
