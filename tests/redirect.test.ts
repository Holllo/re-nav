/// <reference path="../source/types.d.ts" />

import test from 'ava';

import {
  matcherTypes,
  narrowMatchType,
  narrowRedirectType,
  parseRedirect,
  redirectTypes,
  HostnameRedirect,
  Redirect,
  Redirects,
  RedirectParameters,
  SimpleRedirect,
} from '../source/redirect/exports.js';

const hostnameParameters: HostnameRedirect['parameters'] = {
  hostname: 'example.org',
  matcherType: 'hostname',
  toMatch: 'example.com',
  redirectType: 'hostname',
};

const simpleParameters: SimpleRedirect['parameters'] = {
  matcherType: 'hostname',
  target: 'https://example.org/simple',
  toMatch: 'example.com',
  redirectType: 'simple',
};

test('parseRedirect', (t) => {
  const samples: Array<Redirects['parameters']> = [
    {
      test: 'Invalid parameters',
    } as unknown as Redirects['parameters'],
    undefined as unknown as Redirects['parameters'],
    hostnameParameters,
    simpleParameters,
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
  const hostnameRedirect = new HostnameRedirect(hostnameParameters);
  const simpleRedirect = new SimpleRedirect(simpleParameters);

  const samples: Array<[string, Redirect<RedirectParameters>]> = [
    ['https://example.com', hostnameRedirect],
    ['https://example.com/path#hash?query=test', hostnameRedirect],
    ['https://example.com', simpleRedirect],
    ['https://example.com/path', simpleRedirect],
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

  const hostnameRedirect = new HostnameRedirect(hostnameParameters);
  const hostnameSamples: UrlSamples = [
    ['https://example.com', true],
    ['https://www.example.com', true],
    ['https://example.org', false],
  ];

  const invalidRedirect = new HostnameRedirect({
    test: 'invalid',
  } as unknown as HostnameRedirect['parameters']);

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

test('Narrow match & redirect types', (t) => {
  t.false(narrowMatchType('invalid'));
  t.false(narrowRedirectType('invalid'));
  t.true(matcherTypes.every((value) => narrowMatchType(value)));
  t.true(redirectTypes.every((value) => narrowRedirectType(value)));
});
