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
  const url = new URL(details.url);

  for (const parameters of Object.values(await browser.storage.local.get())) {
    const redirect = parseRedirect(parameters);
    if (redirect === undefined) {
      continue;
    }

    if (redirect.isMatch(url)) {
      const redirectedUrl = redirect.redirect(url);
      await browser.tabs.update({url: redirectedUrl.href});
      break;
    }
  }
});
