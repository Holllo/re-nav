import {ConfirmButton} from '@holllo/preact-components';
import {html} from 'htm/preact';
import {Component} from 'preact';
import browser from 'webextension-polyfill';

import {
  matcherTypes,
  narrowMatcherType,
  narrowRedirectType,
  parseRedirect,
  Redirects,
  RedirectParameters,
  redirectTypes,
} from '../../redirect/exports.js';

type Props = {
  id: string;
  redirect?: Redirects;
  removeRedirect: (id: string) => void;
  saveRedirect: (redirect: Redirects) => void;
};

type State = {
  id: string;
  redirectValue: string;
} & RedirectParameters;

export default class Editor extends Component<Props, State> {
  defaultParameters: RedirectParameters;

  constructor(props: Props) {
    super(props);

    this.defaultParameters = {
      enabled: true,
      matcherType: 'hostname',
      matcherValue: '',
      redirectType: 'simple',
      redirectValue: '',
    };

    this.state = {
      id: this.props.id,
      ...this.parametersFromProps(),
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

  parametersFromProps = (): RedirectParameters => {
    const redirect = this.props.redirect;
    const parameters = redirect?.parameters ?? {...this.defaultParameters};

    return {
      enabled: parameters.enabled,
      matcherType: parameters.matcherType,
      matcherValue: parameters.matcherValue,
      redirectType: parameters.redirectType,
      redirectValue: parameters.redirectValue,
    };
  };

  parseRedirect = (): Redirects => {
    const redirect = parseRedirect(this.state, this.props.id);
    if (redirect === undefined) {
      throw new Error('Failed to parse redirect');
    }

    return redirect;
  };

  prepareForStorage = (
    parameters: RedirectParameters,
  ): Record<string, RedirectParameters> => {
    const storage: Record<string, RedirectParameters> = {};
    storage[this.props.id] = parameters;
    return storage;
  };

  remove = async () => {
    await browser.storage.local.remove(this.props.id);
    this.props.removeRedirect(this.props.id);
  };

  save = async () => {
    const redirect = this.parseRedirect();
    await browser.storage.local.set(
      this.prepareForStorage(redirect.parameters),
    );
    this.props.saveRedirect(redirect);
  };

  toggleEnabled = async () => {
    const enabled = !this.state.enabled;
    const storage = this.prepareForStorage(this.parametersFromProps());
    storage[this.props.id].enabled = enabled;
    await browser.storage.local.set(storage);
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
