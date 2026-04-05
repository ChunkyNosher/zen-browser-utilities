export function limitDebugEntries(entries, maxEntries) {
  if (!Array.isArray(entries) || maxEntries < 1) {
    return [];
  }

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
export function createDebugSnapshot({
  exportedAt,
  pageUrl,
  entries = [],
  actions = [],
  preferences = {},
}) {
  return {
    exportedAt,
    pageUrl,
    entryCount: entries.length,
    entries,
    actions,
    preferences,
  };
}
