import { describe, it, expect } from 'vitest';
import { removeMarkdownLinks } from './utils';

describe('removeMarkdownLinks', () => {
  it('should remove simple markdown links', () => {
    const input = 'Check out [Google](https://google.com) for more.';
    const expected = 'Check out  for more.';
    expect(removeMarkdownLinks(input)).toBe(expected);
  });

  it('should remove multiple links', () => {
    const input = '[One](url1) and [Two](url2)';
    const expected = ' and ';
    expect(removeMarkdownLinks(input)).toBe(expected);
  });

  it('should return empty string if input is empty', () => {
    expect(removeMarkdownLinks('')).toBe('');
  });

  it('should handle text with no links', () => {
    const input = 'Just some plain text.';
    expect(removeMarkdownLinks(input)).toBe(input);
  });

  it('should handle malformed links (missing part)', () => {
    const input = '[Text] and (url) and [Text](url';
    expect(removeMarkdownLinks(input)).toBe(input);
  });
});
