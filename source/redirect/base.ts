export const matcherTypes = ['hostname'] as const;
export const redirectTypes = ['hostname', 'simple'] as const;

export type MatcherType = typeof matcherTypes[number];
export type RedirectType = typeof redirectTypes[number];

export function narrowMatchType(type: string): type is MatcherType {
  return matcherTypes.includes(type as MatcherType);
}

export function narrowRedirectType(type: string): type is RedirectType {
  return redirectTypes.includes(type as RedirectType);
}

export type Matcher = {
  matcherType: MatcherType;
  toMatch: string;
};

export type RedirectParameters = {
  type: RedirectType;
};

export abstract class Redirect<P extends RedirectParameters> {
  constructor(public parameters: P & Matcher) {}

  public isMatch(url: URL): boolean {
    if (this.parameters.matcherType === 'hostname') {
      return url.hostname === this.parameters.toMatch;
    }

    return false;
  }

  public abstract redirect(url: URL | string): URL;

  public abstract get redirectValue(): string;

  public abstract set redirectValue(value: string);
}
