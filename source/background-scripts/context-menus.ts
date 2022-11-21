import browser from 'webextension-polyfill';

import {toggleAllRedirects} from '../utilities/toggle-all-redirects.js';

type ContextMenu = browser.Menus.CreateCreatePropertiesType;

export function getContextMenus(): ContextMenu[] {
  const actionContext =
    import.meta.env.VITE_BROWSER === 'chromium' ? 'action' : 'browser_action';

  const contextMenus: ContextMenu[] = [
    {
      id: 're-nav-toggle-redirects',
      title: 'Toggle all redirects',
      contexts: [actionContext],
    },
  ];

  return contextMenus;
}

export async function initializeContextMenus(): Promise<void> {
  const contextMenus = getContextMenus();

  await browser.contextMenus.removeAll();

  for (const contextMenu of contextMenus) {
    browser.contextMenus.create(contextMenu, contextCreated);
  }
}

function contextCreated(): void {
  const error = browser.runtime.lastError;

  if (error !== null && error !== undefined) {
    console.error('Re-Nav', error.message);
  }
}

export async function contextClicked(
  contextMenuIds: Set<string>,
  info: browser.Menus.OnClickData,
  tab?: browser.Tabs.Tab,
): Promise<void> {
  const id = info.menuItemId.toString();
  if (!contextMenuIds.has(id)) {
    return;
  }

  if (id === 're-nav-toggle-redirects') {
    await toggleAllRedirects();
  }
}
