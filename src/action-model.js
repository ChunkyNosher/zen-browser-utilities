function getItemId(item) {
  if (typeof item === 'string') {
    return item;
  }

  if (item && typeof item === 'object') {
    if (typeof item.id === 'string') {
      return item.id;
    }

    if (typeof item.getAttribute === 'function') {
      return item.getAttribute('id');
    }
  }

  return '';
}

export function getOrderedSelectionIds(items, selectedIds) {
  const selected = new Set(selectedIds);
  return items.filter(item => selected.has(getItemId(item)));
}

export function getItemsBeforeSelection(items, selectedIds) {
  const orderedSelection = getOrderedSelectionIds(items, selectedIds);

  if (!orderedSelection.length) {
    return [];
  }

  const firstSelectedIndex = items.indexOf(orderedSelection[0]);
  return items.slice(0, firstSelectedIndex);
}

export function getItemsAfterSelection(items, selectedIds) {
  const orderedSelection = getOrderedSelectionIds(items, selectedIds);

  if (!orderedSelection.length) {
    return [];
  }

  const lastSelectedIndex = items.indexOf(
    orderedSelection[orderedSelection.length - 1]
  );

  return items.slice(lastSelectedIndex + 1);
}

export function buildFolderChoices(folders, currentFolderId = null) {
  return folders
    .filter(folder => folder.id !== currentFolderId)
    .map(folder => ({
      id: folder.id,
      label: folder.label,
    }));
}

export function buildWorkspaceChoices(workspaces, currentWorkspaceId = null) {
  return workspaces
    .filter(workspace => workspace.id !== currentWorkspaceId)
    .map(workspace => ({
      id: workspace.id,
      label: workspace.label,
    }));
}
