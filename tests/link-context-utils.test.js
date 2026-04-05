import { describe, expect, test } from 'vitest';

import {
  getLinkContextVisibilityState,
  getLinkUrlFromContextMenu,
  isEligibleLinkContext,
} from '../src/link-context-utils.js';

describe('link-context-utils', () => {
  test('extracts the best available link url from the native context menu object', () => {
    expect(
      getLinkUrlFromContextMenu({
        linkURI: { spec: 'https://example.com/path?query=1' },
      })
    ).toBe('https://example.com/path?query=1');
  });

  test('rejects non-link, mailto, and tel contexts', () => {
    expect(isEligibleLinkContext({ onLink: false, linkURL: 'https://example.com' })).toBe(false);
    expect(
      isEligibleLinkContext({
        onLink: true,
        onMailtoLink: true,
        linkURL: 'mailto:test@example.com',
      })
    ).toBe(false);
    expect(
      isEligibleLinkContext({
        onLink: true,
        onTelLink: true,
        linkURL: 'tel:+1234567890',
      })
    ).toBe(false);
  });

  test('accepts regular webpage link contexts', () => {
    expect(
      isEligibleLinkContext({
        onLink: true,
        onMailtoLink: false,
        onTelLink: false,
        linkURL: 'https://example.com',
      })
    ).toBe(true);
  });

  test('computes native menu visibility state from pinned and destination availability', () => {
    expect(
      getLinkContextVisibilityState({
        isEligible: true,
        currentTabPinned: true,
        folderCount: 2,
        workspaceCount: 1,
      })
    ).toEqual({
      openBelowPinned: true,
      openToFolder: true,
      openToWorkspace: true,
      separator: true,
    });

    expect(
      getLinkContextVisibilityState({
        isEligible: false,
        currentTabPinned: true,
        folderCount: 2,
        workspaceCount: 1,
      })
    ).toEqual({
      openBelowPinned: false,
      openToFolder: false,
      openToWorkspace: false,
      separator: false,
    });
  });
});
