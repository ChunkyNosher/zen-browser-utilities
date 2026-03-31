/**
* Zen Browser Utilities Mod
* Version: 0.2.0
* License: MIT
*
* Built with Vite+ from the src/ directory.
*/
(function() {
	//#region src/action-model.js
	function getOrderedSelectionIds(items, selectedIds) {
		const selected = new Set(selectedIds);
		return items.filter((item) => selected.has(item));
	}
	function getItemsBeforeSelection(items, selectedIds) {
		const orderedSelection = getOrderedSelectionIds(items, selectedIds);
		if (!orderedSelection.length) return [];
		const firstSelectedIndex = items.indexOf(orderedSelection[0]);
		return items.slice(0, firstSelectedIndex);
	}
	function getItemsAfterSelection(items, selectedIds) {
		const orderedSelection = getOrderedSelectionIds(items, selectedIds);
		if (!orderedSelection.length) return [];
		const lastSelectedIndex = items.indexOf(orderedSelection[orderedSelection.length - 1]);
		return items.slice(lastSelectedIndex + 1);
	}
	function buildFolderChoices(folders, currentFolderId = null) {
		return folders.filter((folder) => folder.id !== currentFolderId).map((folder) => ({
			id: folder.id,
			label: folder.label
		}));
	}
	function buildWorkspaceChoices(workspaces, currentWorkspaceId = null) {
		return workspaces.filter((workspace) => workspace.id !== currentWorkspaceId).map((workspace) => ({
			id: workspace.id,
			label: workspace.label
		}));
	}
	var ACTIONS_BY_ID = new Map([
		{
			id: "moveToStart",
			label: "Move to Start",
			prefKey: "zen-browser-utilities.shortcuts.moveToStart"
		},
		{
			id: "moveToEnd",
			label: "Move to End",
			prefKey: "zen-browser-utilities.shortcuts.moveToEnd"
		},
		{
			id: "createNewFolder",
			label: "Create New Folder",
			prefKey: "zen-browser-utilities.shortcuts.createNewFolder"
		},
		{
			id: "closeTabsAbove",
			label: "Close Tabs Above",
			prefKey: "zen-browser-utilities.shortcuts.closeTabsAbove"
		},
		{
			id: "closeTabsBelow",
			label: "Close Tabs Below",
			prefKey: "zen-browser-utilities.shortcuts.closeTabsBelow"
		},
		{
			id: "moveToFolderPrompt",
			label: "Move to Folder…",
			prefKey: "zen-browser-utilities.shortcuts.moveToFolderPrompt"
		},
		{
			id: "moveOutOfFolder",
			label: "Move Out of Folder",
			prefKey: "zen-browser-utilities.shortcuts.moveOutOfFolder"
		},
		{
			id: "duplicatePinnedBelow",
			label: "Duplicate Pinned Tab Below",
			prefKey: "zen-browser-utilities.shortcuts.duplicatePinnedBelow"
		},
		{
			id: "moveToWorkspacePrompt",
			label: "Move to Space Container…",
			prefKey: "zen-browser-utilities.shortcuts.moveToWorkspacePrompt"
		},
		{
			id: "copySelectedTabUrls",
			label: "Copy Selected Tab Links",
			prefKey: "zen-browser-utilities.shortcuts.copySelectedTabUrls"
		},
		{
			id: "pasteTabUrls",
			label: "Paste Links as Tabs",
			prefKey: "zen-browser-utilities.shortcuts.pasteTabUrls"
		},
		{
			id: "pasteTabUrlsCsv",
			label: "Paste CSV Links as Tabs",
			prefKey: "zen-browser-utilities.shortcuts.pasteTabUrlsCsv"
		},
		{
			id: "closeStaleTabs",
			label: "Close Stale Tabs",
			prefKey: "zen-browser-utilities.shortcuts.closeStaleTabs"
		}
	].map((action) => [action.id, action]));
	//#endregion
	//#region src/batch-utils.js
	function parsePositiveInteger(value, fallback, { min = 1, max = Number.MAX_SAFE_INTEGER } = {}) {
		const parsed = Number.parseInt(String(value ?? ""), 10);
		if (!Number.isFinite(parsed)) return fallback;
		return Math.min(Math.max(parsed, min), max);
	}
	function chunkItems(items, chunkSize) {
		if (!Array.isArray(items) || !items.length) return [];
		if (!chunkSize || chunkSize < 1) return [items.slice()];
		const chunks = [];
		for (let index = 0; index < items.length; index += chunkSize) chunks.push(items.slice(index, index + chunkSize));
		return chunks;
	}
	//#endregion
	//#region src/shortcut-utils.js
	var MODIFIER_ORDER = [
		"Control",
		"Meta",
		"Alt",
		"Shift"
	];
	var MODIFIER_ALIASES = new Map([
		["ctrl", "Control"],
		["control", "Control"],
		["cmd", "Meta"],
		["command", "Meta"],
		["meta", "Meta"],
		["alt", "Alt"],
		["option", "Alt"],
		["shift", "Shift"]
	]);
	var KEY_ALIASES = new Map([
		[" ", "Space"],
		["spacebar", "Space"],
		["space", "Space"],
		["esc", "Escape"],
		["return", "Enter"],
		["del", "Delete"],
		["left", "ArrowLeft"],
		["right", "ArrowRight"],
		["up", "ArrowUp"],
		["down", "ArrowDown"],
		["plus", "+"]
	]);
	var MODIFIER_KEYS = new Set([
		"Control",
		"Meta",
		"Alt",
		"Shift"
	]);
	function normalizeToken(token) {
		const trimmed = token.trim();
		if (!trimmed) return "";
		const lowered = trimmed.toLowerCase();
		if (MODIFIER_ALIASES.has(lowered)) return MODIFIER_ALIASES.get(lowered);
		if (KEY_ALIASES.has(lowered)) return KEY_ALIASES.get(lowered);
		if (trimmed.length === 1) return trimmed.toUpperCase();
		return `${trimmed.slice(0, 1).toUpperCase()}${trimmed.slice(1)}`;
	}
	function normalizeShortcut(shortcut) {
		if (!shortcut || typeof shortcut !== "string") return "";
		const parts = shortcut.split("+").map(normalizeToken).filter(Boolean);
		const modifiers = MODIFIER_ORDER.filter((modifier) => parts.includes(modifier));
		const keys = parts.filter((part) => !MODIFIER_KEYS.has(part));
		if (keys.length > 1) return "";
		return [...modifiers, ...keys].join("+");
	}
	function eventToShortcut(event) {
		const parts = [];
		if (event.ctrlKey) parts.push("Control");
		if (event.metaKey) parts.push("Meta");
		if (event.altKey) parts.push("Alt");
		if (event.shiftKey) parts.push("Shift");
		const key = normalizeToken(event.key);
		if (!key || MODIFIER_KEYS.has(key)) return "";
		parts.push(key);
		return normalizeShortcut(parts.join("+"));
	}
	function shortcutMatchesEvent(shortcut, event) {
		const normalizedShortcut = normalizeShortcut(shortcut);
		if (!normalizedShortcut) return false;
		return normalizedShortcut === eventToShortcut(event);
	}
	//#endregion
	//#region src/stale-tab-utils.js
	function isTabAudible(tab) {
		return Boolean(tab?.soundPlaying || tab?.hasAttribute?.("soundplaying") || tab?.linkedBrowser?.audioMuted === false);
	}
	function shouldAutoCloseTab(tab, { now, maxAgeMs, ignoreAudible = true } = {}) {
		if (!tab || !Number.isFinite(now) || !Number.isFinite(maxAgeMs) || maxAgeMs <= 0) return false;
		if (tab.pinned || tab.selected || tab.multiselected || tab.closing || tab.hidden || tab.hasAttribute?.("zen-essential") || tab.hasAttribute?.("busy") || tab.hasAttribute?.("pending")) return false;
		if (ignoreAudible && isTabAudible(tab)) return false;
		return now - (tab.lastAccessed || now) >= maxAgeMs;
	}
	function getStaleTabs(tabs, options) {
		return tabs.filter((tab) => shouldAutoCloseTab(tab, options));
	}
	//#endregion
	//#region src/url-utils.js
	var SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;
	var DOMAIN_RE = /^(?:[a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?(?:[/?#].*)?$/i;
	function dedupeUrls(urls) {
		return [...new Set(urls.filter(Boolean))];
	}
	function looksLikeUrl(value) {
		const trimmed = value.trim();
		if (!trimmed) return false;
		return SCHEME_RE.test(trimmed) || DOMAIN_RE.test(trimmed) || trimmed.startsWith("about:") || trimmed.startsWith("chrome://");
	}
	function parseLineSeparatedUrls(text) {
		return dedupeUrls(String(text ?? "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean));
	}
	function parseCsvRows(text) {
		const input = String(text ?? "");
		const rows = [];
		let row = [];
		let cell = "";
		let inQuotes = false;
		for (let index = 0; index < input.length; index += 1) {
			const character = input[index];
			if (inQuotes) {
				if (character === "\"") if (input[index + 1] === "\"") {
					cell += "\"";
					index += 1;
				} else inQuotes = false;
				else cell += character;
				continue;
			}
			if (character === "\"") inQuotes = true;
			else if (character === ",") {
				row.push(cell);
				cell = "";
			} else if (character === "\n") {
				row.push(cell);
				rows.push(row);
				row = [];
				cell = "";
			} else if (character !== "\r") cell += character;
		}
		if (cell.length || row.length) {
			row.push(cell);
			rows.push(row);
		}
		return rows;
	}
	function extractUrlsFromCsvText(text) {
		return dedupeUrls(parseCsvRows(text).flat().map((value) => value.trim()).filter(looksLikeUrl));
	}
	//#endregion
	//#region src/index.js
	(() => {
		const MENU_IDS = {
			separator: "zen-browser-utilities-context-separator",
			moveToStart: "zen-browser-utilities-move-to-start",
			moveToEnd: "zen-browser-utilities-move-to-end",
			createNewFolder: "zen-browser-utilities-create-new-folder",
			closeTabsAbove: "zen-browser-utilities-close-tabs-above",
			closeTabsBelow: "zen-browser-utilities-close-tabs-below",
			moveToFolder: "zen-browser-utilities-move-to-folder",
			moveToFolderPopup: "zen-browser-utilities-move-to-folder-popup",
			moveOutOfFolder: "zen-browser-utilities-move-out-of-folder",
			duplicatePinnedBelow: "zen-browser-utilities-duplicate-pinned-below",
			moveToWorkspace: "zen-browser-utilities-move-to-workspace",
			moveToWorkspacePopup: "zen-browser-utilities-move-to-workspace-popup",
			copySelectedTabUrls: "zen-browser-utilities-copy-selected-tab-urls",
			pasteTabUrls: "zen-browser-utilities-paste-tab-urls",
			pasteTabUrlsCsv: "zen-browser-utilities-paste-tab-urls-csv",
			closeStaleTabs: "zen-browser-utilities-close-stale-tabs"
		};
		const PROMPT_TITLES = {
			folder: "Move tab to folder",
			workspace: "Move tab to space"
		};
		const DEFAULT_BATCH_SIZE = 20;
		const DEFAULT_BATCH_DELAY_MS = 120;
		const DEFAULT_STALE_MAX_AGE_MINUTES = 10080;
		const DEFAULT_STALE_CHECK_INTERVAL_MINUTES = 15;
		const STALE_MONITOR_INTERVAL_MS = 6e4;
		let lastStaleSweepAt = 0;
		function logError(error) {
			console.error("Zen Browser Utilities:", error);
		}
		function getStringPref(prefKey) {
			try {
				return Services.prefs.getStringPref(prefKey, "").trim();
			} catch (error) {
				logError(error);
				return "";
			}
		}
		function getBoolPref(prefKey, fallback = false) {
			try {
				return Services.prefs.getBoolPref(prefKey, fallback);
			} catch (error) {
				logError(error);
				return fallback;
			}
		}
		function getConfiguredBatchSize() {
			return parsePositiveInteger(getStringPref("zen-browser-utilities.close.batchSize"), DEFAULT_BATCH_SIZE, {
				min: 1,
				max: 30
			});
		}
		function getConfiguredBatchDelayMs() {
			return parsePositiveInteger(getStringPref("zen-browser-utilities.close.batchDelayMs"), DEFAULT_BATCH_DELAY_MS, {
				min: 0,
				max: 1e4
			});
		}
		function getConfiguredStaleMaxAgeMs() {
			return parsePositiveInteger(getStringPref("zen-browser-utilities.stale.maxAgeMinutes"), DEFAULT_STALE_MAX_AGE_MINUTES, {
				min: 10,
				max: 525600
			}) * 6e4;
		}
		function getConfiguredStaleCheckIntervalMs() {
			return parsePositiveInteger(getStringPref("zen-browser-utilities.stale.checkIntervalMinutes"), DEFAULT_STALE_CHECK_INTERVAL_MINUTES, {
				min: 1,
				max: 1440
			}) * 6e4;
		}
		function getContextTab() {
			return TabContextMenu?.contextTab || gBrowser?.selectedTab || null;
		}
		function getContextTabs() {
			const contextTab = getContextTab();
			if (!contextTab) return [];
			if (contextTab.multiselected) return gBrowser.selectedTabs.filter((tab) => tab.parentElement === contextTab.parentElement);
			return [contextTab];
		}
		function getSelectedTabsIfPossible() {
			return gBrowser?.selectedTabs?.length ? gBrowser.selectedTabs : getContextTabs();
		}
		function isTabNode(node) {
			return node?.tagName?.toLowerCase?.() === "tab" && !node.hasAttribute("zen-empty-tab");
		}
		function getSiblingTabs(tab) {
			const parent = tab?.parentElement;
			if (!parent) return [];
			return Array.from(parent.children).filter(isTabNode);
		}
		function getCurrentSelectionIds() {
			return getContextTabs().map((tab) => tab.getAttribute("id"));
		}
		function delay(ms) {
			return new Promise((resolve) => window.setTimeout(resolve, ms));
		}
		function getClipboardHelper() {
			try {
				return Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper);
			} catch (error) {
				logError(error);
				return null;
			}
		}
		async function writeClipboardText(text) {
			try {
				if (navigator?.clipboard?.writeText) {
					await navigator.clipboard.writeText(text);
					return true;
				}
			} catch (error) {
				logError(error);
			}
			const helper = getClipboardHelper();
			if (helper) {
				helper.copyString(text);
				return true;
			}
			return false;
		}
		async function readClipboardText(promptTitle, promptText) {
			try {
				if (navigator?.clipboard?.readText) return await navigator.clipboard.readText();
			} catch (error) {
				logError(error);
			}
			const value = { value: "" };
			return Services.prompt.prompt(window, promptTitle, promptText, value, null, {}) ? value.value : "";
		}
		function normalizeUrlForOpen(rawUrl) {
			const trimmed = rawUrl.trim();
			if (!trimmed) return "";
			try {
				const flags = Ci.nsIURIFixup.FIXUP_FLAG_FIX_SCHEME_TYPOS | Ci.nsIURIFixup.FIXUP_FLAG_ALLOW_KEYWORD_LOOKUP;
				return Services.uriFixup.getFixupURIInfo(trimmed, flags)?.fixedURI?.spec || trimmed;
			} catch (error) {
				logError(error);
				return trimmed;
			}
		}
		function removeTabs(tabs) {
			const removableTabs = tabs.filter((tab) => tab && !tab.closing);
			if (!removableTabs.length) return false;
			if (typeof gBrowser.removeTabs === "function" && removableTabs.length > 1) {
				gBrowser.removeTabs(removableTabs, { animate: true });
				return true;
			}
			for (const tab of removableTabs) gBrowser.removeTab(tab, { animate: true });
			return true;
		}
		async function closeTabsInConfiguredBatches(tabs) {
			const removableTabs = tabs.filter((tab) => tab && !tab.closing);
			if (!removableTabs.length) return false;
			const batches = chunkItems(removableTabs, getConfiguredBatchSize());
			const batchDelayMs = getConfiguredBatchDelayMs();
			for (let index = 0; index < batches.length; index += 1) {
				removeTabs(batches[index]);
				if (index < batches.length - 1 && batchDelayMs > 0) await delay(batchDelayMs);
			}
			return true;
		}
		function moveNode(node, parent, beforeNode = null) {
			const callback = () => {
				parent.insertBefore(node, beforeNode);
				gBrowser?.tabContainer?._invalidateCachedTabs?.();
			};
			if (typeof gBrowser?.zenHandleTabMove === "function") {
				gBrowser.zenHandleTabMove(node, callback);
				return;
			}
			callback();
		}
		function moveTabsToBoundary(direction) {
			const tabs = getContextTabs();
			if (!tabs.length) return false;
			const parent = tabs[0].parentElement;
			const orderedTabs = getSiblingTabs(tabs[0]);
			const orderedSelection = getOrderedSelectionIds(orderedTabs, tabs.map((tab) => tab.getAttribute("id")));
			const selectedTabs = new Set(orderedSelection);
			const remainingTabs = orderedTabs.filter((tab) => !selectedTabs.has(tab));
			if (!remainingTabs.length) return false;
			const referenceNode = direction === "start" ? remainingTabs[0] : remainingTabs[remainingTabs.length - 1].nextSibling;
			for (const tab of orderedSelection) moveNode(tab, parent, referenceNode);
			return true;
		}
		async function closeRelativeTabs(direction) {
			const contextTab = getContextTab();
			if (!contextTab) return false;
			const orderedTabs = getSiblingTabs(contextTab);
			const selectedIds = getCurrentSelectionIds();
			const tabsToClose = direction === "above" ? getItemsBeforeSelection(orderedTabs, selectedIds.length ? selectedIds : [contextTab.getAttribute("id")]) : getItemsAfterSelection(orderedTabs, selectedIds.length ? selectedIds : [contextTab.getAttribute("id")]);
			if (!tabsToClose.length) return false;
			return closeTabsInConfiguredBatches(tabsToClose);
		}
		function createNewFolderFromSelection() {
			if (typeof gZenFolders?.createFolder !== "function") return false;
			const tabs = getContextTabs();
			const triggerTab = tabs[0];
			if (!triggerTab) return false;
			const canInsertBefore = !triggerTab.hasAttribute("zen-essential") && !triggerTab?.group?.hasAttribute?.("split-view-group") && gZenFolders?.canDropElement?.({ isZenFolder: true }, triggerTab);
			gZenFolders.createFolder(tabs, {
				insertAfter: !canInsertBefore ? triggerTab?.group || triggerTab : null,
				insertBefore: canInsertBefore ? triggerTab : null,
				renameFolder: true
			});
			return true;
		}
		function getCurrentFolder(tab = getContextTab()) {
			return tab?.group?.isZenFolder ? tab.group : null;
		}
		function getWorkspaceIdForNode(node) {
			return node?.getAttribute?.("zen-workspace-id") || document.documentElement.getAttribute("zen-workspace-id") || gZenWorkspaces?.activeWorkspace || "";
		}
		function getFolderLabel(folder) {
			return folder?.label || folder?.getAttribute?.("label") || folder?.id || "Folder";
		}
		function getAvailableFolders(tab = getContextTab()) {
			const currentFolder = getCurrentFolder(tab);
			const workspaceId = getWorkspaceIdForNode(tab);
			return buildFolderChoices(Array.from(document.querySelectorAll("zen-folder")).filter((folder) => getWorkspaceIdForNode(folder) === workspaceId).map((folder) => ({
				id: folder.id,
				label: getFolderLabel(folder),
				folder
			})), currentFolder?.id || null).map((choice) => ({
				...choice,
				folder: document.getElementById(choice.id)
			}));
		}
		function moveTabsToFolder(folder) {
			const tabs = getContextTabs();
			if (!folder || !tabs.length) return false;
			gZenFolders?.ungroupTabsFromActiveGroups?.(tabs);
			for (const tab of tabs) if (folder.pinned && !tab.pinned) gBrowser.pinTab(tab);
			else if (!folder.pinned && tab.pinned) gBrowser.unpinTab(tab);
			folder.addTabs(tabs);
			gBrowser?.tabContainer?._invalidateCachedTabs?.();
			return true;
		}
		function moveTabsOutOfFolder() {
			const tabs = getContextTabs();
			if (!tabs.length || !getCurrentFolder(tabs[0])) return false;
			gZenFolders?.ungroupTabsFromActiveGroups?.(tabs);
			gBrowser?.tabContainer?._invalidateCachedTabs?.();
			return true;
		}
		function promptToChoose(title, text, labels) {
			if (!labels.length) return -1;
			const selection = { value: 0 };
			return Services.prompt.select(window, title, text, labels.length, labels, selection) ? selection.value : -1;
		}
		function promptMoveTabsToFolder() {
			const folders = getAvailableFolders();
			const index = promptToChoose(PROMPT_TITLES.folder, "Choose the destination folder for the current tab selection.", folders.map((folder) => folder.label));
			if (index < 0) return false;
			return moveTabsToFolder(folders[index].folder);
		}
		function getWorkspaceLabel(workspace) {
			let label = workspace.name || workspace.uuid || "Workspace";
			if (typeof workspace.containerTabId === "number" && typeof ContextualIdentityService?.getUserContextLabel === "function") {
				const containerLabel = ContextualIdentityService.getUserContextLabel(workspace.containerTabId) || "";
				if (containerLabel) label = `${label} (${containerLabel})`;
			}
			return label;
		}
		function getAvailableWorkspaces() {
			const currentWorkspaceId = document.documentElement.getAttribute("zen-workspace-id") || gZenWorkspaces?.activeWorkspace || null;
			return buildWorkspaceChoices((gZenWorkspaces?.getWorkspaces?.() || []).map((workspace) => ({
				id: workspace.uuid,
				label: getWorkspaceLabel(workspace),
				workspace
			})), currentWorkspaceId).map((choice) => ({
				...choice,
				workspace: (gZenWorkspaces?.getWorkspaces?.() || []).find((workspace) => workspace.uuid === choice.id)
			}));
		}
		function cloneTabIntoWorkspace(tab, workspace) {
			const state = typeof SessionStore?.getTabState === "function" ? JSON.parse(SessionStore.getTabState(tab)) : null;
			const userContextId = typeof workspace?.containerTabId === "number" ? workspace.containerTabId : 0;
			const newTab = gBrowser.addTrustedTab("about:blank", {
				inBackground: !tab.selected,
				userContextId,
				triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()
			});
			if (state) {
				state.userContextId = userContextId;
				SessionStore.setTabState(newTab, state);
			} else {
				const currentUri = tab?.linkedBrowser?.currentURI?.spec || "about:blank";
				gBrowser.loadOneTab(currentUri, {
					inBackground: !tab.selected,
					userContextId,
					triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()
				});
				gBrowser.removeTab(newTab);
				return null;
			}
			if (tab.pinned) gBrowser.pinTab(newTab);
			if (tab.hasAttribute("zen-workspace-id")) newTab.setAttribute("zen-workspace-id", workspace.uuid);
			gZenWorkspaces?.moveTabToWorkspace?.(newTab, workspace.uuid);
			return newTab;
		}
		async function moveTabsToWorkspaceWithContainer(workspaceId) {
			const destination = (gZenWorkspaces?.getWorkspaces?.() || []).find((workspace) => workspace.uuid === workspaceId);
			if (!destination) return false;
			const sourceTabs = getContextTabs();
			if (!sourceTabs.length) return false;
			let lastCreatedTab = null;
			for (const tab of sourceTabs) {
				const newTab = cloneTabIntoWorkspace(tab, destination);
				if (newTab) lastCreatedTab = newTab;
			}
			await closeTabsInConfiguredBatches(sourceTabs);
			if (lastCreatedTab) {
				await gZenWorkspaces?.changeWorkspaceWithID?.(destination.uuid);
				gBrowser.selectedTab = lastCreatedTab;
			}
			return Boolean(lastCreatedTab);
		}
		async function promptMoveTabsToWorkspace() {
			const workspaces = getAvailableWorkspaces();
			const index = promptToChoose(PROMPT_TITLES.workspace, "Choose the Zen space that should re-open the current tab selection in its assigned container.", workspaces.map((workspace) => workspace.label));
			if (index < 0) return false;
			return moveTabsToWorkspaceWithContainer(workspaces[index].id);
		}
		function getSelectedPinnedTabs() {
			return getContextTabs().filter((tab) => tab?.pinned);
		}
		function duplicatePinnedTabBelow() {
			const originalTabs = getSelectedPinnedTabs();
			if (!originalTabs.length || originalTabs.length !== getContextTabs().length) return false;
			for (const originalTab of originalTabs) {
				const duplicatedTab = gBrowser.duplicateTab(originalTab, true);
				let finalized = false;
				const finalizeDuplicate = () => {
					if (finalized || !duplicatedTab?.isConnected) return;
					finalized = true;
					if (!duplicatedTab.pinned) gBrowser.pinTab(duplicatedTab);
					const parent = originalTab.parentElement;
					const beforeNode = originalTab.nextElementSibling;
					moveNode(duplicatedTab, parent, beforeNode);
					const workspaceId = getWorkspaceIdForNode(originalTab);
					if (workspaceId) duplicatedTab.setAttribute("zen-workspace-id", workspaceId);
				};
				duplicatedTab.addEventListener("SSTabRestored", finalizeDuplicate, { once: true });
				setTimeout(finalizeDuplicate, 500);
			}
			return true;
		}
		function getTabUrls(tabs) {
			return tabs.map((tab) => tab?.linkedBrowser?.currentURI?.spec || "").filter(Boolean);
		}
		async function copySelectedTabUrls() {
			const urls = getTabUrls(getSelectedTabsIfPossible());
			if (!urls.length) return false;
			return writeClipboardText(urls.join("\n"));
		}
		function getDestinationWorkspace() {
			const workspaceId = getWorkspaceIdForNode(getContextTab());
			return (gZenWorkspaces?.getWorkspaces?.() || []).find((workspace) => workspace.uuid === workspaceId);
		}
		function createTabsInCurrentContext(urls) {
			const destinationFolder = getCurrentFolder();
			const destinationWorkspace = getDestinationWorkspace();
			const createdTabs = [];
			for (const url of urls) {
				const fixedUrl = normalizeUrlForOpen(url);
				if (!fixedUrl) continue;
				const newTab = gBrowser.addTrustedTab(fixedUrl, {
					inBackground: true,
					userContextId: typeof destinationWorkspace?.containerTabId === "number" ? destinationWorkspace.containerTabId : 0,
					triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()
				});
				if (destinationWorkspace?.uuid) gZenWorkspaces?.moveTabToWorkspace?.(newTab, destinationWorkspace.uuid);
				createdTabs.push(newTab);
			}
			if (destinationFolder && createdTabs.length) {
				if (destinationFolder.pinned) {
					for (const tab of createdTabs) if (!tab.pinned) gBrowser.pinTab(tab);
				}
				destinationFolder.addTabs(createdTabs);
			}
			if (createdTabs.length) gBrowser.selectedTab = createdTabs[createdTabs.length - 1];
			return createdTabs.length > 0;
		}
		async function pasteTabUrls() {
			return createTabsInCurrentContext(parseLineSeparatedUrls(await readClipboardText("Paste links as tabs", "Paste newline-delimited links to open each one in a new tab.")));
		}
		async function pasteTabUrlsCsv() {
			return createTabsInCurrentContext(extractUrlsFromCsvText(await readClipboardText("Paste CSV links as tabs", "Paste CSV text and every URL-like cell will open in a new tab.")));
		}
		function collectStaleTabs() {
			return getStaleTabs(Array.from(gBrowser.tabs || []), {
				now: Date.now(),
				maxAgeMs: getConfiguredStaleMaxAgeMs(),
				ignoreAudible: getBoolPref("zen-browser-utilities.stale.ignoreAudible", true)
			});
		}
		async function closeStaleTabsNow() {
			const staleTabs = collectStaleTabs();
			if (!staleTabs.length) return false;
			return closeTabsInConfiguredBatches(staleTabs);
		}
		async function maybeRunStaleTabsSweep() {
			if (!getBoolPref("zen-browser-utilities.stale.autoCloseEnabled", false)) return false;
			const now = Date.now();
			if (now - lastStaleSweepAt < getConfiguredStaleCheckIntervalMs()) return false;
			lastStaleSweepAt = now;
			return closeStaleTabsNow();
		}
		const ACTION_HANDLERS = {
			moveToStart: () => moveTabsToBoundary("start"),
			moveToEnd: () => moveTabsToBoundary("end"),
			createNewFolder: () => createNewFolderFromSelection(),
			closeTabsAbove: () => closeRelativeTabs("above"),
			closeTabsBelow: () => closeRelativeTabs("below"),
			moveToFolderPrompt: () => promptMoveTabsToFolder(),
			moveOutOfFolder: () => moveTabsOutOfFolder(),
			duplicatePinnedBelow: () => duplicatePinnedTabBelow(),
			moveToWorkspacePrompt: () => promptMoveTabsToWorkspace(),
			copySelectedTabUrls: () => copySelectedTabUrls(),
			pasteTabUrls: () => pasteTabUrls(),
			pasteTabUrlsCsv: () => pasteTabUrlsCsv(),
			closeStaleTabs: () => closeStaleTabsNow()
		};
		async function executeAction(actionId) {
			const action = ACTIONS_BY_ID.get(actionId);
			const handler = ACTION_HANDLERS[actionId];
			if (!action || typeof handler !== "function") return false;
			try {
				return await handler();
			} catch (error) {
				logError(error);
				return false;
			}
		}
		function shouldIgnoreKeyboardEvent(event) {
			if (event.defaultPrevented) return true;
			const target = event.target;
			const tagName = target?.tagName?.toLowerCase?.();
			return Boolean(target?.isContentEditable || tagName === "input" || tagName === "textarea" || tagName === "select");
		}
		function onKeyDown(event) {
			if (shouldIgnoreKeyboardEvent(event)) return;
			for (const action of ACTIONS_BY_ID.values()) {
				if (!shortcutMatchesEvent(getStringPref(action.prefKey), event)) continue;
				event.preventDefault();
				event.stopPropagation();
				executeAction(action.id);
				return;
			}
		}
		function clearPopupChildren(popupId) {
			const popup = document.getElementById(popupId);
			while (popup?.firstChild) popup.firstChild.remove();
		}
		function buildFolderMenu() {
			const folderMenu = document.getElementById(MENU_IDS.moveToFolder);
			const folders = getAvailableFolders();
			clearPopupChildren(MENU_IDS.moveToFolderPopup);
			folderMenu.hidden = !folders.length;
			const popup = document.getElementById(MENU_IDS.moveToFolderPopup);
			for (const folder of folders) {
				const item = document.createXULElement("menuitem");
				item.setAttribute("label", folder.label);
				item.dataset.folderId = folder.id;
				item.addEventListener("command", () => {
					moveTabsToFolder(folder.folder);
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
				const item = document.createXULElement("menuitem");
				item.setAttribute("label", workspace.label);
				item.dataset.workspaceId = workspace.id;
				item.addEventListener("command", () => {
					moveTabsToWorkspaceWithContainer(workspace.id);
				});
				popup.appendChild(item);
			}
		}
		function updateMenuVisibility() {
			const contextTab = getContextTab();
			if (!contextTab) return;
			const orderedTabs = getSiblingTabs(contextTab);
			const selectedIds = getCurrentSelectionIds();
			const aboveTabs = getItemsBeforeSelection(orderedTabs, selectedIds.length ? selectedIds : [contextTab.getAttribute("id")]);
			const belowTabs = getItemsAfterSelection(orderedTabs, selectedIds.length ? selectedIds : [contextTab.getAttribute("id")]);
			document.getElementById(MENU_IDS.closeTabsAbove).hidden = !aboveTabs.length;
			document.getElementById(MENU_IDS.closeTabsBelow).hidden = !belowTabs.length;
			document.getElementById(MENU_IDS.moveOutOfFolder).hidden = !getCurrentFolder(contextTab);
			document.getElementById(MENU_IDS.duplicatePinnedBelow).hidden = !getSelectedPinnedTabs().length || getSelectedPinnedTabs().length !== getContextTabs().length;
			document.getElementById(MENU_IDS.closeStaleTabs).hidden = !collectStaleTabs().length;
			buildFolderMenu();
			buildWorkspaceMenu();
		}
		function installContextMenu() {
			const tabContextMenu = document.getElementById("tabContextMenu");
			if (!tabContextMenu) {
				setTimeout(installContextMenu, 500);
				return;
			}
			if (document.getElementById(MENU_IDS.separator)) return;
			const fragment = MozXULElement.parseXULToFragment(`
      <menuseparator id="${MENU_IDS.separator}" />
      <menuitem id="${MENU_IDS.moveToStart}" label="Move to Start" />
      <menuitem id="${MENU_IDS.moveToEnd}" label="Move to End" />
      <menuitem id="${MENU_IDS.createNewFolder}" label="Create New Folder" />
      <menuitem id="${MENU_IDS.closeTabsAbove}" label="Close Tabs Above" />
      <menuitem id="${MENU_IDS.closeTabsBelow}" label="Close Tabs Below" />
      <menuitem id="${MENU_IDS.copySelectedTabUrls}" label="Copy Selected Tab Links" />
      <menuitem id="${MENU_IDS.pasteTabUrls}" label="Paste Links as Tabs" />
      <menuitem id="${MENU_IDS.pasteTabUrlsCsv}" label="Paste CSV Links as Tabs" />
      <menu id="${MENU_IDS.moveToFolder}" label="Move to Folder">
        <menupopup id="${MENU_IDS.moveToFolderPopup}" />
      </menu>
      <menuitem id="${MENU_IDS.moveOutOfFolder}" label="Move Out of Folder" />
      <menuitem id="${MENU_IDS.duplicatePinnedBelow}" label="Duplicate Pinned Tab Below" />
      <menuitem id="${MENU_IDS.closeStaleTabs}" label="Close Stale Tabs Now" />
      <menu id="${MENU_IDS.moveToWorkspace}" label="Move to Space Container">
        <menupopup id="${MENU_IDS.moveToWorkspacePopup}" />
      </menu>
    `);
			const anchor = document.getElementById("context_moveTabToGroup") || document.getElementById("context_duplicateTab") || document.getElementById("context_closeTab");
			if (anchor) anchor.before(fragment);
			else tabContextMenu.appendChild(fragment);
			document.getElementById(MENU_IDS.moveToStart).addEventListener("command", () => executeAction("moveToStart"));
			document.getElementById(MENU_IDS.moveToEnd).addEventListener("command", () => executeAction("moveToEnd"));
			document.getElementById(MENU_IDS.createNewFolder).addEventListener("command", () => executeAction("createNewFolder"));
			document.getElementById(MENU_IDS.closeTabsAbove).addEventListener("command", () => executeAction("closeTabsAbove"));
			document.getElementById(MENU_IDS.closeTabsBelow).addEventListener("command", () => executeAction("closeTabsBelow"));
			document.getElementById(MENU_IDS.copySelectedTabUrls).addEventListener("command", () => executeAction("copySelectedTabUrls"));
			document.getElementById(MENU_IDS.pasteTabUrls).addEventListener("command", () => executeAction("pasteTabUrls"));
			document.getElementById(MENU_IDS.pasteTabUrlsCsv).addEventListener("command", () => executeAction("pasteTabUrlsCsv"));
			document.getElementById(MENU_IDS.moveOutOfFolder).addEventListener("command", () => executeAction("moveOutOfFolder"));
			document.getElementById(MENU_IDS.duplicatePinnedBelow).addEventListener("command", () => executeAction("duplicatePinnedBelow"));
			document.getElementById(MENU_IDS.closeStaleTabs).addEventListener("command", () => executeAction("closeStaleTabs"));
			tabContextMenu.addEventListener("popupshowing", (event) => {
				if (event.target?.id !== "tabContextMenu") return;
				updateMenuVisibility();
			});
		}
		function init() {
			window.addEventListener("keydown", onKeyDown, true);
			installContextMenu();
			window.setInterval(() => {
				maybeRunStaleTabsSweep();
			}, STALE_MONITOR_INTERVAL_MS);
		}
		if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", init, { once: true });
		else init();
	})();
	//#endregion
})();
