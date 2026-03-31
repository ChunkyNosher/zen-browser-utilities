/**
 * Zen Browser Utilities Mod
 * Version: 0.1.0
 * License: MIT
 *
 * Bundled with Rollup from the src/ directory.
 */
(function () {
  'use strict';

  function getOrderedSelectionIds(items, selectedIds) {
    const selected = new Set(selectedIds);
    return items.filter(item => selected.has(item));
  }

  function getItemsBeforeSelection(items, selectedIds) {
    const orderedSelection = getOrderedSelectionIds(items, selectedIds);

    if (!orderedSelection.length) {
      return [];
    }

    const firstSelectedIndex = items.indexOf(orderedSelection[0]);
    return items.slice(0, firstSelectedIndex);
  }

  function getItemsAfterSelection(items, selectedIds) {
    const orderedSelection = getOrderedSelectionIds(items, selectedIds);

    if (!orderedSelection.length) {
      return [];
    }

    const lastSelectedIndex = items.indexOf(
      orderedSelection[orderedSelection.length - 1]
    );

    return items.slice(lastSelectedIndex + 1);
  }

  function buildFolderChoices(folders, currentFolderId = null) {
    return folders
      .filter(folder => folder.id !== currentFolderId)
      .map(folder => ({
        id: folder.id,
        label: folder.label,
      }));
  }

  function buildWorkspaceChoices(workspaces, currentWorkspaceId = null) {
    return workspaces
      .filter(workspace => workspace.id !== currentWorkspaceId)
      .map(workspace => ({
        id: workspace.id,
        label: workspace.label,
      }));
  }

  const ACTIONS = [
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
  ];

  const ACTIONS_BY_ID = new Map(ACTIONS.map(action => [action.id, action]));

  const MODIFIER_ORDER = ['Control', 'Meta', 'Alt', 'Shift'];

  const MODIFIER_ALIASES = new Map([
    ['ctrl', 'Control'],
    ['control', 'Control'],
    ['cmd', 'Meta'],
    ['command', 'Meta'],
    ['meta', 'Meta'],
    ['alt', 'Alt'],
    ['option', 'Alt'],
    ['shift', 'Shift'],
  ]);

  const KEY_ALIASES = new Map([
    [' ', 'Space'],
    ['spacebar', 'Space'],
    ['space', 'Space'],
    ['esc', 'Escape'],
    ['return', 'Enter'],
    ['del', 'Delete'],
    ['left', 'ArrowLeft'],
    ['right', 'ArrowRight'],
    ['up', 'ArrowUp'],
    ['down', 'ArrowDown'],
    ['plus', '+'],
  ]);

  const MODIFIER_KEYS = new Set(['Control', 'Meta', 'Alt', 'Shift']);

  function normalizeToken(token) {
    const trimmed = token.trim();

    if (!trimmed) {
      return '';
    }

    const lowered = trimmed.toLowerCase();

    if (MODIFIER_ALIASES.has(lowered)) {
      return MODIFIER_ALIASES.get(lowered);
    }

    if (KEY_ALIASES.has(lowered)) {
      return KEY_ALIASES.get(lowered);
    }

    if (trimmed.length === 1) {
      return trimmed.toUpperCase();
    }

    return `${trimmed.slice(0, 1).toUpperCase()}${trimmed.slice(1)}`;
  }

  function normalizeShortcut(shortcut) {
    if (!shortcut || typeof shortcut !== 'string') {
      return '';
    }

    const parts = shortcut
      .split('+')
      .map(normalizeToken)
      .filter(Boolean);

    const modifiers = MODIFIER_ORDER.filter(modifier => parts.includes(modifier));
    const keys = parts.filter(part => !MODIFIER_KEYS.has(part));

    if (keys.length > 1) {
      return '';
    }

    return [...modifiers, ...keys].join('+');
  }

  function eventToShortcut(event) {
    const parts = [];

    if (event.ctrlKey) {
      parts.push('Control');
    }

    if (event.metaKey) {
      parts.push('Meta');
    }

    if (event.altKey) {
      parts.push('Alt');
    }

    if (event.shiftKey) {
      parts.push('Shift');
    }

    const key = normalizeToken(event.key);

    if (!key || MODIFIER_KEYS.has(key)) {
      return '';
    }

    parts.push(key);

    return normalizeShortcut(parts.join('+'));
  }

  function shortcutMatchesEvent(shortcut, event) {
    const normalizedShortcut = normalizeShortcut(shortcut);

    if (!normalizedShortcut) {
      return false;
    }

    return normalizedShortcut === eventToShortcut(event);
  }

  /* global Services, SessionStore, TabContextMenu, gBrowser, gZenFolders, gZenWorkspaces, MozXULElement, ContextualIdentityService */


  (() => {
    const MENU_IDS = {
      separator: 'zen-browser-utilities-context-separator',
      moveToStart: 'zen-browser-utilities-move-to-start',
      moveToEnd: 'zen-browser-utilities-move-to-end',
      createNewFolder: 'zen-browser-utilities-create-new-folder',
      closeTabsAbove: 'zen-browser-utilities-close-tabs-above',
      closeTabsBelow: 'zen-browser-utilities-close-tabs-below',
      moveToFolder: 'zen-browser-utilities-move-to-folder',
      moveToFolderPopup: 'zen-browser-utilities-move-to-folder-popup',
      moveOutOfFolder: 'zen-browser-utilities-move-out-of-folder',
      duplicatePinnedBelow: 'zen-browser-utilities-duplicate-pinned-below',
      moveToWorkspace: 'zen-browser-utilities-move-to-workspace',
      moveToWorkspacePopup: 'zen-browser-utilities-move-to-workspace-popup',
    };

    const PROMPT_TITLES = {
      folder: 'Move tab to folder',
      workspace: 'Move tab to space',
    };

    function logError(error) {
      console.error('Zen Browser Utilities:', error);
    }

    function getPref(prefKey) {
      try {
        return Services.prefs.getStringPref(prefKey, '').trim();
      } catch (error) {
        logError(error);
        return '';
      }
    }

    function getContextTab() {
      return TabContextMenu?.contextTab || gBrowser?.selectedTab || null;
    }

    function getContextTabs() {
      const contextTab = getContextTab();

      if (!contextTab) {
        return [];
      }

      if (contextTab.multiselected) {
        return gBrowser.selectedTabs.filter(tab => tab.parentElement === contextTab.parentElement);
      }

      return [contextTab];
    }

    function isTabNode(node) {
      return (
        node?.tagName?.toLowerCase?.() === 'tab' &&
        !node.hasAttribute('zen-empty-tab')
      );
    }

    function getSiblingTabs(tab) {
      const parent = tab?.parentElement;

      if (!parent) {
        return [];
      }

      return Array.from(parent.children).filter(isTabNode);
    }

    function getCurrentSelectionIds() {
      return getContextTabs().map(tab => tab.getAttribute('id'));
    }

    function moveNode(node, parent, beforeNode = null) {
      const callback = () => {
        parent.insertBefore(node, beforeNode);
        gBrowser?.tabContainer?._invalidateCachedTabs?.();
      };

      if (typeof gBrowser?.zenHandleTabMove === 'function') {
        gBrowser.zenHandleTabMove(node, callback);
        return;
      }

      callback();
    }

    function moveTabsToBoundary(direction) {
      const tabs = getContextTabs();

      if (!tabs.length) {
        return false;
      }

      const parent = tabs[0].parentElement;
      const orderedTabs = getSiblingTabs(tabs[0]);
      const orderedSelection = getOrderedSelectionIds(orderedTabs, tabs.map(tab => tab.getAttribute('id')));
      const selectedTabs = new Set(orderedSelection);
      const remainingTabs = orderedTabs.filter(tab => !selectedTabs.has(tab));

      if (!remainingTabs.length) {
        return false;
      }

      const referenceNode =
        direction === 'start'
          ? remainingTabs[0]
          : remainingTabs[remainingTabs.length - 1].nextSibling;

      for (const tab of orderedSelection) {
        moveNode(tab, parent, referenceNode);
      }

      return true;
    }

    function closeRelativeTabs(direction) {
      const contextTab = getContextTab();

      if (!contextTab) {
        return false;
      }

      const orderedTabs = getSiblingTabs(contextTab);
      const selectedIds = getCurrentSelectionIds();
      const tabsToClose =
        direction === 'above'
          ? getItemsBeforeSelection(
              orderedTabs,
              selectedIds.length ? selectedIds : [contextTab.getAttribute('id')]
            )
          : getItemsAfterSelection(
              orderedTabs,
              selectedIds.length ? selectedIds : [contextTab.getAttribute('id')]
            );

      if (!tabsToClose.length) {
        return false;
      }

      if (typeof gBrowser.removeTabs === 'function') {
        gBrowser.removeTabs(tabsToClose, { animate: true });
        return true;
      }

      for (const tab of tabsToClose) {
        gBrowser.removeTab(tab, { animate: true });
      }

      return true;
    }

    function createNewFolderFromSelection() {
      if (typeof gZenFolders?.createFolder !== 'function') {
        return false;
      }

      const tabs = getContextTabs();
      const triggerTab = tabs[0];

      if (!triggerTab) {
        return false;
      }

      const canInsertBefore =
        !triggerTab.hasAttribute('zen-essential') &&
        !triggerTab?.group?.hasAttribute?.('split-view-group') &&
        gZenFolders?.canDropElement?.({ isZenFolder: true }, triggerTab);

      gZenFolders.createFolder(tabs, {
        insertAfter: !canInsertBefore ? triggerTab?.group || triggerTab : null,
        insertBefore: canInsertBefore ? triggerTab : null,
        renameFolder: true,
      });

      return true;
    }

    function getCurrentFolder(tab = getContextTab()) {
      return tab?.group?.isZenFolder ? tab.group : null;
    }

    function getWorkspaceIdForNode(node) {
      return (
        node?.getAttribute?.('zen-workspace-id') ||
        document.documentElement.getAttribute('zen-workspace-id') ||
        gZenWorkspaces?.activeWorkspace ||
        ''
      );
    }

    function getFolderLabel(folder) {
      return folder?.label || folder?.getAttribute?.('label') || folder?.id || 'Folder';
    }

    function getAvailableFolders(tab = getContextTab()) {
      const currentFolder = getCurrentFolder(tab);
      const workspaceId = getWorkspaceIdForNode(tab);

      return buildFolderChoices(
        Array.from(document.querySelectorAll('zen-folder'))
          .filter(folder => getWorkspaceIdForNode(folder) === workspaceId)
          .map(folder => ({
            id: folder.id,
            label: getFolderLabel(folder),
            folder,
          })),
        currentFolder?.id || null
      ).map(choice => ({
        ...choice,
        folder: document.getElementById(choice.id),
      }));
    }

    function moveTabsToFolder(folder) {
      const tabs = getContextTabs();

      if (!folder || !tabs.length) {
        return false;
      }

      gZenFolders?.ungroupTabsFromActiveGroups?.(tabs);

      for (const tab of tabs) {
        if (folder.pinned && !tab.pinned) {
          gBrowser.pinTab(tab);
        } else if (!folder.pinned && tab.pinned) {
          gBrowser.unpinTab(tab);
        }
      }

      folder.addTabs(tabs);
      gBrowser?.tabContainer?._invalidateCachedTabs?.();
      return true;
    }

    function moveTabsOutOfFolder() {
      const tabs = getContextTabs();

      if (!tabs.length || !getCurrentFolder(tabs[0])) {
        return false;
      }

      gZenFolders?.ungroupTabsFromActiveGroups?.(tabs);
      gBrowser?.tabContainer?._invalidateCachedTabs?.();
      return true;
    }

    function promptToChoose(title, text, labels) {
      if (!labels.length) {
        return -1;
      }

      const selection = { value: 0 };
      const accepted = Services.prompt.select(
        window,
        title,
        text,
        labels.length,
        labels,
        selection
      );

      return accepted ? selection.value : -1;
    }

    function promptMoveTabsToFolder() {
      const folders = getAvailableFolders();
      const index = promptToChoose(
        PROMPT_TITLES.folder,
        'Choose the destination folder for the current tab selection.',
        folders.map(folder => folder.label)
      );

      if (index < 0) {
        return false;
      }

      return moveTabsToFolder(folders[index].folder);
    }

    function getWorkspaceLabel(workspace) {
      let label = workspace.name || workspace.uuid || 'Workspace';

      if (
        typeof workspace.containerTabId === 'number' &&
        typeof ContextualIdentityService?.getUserContextLabel === 'function'
      ) {
        const containerLabel =
          ContextualIdentityService.getUserContextLabel(workspace.containerTabId) || '';

        if (containerLabel) {
          label = `${label} (${containerLabel})`;
        }
      }

      return label;
    }

    function getAvailableWorkspaces() {
      const currentWorkspaceId =
        document.documentElement.getAttribute('zen-workspace-id') ||
        gZenWorkspaces?.activeWorkspace ||
        null;

      return buildWorkspaceChoices(
        (gZenWorkspaces?.getWorkspaces?.() || []).map(workspace => ({
          id: workspace.uuid,
          label: getWorkspaceLabel(workspace),
          workspace,
        })),
        currentWorkspaceId
      ).map(choice => ({
        ...choice,
        workspace: (gZenWorkspaces?.getWorkspaces?.() || []).find(
          workspace => workspace.uuid === choice.id
        ),
      }));
    }

    function cloneTabIntoWorkspace(tab, workspace) {
      const state =
        typeof SessionStore?.getTabState === 'function'
          ? JSON.parse(SessionStore.getTabState(tab))
          : null;
      const userContextId =
        typeof workspace?.containerTabId === 'number' ? workspace.containerTabId : 0;

      const newTab = gBrowser.addTrustedTab('about:blank', {
        inBackground: !tab.selected,
        userContextId,
        triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal(),
      });

      if (state) {
        state.userContextId = userContextId;
        SessionStore.setTabState(newTab, state);
      } else {
        const currentUri = tab?.linkedBrowser?.currentURI?.spec || 'about:blank';
        gBrowser.loadOneTab(currentUri, {
          inBackground: !tab.selected,
          userContextId,
          triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal(),
        });
        gBrowser.removeTab(newTab);
        return null;
      }

      if (tab.pinned) {
        gBrowser.pinTab(newTab);
      }

      if (tab.hasAttribute('zen-workspace-id')) {
        newTab.setAttribute('zen-workspace-id', workspace.uuid);
      }

      gZenWorkspaces?.moveTabToWorkspace?.(newTab, workspace.uuid);
      return newTab;
    }

    async function moveTabsToWorkspaceWithContainer(workspaceId) {
      const destination = (gZenWorkspaces?.getWorkspaces?.() || []).find(
        workspace => workspace.uuid === workspaceId
      );

      if (!destination) {
        return false;
      }

      const sourceTabs = getContextTabs();

      if (!sourceTabs.length) {
        return false;
      }

      let lastCreatedTab = null;

      for (const tab of sourceTabs) {
        const newTab = cloneTabIntoWorkspace(tab, destination);

        if (newTab) {
          lastCreatedTab = newTab;
        }

        gBrowser.removeTab(tab, { animate: true });
      }

      if (lastCreatedTab) {
        await gZenWorkspaces?.changeWorkspaceWithID?.(destination.uuid);
        gBrowser.selectedTab = lastCreatedTab;
      }

      return Boolean(lastCreatedTab);
    }

    async function promptMoveTabsToWorkspace() {
      const workspaces = getAvailableWorkspaces();
      const index = promptToChoose(
        PROMPT_TITLES.workspace,
        'Choose the Zen space that should re-open the current tab selection in its assigned container.',
        workspaces.map(workspace => workspace.label)
      );

      if (index < 0) {
        return false;
      }

      return moveTabsToWorkspaceWithContainer(workspaces[index].id);
    }

    function duplicatePinnedTabBelow() {
      const originalTab = getContextTab();

      if (!originalTab?.pinned) {
        return false;
      }

      const duplicatedTab = gBrowser.duplicateTab(originalTab, true);
      let finalized = false;

      const finalizeDuplicate = () => {
        if (finalized || !duplicatedTab?.isConnected) {
          return;
        }

        finalized = true;

        if (!duplicatedTab.pinned) {
          gBrowser.pinTab(duplicatedTab);
        }

        const parent = originalTab.parentElement;
        const beforeNode = originalTab.nextElementSibling;
        moveNode(duplicatedTab, parent, beforeNode);

        const workspaceId = getWorkspaceIdForNode(originalTab);
        if (workspaceId) {
          duplicatedTab.setAttribute('zen-workspace-id', workspaceId);
        }
      };

      duplicatedTab.addEventListener('SSTabRestored', finalizeDuplicate, {
        once: true,
      });

      setTimeout(finalizeDuplicate, 500);
      return true;
    }

    const ACTION_HANDLERS = {
      moveToStart: () => moveTabsToBoundary('start'),
      moveToEnd: () => moveTabsToBoundary('end'),
      createNewFolder: () => createNewFolderFromSelection(),
      closeTabsAbove: () => closeRelativeTabs('above'),
      closeTabsBelow: () => closeRelativeTabs('below'),
      moveToFolderPrompt: () => promptMoveTabsToFolder(),
      moveOutOfFolder: () => moveTabsOutOfFolder(),
      duplicatePinnedBelow: () => duplicatePinnedTabBelow(),
      moveToWorkspacePrompt: () => promptMoveTabsToWorkspace(),
    };

    function executeAction(actionId) {
      const action = ACTIONS_BY_ID.get(actionId);
      const handler = ACTION_HANDLERS[actionId];

      if (!action || typeof handler !== 'function') {
        return false;
      }

      try {
        return handler();
      } catch (error) {
        logError(error);
        return false;
      }
    }

    function shouldIgnoreKeyboardEvent(event) {
      if (event.defaultPrevented) {
        return true;
      }

      const target = event.target;
      const tagName = target?.tagName?.toLowerCase?.();

      return Boolean(
        target?.isContentEditable ||
          tagName === 'input' ||
          tagName === 'textarea' ||
          tagName === 'select'
      );
    }

    function onKeyDown(event) {
      if (shouldIgnoreKeyboardEvent(event)) {
        return;
      }

      for (const action of ACTIONS_BY_ID.values()) {
        const shortcut = getPref(action.prefKey);

        if (!shortcutMatchesEvent(shortcut, event)) {
          continue;
        }

        event.preventDefault();
        event.stopPropagation();
        void executeAction(action.id);
        return;
      }
    }

    function clearPopupChildren(popupId) {
      const popup = document.getElementById(popupId);

      while (popup?.firstChild) {
        popup.firstChild.remove();
      }
    }

    function buildFolderMenu() {
      const folderMenu = document.getElementById(MENU_IDS.moveToFolder);
      const folders = getAvailableFolders();

      clearPopupChildren(MENU_IDS.moveToFolderPopup);
      folderMenu.hidden = !folders.length;

      const popup = document.getElementById(MENU_IDS.moveToFolderPopup);

      for (const folder of folders) {
        const item = document.createXULElement('menuitem');
        item.setAttribute('label', folder.label);
        item.dataset.folderId = folder.id;
        item.addEventListener('command', () => {
          void moveTabsToFolder(folder.folder);
        });
        popup.appendChild(item);
      }
    }

    function buildWorkspaceMenu() {
      const workspaceMenu = document.getElementById(MENU_IDS.moveToWorkspace);
      const workspaces = getAvailableWorkspaces();

      clearPopupChildren(MENU_IDS.moveToWorkspacePopup);
      workspaceMenu.hidden = workspaces.length < 1;

      const popup = document.getElementById(MENU_IDS.moveToWorkspacePopup);

      for (const workspace of workspaces) {
        const item = document.createXULElement('menuitem');
        item.setAttribute('label', workspace.label);
        item.dataset.workspaceId = workspace.id;
        item.addEventListener('command', () => {
          void moveTabsToWorkspaceWithContainer(workspace.id);
        });
        popup.appendChild(item);
      }
    }

    function updateMenuVisibility() {
      const contextTab = getContextTab();

      if (!contextTab) {
        return;
      }

      const orderedTabs = getSiblingTabs(contextTab);
      const selectedIds = getCurrentSelectionIds();
      const aboveTabs = getItemsBeforeSelection(
        orderedTabs,
        selectedIds.length ? selectedIds : [contextTab.getAttribute('id')]
      );
      const belowTabs = getItemsAfterSelection(
        orderedTabs,
        selectedIds.length ? selectedIds : [contextTab.getAttribute('id')]
      );

      document.getElementById(MENU_IDS.closeTabsAbove).hidden = !aboveTabs.length;
      document.getElementById(MENU_IDS.closeTabsBelow).hidden = !belowTabs.length;
      document.getElementById(MENU_IDS.moveOutOfFolder).hidden = !getCurrentFolder(contextTab);
      document.getElementById(MENU_IDS.duplicatePinnedBelow).hidden = !contextTab.pinned;

      buildFolderMenu();
      buildWorkspaceMenu();
    }

    function installContextMenu() {
      const tabContextMenu = document.getElementById('tabContextMenu');

      if (!tabContextMenu) {
        setTimeout(installContextMenu, 500);
        return;
      }

      if (document.getElementById(MENU_IDS.separator)) {
        return;
      }

      const fragment = MozXULElement.parseXULToFragment(`
      <menuseparator id="${MENU_IDS.separator}" />
      <menuitem id="${MENU_IDS.moveToStart}" label="Move to Start" />
      <menuitem id="${MENU_IDS.moveToEnd}" label="Move to End" />
      <menuitem id="${MENU_IDS.createNewFolder}" label="Create New Folder" />
      <menuitem id="${MENU_IDS.closeTabsAbove}" label="Close Tabs Above" />
      <menuitem id="${MENU_IDS.closeTabsBelow}" label="Close Tabs Below" />
      <menu id="${MENU_IDS.moveToFolder}" label="Move to Folder">
        <menupopup id="${MENU_IDS.moveToFolderPopup}" />
      </menu>
      <menuitem id="${MENU_IDS.moveOutOfFolder}" label="Move Out of Folder" />
      <menuitem id="${MENU_IDS.duplicatePinnedBelow}" label="Duplicate Pinned Tab Below" />
      <menu id="${MENU_IDS.moveToWorkspace}" label="Move to Space Container">
        <menupopup id="${MENU_IDS.moveToWorkspacePopup}" />
      </menu>
    `);

      const anchor =
        document.getElementById('context_moveTabToGroup') ||
        document.getElementById('context_duplicateTab') ||
        document.getElementById('context_closeTab');

      if (anchor) {
        anchor.before(fragment);
      } else {
        tabContextMenu.appendChild(fragment);
      }

      document
        .getElementById(MENU_IDS.moveToStart)
        .addEventListener('command', () => executeAction('moveToStart'));
      document
        .getElementById(MENU_IDS.moveToEnd)
        .addEventListener('command', () => executeAction('moveToEnd'));
      document
        .getElementById(MENU_IDS.createNewFolder)
        .addEventListener('command', () => executeAction('createNewFolder'));
      document
        .getElementById(MENU_IDS.closeTabsAbove)
        .addEventListener('command', () => executeAction('closeTabsAbove'));
      document
        .getElementById(MENU_IDS.closeTabsBelow)
        .addEventListener('command', () => executeAction('closeTabsBelow'));
      document
        .getElementById(MENU_IDS.moveOutOfFolder)
        .addEventListener('command', () => executeAction('moveOutOfFolder'));
      document
        .getElementById(MENU_IDS.duplicatePinnedBelow)
        .addEventListener('command', () => executeAction('duplicatePinnedBelow'));
      tabContextMenu.addEventListener('popupshowing', event => {
        if (event.target?.id !== 'tabContextMenu') {
          return;
        }

        updateMenuVisibility();
      });
    }

    function init() {
      window.addEventListener('keydown', onKeyDown, true);
      installContextMenu();
    }

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
      init();
    }
  })();

})();
