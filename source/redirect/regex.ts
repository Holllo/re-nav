import {Redirect} from './base.js';

export class RegexRedirect extends Redirect {
  public redirect(redirect: URL | string): string {
    const url = redirect instanceof URL ? redirect.href : redirect;
    const regex = new RegExp(this.parameters.matcherValue, 'gi');
    return url.replace(regex, this.parameters.redirectValue);
  }
}
