export function isTabAudible(tab) {
  return Boolean(
    tab?.soundPlaying ||
      tab?.hasAttribute?.('soundplaying') ||
      tab?.linkedBrowser?.audioMuted === false
  );
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
