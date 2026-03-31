import { describe, expect, test } from 'vitest';

import {
  eventToShortcut,
  normalizeShortcut,
  shortcutMatchesEvent,
} from '../src/shortcut-utils.js';

describe('shortcut-utils', () => {
  test('normalizes modifiers and key names', () => {
    expect(normalizeShortcut('shift + ctrl + home')).toBe('Control+Shift+Home');
  });

  test('normalizes letter keys to uppercase', () => {
    expect(normalizeShortcut('alt+k')).toBe('Alt+K');
  });

  test('converts keyboard events to shortcut strings', () => {
    expect(
      eventToShortcut({
        ctrlKey: true,
        metaKey: false,
        altKey: true,
        shiftKey: false,
        key: 'PageDown',
      })
    ).toBe('Control+Alt+PageDown');
  });

  test('matches equivalent shortcuts', () => {
    expect(
      shortcutMatchesEvent('ctrl+shift+end', {
        ctrlKey: true,
        metaKey: false,
        altKey: false,
        shiftKey: true,
        key: 'End',
      })
    ).toBe(true);
  });

  test('ignores modifier-only key presses', () => {
    expect(
      eventToShortcut({
        ctrlKey: true,
        metaKey: false,
        altKey: false,
        shiftKey: false,
        key: 'Control',
      })
    ).toBe('');
  });
});
