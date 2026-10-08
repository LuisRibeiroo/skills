---
name: flutter-app-bootstrap
description: "Bootstrap a new Flutter app end to end: discovery interview, project scaffold, design system, packages, CLAUDE.md and rules, optional App Store / Play CLIs. Use when the user wants to create, scaffold, or bootstrap a Flutter app."
user-invocable: true
---

# Flutter App Bootstrap

Interview first, then scaffold. Run the phases in order and finish every question before generating or executing.

## Companion skills

Two sibling skills own parts of the bootstrap: `setup-ds` (design system, branch of 1.3 and 2.4) and `setup-store-cli` (`asc` / `gpc`, Phase 3). The user picks a companion or defines that part manually.

### Preflight (before Phase 1)

A companion is installed when `SKILL.md` exists under `~/.claude/skills/<name>/`, `~/.agents/skills/<name>/`, or `.claude/skills/<name>/`.

For each missing companion, ask once via `AskUserQuestion`:

- **Install from remote (Recommended)** → `npx skills add LuisRibeiroo/skills@<name> -g -y` (repo `git@github.com:LuisRibeiroo/skills.git`). When `npx` fails, `git clone --depth 1` into the scratchpad and copy `<name>/` to `~/.claude/skills/<name>/`. When the remote lacks the folder, say so and continue without it.
- **Continue without it** → that part is defined manually (design) or skipped (store CLIs).

Done when: each companion is installed (`SKILL.md` re-checked after an install) or the user declined it.

### Running a companion

Invoke it with `Skill` when listed; otherwise `Read` its installed `SKILL.md` and the step files it links, and follow them. `setup-store-cli` sets `disable-model-invocation`, so it is always followed by reading, and only after the user picks "now" in 1.6. A skill installed mid-session may need a restart before `Skill` lists it.

- **Project root.** From 2.1 on, every companion path (`design-system/`, `scripts/`, `docs/`, `lib/`) is relative to `<app_name>/`, the folder `flutter create` makes under the working directory.
- **Draft in Phase 1, write in Phase 2.** Companions run their ratify/draft half during Phase 1 (scratchpad only) and their write half in Phase 2 (design) or Phase 3 (stores).
- **Ownership.** The companion owns its own files; bootstrap owns `CLAUDE.md`, `.claude/rules/*`, `app_theme.dart` and git.

---

## Phase 1: Discovery

Ask the question groups in order. Use `AskUserQuestion` when available; otherwise ask conversationally. Accept user overrides for any default.

### Document Import Protocol

Apply at the start of every section 1.1–1.5. Ask:

> "Do you already have a document (markdown, text, PDF, etc.) covering **[section topic]**? If so, share the file path or paste its contents."

- **File provided** → read it and map it against the section's required fields. All covered → confirm the extracted values and reformat; skip those questions. Gaps → list them and ask only for those.
- **No / skip** → ask the section's questions.

### 1.1 Product Vision

_Apply [Document Import Protocol](#document-import-protocol) first._

Required fields:

1. **App name** (used for project directory and `pubspec.yaml` name, snake_case)
2. **One-line description** (elevator pitch)
3. **Target audience**
4. **Core problem it solves**
5. **Target platforms** (multi-select, defaults: Android + iOS): Android, iOS, Web, macOS, Windows, Linux
6. **Organization** (reverse-domain, e.g. `com.acme`) — required when Android or iOS is selected. It goes to `flutter create --org` and fixes the `applicationId` / bundle id (`<org>.<app_name>`). `com.example` is the `flutter create` placeholder; ask for a real domain, because store setup and Firebase would otherwise need the id renamed later. When the user keeps the placeholder, record it and warn that `setup-store-cli` and `flutterfire configure` will use it.

Done when: fields 1–5 have values, and field 6 has one when a mobile platform is selected.

### 1.2 Wireframe

_Apply [Document Import Protocol](#document-import-protocol) first._

Required fields:

1. Does the user have a wireframe or screen list?
   - **Yes** → Collect screen descriptions/flows. Will generate `wireframe-prd.md`.
   - **No** → Will add a TODO in the generated `CLAUDE.md`.

### 1.3 Design System

_Apply [Document Import Protocol](#document-import-protocol) first; a supplied document feeds the chosen path._

Ask via `AskUserQuestion`. When `setup-ds` is not installed after Preflight, or `node --version` fails, use **manual** and say why.

- **Use `setup-ds` (Recommended)** → base design system: tokens, rules, component specs, generated Dart tokens.
- **Define manually** → hand-written tokens, `MASTER.md`, `app_theme.dart`.

Record `ds_mode = setup-ds | manual`, then run the **Discover** section of its branch file: [design-setup-ds.md](design-setup-ds.md) or [design-manual.md](design-manual.md). The paths stay apart because both write token classes with the same names (see the branch file).

Done when: `ds_mode` is recorded and the branch file's Discover criterion holds.

### 1.4 Architecture

_Apply [Document Import Protocol](#document-import-protocol) first._

Required fields (present and ask if user wants to customize):

**Default:** MVVM with Command pattern per [Flutter architecture guide](https://docs.flutter.dev/app-architecture/guide)

**Design patterns** ([reference](https://docs.flutter.dev/app-architecture/design-patterns)):

- Optimistic state
- Command pattern
- Error handling with Result objects

**Default folder structure:**

- `lib/ui/` - Views + ViewModels
- `lib/data/` - Repositories + Services
- `lib/domain/` - Models, use cases (optional)
- `lib/core/` - Constants, extensions, DI, routing

**State management:** `signals` (accept override)

**DI:** `auto_injector` (accept override)

### 1.5 Packages

_Apply [Document Import Protocol](#document-import-protocol) first._

Present each category from [package-catalog.md](package-catalog.md) with defaults and pub.dev links. Accept overrides or removals per category.

### 1.6 Store CLIs

Applies when Android or iOS is selected and `setup-store-cli` is installed; otherwise skip, and when only desktop/web is selected say that `asc` / `gpc` cover iOS and Android.

One line of context: `setup-store-cli` installs `asc` (iOS) and `gpc` (Android), walks the Apple/Google console steps, and tracks progress in `docs/stores-steps.md`; every step is skippable and resumable. Ask:

- **Now, after scaffolding (guided)** → [Phase 3](#phase-3-store-clis).
- **Later** → Phase 3 ends with the resume instruction.
- **Skip** → nothing further.

### 1.7 Confirmation

Present a **full summary** of 1.1–1.6, including organization / bundle id, `ds_mode` and the store-CLI choice.

Done when: the user confirmed the summary.

---

## Phase 2: Project Execution

Run sequentially after confirmation.

### 2.1 Create Project

```bash
flutter create --project-name <app_name> --org <org> --platforms <comma-separated> <app_name>
```

Drop `--org` only when neither Android nor iOS is selected. All later steps run with `<app_name>/` as project root.

Done when: `flutter create` exits 0.

### 2.2 Add Dependencies

For each selected package:

```bash
flutter pub add <package_name>
```

Done when: every selected package is in `pubspec.yaml`.

### 2.3 Firebase Setup (if firebase packages selected)

```bash
dart pub global activate flutterfire_cli
flutterfire configure
```

If Firebase CLI is not available or auth fails, add to `CLAUDE.md`:

```
<!-- TODO: Run `flutterfire configure` to link Firebase project -->
```

### 2.4 Design System

Run the **Create** section of the branch file for `ds_mode`.

Done when: the branch file's Create criterion holds.

### 2.5 Bootstrap Extensions

Read the extension template files from this skill's `templates/extensions/` folder and copy into the project:

| Skill template                                          | Project destination                            |
| ------------------------------------------------------- | ---------------------------------------------- |
| `templates/extensions/core/string_ext.dart`             | `lib/core/extensions/string_ext.dart`          |
| `templates/extensions/core/map_ext.dart`                | `lib/core/extensions/map_ext.dart`             |
| `templates/extensions/core/list_ext.dart`               | `lib/core/extensions/list_ext.dart`            |
| `templates/extensions/presentation/context_ext.dart`    | `lib/ui/shared/extensions/context_ext.dart`    |
| `templates/extensions/presentation/num_extensions.dart` | `lib/ui/shared/extensions/num_extensions.dart` |

If the user chose a different UI layer path in 1.4, adjust presentation extension destinations accordingly.

### 2.6 Generate Context Files

Write the following files from [templates.md](templates.md) and the branch file's **Context-file fills**. Rule files go into `<app_name>/.claude/rules/`.

1. **`CLAUDE.md`** (project root) — the baseline template filled with all discovery answers: commands, architecture overview, key dependencies. `{{DESIGN_SYSTEM_SECTION}}` comes from the branch file.

2. **`.claude/rules/PRODUCT.md`** — App name, one-line description, target audience, core problem; target platforms; screen list / wireframe flows (from 1.2) or a TODO; navigation structure and key user journeys.

3. **`.claude/rules/DESIGN.md`** — pointer file: links to the canonical design system and carries no token values. Template and contents come from the branch file.

4. **`.claude/rules/CODE-STYLE.md`** — Architecture and coding conventions:
   - Architecture pattern (MVVM, etc.) and folder structure from 1.4
   - Design patterns (optimistic state, command pattern, Result objects)
   - State management and DI choices
   - Widget organization rules (one widget per file, extensions first)
   - The branch file's CODE-STYLE addition, when it has one
   - Testing policy
   - Key packages from 1.5 with category table
   - Engineering principles (small functions, DRY, edge-case first, fail fast)

Done when: the four files exist and no `{{PLACEHOLDER}}` remains in them.

### 2.7 Git Repository

Ask how to handle version control:

- **Create a new repo** → Initialize locally and create a remote on GitHub via `gh repo create`; ask whether it is **public** or **private** (default private).
- **Connect to an existing repo** → User provides the remote URL; add it as `origin`.
- **Skip** → Add `<!-- TODO: Initialize git and connect to a remote repository -->` to `CLAUDE.md`.

New repo:

```bash
git init
git add .
git commit -m "Initial commit — scaffolded with flutter-app-bootstrap"
gh repo create <app_name> --private --source=. --push
```

When `gh` is unauthenticated or unavailable, keep the local init and add `<!-- TODO: Create remote repo and run `git remote add origin <url> && git push -u origin main` -->` to `CLAUDE.md`.

Existing repo:

```bash
git init
git add .
git commit -m "Initial commit — scaffolded with flutter-app-bootstrap"
git remote add origin <user-provided-url>
git push -u origin main
```

When the push fails (e.g. non-empty remote), warn the user and suggest resolving it manually; a force push stays off the table.

Done when: the commit exists and the remote is connected, or the TODO is in `CLAUDE.md`.

### 2.8 Finalize

1. Run `flutter pub get`.
2. Run the branch file's **Verify** step, then `flutter analyze`, and fix issues.
3. Present a summary of everything created (the `setup-ds` report included on that path).
4. Remind: start the app via IDE debug, not `flutter run`.

Done when: Verify and `flutter analyze` are clean.

---

## Phase 3: Store CLIs

Runs after 2.8 when the user chose **Now** in 1.6, so a long console session never blocks the scaffold.

1. Follow `setup-store-cli` with `<app_name>/` as project root.
2. Pre-answers: its step 1 (detect platforms) takes presence and the identifier `<org>.<app_name>` from 1.1, and the user can still correct them; its step 3 (deploy process) records `none found`, since a fresh scaffold has none.
3. Its own rules apply: secrets stay out of chat, ledger and git; software installs and remote install scripts need confirmation.
4. The ledger `docs/stores-steps.md` and any `.gitignore` additions land after the 2.7 commit. Leave them uncommitted and list them in the final message.

When the user chose **Later**, end with: run `/setup-store-cli` from `<app_name>/` to resume.

Done when: `setup-store-cli` reports every step done or skipped by the user, or the resume instruction was given.

---

## Checklist

Before finishing:

- [ ] Companions installed or declined
- [ ] 1.1–1.6 answered, summary confirmed
- [ ] Project created with `--org`, packages added, Firebase configured (or TODO)
- [ ] Design system: branch file's Create and Verify criteria hold
- [ ] Base extensions copied
- [ ] `CLAUDE.md`, `PRODUCT.md`, `DESIGN.md`, `CODE-STYLE.md` generated
- [ ] Git created, connected, or TODO added
- [ ] `flutter analyze` passes
- [ ] Store CLIs: Phase 3 ran, resume instruction given, or skipped
