import './style.scss';

import browser from 'webextension-polyfill';
import {Component, render} from 'preact';
import {html} from 'htm/preact';

import {decodeBase64, fragmentPrefix} from '../../utilities/share-redirect.js';
import {
  RedirectParameters,
  parseRedirect,
  narrowMatcherType,
  narrowRedirectType,
} from '../../redirect/exports.js';
import storage from '../../redirect/storage.js';

type Props = Record<string, unknown>;

type State = {
  error: string | undefined;
  imported: boolean;
};

class ImportButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      error: undefined,
      imported: false,
    };
  }

  importRedirect = async () => {
    const decoded = decodeBase64<RedirectParameters>(
      location.hash.slice(fragmentPrefix.length),
    );

    const invalidRedirectError = "This isn't a valid redirect. ☹️";

    if (
      !narrowMatcherType(decoded.matcherType) ||
      !narrowRedirectType(decoded.redirectType) ||
      typeof decoded.matcherValue !== 'string' ||
      typeof decoded.redirectValue !== 'string'
    ) {
      this.setState({error: invalidRedirectError});
      return;
    }

    const redirect = parseRedirect({
      id: -1,
      enabled: true,
      matcherType: decoded.matcherType,
      matcherValue: decoded.matcherValue,
      redirectType: decoded.redirectType,
      redirectValue: decoded.redirectValue,
    });
    if (redirect === undefined) {
      this.setState({error: invalidRedirectError});
      return;
    }

    const id = await storage.nextRedirectId();
    redirect.parameters.id = id;
    await storage.save(redirect);

    this.setState({imported: true});
  };

  render() {
    const {error, imported} = this.state;

    if (error !== undefined) {
      return html`<p>${error}</p>`;
    }

    if (imported) {
      return html`
        <p class="import-success">The redirect has been imported!</p>
      `;
    }

    return html`
      <button class="import-button" onClick=${this.importRedirect}>
        Import
      </button>
    `;
  }
}

function main() {
  if (!location.hash.startsWith(fragmentPrefix)) {
    return;
  }

  const importRoot = document.querySelector('.re-nav-import')!;
  for (const child of Array.from(importRoot.children)) {
    child.remove();
  }

  render(html`<${ImportButton} />`, importRoot);
}

main();
