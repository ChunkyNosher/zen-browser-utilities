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
  ['+', 'Plus'],
  ['plus', 'Plus'],
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

export function normalizeShortcut(shortcut) {
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

export function eventToShortcut(event) {
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

export function shortcutMatchesEvent(shortcut, event) {
  const normalizedShortcut = normalizeShortcut(shortcut);

  if (!normalizedShortcut) {
    return false;
  }

  return normalizedShortcut === eventToShortcut(event);
}
