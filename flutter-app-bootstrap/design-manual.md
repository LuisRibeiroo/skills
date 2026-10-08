# Manual design system

Branch for `ds_mode = manual`. Canonical source: `design-system/<app_name>/MASTER.md`. Token classes (`AppColors`, `AppSpacing`, `AppRadius`, …) are hand-written in `app_theme.dart`. [Placeholders](templates.md) `{{...}}` are filled from the Discover answers.

## Discover (1.3)

If the user supplied a design document (DESIGN.md, style guide, Figma export):

1. Read it and extract tokens, style name, component conventions, anti-patterns.
2. Map the content to the MASTER.md template below.
3. Confirm mapped values; ask only about gaps. The document replaces the questions below; its content is consumed into `MASTER.md` and the original is not copied.

Otherwise present these defaults and accept overrides:

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

Done when: every row has a confirmed value (default, override, or extracted from the document).

## Create (2.4)

1. Write `lib/core/constants/app_theme.dart` from [Template: AppTheme](#template-apptheme).
2. Write `design-system/<app_name>/MASTER.md` from [Template: MASTER.md](#template-mastermd). It is the canonical, machine-readable design system the `ui-ux-pro-max` skill operates on, and must hold Global Rules (color, typography, spacing, border depths, radius), Component Specs (buttons, cards, inputs, sheets/modals, loading), Style Guidelines, Anti-Patterns and the Pre-Delivery Checklist.
3. Per-page override: UI code for a page first checks `design-system/<app_name>/pages/<page>.md`; when it exists its rules win over `MASTER.md`, otherwise `MASTER.md` applies.

Done when: both files exist, and every `{{PLACEHOLDER}}` in them is filled.

## Context-file fills (2.6)

- `CLAUDE.md` `{{DESIGN_SYSTEM_SECTION}}` ← [Template: CLAUDE.md section](#template-claudemd-section).
- `.claude/rules/DESIGN.md` ← [Template: DESIGN.md pointer](#template-designmd-pointer). Pointer file: link to `MASTER.md`, state that `ui-ux-pro-max` (`--stack flutter`) handles design/UI work, carry the compact token quick-reference and the absolute prohibitions that match the `MASTER.md` anti-patterns.

## Verify (2.8)

`flutter analyze` passes; no hardcoded color, spacing or font size in generated code.

---

## Template: MASTER.md

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

## Template: DESIGN.md pointer

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

## Template: CLAUDE.md section

````markdown
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
````

---

## Template: AppTheme

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
