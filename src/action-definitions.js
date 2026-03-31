export const ACTIONS = [
  {
    id: 'moveToStart',
    label: 'Move to Start',
    prefKey: 'zen-browser-utilities.shortcuts.moveToStart',
  },
  {
    id: 'moveToEnd',
    label: 'Move to End',
    prefKey: 'zen-browser-utilities.shortcuts.moveToEnd',
  },
  {
    id: 'createNewFolder',
    label: 'Create New Folder',
    prefKey: 'zen-browser-utilities.shortcuts.createNewFolder',
  },
  {
    id: 'closeTabsAbove',
    label: 'Close Tabs Above',
    prefKey: 'zen-browser-utilities.shortcuts.closeTabsAbove',
  },
  {
    id: 'closeTabsBelow',
    label: 'Close Tabs Below',
    prefKey: 'zen-browser-utilities.shortcuts.closeTabsBelow',
  },
  {
    id: 'moveToFolderPrompt',
    label: 'Move to Folder…',
    prefKey: 'zen-browser-utilities.shortcuts.moveToFolderPrompt',
  },
  {
    id: 'moveOutOfFolder',
    label: 'Move Out of Folder',
    prefKey: 'zen-browser-utilities.shortcuts.moveOutOfFolder',
  },
  {
    id: 'duplicatePinnedBelow',
    label: 'Duplicate Pinned Tab Below',
    prefKey: 'zen-browser-utilities.shortcuts.duplicatePinnedBelow',
  },
  {
    id: 'moveToWorkspacePrompt',
    label: 'Move to Space Container…',
    prefKey: 'zen-browser-utilities.shortcuts.moveToWorkspacePrompt',
  },
  {
    id: 'copySelectedTabUrls',
    label: 'Copy Selected Tab Links',
    prefKey: 'zen-browser-utilities.shortcuts.copySelectedTabUrls',
  },
  {
    id: 'pasteTabUrls',
    label: 'Paste Links as Tabs',
    prefKey: 'zen-browser-utilities.shortcuts.pasteTabUrls',
  },
  {
    id: 'pasteTabUrlsCsv',
    label: 'Paste CSV Links as Tabs',
    prefKey: 'zen-browser-utilities.shortcuts.pasteTabUrlsCsv',
  },
  {
    id: 'closeStaleTabs',
    label: 'Close Stale Tabs',
    prefKey: 'zen-browser-utilities.shortcuts.closeStaleTabs',
  },
  {
    id: 'replacePinnedUrlWithCurrent',
    label: 'Replace Pinned URL with Current',
    prefKey: 'zen-browser-utilities.shortcuts.replacePinnedUrlWithCurrent',
  },
];

export const ACTIONS_BY_ID = new Map(ACTIONS.map(action => [action.id, action]));
