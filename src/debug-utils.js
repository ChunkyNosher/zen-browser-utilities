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

/**
 * Open an nsIFilePicker using whichever API shape the current Firefox build
 * exposes.
 *
 * Some builds expect `open({ done() {} })`, while others accept a bare
 * callback. Fall back to `show()` if needed so callers can reliably await a
 * result code.
 *
 * @param {object} picker
 * @returns {Promise<number>}
 */
export function openFilePicker(picker) {
  if (!picker) {
    return Promise.reject(new TypeError('A file picker instance is required.'));
  }

  if (typeof picker.open === 'function') {
    return new Promise((resolve, reject) => {
      const settle = result => resolve(result);

      try {
        picker.open({ done: settle });
        return;
      } catch (objectCallbackError) {
        try {
          picker.open(settle);
          return;
        } catch (functionCallbackError) {
          if (typeof picker.show !== 'function') {
            reject(functionCallbackError);
            return;
          }
        }
      }

      Promise.resolve()
        .then(() => picker.show())
        .then(resolve, reject);
    });
  }

  if (typeof picker.show === 'function') {
    return Promise.resolve(picker.show());
  }

  return Promise.reject(new TypeError('The file picker does not support open() or show().'));
}
