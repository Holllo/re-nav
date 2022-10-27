import {html} from 'htm/preact';
import {Component} from 'preact';
import browser from 'webextension-polyfill';

import {
  parseRedirect,
  Redirect,
  Redirects,
  SimpleRedirect,
} from '../../redirect/exports.js';

import Editor from './editor.js';
import Usage from './usage.js';

type Props = Record<string, unknown>;

type State = {
  redirects: Redirects[];
};

export class PageMain extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      redirects: [],
    };
  }

  async componentDidMount() {
    const redirects: Redirects[] = [];
    for (const [id, parameters] of Object.entries(
      await browser.storage.local.get(),
    )) {
      const redirect = parseRedirect(parameters, id);
      if (redirect === undefined) {
        continue;
      }

      redirects.push(redirect);
    }

    // Sort the redirects by:
    // * Matcher Type
    // * then Matcher Value
    // * then Redirect Type
    // * finally Redirect Value
    redirects.sort((a, b) => {
      const {
        matcherType: mTypeA,
        matcherValue: mValueA,
        redirectType: rTypeA,
        redirectValue: rValueA,
      } = a.parameters;
      const {
        matcherType: mTypeB,
        matcherValue: mValueB,
        redirectType: rTypeB,
        redirectValue: rValueB,
      } = b.parameters;

      if (mTypeA !== mTypeB) {
        return mTypeA.localeCompare(mTypeB);
      }

      if (mValueA !== mValueB) {
        return mValueA.localeCompare(mValueB);
      }

      if (rTypeA !== rTypeB) {
        return rTypeA.localeCompare(rTypeB);
      }

      return rValueA.localeCompare(rValueB);
    });
    this.setState({redirects});
  }

  addNewRedirect = () => {
    this.setState({
      redirects: [
        new SimpleRedirect({
          enabled: true,
          matcherType: 'hostname',
          matcherValue: 'example.com',
          redirectType: 'simple',
          redirectValue: 'example.org',
        }),
        ...this.state.redirects,
      ],
    });
  };

  removeRedirect = (id: string) => {
    this.setState({
      redirects: this.state.redirects.filter((redirect) => redirect.id !== id),
    });
  };

  saveRedirect = (redirect: Redirects) => {
    const redirectIndex = this.state.redirects.findIndex(
      (found) => found.id === redirect.id,
    );
    if (redirectIndex === -1) {
      this.setState({
        redirects: [redirect, ...this.state.redirects],
      });
    } else {
      const redirects = [...this.state.redirects];
      redirects[redirectIndex] = redirect;
      this.setState({redirects});
    }
  };

  render() {
    const editors = this.state.redirects.map(
      (redirect) =>
        html`
          <${Editor}
            key=${redirect.id}
            id=${redirect.id}
            redirect=${redirect}
            removeRedirect=${this.removeRedirect}
            saveRedirect=${this.saveRedirect}
          />
        `,
    );

    if (editors.length === 0) {
      this.addNewRedirect();
    }

    return html`
      <main class="page-main">
        <div class="editors">
          <button class="button new-redirect" onClick=${this.addNewRedirect}>
            Add New Redirect
          </button>

          ${editors}
        </div>
        <${Usage} />
      </main>
    `;
  }
}
