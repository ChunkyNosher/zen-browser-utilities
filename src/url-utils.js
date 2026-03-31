const SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;
const DOMAIN_RE = /^(?:[a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?(?:[/?#].*)?$/i;

export function dedupeUrls(urls) {
  return [...new Set(urls.filter(Boolean))];
}

export function looksLikeUrl(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return false;
  }

  return (
    SCHEME_RE.test(trimmed) ||
    DOMAIN_RE.test(trimmed) ||
    trimmed.startsWith('about:') ||
    trimmed.startsWith('chrome://')
  );
}

export function parseLineSeparatedUrls(text) {
  return dedupeUrls(
    String(text ?? '')
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)
  );
}

export function parseCsvRows(text) {
  const input = String(text ?? '');
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];

    if (inQuotes) {
      if (character === '"') {
        if (input[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += character;
      }

      continue;
    }

    if (character === '"') {
      inQuotes = true;
    } else if (character === ',') {
      row.push(cell);
      cell = '';
    } else if (character === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (character !== '\r') {
      cell += character;
    }
  }

  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

export function extractUrlsFromCsvText(text) {
  return dedupeUrls(
    parseCsvRows(text)
      .flat()
      .map(value => value.trim())
      .filter(looksLikeUrl)
  );
}
