import { describe, expect, test } from 'vitest';

import {
  extractUrlsFromCsvText,
  looksLikeUrl,
  parseLineSeparatedUrls,
} from '../src/url-utils.js';

describe('url-utils', () => {
  test('parses newline-delimited URLs', () => {
    expect(
      parseLineSeparatedUrls('https://one.test\nhttps://two.test\nhttps://one.test')
    ).toEqual(['https://one.test', 'https://two.test']);
  });

  test('extracts URL-looking cells from CSV text', () => {
    expect(
      extractUrlsFromCsvText(
        'title,url\n"One","https://one.test"\n"Two","two.test/path"'
      )
    ).toEqual(['https://one.test', 'two.test/path']);
  });

  test('recognizes browser and web URLs', () => {
    expect(looksLikeUrl('about:preferences')).toBe(true);
    expect(looksLikeUrl('zen-browser')).toBe(false);
  });
});
