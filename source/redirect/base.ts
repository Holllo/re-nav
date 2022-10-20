import {customAlphabet} from 'nanoid';

export const matcherTypes = ['hostname'] as const;
export const redirectTypes = ['hostname', 'simple'] as const;

export type MatcherType = typeof matcherTypes[number];
export type RedirectType = typeof redirectTypes[number];

export function narrowMatcherType(value: string): value is MatcherType {
  return matcherTypes.includes(value as MatcherType);
}

export function narrowRedirectType(value: string): value is RedirectType {
  return redirectTypes.includes(value as RedirectType);
}

export type RedirectParameters = {
  matcherType: MatcherType;
  matcherValue: string;
  redirectType: RedirectType;
  redirectValue: string;
};

export abstract class Redirect {
  public static generateId(): string {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const nanoid = customAlphabet(`${alphabet}${alphabet.toUpperCase()}`, 20);
    return nanoid();
  }

  public id: string;

  constructor(public parameters: RedirectParameters, id?: string) {
    this.id = id ?? Redirect.generateId();
  }

  public isMatch(url: URL): boolean {
    if (this.parameters.matcherType === 'hostname') {
      const hostname = url.hostname.startsWith('www.')
        ? url.hostname.slice(4)
        : url.hostname;
      return hostname === this.parameters.matcherValue;
    }

    return false;
  }

  public abstract redirect(url: URL | string): URL;
}
