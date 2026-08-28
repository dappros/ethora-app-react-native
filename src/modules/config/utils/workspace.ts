import { DEFAULT_API_DOMAIN } from '@modules/config/constants';
import { Workspace } from '@modules/config/types';

const HOST_LABEL = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

/**
 * Parses a workspace address: `example.chat.ethora.com`
 * → { domainName: 'example', domain: 'chat.ethora.com' }.
 * Scheme, path, port and query are dropped. A single word (`example`) is treated as
 * a domainName in the default cluster. Returns null when the string is invalid.
 */
export const parseWorkspaceUrl = (input: string): Workspace | null => {
  let host = input.trim().toLowerCase();
  if (!host) return null;

  host = host.replace(/^[a-z]+:\/\//, ''); // scheme
  host = host.split(/[/?#]/)[0]; // path / query
  host = host.split('@').pop() as string; // user@host
  host = host.split(':')[0]; // port
  host = host.replace(/\.+$/, '');
  host = host.replace(/^www\./, ''); // www.example.chat.ethora.com → example.chat.ethora.com

  const labels = host.split('.').filter(Boolean);
  if (!labels.length || !labels.every((l) => HOST_LABEL.test(l))) return null;

  if (labels.length === 1) {
    return { domainName: labels[0], domain: DEFAULT_API_DOMAIN };
  }
  // At least a second-level domain is required after the stub: example + ethora.com
  if (labels.length < 3) return null;

  return { domainName: labels[0], domain: labels.slice(1).join('.') };
};

export const apiBaseUrl = (domain: string, version: 'v1' | 'v2' = 'v1') =>
  `https://api.${domain}/${version}`;

export const xmppHostFor = (domain: string) => `xmpp.${domain}`;

export const xmppSettingsFor = (xmppHost: string) => ({
  devServer: xmppHost,
  host: xmppHost,
  conference: `conference.${xmppHost}`,
});
