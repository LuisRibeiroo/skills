---
name: setup-design-system
description: Base design system (tokens for spacing, corners, typography, colors, elevation, icon sizes, grid, control sizes, plus component specs) for web and mobile. Use when the user wants to add, scaffold, or merge a design system or design tokens in a project.
---

A **base design system** is one `design-system/tokens.json` plus generated platform files, a rules file and a component-specs file. Structure follows `~/projects/so-players/design-system`: primitive scale plus semantic aliases, 4px grid, radius roles, tonal color roles, elevation levels, window-size classes. Defaults live in [`tokens.default.json`](tokens.default.json); the project's rules derive from [`RULES.md`](RULES.md) and its component specs from [`COMPONENTS.md`](COMPONENTS.md); the generator is [`scripts/generate-design-tokens.mjs`](scripts/generate-design-tokens.mjs) (CSS and Dart).

Sections, in ratify order:

| Section | Token groups |
|---|---|
| **spacing** | `space`, `gap`, `inset` |
| **corners** | `radius` |
| **typography** | `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing` |
| **colors** | `color` (light and dark, includes `shadow`) |
| **elevation** | `shadow` (needs `color.shadow`) |
| **icon sizes** | `iconSize` |
| **grid** | `breakpoint`, `grid` |
| **controls** | `controlSize`, `opacity`, `borderWidth` |
| **dimension** *(optional)* | `dimension` (fixed sizes → `AppSize` / `--size-N`; content widths → `AppSpan` / `--span-N`, needs **grid**), `viewport` |
| **components** | `COMPONENTS.md` — prose specs that cite tokens as `group.name` |

**Optional** sections stay out of the run until the user opts in (step 2). Run the steps in order. Write nothing to the project before step 3.

## 1. Survey

Detect the platform from the project root: `pubspec.yaml` → Flutter (`dart` output); `package.json` or stylesheets → web (`css` output); both → both. Any other platform (React Native, SwiftUI, Compose) → tokens.json only; tell the user the generator does not cover it.

Pick output paths by project convention (`lib/core/design/app_tokens.g.dart`, `src/styles/tokens.css` are the defaults); in a monorepo, ask which package.

Find an existing design system: `design-system/`, `tokens.*`, `theme.*`, `AppColors`/`AppSpacing`-style constants, Tailwind `@theme` / config, `DESIGN.md`, `MASTER.md`.

Mark **dimension** as the optional section to offer: **recommend it** to web projects (fixed sizes and `maxWidth` caps become tokens, off-grid width/height literals stop appearing; touch targets and content columns line up with the grid), mention it as available for mobile-only projects. Drop a section that does not apply (no UI text → typography; headless → all; a platform that never resizes → grid). Done when you have told the user the platform, the output paths, the existing design-system files (or "none"), and the dropped sections.

## 2. Ratify each section

Go section by section in table order. For the optional section, first ask *Add dimension?* (web: lead with the recommendation and its reason; mobile: neutral); on *No*, drop it. Dimension spans need **grid**; when grid was dropped, ratify sizes and viewport only. For each, show a table of its tokens (name, value, role note) and ask via AskUserQuestion; a section is **ratified** when the user accepts it. The **components** section goes last: show one line per component from `COMPONENTS.md` (component → key spec), and when a cited token's section was dropped or a token renamed, edit the citing lines to match.

- **No existing design system:** show the defaults. *Accept* ratifies; *Adjust* → apply the user's edits, show the table again, ask again.
- **Existing design system:** read its current values for the section. Show defaults beside current; list each **conflict** (same role, different value, or a scale step one side lacks). Ask *Keep current / Use default / Decide per rule*. For *Decide per rule*, ask each conflict (batches of up to 4) with the two values as options. Tokens only one side has are kept. For **components**, a conflict is a component spec that differs from the project's existing one; compare per component.

Accumulate ratified values in a draft in the scratchpad. Done when every non-dropped section is ratified and no conflict is open.

## 3. Create

1. Write `design-system/tokens.json` from the draft: ratified sections only, `output` paths from step 1, `modes` from the colors the user kept (`["dark"]` for dark-only). Set `dimension.spans` to `false` when grid was dropped.
2. Copy the generator to `scripts/generate-design-tokens.mjs`.
3. Write `design-system/DESIGN.md` from `RULES.md` and `design-system/COMPONENTS.md` from `COMPONENTS.md`, keeping only ratified sections and components.
4. Run the generator, then `--check`. The generator also fails on any `group.name` in the two docs that is not in `tokens.json`; fix the doc line and rerun.

Done when both generator runs exit 0 and the output files exist. Files of a pre-existing design system stay untouched; list them as superseded in step 5.

## 4. Apply as default

1. Add a pointer to the agent-instructions file (`AGENTS.md`, else `CLAUDE.md`, else create `AGENTS.md`): *"UI work: follow `design-system/DESIGN.md` and `design-system/COMPONENTS.md`; tokens in `design-system/tokens.json`, never edit generated files."*
2. Name the one obvious wiring point (global stylesheet import for web; `ThemeData` / `MaterialApp` for Flutter) and ask before editing it. Skip when the user declines or no single point exists.

Done when the pointer is in the instructions file and the wiring decision is recorded.

## 5. Report

List files written, files superseded, the regenerate command (`node scripts/generate-design-tokens.mjs`), and any wiring left to the user.
