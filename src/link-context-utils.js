export function getLinkUrlFromContextMenu(contextMenu) {
  return (
    contextMenu?.linkURL ||
    contextMenu?.linkURI?.spec ||
    contextMenu?.linkURI?.displaySpec ||
    ''
  );
}

export function isEligibleLinkContext(contextMenu) {
  return Boolean(
    contextMenu?.onLink &&
    !contextMenu?.onMailtoLink &&
    !contextMenu?.onTelLink &&
    getLinkUrlFromContextMenu(contextMenu)
  );
}

export function getLinkContextVisibilityState({
  isEligible,
  currentTabPinned,
  folderCount,
  workspaceCount,
}) {
  if (!isEligible) {
    return {
      openBelowPinned: false,
      openToFolder: false,
      openToWorkspace: false,
      separator: false,
    };
  }

  const openBelowPinned = Boolean(currentTabPinned);
  const openToFolder = folderCount > 0;
  const openToWorkspace = workspaceCount > 0;

  return {
    openBelowPinned,
    openToFolder,
    openToWorkspace,
    separator: openBelowPinned || openToFolder || openToWorkspace,
  };
}
