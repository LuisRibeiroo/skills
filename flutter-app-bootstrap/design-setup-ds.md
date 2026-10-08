# Design system via setup-ds

Branch for `ds_mode = setup-ds`. Canonical source: `design-system/tokens.json` plus `design-system/DESIGN.md` and `design-system/COMPONENTS.md`, produced by the `setup-ds` skill. Tokens are generated into `lib/core/design/app_tokens.g.dart`, with the same class names the manual path writes by hand (`AppColors`, `AppSpacing`, `AppRadius`, …) but different shapes (`AppColors` is an instance, `AppRadius.md` is a `double`). That is why the two paths stay apart: one project holds one set.

## Discover (1.3)

Run `setup-ds` **steps 1–2** (survey, ratify) now. Pre-answer the survey:

- Platform Flutter → `dart` output only, path `lib/core/design/app_tokens.g.dart`.
- Existing design system: none, unless the user supplied a document at the import prompt. A document counts as the existing design system in step 2: show defaults beside its values, ask keep / default / per rule.
- Optional **dimension** section: offer neutrally (Flutter, not web).
- Defaults and ratified values come from `setup-ds`; the style name has no equivalent and is dropped. Dark-only is read from the ratified `modes`.

Keep the ratified draft in the scratchpad until 2.4.

Done when: every non-dropped `setup-ds` section is ratified and no conflict is open.

## Create (2.4)

Run `setup-ds` **steps 3–5** in `<app_name>/` with the draft:

- Step 3 as written (`tokens.json` with `dart` output, generator, `DESIGN.md`, `COMPONENTS.md`, generator then `--check`).
- Step 4.1 (agent pointer): bootstrap places it in `CLAUDE.md` at 2.6, so no `AGENTS.md` is created.
- Step 4.2 (wiring): approved by choosing this path. Write `lib/core/design/app_theme.dart` from [Template: AppTheme](#template-apptheme), then point `MaterialApp` in `lib/main.dart` at it.
- Step 5 (report): fold into the 2.8 summary.

`app_theme.dart` declares only `AppTheme`, `AppColorsTheme` and `context.colors`; every token class comes from `app_tokens.g.dart`.

Done when: both generator runs exit 0, `app_theme.dart` exists and `MaterialApp` uses it.

## Context-file fills (2.6)

- `CLAUDE.md` `{{DESIGN_SYSTEM_SECTION}}` ← [Template: CLAUDE.md section](#template-claudemd-section).
- `.claude/rules/DESIGN.md` ← [Template: DESIGN.md pointer](#template-designmd-pointer).
- `.claude/rules/CODE-STYLE.md` gains a token rule: UI code reads `AppSpacing`, `AppRadius`, `AppFontSize`… from `app_tokens.g.dart` and colors through `context.colors`; a token change edits `tokens.json` and runs `node scripts/generate-design-tokens.mjs`.

## Conventions on this path

- Component specs come from `COMPONENTS.md`. `PressableCard` and `AppBottomSheet` (the manual path's press/border contract) are not generated: pressed state is `color.overlayPressed` and dialogs use `shadow.overlay`.
- Loading follows both paths: `redacted` skeletons, a spinner only inside a button.
- A deviation from a token edits `tokens.json` and regenerates; pages have no override files.

## Verify (2.8)

`node scripts/generate-design-tokens.mjs --check` exits 0, then `flutter analyze` passes.

---

## Template: DESIGN.md pointer

Save to `.claude/rules/DESIGN.md` when `ds_mode = setup-ds`. Reference-only: no token values.

```markdown
# Design Rules: {{APP_DISPLAY_NAME}}

> **Canonical design system:** rules in [`design-system/DESIGN.md`](../../design-system/DESIGN.md), component specs in [`design-system/COMPONENTS.md`](../../design-system/COMPONENTS.md), tokens in [`design-system/tokens.json`](../../design-system/tokens.json).

- Tokens are generated into `lib/core/design/app_tokens.g.dart`. Never edit it: change `tokens.json`, then run `node scripts/generate-design-tokens.mjs` (`--check` fails on stale output).
- Theme: `lib/core/design/app_theme.dart`. Colors come from `context.colors`.
- `ui-ux-pro-max` (`--stack flutter`) may inform layout and UX; it never overrides these tokens or specs.

**Absolute prohibitions:** no hardcoded colors, spacing, font sizes, radii or control sizes (generated token classes only); no `Colors.*` or `Color(0x…)` in feature UI; drop shadows only as `AppShadow.raised` / `AppShadow.overlay` at elevation levels 3 and 4; no `CircularProgressIndicator` as page loader (`redacted` skeletons; a spinner only inside a button). {{MODE_PROHIBITION}}
```

---

## Template: CLAUDE.md section

The first sentence is the exact pointer `setup-ds` step 4 prescribes; keep it verbatim.

````markdown
### Design System (STRICT — no hardcoded values)

UI work: follow `design-system/DESIGN.md` and `design-system/COMPONENTS.md`; tokens in `design-system/tokens.json`, never edit generated files.

Hardcoded colors, spacings, font sizes, radii and control sizes are **PROHIBITED** (e.g. `Colors.red`, `SizedBox(height: 10)`). Use the classes generated into `lib/core/design/app_tokens.g.dart`: `AppSpacing` / `AppGap` / `AppInset`, `AppRadius`, `AppFontSize` / `AppFontWeight` / `AppLineHeight`, `AppControlSize`, `AppIconSize`, and colors through `context.colors` (an `AppColors`). The theme lives in `lib/core/design/app_theme.dart`.

Change a token: edit `design-system/tokens.json`, then run `node scripts/generate-design-tokens.mjs` (`--check` fails on stale output).

{{IF_DARK_MODE_ONLY}}The app is dark-mode exclusive (`modes: ["dark"]`). Never add light-mode support.{{/IF_DARK_MODE_ONLY}}
````

---

## Template: AppTheme

Generate `lib/core/design/app_theme.dart` when `ds_mode = setup-ds`. It declares **only** `AppTheme`, the `AppColorsTheme` carrier and the `context.colors` accessor; every token class comes from `app_tokens.g.dart` (never redeclare them).

Adapt to the ratified `tokens.json`:

- One `static ThemeData get <mode>` per entry in `modes` (`light`, `dark`).
- Token names below are the `setup-ds` defaults. If the user renamed or dropped a token, edit the line to match; `flutter analyze` flags any miss.
- `AppFontFamily.*` is `null` for system fonts and a family name otherwise; the helper handles both.

```dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'app_tokens.g.dart';

/// Carries the generated [AppColors] of the active mode through [ThemeData].
@immutable
class AppColorsTheme extends ThemeExtension<AppColorsTheme> {
  const AppColorsTheme(this.colors);

  final AppColors colors;

  @override
  AppColorsTheme copyWith({AppColors? colors}) => AppColorsTheme(colors ?? this.colors);

  @override
  AppColorsTheme lerp(covariant AppColorsTheme? other, double t) =>
      t < 0.5 || other == null ? this : other;
}

extension AppColorsContext on BuildContext {
  AppColors get colors => Theme.of(this).extension<AppColorsTheme>()!.colors;
}

abstract final class AppTheme {
  {{MODE_GETTERS}} // e.g. static ThemeData get dark => _build(AppColors.dark, Brightness.dark);

  static TextStyle _text({
    required String? family,
    required double size,
    required FontWeight weight,
    required double height,
    required Color color,
    double tracking = 0,
  }) {
    final style = TextStyle(
      fontSize: size,
      fontWeight: weight,
      height: height,
      letterSpacing: tracking * size,
      color: color,
    );
    return family == null ? style : GoogleFonts.getFont(family, textStyle: style);
  }

  static OutlineInputBorder _inputBorder(Color color, [double width = AppBorderWidth.thin]) =>
      OutlineInputBorder(
        borderRadius: AppRadius.mdAll,
        borderSide: BorderSide(color: color, width: width),
      );

  static ThemeData _build(AppColors c, Brightness brightness) {
    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      scaffoldBackgroundColor: c.canvas,
      dividerColor: c.borderSubtle,
      colorScheme: ColorScheme(
        brightness: brightness,
        primary: c.accent,
        onPrimary: c.onAccent,
        secondary: c.accent,
        onSecondary: c.onAccent,
        error: c.error,
        onError: c.onAccent,
        surface: c.surface,
        onSurface: c.textPrimary,
      ),
      extensions: [AppColorsTheme(c)],
      appBarTheme: AppBarTheme(
        backgroundColor: c.canvas,
        elevation: 0,
        scrolledUnderElevation: 0,
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: c.accent,
          foregroundColor: c.onAccent,
          elevation: 0,
          minimumSize: const Size(0, AppControlSize.buttonMd),
          padding: const EdgeInsets.symmetric(horizontal: AppInset.control),
          shape: const RoundedRectangleBorder(borderRadius: AppRadius.mdAll),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: c.surfaceSunken,
        contentPadding: const EdgeInsets.symmetric(horizontal: AppInset.control),
        border: _inputBorder(c.borderSubtle),
        enabledBorder: _inputBorder(c.borderSubtle),
        focusedBorder: _inputBorder(c.borderActive, AppBorderWidth.medium),
        errorBorder: _inputBorder(c.error),
        focusedErrorBorder: _inputBorder(c.error, AppBorderWidth.medium),
        hintStyle: TextStyle(color: c.textMuted),
      ),
      textTheme: TextTheme(
        displayLarge: _text(
          family: AppFontFamily.heading,
          size: AppFontSize.displayLg,
          weight: AppFontWeight.bold,
          height: AppLineHeight.tight,
          color: c.textPrimary,
          tracking: AppLetterSpacing.tight,
        ),
        displayMedium: _text(
          family: AppFontFamily.heading,
          size: AppFontSize.displayMd,
          weight: AppFontWeight.bold,
          height: AppLineHeight.tight,
          color: c.textPrimary,
          tracking: AppLetterSpacing.tight,
        ),
        headlineLarge: _text(
          family: AppFontFamily.heading,
          size: AppFontSize.headlineLg,
          weight: AppFontWeight.semibold,
          height: AppLineHeight.tight,
          color: c.textPrimary,
          tracking: AppLetterSpacing.tight,
        ),
        headlineMedium: _text(
          family: AppFontFamily.heading,
          size: AppFontSize.headlineMd,
          weight: AppFontWeight.semibold,
          height: AppLineHeight.tight,
          color: c.textPrimary,
        ),
        headlineSmall: _text(
          family: AppFontFamily.heading,
          size: AppFontSize.headlineSm,
          weight: AppFontWeight.semibold,
          height: AppLineHeight.tight,
          color: c.textPrimary,
        ),
        bodyLarge: _text(
          family: AppFontFamily.body,
          size: AppFontSize.bodyLg,
          weight: AppFontWeight.regular,
          height: AppLineHeight.normal,
          color: c.textPrimary,
        ),
        bodyMedium: _text(
          family: AppFontFamily.body,
          size: AppFontSize.bodyMd,
          weight: AppFontWeight.regular,
          height: AppLineHeight.normal,
          color: c.textPrimary,
        ),
        bodySmall: _text(
          family: AppFontFamily.body,
          size: AppFontSize.bodySm,
          weight: AppFontWeight.regular,
          height: AppLineHeight.normal,
          color: c.textSecondary,
        ),
        labelLarge: _text(
          family: AppFontFamily.body,
          size: AppFontSize.labelLg,
          weight: AppFontWeight.semibold,
          height: AppLineHeight.normal,
          color: c.textPrimary,
        ),
        labelMedium: _text(
          family: AppFontFamily.body,
          size: AppFontSize.labelMd,
          weight: AppFontWeight.medium,
          height: AppLineHeight.normal,
          color: c.textSecondary,
          tracking: AppLetterSpacing.wide,
        ),
        labelSmall: _text(
          family: AppFontFamily.body,
          size: AppFontSize.labelSm,
          weight: AppFontWeight.medium,
          height: AppLineHeight.normal,
          color: c.textSecondary,
        ),
      ),
    );
  }
}
```

`MaterialApp` wiring (`lib/main.dart`): dark-only → `theme: AppTheme.dark`; both modes → `theme: AppTheme.light, darkTheme: AppTheme.dark, themeMode: ThemeMode.system`.
