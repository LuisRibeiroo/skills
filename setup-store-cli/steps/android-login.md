# android-login — authenticate gpc and verify

1. Package name: `applicationId` in `app/build.gradle(.kts)` or `android/app/build.gradle(.kts)`, else fastlane `Appfile` `package_name`. Confirm with the user.
2. Login: `gpc auth login --name "<project>" --credentials "<json path>" --default-package "<package>"` (stored in `~/.playconsole-cli/config.json`).
3. Project defaults: `gpc init --package "<package>" --track internal` writes `.gpc.yaml` (no secrets, safe to commit). Ask the preferred default track first; `internal` is the safe default.
4. Verify: `gpc doctor --verbose`, then `gpc apps get --package "<package>"`.

Done when: `gpc doctor` passes every check and `gpc apps get` returns the app. Ledger note: profile name, package, default track.

If a check fails with 403 or "no access": confirm `android-play-access` was saved, wait for propagation, and leave this step `[ ]` with the quoted error in the ledger note. If the app is not found, it needs its first manual upload in Play Console.
