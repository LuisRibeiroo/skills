# Output Templates

Templates for files generated during Flutter app bootstrap.
Fill `{{PLACEHOLDERS}}` with discovery answers from Phase 1.

---

## Design System Master File

Save to `design-system/{{APP_NAME}}/MASTER.md`. This is the canonical machine-readable design system consumed by the `ui-ux-pro-max` skill.

```markdown
# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/{{APP_NAME}}/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** {{APP_DISPLAY_NAME}}
**Category:** {{APP_CATEGORY}} — Flutter
**Style:** {{STYLE_NAME}} — "{{STYLE_TAGLINE}}"

> For any design/UI work, use the `ui-ux-pro-max` skill (`--stack flutter`).
> This file is the canonical machine-readable design system the skill operates on.

---

## Global Rules

### Color Palette

| Role | Hex | Flutter Token |
|------|-----|---------------|
| Primary / Structural | `{{PRIMARY_HEX}}` | `AppColors.primaryAction` |
| On-Primary | `{{ON_PRIMARY_HEX}}` | `AppColors.onPrimary` |
| Secondary / Accent | `{{SECONDARY_HEX}}` | `AppColors.secondary` |
| Background | `{{BG_HEX}}` | `AppColors.background` |
| Surface | `{{SURFACE_HEX}}` | `AppColors.surface` |
| Surface Container | `{{SURFACE_CONTAINER_HEX}}` | `AppColors.surfaceContainer` |
| Text Primary | `{{TEXT_PRIMARY_HEX}}` | `AppColors.textPrimary` |
| Text Secondary | `{{TEXT_SECONDARY_HEX}}` | `AppColors.textSecondary` |
| Outline | `{{OUTLINE_HEX}}` | `AppColors.outline` |
| Error | `{{ERROR_HEX}}` | `AppColors.error` |
| Success | `{{SUCCESS_HEX}}` | `AppColors.success` |

**Color Rules:**
- Flat, solid color blocks only. No gradients on surfaces.
- Limited palette per screen: background + one structural color + one accent.
{{ADDITIONAL_COLOR_RULES}}

### Typography

Dual-font system via `google_fonts`. All tokens in `AppFontSize`, `AppFontWeight`, `AppLineHeight`.

| Role | Font | Token | Size | Weight | Line Height |
|------|------|-------|------|--------|-------------|
| Display | {{HEADLINE_FONT}} | `AppFontSize.displayLg` | {{FONT_DISPLAY_LG}}px | `AppFontWeight.bold` (700) | `AppLineHeight.tight` ({{LH_TIGHT}}) |
| Headline | {{HEADLINE_FONT}} | `AppFontSize.headlineLg` | {{FONT_HEADLINE_LG}}px | `AppFontWeight.semibold` (600) | `AppLineHeight.normal` ({{LH_NORMAL}}) |
| Title | {{HEADLINE_FONT}} | `AppFontSize.titleLg` | {{FONT_TITLE_LG}}px | `AppFontWeight.semibold` (600) | `AppLineHeight.normal` ({{LH_NORMAL}}) |
| Label | {{HEADLINE_FONT}} | `AppFontSize.labelMd` | {{FONT_LABEL_MD}}px | `AppFontWeight.medium` (500) | `AppLineHeight.normal` ({{LH_NORMAL}}) |
| Body | {{BODY_FONT}} | `AppFontSize.bodyLg` | {{FONT_BODY_LG}}px | `AppFontWeight.regular` (400) | `AppLineHeight.relaxed` ({{LH_RELAXED}}) |
| Body Medium | {{BODY_FONT}} | `AppFontSize.bodyMd` | {{FONT_BODY_MD}}px | `AppFontWeight.regular` (400) | `AppLineHeight.relaxed` ({{LH_RELAXED}}) |
| Button | {{HEADLINE_FONT}} | `AppFontSize.button` | {{FONT_BUTTON}}px | `AppFontWeight.bold` (700) | — |

**Typography Rules:**
- Never hardcode font sizes — always use `AppFontSize` tokens or `AppTheme.{{THEME_MODE}}` text styles.
{{ADDITIONAL_TYPOGRAPHY_RULES}}

### Spacing Variables

8pt grid. All tokens in `AppSpacing` (`lib/core/constants/app_theme.dart`).

| Token | Value | Flutter Token | Usage |
|-------|-------|---------------|-------|
| xs | {{XS}}px | `AppSpacing.xs` | Tight gaps, icon padding |
| sm | {{SM}}px | `AppSpacing.sm` | Icon gaps, inline spacing |
| md | {{MD}}px | `AppSpacing.md` | Standard padding |
| lg | {{LG}}px | `AppSpacing.lg` | Section padding |
| xl | {{XL}}px | `AppSpacing.xl` | Large gaps, button horizontal padding |

Never hardcode spacing values — always use `AppSpacing` tokens or the `asSpace` extension (`16.asSpace` → `SizedBox`).

### Border Depths

{{IF_NO_SHADOWS}}**Drop shadows and blurs are PROHIBITED.** Depth comes from thick solid borders.{{/IF_NO_SHADOWS}}

| Level | Flutter Token | Width | Usage |
|-------|---------------|-------|-------|
| Thin | `AppBorder.thin` | 1px solid | Inputs (enabled state) |
| Medium | `AppBorder.medium` | 2px solid | Cards, app bar, buttons, dividers |
| Thick | `AppBorder.thick` | 3px solid | Input focus state, emphasis |

### Border Radius

| Token | Value | Flutter Token |
|-------|-------|---------------|
| sm | {{RADIUS_SM}}px | `AppRadius.sm` / `AppRadius.smAll` |
| md | {{RADIUS_MD}}px | `AppRadius.md` / `AppRadius.mdAll` |
| lg | {{RADIUS_LG}}px | `AppRadius.lg` / `AppRadius.lgAll` |
| pill | {{RADIUS_PILL}}px | `AppRadius.pill` / `AppRadius.pillAll` |

---

## Component Specs

### Buttons

```dart
// Primary — ElevatedButton (styled by AppTheme.{{THEME_MODE}})
ElevatedButton(
  onPressed: ...,
  child: Text('LABEL'),
)
// → AppColors.primaryAction bg, AppColors.onPrimary fg
// → AppRadius.{{BUTTON_RADIUS}}, AppBorder.medium, AppSpacing.xl/md padding
// → {{HEADLINE_FONT}} bold {{FONT_BUTTON}}px

// Secondary — OutlinedButton
OutlinedButton(
  onPressed: ...,
  child: Text('LABEL'),
)
// → transparent bg, AppColors.textPrimary fg, AppBorder.medium
` `` 

### Cards

Use `PressableCard` from `lib/ui/shared/widgets/pressable_card.dart`. **`InkWell` and Material splash are PROHIBITED.**

```dart
PressableCard(
  onTap: () { HapticFeedback.lightImpact(); ... },
  onLongPress: () { ... },  // mediumImpact fired automatically
  builder: (context, isPressed) => Container(
    decoration: BoxDecoration(
      color: isPressed ? AppColors.primaryAction : AppColors.surface,
      border: Border.all(color: AppColors.primaryAction, width: 2),
      borderRadius: AppRadius.mdAll,
    ),
    child: ...,
  ),
)
// → inverts to primary bg on press (150ms animation)
// → primary text: isPressed ? AppColors.onPrimary : AppColors.textPrimary
// → secondary text: isPressed ? AppColors.onPrimary.withValues(alpha: 0.7) : AppColors.textSecondary
` ``

### Inputs

Styled globally by `AppTheme.{{THEME_MODE}}.inputDecorationTheme`:
- Filled: `AppColors.surface`
- Enabled border: `AppBorder.thin`, `AppRadius.mdAll`
- Focused border: `AppBorder.thick`, `AppRadius.mdAll`
- Error border: `AppColors.error`, thin→thick on focus
- Content padding: `horizontal: AppSpacing.md, vertical: AppSpacing.sm`

### Bottom Sheets / Modals

`showModalBottomSheet` is **PROHIBITED**. All bottom sheets MUST use `AppBottomSheet` from `lib/ui/shared/widgets/app_bottom_sheet.dart` via the sheet widget's own `static Future<T?> show()` method.

Visual contract:
- Border: `Border.all(color: AppColors.primaryAction, width: 2)` on all sides
- Top corners: `AppRadius.lg`. Bottom corners: 0.
- Background: `AppColors.surface`
- No drag handle, no shadow, no blur.

### Loading States

`CircularProgressIndicator` is **PROHIBITED** as page/section loader. Use skeleton screens via `redacted` package:

```dart
MyWidget(data: placeholder).redacted(context: context, redact: isLoading)
` ``

`CircularProgressIndicator` is only tolerated inside inline buttons.

---

## Style Guidelines

**Style:** {{STYLE_NAME}}
**North Star:** "{{STYLE_TAGLINE}}"

**Keywords:** {{STYLE_KEYWORDS}}
**Best For:** {{STYLE_BEST_FOR}}

**Key Effects:**
{{STYLE_EFFECTS}}

{{IF_LIGHT_ONLY}}**Light-mode only.** Dark mode is PROHIBITED unless explicitly requested.{{/IF_LIGHT_ONLY}}
{{IF_DARK_ONLY}}**Dark-mode only.** Light mode is PROHIBITED unless explicitly requested.{{/IF_DARK_ONLY}}

### Page Pattern

**Pattern Name:** {{PAGE_PATTERN_NAME}}

- **Screen Structure:** {{PAGE_STRUCTURE}}
- **Section Order:** {{SECTION_ORDER}}
- **CTA Placement:** {{CTA_PLACEMENT}}
- **Color Strategy:** {{COLOR_STRATEGY}}

---

## Anti-Patterns (Do NOT Use)

{{ANTI_PATTERNS}}
- ❌ **Hardcoded colors** — always `AppColors.*`
- ❌ **Hardcoded spacing** — always `AppSpacing.*` or `asSpace` extension
- ❌ **Hardcoded font sizes** — always `AppFontSize.*` or theme text styles
- ❌ **`InkWell` / Material splash on cards** — use `PressableCard`
- ❌ **`showModalBottomSheet`** — use `AppBottomSheet`
- ❌ **`CircularProgressIndicator` as page/section loader** — use `redacted` skeletons
- ❌ **`setState` for business state** — use `signals` (`signal()`, `computed()`, `effect()`)
- ❌ **`ValueNotifier`/`ValueListenable`** when Signal covers the need
- ❌ **Hardcoded route path strings** — use `RouteNames.*` + `goNamed`/`pushNamed`
- ❌ **Hardcoded UI strings** — all strings via `context.l10n.*` (l10n required)
- ❌ **Multiple widgets per file** — one widget per Dart file
- ❌ **Emojis as UI icons** — use SVG icons (flutter_svg)

---

## Pre-Delivery Checklist

Before delivering any Flutter UI code, verify:

- [ ] No hardcoded colors (`Colors.red`, `Color(0xFF...)`) — all via `AppColors.*`
- [ ] No hardcoded spacing (`SizedBox(height: 10)`) — all via `AppSpacing.*` or `asSpace`
- [ ] No hardcoded font sizes — all via `AppFontSize.*` or theme text styles
- [ ] Tappable cards use `PressableCard`, not `InkWell`
- [ ] Bottom sheets use `AppBottomSheet`, not `showModalBottomSheet`
- [ ] Loading states use `redacted` skeletons, not `CircularProgressIndicator`
- [ ] Long-press fires `HapticFeedback.mediumImpact()` (auto via `PressableCard`)
- [ ] Significant tap fires `HapticFeedback.lightImpact()` at call site
- [ ] All user-facing strings via `context.l10n.*` (no hardcoded text)
- [ ] Navigation via `goNamed`/`pushNamed` with `RouteNames.*` (no path strings)
- [ ] State via `signals` — no `setState` for business logic
- [ ] One widget per file
- [ ] {{MODE_CHECKLIST_ITEM}}
- [ ] Touch targets minimum 44×44px
- [ ] Focus states visible (thick border on inputs)
```

> **Note on code block markers above:** The ` `` ` markers inside the template are written with spaces to avoid breaking the outer code fence. When writing the actual file, use standard triple-backtick fences.

---

## DESIGN.md Pointer File

Save to `.claude/rules/DESIGN.md`. This is a **reference-only** file — do NOT put token values here. All design details live in `design-system/{{APP_NAME}}/MASTER.md`.

```markdown
# Design Rules: {{APP_DISPLAY_NAME}}

> **Canonical design system:** [`design-system/{{APP_NAME}}/MASTER.md`](../../design-system/{{APP_NAME}}/MASTER.md)
> For any design/UI work or design-system lookup, use the **`ui-ux-pro-max` skill** (`--stack flutter`).
> All color tokens, spacing, typography, component specs, anti-patterns, and the pre-delivery checklist are defined there.

**Quick token reference** (source of truth: `lib/core/constants/app_theme.dart`):
- `AppColors` — primaryAction `{{PRIMARY_HEX}}`, background/surface `{{BG_HEX}}`, textPrimary `{{TEXT_PRIMARY_HEX}}`, textSecondary `{{TEXT_SECONDARY_HEX}}`
- `AppSpacing` — xs={{XS}}, sm={{SM}}, md={{MD}}, lg={{LG}}, xl={{XL}}
- `AppFontSize` — displayLg={{FONT_DISPLAY_LG}}, titleLg={{FONT_TITLE_LG}}, bodyLg={{FONT_BODY_LG}}, bodyMd={{FONT_BODY_MD}}, button={{FONT_BUTTON}}
- `AppRadius` — sm={{RADIUS_SM}}px, md={{RADIUS_MD}}px, lg={{RADIUS_LG}}px, pill={{RADIUS_PILL}}px
- `AppTheme.{{THEME_MODE}}` — {{HEADLINE_FONT}} headlines + {{BODY_FONT}} body via `google_fonts`

**Absolute prohibitions:** no hardcoded colors/spacing/font sizes, {{SHADOW_PROHIBITION}}, {{MODE_PROHIBITION}}, no `InkWell` on cards (`PressableCard` only), no `showModalBottomSheet` (`AppBottomSheet` only), no `CircularProgressIndicator` as page loader (`redacted` skeletons only).
```

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

### Design System (STRICT — no hardcoded values)

It is **PROHIBITED** to use hardcoded colors, spacings, or font sizes (e.g. `Colors.red`, `SizedBox(height: 10)`). Always use tokens from `lib/core/constants/app_theme.dart`:

- **`AppColors`** — background ({{BG_HEX}}), surface ({{SURFACE_HEX}}), primaryAction ({{PRIMARY_HEX}}), success ({{SUCCESS_HEX}}), textPrimary ({{TEXT_PRIMARY_HEX}}), textSecondary ({{TEXT_SECONDARY_HEX}})
- **`AppSpacing`** — 8pt grid: xs={{XS}}, sm={{SM}}, md={{MD}}, lg={{LG}}, xl={{XL}}
- **`AppFontSize`** — displayLg={{FONT_DISPLAY_LG}}, titleLg={{FONT_TITLE_LG}}, bodyLg={{FONT_BODY_LG}}, bodyMd={{FONT_BODY_MD}}, labelMd={{FONT_LABEL_MD}}, button={{FONT_BUTTON}}
- **`AppFontWeight`** — bold (w700), semibold (w600), medium (w500), regular (w400)
- **`AppLineHeight`** — tight ({{LH_TIGHT}}), normal ({{LH_NORMAL}}), relaxed ({{LH_RELAXED}})
- **`AppRadius`** — sm ({{RADIUS_SM}}px), md ({{RADIUS_MD}}px), pill ({{RADIUS_PILL}}px)
- **`AppTheme.dark`** — the single `ThemeData` ({{FONT_FAMILY}} font via `google_fonts`)

{{IF_DARK_MODE_ONLY}}The app is dark-mode exclusive. Never add light-mode support.{{/IF_DARK_MODE_ONLY}}

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

---

## AppTheme

Generate `lib/core/constants/app_theme.dart` using design system values from discovery.

Replace `{{FONT_METHOD}}` with the camelCase Google Fonts method (e.g., `inter` for Inter, `poppins` for Poppins).

```dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

abstract final class AppColors {
  static const background = Color({{BACKGROUND_COLOR}});
  static const surface = Color({{SURFACE_COLOR}});
  static const primaryAction = Color({{PRIMARY_COLOR}});
  static const success = Color({{SUCCESS_COLOR}});
  static const textPrimary = Color({{TEXT_PRIMARY_COLOR}});
  static const textSecondary = Color({{TEXT_SECONDARY_COLOR}});
}

abstract final class AppSpacing {
  static const double xs = {{XS}};
  static const double sm = {{SM}};
  static const double md = {{MD}};
  static const double lg = {{LG}};
  static const double xl = {{XL}};
}

abstract final class AppFontSize {
  static const double displayLg = {{FONT_DISPLAY_LG}};
  static const double titleLg = {{FONT_TITLE_LG}};
  static const double bodyLg = {{FONT_BODY_LG}};
  static const double bodyMd = {{FONT_BODY_MD}};
  static const double labelMd = {{FONT_LABEL_MD}};
  static const double button = {{FONT_BUTTON}};
}

abstract final class AppFontWeight {
  static const bold = FontWeight.w700;
  static const semibold = FontWeight.w600;
  static const medium = FontWeight.w500;
  static const regular = FontWeight.w400;
}

abstract final class AppLineHeight {
  static const double tight = {{LH_TIGHT}};
  static const double normal = {{LH_NORMAL}};
  static const double relaxed = {{LH_RELAXED}};
}

abstract final class AppRadius {
  static const sm = Radius.circular({{RADIUS_SM}});
  static const md = Radius.circular({{RADIUS_MD}});
  static const pill = Radius.circular({{RADIUS_PILL}});

  static final smAll = BorderRadius.all(sm);
  static final mdAll = BorderRadius.all(md);
  static final pillAll = BorderRadius.all(pill);
}

abstract final class AppTheme {
  static ThemeData get dark {
    final baseText =
        GoogleFonts.{{FONT_METHOD}}TextTheme(ThemeData.dark().textTheme);

    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primaryAction,
        secondary: AppColors.success,
        surface: AppColors.surface,
        error: AppColors.primaryAction,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.background,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          color: AppColors.textPrimary,
          fontSize: AppFontSize.titleLg,
          fontWeight: AppFontWeight.semibold,
          height: AppLineHeight.tight,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryAction,
          foregroundColor: AppColors.textPrimary,
          shape: RoundedRectangleBorder(borderRadius: AppRadius.pillAll),
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.xl,
            vertical: AppSpacing.md,
          ),
          textStyle:
              const TextStyle(fontSize: AppFontSize.button, fontWeight: AppFontWeight.semibold),
        ),
      ),
      textTheme: baseText.copyWith(
        displayLarge: baseText.displayLarge?.copyWith(
          color: AppColors.textPrimary,
          fontSize: AppFontSize.displayLg,
          fontWeight: AppFontWeight.bold,
          height: AppLineHeight.tight,
        ),
        titleLarge: baseText.titleLarge?.copyWith(
          color: AppColors.textPrimary,
          fontSize: AppFontSize.titleLg,
          fontWeight: AppFontWeight.semibold,
          height: AppLineHeight.tight,
        ),
        bodyLarge: baseText.bodyLarge?.copyWith(
          color: AppColors.textPrimary,
          fontSize: AppFontSize.bodyLg,
          fontWeight: AppFontWeight.regular,
          height: AppLineHeight.normal,
        ),
        labelMedium: baseText.labelMedium?.copyWith(
          color: AppColors.textSecondary,
          fontSize: AppFontSize.labelMd,
          fontWeight: AppFontWeight.medium,
          height: AppLineHeight.normal,
        ),
      ),
    );
  }
}
```
