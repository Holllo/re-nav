import {PrivacyLink} from '@holllo/preact-components';
import {html} from 'htm/preact';
import {Component} from 'preact';
import browser from 'webextension-polyfill';

export class PageFooter extends Component {
  render() {
    const manifest = browser.runtime.getManifest();
    const version = manifest.version;

    const donateAttributes = {
      href: 'https://liberapay.com/Holllo',
    };
    const donateLink = html`
      <${PrivacyLink} attributes="${donateAttributes}">Donate<//>
    `;

    const versionLinkAttributes = {
      href: `https://git.bauke.xyz/Holllo/re-nav/releases/tag/${version}`,
    };
    const versionLink = html`
      <${PrivacyLink} attributes=${versionLinkAttributes}>v${version}<//>
    `;

    return html`
      <footer class="page-footer">
        <p>
          ${donateLink} 💖 ${versionLink} © Holllo — Free and open-source,
          forever.
        </p>
      </footer>
    `;
  }
}
