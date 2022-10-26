import browser from 'webextension-polyfill';

import {parseRedirect} from '../redirect/exports.js';

async function browserActionClicked() {
  await browser.runtime.openOptionsPage();
}

if (import.meta.env.VITE_BROWSER === 'chromium') {
  browser.action.onClicked.addListener(browserActionClicked);
} else {
  browser.browserAction.onClicked.addListener(browserActionClicked);
}

browser.runtime.onInstalled.addListener(async () => {
  if (import.meta.env.DEV) {
    await browser.runtime.openOptionsPage();
  }
});

browser.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (!details.url.startsWith('http')) {
    return;
  }

  const {latestTime} = await browser.storage.local.get('latestTime');
  const redirectDelta = Date.now() - (latestTime ?? 0);
  if (redirectDelta < 100) {
    return;
  }

  const url = new URL(details.url);
  const {latestUrl} = await browser.storage.local.get('latestUrl');
  if (redirectDelta < 30_000 && url.href === latestUrl) {
    return;
  }

  for (const [id, parameters] of Object.entries(
    await browser.storage.local.get(),
  )) {
    const redirect = parseRedirect(parameters, id);
    if (redirect === undefined || !redirect.parameters.enabled) {
      continue;
    }

    if (redirect.isMatch(url)) {
      const redirectedUrl = redirect.redirect(url);
      await browser.tabs.update({url: redirectedUrl.href});
      await browser.storage.local.set({
        latestTime: Date.now(),
        latestUrl: url.href,
      });
      break;
    }
  }
});
