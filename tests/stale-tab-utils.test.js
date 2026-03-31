import { describe, expect, test } from 'vitest';

import { getStaleTabs, shouldAutoCloseTab } from '../src/stale-tab-utils.js';

function createMockTab(overrides = {}) {
  const attributes = new Set(overrides.attributes || []);

  return {
    closing: false,
    hidden: false,
    lastAccessed: 1_000,
    multiselected: false,
    pinned: false,
    selected: false,
    soundPlaying: false,
    hasAttribute(name) {
      return attributes.has(name);
    },
    ...overrides,
  };
}

describe('stale-tab-utils', () => {
  test('closes only old inactive unpinned tabs', () => {
    expect(
      shouldAutoCloseTab(createMockTab(), {
        now: 10_000,
        maxAgeMs: 5_000,
        ignoreAudible: true,
      })
    ).toBe(true);
  });

  test('ignores selected pinned or audible tabs', () => {
    expect(
      shouldAutoCloseTab(createMockTab({ selected: true }), {
        now: 10_000,
        maxAgeMs: 5_000,
      })
    ).toBe(false);
    expect(
      shouldAutoCloseTab(createMockTab({ pinned: true }), {
        now: 10_000,
        maxAgeMs: 5_000,
      })
    ).toBe(false);
    expect(
      shouldAutoCloseTab(createMockTab({ soundPlaying: true }), {
        now: 10_000,
        maxAgeMs: 5_000,
        ignoreAudible: true,
      })
    ).toBe(false);
  });

  test('filters a list of stale tabs', () => {
    const tabs = [
      createMockTab({ lastAccessed: 1_000 }),
      createMockTab({ lastAccessed: 9_500 }),
      createMockTab({ pinned: true, lastAccessed: 1_000 }),
    ];

    expect(
      getStaleTabs(tabs, {
        now: 10_000,
        maxAgeMs: 5_000,
        ignoreAudible: true,
      })
    ).toHaveLength(1);
  });

  test('treats silent unmuted tabs as not audible', () => {
    expect(
      shouldAutoCloseTab(
        createMockTab({
          linkedBrowser: {
            audioMuted: false,
          },
        }),
        {
          now: 10_000,
          maxAgeMs: 5_000,
          ignoreAudible: true,
        }
      )
    ).toBe(true);
  });
});
