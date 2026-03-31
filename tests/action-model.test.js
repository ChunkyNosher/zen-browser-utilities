import { describe, expect, test } from 'vitest';

import {
  buildFolderChoices,
  buildWorkspaceChoices,
  getItemsAfterSelection,
  getItemsBeforeSelection,
  getOrderedSelectionIds,
} from '../src/action-model.js';

describe('action-model', () => {
  test('returns the ordered selected ids from the source list', () => {
    expect(
      getOrderedSelectionIds(['a', 'b', 'c', 'd'], ['d', 'b'])
    ).toEqual(['b', 'd']);
  });

  test('returns items before the selected block', () => {
    expect(getItemsBeforeSelection(['a', 'b', 'c', 'd'], ['b', 'c'])).toEqual([
      'a',
    ]);
  });

  test('returns items after the selected block', () => {
    expect(getItemsAfterSelection(['a', 'b', 'c', 'd'], ['b', 'c'])).toEqual([
      'd',
    ]);
  });

  test('builds folder choices without the current folder', () => {
    expect(
      buildFolderChoices(
        [
          { id: 'one', label: 'One' },
          { id: 'two', label: 'Two' },
        ],
        'one'
      )
    ).toEqual([{ id: 'two', label: 'Two' }]);
  });

  test('builds workspace choices without the current workspace', () => {
    expect(
      buildWorkspaceChoices(
        [
          { id: 'a', label: 'Space A' },
          { id: 'b', label: 'Space B' },
        ],
        'b'
      )
    ).toEqual([{ id: 'a', label: 'Space A' }]);
  });
});
