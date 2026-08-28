export const DEFAULT_DOMAIN_NAME = process.env.EXPO_PUBLIC_DOMAIN_NAME || 'app';

/** Default cluster domain (chat.ethora.com), derived from EXPO_PUBLIC_API=https://api.chat.ethora.com/v1 */
export const DEFAULT_API_DOMAIN = (() => {
  try {
    return new URL(process.env.EXPO_PUBLIC_API as string).hostname.replace(/^api\./, '');
  } catch {
    return 'chat.ethora.com';
  }
})();
