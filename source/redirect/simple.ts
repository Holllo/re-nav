import {Redirect} from './base.js';

export class SimpleRedirect extends Redirect {
  public redirect(): URL {
    return new URL(this.parameters.redirectValue);
  }
}
