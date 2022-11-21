import browser from 'webextension-polyfill';

import {updateBadge} from './badge.js';

export async function toggleAllRedirects() {
  const state = await browser.storage.local.get({redirectsEnabled: true});
  const redirectsEnabled = !(state.redirectsEnabled as boolean);
  await browser.storage.local.set({redirectsEnabled});
  await updateBadge(redirectsEnabled);
}
