import {HostnameRedirect} from './hostname.js';
import {SimpleRedirect} from './simple.js';

export * from './base.js';
export * from './hostname.js';
export * from './simple.js';

export type Redirects = HostnameRedirect | SimpleRedirect;

export function parseRedirect<P extends Redirects['parameters']>(
  parameters: P,
  id: string,
): Redirects | undefined {
  const redirectType = parameters?.redirectType;

  if (redirectType === 'hostname') {
    return new HostnameRedirect(parameters, id);
  }

  if (redirectType === 'simple') {
    return new SimpleRedirect(parameters, id);
  }
}
