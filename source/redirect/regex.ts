import {Redirect} from './base.js';

export class RegexRedirect extends Redirect {
  public redirect(redirect: URL | string): URL {
    const url = redirect instanceof URL ? redirect.href : redirect;
    const regex = new RegExp(this.parameters.matcherValue, 'gi');
    return new URL(url.replace(regex, this.parameters.redirectValue));
  }
}
