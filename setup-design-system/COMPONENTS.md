# Component Specs

Tokens: [`tokens.json`](tokens.json). Rules: [`DESIGN.md`](DESIGN.md). Every `group.name` below names a token; the generator fails on an unresolved one.

## Interaction states

Every interactive component implements these; hover never changes shape.

| State | Treatment |
|-------|-----------|
| default | per component |
| hover | `color.overlayHover` over the base fill (pointer only; never the only affordance) |
| pressed | `color.overlayPressed` over the base fill; no layout shift |
| focused (keyboard) | `borderWidth.medium` ring in `color.borderActive`, drawn over the control (no layout shift); Tab order = visual order |
| selected | `color.accent` tint fill (`opacity.tint`) + `color.borderActive` edge, or the control's own mark (check, dot, thumb) — never color alone |
| disabled | `opacity.disabled` on label and icon, no hover or press, non-interactive semantics |
| error | `color.error` text below the field plus `color.error` border — never color alone |
| loading | the control's inline progress, or a skeleton of the content — never a page spinner |

Hit areas are at least `controlSize.touchTarget`: small controls keep their visual size and pad the tap area. Icon-only controls carry an accessible name.

## Button

- Heights: `controlSize.buttonXs` · `controlSize.buttonSm` · `controlSize.buttonMd` (default) · `controlSize.buttonLg`. Radius `radius.md`. Horizontal padding `inset.control`; icon ↔ label `gap.inline`.
- **Primary:** `color.accent` fill, `color.onAccent` label, `fontWeight.bold`.
- **Secondary:** transparent fill, `borderWidth.thin` `color.borderStrong` edge, `color.textPrimary` label, `fontWeight.semibold`. Hover: edge → `color.borderActive`.
- **Ghost:** transparent fill, `color.accent` or `color.textSecondary` label, `fontWeight.semibold`.
- **Destructive:** `color.error` label and edge, `color.error` tint fill (`opacity.tint`).
- Label size `fontSize.labelLg`. At most one primary per view region.

## Icon button

- Sizes: `controlSize.iconButtonSm` · `controlSize.iconButtonMd` · `controlSize.iconButtonLg`; glyph `iconSize.md` (`iconSize.lg` at the large size). Radius `radius.md` (square) or `radius.pill` (round).
- The accessible name (tooltip) is required.

## Input

- Heights: `controlSize.input` (default) · `controlSize.inputSm`. Fill `color.surfaceSunken`; radius `radius.md`; padding `inset.control`.
- Edge: `borderWidth.thin` `color.borderSubtle`; focus `color.borderActive`; error `color.error`.
- Typed text `color.textPrimary` at `fontSize.bodyLg`; placeholder `color.textMuted` — always distinct from typed text. Label `color.textSecondary` at `fontSize.labelMd`; helper and error text `fontSize.labelSm`.
- Read-only is not disabled: it keeps normal contrast and stays focusable.

## Card

- Fill `color.surface`, `borderWidth.thin` `color.borderSubtle` edge, radius `radius.lg`, padding `inset.card` (`inset.cardDense` when compact). No drop shadow at rest.
- Interactive card: hover adds `color.overlayHover`; no shape change.
- Highlight card: `color.surfaceRaised` fill or a `color.borderActive` edge.

## Chip, tag, badge

- Chip: height `controlSize.chip`, radius `radius.pill`, padding `inset.controlSm`. Variants: filter (selectable), action, removable.
- Tag: heights `controlSize.tagSm` · `controlSize.tagMd`, radius `radius.sm`, `fontSize.labelMd`. Status text on its role tint (`opacity.tint`) with a `opacity.tintBorder` hairline.
- Badge: count or dot; radius `radius.pill`.
- Status is conveyed by text or icon plus color.

## List item

- Heights: `controlSize.listItemSm` · `controlSize.listItemMd` · `controlSize.listItemLg`. Rows separate with a `color.borderSubtle` divider, not spacing. Hover `color.overlayHover`.

## Selection controls

- Checkbox and radio `controlSize.checkbox` / `controlSize.radio`; switch `controlSize.switchWidth` × `controlSize.switchHeight`. The label belongs to the tap target.

## Dialog

- Surface `color.surfaceRaised`, radius `radius.lg`, padding `inset.card`, `shadow.overlay`, over a `color.scrim` barrier. Header holds title and close button; actions row right-aligned with `gap.inline`.
- Max height is a fraction of the window height, never a fixed px.

## Popover, dropdown, tooltip

- Surface `color.surfaceRaised`, radius `radius.md`, `shadow.raised`, `borderWidth.thin` `color.borderSubtle` edge.

## Loading

- Pages and sections show skeletons shaped like the content. A spinner appears only inside a button.
