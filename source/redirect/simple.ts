import {Redirect} from './base.js';

export class SimpleRedirect extends Redirect {
  public redirect(): string {
    return this.parameters.redirectValue;
  }
}
