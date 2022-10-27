import {ConfirmButton} from '@holllo/preact-components';
import {html} from 'htm/preact';
import {Component} from 'preact';
import browser from 'webextension-polyfill';

import {
  matcherTypes,
  narrowMatcherType,
  narrowRedirectType,
  parseRedirect,
  Redirect,
  RedirectParameters,
  redirectTypes,
} from '../../redirect/exports.js';
import storage from '../../redirect/storage.js';

type Props = {
  redirect: Redirect;
  removeRedirect: (id: number) => void;
  saveRedirect: (redirect: Redirect) => void;
};

type State = RedirectParameters;

export default class Editor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      ...props.redirect.parameters,
    };
  }

  onInput = (event: Event, input: 'matcher' | 'redirect') => {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (input === 'matcher') {
      this.setState({matcherValue: value});
    } else if (input === 'redirect') {
      this.setState({redirectValue: value});
    } else {
      throw new Error(`Unexpected input changed: ${input as string}`);
    }
  };

  onSelectChange = (event: Event, select: 'matcher' | 'redirect') => {
    const target = event.target as HTMLSelectElement;
    const value = target.value;

    if (select === 'matcher' && narrowMatcherType(value)) {
      this.setState({matcherType: value});
    } else if (select === 'redirect' && narrowRedirectType(value)) {
      this.setState({redirectType: value});
    } else {
      throw new Error(`${value} is not a valid MatcherType or RedirectType`);
    }
  };

  onMatcherInput = (event: Event) => {
    this.onInput(event, 'matcher');
  };

  onMatcherTypeChange = (event: Event) => {
    this.onSelectChange(event, 'matcher');
  };

  onRedirectInput = (event: Event) => {
    this.onInput(event, 'redirect');
  };

  onRedirectTypeChange = (event: Event) => {
    this.onSelectChange(event, 'redirect');
  };

  parseRedirect = (): Redirect => {
    const redirect = parseRedirect(this.state);
    if (redirect === undefined) {
      throw new Error('Failed to parse redirect');
    }

    return redirect;
  };

  remove = async () => {
    const redirect = this.props.redirect;
    await browser.storage.local.remove(redirect.idString());
    this.props.removeRedirect(redirect.parameters.id);
  };

  save = async () => {
    const redirect = this.parseRedirect();
    await storage.save(redirect);
    this.props.saveRedirect(redirect);
  };

  toggleEnabled = async () => {
    const enabled = !this.state.enabled;
    const redirect = this.props.redirect;
    const prepared = await storage.prepareForStorage(redirect);
    prepared[redirect.idString()].enabled = enabled;
    await browser.storage.local.set(prepared);
    this.setState({enabled});
  };

  render() {
    const {enabled, matcherType, matcherValue, redirectType, redirectValue} =
      this.state;

    const matcherTypeOptions = matcherTypes.map(
      (value) => html`<option value=${value}>${value}</option>`,
    );
    const redirectTypeOptions = redirectTypes.map(
      (value) => html`<option value=${value}>${value}</option>`,
    );

    return html`
      <div class="editor">
        <select
          class="select"
          id="matcher-type"
          title="Matcher Type"
          value=${matcherType}
          onChange=${this.onMatcherTypeChange}
        >
          ${matcherTypeOptions}
        </select>

        <input
          class="input"
          id="matcher-value"
          onInput=${this.onMatcherInput}
          placeholder="Matcher Value"
          title="Matcher Value"
          value=${matcherValue}
        />

        <span class="arrow-span">→</span>

        <select
          class="select"
          id="redirect-type"
          title="Redirect Type"
          value=${redirectType}
          onChange=${this.onRedirectTypeChange}
        >
          ${redirectTypeOptions}
        </select>

        <input
          class="input"
          id="redirect-value"
          onInput=${this.onRedirectInput}
          placeholder="Redirect Value"
          title="Redirect Value"
          value=${redirectValue}
        />

        <${ConfirmButton}
          attributes=${{title: 'Remove Redirect'}}
          class="button destructive"
          click=${this.remove}
          confirmClass="confirm"
          confirmText="✓"
          text="✗"
          timeout=${5 * 1000}
        />
        <button class="button" title="Save Redirect" onClick=${this.save}>
          💾
        </button>
        <button
          class="button ${enabled ? 'enabled' : 'disabled'}"
          title="${enabled ? 'Currently Enabled' : 'Currently Disabled'}"
          onClick=${this.toggleEnabled}
        >
          ${enabled ? '●' : '○'}
        </button>
      </div>
    `;
  }
}
