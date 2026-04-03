const MODIFIER_ORDER = ['Control', 'Meta', 'Alt', 'Shift'];
const FUNCTION_KEY_PATTERN = /^F(?:[1-9]|1\d|2[0-4])$/;

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
export const SPECIAL_KEYCODES = new Map([
  ['Backspace', 'VK_BACK'],
  ['Delete', 'VK_DELETE'],
  ['End', 'VK_END'],
  ['Enter', 'VK_RETURN'],
  ['Escape', 'VK_ESCAPE'],
  ['Home', 'VK_HOME'],
  ['PageDown', 'VK_PAGE_DOWN'],
  ['PageUp', 'VK_PAGE_UP'],
  ['Space', 'VK_SPACE'],
  ['Tab', 'VK_TAB'],
  ['ArrowLeft', 'VK_LEFT'],
  ['ArrowRight', 'VK_RIGHT'],
  ['ArrowUp', 'VK_UP'],
  ['ArrowDown', 'VK_DOWN'],
]);

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

export function parseShortcutBinding(shortcut, {
  isMac = false,
} = {}) {
  const normalizedShortcut = normalizeShortcut(shortcut);

  if (!normalizedShortcut) {
    return null;
  }

  const parts = normalizedShortcut.split('+');
  const key = parts.at(-1);

  if (!key || MODIFIER_KEYS.has(key)) {
    return null;
  }

  const modifiers = {
    control: false,
    alt: false,
    shift: false,
    meta: false,
    accel: false,
  };

  for (const part of parts.slice(0, -1)) {
    switch (part) {
      case 'Control':
        if (isMac) {
          modifiers.control = true;
        } else {
          modifiers.accel = true;
        }
        break;
      case 'Meta':
        modifiers.meta = true;
        break;
      case 'Alt':
        modifiers.alt = true;
        break;
      case 'Shift':
        modifiers.shift = true;
        break;
      default:
        break;
    }
  }

  if (key === 'Plus') {
    return {
      key: '+',
      keycode: '',
      modifiers,
    };
  }

  if (SPECIAL_KEYCODES.has(key)) {
    return {
      key: '',
      keycode: SPECIAL_KEYCODES.get(key),
      modifiers,
    };
  }

  if (FUNCTION_KEY_PATTERN.test(key)) {
    return {
      key: '',
      keycode: `VK_${key}`,
      modifiers,
    };
  }

  return {
    key,
    keycode: '',
    modifiers,
  };
}

export function getSpecialKeycode(key) {
  return SPECIAL_KEYCODES.get(normalizeToken(key));
}
