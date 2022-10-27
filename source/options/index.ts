import {html} from 'htm/preact';
import {Component, render} from 'preact';

import storage from '../redirect/storage.js';
import {PageFooter} from './components/page-footer.js';
import {PageHeader} from './components/page-header.js';
import {PageMain} from './components/page-main.js';
import {generateExamples} from './examples.js';

window.addEventListener('DOMContentLoaded', () => {
  window.Holllo = {
    async insertExamples() {
      await storage.savePrepared(await generateExamples());
      location.reload();
    },
  };

  render(html`<${OptionsPage} />`, document.body);
});

class OptionsPage extends Component {
  render() {
    return html`
      <${PageHeader} />
      <${PageMain} />
      <${PageFooter} />
    `;
  }
}
