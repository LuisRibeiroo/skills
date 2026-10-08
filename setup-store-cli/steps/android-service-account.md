# android-service-account — Google Cloud service account key

`gpc` authenticates with a service account JSON key that has the Google Play Android Developer API enabled.

## Reuse scan

Run when fastlane or another process exists. Look for:

- `json_key_file(` / `json_key_data_raw` in `fastlane/Appfile`
- env names `SUPPLY_JSON_KEY`, `SUPPLY_JSON_KEY_DATA`
- JSON files containing `"type": "service_account"` under the repo, `~/.config`, `~/.android`: search with `grep -l`, so file contents never print.

For a candidate file, show only its path and `jq -r .client_email`. Never print `private_key`. Ask **Reuse this key** / **Create a new one**. A key that fastlane `supply` already uses has Play Console access already, so `android-play-access` is likely satisfied; the `android-login` verification confirms it.

## Create a new key

Ask which route (AskUserQuestion):

- **Automated**: `gpc setup --auto` (needs `gcloud` installed and logged in). It creates the service account, enables the API, and downloads the key, all actions in the user's Google Cloud account: get explicit confirmation of the Cloud project first. The wizard is interactive, so have the user run it in their terminal tab.
- **Manual**, in the browser:
  1. <https://console.cloud.google.com/iam-admin/serviceaccounts> → pick or create a project → Create service account (no project roles needed).
  2. Enable **Google Play Android Developer API** for that project (APIs & Services → Library).
  3. Service account → Keys → Add key → JSON. The file downloads once.
  4. Move it outside the repo, e.g. `~/.config/gpc/<project>-play-sa.json`, then `chmod 600` it.

## Done when

The JSON path is known and readable, `jq -r .type` prints `service_account`, the key sits outside the repo or matches a `.gitignore` entry, and its `client_email` is known. Ledger note: JSON path, `client_email`, and `reused from fastlane` or `new`.
