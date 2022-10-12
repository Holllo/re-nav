import {HostnameRedirect} from './hostname.js';

export * from './base.js';
export * from './hostname.js';

export type Redirects = HostnameRedirect;

export function parseRedirect<P extends Redirects['parameters']>(
  parameters: P,
): Redirects | undefined {
  if (parameters.type === 'hostname') {
    return new HostnameRedirect(parameters);
  }
}
