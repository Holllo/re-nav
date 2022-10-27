/// <reference path="../source/types.d.ts" />

import test from 'ava';

import {
  matcherTypes,
  narrowMatcherType,
  narrowRedirectType,
  parseRedirect,
  redirectTypes,
  HostnameRedirect,
  Redirect,
  Redirects,
  RedirectParameters,
  SimpleRedirect,
} from '../source/redirect/exports.js';

const hostnameParameters: RedirectParameters = {
  enabled: true,
  id: 1,
  matcherType: 'hostname',
  matcherValue: 'example.com',
  redirectType: 'hostname',
  redirectValue: 'example.org',
};

const simpleParameters: RedirectParameters = {
  enabled: true,
  id: 2,
  matcherType: 'hostname',
  matcherValue: 'example.com',
  redirectType: 'simple',
  redirectValue: 'https://example.org/simple',
};

test('parseRedirect', (t) => {
  const samples: RedirectParameters[] = [
    {
      test: 'Invalid parameters',
    } as unknown as RedirectParameters,
    undefined as unknown as RedirectParameters,
    hostnameParameters,
    simpleParameters,
  ];

  for (const sample of samples) {
    const redirect = parseRedirect(sample);

    if (redirect === undefined) {
      t.pass('parseRedirect returned undefined');
    } else {
      t.regex(redirect?.idString(), /^redirect:\d+$/i);
      t.snapshot(redirect, `Class ${redirect.constructor.name}`);
    }
  }
});

test('Redirect.redirect', (t) => {
  const hostnameRedirect = new HostnameRedirect(hostnameParameters);
  const simpleRedirect = new SimpleRedirect(simpleParameters);

  const samples: Array<[string, Redirect]> = [
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

  const regexMatch = new HostnameRedirect({
    enabled: true,
    id: 3,
    matcherType: 'regex',
    matcherValue: String.raw`^https://(www\.)?example.org/$`,
    redirectType: 'simple',
    redirectValue: '',
  });
  const regexSamples: UrlSamples = [
    ['https://example.org', true],
    ['https://www.example.org', true],
    ['https://example.org/path', false],
  ];

  const samples: Array<[Redirects, UrlSamples]> = [
    [invalidRedirect, [['https://example.org', false]]],
    [hostnameRedirect, hostnameSamples],
    [regexMatch, regexSamples],
  ];

  for (const [redirect, urlSamples] of samples) {
    for (const [sample, expected] of urlSamples) {
      t.is(redirect.isMatch(new URL(sample)), expected, `Sample ${sample}`);
    }
  }
});

test('Narrow match & redirect types', (t) => {
  t.false(narrowMatcherType('invalid'));
  t.false(narrowRedirectType('invalid'));
  t.true(matcherTypes.every((value) => narrowMatcherType(value)));
  t.true(redirectTypes.every((value) => narrowRedirectType(value)));
});
