# ios-api-key — App Store Connect API key

`asc` authenticates with an App Store Connect API key: Key ID, Issuer ID, and a `.p8` private key file.

## Reuse scan

Run when fastlane or another process exists. Search `fastlane/`, `.env*`, `fastlane/.env*`, and CI config for:

- `app_store_connect_api_key(` with `key_id`, `issuer_id`, `key_filepath`
- env names `APP_STORE_CONNECT_API_KEY_KEY_ID`, `..._ISSUER_ID`, `..._KEY_FILEPATH`, `..._KEY`
- `AuthKey_*.p8` files anywhere under the repo and `~/.appstoreconnect/private_keys`, `~/private_keys`

Values referencing env vars or CI secrets: ask the user for the local value or file path.

Found a complete set (Key ID, Issuer ID, readable `.p8`): show Key ID and the file path (never the key contents) and ask **Reuse these** / **Create a new key**. Only Apple ID + password found (no API key): nothing reusable, create a new key.

## Create a new key

The user does this in the browser; guide them:

1. Open <https://appstoreconnect.apple.com/access/integrations/api>. The Account Holder must request API access on first use.
2. Team Keys → generate a key with the **App Manager** role (enough for builds, TestFlight, and metadata; **Admin** only when they need pricing or agreements).
3. Copy the **Issuer ID** (top of the page) and the **Key ID**.
4. Download the `.p8` immediately; Apple offers it once.
5. Move it outside the repo, e.g. `~/.appstoreconnect/private_keys/AuthKey_<KEYID>.p8`, then `chmod 600` it.

## Done when

Key ID, Issuer ID, and a readable `.p8` path are known, and the `.p8` sits outside the repo or matches a `.gitignore` entry (`*.p8`). Ledger note: Key ID, `.p8` path, and `reused from fastlane` or `new`.
