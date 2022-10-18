import {Redirect} from './base.js';

export type SimpleParameters = {
  target: string;
  redirectType: 'simple';
};

export class SimpleRedirect extends Redirect<SimpleParameters> {
  public redirect(): URL {
    return new URL(this.parameters.target);
  }

  public get redirectValue(): string {
    return this.parameters.target;
  }

  public set redirectValue(value: string) {
    this.parameters.target = value;
  }
}
