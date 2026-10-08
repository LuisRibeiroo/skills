# ios-login — authenticate asc and verify

1. Ask where credentials live (AskUserQuestion):
   - **System keychain** (default): `asc auth login --name "<project>" --key-id "<KEY_ID>" --issuer-id "<ISSUER_ID>" --private-key "<p8 path>" --network`
   - **Repo-local config** (CI or shared machines): same command plus `--bypass-keychain --local`, then add `.asc/` to `.gitignore`.
   Individual (non-team) keys add `--key-type individual`.
2. Find the app: take the bundle id confirmed in the detect step (or fastlane `Appfile` `app_identifier`) and run `asc apps list --bundle-id "<bundle id>" --output table`.
   - No match: the app record does not exist yet. The user creates it in App Store Connect → Apps → + (the API cannot), then re-run the lookup.
3. Verify: `asc auth doctor`, then `asc auth status --validate`.
4. Offer `asc init` (writes `ASC.md` and links it from `AGENTS.md` / `CLAUDE.md` so future agent sessions know the commands). Run it only on a yes.

Done when: `asc auth doctor` reports no errors, `asc auth status --validate` shows the profile valid, and the app lookup returned the app. Ledger note: profile name, storage choice, app id.

A failing check leaves the step `[ ]` with the error quoted in the ledger note.
