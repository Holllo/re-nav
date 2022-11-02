import {html} from 'htm/preact';
import {Component} from 'preact';

export default class Usage extends Component {
  render() {
    return html`
      <details class="usage">
        <summary>How do I use Re-Nav?</summary>

        <p>Creating redirects:</p>
        <ul>
          <li>Click the green "Add new redirect" button.</li>
          <li>Select a matcher type and enter what it should match on.</li>
          <li>
            Select a redirect type and enter where you want to be redirected.
          </li>
          <li>
            See the "Matchers" and "Redirects" sections below for lists of
            everything available with examples.
          </li>
        </ul>

        <p>Using redirects:</p>
        <ul>
          <li>
            Any time you are navigated to a link by your browser, the URL will
            first be checked and you will be redirected automatically.
          </li>
        </ul>

        <p>Editing redirects:</p>
        <ul>
          <li>
            If a redirect has been edited, a yellow border will be shown around
            it.
          </li>
          <li>
            Changes to redirects are only saved when you click the save button.
          </li>
          <li>
            To enable or disable a redirect, click the button with the circle.
            If it's filled in the redirect is enabled.
          </li>
          <li>To remove a redirect click the red button with the ✗ twice.</li>
        </ul>

        <p>Some miscellaneous notes:</p>
        <ul>
          <li>Only URLs starting with "http" will be checked.</li>
          <li>
            Navigation events won't be checked if it has been less than 100
            milliseconds since the last successful redirect.
          </li>
          <li>
            A redirect will be cancelled if the exact same redirect happened
            less than 30 seconds ago. This acts as a quick bypass so you don't
            have to disable redirects in the options page whenever you don't
            want to be redirected.
          </li>
        </ul>

        <p>As a quick-start you can also insert the examples from below:</p>
        <ul>
          <li>
            Note that this will reload the page so make sure your redirects have
            been saved.
          </li>
          <li>
            <button class="button" onClick=${window.Holllo.insertExamples}>
              Insert Examples
            </button>
          </li>
        </ul>
      </details>

      <details class="usage table">
        <summary>Matchers</summary>

        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Match Directive</th>
              <th>Match Examples</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td class="bold center-text" rowspan="2">Hostname</td>
              <td class="center-text" rowspan="2">tildes.net</td>
              <td>http://<b>www.tildes.net</b>/<sup>1</sup></td>
            </tr>
            <tr>
              <td>https://<b>tildes.net</b>/~creative.timasomo</td>
            </tr>
            <tr class="alt">
              <td class="bold center-text" rowspan="3">Regex</td>
              <td class="center-text">HOL{3}O</td>
              <td>https://git.bauke.xyz/<b>holllo</b><sup>2</sup></td>
            </tr>
            <tr class="alt">
              <td class="center-text">^https?://www\\.holllo\\.org/?$</td>
              <td><b>https://www.holllo.org/</b></td>
            </tr>
            <tr>
              <td class="center-text">
                ${'^(?<base>https://holllo\\.org)/(?<one>1)-(?<two>2)$'}
              </td>
              <td><b>https://holllo.org/1-2</b></td>
            </tr>
          </tbody>
        </table>

        <ol class="footnotes">
          <li>
            Hostname matchers always remove "www." automatically, for
            convenience.
          </li>
          <li>
            Regular expressions are always tested with global and
            case-insensitive flags enabled.
          </li>
        </ol>
      </details>

      <details class="usage table">
        <summary>Redirects</summary>

        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Change To</th>
              <th>Example URL</th>
              <th>Redirected URL<sup>1</sup></th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td class="bold center-text" rowspan="2">Hostname</td>
              <td>nitter.net</td>
              <td>https://twitter.com/therealTDH</td>
              <td>https://<b>nitter.net</b>/therealTDH</td>
            </tr>
            <tr>
              <td>r.nf</td>
              <td>https://www.reddit.com/r/TheDearHunter</td>
              <td>https://<b>r.nf</b>/r/TheDearHunter</td>
            </tr>
            <tr class="alt">
              <td class="bold center-text">Simple</td>
              <td>https://holllo.org</td>
              <td>https://holllo.org/home</td>
              <td><b>https://holllo.org</b></td>
            </tr>
            <tr>
              <td class="bold center-text">Regex<sup>2</sup></td>
              <td>${'$<base>/$<two>-$<one>'}</td>
              <td>https://holllo.org/1-2</td>
              <td><b>https://holllo.org/2-1</b></td>
            </tr>
          </tbody>
        </table>

        <ol class="footnotes">
          <li>The bold highlighted text shows what will be changed.</li>
          <li>
            The regex redirect only works in combination with the regex matcher,
            as the regex matcher will be used for the capturing groups.
          </li>
        </ol>
      </details>
    `;
  }
}
