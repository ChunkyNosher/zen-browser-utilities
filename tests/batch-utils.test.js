import { describe, expect, test } from 'vitest';

import { chunkItems, parsePositiveInteger } from '../src/batch-utils.js';

describe('batch-utils', () => {
  test('parses bounded positive integers', () => {
    expect(parsePositiveInteger('27', 20, { min: 10, max: 30 })).toBe(27);
    expect(parsePositiveInteger('999', 20, { min: 10, max: 30 })).toBe(30);
    expect(parsePositiveInteger('nope', 20, { min: 10, max: 30 })).toBe(20);
  });

  test('chunks arrays into evenly sized groups', () => {
    expect(chunkItems([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });
});
