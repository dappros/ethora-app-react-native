import { configureScheduledCallLinks, parseScheduledCallLink } from '@ethora/chat-component-rn';

/**
 * Scheduled calls: the links that open this app.
 *
 *   https://app.chat.ethora.com/call/<slug>   universal / app link (app.json: associatedDomains, intentFilters)
 *   ethoraappreactnative://call/<slug>        the app's own scheme
 *
 * Both land on the expo-router route app/call/[slug].tsx. Set at import, so
 * anything that parses a link (the route, a reminder push) already knows them.
 */
export const CALL_LINK_HOSTS = ['app.chat.ethora.com'];
export const CALL_LINK_SCHEMES = ['ethoraappreactnative'];

configureScheduledCallLinks({ hosts: CALL_LINK_HOSTS, schemes: CALL_LINK_SCHEMES });

/** The slug a route param holds, or null when it is not a well-formed slug. */
export const slugFromParam = (param: string | string[] | undefined): string | null => {
  const value = Array.isArray(param) ? param[0] : param;
  if (!value) return null;
  return parseScheduledCallLink(`https://${CALL_LINK_HOSTS[0]}/call/${encodeURIComponent(value)}`);
};

/** The in-app route of a scheduled call. */
export const callRoute = (slug: string) => `/call/${encodeURIComponent(slug)}` as const;
