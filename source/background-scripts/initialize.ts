import browser from 'webextension-polyfill';

import storage from '../redirect/storage.js';
import {updateBadge} from '../utilities/badge.js';
import {onCommandsHandler} from './commands.js';
import {
  contextClicked,
  getContextMenus,
  initializeContextMenus,
} from './context-menus.js';

async function browserActionClicked() {
  await browser.runtime.openOptionsPage();
}

browser.runtime.onInstalled.addListener(async () => {
  await initializeContextMenus();
  await updateBadge();

  if (import.meta.env.DEV) {
    await browser.runtime.openOptionsPage();
  }
});

browser.runtime.onStartup.addListener(async () => {
  await updateBadge();
});

browser.webNavigation.onBeforeNavigate.addListener(async (details) => {
  const {redirectsEnabled} = await browser.storage.local.get({
    redirectsEnabled: true,
  });
  if (redirectsEnabled === false) {
    return;
  }

  if (!details.url.startsWith('http') || details.frameId > 0) {
    return;
  }

  const {latestTime} = await browser.storage.local.get('latestTime');
  const redirectDelta = Date.now() - (latestTime ?? 0);
  if (redirectDelta < 100) {
    return;
  }

  const tab = await browser.tabs.query({active: true, lastFocusedWindow: true});
  const currentTabUrl =
    tab[0]?.url === undefined ? undefined : new URL(tab[0].url);

  const url = new URL(details.url);

  // The undefined.local URL will only be used if no redirects have happened yet.
  const {latestUrl: savedLatestUrl} = await browser.storage.local.get({
    latestUrl: 'https://undefined.local',
  });

  const latestUrl = new URL(savedLatestUrl);

  // Set the latest URL protocol to always be the same as the current. Since
  // only HTTP URLs are checked here, for us HTTP and HTTPS are equivalent.
  latestUrl.protocol = url.protocol;

  const currentUrlWwwPrefix = url.hostname.startsWith('www.');
  const latestUrlWwwPrefix = latestUrl.hostname.startsWith('www.');
  if (currentUrlWwwPrefix && !latestUrlWwwPrefix) {
    // Then if the current URL is a `www.` URL and the latest one isn't, prefix it
    // to the latest URL. This helps the manual bypass check.
    latestUrl.hostname = `www.${latestUrl.hostname}`;
  } else if (!currentUrlWwwPrefix && latestUrlWwwPrefix) {
    // Remove `www.` if the latestUrl starts with it but the current URL doesn't.
    latestUrl.hostname = latestUrl.hostname.slice(4);
  }

  // Manually bypass any redirects if the latest redirected and current URLs are
  // the same.
  if (redirectDelta < 30_000 && url.href === latestUrl.href) {
    return;
  }

  for (const redirect of await storage.getRedirects()) {
    if (!redirect.parameters.enabled) {
      continue;
    }

    if (redirect.isMatch(url)) {
      // Don't redirect if the URL before going to a new page is also a match.
      // This will happen when the user is already on a website that has a
      // redirect, but for whatever reason hasn't redirected. So it's safe to
      // assume that they want to stay on this website, rather than get
      // redirected.
      if (currentTabUrl !== undefined && redirect.isMatch(currentTabUrl)) {
        break;
      }

      let redirectedUrl = redirect.redirect(url);
      if (typeof redirectedUrl === 'string') {
        try {
          redirectedUrl = new URL(redirectedUrl);
        } catch {
          redirectedUrl = `https://${redirectedUrl as string}`;
          redirectedUrl = new URL(redirectedUrl);
        }
      }

      await browser.tabs.update(details.tabId, {url: redirectedUrl.href});
      await browser.storage.local.set({
        latestTime: Date.now(),
        latestUrl: url.href,
      });
      break;
    }
  }
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  const contextMenus = getContextMenus();
  const contextMenuIds = new Set<string>(
    contextMenus.map(({id}) => id ?? 're-nav-unknown'),
  );

  await contextClicked(contextMenuIds, info, tab);
});

browser.commands.onCommand.addListener(onCommandsHandler);

if (import.meta.env.VITE_BROWSER === 'chromium') {
  browser.action.onClicked.addListener(browserActionClicked);
} else {
  browser.browserAction.onClicked.addListener(browserActionClicked);
  void initializeContextMenus();
}
