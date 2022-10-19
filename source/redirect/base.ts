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

export type Matcher = {
  matcherType: MatcherType;
  toMatch: string;
};

export type RedirectParameters = {
  redirectType: RedirectType;
};

export abstract class Redirect<P extends RedirectParameters> {
  constructor(public parameters: P & Matcher) {}

  public isMatch(url: URL): boolean {
    if (this.parameters.matcherType === 'hostname') {
      const hostname = url.hostname.startsWith('www.')
        ? url.hostname.slice(4)
        : url.hostname;
      return hostname === this.parameters.toMatch;
    }

    return false;
  }

  public abstract redirect(url: URL | string): URL;

  public abstract get redirectValue(): string;

  public abstract set redirectValue(value: string);
}
