# zen-browser-utilities

Zen Browser mod that adds assignable keyboard shortcuts for native tab-context actions and a growing set of tab, folder, workspace, clipboard, and cleanup utilities.

## What this mod adds

This mod currently adds native-tab-menu integrations and optional keyboard shortcuts for:

- Move to Start
- Move to End
- Create New Folder
- Close tabs above
- Close tabs below
- Move the current tab selection into another folder
- Move the current tab selection out of the current folder
- Duplicate a pinned tab directly below the original pinned tab
- Re-open the current tab selection inside another Zen space using that space's assigned Firefox container
- Copy all selected tab links as newline-delimited URLs
- Paste newline-delimited links as tabs
- Paste CSV-formatted links as tabs
- Close stale unpinned tabs now

It also adds:

- consistent multi-selected-tab handling across the custom actions
- configurable batched bulk closing so large close operations happen in smaller chunks
- optional Arc-style stale-tab cleanup for long-unused unpinned tabs

All shortcuts are configured through `preferences.json`, so they can be assigned inside Sine instead of being hard-coded.

## Native Zen hook used

This mod does **not** create a custom right-click menu.

It plugs into Zen Browser's existing tab context menu hook:

- Zen Browser augments the native tab menu in [`src/zen/tabs/ZenPinnedTabManager.mjs`](https://github.com/zen-browser/desktop/blob/main/src/zen/tabs/ZenPinnedTabManager.mjs), where `_insertItemsIntoTabContextMenu()` appends custom items directly to `#tabContextMenu`.
- Zen wires those native tab-menu updates from [`src/browser/components/tabbrowser/content/tabbrowser-js.patch`](https://github.com/zen-browser/desktop/blob/main/src/browser/components/tabbrowser/content/tabbrowser-js.patch), where `TabContextMenu` calls `gZenPinnedTabManager.updatePinnedTabContextMenu(this.contextTab)`.
- Zen folder actions are also added into existing menus from [`src/zen/folders/ZenFolders.mjs`](https://github.com/zen-browser/desktop/blob/main/src/zen/folders/ZenFolders.mjs), which inserts `zen-context-menu-new-folder` into the stock tab menu flow.
- Zen tab lifecycle state exposes `lastAccessed` from the patched tab implementation in [`src/browser/components/tabbrowser/content/tab-js.patch`](https://github.com/zen-browser/desktop/blob/main/src/browser/components/tabbrowser/content/tab-js.patch), which this mod uses as the native inactivity signal for stale-tab cleanup.

This repo follows that same approach by appending new entries to `#tabContextMenu` and updating them on `popupshowing`.

## Reference repositories

This implementation was intentionally shaped around the same upstream references requested in the task:

- Zen Browser source: <https://github.com/zen-browser/desktop>
- Sine mod loader: <https://github.com/CosmoCreeper/Sine>
- Quick Tabs native menu example: <https://github.com/Darsh-A/Quick-Tabs>
- Packaging/layout reference for a Sine-compatible Zen mod: <https://github.com/ChunkyNosher/zen-browser-pomodoro-timer>

In particular, this repo mirrors the pomodoro mod's basic Sine-friendly structure:

- `theme.json`
- `preferences.json`
- bundled `*.uc.js` output
- `src/` sources
- `package.json` build/test/lint scripts

The development toolchain is now based on **Vite+** and its `vp` commands, following the guidance at:

- <https://viteplus.dev/>
- <https://viteplus.dev/guide/>

## Development

Install dependencies:

```bash
npm install
```

Run validations:

```bash
vp lint
vp test
vp build
```

The bundled script is written to:

```text
zen-browser-utilities.uc.js
```

## Notes

- Shortcut preferences default to blank strings so the mod does not claim any keyboard combinations until the user explicitly assigns them.
- Folder and workspace destination actions are available in the native tab context menu, and the keyboard-triggered versions use a picker prompt so they remain assignable without inventing a separate context UI.
- Bulk close operations use a configurable batch size and delay so closing hundreds of tabs does not try to remove them all at once.
- Automatic stale-tab cleanup only targets unpinned inactive tabs and skips selected, multiselected, essential, busy, pending, and optionally audible tabs.
