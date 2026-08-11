---
name: flutter-app-bootstrap
description: "Interactively bootstrap a new Flutter app: product vision, design system, architecture, packages, and CLAUDE.md. Use when: flutter bootstrap, bootstrap app, initialize flutter, /flutter-bootstrap, create flutter project, new flutter app, scaffold flutter app."
user-invocable: true
---

# Flutter App Bootstrap

Interactive Flutter project scaffolding. Asks structured questions, generates context/PRD files, then creates the project with selected targets, packages, and baseline code.

**Do NOT skip any phase. Complete all questions before generating or executing.**

---

## Phase 1: Discovery

Ask the following question groups in order. Use `AskQuestion` when available; otherwise ask conversationally. Accept user overrides for any default.

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

### 1.2 Wireframe

_Apply [Document Import Protocol](#document-import-protocol) first._

Required fields:

1. Does the user have a wireframe or screen list?
   - **Yes** → Collect screen descriptions/flows. Will generate `wireframe-prd.md`.
   - **No** → Will add a TODO in the generated `CLAUDE.md`.

### 1.3 Design System

_Apply [Document Import Protocol](#document-import-protocol) first._

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

### 1.6 Confirmation

Present a **full summary** of all decisions from 1.1-1.5. Ask user to confirm before proceeding.

---

## Phase 2: Project Execution

Run sequentially after confirmation:

### 2.1 Create Project

```bash
flutter create --project-name <app_name> --platforms <comma-separated> <app_name>
```

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

Write `lib/core/constants/app_theme.dart` using the AppTheme template from [templates.md](templates.md) with design system values from 1.3.

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

Write `design-system/<app_name>/MASTER.md` using the MASTER.md template from [templates.md](templates.md).

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

1. **`CLAUDE.md`** (project root) — Fill baseline template with all discovery answers. Keep this as the top-level agent context file with commands, architecture overview, and key dependencies.

2. **`.claude/rules/PRODUCT.md`** — Product vision and wireframe rules. Include:
   - App name, one-line description, target audience, core problem
   - Target platforms
   - Screen list / wireframe flows (from 1.2), or a TODO if none provided
   - Navigation structure and key user journeys

3. **`.claude/rules/DESIGN.md`** — **Pointer file only.** Do NOT inline tokens here. Use the DESIGN.md pointer template from [templates.md](templates.md). This file must:
   - Reference `design-system/<app_name>/MASTER.md` as the canonical source
   - State that `ui-ux-pro-max` skill (`--stack flutter`) is used for all design/UI work
   - Include a compact quick-reference summary of key tokens (colors, spacing, radius, font family) for at-a-glance use
   - List absolute prohibitions (hardcoded values, shadows, etc.) matching the MASTER.md anti-patterns

4. **`.claude/rules/CODE-STYLE.md`** — Architecture and coding conventions. Include:
   - Architecture pattern (MVVM, etc.) and folder structure from 1.4
   - Design patterns (optimistic state, command pattern, Result objects)
   - State management and DI choices
   - Widget organization rules (one widget per file, extensions first)
   - Testing policy
   - Key packages from 1.5 with category table
   - Engineering principles (small functions, DRY, edge-case first, fail fast)

### 2.7 Git Repository

Ask the user how they want to handle version control. Use `AskQuestion` when available:

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
2. Run `flutter analyze` and fix issues
3. Present summary of everything created
4. Remind: start app via IDE debug, not `flutter run`

---

## Checklist

Before finishing:

- [ ] All five question groups answered
- [ ] User confirmed summary
- [ ] `flutter create` succeeded
- [ ] All packages added
- [ ] Firebase configured (or TODO added)
- [ ] `app_theme.dart` generated
- [ ] Base extensions copied
- [ ] `design-system/<app_name>/MASTER.md` generated (full canonical design system)
- [ ] `CLAUDE.md` generated
- [ ] `.claude/rules/PRODUCT.md` generated
- [ ] `.claude/rules/DESIGN.md` generated (pointer only — no inline tokens)
- [ ] `.claude/rules/CODE-STYLE.md` generated
- [ ] Git repo created, connected, or TODO added
- [ ] `flutter analyze` passes
