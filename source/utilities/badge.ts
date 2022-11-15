import browser from 'webextension-polyfill';

export async function updateBadge(redirectsEnabled?: boolean): Promise<void> {
  if (redirectsEnabled === undefined) {
    const state = await browser.storage.local.get({redirectsEnabled: true});
    redirectsEnabled = state.redirectsEnabled as boolean;
  }

  let action: browser.Action.Static = browser.browserAction;
  if (import.meta.env.VITE_BROWSER === 'chromium') {
    action = browser.action;
  }

  await action.setBadgeText({
    text: redirectsEnabled ? '' : '✗',
  });

  await action.setBadgeBackgroundColor({
    color: '#f99fb1',
  });

  if (import.meta.env.VITE_BROWSER === 'firefox') {
    action.setBadgeTextColor({color: '#2a2041'});
  }
}
