export function parsePositiveInteger(
  value,
  fallback,
  { min = 1, max = Number.MAX_SAFE_INTEGER } = {}
) {
  const parsed = Number.parseInt(String(value ?? ''), 10);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, min), max);
}

export function chunkItems(items, chunkSize) {
  if (!Array.isArray(items) || !items.length) {
    return [];
  }

  if (!chunkSize || chunkSize < 1) {
    return [items.slice()];
  }

  const chunks = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }

  return chunks;
}
