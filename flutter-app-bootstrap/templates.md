# Output Templates

Shared templates for files generated during Flutter app bootstrap. Design-system templates live with their branch: [design-manual.md](design-manual.md), [design-setup-ds.md](design-setup-ds.md). Fill `{{PLACEHOLDERS}}` with discovery answers from Phase 1.

---

## Product Vision PRD

Save to `docs/product/product-vision-prd.md`.

```markdown
# Product Vision: {{APP_NAME}}

## Overview

{{ONE_LINE_DESCRIPTION}}

## Target Audience

{{TARGET_AUDIENCE}}

## Problem Statement

{{CORE_PROBLEM}}

## Target Platforms

{{PLATFORMS_LIST}}

## Goals

- [Fill based on product vision discussion]

## Non-Goals

- [Fill based on scope boundaries discussed]

## Success Metrics

- [Define measurable outcomes]

## Open Questions

- [Any unresolved items from discovery]
```

---

## Wireframe PRD

Save to `docs/product/wireframe-prd.md`. Only generate if user provided wireframe/screen info in 1.2.

```markdown
# Wireframe: {{APP_NAME}}

## Screen Map

{{SCREEN_LIST_OR_FLOW}}

## Navigation Flow

{{NAVIGATION_DESCRIPTION}}

## Key Screens

### {{SCREEN_NAME}}

**Purpose:** {{PURPOSE}}

**Key Elements:**

- {{ELEMENT_1}}
- {{ELEMENT_2}}

[Repeat for each screen described by user]
```

---

## CLAUDE.md Baseline

Save to `CLAUDE.md` at the project root. This is the main AI context file.

````markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
flutter pub get

# Run all tests
flutter test

# Run a single test file
flutter test test/<example_test_path>

# Analyze (lint)
flutter analyze

# Generate localizations (after editing .arb files)
flutter gen-l10n
```

**IMPORTANT:** Never run `flutter run` directly. Instead, instruct the user to start debug via the IDE (Run/Debug button or F5) to avoid conflicts with hot reload.

## Architecture

Flutter app ({{PLATFORMS}}) using MVVM with Command pattern, following [Flutter architecture guide](https://docs.flutter.dev/app-architecture/guide):

- **`lib/ui/`** — Views and ViewModels. Views render UI; ViewModels hold state and expose commands.
- **`lib/data/`** — Repositories (source of truth for app data) and Services (API/platform wrappers).
- **`lib/domain/`** — Domain models and optional use cases for cross-repository logic.
- **`lib/core/`** — Constants (theme, config), extensions, dependency injection setup, routing.

Default design patterns ([reference](https://docs.flutter.dev/app-architecture/design-patterns)):

- **Optimistic state:** Update UI immediately, reconcile on server response.
- **Command pattern:** Wrap async operations in Command objects that expose running/error/result states.
- **Result objects:** Return `Result<Success, Failure>` from repositories instead of throwing exceptions.

### Engineering Principles

- **Small, focused code:** Aim for functions <= 50 lines and single responsibility; split large/mixed-responsibility functions into helpers.
- **Avoid duplication (DRY):** If logic repeats, extract shared code (or document why duplication is necessary).
- **Edge-case first mindset:** Always account for null/empty input, min/max bounds, invalid states, and concurrency risks.
- **Fail fast and explicit:** Prefer clear errors/safe defaults over proceeding with bad assumptions.

### Dependency Injection

`{{DI_PACKAGE}}` configured in `lib/core/inject/app_injector.dart` via global `appInjector`. Call `appInjector.get<T>()` to resolve. All registrations in `setupInjector()` called from `main()`.

### State Management — {{STATE_PACKAGE}} (STRICT)

ALL reactivity must use the `{{STATE_PACKAGE}}` package.

- Use `signal()`, `computed()`, `effect()` for state, derivations, and side effects.
- **`setState` is PROHIBITED** for business state or validation. Only tolerated for strictly visual/ephemeral low-level cases (e.g. `AnimationController`) where Flutter requires synchronous rebuild with no reactive alternative.
- **`ValueNotifier`/`ValueListenable` must NOT be used** when a Signal covers the need. Reserve them only for third-party or Flutter APIs that require them as parameters.
- Consume signals in UI via `Watch((_) { ... })` or `context.watch()`.

### Navigation

`{{NAV_PACKAGE}}` for declarative routing with deep link support.

Route flow: `/` (Splash) → `/login` or `/onboarding` → `/home`.

{{DESIGN_SYSTEM_SECTION}}

### Loading States — Skeleton Screens (STRICT)

`CircularProgressIndicator` is **PROHIBITED** as a page or section loading indicator. All loading states MUST use skeleton screens via the `redacted` package: build the final layout with placeholder/empty data and apply `.redacted(context: context, redact: true)`. `CircularProgressIndicator` is only tolerated inside inline buttons where a skeleton makes no sense.

### Extensions First

Always prefer existing extension methods over inline logic:

- **`lib/core/extensions/`** — Pure Dart extensions on primitives (`String`, `int`, `num`, `DateTime`, etc.). Usable in any layer.
- **`lib/ui/shared/extensions/`** — Flutter/widget extensions for UI standardization (e.g. `16.asSpace` → `SizedBox`).

If a recurring operation lacks an extension, create one in the appropriate folder before using it inline.

### Widget Organization (One Widget per File)

Each `StatefulWidget` or `StatelessWidget` MUST be in its own Dart file. Declaring more than one public or private widget per file is PROHIBITED.

- **Feature-specific widgets** → `ui/<feature>/widgets/<widget>.dart`
- **Shared widgets** (used by more than one feature) → `ui/shared/widgets/`
- Page root files (`*_page.dart`, `*_sheet.dart`) contain only the root widget for that screen.
- Exception: non-widget helpers (enums, typedefs, local helpers) may remain in the widget file that uses them.

### Localization

ARB files in `lib/l10n/`. Generated code in `lib/gen_l10n/`. Access strings via `context.l10n` (extension in `lib/ui/shared/extensions/context_ext.dart`). Run `flutter gen-l10n` after editing ARB files.

### Adding New Packages

When suggesting a new package, always provide at least one alternative with a brief technical comparison before justifying the choice.

### Key Dependencies (reference)

{{DEPENDENCIES_BY_CATEGORY}}

### Testing Policy

Every class in domain and data layers MUST have corresponding unit tests in `test/` mirroring the `lib/` structure.

**When a change would break existing tests:** identify which test files are affected, alert the user explicitly with the list and reason, and wait for confirmation before modifying test assertions. Never silently delete or weaken assertions to make tests pass.

### Reliability & Debugging

- Repositories return `Result` types; use pattern matching in the UI layer.
- **Diagnose, don't guess:** For bugs/failing tests, explain likely causes step-by-step and validate assumptions before changing code.
- **Graceful + visible failure:** Use `try/catch` where appropriate, return user-friendly failures/fallbacks, and never swallow exceptions silently.
- **Useful logging:** Add targeted logs for critical failures (avoid production log spam).
- If an identified edge case cannot be solved immediately, flag it with a clear `TODO`.

---

## Workflow & Planning Guidelines

- For complex or multi-step tasks, start with a concise plan (steps/modules).
- If the task is too complex for a short execution path, switch to plan mode and get user approval before implementation.
- Implement incrementally, validating each chunk against the plan and tests before proceeding.
- Pause for confirmation after major design decisions.
- If an approach fails, backtrack and try alternatives rather than forcing the same path.

{{IF_NO_WIREFRAME}}<!-- TODO: Add wireframe/screen-flow document to docs/product/ -->{{/IF_NO_WIREFRAME}}
````
