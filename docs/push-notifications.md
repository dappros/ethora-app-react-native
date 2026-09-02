# Push Notifications: Approach and Implementation

This document describes how push notifications work in the Ethora mobile app (this repository),
why this particular scheme was chosen, what is already implemented on the app side, and what has to be
implemented on the backend and the push gateway.

Date: 2026-09-01. Status: client side (token registration) implemented; backend/gateway — specification.

---

## 1. The problem

- There is one app (one App Store / Google Play build, `bundleId` = `com.ethora.app`), but the backend
  is chosen by the user: they enter a workspace address — `app.chat.ethora.com`,
  `example123.chat.ethora.com`, `app.chat-qa.ethora.com`, `app.ethoratest.com`, or a fully self-hosted
  `example-dev2.com`. `api.<domain>` and `xmpp.<domain>` are derived from that address
  (`src/modules/config/utils/workspace.ts`).
- Pushes for new messages (and, later, incoming calls) must work for **any** of these domains without
  rebuilding the app.
- Self-hosted customers run the same Ethora backend on their own infrastructure. Some of them embed our
  `@ethora/chat-component-rn` into **their own** app, which already has push notifications configured,
  and still want to occasionally use our app (e.g. for testing) against their backend.

## 2. Platform constraints (the part that cannot be worked around)

Push sender credentials are bound **to the app (the binary)**, not to a backend and not to a domain.

| Platform | Delivery channel                                             | What the sender needs                                     | Bound to                                                                      |
| -------- | ------------------------------------------------------------ | --------------------------------------------------------- | ----------------------------------------------------------------------------- |
| iOS      | APNs (always; Firebase on iOS is only a wrapper)             | APNs Auth Key `.p8` + Key ID + Team ID, topic = bundle ID | The Apple Developer **Team** that signed the build                            |
| Android  | FCM (the only channel that wakes the app in Doze/background) | Service account JSON of a Firebase project                | The **Firebase project** whose `google-services.json` is baked into the build |

Consequences:

1. A foreign `.p8` (from another Apple Team) cannot push to our app — `403`. A foreign service account
   (from another Firebase project) — `SENDER_ID_MISMATCH`. This is an Apple/Google rule, not a Firebase one.
2. Therefore **any backend that sends pushes to our binary must use our keys** — either hold them
   itself or send through a service that holds them (the gateway).
3. A customer's keys (their `.p8`, their Firebase) only make sense for **their** binary: their own app
   with our component inside, or a white-label build.
4. `google-services.json` / `GoogleService-Info.plist` know nothing about domains. We do not need the
   `.plist` at all (no Firebase on iOS). `google-services.json` is needed on Android only as the
   "sender address"; it is not a secret.
5. Android cannot work without FCM: a self-managed persistent socket is killed by Doze and OEM battery
   managers; UnifiedPush requires a separate distributor app. The Firebase SDK is still not needed in the
   app code — `expo-notifications` obtains the token.

## 3. Chosen architecture

The same scheme Rocket.Chat, Mattermost, Element and Nextcloud Talk use: **one official client +
self-hosted servers = a vendor-run push gateway + sender credentials tracked per bundleId.**

```
                     ┌──────────────────────────────────────────────────────────────┐
  app                │ domain backend (api.<domain>) — our cloud or self-hosted      │
  com.ethora.app ───▶│  stores tokens: jid → [{token, bundleId, tokenType, env}]     │
  token + bundleId   │  credentials table per bundleId:                              │
                     │    com.client.app  → their .p8 / their service account → APNs/FCM │
                     │    com.ethora.app  → no keys → relay ──────────────┐          │
                     └────────────────────────────────────────────────────┼──────────┘
                                                                          ▼
                                                           push.ethora.com (gateway, stateless)
                                                           registry bundleId → {.p8, SA}
                                                                          │
                                                                          ▼
                                                                     APNs / FCM ──▶ device
```

Principles:

- **The app only knows `api.<the-domain-the-user-typed>`.** It knows nothing about the gateway, keys or
  Firebase projects. Its behaviour is identical for `app.chat.ethora.com`, `example123.chat.ethora.com`
  and `example-dev2.com`.
- **The domain backend stores the tokens and decides how to send**: if it has keys for that `bundleId`
  it sends directly; otherwise it forwards to the gateway. Both paths work at the same time on one backend.
- **The gateway is stateless**: it stores no tokens and knows no users or rooms. It holds only sender
  credentials (per `bundleId`) and tenant keys for the backends. Our `.p8` is never handed out.
- **A customer with their own app** uploads their own keys under their own `bundleId` in their admin panel;
  our app against their backend works via relay. Nobody's files get mixed.
- A customer who does not want relay through us gets a white-label build with their own keys — then their
  `bundleId` is in their own table and the gateway is not needed.

## 4. Files and keys: what, where from, where to

| Platform | File / data                                            | What it is                                                                          | Secret? | Where it goes                                            |
| -------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------- | ------- | -------------------------------------------------------- |
| iOS      | `AuthKey_<KEY_ID>.p8` + Key ID + Team ID               | Sender key of our Apple Team                                                        | **yes** | Gateway only (or a backend allowed to send directly)     |
| iOS      | `aps-environment` entitlement                          | Permission for the app to receive pushes                                            | no      | App, `app.json → ios.entitlements` (already added)       |
| Android  | `google-services.json`                                 | project number / app id / api key of our Firebase project, package `com.ethora.app` | no      | App: repo root + `app.json → android.googleServicesFile` |
| Android  | `<project>-firebase-adminsdk-*.json` (service account) | Sender key of the Firebase project                                                  | **yes** | Gateway only (or backend)                                |

Both Android files come from **the same** Firebase project. For iOS the link is the Team ID in the `.p8`
↔ the Team that signed the build; there is no file in the app.

Where to get them:

- `.p8`: https://developer.apple.com/account/resources/authkeys/list → "+" → **APNs** only →
  Configure: **Sandbox & Production**, **Team Scoped (All Topics)** (covers `com.ethora.app`,
  `com.ethora.app.voip` and future white-label bundle IDs). Downloadable **once**. At most 2 active APNs
  keys per team — revoke lost ones. Team ID: https://developer.apple.com/account#MembershipDetailsCard.
- Firebase: https://console.firebase.google.com → project → Project settings → General → Add app →
  Android, package `com.ethora.app` → `google-services.json`; Service accounts → Generate new private key
  → service account JSON.

Keep the `.p8` and the service account in a secrets manager, not in the repository.

## 5. What is implemented in the app

Module `src/modules/push/` (same layout as `auth` / `config`).

| File                            | Responsibility                                                                                                                                                                                                                                                                                                                   |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `service/pushToken.ts`          | Notification permission (`expo-notifications`, incl. Android 13 `POST_NOTIFICATIONS`) and the **native token**: iOS — raw APNs hex (`tokenType: 'apns'`), Android — FCM (`tokenType: 'fcm'`). iOS Simulator / missing FCM config → `null` plus one warning; the app runs without push                                            |
| `service/pushService.ts`        | `syncPushRegistration({domain, appId, userId})` — compares (token, domain, appId, userId) with the stored registration; on change it first best-effort unregisters the old one on **its** domain, then registers the new one and stores the record. Single-flight, never throws. `dropPushRegistration()` — unregister on logout |
| `fetch/push.fetch.ts`           | HTTP contract (see §6). `baseURL` is set explicitly via `apiBaseUrl(domain)` so the unregister call can target the old domain                                                                                                                                                                                                    |
| `hooks/usePushNotifications.ts` | Lifecycle: register once auth + config are ready; re-register on token rotation (`addPushTokenListener`); Android `messages` channel; foreground banner suppression; tap handling (incl. cold start) → `/(app)/chat`                                                                                                             |
| `lib/pushStorage.ts`            | Active registration record in AsyncStorage (`push.registration`)                                                                                                                                                                                                                                                                 |
| `types/index.ts`                | Payload and record types                                                                                                                                                                                                                                                                                                         |

Wiring points:

- `app/(app)/_layout.tsx` — `usePushNotifications()` (mounted only for an authorized user).
- `src/modules/auth/hooks/useAuth.tsx` — `logout()`: `dropPushRegistration()` → `logoutService.performLogout()`
  → `authLogout`. Unregistering goes first, while the auth token is still valid.
- `app.json` — `expo-notifications` plugin, `ios.entitlements["aps-environment"] = "development"`
  (the App Store provisioning profile replaces it with `production` at signing time).
- Dependencies: `expo-notifications`, `expo-device`, `expo-application` (Expo SDK 57).

Flow:

```
enter address → get-config → login
  → ensurePushPermission → getDevicePushTokenAsync
  → POST api.<domain>/v1/push/subscription/{configApp._id}
  → store {token, domain, appId, userId} in AsyncStorage
logout / workspace switch
  → DELETE api.<old domain>/v1/users/endpoints {endpoint: token}
notification tap → /(app)/chat
```

Foreground policy: while the app is open the XMPP socket is live and the SDK shows its own in-app
notifications (`config.inAppNotifications`), so the OS banner in the foreground is suppressed — otherwise
every message would show twice.

What `@ethora/chat-component-rn` (26.7.2) does by itself: it subscribes the user to rooms via mucsub
(`urn:xmpp:mucsub:0`, `initRoomsPresence.ts`) — this is how ejabberd (`mod_offline_post`) knows whom to
push to while offline. The SDK's own `usePushNotifications` is **not mounted** (dead code targeting the
legacy `push.<domain>/api/v1/subscriptions` contract), so token handling is the host's job — this module.
Customers' host apps that embed the component must implement the same.

## 6. API contract (domain backend)

### Token registration

```
POST https://api.<domain>/v1/push/subscription/{appId}
Authorization: Bearer <access token>
{
  "registrationToken": "<APNs hex | FCM token>",
  "deviceType": "ios" | "android",
  "tokenType": "apns" | "fcm",          // new: raw APNs vs FCM
  "bundleId": "com.ethora.app",          // new: sender credentials lookup
  "env": "development" | "production"    // new: sandbox vs production APNs host
}
```

`registrationToken` + `deviceType` is the contract the web SDK already uses (`deviceType: 'web'`).
The remaining fields are an extension; the backend must **store** them next to the token. Re-registering
the same token is idempotent (upsert by `registrationToken`).

### Token removal

```
DELETE https://api.<domain>/v1/users/endpoints
Authorization: Bearer <access token>
{ "endpoint": "<registrationToken>" }
```

### Sending (inside the backend)

On an event from ejabberd (`mod_offline_post` → push module), for each recipient token:

1. Read the token's `bundleId`, `tokenType`, `env`.
2. If sender keys for that `bundleId` are uploaded in the app settings — send directly:
   `apns` → APNs HTTP/2 (`api.push.apple.com` or `api.sandbox.push.apple.com` by `env`,
   `apns-topic: <bundleId>`, JWT signed with the `.p8`); `fcm` → FCM HTTP v1 with the service account.
3. Otherwise — `POST <PUSH_GATEWAY_URL>/v1/send` (see §7).
4. On "token invalid" (`410 Unregistered` / `BadDeviceToken` / `UNREGISTERED`) → delete the token.

Message push payload — `notification {title, body}` + `data`:

```
data: { jid: "<room JID>", msgID: "...", senderName: "...", ... }
```

`data.jid` is mandatory — the app uses it to open the room (the web SDK relies on the same
`data.jid` / `data.msgID`, see `notificationPolicy.ts`). For Android, set
`android.notification.channelId: "messages"`.

Backend configuration: `PUSH_GATEWAY_URL`, `PUSH_GATEWAY_KEY` (tenant key). Admin panel: key upload
**per bundleId**, instead of one pair per app as today (`firebaseServiceAccountUploaded`, `apnsKeyUploaded`).

## 7. Gateway (`push.ethora.com`) — specification

A separate small service (Node, a few hundred lines). Unrelated to the chat API.

**Configuration:**

```yaml
tenants:
  - key: '<tenant key>' # issued to each backend; rate limits optional
    name: 'example-dev2.com'
apps:
  com.ethora.app:
    apns: { keyPath: /secrets/AuthKey_XXXX.p8, keyId: XXXX, teamId: 82XXXXXXXX }
    fcm: { serviceAccountPath: /secrets/ethora-fcm.json }
  # future white-label builds — one entry per bundleId
```

**API:**

```
POST /v1/send
Authorization: Bearer <tenant key>
{
  "bundleId": "com.ethora.app",
  "messages": [
    { "token": "...", "tokenType": "apns" | "fcm" | "voip", "env": "production",
      "notification": { "title": "...", "body": "..." },
      "data": { "jid": "...", "msgID": "..." },
      "priority": "high", "ttl": 3600 }
  ]
}
→ 200 { "results": [ { "token": "...", "status": "ok" | "invalid" | "error", "reason": "..." } ] }
```

`status: "invalid"` → the backend deletes the token. The gateway persists nothing but metrics.

**Security:** keys live only on the gateway; tenant keys are revocable; the payload can be minimized
(only `jid`, the app fetches the text itself) if a customer does not want message content to transit
through us.

## 8. Scenarios

| Scenario                                                      | Who registers the token              | Keys                                  | Send path                            |
| ------------------------------------------------------------- | ------------------------------------ | ------------------------------------- | ------------------------------------ |
| Our cloud domain (`chat.ethora.com`, `chat-qa`, `ethoratest`) | our app, `com.ethora.app`            | ours, uploaded locally                | direct (or via gateway — equivalent) |
| Self-hosted without own keys                                  | our app                              | none                                  | relay → gateway                      |
| Customer with their own app + our component                   | their app, `com.client.app`          | their `.p8`/SA under their `bundleId` | direct with their keys               |
| Same customer, tester using our app                           | our app, `com.ethora.app`            | no keys for this `bundleId`           | relay → gateway                      |
| Customer white-label build                                    | their build, `com.client.whitelabel` | their keys                            | direct; gateway not needed           |

## 9. Enablement checklist

App:

- [x] Module `src/modules/push/`, wiring in layout and logout, `app.json` (plugin + entitlement).
- [ ] Put `google-services.json` (package `com.ethora.app`) in the repo root and add to `app.json`:
      `"android": { "googleServicesFile": "./google-services.json" }`. Without the file `expo prebuild`
      fails, so the line is not added yet.
- [ ] `npx expo prebuild` + rebuild the dev client (`npm run ios` / `npm run android`).
- [ ] Check the log for `[push] registered apns|fcm token on <domain>`.

Keys (manual):

- [x] New APNs `.p8` created (Sandbox & Production, Team Scoped). Key ID and Team ID recorded.
- [ ] Revoke the lost old `.p8` once the new one is deployed to the gateway/backend.
- [ ] Firebase project: `google-services.json` + service account (normally project `ethora-668e9`, which
      the web app already uses — then web and mobile share one project).
- [ ] Keys stored in a secrets manager.

Backend:

- [ ] Store `tokenType`, `bundleId`, `env` in `/push/subscription/{appId}`.
- [ ] Direct `apns` sending over APNs (currently everything goes through Firebase), honouring `env`.
- [ ] Keys per `bundleId` in the admin panel; gateway fallback.
- [ ] `data.jid` in the payload; `channelId: "messages"` for Android.
- [ ] Gateway (§7) deployed at `push.ethora.com`.

## 10. Not implemented / next steps

1. **Opening the exact room on tap.** The SDK keeps `pendingNotificationJid` in its internal store and
   does not export the setter. Today a tap lands on the chat screen and the `jid` is logged. Needs an
   export in `@ethora/chat-component-rn` (repository `ethora-chat-component-rn`), then one line in
   `usePushNotifications.ts`.
2. **Calls, Android in background.** The SDK accepts an incoming call from a data push
   (`helpers/callPush.ts`, `handleCallPush`): it needs `type: "call"`, `callId`, `callToken` (LiveKit
   token — without it the SDK does not ring), `callRoom`/`jid`, `callerName`, `kind`. On the host: a
   background data-push handler → `react-native-callkeep` (`displayIncomingCall`). Requires the SDK's
   optional peers: `@livekit/react-native@2.7.6`, `@livekit/react-native-webrtc@125.0.11`,
   `livekit-client@2.9.0`, `react-native-callkeep@4.3.16`, and `videoCalls: { enabled, livekitUrl }` in the
   chat config. `livekitUrl` is not in `get-config` yet — needs a convention (`wss://livekit.<domain>`)
   or a new field.
3. **Calls, iOS in background/killed.** Only via a PushKit VoIP push + CallKit:
   `react-native-voip-push-notification`, VoIP token registration (`tokenType: "voip"`, topic
   `com.ethora.app.voip`, same `.p8`), mandatory `reportNewIncomingCall` on every VoIP push. Backend
   side — a VoIP path (`mod_offline_post.voip_post_url` exists in ejabberd, the sender does not). SDK
   26.7.2 does not support this (see `useCallKeep.ts`).
4. **Web SDK** uses the same endpoint with `deviceType: 'web'` — the backend changes are backward compatible.

## 11. Known pitfalls

- **Sandbox vs production APNs.** A dev client gets a sandbox token, TestFlight/App Store — production.
  The token itself does not reveal which; pushing to the wrong host fails silently with `BadDeviceToken`.
  That is why the app sends `env`.
- **Team Scoped key.** A topic-specific `.p8` will not cover the `.voip` topic or new bundle IDs.
- **At most 2 active APNs keys per team.** Revoke lost ones, or the next one cannot be created.
- **Foreground duplicates.** The OS banner is suppressed on purpose; if the backend starts sending
  data-only pushes without `notification`, the app will need to post a local notification for the
  background case.
- **Authorization.** The web SDK sends the raw token, the app sends `Bearer <token>`; the backend accepts both.
- **Unregistering on the old domain** after a workspace switch may return 401 (the auth token now belongs
  to another domain) — this is best effort; the primary unregister happens on logout while the token is valid.
