import {Redirect} from './base.js';

export type HostnameParameters = {
  hostname: string;
  type: 'hostname';
};

export class HostnameRedirect extends Redirect<HostnameParameters> {
  public redirect(url: URL | string): URL {
    const redirected = new URL(url);
    redirected.hostname = this.parameters.hostname;
    return redirected;
  }

  public get redirectValue(): string {
    return this.parameters.hostname;
  }

  public set redirectValue(value: string) {
    this.parameters.hostname = value;
  }
}
