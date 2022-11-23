import {Base64} from 'js-base64';

import {RedirectParameters} from '../redirect/exports.js';

export const fragmentPrefix = '#json=';

export function decodeBase64<T>(base64: string): T {
  return JSON.parse(Base64.decode(base64)) as T;
}

export function encodeBase64(source: any): string {
  return Base64.encode(JSON.stringify(source), true);
}

export function share(redirect: RedirectParameters): string {
  const url = new URL('https://holllo.org/re-nav/share/');

  const encoded = encodeBase64({
    matcherType: redirect.matcherType,
    matcherValue: redirect.matcherValue,
    redirectType: redirect.redirectType,
    redirectValue: redirect.redirectValue,
  });

  url.hash = `${fragmentPrefix}${encoded}`;

  return url.href;
}
