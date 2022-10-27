import {Redirect, RedirectParameters} from '../redirect/base.js';

const examples: RedirectParameters[] = [
  {
    enabled: true,
    matcherType: 'hostname',
    matcherValue: 'twitter.com',
    redirectType: 'hostname',
    redirectValue: 'nitter.net',
  },
  {
    enabled: true,
    matcherType: 'hostname',
    matcherValue: 'reddit.com',
    redirectType: 'hostname',
    redirectValue: 'r.nf',
  },
  {
    enabled: true,
    matcherType: 'regex',
    matcherValue: '^https?://holllo\\.org/renav/?$',
    redirectType: 'simple',
    redirectValue: 'https://holllo.org/re-nav',
  },
];

export function generateExamples(): Record<string, RedirectParameters> {
  const storage: Record<string, RedirectParameters> = {};
  for (const example of examples) {
    const id = Redirect.generateId();
    storage[id] = example;
  }

  return storage;
}
