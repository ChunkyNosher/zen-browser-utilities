import { describe, expect, test } from 'vitest';

import {
  eventToShortcut,
  normalizeShortcut,
  parseShortcutBinding,
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

  test('supports the plus key without delimiter ambiguity', () => {
    expect(normalizeShortcut('ctrl+plus')).toBe('Control+Plus');
    expect(
      eventToShortcut({
        ctrlKey: true,
        metaKey: false,
        altKey: false,
        shiftKey: false,
        key: '+',
      })
    ).toBe('Control+Plus');
  });

  test('parses legacy shortcut strings into Zen-compatible bindings', () => {
    expect(parseShortcutBinding('alt+shift+home')).toEqual({
      key: '',
      keycode: 'VK_HOME',
      modifiers: {
        control: false,
        alt: true,
        shift: true,
        meta: false,
        accel: false,
      },
    });
  });

  test('maps control to accel outside macOS when parsing bindings', () => {
    expect(parseShortcutBinding('ctrl+shift+d')).toEqual({
      key: 'D',
      keycode: '',
      modifiers: {
        control: false,
        alt: false,
        shift: true,
        meta: false,
        accel: true,
      },
    });
  });

  test('preserves control on macOS when parsing bindings', () => {
    expect(parseShortcutBinding('ctrl+shift+d', { isMac: true })).toEqual({
      key: 'D',
      keycode: '',
      modifiers: {
        control: true,
        alt: false,
        shift: true,
        meta: false,
        accel: false,
      },
    });
  });
});
