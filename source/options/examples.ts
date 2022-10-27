import browser from 'webextension-polyfill';

import {RedirectParameters} from '../redirect/base.js';
import storage from '../redirect/storage.js';

const examples: RedirectParameters[] = [
  {
    enabled: true,
    id: -1,
    matcherType: 'hostname',
    matcherValue: 'twitter.com',
    redirectType: 'hostname',
    redirectValue: 'nitter.net',
  },
  {
    enabled: true,
    id: -1,
    matcherType: 'hostname',
    matcherValue: 'reddit.com',
    redirectType: 'hostname',
    redirectValue: 'r.nf',
  },
  {
    enabled: true,
    id: -1,
    matcherType: 'regex',
    matcherValue: '^https?://holllo\\.org/renav/?$',
    redirectType: 'simple',
    redirectValue: 'https://holllo.org/re-nav',
  },
];

export async function generateExamples(): Promise<
  Record<string, RedirectParameters>
> {
  const prepared: Record<string, RedirectParameters> = {};
  let nextId = await storage.nextRedirectId();
  for (const example of examples) {
    example.id = nextId;
    prepared[`redirect:${nextId}`] = example;
    nextId += 1;
  }

  await browser.storage.local.set({latestId: nextId - 1});
  return prepared;
}
