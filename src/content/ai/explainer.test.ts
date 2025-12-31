import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GrammarExplainer } from './explainer';

describe('GrammarExplainer', () => {
  let explainer: GrammarExplainer;
  let mockRootSession: any;
  let mockWorkingSession: any;

  beforeEach(() => {
    mockWorkingSession = {
      prompt: vi.fn().mockResolvedValue('Grammar explanation'),
      destroy: vi.fn().mockResolvedValue(undefined),
    };

    mockRootSession = {
      clone: vi.fn().mockResolvedValue(mockWorkingSession),
      destroy: vi.fn().mockResolvedValue(undefined),
    };

    // Mock global LanguageModel using Vitest helper
    vi.stubGlobal('LanguageModel', {
      params: vi.fn().mockResolvedValue({ defaultTopK: 3 }),
      create: vi.fn().mockResolvedValue(mockRootSession),
      availability: vi.fn().mockResolvedValue('available'),
    });

    explainer = new GrammarExplainer();
  });

  it('should initialize and create a root session and a working clone', async () => {
    const success = await explainer.initialize();
    expect(success).toBe(true);
    expect(explainer.isReady()).toBe(true);
    expect(window.LanguageModel.create).toHaveBeenCalled();
    expect(mockRootSession.clone).toHaveBeenCalled();
  });

  it('should reuse root session but recreate working session on reset', async () => {
    await explainer.initialize();
    expect(window.LanguageModel.create).toHaveBeenCalledTimes(1);
    expect(mockRootSession.clone).toHaveBeenCalledTimes(1);

    const firstWorkingSession = mockWorkingSession;
    const secondWorkingSession = { ...mockWorkingSession };
    mockRootSession.clone.mockResolvedValue(secondWorkingSession);

    await explainer.resetSession();
    
    expect(window.LanguageModel.create).toHaveBeenCalledTimes(1); // Still 1
    expect(firstWorkingSession.destroy).toHaveBeenCalled();
    expect(mockRootSession.clone).toHaveBeenCalledTimes(2);
    expect(explainer.isReady()).toBe(true);
  });

  it('should clear both sessions on destroy', async () => {
    await explainer.initialize();
    expect(explainer.isReady()).toBe(true);

    await explainer.destroy();
    expect(explainer.isReady()).toBe(false);
    expect(mockWorkingSession.destroy).toHaveBeenCalled();
    expect(mockRootSession.destroy).toHaveBeenCalled();
  });

  it('should fail to explain if not initialized', async () => {
    await expect(explainer.explainGrammar('test')).rejects.toThrow('Language Model session not initialized');
  });

  it('should call prompt on the working session', async () => {
    await explainer.initialize();
    const result = await explainer.explainGrammar('毎日お茶を飲みます。');
    
    expect(result).toBe('Grammar explanation');
    expect(mockWorkingSession.prompt).toHaveBeenCalledWith(expect.stringContaining('毎日お茶を飲みます。'));
  });
});
