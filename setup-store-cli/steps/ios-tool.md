# ios-tool — install or upgrade asc

Source: `rorkai/App-Store-Connect-CLI`. Release tags have no `v` prefix (`5.13.0`).

1. Latest stable: `gh api repos/rorkai/App-Store-Connect-CLI/releases/latest --jq .tag_name`
2. Installed: `asc --version` (leading semver) and `which -a asc`.
3. Equal: done. Otherwise, with the user's go-ahead:
   - Missing: `brew install asc`
   - Older: `brew update && brew upgrade asc`
4. Re-check. Homebrew can trail the release (seen: brew 5.9.1 vs release 5.13.0). If still older, ask permission, then use the official script: `curl -fsSL https://asccli.sh/install | bash`.
5. If `which -a asc` lists several binaries, make sure the first one reports the latest version; tell the user which to remove or reorder on `PATH`.

Done when: `asc --version` equals the latest release tag. Ledger note: the version.
