import {toggleAllRedirects} from '../utilities/toggle-all-redirects.js';

export async function onCommandsHandler(command: string): Promise<void> {
  if (command === 'toggleAllRedirects') {
    await toggleAllRedirects();
  }
}
