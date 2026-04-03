/**
* Zen Browser Utilities Mod
* Version: 0.2.0
* License: MIT
*
* Built with Vite+ from the src/ directory.
*/
(function() {
	//#region src/action-model.js
	function getItemId(item) {
		if (typeof item === "string") return item;
		if (item && typeof item === "object") {
			if (typeof item.id === "string") return item.id;
			if (typeof item.getAttribute === "function") return item.getAttribute("id");
		}
		return "";
	}
	function getOrderedSelectionIds(items, selectedIds) {
		const selected = new Set(selectedIds);
		return items.filter((item) => selected.has(getItemId(item)));
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
	//#endregion
	//#region src/action-definitions.js
	var ACTIONS = [
		{
			id: "moveToStart",
			label: "Move to Start",
			prefKey: "zen-browser-utilities.shortcuts.moveToStart",
			shortcutId: "zen-browser-utilities-shortcut-move-to-start",
			commandId: "zen-browser-utilities-command-move-to-start",
			shortcutGroup: "windowAndTabManagement"
		},
		{
			id: "moveToEnd",
			label: "Move to End",
			prefKey: "zen-browser-utilities.shortcuts.moveToEnd",
			shortcutId: "zen-browser-utilities-shortcut-move-to-end",
			commandId: "zen-browser-utilities-command-move-to-end",
			shortcutGroup: "windowAndTabManagement"
		},
		{
			id: "createNewFolder",
			label: "Create New Folder",
			prefKey: "zen-browser-utilities.shortcuts.createNewFolder",
			shortcutId: "zen-browser-utilities-shortcut-create-new-folder",
			commandId: "zen-browser-utilities-command-create-new-folder",
			shortcutGroup: "windowAndTabManagement"
		},
		{
			id: "closeTabsAbove",
			label: "Close Tabs Above",
			prefKey: "zen-browser-utilities.shortcuts.closeTabsAbove",
			shortcutId: "zen-browser-utilities-shortcut-close-tabs-above",
			commandId: "zen-browser-utilities-command-close-tabs-above",
			shortcutGroup: "windowAndTabManagement"
		},
		{
			id: "closeTabsBelow",
			label: "Close Tabs Below",
			prefKey: "zen-browser-utilities.shortcuts.closeTabsBelow",
			shortcutId: "zen-browser-utilities-shortcut-close-tabs-below",
			commandId: "zen-browser-utilities-command-close-tabs-below",
			shortcutGroup: "windowAndTabManagement"
		},
		{
			id: "moveToFolderPrompt",
			label: "Move to Folder…",
			prefKey: "zen-browser-utilities.shortcuts.moveToFolderPrompt",
			shortcutId: "zen-browser-utilities-shortcut-move-to-folder",
			commandId: "zen-browser-utilities-command-move-to-folder",
			shortcutGroup: "windowAndTabManagement"
		},
		{
			id: "moveOutOfFolder",
			label: "Move Out of Folder",
			prefKey: "zen-browser-utilities.shortcuts.moveOutOfFolder",
			shortcutId: "zen-browser-utilities-shortcut-move-out-of-folder",
			commandId: "zen-browser-utilities-command-move-out-of-folder",
			shortcutGroup: "windowAndTabManagement"
		},
		{
			id: "duplicatePinnedBelow",
			label: "Duplicate Pinned Tab Below",
			prefKey: "zen-browser-utilities.shortcuts.duplicatePinnedBelow",
			shortcutId: "zen-browser-utilities-shortcut-duplicate-pinned-below",
			commandId: "zen-browser-utilities-command-duplicate-pinned-below",
			shortcutGroup: "windowAndTabManagement"
		},
		{
			id: "moveToWorkspacePrompt",
			label: "Move to Space Container…",
			prefKey: "zen-browser-utilities.shortcuts.moveToWorkspacePrompt",
			shortcutId: "zen-browser-utilities-shortcut-move-to-space-container",
			commandId: "zen-browser-utilities-command-move-to-space-container",
			shortcutGroup: "zen-workspace"
		},
		{
			id: "copySelectedTabUrls",
			label: "Copy Selected Tab Links",
			prefKey: "zen-browser-utilities.shortcuts.copySelectedTabUrls",
			shortcutId: "zen-browser-utilities-shortcut-copy-selected-tab-links",
			commandId: "zen-browser-utilities-command-copy-selected-tab-links",
			shortcutGroup: "pageOperations"
		},
		{
			id: "pasteTabUrls",
			label: "Paste Links as Tabs",
			prefKey: "zen-browser-utilities.shortcuts.pasteTabUrls",
			shortcutId: "zen-browser-utilities-shortcut-paste-links-as-tabs",
			commandId: "zen-browser-utilities-command-paste-links-as-tabs",
			shortcutGroup: "pageOperations"
		},
		{
			id: "pasteTabUrlsCsv",
			label: "Paste CSV Links as Tabs",
			prefKey: "zen-browser-utilities.shortcuts.pasteTabUrlsCsv",
			shortcutId: "zen-browser-utilities-shortcut-paste-csv-links-as-tabs",
			commandId: "zen-browser-utilities-command-paste-csv-links-as-tabs",
			shortcutGroup: "pageOperations"
		},
		{
			id: "closeStaleTabs",
			label: "Close Stale Tabs",
			prefKey: "zen-browser-utilities.shortcuts.closeStaleTabs",
			shortcutId: "zen-browser-utilities-shortcut-close-stale-tabs",
			commandId: "zen-browser-utilities-command-close-stale-tabs",
			shortcutGroup: "zen-other"
		},
		{
			id: "replacePinnedUrlWithCurrent",
			label: "Replace Pinned URL with Current",
			prefKey: "zen-browser-utilities.shortcuts.replacePinnedUrlWithCurrent",
			shortcutId: "zen-browser-utilities-shortcut-replace-pinned-url-with-current",
			commandId: "zen-browser-utilities-command-replace-pinned-url-with-current",
			shortcutGroup: "pageOperations"
		}
	];
	var ACTIONS_BY_ID = new Map(ACTIONS.map((action) => [action.id, action]));
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
	var FUNCTION_KEY_PATTERN = /^F(?:[1-9]|1\d|2[0-4])$/;
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
		["+", "Plus"],
		["plus", "Plus"]
	]);
	var MODIFIER_KEYS = new Set([
		"Control",
		"Meta",
		"Alt",
		"Shift"
	]);
	var SPECIAL_KEYCODES = new Map([
		["Backspace", "VK_BACK"],
		["Delete", "VK_DELETE"],
		["End", "VK_END"],
		["Enter", "VK_RETURN"],
		["Escape", "VK_ESCAPE"],
		["Home", "VK_HOME"],
		["PageDown", "VK_PAGE_DOWN"],
		["PageUp", "VK_PAGE_UP"],
		["Space", "VK_SPACE"],
		["Tab", "VK_TAB"],
		["ArrowLeft", "VK_LEFT"],
		["ArrowRight", "VK_RIGHT"],
		["ArrowUp", "VK_UP"],
		["ArrowDown", "VK_DOWN"]
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
	function parseShortcutBinding(shortcut, { isMac = false } = {}) {
		const normalizedShortcut = normalizeShortcut(shortcut);
		if (!normalizedShortcut) return null;
		const parts = normalizedShortcut.split("+");
		const key = parts.at(-1);
		if (!key || MODIFIER_KEYS.has(key)) return null;
		const modifiers = {
			control: false,
			alt: false,
			shift: false,
			meta: false,
			accel: false
		};
		for (const part of parts.slice(0, -1)) if (part === "Control") if (isMac) modifiers.control = true;
		else modifiers.accel = true;
		else if (part === "Meta") modifiers.meta = true;
		else if (part === "Alt") modifiers.alt = true;
		else if (part === "Shift") modifiers.shift = true;
		if (key === "Plus") return {
			key: "+",
			keycode: "",
			modifiers
		};
		if (SPECIAL_KEYCODES.has(key)) return {
			key: "",
			keycode: SPECIAL_KEYCODES.get(key),
			modifiers
		};
		if (FUNCTION_KEY_PATTERN.test(key)) return {
			key: "",
			keycode: `VK_${key}`,
			modifiers
		};
		return {
			key,
			keycode: "",
			modifiers
		};
	}
	//#endregion
	//#region src/stale-tab-utils.js
	function isTabAudible(tab) {
		const isPlaying = tab?.soundPlaying || tab?.hasAttribute?.("soundplaying");
		if (!isPlaying) return false;
		if (tab?.linkedBrowser && "audioMuted" in tab.linkedBrowser) return tab.linkedBrowser.audioMuted === false;
		return Boolean(isPlaying);
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
			closeStaleTabs: "zen-browser-utilities-close-stale-tabs",
			replacePinnedUrlWithCurrent: "zen-browser-utilities-replace-pinned-url-with-current"
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
		const CONTEXT_MENU_ENABLED_PREF = "zen-browser-utilities.contextMenu.enabled";
		const BROWSER_URL = "chrome://browser/content/browser.xhtml";
		const CUSTOM_COMMANDSET_ID = "zen-browser-utilities-commandset";
		const CUSTOM_SHORTCUT_ROW_ATTRIBUTE = "data-zen-browser-utilities-shortcut";
		const ZEN_CKS_CLASS_BASE = "zenCKSOption";
		const ZEN_CKS_INPUT_FIELD_CLASS = `${ZEN_CKS_CLASS_BASE}-input`;
		const ZEN_CKS_LABEL_CLASS = `${ZEN_CKS_CLASS_BASE}-label`;
		const ZEN_CKS_WRAPPER_ID = `${ZEN_CKS_CLASS_BASE}-wrapper`;
		const ZEN_CKS_GROUP_PREFIX = `${ZEN_CKS_CLASS_BASE}-group`;
		const KEYBIND_ATTRIBUTE_KEY = "key";
		const CUSTOM_MENU_ITEM_IDS = [
			MENU_IDS.moveToStart,
			MENU_IDS.moveToEnd,
			MENU_IDS.createNewFolder,
			MENU_IDS.closeTabsAbove,
			MENU_IDS.closeTabsBelow,
			MENU_IDS.copySelectedTabUrls,
			MENU_IDS.pasteTabUrls,
			MENU_IDS.pasteTabUrlsCsv,
			MENU_IDS.moveToFolder,
			MENU_IDS.moveOutOfFolder,
			MENU_IDS.duplicatePinnedBelow,
			MENU_IDS.replacePinnedUrlWithCurrent,
			MENU_IDS.closeStaleTabs,
			MENU_IDS.moveToWorkspace
		];
		const SPECIAL_KEYCODES = new Map([
			["ARROWDOWN", "VK_DOWN"],
			["ARROWLEFT", "VK_LEFT"],
			["ARROWRIGHT", "VK_RIGHT"],
			["ARROWUP", "VK_UP"],
			["BACKSPACE", "VK_BACK"],
			["DELETE", "VK_DELETE"],
			["END", "VK_END"],
			["ENTER", "VK_RETURN"],
			["ESCAPE", "VK_ESCAPE"],
			["F1", "VK_F1"],
			["F2", "VK_F2"],
			["F3", "VK_F3"],
			["F4", "VK_F4"],
			["F5", "VK_F5"],
			["F6", "VK_F6"],
			["F7", "VK_F7"],
			["F8", "VK_F8"],
			["F9", "VK_F9"],
			["F10", "VK_F10"],
			["F11", "VK_F11"],
			["F12", "VK_F12"],
			["F13", "VK_F13"],
			["F14", "VK_F14"],
			["F15", "VK_F15"],
			["F16", "VK_F16"],
			["F17", "VK_F17"],
			["F18", "VK_F18"],
			["F19", "VK_F19"],
			["F20", "VK_F20"],
			["F21", "VK_F21"],
			["F22", "VK_F22"],
			["F23", "VK_F23"],
			["F24", "VK_F24"],
			["HOME", "VK_HOME"],
			["PAGEDOWN", "VK_PAGE_DOWN"],
			["PAGEUP", "VK_PAGE_UP"],
			["SPACE", "VK_SPACE"],
			["TAB", "VK_TAB"]
		]);
		const KEYCODE_DISPLAY_NAMES = new Map([
			["VK_BACK", "Backspace"],
			["VK_DELETE", "Delete"],
			["VK_DOWN", "↓"],
			["VK_END", "End"],
			["VK_ESCAPE", AppConstants?.platform === "macosx" ? "⎋" : "Esc"],
			["VK_F1", "F1"],
			["VK_F2", "F2"],
			["VK_F3", "F3"],
			["VK_F4", "F4"],
			["VK_F5", "F5"],
			["VK_F6", "F6"],
			["VK_F7", "F7"],
			["VK_F8", "F8"],
			["VK_F9", "F9"],
			["VK_F10", "F10"],
			["VK_F11", "F11"],
			["VK_F12", "F12"],
			["VK_F13", "F13"],
			["VK_F14", "F14"],
			["VK_F15", "F15"],
			["VK_F16", "F16"],
			["VK_F17", "F17"],
			["VK_F18", "F18"],
			["VK_F19", "F19"],
			["VK_F20", "F20"],
			["VK_F21", "F21"],
			["VK_F22", "F22"],
			["VK_F23", "F23"],
			["VK_F24", "F24"],
			["VK_HOME", "Home"],
			["VK_LEFT", "←"],
			["VK_PAGE_DOWN", "PageDown"],
			["VK_PAGE_UP", "PageUp"],
			["VK_RETURN", AppConstants?.platform === "macosx" ? "↩" : "Enter"],
			["VK_RIGHT", "→"],
			["VK_SPACE", AppConstants?.platform === "macosx" ? "␣" : "Space"],
			["VK_TAB", "Tab"],
			["VK_UP", "↑"]
		]);
		let lastStaleSweepAt = 0;
		let keyboardFallbackInstalled = false;
		let shortcutEditorObserver = null;
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
		function isBrowserPage() {
			return window.location.href === BROWSER_URL;
		}
		function isPreferencesPage() {
			return window.location.href.startsWith("about:preferences") || window.location.href.startsWith("about:settings");
		}
		function getZenShortcutModifiersClass() {
			try {
				return ChromeUtils.importESModule("chrome://browser/content/zen-components/ZenKeyboardShortcuts.mjs", { global: "current" }).nsKeyShortcutModifiers;
			} catch (error) {
				logError(error);
				return null;
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
		function getSelectionIdsWithFallback(contextTab = getContextTab()) {
			const selectedIds = getCurrentSelectionIds();
			return selectedIds.length ? selectedIds : [contextTab?.getAttribute("id")].filter(Boolean);
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
			const selectedIds = getSelectionIdsWithFallback(contextTab);
			const tabsToClose = direction === "above" ? getItemsBeforeSelection(orderedTabs, selectedIds) : getItemsAfterSelection(orderedTabs, selectedIds);
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
			let state = null;
			if (typeof SessionStore?.getTabState === "function") try {
				const stateString = SessionStore.getTabState(tab);
				state = stateString ? JSON.parse(stateString) : null;
			} catch (error) {
				logError(error);
			}
			const userContextId = typeof workspace?.containerTabId === "number" ? workspace.containerTabId : 0;
			const newTab = gBrowser.addTrustedTab("about:blank", {
				inBackground: !tab.selected,
				userContextId,
				triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()
			});
			if (state) {
				state.userContextId = userContextId;
				SessionStore.setTabState(newTab, JSON.stringify(state));
			} else {
				const currentUri = tab?.linkedBrowser?.currentURI?.spec || "about:blank";
				(typeof gBrowser.getBrowserForTab === "function" ? gBrowser.getBrowserForTab(newTab) : newTab.linkedBrowser)?.loadURI?.(currentUri, { triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal() });
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
			const createdTabs = [];
			for (const tab of sourceTabs) {
				const newTab = cloneTabIntoWorkspace(tab, destination);
				if (!newTab) {
					removeTabs(createdTabs);
					return false;
				}
				createdTabs.push(newTab);
				lastCreatedTab = newTab;
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
		function getCurrentTabUrl() {
			return gBrowser?.selectedTab?.linkedBrowser?.currentURI?.spec || "";
		}
		function replacePinnedUrlWithCurrent() {
			const currentUrl = getCurrentTabUrl();
			const targetTabs = getSelectedPinnedTabs();
			if (!currentUrl || !targetTabs.length) return false;
			for (const tab of targetTabs) tab.linkedBrowser?.loadURI?.(currentUrl, { triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal() });
			return true;
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
		class CustomKeyboardShortcut {
			constructor(action, modifiersClass, binding = null) {
				this.id = action.shortcutId;
				this.action = action.commandId;
				this.group = action.shortcutGroup;
				this.label = action.label;
				this.ModifiersClass = modifiersClass;
				this.modifiers = modifiersClass.fromObject(binding?.modifiers || {});
				this.key = binding?.key || "";
				this.keycode = binding?.keycode || "";
			}
			getID() {
				return this.id;
			}
			getAction() {
				return this.action;
			}
			getL10NID() {
				return null;
			}
			getGroup() {
				return this.group;
			}
			getModifiers() {
				return this.modifiers;
			}
			getKeyNameOrCode() {
				return this.key || this.keycode;
			}
			isEmpty() {
				return !this.key && !this.keycode;
			}
			isUserEditable() {
				return true;
			}
			isInternal() {
				return false;
			}
			isDisabled() {
				return false;
			}
			isReserved() {
				return false;
			}
			clearKeybind() {
				this.key = "";
				this.keycode = "";
				this.modifiers = this.ModifiersClass.fromObject({});
			}
			setNewBinding(shortcut) {
				const specialKeycode = SPECIAL_KEYCODES.get(shortcut.toUpperCase());
				if (specialKeycode) {
					this.keycode = specialKeycode;
					this.key = "";
					return;
				}
				this.keycode = "";
				this.key = shortcut;
			}
			setModifiers(modifiers) {
				this.modifiers = modifiers;
			}
			toDisplayString() {
				const displayKey = this.key ? this.key.toUpperCase() : KEYCODE_DISPLAY_NAMES.get(this.keycode) || this.keycode.replace(/^VK_/, "");
				if (!displayKey) return "";
				return `${this.modifiers.toDisplayString()}${displayKey}`;
			}
			toJSONForm() {
				return {
					id: this.id,
					key: this.key,
					keycode: this.keycode,
					group: this.group,
					l10nId: null,
					modifiers: this.modifiers.toJSONString(),
					action: this.action,
					disabled: false,
					reserved: false,
					internal: false
				};
			}
			replaceWithChild(keyElement) {
				keyElement.id = this.id;
				keyElement.setAttribute("group", this.group);
				keyElement.setAttribute("modifiers", this.modifiers.toString());
				keyElement.setAttribute("command", this.action);
				keyElement.setAttribute("zen-keybind", "true");
				if (this.keycode) {
					keyElement.setAttribute("keycode", this.keycode);
					keyElement.removeAttribute("key");
				} else {
					keyElement.setAttribute("key", this.key.toLowerCase());
					keyElement.removeAttribute("keycode");
				}
				return keyElement;
			}
			toXHTMLElement(browserWindow) {
				const keyElement = browserWindow.document.createXULElement("key");
				return this.replaceWithChild(keyElement);
			}
		}
		function createCustomKeyboardShortcut(action) {
			const ModifiersClass = getZenShortcutModifiersClass();
			if (!ModifiersClass) return null;
			return new CustomKeyboardShortcut(action, ModifiersClass, parseShortcutBinding(getStringPref(action.prefKey), { isMac: AppConstants?.platform === "macosx" }));
		}
		function getShortcutManager() {
			return window.gZenKeyboardShortcutsManager || null;
		}
		async function ensureShortcutManagerReady() {
			const manager = getShortcutManager();
			if (!manager?.getModifiableShortcuts) return null;
			await manager.getModifiableShortcuts();
			return manager;
		}
		async function ensureCustomShortcutDefinitions() {
			const manager = await ensureShortcutManagerReady();
			if (!manager || !Array.isArray(manager._currentShortcutList)) return false;
			let changed = false;
			for (const action of ACTIONS) {
				if (manager._currentShortcutList.some((shortcut) => shortcut?.getID?.() === action.shortcutId)) continue;
				const shortcut = createCustomKeyboardShortcut(action);
				if (!shortcut) return false;
				manager._currentShortcutList.push(shortcut);
				changed = true;
			}
			if (changed) {
				await manager._saveShortcuts();
				if (manager.inBrowserView) manager.triggerShortcutRebuild();
			}
			return true;
		}
		function installKeyboardFallback() {
			if (keyboardFallbackInstalled) return;
			window.addEventListener("keydown", onKeyDown, true);
			keyboardFallbackInstalled = true;
		}
		function removeKeyboardFallback() {
			if (!keyboardFallbackInstalled) return;
			window.removeEventListener("keydown", onKeyDown, true);
			keyboardFallbackInstalled = false;
		}
		function installShortcutCommands() {
			let commandset = document.getElementById(CUSTOM_COMMANDSET_ID);
			if (!commandset) {
				commandset = document.createXULElement("commandset");
				commandset.id = CUSTOM_COMMANDSET_ID;
				const anchor = document.getElementById("mainCommandSet") || document.getElementById("mainKeyset");
				if (anchor) anchor.after(commandset);
				else document.documentElement.appendChild(commandset);
			}
			for (const action of ACTIONS) {
				if (document.getElementById(action.commandId)) continue;
				const command = document.createXULElement("command");
				command.id = action.commandId;
				command.addEventListener("command", () => {
					executeAction(action.id);
				});
				commandset.appendChild(command);
			}
		}
		function getCustomShortcutFromManager(action) {
			return getShortcutManager()?._currentShortcutList?.find((shortcut) => shortcut?.getID?.() === action.shortcutId) || null;
		}
		function resetShortcutInputVisualState(input) {
			input.value = "Not set";
			input.classList.remove(`${ZEN_CKS_INPUT_FIELD_CLASS}-invalid`);
			input.classList.remove(`${ZEN_CKS_INPUT_FIELD_CLASS}-editing`);
			input.classList.add(`${ZEN_CKS_INPUT_FIELD_CLASS}-not-set`);
		}
		function attachShortcutInputEvents(input, action) {
			input.addEventListener("focus", (event) => {
				const settings = window.gZenCKSSettings;
				if (!settings) return;
				settings._currentActionID = action.shortcutId;
				settings._hasSafed = true;
				event.target.classList.add(`${ZEN_CKS_INPUT_FIELD_CLASS}-editing`);
			});
			input.addEventListener("editDone", (event) => {
				event.target.classList.add(`${ZEN_CKS_INPUT_FIELD_CLASS}-editing`);
			});
			input.addEventListener("blur", (event) => {
				const settings = window.gZenCKSSettings;
				const target = event.target;
				if (!settings) return;
				target.classList.remove(`${ZEN_CKS_INPUT_FIELD_CLASS}-editing`);
				if (!settings._hasSafed) {
					target.classList.add(`${ZEN_CKS_INPUT_FIELD_CLASS}-unsafed`);
					if (!target.nextElementSibling) {
						target.after(window.MozXULElement.parseXULToFragment(`
              <label class="${ZEN_CKS_CLASS_BASE}-unsafed" data-l10n-id="zen-key-unsaved"></label>
            `));
						target.value = "Not set";
					}
				} else {
					target.classList.remove(`${ZEN_CKS_INPUT_FIELD_CLASS}-unsafed`);
					const sibling = target.nextElementSibling;
					if (sibling && sibling.classList.contains(`${ZEN_CKS_CLASS_BASE}-unsafed`)) sibling.remove();
				}
			});
		}
		function insertShortcutRow(wrapper, row, group) {
			const groupHeader = wrapper.querySelector(`[data-group="${ZEN_CKS_GROUP_PREFIX}-${group}"]`);
			if (!groupHeader) {
				wrapper.appendChild(row);
				return;
			}
			let insertBefore = groupHeader.nextSibling;
			while (insertBefore?.matches?.(`.${ZEN_CKS_CLASS_BASE}`)) insertBefore = insertBefore.nextSibling;
			if (insertBefore) {
				wrapper.insertBefore(row, insertBefore);
				return;
			}
			wrapper.appendChild(row);
		}
		function renderShortcutEditorRows() {
			const wrapper = document.getElementById(ZEN_CKS_WRAPPER_ID);
			if (!wrapper || !window.gZenCKSSettings) return;
			wrapper.querySelectorAll(`[${CUSTOM_SHORTCUT_ROW_ATTRIBUTE}="true"]`).forEach((node) => {
				node.remove();
			});
			for (const action of ACTIONS) {
				const shortcut = getCustomShortcutFromManager(action);
				const row = window.MozXULElement.parseXULToFragment(`
        <hbox class="${ZEN_CKS_CLASS_BASE}" ${CUSTOM_SHORTCUT_ROW_ATTRIBUTE}="true">
          <label class="${ZEN_CKS_LABEL_CLASS}" />
          <vbox flex="1">
            <html:input readonly="1" class="${ZEN_CKS_INPUT_FIELD_CLASS}" />
          </vbox>
        </hbox>
      `).firstElementChild;
				const label = row.querySelector(`.${ZEN_CKS_LABEL_CLASS}`);
				const input = row.querySelector(`.${ZEN_CKS_INPUT_FIELD_CLASS}`);
				label.textContent = action.label;
				input.setAttribute(KEYBIND_ATTRIBUTE_KEY, action.shortcutId);
				input.setAttribute("data-id", action.shortcutId);
				input.setAttribute("data-group", action.shortcutGroup);
				input.id = `${ZEN_CKS_INPUT_FIELD_CLASS}-${action.shortcutId}`;
				if (shortcut?.toDisplayString?.() && !shortcut?.isEmpty?.()) input.value = shortcut.toDisplayString();
				else resetShortcutInputVisualState(input);
				attachShortcutInputEvents(input, action);
				insertShortcutRow(wrapper, row, action.shortcutGroup);
			}
		}
		async function syncShortcutEditor() {
			if (!document.getElementById(ZEN_CKS_WRAPPER_ID) || !window.gZenCKSSettings) return false;
			if (!await ensureCustomShortcutDefinitions()) return false;
			renderShortcutEditorRows();
			return true;
		}
		function watchShortcutEditor() {
			if (shortcutEditorObserver) return;
			const tryInstallHook = () => {
				const settings = window.gZenCKSSettings;
				if (!settings || settings.__zenBrowserUtilitiesPatched) return Boolean(settings);
				const originalInitializeCKS = settings._initializeCKS.bind(settings);
				settings._initializeCKS = async (...args) => {
					await originalInitializeCKS(...args);
					await syncShortcutEditor();
				};
				settings.__zenBrowserUtilitiesPatched = true;
				return true;
			};
			const rerender = async () => {
				if (!tryInstallHook()) return;
				if (await syncShortcutEditor()) {
					shortcutEditorObserver?.disconnect();
					shortcutEditorObserver = null;
				}
			};
			shortcutEditorObserver = new MutationObserver(() => {
				rerender();
			});
			shortcutEditorObserver.observe(document.body, {
				childList: true,
				subtree: true
			});
			rerender();
			window.addEventListener("unload", () => {
				shortcutEditorObserver?.disconnect();
				shortcutEditorObserver = null;
			}, { once: true });
		}
		function updateContextMenuSeparatorVisibility() {
			const separator = document.getElementById(MENU_IDS.separator);
			if (!separator) return;
			const visibleCustomItems = CUSTOM_MENU_ITEM_IDS.some((id) => {
				const element = document.getElementById(id);
				return element && !element.hidden;
			});
			separator.hidden = !getBoolPref(CONTEXT_MENU_ENABLED_PREF, true) || !visibleCustomItems;
		}
		function hideAllCustomContextMenuItems() {
			for (const id of CUSTOM_MENU_ITEM_IDS) {
				const element = document.getElementById(id);
				if (element) element.hidden = true;
			}
			updateContextMenuSeparatorVisibility();
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
			closeStaleTabs: () => closeStaleTabsNow(),
			replacePinnedUrlWithCurrent: () => replacePinnedUrlWithCurrent()
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
			if (!contextTab) {
				hideAllCustomContextMenuItems();
				return;
			}
			if (!getBoolPref(CONTEXT_MENU_ENABLED_PREF, true)) {
				hideAllCustomContextMenuItems();
				return;
			}
			const orderedTabs = getSiblingTabs(contextTab);
			const selectedIds = getSelectionIdsWithFallback(contextTab);
			const aboveTabs = getItemsBeforeSelection(orderedTabs, selectedIds);
			const belowTabs = getItemsAfterSelection(orderedTabs, selectedIds);
			document.getElementById(MENU_IDS.closeTabsAbove).hidden = !aboveTabs.length;
			document.getElementById(MENU_IDS.closeTabsBelow).hidden = !belowTabs.length;
			document.getElementById(MENU_IDS.moveOutOfFolder).hidden = !getCurrentFolder(contextTab);
			document.getElementById(MENU_IDS.duplicatePinnedBelow).hidden = !getSelectedPinnedTabs().length || getSelectedPinnedTabs().length !== getContextTabs().length;
			document.getElementById(MENU_IDS.closeStaleTabs).hidden = !collectStaleTabs().length;
			document.getElementById(MENU_IDS.replacePinnedUrlWithCurrent).hidden = !getCurrentTabUrl() || !getSelectedPinnedTabs().length;
			buildFolderMenu();
			buildWorkspaceMenu();
			updateContextMenuSeparatorVisibility();
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
      <menuitem id="${MENU_IDS.replacePinnedUrlWithCurrent}" label="Replace Pinned URL with Current" />
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
			document.getElementById(MENU_IDS.replacePinnedUrlWithCurrent).addEventListener("command", () => executeAction("replacePinnedUrlWithCurrent"));
			document.getElementById(MENU_IDS.closeStaleTabs).addEventListener("command", () => executeAction("closeStaleTabs"));
			tabContextMenu.addEventListener("popupshowing", (event) => {
				if (event.target?.id !== "tabContextMenu") return;
				updateMenuVisibility();
			});
		}
		function init() {
			if (isBrowserPage()) {
				installKeyboardFallback();
				installShortcutCommands();
				ensureCustomShortcutDefinitions().then((ready) => {
					if (ready) removeKeyboardFallback();
				});
				window.addEventListener("ZenKeyboardShortcutsReady", () => {
					ensureCustomShortcutDefinitions().then((ready) => {
						if (ready) removeKeyboardFallback();
					});
				}, { once: true });
				installContextMenu();
				window.setInterval(() => {
					maybeRunStaleTabsSweep();
				}, STALE_MONITOR_INTERVAL_MS);
				return;
			}
			if (isPreferencesPage()) watchShortcutEditor();
		}
		if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", init, { once: true });
		else init();
	})();
	//#endregion
})();
