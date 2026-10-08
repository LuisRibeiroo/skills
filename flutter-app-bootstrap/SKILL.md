---
name: flutter-app-bootstrap
description: "Interactively bootstrap a new Flutter app: product vision, design system (via setup-ds or manual), architecture, packages, CLAUDE.md, and optional App Store / Play CLI setup (setup-store-cli). Use when: flutter bootstrap, bootstrap app, initialize flutter, /flutter-bootstrap, create flutter project, new flutter app, scaffold flutter app."
user-invocable: true
---

# Flutter App Bootstrap

Interactive Flutter project scaffolding. Asks structured questions, generates context/PRD files, then creates the project with selected targets, packages, and baseline code.

**Do NOT skip any phase. Complete all questions before generating or executing.**

---

## Companion Skills

Two sibling skills own parts of the bootstrap. The user may use them or define those parts manually.

| Skill | Owns | Used in |
|---|---|---|
| `setup-ds` | Design tokens, `DESIGN.md`, `COMPONENTS.md`, generated `app_tokens.g.dart` | 1.3 (ratify), 2.4 (create) |
| `setup-store-cli` | `asc` / `gpc` store CLIs, `docs/stores-steps.md` ledger | 1.6 (choose), Phase 3 (run) |

### Preflight (run before Phase 1)

Check each skill for `SKILL.md` under `~/.claude/skills/<name>/`, `~/.agents/skills/<name>/`, then `.claude/skills/<name>/`. Treat a skill as installed when any of them exists.

For every skill that is missing, ask once via `AskUserQuestion`:

- **Install from remote (Recommended)** → `npx skills add LuisRibeiroo/skills@<name> -g -y` (repo `git@github.com:LuisRibeiroo/skills.git`). If `npx` is unavailable or fails, fall back to `git clone --depth 1` into the scratchpad and copy `<name>/` to `~/.claude/skills/<name>/`. Re-check that `SKILL.md` exists afterwards. If the remote has no such folder, say so and continue without it.
- **Continue without it** → that part is defined manually (1.3 manual flow) or skipped (store CLIs).

A skill installed mid-session may not be invocable through the `Skill` tool until a restart. **How to run a companion skill:** invoke it with `Skill` when listed; otherwise `Read` its installed `SKILL.md` (and the step files it links) and follow it. `setup-store-cli` sets `disable-model-invocation`, so it is always followed by reading, and only after the user picks "now" in 1.6.

### Rules that apply while a companion runs

- **Project root.** `flutter create` makes `<app_name>/` under the working directory. From 2.1 on, every companion path (`design-system/`, `scripts/`, `docs/`, `lib/`) is relative to `<app_name>/`, not the parent.
- **Bootstrap owns the questions that exist before the project does.** Companions run in their draft/ratify halves during Phase 1 and their write halves during Phase 2 (design) or Phase 3 (stores). Never write project files from Phase 1.
- **Companion wins on its own files; bootstrap wins on files it owns** (`CLAUDE.md`, `.claude/rules/*`, `app_theme.dart`, git). Where both touch one concern, the table in each section below says who writes.

---

## Phase 1: Discovery

Ask the following question groups in order. Use `AskUserQuestion` when available; otherwise ask conversationally. Accept user overrides for any default.

### Document Import Protocol

**Apply this protocol at the start of every discovery section (1.1–1.5).**

Before asking questions for a section, ask the user:

> "Do you already have a document (markdown, text, PDF, etc.) covering **[section topic]**? If so, share the file path or paste its contents."

- **User provides a file** →
  1. Read and analyze the document.
  2. Map its contents against every required field for that section (see the field lists below each section).
  3. **If all required fields are covered** → confirm the extracted values with the user, reformat the content to match the internal markdown structure, and move to the next section. Do **not** re-ask questions that are already answered.
  4. **If any required fields are missing or ambiguous** → list the gaps explicitly and ask only for those missing items. Once filled, reformat and proceed.
- **User says no / skips** → proceed with the normal interactive questions for the section.

This avoids redundant questions when the user already has documentation, while still guaranteeing every required field is captured.

### 1.1 Product Vision

_Apply [Document Import Protocol](#document-import-protocol) first._

Required fields:

1. **App name** (used for project directory and `pubspec.yaml` name, snake_case)
2. **One-line description** (elevator pitch)
3. **Target audience**
4. **Core problem it solves**
5. **Target platforms** (multi-select, defaults: Android + iOS):
   - Android, iOS, Web, macOS, Windows, Linux
6. **Organization** (reverse-domain, e.g. `com.acme`) — **required when Android or iOS is selected**. Passed to `flutter create --org`, so it fixes the `applicationId` / bundle id (`<org>.<app_name>`). Do not accept the `flutter create` default `com.example`: store setup and Firebase would need the id renamed later. If the user insists, record it and warn that `setup-store-cli` and `flutterfire configure` will use the placeholder.

### 1.2 Wireframe

_Apply [Document Import Protocol](#document-import-protocol) first._

Required fields:

1. Does the user have a wireframe or screen list?
   - **Yes** → Collect screen descriptions/flows. Will generate `wireframe-prd.md`.
   - **No** → Will add a TODO in the generated `CLAUDE.md`.

### 1.3 Design System

_Apply [Document Import Protocol](#document-import-protocol) first; a supplied document feeds whichever path is chosen below._

#### Choose the design-system path

Ask via `AskUserQuestion` (skip the question and use **manual** when `setup-ds` is not installed after Preflight, or `node` is missing — `node --version` fails; say why):

- **Use `setup-ds` (Recommended)** → base design system: `design-system/tokens.json`, rules (`DESIGN.md`), component specs (`COMPONENTS.md`), generated `lib/core/design/app_tokens.g.dart`. Drive the user through it as below.
- **Define manually** → the manual flow below (tokens table, `MASTER.md`, hand-written `app_theme.dart`).

Record the choice as `ds_mode = setup-ds | manual`. The two paths never mix: they use different token class shapes and different canonical files (see [Design-system conflicts](#design-system-conflicts)).

#### Path A — `setup-ds`

Run only **steps 1–2** (survey, ratify) of `setup-ds` now; the write steps run at [2.4](#24-generate-theme). Pre-answer the survey so the user is not asked what bootstrap already knows:

- Platform: Flutter → `dart` output only (no `css`), path `lib/core/design/app_tokens.g.dart`. Not-yet-created project counts as "existing design system: none" unless the user supplies a document (next bullet).
- A design document from the import protocol (DESIGN.md, style guide, Figma export) is treated as the **existing design system** in setup-ds step 2: show defaults beside its values, ask keep / default / per rule.
- Optional **dimension** section: offer it neutrally (Flutter, not web).
- Keep the ratified draft in the scratchpad. **Do not write to the project.**

Bootstrap's own defaults table below (8pt grid, dark-only, `Inter`, style name) is **not used** on this path; `setup-ds` defaults and the user's ratified values replace it. Dark-only is recorded from the ratified `modes`. Style name has no `setup-ds` equivalent and is dropped.

#### Path B — manual

**If user provides a design document (DESIGN.md, style guide, Figma export, etc.):**
1. Read and analyze it.
2. Extract all design tokens, style name, component conventions, anti-patterns.
3. Map extracted content to the MASTER.md format (see [Section 2.6a](#26a-generate-design-system-master-file)).
4. Confirm mapped values with user; ask only about gaps.
5. The document replaces interactive questions below — do not re-ask covered fields.
6. Note: the source document is consumed into `design-system/<app_name>/MASTER.md`; the original file is not copied.

Required fields (present defaults and accept overrides):

| Token            | Default                                                               |
| ---------------- | --------------------------------------------------------------------- |
| Primary color    | `#6366F1` (Indigo)                                                    |
| Background color | `#000000`                                                             |
| Surface color    | `#1C1C1E`                                                             |
| Success color    | `#34C759`                                                             |
| Text primary     | `#FFFFFF`                                                             |
| Text secondary   | `#8E8E93`                                                             |
| Spacing scale    | 8pt grid: xs=4, sm=8, md=16, lg=24, xl=32                             |
| Border radius    | sm=8, md=16, pill=999                                                 |
| Font sizes       | displayLg=32, titleLg=20, bodyLg=16, bodyMd=14, labelMd=12, button=16 |
| Font weights     | bold=w700, semibold=w600, medium=w500, regular=w400                   |
| Line heights     | tight=1.2, normal=1.5, relaxed=1.75                                   |
| Font family      | `Inter` (alternatives: Poppins, Roboto, Nunito, Outfit)               |
| Dark-mode only   | Yes                                                                   |
| Style name       | `Modern Dark` (e.g. Bauhaus Neo-Brutalist, Glassmorphism, Claymorphism, Neumorphism, Minimalist) |

#### Design-system conflicts

Why the paths cannot mix, and what each does about it:

| Concern | Manual (Path B) | `setup-ds` (Path A) |
|---|---|---|
| Canonical source | `design-system/<app_name>/MASTER.md` | `design-system/tokens.json` (+ `DESIGN.md`, `COMPONENTS.md`) |
| Dart token classes | Hand-written in `app_theme.dart`: `AppColors` (static consts), `AppSpacing`, `AppRadius` (`Radius`), `AppFontSize`… | Generated in `app_tokens.g.dart` with the **same class names** but different shapes: `AppColors` is an instance (`AppColors.dark`), `AppRadius.md` is a `double`. Both in one project is a duplicate-definition error. |
| `app_theme.dart` | Declares the token classes and `AppTheme` | `lib/core/design/app_theme.dart` declares **only** `AppTheme` built from the generated tokens; never redeclares token classes |
| `.claude/rules/DESIGN.md` | Pointer to `MASTER.md` | Pointer to `design-system/DESIGN.md` + `COMPONENTS.md` (name clash with `design-system/DESIGN.md` is intentional: the rules file only points) |
| Agent pointer | In `CLAUDE.md` Design System section | Same text `setup-ds` step 4 writes, placed in `CLAUDE.md` by bootstrap (never create `AGENTS.md`) |
| Component widgets | `PressableCard`, `AppBottomSheet` (neo-brutalist press/border contract) | Not generated: they contradict `COMPONENTS.md` (pressed = `color.overlayPressed`, dialogs use `shadow.overlay`). Loading rule is shared: skeletons via `redacted`, spinner only inside a button |
| Per-page overrides | `design-system/<app_name>/pages/<page>.md` | None. Deviate by editing `tokens.json` and regenerating |

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

Skip when neither Android nor iOS is selected (say that `asc` / `gpc` cover only iOS and Android) or when `setup-store-cli` is not installed after Preflight.

Explain in one line: `setup-store-cli` installs `asc` (iOS) and `gpc` (Android), walks the Apple/Google console steps, and tracks progress in `docs/stores-steps.md`; every step is skippable and resumable. Ask via `AskUserQuestion`:

- **Now, after scaffolding (guided)** → runs as [Phase 3](#phase-3-store-clis).
- **Later** → at the end, tell the user to run `/setup-store-cli` from `<app_name>/`.
- **Skip** → say nothing more.

### 1.7 Confirmation

Present a **full summary** of all decisions from 1.1-1.6, including the organization / bundle id, `ds_mode`, and the store-CLI choice. Ask user to confirm before proceeding.

---

## Phase 2: Project Execution

Run sequentially after confirmation:

### 2.1 Create Project

```bash
flutter create --project-name <app_name> --org <org> --platforms <comma-separated> <app_name>
```

Omit `--org` only when neither Android nor iOS is selected. All later steps run with `<app_name>/` as the project root.

### 2.2 Add Dependencies

For each selected package:

```bash
flutter pub add <package_name>
```

This ensures latest compatible versions in caret format.

### 2.3 Firebase Setup (if firebase packages selected)

```bash
dart pub global activate flutterfire_cli
flutterfire configure
```

If Firebase CLI is not available or auth fails, add to `CLAUDE.md`:

```
<!-- TODO: Run `flutterfire configure` to link Firebase project -->
```

### 2.4 Generate Theme

**Path B (manual):** write `lib/core/constants/app_theme.dart` using the "AppTheme (manual)" template from [templates.md](templates.md) with design system values from 1.3.

**Path A (`setup-ds`):** run `setup-ds` **steps 3–5** against `<app_name>/` with the draft from 1.3, with these adjustments:

- Step 3 as written: `design-system/tokens.json` (output: `dart` only), `scripts/generate-design-tokens.mjs`, `design-system/DESIGN.md`, `design-system/COMPONENTS.md`, generator then `--check` (both exit 0).
- Step 4.1 (agent pointer): **skip here**; the pointer text goes into `CLAUDE.md` in 2.6 so `AGENTS.md` is not created.
- Step 4.2 (wiring): already decided and approved by choosing this path. Write `lib/core/design/app_theme.dart` from the "AppTheme (setup-ds)" template in [templates.md](templates.md), then point `MaterialApp` at it in `lib/main.dart` (`theme` / `darkTheme` per the ratified `modes`).
- Step 5 (report): fold into the 2.8 summary instead of printing separately.

Never write `AppColors`, `AppSpacing`, `AppRadius`, `AppFontSize`, `AppFontWeight` or `AppLineHeight` by hand on this path; they come from `app_tokens.g.dart`.

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

### 2.6a Generate Design System Master File

**Path A (`setup-ds`): skip this step.** `design-system/tokens.json`, `DESIGN.md` and `COMPONENTS.md` are the canonical design system; a second `MASTER.md` would be a competing source.

**Path B (manual):** write `design-system/<app_name>/MASTER.md` using the MASTER.md template from [templates.md](templates.md).

This is the **canonical, machine-readable design system** that the `ui-ux-pro-max` skill operates on. It must contain:
- Global Rules: Color Palette, Typography, Spacing, Border Depths, Border Radius
- Component Specs: Buttons, Cards, Inputs, Bottom Sheets/Modals, Loading States
- Style Guidelines (style name, keywords, effects)
- Anti-Patterns (explicit prohibitions)
- Pre-Delivery Checklist

Fill all token values from discovery section 1.3. If user imported a design document in 1.3, use the mapped values extracted from it.

**Override logic:** When building a specific page, code should first check `design-system/<app_name>/pages/[page-name].md`. If that file exists, its rules override this Master file. If not, strictly follow the Master file.

### 2.6 Generate Context Files

Write the following files using templates from [templates.md](templates.md). All rule files go into `{projectRoot}/.claude/rules/`.

1. **`CLAUDE.md`** (project root) — Fill baseline template with all discovery answers. Keep this as the top-level agent context file with commands, architecture overview, and key dependencies. Fill `{{DESIGN_SYSTEM_SECTION}}` with the section matching `ds_mode` (see [templates.md](templates.md)); on Path A that section carries the `setup-ds` agent pointer.

2. **`.claude/rules/PRODUCT.md`** — Product vision and wireframe rules. Include:
   - App name, one-line description, target audience, core problem
   - Target platforms
   - Screen list / wireframe flows (from 1.2), or a TODO if none provided
   - Navigation structure and key user journeys

3. **`.claude/rules/DESIGN.md`** — **Pointer file only.** Do NOT inline tokens here.
   - **Path B (manual):** use the DESIGN.md pointer template from [templates.md](templates.md). This file must:
     - Reference `design-system/<app_name>/MASTER.md` as the canonical source
     - State that `ui-ux-pro-max` skill (`--stack flutter`) is used for all design/UI work
     - Include a compact quick-reference summary of key tokens (colors, spacing, radius, font family) for at-a-glance use
     - List absolute prohibitions (hardcoded values, shadows, etc.) matching the MASTER.md anti-patterns
   - **Path A (`setup-ds`):** use the "DESIGN.md pointer (setup-ds)" template. It references `design-system/DESIGN.md`, `COMPONENTS.md`, `tokens.json` and the regenerate command; no token values, no quick-reference table (values live in `tokens.json`). `ui-ux-pro-max` may inform layout and UX, but never overrides the tokens or specs.

4. **`.claude/rules/CODE-STYLE.md`** — Architecture and coding conventions. Include:
   - Architecture pattern (MVVM, etc.) and folder structure from 1.4
   - Design patterns (optimistic state, command pattern, Result objects)
   - State management and DI choices
   - Widget organization rules (one widget per file, extensions first)
   - Path A only: token rule — UI code reads `AppColors` (via `context.colors`), `AppSpacing`, `AppRadius`, `AppFontSize`… from `app_tokens.g.dart`; never edit generated files, change `tokens.json` and run `node scripts/generate-design-tokens.mjs`
   - Testing policy
   - Key packages from 1.5 with category table
   - Engineering principles (small functions, DRY, edge-case first, fail fast)

### 2.7 Git Repository

Ask the user how they want to handle version control. Use `AskUserQuestion` when available:

**Options:**

- **Create a new repo** → Initialize locally and create a remote on GitHub via `gh repo create`.
- **Connect to an existing repo** → User provides the remote URL; add it as `origin`.
- **Skip** → No git setup; add a TODO reminder in `CLAUDE.md`.

#### Create a new repo

```bash
git init
git add .
git commit -m "Initial commit — scaffolded with flutter-app-bootstrap"
gh repo create <app_name> --private --source=. --push
```

If `gh` CLI is not authenticated or unavailable, fall back to local-only init and add a TODO:

```
<!-- TODO: Create remote repo and run `git remote add origin <url> && git push -u origin main` -->
```

Ask the user whether the repo should be **public** or **private** (default: private).

#### Connect to an existing repo

```bash
git init
git add .
git commit -m "Initial commit — scaffolded with flutter-app-bootstrap"
git remote add origin <user-provided-url>
git push -u origin main
```

If push fails (e.g. non-empty remote), warn the user and suggest resolving manually. Do **not** force push.

#### Skip

Add to `CLAUDE.md`:

```
<!-- TODO: Initialize git and connect to a remote repository -->
```

### 2.8 Finalize

1. Run `flutter pub get`
2. Path A only: run `node scripts/generate-design-tokens.mjs --check`; it must exit 0
3. Run `flutter analyze` and fix issues
4. Present summary of everything created (Path A: include the `setup-ds` report — files written, regenerate command)
5. Remind: start app via IDE debug, not `flutter run`

---

## Phase 3: Store CLIs

Only when the user chose **Now** in 1.6. Runs after 2.8, so a failure or a long console session never blocks the scaffold.

1. Follow `setup-store-cli` (read its installed `SKILL.md` and step files) with `<app_name>/` as the project root.
2. Pre-answers that remove its detection questions:
   - Step 1 (detect platforms): iOS / Android presence and the identifier `<org>.<app_name>` come from 1.1; still let the user correct them.
   - Step 3 (deploy process): a fresh scaffold has none, so it records `none found`.
3. Its rules apply unchanged: secrets never go in chat, ledger or git; confirm before installing software or running remote install scripts.
4. The ledger `docs/stores-steps.md` and any `.gitignore` additions are written after the 2.7 commit. **Do not commit them**; list them as uncommitted in the final message.

If the user chose **Later** in 1.6, end with: run `/setup-store-cli` from `<app_name>/` to resume at any time.

---

## Checklist

Before finishing:

- [ ] Companion skills checked (installed, or user declined)
- [ ] All question groups (1.1–1.6) answered; organization set when Android/iOS selected
- [ ] User confirmed summary
- [ ] `flutter create` succeeded (with `--org`)
- [ ] All packages added
- [ ] Firebase configured (or TODO added)
- [ ] `app_theme.dart` generated
- [ ] Base extensions copied
- [ ] Path A: `tokens.json`, `DESIGN.md`, `COMPONENTS.md`, generator and `app_tokens.g.dart` exist; `--check` exits 0; no hand-written token classes
- [ ] Path B: `design-system/<app_name>/MASTER.md` generated (full canonical design system)
- [ ] `CLAUDE.md` generated
- [ ] `.claude/rules/PRODUCT.md` generated
- [ ] `.claude/rules/DESIGN.md` generated (pointer only — no inline tokens)
- [ ] `.claude/rules/CODE-STYLE.md` generated
- [ ] Git repo created, connected, or TODO added
- [ ] `flutter analyze` passes
- [ ] Store CLIs: ran Phase 3, told user to run `/setup-store-cli` later, or skipped
