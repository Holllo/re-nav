import {RedirectParameters} from './base.js';
import {HostnameRedirect} from './hostname.js';
import {RegexRedirect} from './regex.js';
import {SimpleRedirect} from './simple.js';

export * from './base.js';
export * from './hostname.js';
export * from './regex.js';
export * from './simple.js';

export type Redirects = HostnameRedirect | RegexRedirect | SimpleRedirect;

export function parseRedirect(
  parameters: RedirectParameters,
): Redirects | undefined {
  const matcherType = parameters?.matcherType;
  const redirectType = parameters?.redirectType;

  if (redirectType === 'hostname') {
    return new HostnameRedirect(parameters);
  }

  if (redirectType === 'simple') {
    return new SimpleRedirect(parameters);
  }

  if (matcherType === 'regex' && redirectType === 'regex') {
    return new RegexRedirect(parameters);
  }
}
