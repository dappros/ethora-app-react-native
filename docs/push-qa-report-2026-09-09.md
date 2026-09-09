# Push on chat-qa: room messages are delivered, but no push is sent (2026-09-09)

Yesterday evening (2026-09-08, ~19:00) this exact scenario on this exact workspace worked: the push
arrived both with the app backgrounded and with the app process killed. Since ~11:00 today no push is
sent for chat messages at all. Everything the client is responsible for has been verified directly on
the server (see below), including a from-scratch run on the published SDK 26.7.6.

## Scenario

Workspace `example.chat-qa.ethora.com`, appId `646f1504214d0120432269b8`, platform delivery enabled
(`GET /v1/push/platform/646f1504214d0120432269b8` → `enabled: true, quota: 1000`).

| Role | User | XMPP jid |
|---|---|---|
| Receiver (Android emulator, Pixel 9 Pro, Google Play image) | dmytrotest2@mailinator.com | `646f1504214d0120432269b8_6a9ede495930c500c37cc108@xmpp.chat-qa.ethora.com` |
| Sender | dmytrotest@mailinator.com | `646f1504214d0120432269b8_6a9ede285930c500c37cc046@xmpp.chat-qa.ethora.com` |

Room `test2`: `646f1504214d0120432269b8_6a9ede835930c500c37cc1e0@conference.xmpp.chat-qa.ethora.com`.

The sender posts a `groupchat` message to the room while the receiver's app process is killed (not
just backgrounded).

## Verified on the server before each send

1. **The receiver has a MucSub subscription.** `urn:xmpp:mucsub:0 <subscriptions/>` sent to
   `conference.xmpp.chat-qa.ethora.com` as the receiver returns 2 subscriptions, including
   `..._6a9ede835930c500c37cc1e0@conference...` with node `urn:xmpp:mucsub:nodes:messages`.
2. **The receiver is offline.** `disco#items` on the receiver's bare jid from a separate probe session
   lists only that probe resource, nothing else.
3. **The device token is registered on the backend.** `POST /v1/push/subscription/646f1504214d0120432269b8`
   (re-registering returns the stored document):
   `_id 6aa14f08939d933a815db1a6`, `jid ..._6a9ede495930c500c37cc108@xmpp.chat-qa.ethora.com`,
   `projectId 6a9eeef0939d933a8154d8d7`, `tokenType fcm`, `buildOrigin platform`,
   `createdAt 2026-09-09T12:20:24Z`.
4. **FCM delivers to this token.** A direct FCM HTTP v1 send (project `ethora-668e9`) to the same
   `registrationToken` wakes the killed process and shows the notification within 2–3 s.

## Clean from-scratch run (13:44–13:51)

To rule out any stale state: the receiver's two MucSub subscriptions were removed on the MUC service
(`<unsubscribe/>`, list afterwards = 0), the token subscription was deleted
(`DELETE /v1/push/subscription/...` → `deletedCount: 1`), the app data was wiped, and the receiver
logged in again on the **published SDK 26.7.6** (no local changes). The app registered the token
(`[push] registered fcm token (platform, new contract)`) and re-subscribed both rooms
(`Subscribed to 2 rooms, 0 failed`); the server confirms both. Process killed, message sent → delivered
to the room, **no push**.

## Sends

| Time (UTC+2) | Message | Result |
|---|---|---|
| 13:20:34 | «push test» | echoed by the room, no push |
| 13:23:04 | «after fix» | echoed, no push |
| 13:32:49 | «rollback test 3» (SDK rolled back to published 26.7.6) | echoed, no push |
| 13:33:3x | «legacy reg test» (token re-registered in the old body format) | echoed, no push |
| 13:50:05 | «clean run» (state rebuilt from scratch, see above) | echoed, no push |
| 13:51:03 | «with data push» (SDK-shaped stanza: `<data … push="true"/>` + `<body/>`) | echoed, no push |

The last send uses the exact stanza the SDK / web component sends, including the `data` element with
`push="true"`; earlier sends were plain `<body/>`-only messages.

`todayCount` for this app is **2** throughout and never changes (those 2 are manual
`POST /v1/push/user` calls in the morning). So the push service made **no send attempt** for any of
these messages.

No FCM activity on the device for these sends (logcat `FirebaseMessaging` / `FCM-Notification` = 0).

## Questions

1. Does the event from ejabberd (`mod_offline_post` / push hook) reach the push service for these
   messages at all? If not — what changed on QA since yesterday evening (ejabberd config, `mod_muc` /
   `allow_subscription`, push hook URL)?
2. If it does reach the service — why is there no send for jid `..._6a9ede495930c500c37cc108` with
   `buildOrigin: platform` and the toggle enabled, or where does it fail? Push-service log for
   13:20–13:52 (UTC+2) is needed.
3. Side note, app `app` (`646cc8dc96d4a4dc8f7b2f2d`): MucSub subscribe for user
   `..._66f5edf81b762117e1bfa26a` is refused in every room — `registration-required` for group rooms,
   `forbidden` for 1:1 rooms. That is room configuration / affiliations on `xmpp.chat-qa.ethora.com`.
