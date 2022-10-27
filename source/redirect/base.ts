export const matcherTypes = ['hostname', 'regex'] as const;
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
  enabled: boolean;
  id: number;
  matcherType: MatcherType;
  matcherValue: string;
  redirectType: RedirectType;
  redirectValue: string;
};

export abstract class Redirect {
  public static idString(id: number): string {
    return `redirect:${id}`;
  }

  constructor(public parameters: RedirectParameters) {}

  public idString(): string {
    return Redirect.idString(this.parameters.id);
  }

  public isMatch(url: URL): boolean {
    if (this.parameters.matcherType === 'hostname') {
      const hostname = url.hostname.startsWith('www.')
        ? url.hostname.slice(4)
        : url.hostname;
      return hostname === this.parameters.matcherValue;
    }

    if (this.parameters.matcherType === 'regex') {
      const regex = new RegExp(this.parameters.matcherValue, 'gi');
      return regex.test(url.href);
    }

    return false;
  }

  public abstract redirect(url: URL | string): URL;
}
