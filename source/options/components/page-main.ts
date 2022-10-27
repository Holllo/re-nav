import {html} from 'htm/preact';
import {Component} from 'preact';

import {Redirect, SimpleRedirect} from '../../redirect/exports.js';
import storage from '../../redirect/storage.js';

import Editor from './editor.js';
import Usage from './usage.js';

type Props = Record<string, unknown>;

type State = {
  redirects: Redirect[];
};

export class PageMain extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      redirects: [],
    };
  }

  async componentDidMount() {
    const redirects = await storage.getRedirects();

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

  addNewRedirect = async () => {
    const redirect = new SimpleRedirect({
      enabled: true,
      id: await storage.nextRedirectId(),
      matcherType: 'hostname',
      matcherValue: 'example.com',
      redirectType: 'simple',
      redirectValue: 'example.org',
    });
    await storage.savePrepared(await storage.prepareForStorage(redirect));
    this.setState({
      redirects: [redirect, ...this.state.redirects],
    });
  };

  removeRedirect = (id: number) => {
    this.setState({
      redirects: this.state.redirects.filter(
        (redirect) => redirect.parameters.id !== id,
      ),
    });
  };

  saveRedirect = (redirect: Redirect) => {
    const redirectIndex = this.state.redirects.findIndex(
      (found) => found.parameters.id === redirect.parameters.id,
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
            key=${redirect.idString()}
            redirect=${redirect}
            removeRedirect=${this.removeRedirect}
            saveRedirect=${this.saveRedirect}
          />
        `,
    );

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
