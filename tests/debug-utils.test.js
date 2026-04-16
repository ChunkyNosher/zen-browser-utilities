import { describe, expect, test } from 'vitest';

import {
  createDebugSnapshot,
  limitDebugEntries,
  openFilePicker,
} from '../src/debug-utils.js';

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

  test('opens a file picker using the done() callback shape', async () => {
    const picker = {
      open(callbacks) {
        callbacks.done(7);
      },
    };

    await expect(openFilePicker(picker)).resolves.toBe(7);
  });

  test('falls back to a direct callback when open() rejects the done() shape', async () => {
    const picker = {
      open(callback) {
        if (typeof callback === 'function') {
          callback(5);
          return;
        }

        throw new TypeError('Expected a callback function.');
      },
    };

    await expect(openFilePicker(picker)).resolves.toBe(5);
  });

  test('falls back to show() when open() is unavailable', async () => {
    const picker = {
      show() {
        return 3;
      },
    };

    await expect(openFilePicker(picker)).resolves.toBe(3);
  });
});
