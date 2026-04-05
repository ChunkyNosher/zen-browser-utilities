import { describe, expect, test } from 'vitest';

import { createDebugSnapshot, limitDebugEntries } from '../src/debug-utils.js';

describe('debug-utils', () => {
  test('keeps only the most recent debug entries', () => {
    expect(limitDebugEntries([1, 2, 3, 4], 2)).toEqual([3, 4]);
  });

  test('creates a stable export snapshot payload', () => {
    expect(
      createDebugSnapshot({
        exportedAt: '2026-04-05T00:00:00.000Z',
        pageUrl: 'about:preferences',
        entries: [{ message: 'hello' }],
        actions: [{ id: 'moveToStart', shortcut: 'Ctrl+Home' }],
        preferences: { debugEnabled: true },
      })
    ).toEqual({
      exportedAt: '2026-04-05T00:00:00.000Z',
      pageUrl: 'about:preferences',
      entryCount: 1,
      entries: [{ message: 'hello' }],
      actions: [{ id: 'moveToStart', shortcut: 'Ctrl+Home' }],
      preferences: { debugEnabled: true },
    });
  });
});
