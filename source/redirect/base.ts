import {HostnameParameters} from './hostname.js';

export type RedirectParameters = HostnameParameters;

export abstract class Redirect<P extends RedirectParameters> {
  constructor(public parameters: P) {}

  public abstract redirect(url: URL | string): URL;
}
