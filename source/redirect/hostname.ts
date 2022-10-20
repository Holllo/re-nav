import {Redirect} from './base.js';

export class HostnameRedirect extends Redirect {
  public redirect(url: URL | string): URL {
    const redirected = new URL(url);
    redirected.hostname = this.parameters.redirectValue;
    return redirected;
  }
}
