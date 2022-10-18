import {HostnameParameters} from './hostname.js';
import {SimpleParameters} from './simple.js';

export type RedirectParameters = HostnameParameters | SimpleParameters;

export type Matcher = {
  matchType: 'hostname';
  toMatch: string;
};

export abstract class Redirect<P extends RedirectParameters> {
  constructor(public parameters: P & Matcher) {}

  public isMatch(url: URL): boolean {
    if (this.parameters.matchType === 'hostname') {
      return url.hostname === this.parameters.toMatch;
    }

    return false;
  }

  public abstract redirect(url: URL | string): URL;
}
