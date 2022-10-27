import browser from 'webextension-polyfill';

import {Redirect, RedirectParameters} from './base.js';
import {parseRedirect} from './exports.js';

const redirectKeyRegex = /^redirect:\d+$/i;

async function getRedirects(): Promise<Redirect[]> {
  const redirects: Redirect[] = [];
  const stored = await browser.storage.local.get();
  for (const [key, value] of Object.entries(stored)) {
    if (!redirectKeyRegex.test(key)) {
      continue;
    }

    const redirect = parseRedirect(value);
    if (redirect !== undefined) {
      redirects.push(redirect);
    }
  }

  return redirects;
}

async function nextRedirectId(): Promise<number> {
  const {latestId} = await browser.storage.local.get('latestId');
  const id = Number(latestId);

  let nextId: number | undefined;
  if (Number.isNaN(id)) {
    const redirects = await getRedirects();
    nextId = redirects.length + 1;
  } else {
    nextId = id + 1;
  }

  await browser.storage.local.set({latestId: nextId});
  return nextId;
}

async function prepareForStorage(
  redirect: Redirect,
): Promise<Record<string, RedirectParameters>> {
  const prepared: Record<string, RedirectParameters> = {};
  prepared[redirect.idString()] = redirect.parameters;
  return prepared;
}

async function save(redirect: Redirect): Promise<void> {
  await savePrepared(await prepareForStorage(redirect));
}

async function savePrepared(
  prepared: Record<string, RedirectParameters>,
): Promise<void> {
  await browser.storage.local.set(prepared);
}

const storage = {
  getRedirects,
  nextRedirectId,
  prepareForStorage,
  redirectKeyRegex,
  save,
  savePrepared,
};

export default storage;
