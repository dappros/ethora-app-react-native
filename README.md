# ethora-app-react-native — Legacy

> ⚠️ **This repository is no longer actively maintained.**
>
> It is preserved for historical reference only. New mobile development should target one of the actively-maintained Ethora SDKs below.

**Part of the [Ethora SDK ecosystem](https://github.com/dappros/ethora#ecosystem)** — see all SDKs, tools, and sample apps.

## What was this?

A full Ethora app engine implemented in React Native. It was the original mobile reference app, predating the dedicated React Native chat SDK and the native Android / iOS SDKs. Code defaults still point at the legacy `*.ethoradev.com` cluster and various retired backends (`app.dappros.com`, `xmpp.qa.ethoradev.com`, `push.qa.ethoradev.com`, etc.).

## Use these instead

| If you want… | Use |
|--------------|-----|
| React Native chat in your existing app | [`@ethora/chat-component-rn`](https://github.com/dappros/ethora-chat-component-rn) |
| React.js (web) chat in your app | [`@ethora/chat-component`](https://github.com/dappros/ethora-chat-component) |
| Native Android (Kotlin / Compose) | [`ethora-sdk-android`](https://github.com/dappros/ethora-sdk-android) (sample app: [`ethora-sample-android`](https://github.com/dappros/ethora-sample-android)) |
| Native iOS (Swift / SwiftUI) | [`ethora-sdk-swift`](https://github.com/dappros/ethora-sdk-swift) |
| WordPress integration | [`ethora-wp-plugin`](https://github.com/dappros/ethora-wp-plugin) |
| One-shot project setup | `npx @ethora/setup` ([`ethora-setup`](https://github.com/dappros/ethora-setup)) |
| Live web app | [app.chat.ethora.com](https://app.chat.ethora.com) |

## Default endpoints (current platform)

The current Ethora Cloud production endpoints (used by all maintained SDKs) are:

| Purpose | Value |
|---------|-------|
| Web app | `https://app.chat.ethora.com` |
| API | `https://api.chat.ethora.com` (Swagger: `https://api.chat.ethora.com/api-docs/#/`) |
| XMPP WS | `wss://xmpp.chat.ethora.com:5443/ws` |
| QA environment | `chat-qa.ethora.com` |

## Links

- Ethora monorepo: <https://github.com/dappros/ethora>
- Documentation: <https://docs.ethora.com/>
- Forum: <https://forum.ethora.com/>
- Discord: <https://discord.gg/Sm6bAHA3ZC>

## License

AGPL — see [LICENSE](./LICENSE). Commercial licenses available from Dappros.
