/* eslint-disable @typescript-eslint/naming-convention */

export default function createManifest(
  target: string,
): Record<string, unknown> {
  const manifest: Record<string, unknown> = {
    name: 'Re-Nav',
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
    manifest.applications = {
      gecko: {
        id: '{2dd6149a-403e-4e67-9cf8-5fe64e16c909}',
      },
    };
  }

  return manifest;
}
