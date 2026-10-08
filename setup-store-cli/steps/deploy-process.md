# Deploy process

## Detect

Look for an existing release process:

- **fastlane**: `fastlane/` (`Fastfile`, `Appfile`, `Matchfile`), `Gemfile` listing `fastlane`.
- **Other**: CI files invoking store uploads (`.github/workflows/*`, `.gitlab-ci.yml`, `codemagic.yaml`, `bitrise.yml`, `Jenkinsfile`) matching `upload-testflight|altool|notarytool|upload-google-play|supply|publishReleaseBundle`; `eas.json` with a `submit` block; Gradle `com.github.triplet.play`.

No match: record `none found` in the ledger and finish this step.

## Ask

AskUserQuestion, naming what was found and where:

- **Switch to asc/gpc** — set up the CLIs as the deploy path. Fastlane files stay untouched.
- **Keep current** — mark every open step `[-] keeping <tool>` and stop the skill.
- **Keep current, add CLIs alongside** — set up the CLIs for ad hoc use; the current process stays the deploy path.

Record the choice, tool name, and date on the ledger's `Deploy process` line.

## Hand over to the credential scans

When fastlane is present, the **reuse scan** in `ios-api-key` and `android-service-account` reads its credentials. Say so now: "I'll check fastlane for existing keys before creating new ones."
