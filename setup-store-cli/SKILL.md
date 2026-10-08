---
name: setup-store-cli
description: Set up asc (App Store Connect CLI) and gpc (Google Play CLI) for the iOS and Android apps in this repo, resumable step by step.
disable-model-invocation: true
---

Configure `asc` (iOS, [rorkai/App-Store-Connect-CLI](https://github.com/rorkai/App-Store-Connect-CLI)) and `gpc` (Android, [AndroidPoet/playconsole-cli](https://github.com/AndroidPoet/playconsole-cli)) for the platforms this repo ships. Every step can be skipped and resumed later; progress lives in the **ledger**, `stores-steps.md` in the project's docs folder.

## Steps

### 1. Detect platforms

Search the repo (max depth 4, skip `node_modules`, `Pods`, `build`, `.dart_tool`, `.git`):

- **iOS**: `*.xcodeproj`, `*.xcworkspace`, `ios/Runner`, `Package.swift` with an app target, `project.yml`.
- **Android**: `AndroidManifest.xml`, `build.gradle(.kts)` applying `com.android.application`, `android/app`.

Cross-platform repos (Flutter, React Native, Expo) show both. Report what was found with the matching bundle id / `applicationId`, and let the user correct it.

Done when: each platform is marked present or absent, and every present platform has a confirmed identifier.

### 2. Open the ledger

Locate the docs folder: first existing of `docs/`, `doc/`, `documentation/`; create `docs/` when none exists. If `<docs>/stores-steps.md` exists, read it and keep its statuses. Otherwise create it from [ledger-template.md](ledger-template.md), keeping only the sections for present platforms.

Done when: the ledger exists and lists one line per step ID of each present platform.

### 3. Resolve the deploy process

Read [steps/deploy-process.md](steps/deploy-process.md). Skip when the ledger already records a decision.

Done when: the ledger records `switch`, `keep`, or `alongside`, or no existing process was found.

### 4. Walk the open steps

List the steps that are not `[x]`. Offer them in table order, by calling AskUserQuestion per step with **Do it now** / **Skip for later**. Resume offer: when the ledger already has progress, lead with the first open step and let the user pick any other open one.

For a step the user does now:
1. Read its step file, only then.
2. Run the **reuse scan** first when the file has one, and ask before reusing any credential found.
3. Carry out the step; the user performs every action in Apple, Google, or Play web consoles, you guide.
4. Update the ledger line the moment the step's completion criterion is met: `[x]` plus a one-line note.

For a skipped step: mark `[-]` with the reason. A step whose prerequisite is not `[x]` stays `[ ]` and is shown as blocked, not offered.

Done when: every open step was either completed or skipped by the user's explicit choice.

### 5. Close out

Print the ledger's remaining `[-]` and `[ ]` lines and tell the user to run `/setup-store-cli` again to resume.

Done when: the user has seen what remains and the ledger matches reality.

## Step table

| ID | Platform | File | Needs |
|---|---|---|---|
| `ios-tool` | iOS | [steps/ios-tool.md](steps/ios-tool.md) | — |
| `ios-api-key` | iOS | [steps/ios-api-key.md](steps/ios-api-key.md) | — |
| `ios-login` | iOS | [steps/ios-login.md](steps/ios-login.md) | `ios-tool`, `ios-api-key` |
| `android-tool` | Android | [steps/android-tool.md](steps/android-tool.md) | — |
| `android-service-account` | Android | [steps/android-service-account.md](steps/android-service-account.md) | — |
| `android-play-access` | Android | [steps/android-play-access.md](steps/android-play-access.md) | `android-service-account` |
| `android-login` | Android | [steps/android-login.md](steps/android-login.md) | `android-tool`, `android-service-account`, `android-play-access` |

## Rules

- **Latest stable** means the newest non-prerelease GitHub release (`gh api repos/<owner>/<repo>/releases/latest`), not what a package manager happens to carry. Each tool step compares installed against that tag.
- **Secrets stay out of chat, ledger, and git.** Ask for file *paths*, never contents. The ledger holds paths outside the repo, key ids, and emails only. Keep `.p8` and service-account JSON outside the repo, and add any in-repo secret path to `.gitignore` before the step is done.
- **Confirm before** installing software, running remote install scripts, or any `gpc setup --auto` cloud action.
- Switching from fastlane never deletes fastlane files; migrating lanes is a separate task.
