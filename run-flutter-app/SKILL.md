---
name: run-flutter-app
description: "Run a Flutter app on mobile (device or simulator) or web in a live terminal tab with hot reload. Use when the user wants the app running."
user-invocable: true
---

# Run Flutter App

Resolve what to run and where, then start `flutter run` in a **live terminal tab** the user owns. Stdin stays open, so `r` (hot reload), `R` (hot restart), `q` (quit) work and logs keep streaming.

Resolve in order. Collect every unresolved item (device, flavor, entrypoint, config) and ask them together in one question batch.

## 1. Project and SDK runner

- Project root: nearest directory holding a `pubspec.yaml` that depends on `flutter`. Several candidates (monorepo, melos) or none: ask which app.
- Runner prefix: `.fvmrc` or `.fvm/` → `fvm flutter`; `.puro.json` → `puro flutter`; else `flutter`.
- `.dart_tool/package_config.json` missing → run `<runner> pub get` first.

## 2. Run config

Look for `.vscode/launch.json` (at the root, or its workspace root above it).

**Found, with `"type": "dart"` configs** → it wins. Read it as JSONC (comments and trailing commas are legal; `jq` fails). Pick the config:

- User's words match a config `name` → that one.
- One dart config → that one. Several → ask. `compounds` → ask for a single member.

Map fields to the command:

| Field | Becomes |
|---|---|
| `cwd` | directory to run in (`${workspaceFolder}` = folder containing `.vscode`) |
| `program` | `-t <program>` (omit when `lib/main.dart`) |
| `deviceId` | `-d <id>` |
| `args`, `toolArgs` | appended verbatim (flavor, `--dart-define*`) |
| `flutterMode` | `--profile` / `--release`; omitted = debug |
| `env` | `KEY=value` prefix |
| `"request": "attach"` | `flutter attach` in place of `flutter run` |

`preLaunchTask` or any variable beyond `${workspaceFolder}` (`${env:X}`, `${input:X}`) → open item, ask.

**Not found** → discover, in this order:

1. A documented run command wins: `README`, `CLAUDE.md`, `Makefile`, `justfile`, `melos.yaml` scripts, `scripts/run*`.
2. Entrypoints: `lib/main.dart` plus `lib/main_*.dart`. More than one → ask.
3. Flavors: `productFlavors` in `android/app/build.gradle(.kts)`, non-`Runner` schemes under `ios/Runner.xcodeproj/xcshareddata/xcschemes/`. Any found → `--flavor` is required; ask which.
4. Config injection: `.env*`, `env/*.json`, `config/*.json`, `--dart-define-from-file` mentioned in docs. Any found → ask which file.
5. Nothing ambiguous → plain `flutter run`.

Once resolved without a launch.json, offer to save it as `.vscode/launch.json` so the next run is deterministic.

## 3. Platform and device

Platforms come from the project folders: `android/` or `ios/` → mobile, `web/` → web.

Precedence: platform or device named in the user's request → config `deviceId` → the rule for the project's platforms:

- **Mobile and web**: ask which one (mobile device, simulator, or web). Ask even when only one device is listed; the list cannot say which platform the user wants.
- **Mobile only**: no platform question; resolve the mobile device below.
- **Web only**: `-d chrome`. No `chrome` in the device list → ask, offering the other web devices listed (`web-server`).

Resolve the device:

1. List: `<runner> devices` (add `--machine` for parsing). Candidates are the devices of the chosen platform.
2. Requested device is an iOS simulator or Android emulator that is not booted: `xcrun simctl boot <udid>` / `<runner> emulators --launch <id>`. Opening `Simulator.app` is blocked in some sandboxes; if so, give the user the `open -a Simulator` command.
3. Zero matches or several matches → ask, listing the candidates by name and id. One mobile device available and none requested → use it.

Release mode has no hot reload; say so when `flutterMode` or the request asks for it.

Done when one device id is resolved.

## 4. Launch

Compose one command, state it in a single line (runner, target, device, flags), then run it.

1. `list_terminal_tabs`: a tab already running `flutter run` → ask: reuse (send `R`), restart, or keep and open another.
2. Open a new terminal tab (`open_terminal_tab`) and run the command with `run_in_terminal`, from the resolved `cwd`. Both are deferred tools: load them via `ToolSearch` first.
3. No terminal tool (other agents): print the command in a `bash` fenced block for the user to paste in their own terminal, and stop there.

Launch through the terminal tab only; Bash-tool runs, background or not, have no stdin.

Done when `read_terminal` on that tab shows `Flutter run key commands` (app attached) or an error. Poll with `wait_for_output_ms` while it builds.

- Attached: report the tab, device, and keys (`r` reload, `R` restart, `q` quit, `h` help). Logs stream in the tab; read it on request. Then connect Dart MCP (below).
- Error: quote the first failing line and name the cause. Retry only after a clear fix (`pub get`, boot the simulator, pick another device) and ask before any change to project files.

## 5. Dart MCP

Runs after the app is attached, only when the `dart` MCP tools are in this session (load `dtd` via `ToolSearch` if deferred). Not available → skip silently; the user reloads from the tab.

1. `dtd` `listDtdUris`. Pick the URI for this project; when none stands out, use the `ws://…` Dart Tooling Daemon URI printed in the tab.
2. `dtd` `connect` with that URI, then `listConnectedApps`.
3. Done when the app on the chosen device appears in `listConnectedApps`. Report "Dart MCP connected" so code edits can end in `hot_reload` / `hot_restart`. No match → say so and leave the tab running.

The tab keeps ownership of the session: use `hot_reload` and `hot_restart` for edits, and leave `q` to the user.
