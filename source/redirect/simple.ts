import {Redirect} from './base.js';

export type SimpleParameters = {
  target: string;
  type: 'simple';
};

export class SimpleRedirect extends Redirect<SimpleParameters> {
  public redirect(): URL {
    return new URL(this.parameters.target);
  }
}
