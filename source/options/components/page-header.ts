import {html} from 'htm/preact';
import {Component} from 'preact';

export class PageHeader extends Component {
  render() {
    return html`
      <header class="page-header">
        <h1>
          <img alt="Re-Nav Logo" src="/assets/re-nav.png" />
          Re-Nav
        </h1>
      </header>
    `;
  }
}
