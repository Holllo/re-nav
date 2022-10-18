import {HostnameRedirect} from './hostname.js';
import {SimpleRedirect} from './simple.js';

export * from './base.js';
export * from './hostname.js';
export * from './simple.js';

export type Redirects = HostnameRedirect | SimpleRedirect;

export function parseRedirect<P extends Redirects['parameters']>(
  parameters: P,
): Redirects | undefined {
  if (parameters?.type === 'hostname') {
    return new HostnameRedirect(parameters);
  }
}
