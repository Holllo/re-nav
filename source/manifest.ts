/* eslint-disable @typescript-eslint/naming-convention */

export default function createManifest(
  target: string,
): Record<string, unknown> {
  const manifest: Record<string, unknown> = {
    name: 're-nav',
    description: 'Navigation redirects for the masses.',
    version: '0.1.0',
    permissions: ['storage', 'webNavigation'],
    options_ui: {
      page: 'options/index.html',
      open_in_tab: true,
    },
  };

  const icons = {
    128: 'assets/re-nav.png',
  };

  manifest.icons = icons;

  const browserAction = {
    default_icon: icons,
  };

  const backgroundScript = 'background-scripts/initialize.ts';

  if (target === 'chromium') {
    manifest.manifest_version = 3;
    manifest.action = browserAction;
    manifest.background = {
      service_worker: backgroundScript,
      type: 'module',
    };
  } else {
    manifest.manifest_version = 2;
    manifest.browser_action = browserAction;
    manifest.background = {
      scripts: [backgroundScript],
    };
  }

  return manifest;
}