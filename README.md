# zen-browser-utilities

Zen Browser mod that adds assignable keyboard shortcuts for native tab-context actions and a small set of extra tab utilities.

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

All shortcuts are configured through `preferences.json`, so they can be assigned inside Sine instead of being hard-coded.

## Native Zen hook used

This mod does **not** create a custom right-click menu.

It plugs into Zen Browser's existing tab context menu hook:

- Zen Browser augments the native tab menu in [`src/zen/tabs/ZenPinnedTabManager.mjs`](https://github.com/zen-browser/desktop/blob/main/src/zen/tabs/ZenPinnedTabManager.mjs), where `_insertItemsIntoTabContextMenu()` appends custom items directly to `#tabContextMenu`.
- Zen wires those native tab-menu updates from [`src/browser/components/tabbrowser/content/tabbrowser-js.patch`](https://github.com/zen-browser/desktop/blob/main/src/browser/components/tabbrowser/content/tabbrowser-js.patch), where `TabContextMenu` calls `gZenPinnedTabManager.updatePinnedTabContextMenu(this.contextTab)`.
- Zen folder actions are also added into existing menus from [`src/zen/folders/ZenFolders.mjs`](https://github.com/zen-browser/desktop/blob/main/src/zen/folders/ZenFolders.mjs), which inserts `zen-context-menu-new-folder` into the stock tab menu flow.

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

## Development

Install dependencies:

```bash
npm install
```

Run validations:

```bash
npm run lint
npm test
npm run build
```

The bundled script is written to:

```text
zen-browser-utilities.uc.js
```

## Notes

- Shortcut preferences default to blank strings so the mod does not claim any keyboard combinations until the user explicitly assigns them.
- Folder and workspace destination actions are available in the native tab context menu, and the keyboard-triggered versions use a picker prompt so they remain assignable without inventing a separate context UI.
