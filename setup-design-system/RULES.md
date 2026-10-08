# Design Rules

Source of truth: [`design-system/tokens.json`](tokens.json). Edit the JSON, then run `node scripts/generate-design-tokens.mjs`; generated token files stay untouched. `--check` fails on stale output.

## Spacing

- Use scale steps (`space`), or the semantic `gap` / `inset` aliases; spacing literals snap to the nearest step (3 → 4, 6 → 8, 10 → 12, 14 → 16, 18/20 → 16/24).
- Proximity: spacing inside a group is smaller than spacing between groups; each nesting level steps up at least one step.
- `xxs` is hairline-only (separators, track insets). A 2px gap between text lines or inside a badge is `xs`.
- A conditional child carries its own gap inside the condition, so a hidden child leaves no empty hole.

## Corners

- Role map: controls `md` · cards and dialogs `lg` · hero blocks `xl` · chips and badges `pill` · tiny inner elements `sm`.
- Nesting: inner radius = outer radius − padding, snapped to the scale (a 16px card with 8px padding holds `md` children).
- Hover never changes shape.

## Typography

- Every font size, weight, line height and tracking comes from the tokens; off-scale sizes snap to the nearest step (ties go down).
- Pair headings with `fontFamily.heading` and everything else with `fontFamily.body`.
- Body line height `normal`; headings and display `tight`.
- Tracking: `tight` on display and headlines, `wide` on uppercase labels.

## Color

- Use semantic roles only; raw hex, `rgba()` and ad-hoc alpha stay out of feature UI.
- Hierarchy comes from the surface levels (`canvas` → `surface` → `surfaceRaised`), not bright fills.
- `accent` marks the primary action and key data, never decoration.
- Status colors (`error`, `warning`, `success`, `info`) carry feedback only, paired with an icon or label — color alone never carries meaning.
- Text roles hold 4.5:1 on the surface they sit on; check any new pairing.
- Soft status/accent fills derive from the role plus alpha, not a hand-picked hex.

## Elevation

- Levels: 0 `canvas` · 1 `surface` + hairline · 2 `surfaceRaised` · 3 `surfaceRaised` + `shadow.raised` (dropdown, popover, tooltip) · 4 dialog + `shadow.overlay` over `scrim`.
- Depth comes from the surface levels first; shadows start at level 3. No other drop shadows.

## Icon size

- Icons use `iconSize` steps; off-scale sizes snap to the nearest step (ties go down; under the smallest step becomes the smallest).

## Grid and breakpoints

- Three window classes from `breakpoint`: compact, medium, expanded. Layouts read the class, not ad-hoc pixel widths.
- Columns, gutter and margin come from `grid` per class; the grid margin is also the page-body inset. Content stops at `containerMax`.

## Control sizes

- Control heights, hit areas and fixed control dimensions come from `controlSize`; any other fixed width or height sits on the 4px grid.
- Derived states use `opacity` (tint, tintBorder, disabled) and `borderWidth`, never ad-hoc values.

## Dimension

- Pick in order: a size token (`AppSize.sN` / `--size-N`) for element and block sizes; a span token (`AppSpan.cN` / `--span-N`) for `maxWidth` caps and wide widths; otherwise a literal on the grid (multiple of 4 up to 64, multiple of 8 above; 0 and 1 are free). Off-grid values snap to the nearest step (ties go down).
- A span is the width of N columns of the expanded grid; snap a literal width to the nearest span only within ±8.5%.
- A single-dimension box with no child is a spacer and uses the spacing scale.
- Dialogs and sheets cap height at the `viewport` fraction of the window height, never a fixed px. Charts and media follow their width (aspect ratio), not a fixed height.
