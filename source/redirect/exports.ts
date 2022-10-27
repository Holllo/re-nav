import {RedirectParameters} from './base.js';
import {HostnameRedirect} from './hostname.js';
import {SimpleRedirect} from './simple.js';

export * from './base.js';
export * from './hostname.js';
export * from './simple.js';

export type Redirects = HostnameRedirect | SimpleRedirect;

export function parseRedirect(
  parameters: RedirectParameters,
): Redirects | undefined {
  const redirectType = parameters?.redirectType;

  if (redirectType === 'hostname') {
    return new HostnameRedirect(parameters);
  }

  if (redirectType === 'simple') {
    return new SimpleRedirect(parameters);
  }
}
