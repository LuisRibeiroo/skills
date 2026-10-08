# android-tool — install or upgrade gpc

Source: `AndroidPoet/playconsole-cli` (Homebrew formula `playconsole-cli`, binary `gpc`). Release tags carry a `v` prefix (`v0.5.17`); strip it when comparing. Other projects also ship a `gpc` binary, so identify the right one first.

1. Latest stable: `gh api repos/AndroidPoet/playconsole-cli/releases/latest --jq .tag_name`
2. Installed: `gpc version` (first line must say `playconsole-cli`; anything else is a different tool: show `which -a gpc` and ask the user how to proceed).
3. Equal: done. Otherwise, with the user's go-ahead:
   - Missing: `brew install androidpoet/tap/gpc`
   - Older: `brew update && brew upgrade playconsole-cli`
4. Re-check. If brew still trails the release, ask permission, download `playconsole-cli_<version>_darwin_<arm64|amd64>.tar.gz` and `checksums.txt` from the release into a fresh directory, verify with `shasum -a 256 -c`, and place `gpc` on `PATH` ahead of the brew copy.

Done when: `gpc version` equals the latest release tag. Ledger note: the version.
