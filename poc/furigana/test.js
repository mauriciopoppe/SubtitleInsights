const Kuroshiro = require("kuroshiro").default;
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");

const kuroshiro = new Kuroshiro();

async function run() {
    console.log("Initializing Kuroshiro with Kuromoji...");
    await kuroshiro.init(new KuromojiAnalyzer({
        dictPath: "dict"
    }));
    
    const testSentences = [
        "漢字",
        "食べます",
        "学校に行きました。",
        "皆さんは、日本のイベントをいくつ知ってますか？"
    ];

    console.log("\nGenerating AISegment[][] Structure:");
    for (const text of testSentences) {
        // We'll use kuromoji directly through kuroshiro's utility if possible
        // or just parse the ruby output for now to keep it simple and deterministic.
        // Actually, kuroshiro's convert with 'furigana' is quite reliable for segmentation.
        
        const result = await kuroshiro.convert(text, { mode: "furigana", to: "hiragana" });
        
        // Simple parser for the <ruby> tags to turn them into AISegment[]
        const segments = [];
        const regex = /<ruby>([^<]+)<rp>\(<\/rp><rt>([^<]+)<\/rt><rp>\)<\/rp><\/ruby>|([^<]+)/g;
        let match;
        
        while ((match = regex.exec(result)) !== null) {
            if (match[1] && match[2]) {
                // It's a ruby block
                segments.push({ word: match[1], reading: match[2] });
            } else if (match[3]) {
                // It's plain text
                segments.push({ word: match[3] });
            }
        }

        // Main app expects AISegment[][] (outer array = visual blocks)
        // Since we don't want artificial spaces, we put everything in one inner array.
        const structuredData = [segments];
        
        console.log(`Input: ${text}`);
        console.log(`Structured: ${JSON.stringify(structuredData, null, 2)}\n`);
    }
}

run().catch(err => {
    console.error("Error:", err);
});
