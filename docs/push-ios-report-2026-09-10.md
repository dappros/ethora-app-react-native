# iOS push on chat-qa: raw APNs token registered, no push delivered (2026-09-10)

Android on the same workspace works end to end (verified 2026-09-09 after the send limit was raised).
This is the first iOS run with the new contract; everything on the client side is in place — the
missing piece is on the APNs send path.

## Setup

| | |
|---|---|
| Workspace / appId | `example.chat-qa.ethora.com` / `646f1504214d0120432269b8`, platform delivery **enabled** |
| Receiver | dmytrotest2@mailinator.com, jid `646f1504214d0120432269b8_6a9ede495930c500c37cc108@xmpp.chat-qa.ethora.com` |
| Sender | dmytrotest@mailinator.com (web app), room `test2` `646f1504214d0120432269b8_6a9ede835930c500c37cc1e0@conference...` |
| Device | physical iPhone 17 ("Modem X"), **debug build from Xcode**, bundle id `com.ethora.app`, team Dappros Ltd |
| Entitlement | `aps-environment = development` (Push Notifications capability added to the App ID today) |
| SDK | `@ethora/chat-component-rn` 26.7.7 (npm), host app current |

## What the client did (Metro log, 21:5x UTC+2)

```
[push] registered apns token (platform, new contract) on chat-qa.ethora.com
'XMPP online.', Thu Sep 10 2026 21:55:34 GMT+0200
```

i.e. `POST /v1/push/subscription/646f1504214d0120432269b8` with
`{ registrationToken: <64-hex APNs device token>, deviceType: "ios", tokenType: "apns", buildOrigin: "platform" }`
→ 200. The token is the raw APNs token from `getDevicePushTokenAsync` (no Firebase on iOS).

MucSub subscriptions for this user exist on `conference.xmpp.chat-qa.ethora.com` (same user and rooms as in
the Android run yesterday; the 26.7.7 SDK subscribes on every bootstrap).

Then: app backgrounded / killed on the iPhone, message sent from the web app to `test2` → delivered to the
room, **no push on the iPhone**.

Before the capability was added the app logged
`Could not obtain a device push token … "aps-environment" entitlement not found` — that is fixed now and
is not the current problem.

## Two things only the backend can answer

1. **Which APNs host does platform delivery use for `tokenType: apns`?**
   A debug build from Xcode gets a **sandbox** token; it is only valid on `api.sandbox.push.apple.com`.
   Sending it to `api.push.apple.com` fails with `400 BadDeviceToken` (and vice versa).
   The subscription body has no environment field for platform tokens, so the service has to either
   send to sandbox for dev builds, or retry the other host on `BadDeviceToken`.
2. **Was a send attempted at all, and what did Apple answer?** Please check the push-service log for jid
   `..._6a9ede495930c500c37cc108` around 21:55–22:05 (UTC+2). The APNs response status / reason
   (`BadDeviceToken`, `InvalidProviderToken`, `TopicDisallowed`, `MissingTopic`, …) pinpoints it:
   - `BadDeviceToken` → wrong host (sandbox vs production) for this token;
   - `InvalidProviderToken` / `403` → the `.p8` / keyId / teamId JWT is wrong;
   - `TopicDisallowed` / `MissingTopic` → `apns-topic` must be `com.ethora.app` for platform tokens.
   If there is no attempt in the log — does the platform path implement direct APNs for `apns` tokens on QA
   yet, or only FCM?

## For reference: platform APNs key

The `.p8` handed to the backend is Team-scoped (Sandbox & Production), Key ID `8QF7K8KC2L`, team Dappros Ltd
— it is valid for both hosts and for topic `com.ethora.app`.
