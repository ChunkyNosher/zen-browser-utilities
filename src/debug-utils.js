export function limitDebugEntries(entries, maxEntries) {
  if (!Array.isArray(entries) || maxEntries < 1) {
    return [];
  }

  return entries.slice(-maxEntries);
}

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
