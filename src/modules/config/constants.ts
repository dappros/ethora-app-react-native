export const DEFAULT_DOMAIN_NAME = process.env.EXPO_PUBLIC_DOMAIN_NAME || 'app';

/** Default cluster domain (chat.ethora.com), derived from EXPO_PUBLIC_API=https://api.chat.ethora.com/v1 */
export const DEFAULT_API_DOMAIN = (() => {
  try {
    return new URL(process.env.EXPO_PUBLIC_API as string).hostname.replace(/^api\./, '');
  } catch {
    return 'chat.ethora.com';
  }
})();

/**
 * The open Ethora workspace behind "Join our Open Workspace", as a workspace
 * address: EXPO_PUBLIC_OPEN_WORKSPACE=app.chat-qa.ethora.com → domainName `app`
 * on api.chat-qa.ethora.com. Defaults to EXPO_PUBLIC_DOMAIN_NAME on the EXPO_PUBLIC_API cluster.
 */
export const OPEN_WORKSPACE_ADDRESS =
  process.env.EXPO_PUBLIC_OPEN_WORKSPACE || `${DEFAULT_DOMAIN_NAME}.${DEFAULT_API_DOMAIN}`;

/**
 * Workspace addresses that, typed on the workspace screen, also lead to the open
 * workspace, comma separated: EXPO_PUBLIC_OPEN_WORKSPACE_ALIASES=app.chat.ethora.com
 */
export const OPEN_WORKSPACE_ALIASES: string[] = String(process.env.EXPO_PUBLIC_OPEN_WORKSPACE_ALIASES ?? '')
  .split(',')
  .map((address: string) => address.trim())
  .filter(Boolean);
