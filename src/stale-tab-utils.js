export function isTabAudible(tab) {
  const isPlaying = tab?.soundPlaying || tab?.hasAttribute?.('soundplaying');

  if (!isPlaying) {
    return false;
  }

  if (tab?.linkedBrowser && 'audioMuted' in tab.linkedBrowser) {
    return tab.linkedBrowser.audioMuted === false;
  }

  return Boolean(isPlaying);
}

export function shouldAutoCloseTab(
  tab,
  { now, maxAgeMs, ignoreAudible = true } = {}
) {
  if (!tab || !Number.isFinite(now) || !Number.isFinite(maxAgeMs) || maxAgeMs <= 0) {
    return false;
  }

  if (
    tab.pinned ||
    tab.selected ||
    tab.multiselected ||
    tab.closing ||
    tab.hidden ||
    tab.hasAttribute?.('zen-essential') ||
    tab.hasAttribute?.('busy') ||
    tab.hasAttribute?.('pending')
  ) {
    return false;
  }

  if (ignoreAudible && isTabAudible(tab)) {
    return false;
  }

  return now - (tab.lastAccessed || now) >= maxAgeMs;
}

export function getStaleTabs(tabs, options) {
  return tabs.filter(tab => shouldAutoCloseTab(tab, options));
}
