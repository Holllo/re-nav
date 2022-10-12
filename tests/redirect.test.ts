/// <reference path="../source/types.d.ts" />

import test from 'ava';

import {
  parseRedirect,
  HostnameRedirect,
  Redirect,
  Redirects,
  RedirectParameters,
} from '../source/redirect/exports.js';

test('parseRedirect', (t) => {
  const samples: Array<Redirects['parameters']> = [
    {
      test: 'Invalid parameters',
    } as unknown as Redirects['parameters'],
    {
      hostname: 'example.org',
      matchType: 'hostname',
      toMatch: 'example.com',
      type: 'hostname',
    },
  ];

  for (const sample of samples) {
    const redirect = parseRedirect(sample);

    if (redirect === undefined) {
      t.pass('parseRedirect returned undefined');
    } else {
      t.snapshot(redirect, `Class ${redirect.constructor.name}`);
    }
  }
});

test('Redirect.redirect', (t) => {
  const hostnameRedirect = new HostnameRedirect({
    matchType: 'hostname',
    toMatch: 'example.com',
    hostname: 'example.org',
    type: 'hostname',
  });

  const samples: Array<[string, Redirect<RedirectParameters>]> = [
    ['https://example.com', hostnameRedirect],
    ['https://example.com/path#hash?query=test', hostnameRedirect],
  ];

  for (const [index, [url, redirect]] of samples.entries()) {
    t.snapshot(
      {
        original: url,
        redirected: redirect.redirect(url).href,
      },
      `${index} ${redirect.constructor.name}`,
    );
  }
});

test('Redirect.isMatch', (t) => {
  type UrlSamples = Array<[string, boolean]>;

  const hostnameRedirect = new HostnameRedirect({
    hostname: 'example.org',
    matchType: 'hostname',
    toMatch: 'example.com',
    type: 'hostname',
  });

  const hostnameSamples: UrlSamples = [
    ['https://example.com', true],
    ['https://www.example.com', false],
    ['https://example.org', false],
  ];

  const invalidRedirect = new HostnameRedirect({
    test: 'invalid',
  } as unknown as Redirects['parameters']);

  const samples: Array<[Redirects, UrlSamples]> = [
    [invalidRedirect, [['https://example.org', false]]],
    [hostnameRedirect, hostnameSamples],
  ];

  for (const [redirect, urlSamples] of samples) {
    for (const [sample, expected] of urlSamples) {
      t.is(redirect.isMatch(new URL(sample)), expected);
    }
  }
});
