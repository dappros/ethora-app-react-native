# App Store compliance notes

Open issues and decisions around App Store distribution of Ethora Mobile (iOS,
`com.ethora.app`). Last updated: 2026-11-19.

These are engineering notes, not legal advice. Items marked "legal" need a qualified answer.

## Summary

| # | Issue | Status | Next step |
|---|---|---|---|
| 1 | China mainland requires a Security Assessment and an AI content filing | Decision: not distributing there | Confirm the change in App Store Connect |
| 2 | `ITSAppUsesNonExemptEncryption` is `false`, but the app still encrypts chat history on the device | **Open, blocks a confident submission** | Legal: is `false` correct? |
| 3 | France requires a declaration for some encryption | France stays in availability, no declaration filed | Legal: is a declaration needed? |
| 4 | End-to-end encrypted chats (E2EE) | Switched off until the legal side is ready | Keep off |
| 5 | Encrypted pushes | Switched off for now | Review after the answer to issue 2 |
| 6 | Inactive encryption code is still in the build | Open | Legal: does inactive code count? |
| 7 | Build 1.0.11 (1) predates these changes | Open | Upload a new build |
| 8 | App Review 2026-11-19: four guidelines | Code for 4.8 and 1.2 done, not released | See section 8 |

## 1. China mainland: removed from availability

**Decision:** Ethora Mobile is not distributed on the App Store in China mainland. The
setting is in App Store Connect: Distribution → Pricing and Availability → App Availability
→ Manage Availability.

**Why:** since November 2026 App Store Connect asks apps available in China mainland for two
compliance items. Both were shown as "Missing Info" for this app.

| Item | Applies to | What Apple asks for |
|---|---|---|
| Security Assessment | Features such as end-to-end encrypted instant messaging or distributing AI-generated content | Proof of a passed assessment from the National Internet Security Management Service Platform, and the report with the company seal |
| AI Generated or Synthetic Content | Services such as AI chatbots, image or video generation, voice or face alteration | Approved LLM or algorithm filing number and name. For third-party models, an authorization from the owner listed in the Cyberspace Administration of China registry |

Existing apps must have verified declarations by January 31, 2027. New distribution in China
mainland needs them before submission for review.

What in Ethora is relevant:

- **E2EE chats** are named directly by Apple. They are now off, see issue 4.
- **AI bots** run on `services/ai/ai-service` in `ethora-backend`, through an OpenAI-compatible
  API. Whether bots are enabled for users in production has not been checked.
- **Automatic translation** is not on Apple's list. The engine behind the translation service
  has not been identified.

Getting these approvals is out of proportion for the first release. It most likely needs a
local partner and legal counsel, and possibly a different AI model. The app has not been
released yet, so no App Store users in China are lost.

**Check after saving:** Apple does not state that the two items disappear once China mainland
is deselected. If App Compliance still shows "Missing Info", ask Apple Developer Support.

**If China comes back,** there are two routes:

- Answer "No" to the declarations. Apple allows this when the features are disabled or
  geoblocked in China mainland.
- Complete the assessment and the filings.

Either way, also check:

- The ICP Filing Number, which reportedly requires a presence in China.
- The restrictions on CallKit reported in 2018 (current status not confirmed). The build
  includes CallKit through `react-native-callkeep` and `modules/ethora-voip`, even with calls
  off.

## 2. Encryption declaration to Apple

`ITSAppUsesNonExemptEncryption` is `false` in `app.json`. It has been `false` since
2026-08-28, including while E2EE and encrypted pushes were on. `ios/` is generated and not in
git, so a change must also reach `ios/Ethora/Info.plist` (through prebuild or by hand).

Encryption in the app:

| Feature | Implementation | State in the next build |
|---|---|---|
| Local chat history (messages and room list) | AES through MMKV's bundled OpenSSL code. Fallback: AES-256-CBC through `crypto-js` | **Active, no switch in the app or SDK config** |
| E2EE chats (OMEMO) | `@noble` libraries in `@ethora/chat-component-rn` | Off, code still in the build |
| Encrypted pushes (X25519 sealed box) | `@noble` in the SDK, `SealedBox.swift` in the iOS notification extension | Off, code still in the build |
| Audio and video calls | WebRTC through LiveKit | Off in production, native library still in the build |
| HTTPS, Keychain, Keystore | Provided by the operating system | Active |

**The problem:** local chat history is encrypted by code shipped with the app, not by the
operating system. So switching off E2EE and encrypted pushes does not settle whether `false`
is the correct answer.

Apple's export compliance page covers apps that use, access, contain, implement or incorporate
encryption, and leaves the responsibility for the classification with the developer.

**Do not solve this by removing the local encryption:** message history would then sit
unencrypted on the device.

**Questions for legal:**

1. Is `false` correct while chat history is encrypted with AES from MMKV or `crypto-js`?
2. If not, which answers should be given in App Store Connect? The algorithms are industry
   standard ones, not proprietary.
3. Does inactive code count (issue 6)?

## 3. France

France controls the import and export of encryption apps. Apple lists Secure Storage and
Secure Communications as the main items of control. Per Apple's documentation table, an app
that uses industry-standard algorithms not provided by the operating system needs a French
encryption declaration if it is distributed in France. Proprietary algorithms additionally
need a CCATS classification.

**Decision:** France stays in availability.

**Open:** E2EE and encrypted pushes are off, but the local chat history encryption (Secure
Storage) remains. Legal should confirm whether a French declaration is still needed. If it is,
it has to be filed for the app to stay available in France. Encrypted pushes could then be
switched back on, because turning them off would no longer avoid the declaration.

## 4. End-to-end encrypted chats: switched off

`e2ee: { enabled: false }` in `src/modules/chat/config/chatConfig.ts`. E2EE stays off until the
legal side is ready. This setting is shared by iOS and Android.

Effects:

- OMEMO does not start, and the app offers no way to open an encrypted chat.
- Encrypted rooms created in other clients are not decrypted and can't be written to from the
  app. The composer shows a notice instead.

**To turn it back on, only after legal clearance:**

1. Set `e2ee: { enabled: true }`.
2. Set `ITSAppUsesNonExemptEncryption` to `true` and answer the export compliance questions.
3. File the French declaration.
4. Keep China mainland off unless its Security Assessment is done.

## 5. Encrypted pushes: switched off

`extra.push.encrypted: false` in `app.json`. This setting is shared by iOS and Android.
Devices that registered a key before drop it the next time they register.

Effects:

- Apple and Google can read push content. In the default `full` content mode this includes the
  message text and the sender or chat name. What production currently sends has not been
  checked.
- On Android the system draws the notification, so the sender avatar appears only as a large
  picture instead of the messenger-style layout.

**Mitigation:** the backend has a `generic` content mode, which sends "New message" with ids
only: `PUT /v1/push/content-mode/:appId` with `{ "mode": "generic" }`. It is not enabled by this
change, and it removes the message preview for users.

## 6. Inactive code in the build

The settings above only deactivate features. These remain in the build:

- OMEMO code and the `@noble` libraries, in the SDK.
- `SealedBox.swift`, which the SDK config plugin always adds to the notification extension.
- WebRTC, through the LiveKit packages.

Removing the first two needs an SDK change, removing WebRTC needs a separate build without the
calls packages. Do this only if legal says inactive code counts.

## 7. Before the next submission

1. Confirm that China mainland is deselected and check App Compliance.
2. Get the legal answers from issues 2, 3 and 6, and update the flag if needed.
3. Make a new iOS build with a higher build number. Build 1.0.11 (1) still has E2EE and
   encrypted pushes on.
4. Check that the archive's `main.jsbundle` contains `api.chat.ethora.com`. Earlier uploads had
   the QA API in them.
5. Test on a real device, which has not been done for these changes:
   - pushes arrive on iOS and Android, with the app in the background and closed;
   - the log shows `plain pushes (encryption switched off in app.json)`;
   - the encrypted chat option is gone from user profiles;
   - chat history survives an app restart.
6. Attach the new build to the version and resubmit for review.

## 8. App Review rejection of 1.0.11 (1), 2026-11-19

| Guideline | What Apple asked | State |
|---|---|---|
| 4.8 Login Services | The app offers Google sign-in, so it must also offer an equivalent service such as Sign in with Apple | Sign in with Apple added (app and backend), not released |
| 2.3.3 Accurate Metadata | iPad Pro (2nd Gen) screenshots are marketing images, not the app in use | Open: replace them in App Store Connect (Media Manager) |
| 5.1.1(ii) Purpose strings | The photo library text ("Allow Ethora to access your photos") does not say why | Done 2026-11-20: photo library, saving, camera and microphone texts rewritten (`app.json` and `ios/Ethora/Info.plist`); the unused Face ID text removed |
| 1.2 User-generated content | Block abusive users (block also notifies the developer and hides the content at once); terms before sign-in; a device recording of terms, report and block | Block and report done in the SDK, not released. Terms: draft in the app, needs approval. Recording: open (must be from a physical device) |

### Sign in with Apple (4.8)

- App: the Apple button sits next to Google on the login screen, the e-mail login sheet and
  registration, iOS only (`src/modules/auth/lib/appleSignIn.ts`, `AppleSignInButton`). It
  shows wherever Google does. Entitlement `com.apple.developer.applesignin`; the App ID needs
  the Sign in with Apple capability (automatic signing turns it on).
- Backend (`ethora-backend`, branch 2610, deployed 2026-11-20): the Apple identity token is now
  checked for issuer and audience. Before, a token Apple issued to any other app was accepted
  for the same e-mail. Accepted audiences: `APPLE_SIGNIN_CLIENT_IDS` (comma-separated,
  default `com.ethora.app`).
- Account deletion: Apple requires Sign in with Apple tokens to be revoked when the account is
  deleted. The app sends the one-time authorization code at login, the backend exchanges it
  for a refresh token and revokes it on "Delete account" (soft closure) and on purge. Needs a
  Sign in with Apple key from the Apple developer portal: `APPLE_TEAM_ID`,
  `APPLE_SIGNIN_KEY_ID`, `APPLE_SIGNIN_PRIVATE_KEY`. Without it, sign-in still works but
  tokens are not revoked.

### Report and block (1.2)

- Report: already in the SDK ("Report" on a chat and on a room-list row), sends
  `POST /v1/chats/reports/:chatName`, which e-mails the Trust & Safety addresses
  (`TRUST_AND_SAFETY_EMAILS` server setting). Check they are set on production.
- Block (ported from the web SDK to `@ethora/chat-component-rn`, not published): "Block user"
  on another user's profile and in a private chat's profile menu, Settings → Blocked users
  with Unblock. A blocked user's private chats leave the list at once, their messages in
  group chats show as "Blocked user" and don't count as unread. Blocking also files a report,
  so the moderators are notified.
- Both are off by default in the SDK (other apps on it may not want them) and switched on in
  this app with `features: { report: true, userBlock: true }` in
  `src/modules/chat/config/chatConfig.ts`. Removing either flag brings back the 1.2 rejection.
- **Backend requirement:** `/v1/chats/blocked` comes from backend branch 2610. Deployed
  2026-11-20: production and QA answer 401 (needs login) instead of 404.
- Terms of use (draft 2026-11-23, needs management approval): end-user terms with a
  no-tolerance clause for objectionable content and abusive users, in
  `src/modules/legal/termsOfUse.ts`. The app shows them on first launch, before the
  workspace, sign-in and registration screens, and continues only after "I agree"
  (`app/(auth)/terms.tsx`); the login screen links to them. Company details come from
  https://ethora.com/terms/, which is the business customers' agreement and has no such
  clause for end users. Points for management: the minimum age (16, as in the business
  terms), and the promise to review reports within 24 hours.
- Fixed 2026-11-23: Block failed with 404 for members whose `xmppUsername` the SDK holds as
  the bare user id. The SDK now adds the app prefix before calling `/v1/chats/blocked`.
  The report dialog now moves above the keyboard (Send was hidden while typing details).
- Tested 2026-11-23 on an iPhone 17 Pro simulator, Release build, production API: terms
  before the workspace screen, e-mail login, report, block from a private chat (the chat
  leaves the list) and from a profile in a group (messages replaced by "Blocked user"),
  unblock in Settings. Not testable there: Sign in with Apple (needs an Apple ID on a
  device).
- Demo account for App Review: `newtestuser@ethora.com` works on production.
  `ethoratestD@mailinator.com` exists only on QA.
- One report per user per chat: a chat reported during testing returns `ALREADY_REPORTED`
  for the same account, so don't use it again in the recording.

## Sources

- [View China mainland compliance information](https://developer.apple.com/help/app-store-connect/manage-compliance-information/view-china-mainland-compliance-information/)
- [Manage availability for your app](https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/manage-availability-for-your-app-on-the-app-store/)
- [Export compliance documentation for encryption](https://developer.apple.com/help/app-store-connect/reference/app-information/export-compliance-documentation-for-encryption/)
- [Overview of export compliance](https://developer.apple.com/help/app-store-connect/manage-app-information/overview-of-export-compliance/)
- [Apple removes CallKit apps in China, 2018](https://techcrunch.com/2018/05/25/googles-duo-and-ciscos-webex-teams-among-the-voip-apps-pulled-from-the-china-app-store)
- [ICP filing requirement](https://www.techspot.com/news/100368-new-chinese-law-forces-apple-lock-down-regional.html)
