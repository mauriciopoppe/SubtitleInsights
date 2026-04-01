import { describe, it, expect, vi, beforeEach } from 'vitest';
import { furiganaService } from './furigana';
import { kuroshiroService } from './kuroshiro';

vi.mock('./kuroshiro', () => ({
    kuroshiroService: {
        convert: vi.fn(),
        init: vi.fn(),
        ready: true
    }
}));

describe('JapaneseFuriganaService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should generate structured furigana data using kuroshiro', async () => {
        const inputText = "漢字";
        const kuroshiroOutput = "<ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby>";
        
        vi.mocked(kuroshiroService.convert).mockResolvedValue(kuroshiroOutput);

        const result = await furiganaService.generateFurigana(inputText);

        expect(result).toEqual([
            [
                { word: "漢字", reading: "かんじ" }
            ]
        ]);
        expect(kuroshiroService.convert).toHaveBeenCalledWith(inputText);
    });

    it('should handle mixed kanji and kana correctly', async () => {
        const inputText = "食べます";
        const kuroshiroOutput = "<ruby>食<rp>(</rp><rt>た</rt><rp>)</rp></ruby>べます";
        
        vi.mocked(kuroshiroService.convert).mockResolvedValue(kuroshiroOutput);

        const result = await furiganaService.generateFurigana(inputText);

        expect(result).toEqual([
            [
                { word: "食", reading: "た" },
                { word: "べます" }
            ]
        ]);
    });

    it('should handle sentences with punctuation', async () => {
        const inputText = "学校に行きました。";
        const kuroshiroOutput = "<ruby>学校<rp>(</rp><rt>がっこう</rt><rp>)</rp></ruby>に<ruby>行<rp>(</rp><rt>い</rt><rp>)</rp></ruby>きました。";
        
        vi.mocked(kuroshiroService.convert).mockResolvedValue(kuroshiroOutput);

        const result = await furiganaService.generateFurigana(inputText);

        expect(result).toEqual([
            [
                { word: "学校", reading: "がっこう" },
                { word: "に" },
                { word: "行", reading: "い" },
                { word: "きました。" }
            ]
        ]);
    });

    it('should fallback to raw text if kuroshiro fails', async () => {
        const inputText = "失敗";
        vi.mocked(kuroshiroService.convert).mockRejectedValue(new Error("Kuroshiro Error"));

        const result = await furiganaService.generateFurigana(inputText);

        expect(result).toEqual([
            [
                { word: inputText }
            ]
        ]);
    });
});
