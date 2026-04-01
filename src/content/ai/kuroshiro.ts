// @ts-ignore
import Kuroshiro from "kuroshiro";
// @ts-ignore
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import { aiLogger } from '../logger';

class KuroshiroService {
    private kuroshiro: any;
    private analyzer: any;
    private isInitialized: boolean = false;
    private initPromise: Promise<void> | null = null;

    constructor() {
        // Kuroshiro might need .default depending on how Vite bundles it
        this.kuroshiro = new (Kuroshiro.default || Kuroshiro)();
        this.analyzer = new (KuromojiAnalyzer.default || KuromojiAnalyzer)({
            dictPath: chrome.runtime.getURL("dict")
        });
    }

    async init(): Promise<void> {
        if (this.isInitialized) return;
        if (this.initPromise) return this.initPromise;

        this.initPromise = (async () => {
            try {
                aiLogger.V(1).info("Initializing Kuroshiro with Kuromoji...");
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
