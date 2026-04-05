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
			shortcutGroup: "windowAndTabManagement",
			contextMenuPrefKey: "zen-browser-utilities.contextMenu.moveToStart",
			contextMenuLabel: "Show “Move to Start” in the tab right-click context menu",
			contextMenuMenuId: "moveToStart"
		},
		{
			id: "moveToEnd",
			label: "Move to End",
			prefKey: "zen-browser-utilities.shortcuts.moveToEnd",
			shortcutId: "zen-browser-utilities-shortcut-move-to-end",
			commandId: "zen-browser-utilities-command-move-to-end",
			shortcutGroup: "windowAndTabManagement",
			contextMenuPrefKey: "zen-browser-utilities.contextMenu.moveToEnd",
			contextMenuLabel: "Show “Move to End” in the tab right-click context menu",
			contextMenuMenuId: "moveToEnd"
		},
		{
			id: "createNewFolder",
			label: "Create New Folder",
			prefKey: "zen-browser-utilities.shortcuts.createNewFolder",
			shortcutId: "zen-browser-utilities-shortcut-create-new-folder",
			commandId: "zen-browser-utilities-command-create-new-folder",
			shortcutGroup: "windowAndTabManagement",
			contextMenuPrefKey: "zen-browser-utilities.contextMenu.createNewFolder",
			contextMenuLabel: "Show “Create New Folder” in the tab right-click context menu",
			contextMenuMenuId: "createNewFolder"
		},
		{
			id: "closeTabsAbove",
			label: "Close Tabs Above",
			prefKey: "zen-browser-utilities.shortcuts.closeTabsAbove",
			shortcutId: "zen-browser-utilities-shortcut-close-tabs-above",
			commandId: "zen-browser-utilities-command-close-tabs-above",
			shortcutGroup: "windowAndTabManagement",
			contextMenuPrefKey: "zen-browser-utilities.contextMenu.closeTabsAbove",
			contextMenuLabel: "Show “Close Tabs Above” in the tab right-click context menu",
			contextMenuMenuId: "closeTabsAbove"
		},
		{
			id: "closeTabsBelow",
			label: "Close Tabs Below",
			prefKey: "zen-browser-utilities.shortcuts.closeTabsBelow",
			shortcutId: "zen-browser-utilities-shortcut-close-tabs-below",
			commandId: "zen-browser-utilities-command-close-tabs-below",
			shortcutGroup: "windowAndTabManagement",
			contextMenuPrefKey: "zen-browser-utilities.contextMenu.closeTabsBelow",
			contextMenuLabel: "Show “Close Tabs Below” in the tab right-click context menu",
			contextMenuMenuId: "closeTabsBelow"
		},
		{
			id: "moveToFolderPrompt",
			label: "Move to Folder…",
			prefKey: "zen-browser-utilities.shortcuts.moveToFolderPrompt",
			shortcutId: "zen-browser-utilities-shortcut-move-to-folder",
			commandId: "zen-browser-utilities-command-move-to-folder",
			shortcutGroup: "windowAndTabManagement",
			contextMenuPrefKey: "zen-browser-utilities.contextMenu.moveToFolder",
			contextMenuLabel: "Show “Move to Folder” in the tab right-click context menu",
			contextMenuMenuId: "moveToFolder"
		},
		{
			id: "moveOutOfFolder",
			label: "Move Out of Folder",
			prefKey: "zen-browser-utilities.shortcuts.moveOutOfFolder",
			shortcutId: "zen-browser-utilities-shortcut-move-out-of-folder",
			commandId: "zen-browser-utilities-command-move-out-of-folder",
			shortcutGroup: "windowAndTabManagement",
			contextMenuPrefKey: "zen-browser-utilities.contextMenu.moveOutOfFolder",
			contextMenuLabel: "Show “Move Out of Folder” in the tab right-click context menu",
			contextMenuMenuId: "moveOutOfFolder"
		},
		{
			id: "duplicatePinnedBelow",
			label: "Duplicate Pinned Tab Below",
			prefKey: "zen-browser-utilities.shortcuts.duplicatePinnedBelow",
			shortcutId: "zen-browser-utilities-shortcut-duplicate-pinned-below",
			commandId: "zen-browser-utilities-command-duplicate-pinned-below",
			shortcutGroup: "windowAndTabManagement",
			contextMenuPrefKey: "zen-browser-utilities.contextMenu.duplicatePinnedBelow",
			contextMenuLabel: "Show “Duplicate Pinned Tab Below” in the tab right-click context menu",
			contextMenuMenuId: "duplicatePinnedBelow"
		},
		{
			id: "moveToWorkspacePrompt",
			label: "Move to Space Container…",
			prefKey: "zen-browser-utilities.shortcuts.moveToWorkspacePrompt",
			shortcutId: "zen-browser-utilities-shortcut-move-to-space-container",
			commandId: "zen-browser-utilities-command-move-to-space-container",
			shortcutGroup: "zen-workspace",
			contextMenuPrefKey: "zen-browser-utilities.contextMenu.moveToWorkspace",
			contextMenuLabel: "Show “Move to Space Container” in the tab right-click context menu",
			contextMenuMenuId: "moveToWorkspace"
		},
		{
			id: "copySelectedTabUrls",
			label: "Copy Selected Tab Links",
			prefKey: "zen-browser-utilities.shortcuts.copySelectedTabUrls",
			shortcutId: "zen-browser-utilities-shortcut-copy-selected-tab-links",
			commandId: "zen-browser-utilities-command-copy-selected-tab-links",
			shortcutGroup: "pageOperations",
			contextMenuPrefKey: "zen-browser-utilities.contextMenu.copySelectedTabUrls",
			contextMenuLabel: "Show “Copy Selected Tab Links” in the tab right-click context menu",
			contextMenuMenuId: "copySelectedTabUrls"
		},
		{
			id: "pasteTabUrls",
			label: "Paste Links as Tabs",
			prefKey: "zen-browser-utilities.shortcuts.pasteTabUrls",
			shortcutId: "zen-browser-utilities-shortcut-paste-links-as-tabs",
			commandId: "zen-browser-utilities-command-paste-links-as-tabs",
			shortcutGroup: "pageOperations",
			contextMenuPrefKey: "zen-browser-utilities.contextMenu.pasteTabUrls",
			contextMenuLabel: "Show “Paste Links as Tabs” in the tab right-click context menu",
			contextMenuMenuId: "pasteTabUrls"
		},
		{
			id: "pasteTabUrlsCsv",
			label: "Paste CSV Links as Tabs",
			prefKey: "zen-browser-utilities.shortcuts.pasteTabUrlsCsv",
			shortcutId: "zen-browser-utilities-shortcut-paste-csv-links-as-tabs",
			commandId: "zen-browser-utilities-command-paste-csv-links-as-tabs",
			shortcutGroup: "pageOperations",
			contextMenuPrefKey: "zen-browser-utilities.contextMenu.pasteTabUrlsCsv",
			contextMenuLabel: "Show “Paste CSV Links as Tabs” in the tab right-click context menu",
			contextMenuMenuId: "pasteTabUrlsCsv"
		},
		{
			id: "closeStaleTabs",
			label: "Close Stale Tabs",
			prefKey: "zen-browser-utilities.shortcuts.closeStaleTabs",
			shortcutId: "zen-browser-utilities-shortcut-close-stale-tabs",
			commandId: "zen-browser-utilities-command-close-stale-tabs",
			shortcutGroup: "zen-other",
			contextMenuPrefKey: "zen-browser-utilities.contextMenu.closeStaleTabs",
			contextMenuLabel: "Show “Close Stale Tabs Now” in the tab right-click context menu",
			contextMenuMenuId: "closeStaleTabs"
		},
		{
			id: "replacePinnedUrlWithCurrent",
			label: "Replace Pinned URL with Current",
			prefKey: "zen-browser-utilities.shortcuts.replacePinnedUrlWithCurrent",
			shortcutId: "zen-browser-utilities-shortcut-replace-pinned-url-with-current",
			commandId: "zen-browser-utilities-command-replace-pinned-url-with-current",
			shortcutGroup: "pageOperations",
			contextMenuPrefKey: "zen-browser-utilities.contextMenu.replacePinnedUrlWithCurrent",
			contextMenuLabel: "Show “Replace Pinned URL with Current” in the tab right-click context menu",
			contextMenuMenuId: "replacePinnedUrlWithCurrent"
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
	//#region src/debug-utils.js
	function limitDebugEntries(entries, maxEntries) {
		if (!Array.isArray(entries) || maxEntries < 1) return [];
		return entries.slice(-maxEntries);
	}
	/**
	* Build the JSON payload written by the debug-log export action.
	*
	* @param {object} options
	* @param {string} options.exportedAt ISO timestamp for when the export was created.
	* @param {string} options.pageUrl Browser chrome/settings page that created the export.
	* @param {Array<object>} [options.entries=[]] Normalized in-memory debug log entries.
	* @param {Array<object>} [options.actions=[]] Shortcut/action metadata included for support.
	* @param {object} [options.preferences={}] Relevant user-configurable preference values.
	* @returns {{
	*   exportedAt: string,
	*   pageUrl: string,
	*   entryCount: number,
	*   entries: Array<object>,
	*   actions: Array<object>,
	*   preferences: object
	* }} Snapshot payload suitable for JSON export.
	*/
	function createDebugSnapshot({ exportedAt, pageUrl, entries = [], actions = [], preferences = {} }) {
		return {
			exportedAt,
			pageUrl,
			entryCount: entries.length,
			entries,
			actions,
			preferences
		};
	}
	//#endregion
	//#region src/link-context-utils.js
	function getLinkUrlFromContextMenu(contextMenu) {
		return contextMenu?.linkURL || contextMenu?.linkURI?.spec || contextMenu?.linkURI?.displaySpec || "";
	}
	function isEligibleLinkContext(contextMenu) {
		return Boolean(contextMenu?.onLink && !contextMenu?.onMailtoLink && !contextMenu?.onTelLink && getLinkUrlFromContextMenu(contextMenu));
	}
	function getLinkContextVisibilityState({ isEligible, currentTabPinned, folderCount, workspaceCount }) {
		if (!isEligible) return {
			openBelowPinned: false,
			openToFolder: false,
			openToWorkspace: false,
			separator: false
		};
		const openBelowPinned = Boolean(currentTabPinned);
		const openToFolder = folderCount > 0;
		const openToWorkspace = workspaceCount > 0;
		return {
			openBelowPinned,
			openToFolder,
			openToWorkspace,
			separator: openBelowPinned || openToFolder || openToWorkspace
		};
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
		for (const part of parts.slice(0, -1)) switch (part) {
			case "Control":
				if (isMac) modifiers.control = true;
				else modifiers.accel = true;
				break;
			case "Meta":
				modifiers.meta = true;
				break;
			case "Alt":
				modifiers.alt = true;
				break;
			case "Shift":
				modifiers.shift = true;
				break;
			default: break;
		}
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
	function getSpecialKeycode(key) {
		return SPECIAL_KEYCODES.get(normalizeToken(key));
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
			replacePinnedUrlWithCurrent: "zen-browser-utilities-replace-pinned-url-with-current",
			linkSeparator: "zen-browser-utilities-link-context-separator",
			openLinkBelowPinned: "zen-browser-utilities-open-link-below-pinned",
			openLinkToFolder: "zen-browser-utilities-open-link-to-folder",
			openLinkToFolderPopup: "zen-browser-utilities-open-link-to-folder-popup",
			openLinkToWorkspace: "zen-browser-utilities-open-link-to-workspace",
			openLinkToWorkspacePopup: "zen-browser-utilities-open-link-to-workspace-popup"
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
		const BROWSER_URL = "chrome://browser/content/browser.xhtml";
		const CUSTOM_COMMANDSET_ID = "zen-browser-utilities-commandset";
		const CUSTOM_SHORTCUT_ROW_ATTRIBUTE = "data-zen-browser-utilities-shortcut";
		const CUSTOM_SHORTCUT_GROUP_ATTRIBUTE = "data-zen-browser-utilities-shortcut-group";
		const CUSTOM_SHORTCUT_GROUP_ID = "zen-browser-utilities-shortcut-group";
		const ZEN_CKS_CLASS_BASE = "zenCKSOption";
		const ZEN_CKS_INPUT_FIELD_CLASS = `${ZEN_CKS_CLASS_BASE}-input`;
		const ZEN_CKS_LABEL_CLASS = `${ZEN_CKS_CLASS_BASE}-label`;
		const ZEN_CKS_WRAPPER_ID = `${ZEN_CKS_CLASS_BASE}-wrapper`;
		const KEYBIND_ATTRIBUTE_KEY = "key";
		const UNSAVED_CLASS = `${ZEN_CKS_CLASS_BASE}-unsaved`;
		const UNSAVED_INPUT_CLASS = `${ZEN_CKS_INPUT_FIELD_CLASS}-unsaved`;
		const DEBUG_LOG_MAX_ENTRIES = 500;
		const DEBUG_LOG_EXPORT_BUTTON_ID = "zen-browser-utilities-export-debug-log";
		const DEBUG_LOG_EXPORT_PANEL_ID = "zen-browser-utilities-export-debug-panel";
		const DEBUG_LOG_PREF = "zen-browser-utilities.debug.enabled";
		const LINK_CONTEXT_MENU_RETRY_BASE_MS = 500;
		const LINK_CONTEXT_MENU_RETRY_MAX_ATTEMPTS = 6;
		const CONTEXT_MENU_ACTIONS = ACTIONS.filter((action) => action.contextMenuPrefKey && action.contextMenuMenuId);
		const LINK_CONTEXT_ACTIONS = [
			{
				id: "openLinkBelowPinned",
				prefKey: "zen-browser-utilities.linkContextMenu.openBelowPinned",
				menuId: MENU_IDS.openLinkBelowPinned
			},
			{
				id: "openLinkToFolder",
				prefKey: "zen-browser-utilities.linkContextMenu.openToFolder",
				menuId: MENU_IDS.openLinkToFolder
			},
			{
				id: "openLinkToWorkspace",
				prefKey: "zen-browser-utilities.linkContextMenu.openToWorkspace",
				menuId: MENU_IDS.openLinkToWorkspace
			}
		];
		const LINK_CONTEXT_ACTIONS_BY_ID = new Map(LINK_CONTEXT_ACTIONS.map((action) => [action.id, action]));
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
		let linkContextMenuInstallAttempts = 0;
		let debugEntries = [];
		function isDebugLoggingEnabled() {
			try {
				return Services.prefs.getBoolPref(DEBUG_LOG_PREF, false);
			} catch {
				return false;
			}
		}
		function normalizeDebugDetails(details) {
			if (!details) return null;
			if (details instanceof Error) return {
				name: details.name,
				message: details.message,
				stack: details.stack || ""
			};
			if (typeof details === "string") return details;
			try {
				return JSON.parse(JSON.stringify(details));
			} catch {
				return String(details);
			}
		}
		function sanitizeUrlForDebug(url) {
			if (!url) return "";
			try {
				const parsed = new URL(url);
				return `${parsed.origin}${parsed.pathname}`;
			} catch {
				return String(url).split(/[?#]/, 1)[0];
			}
		}
		function appendDebugEntry(level, message, details = null, force = false) {
			if (!force && !isDebugLoggingEnabled()) return;
			debugEntries = limitDebugEntries([...debugEntries, {
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				level,
				message,
				page: window.location.href,
				details: normalizeDebugDetails(details)
			}], DEBUG_LOG_MAX_ENTRIES);
		}
		function logDebug(message, details = null) {
			appendDebugEntry("debug", message, details);
		}
		function logError(error) {
			appendDebugEntry("error", "Unhandled Zen Browser Utilities error", error, true);
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
		function getShortcutEditorSavedState(settings) {
			return Boolean(settings?._hasSaved);
		}
		function setShortcutEditorSavedState(settings, value) {
			if (settings) settings._hasSaved = value;
		}
		function getContextMenuElement(action) {
			return document.getElementById(MENU_IDS[action.contextMenuMenuId]) || null;
		}
		function getMenuElementById(menuId) {
			return document.getElementById(menuId) || null;
		}
		function isContextMenuActionEnabled(action) {
			return getBoolPref(action.contextMenuPrefKey, true);
		}
		function setContextMenuActionHidden(action, hidden) {
			const element = getContextMenuElement(action);
			if (element) element.hidden = hidden || !isContextMenuActionEnabled(action);
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
		function getActiveBrowserTab() {
			return gBrowser?.selectedTab || null;
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
		function getWorkspaceById(workspaceId) {
			return (gZenWorkspaces?.getWorkspaces?.() || []).find((workspace) => workspace.uuid === workspaceId) || null;
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
		function getDestinationWorkspace(tab = getContextTab()) {
			return getWorkspaceById(getWorkspaceIdForNode(tab));
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
		function getContextLinkUrl() {
			return getLinkUrlFromContextMenu(gContextMenu);
		}
		function isLinkContextMenuActive() {
			return isEligibleLinkContext(gContextMenu);
		}
		function getAvailableFoldersForLinkContext() {
			return getAvailableFolders(getActiveBrowserTab());
		}
		function getAvailableWorkspacesForLinkContext() {
			const currentWorkspaceId = getWorkspaceIdForNode(getActiveBrowserTab());
			return buildWorkspaceChoices((gZenWorkspaces?.getWorkspaces?.() || []).map((workspace) => ({
				id: workspace.uuid,
				label: getWorkspaceLabel(workspace),
				workspace
			})), currentWorkspaceId).map((choice) => ({
				...choice,
				workspace: getWorkspaceById(choice.id)
			}));
		}
		function createNewTabForDestination(url, destinationWorkspace = null) {
			const fixedUrl = normalizeUrlForOpen(url);
			if (!fixedUrl) return null;
			const newTab = gBrowser.addTrustedTab(fixedUrl, {
				inBackground: true,
				userContextId: typeof destinationWorkspace?.containerTabId === "number" ? destinationWorkspace.containerTabId : 0,
				triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()
			});
			if (destinationWorkspace?.uuid) {
				gZenWorkspaces?.moveTabToWorkspace?.(newTab, destinationWorkspace.uuid);
				newTab.setAttribute("zen-workspace-id", destinationWorkspace.uuid);
			}
			return newTab;
		}
		function openLinkBelowPinnedTab() {
			const sourceTab = getActiveBrowserTab();
			const url = getContextLinkUrl();
			if (!sourceTab?.pinned || !url) return false;
			const workspace = getDestinationWorkspace(sourceTab);
			const newTab = createNewTabForDestination(url, workspace);
			if (!newTab) return false;
			if (!newTab.pinned) gBrowser.pinTab(newTab);
			moveNode(newTab, sourceTab.parentElement, sourceTab.nextElementSibling);
			logDebug("Opened link below pinned tab from webpage context menu.", {
				url: sanitizeUrlForDebug(url),
				sourceTabId: sourceTab.getAttribute?.("id") || "",
				workspaceId: workspace?.uuid || ""
			});
			return true;
		}
		function openLinkInFolder(folder) {
			const url = getContextLinkUrl();
			const destinationWorkspace = getWorkspaceById(getWorkspaceIdForNode(folder));
			if (!folder || !url) return false;
			const newTab = createNewTabForDestination(url, destinationWorkspace);
			if (!newTab) return false;
			if (folder.pinned && !newTab.pinned) gBrowser.pinTab(newTab);
			else if (!folder.pinned && newTab.pinned) gBrowser.unpinTab(newTab);
			folder.addTabs([newTab]);
			gBrowser.selectedTab = newTab;
			logDebug("Opened link into folder from webpage context menu.", {
				url: sanitizeUrlForDebug(url),
				folderId: folder.id,
				workspaceId: destinationWorkspace?.uuid || ""
			});
			return true;
		}
		function openLinkInWorkspace(workspaceId) {
			const url = getContextLinkUrl();
			const workspace = getWorkspaceById(workspaceId);
			if (!url || !workspace) return false;
			const newTab = createNewTabForDestination(url, workspace);
			if (!newTab) return false;
			gZenWorkspaces?.changeWorkspaceWithID?.(workspace.uuid);
			gBrowser.selectedTab = newTab;
			logDebug("Opened link into workspace from webpage context menu.", {
				url: sanitizeUrlForDebug(url),
				workspaceId: workspace.uuid
			});
			return true;
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
				const specialKeycode = getSpecialKeycode(shortcut);
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
					return executeAction(action.id);
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
		function createUnsavedShortcutNotice() {
			return window.MozXULElement.parseXULToFragment(`
      <label class="${UNSAVED_CLASS}" data-l10n-id="zen-key-unsaved"></label>
    `);
		}
		function createShortcutEditorRow() {
			return window.MozXULElement.parseXULToFragment(`
      <hbox class="${ZEN_CKS_CLASS_BASE}" ${CUSTOM_SHORTCUT_ROW_ATTRIBUTE}="true">
        <label class="${ZEN_CKS_LABEL_CLASS}" />
        <vbox flex="1">
          <html:input readonly="1" class="${ZEN_CKS_INPUT_FIELD_CLASS}" />
        </vbox>
      </hbox>
    `).firstElementChild;
		}
		function getCustomShortcutInputId(action) {
			return `${ZEN_CKS_INPUT_FIELD_CLASS}-${action.shortcutId}-zen-browser-utilities`;
		}
		function getNativeShortcutInputId(action) {
			return `${ZEN_CKS_INPUT_FIELD_CLASS}-${action.shortcutId}`;
		}
		function attachShortcutInputEvents(input, action) {
			input.addEventListener("focus", (event) => {
				const settings = window.gZenCKSSettings;
				if (!settings) return;
				settings._currentActionID = action.shortcutId;
				setShortcutEditorSavedState(settings, true);
				event.target.classList.add(`${ZEN_CKS_INPUT_FIELD_CLASS}-editing`);
			});
			input.addEventListener("editDone", (event) => {
				event.target.classList.remove(`${ZEN_CKS_INPUT_FIELD_CLASS}-editing`);
			});
			input.addEventListener("blur", (event) => {
				const settings = window.gZenCKSSettings;
				const target = event.target;
				if (!settings) return;
				target.classList.remove(`${ZEN_CKS_INPUT_FIELD_CLASS}-editing`);
				if (!getShortcutEditorSavedState(settings)) {
					target.classList.add(UNSAVED_INPUT_CLASS);
					if (!target.nextElementSibling) {
						target.after(createUnsavedShortcutNotice());
						target.value = "Not set";
					}
				} else {
					target.classList.remove(UNSAVED_INPUT_CLASS);
					const sibling = target.nextElementSibling;
					if (sibling && sibling.classList.contains(UNSAVED_CLASS)) sibling.remove();
				}
			});
		}
		function ensureCustomShortcutGroup(wrapper) {
			let header = document.getElementById(CUSTOM_SHORTCUT_GROUP_ID);
			if (!header) {
				header = document.createElement("h2");
				header.id = CUSTOM_SHORTCUT_GROUP_ID;
				header.setAttribute(CUSTOM_SHORTCUT_GROUP_ATTRIBUTE, "true");
				header.textContent = "Zen Browser Utilities";
			}
			wrapper.prepend(header);
			return header;
		}
		function removeNativeShortcutRows(wrapper) {
			for (const action of ACTIONS) wrapper.querySelector(`#${getNativeShortcutInputId(action)}`)?.closest(`.${ZEN_CKS_CLASS_BASE}`)?.remove();
		}
		function insertShortcutRow(wrapper, row) {
			let insertAfter = ensureCustomShortcutGroup(wrapper);
			while (insertAfter.nextSibling?.nodeType === Node.ELEMENT_NODE && insertAfter.nextSibling?.getAttribute?.(CUSTOM_SHORTCUT_ROW_ATTRIBUTE) === "true") insertAfter = insertAfter.nextSibling;
			insertAfter.after(row);
		}
		function renderShortcutEditorRows() {
			const wrapper = document.getElementById(ZEN_CKS_WRAPPER_ID);
			if (!wrapper || !window.gZenCKSSettings) return;
			wrapper.querySelectorAll(`[${CUSTOM_SHORTCUT_ROW_ATTRIBUTE}="true"]`).forEach((node) => {
				node.remove();
			});
			removeNativeShortcutRows(wrapper);
			ensureCustomShortcutGroup(wrapper);
			for (const action of ACTIONS) {
				const shortcut = getCustomShortcutFromManager(action);
				const row = createShortcutEditorRow();
				const label = row.querySelector(`.${ZEN_CKS_LABEL_CLASS}`);
				const input = row.querySelector(`.${ZEN_CKS_INPUT_FIELD_CLASS}`);
				label.textContent = action.label;
				input.setAttribute(KEYBIND_ATTRIBUTE_KEY, action.shortcutId);
				input.setAttribute("data-id", action.shortcutId);
				input.setAttribute("data-group", CUSTOM_SHORTCUT_GROUP_ID);
				input.id = getCustomShortcutInputId(action);
				if (shortcut?.toDisplayString?.() && !shortcut?.isEmpty?.()) input.value = shortcut.toDisplayString();
				else resetShortcutInputVisualState(input);
				attachShortcutInputEvents(input, action);
				insertShortcutRow(wrapper, row);
			}
		}
		async function syncShortcutEditor() {
			if (!document.getElementById(ZEN_CKS_WRAPPER_ID) || !window.gZenCKSSettings) return false;
			if (!await ensureCustomShortcutDefinitions()) return false;
			renderShortcutEditorRows();
			return true;
		}
		function getDebugExportButtonContainer() {
			return document.getElementById(ZEN_CKS_WRAPPER_ID)?.parentElement || null;
		}
		function getRelevantPreferenceSnapshot() {
			return {
				debugEnabled: getBoolPref(DEBUG_LOG_PREF, false),
				closeBatchSize: getStringPref("zen-browser-utilities.close.batchSize"),
				closeBatchDelayMs: getStringPref("zen-browser-utilities.close.batchDelayMs"),
				staleAutoCloseEnabled: getBoolPref("zen-browser-utilities.stale.autoCloseEnabled", false),
				staleMaxAgeMinutes: getStringPref("zen-browser-utilities.stale.maxAgeMinutes"),
				staleCheckIntervalMinutes: getStringPref("zen-browser-utilities.stale.checkIntervalMinutes")
			};
		}
		async function exportDebugLog() {
			const picker = Cc["@mozilla.org/filepicker;1"]?.createInstance?.(Ci.nsIFilePicker);
			if (!picker) return false;
			const { IOUtils } = ChromeUtils.importESModule("resource://gre/modules/IOUtils.sys.mjs");
			const filenameTimestamp = (/* @__PURE__ */ new Date()).toISOString().replaceAll(":", "-");
			picker.init(window, "Export Zen Browser Utilities debug log (may contain support details)", Ci.nsIFilePicker.modeSave);
			picker.defaultString = `zen-browser-utilities-debug-log-${filenameTimestamp}.json`;
			picker.defaultExtension = "json";
			picker.appendFilter("JSON", "*.json");
			const result = await picker.open();
			if (result !== Ci.nsIFilePicker.returnOK && result !== Ci.nsIFilePicker.returnReplace) return false;
			const snapshot = createDebugSnapshot({
				exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
				pageUrl: window.location.href,
				entries: debugEntries,
				actions: ACTIONS.map((action) => ({
					id: action.id,
					label: action.label,
					shortcut: getStringPref(action.prefKey)
				})),
				preferences: getRelevantPreferenceSnapshot()
			});
			await IOUtils.writeUTF8(picker.file.path, `${JSON.stringify(snapshot, null, 2)}\n`);
			logDebug("Exported debug log to file.", { path: picker.file.path });
			return true;
		}
		function installDebugExportButton() {
			const container = getDebugExportButtonContainer();
			if (!container) {
				logDebug("Skipped debug export button install because the shortcut editor container is unavailable.");
				return;
			}
			if (document.getElementById(DEBUG_LOG_EXPORT_PANEL_ID)) return;
			const panel = document.createXULElement("vbox");
			panel.id = DEBUG_LOG_EXPORT_PANEL_ID;
			panel.setAttribute("style", "margin-bottom: 12px; gap: 6px;");
			const description = document.createXULElement("description");
			description.textContent = "Enable debug logging from the mod preferences, then use this button to export the collected Zen Browser Utilities log as JSON. Review the file before sharing because it may include support details such as browser, tab, and sanitized link URLs.";
			const button = document.createXULElement("button");
			button.id = DEBUG_LOG_EXPORT_BUTTON_ID;
			button.setAttribute("label", "Export Zen Browser Utilities Debug Log");
			button.addEventListener("command", async () => {
				try {
					await exportDebugLog();
				} catch (error) {
					logError(error);
				}
			});
			panel.append(description, button);
			container.insertBefore(panel, container.firstChild);
		}
		function watchShortcutEditor() {
			if (shortcutEditorObserver) return;
			const tryInstallHook = () => {
				const settings = window.gZenCKSSettings;
				if (!settings || settings.__zenBrowserUtilitiesPatched) return Boolean(settings);
				if (!Object.getOwnPropertyDescriptor(settings, "_hasSaved")) Object.defineProperty(settings, "_hasSaved", {
					configurable: true,
					enumerable: false,
					get() {
						return this["_hasSafed"];
					},
					set(value) {
						this["_hasSafed"] = value;
					}
				});
				const originalInitializeCKS = settings._initializeCKS.bind(settings);
				settings._initializeCKS = async (...args) => {
					await originalInitializeCKS(...args);
					await syncShortcutEditor();
					installDebugExportButton();
				};
				settings.__zenBrowserUtilitiesPatched = true;
				return true;
			};
			const rerender = async () => {
				if (!tryInstallHook()) return;
				if (await syncShortcutEditor()) {
					installDebugExportButton();
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
			separator.hidden = !CONTEXT_MENU_ACTIONS.some((action) => {
				const element = getContextMenuElement(action);
				return element && !element.hidden;
			});
		}
		function updateLinkContextMenuSeparatorVisibility() {
			const separator = document.getElementById(MENU_IDS.linkSeparator);
			if (!separator) return;
			separator.hidden = !LINK_CONTEXT_ACTIONS.some((action) => {
				const element = getMenuElementById(action.menuId);
				return element && !element.hidden;
			});
		}
		function hideAllCustomContextMenuItems() {
			for (const action of CONTEXT_MENU_ACTIONS) {
				const element = getContextMenuElement(action);
				if (element) element.hidden = true;
			}
			updateContextMenuSeparatorVisibility();
		}
		function setLinkContextActionHidden(action, hidden) {
			if (!action) return;
			const element = getMenuElementById(action.menuId);
			if (element) element.hidden = hidden || !getBoolPref(action.prefKey, true);
		}
		function hideAllLinkContextMenuItems() {
			for (const action of LINK_CONTEXT_ACTIONS) {
				const element = getMenuElementById(action.menuId);
				if (element) element.hidden = true;
			}
			updateLinkContextMenuSeparatorVisibility();
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
				logDebug("Executing action.", { actionId });
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
			const folderAction = ACTIONS_BY_ID.get("moveToFolderPrompt");
			const folders = getAvailableFolders();
			clearPopupChildren(MENU_IDS.moveToFolderPopup);
			setContextMenuActionHidden(folderAction, !folders.length);
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
			const workspaceAction = ACTIONS_BY_ID.get("moveToWorkspacePrompt");
			const workspaces = getAvailableWorkspaces();
			clearPopupChildren(MENU_IDS.moveToWorkspacePopup);
			setContextMenuActionHidden(workspaceAction, workspaces.length < 1);
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
		function buildLinkFolderMenu() {
			clearPopupChildren(MENU_IDS.openLinkToFolderPopup);
			const folders = getAvailableFoldersForLinkContext();
			const popup = document.getElementById(MENU_IDS.openLinkToFolderPopup);
			setLinkContextActionHidden(LINK_CONTEXT_ACTIONS_BY_ID.get("openLinkToFolder") || null, !folders.length);
			for (const folder of folders) {
				const item = document.createXULElement("menuitem");
				item.setAttribute("label", folder.label);
				item.dataset.folderId = folder.id;
				item.addEventListener("command", () => {
					openLinkInFolder(folder.folder);
				});
				popup?.appendChild(item);
			}
		}
		function buildLinkWorkspaceMenu() {
			clearPopupChildren(MENU_IDS.openLinkToWorkspacePopup);
			const workspaces = getAvailableWorkspacesForLinkContext();
			const popup = document.getElementById(MENU_IDS.openLinkToWorkspacePopup);
			setLinkContextActionHidden(LINK_CONTEXT_ACTIONS_BY_ID.get("openLinkToWorkspace") || null, !workspaces.length);
			for (const workspace of workspaces) {
				const item = document.createXULElement("menuitem");
				item.setAttribute("label", workspace.label);
				item.dataset.workspaceId = workspace.id;
				item.addEventListener("command", () => {
					openLinkInWorkspace(workspace.id);
				});
				popup?.appendChild(item);
			}
		}
		function updateMenuVisibility() {
			const contextTab = getContextTab();
			if (!contextTab) {
				hideAllCustomContextMenuItems();
				return;
			}
			const orderedTabs = getSiblingTabs(contextTab);
			const selectedIds = getSelectionIdsWithFallback(contextTab);
			const aboveTabs = getItemsBeforeSelection(orderedTabs, selectedIds);
			const belowTabs = getItemsAfterSelection(orderedTabs, selectedIds);
			setContextMenuActionHidden(ACTIONS_BY_ID.get("moveToStart"), false);
			setContextMenuActionHidden(ACTIONS_BY_ID.get("moveToEnd"), false);
			setContextMenuActionHidden(ACTIONS_BY_ID.get("createNewFolder"), false);
			setContextMenuActionHidden(ACTIONS_BY_ID.get("closeTabsAbove"), !aboveTabs.length);
			setContextMenuActionHidden(ACTIONS_BY_ID.get("closeTabsBelow"), !belowTabs.length);
			setContextMenuActionHidden(ACTIONS_BY_ID.get("copySelectedTabUrls"), false);
			setContextMenuActionHidden(ACTIONS_BY_ID.get("pasteTabUrls"), false);
			setContextMenuActionHidden(ACTIONS_BY_ID.get("pasteTabUrlsCsv"), false);
			setContextMenuActionHidden(ACTIONS_BY_ID.get("moveOutOfFolder"), !getCurrentFolder(contextTab));
			setContextMenuActionHidden(ACTIONS_BY_ID.get("duplicatePinnedBelow"), !getSelectedPinnedTabs().length || getSelectedPinnedTabs().length !== getContextTabs().length);
			setContextMenuActionHidden(ACTIONS_BY_ID.get("closeStaleTabs"), !collectStaleTabs().length);
			setContextMenuActionHidden(ACTIONS_BY_ID.get("replacePinnedUrlWithCurrent"), !getCurrentTabUrl() || !getSelectedPinnedTabs().length);
			buildFolderMenu();
			buildWorkspaceMenu();
			updateContextMenuSeparatorVisibility();
		}
		function updateLinkContextMenuVisibility() {
			const visibility = getLinkContextVisibilityState({
				isEligible: isLinkContextMenuActive(),
				currentTabPinned: Boolean(getActiveBrowserTab()?.pinned),
				folderCount: getAvailableFoldersForLinkContext().length,
				workspaceCount: getAvailableWorkspacesForLinkContext().length
			});
			if (!visibility.separator) {
				hideAllLinkContextMenuItems();
				return;
			}
			setLinkContextActionHidden(LINK_CONTEXT_ACTIONS_BY_ID.get("openLinkBelowPinned") || null, !visibility.openBelowPinned);
			buildLinkFolderMenu();
			buildLinkWorkspaceMenu();
			updateLinkContextMenuSeparatorVisibility();
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
			logDebug("Installed tab context menu integration.");
		}
		function installLinkContextMenu() {
			const pageContextMenu = document.getElementById("contentAreaContextMenu");
			if (!pageContextMenu) {
				if (linkContextMenuInstallAttempts >= LINK_CONTEXT_MENU_RETRY_MAX_ATTEMPTS) {
					logDebug("Stopped retrying native webpage link context menu install because the menu never became available.");
					return;
				}
				const retryDelayMs = Math.min(LINK_CONTEXT_MENU_RETRY_BASE_MS * 2 ** linkContextMenuInstallAttempts, 5e3);
				linkContextMenuInstallAttempts += 1;
				setTimeout(installLinkContextMenu, retryDelayMs);
				return;
			}
			linkContextMenuInstallAttempts = 0;
			if (document.getElementById(MENU_IDS.linkSeparator)) return;
			const fragment = MozXULElement.parseXULToFragment(`
      <menuseparator id="${MENU_IDS.linkSeparator}" hidden="true" />
      <menuitem id="${MENU_IDS.openLinkBelowPinned}" label="Open Link Below Current Pinned Tab" hidden="true" />
      <menu id="${MENU_IDS.openLinkToFolder}" label="Open Link in Folder" hidden="true">
        <menupopup id="${MENU_IDS.openLinkToFolderPopup}" />
      </menu>
      <menu id="${MENU_IDS.openLinkToWorkspace}" label="Open Link in Space Container" hidden="true">
        <menupopup id="${MENU_IDS.openLinkToWorkspacePopup}" />
      </menu>
    `);
			const anchor = document.getElementById("context-openlinkintab") || document.getElementById("context-openlinkprivate") || document.getElementById("context-sep-open");
			if (anchor) anchor.before(fragment);
			else pageContextMenu.appendChild(fragment);
			document.getElementById(MENU_IDS.openLinkBelowPinned).addEventListener("command", () => openLinkBelowPinnedTab());
			pageContextMenu.addEventListener("popupshowing", (event) => {
				if (event.target?.id !== "contentAreaContextMenu") return;
				updateLinkContextMenuVisibility();
			});
			logDebug("Installed webpage link context menu integration.");
		}
		function init() {
			appendDebugEntry("debug", "Initializing Zen Browser Utilities.", { href: window.location.href }, true);
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
				installLinkContextMenu();
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
