#!/usr/bin/env node
// scripts/generate-design-tokens.mjs
//
// Generates CSS and/or Dart design tokens from design-system/tokens.json.
//
//   node scripts/generate-design-tokens.mjs          # write generated files
//   node scripts/generate-design-tokens.mjs --check  # exit 1 when files are stale
//
// Outputs are the paths in tokens.json `output` (css, dart), relative to the project root.
// Sections absent from tokens.json (space, radius, fontSize, color, ...) are skipped.
// Token references like `radius.md` in design-system/DESIGN.md and COMPONENTS.md must resolve.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(readFileSync(path.join(root, 'design-system', 'tokens.json'), 'utf8'));
const NOTE = 'GENERATED FILE — DO NOT EDIT. Source: design-system/tokens.json. Run `node scripts/generate-design-tokens.mjs`.';
const SYSTEM_FONTS = /^(system-ui|-apple-system|ui-monospace|ui-sans-serif)$/;
const SIZES = ['compact', 'medium', 'expanded'];
const DOCS = ['DESIGN.md', 'COMPONENTS.md'];
const GROUPS = ['space', 'gap', 'inset', 'radius', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
  'color', 'shadow', 'iconSize', 'breakpoint', 'grid', 'controlSize', 'opacity', 'borderWidth', 'dimension', 'viewport'];

const entries = (obj = {}) => Object.entries(obj).filter(([k]) => !k.startsWith('$'));
const kebab = (s) => s.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/([a-zA-Z])(\d)/g, '$1-$2').toLowerCase();
const fail = (msg) => { throw new Error(`tokens.json: ${msg}`); };
const px = (n) => `${n}px`;
const spanCount = () => tokens.grid.columns.expanded;
// Width of an n-column span on the expanded grid: n columns + (n - 1) gutters.
const spanWidth = (n) => {
  const { columns, gutter, containerMax } = { columns: spanCount(), gutter: tokens.grid.gutter.expanded, containerMax: tokens.grid.containerMax };
  const column = (containerMax - (columns - 1) * gutter) / columns;
  return Math.round(n * column + (n - 1) * gutter);
};

const modes = tokens.modes ?? ['light'];
if (!['light', 'dark', 'light,dark'].includes(modes.join(','))) fail(`modes must be ["light"], ["dark"] or ["light","dark"], got ${JSON.stringify(modes)}`);

function validate() {
  for (const group of ['gap', 'inset']) {
    for (const [name, ref] of entries(tokens[group])) {
      if (!(ref in (tokens.space ?? {}))) fail(`${group}.${name} references unknown space.${ref}`);
    }
  }
  for (const [name, def] of entries(tokens.color)) {
    for (const mode of modes) {
      if (!/^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(def[mode] ?? '')) fail(`color.${name}.${mode} must be #RRGGBB or #RRGGBBAA`);
    }
  }
  for (const [name, def] of entries(tokens.radius)) {
    if (typeof def.value !== 'number') fail(`radius.${name}.value must be a number`);
  }
  if (tokens.shadow && !tokens.color?.shadow) fail('shadow needs a color.shadow role');
  if (tokens.grid && !tokens.breakpoint) fail('grid needs breakpoint');
  if (tokens.dimension) {
    const values = tokens.dimension.values;
    if (!Array.isArray(values) || !values.every((v) => Number.isInteger(v) && v > 0)) fail('dimension.values must be an array of positive integers');
    if (tokens.dimension.spans && !tokens.grid) fail('dimension.spans needs grid');
  }
  if (tokens.grid) {
    for (const key of ['columns', 'gutter', 'margin']) {
      for (const size of SIZES) if (typeof tokens.grid[key]?.[size] !== 'number') fail(`grid.${key}.${size} must be a number`);
    }
  }
}

function validateDocRefs() {
  const pattern = new RegExp(`\`(${GROUPS.join('|')})\\.([A-Za-z0-9]+)\``, 'g');
  const missing = [];
  for (const doc of DOCS) {
    const file = path.join(root, 'design-system', doc);
    if (!existsSync(file)) continue;
    for (const [, group, name] of readFileSync(file, 'utf8').matchAll(pattern)) {
      if (!tokens[group] || !(name in tokens[group])) missing.push(`${doc}: \`${group}.${name}\``);
    }
  }
  if (missing.length) fail(`unresolved token references:\n  ${[...new Set(missing)].join('\n  ')}`);
}

const dartColor = (hex) => {
  const h = hex.slice(1).toUpperCase();
  return `Color(0x${h.length === 8 ? h.slice(6) + h.slice(0, 6) : 'FF' + h})`;
};
const dartFamily = (stack) => {
  const first = stack.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
  return SYSTEM_FONTS.test(first) ? 'null' : `'${first}'`;
};

function buildCss() {
  const body = [];
  const block = (title, rows) => rows.length && body.push(`  /* ${title} */`, ...rows, '');
  const flat = (group, prefix, fmt) => entries(tokens[group]).map(([k, v]) => `  --${prefix}-${kebab(k)}: ${fmt(v, k)};`);

  block('Space', flat('space', 'space', px));
  block('Gap', flat('gap', 'gap', (v) => `var(--space-${kebab(v)})`));
  block('Inset', flat('inset', 'inset', (v) => `var(--space-${kebab(v)})`));
  block('Radius', flat('radius', 'radius', (d) => px(d.value)));
  block('Font family', flat('fontFamily', 'font-family', (v) => v));
  block('Font size', flat('fontSize', 'font-size', (v) => `${v / 16}rem`));
  block('Font weight', flat('fontWeight', 'font-weight', (v) => v));
  block('Line height', flat('lineHeight', 'line-height', (v) => v));
  block('Letter spacing', flat('letterSpacing', 'letter-spacing', (v) => `${v}em`));
  block('Shadow', flat('shadow', 'shadow', (d) => `${d.x}px ${d.y}px ${d.blur}px var(--color-shadow)`));
  block('Icon size', flat('iconSize', 'icon-size', px));
  block('Breakpoint (reference — media queries use the literal px)', flat('breakpoint', 'breakpoint', px));
  block('Control size', flat('controlSize', 'control-size', px));
  block('Opacity', flat('opacity', 'opacity', (v) => v));
  block('Border width', flat('borderWidth', 'border-width', px));
  if (tokens.dimension) {
    block('Dimension — element and block sizes', tokens.dimension.values.map((v) => `  --size-${v}: ${px(v)};`));
    if (tokens.dimension.spans) {
      const { gutter, containerMax } = tokens.grid;
      const columns = spanCount();
      const fixed = (columns - 1) * gutter.expanded;
      block('Dimension — content widths (N-column spans of the expanded grid)', Array.from({ length: columns }, (_, i) =>
        `  --span-${i + 1}: calc((${px(containerMax)} - ${px(fixed)}) / ${columns} * ${i + 1} + ${px(i * gutter.expanded)});`));
    }
  }
  if (tokens.viewport) {
    block('Viewport', [`  --dialog-max-height: ${tokens.viewport.dialogMaxHeightFraction * 100}dvh;`]);
  }
  if (tokens.grid) {
    const g = tokens.grid;
    block('Grid — compact', [`  --grid-columns: ${g.columns.compact};`, `  --grid-gutter: ${px(g.gutter.compact)};`,
      `  --grid-margin: ${px(g.margin.compact)};`, `  --container-max: ${px(g.containerMax)};`]);
  }

  const colorRows = (mode, pad) => entries(tokens.color).map(([k, d]) => `${pad}--color-${kebab(k)}: ${d[mode].toUpperCase()};`);
  const [first, second] = modes;
  if (tokens.color) {
    body.push(`  /* Color — ${first} */`, `  color-scheme: ${first};`, ...colorRows(first, '  '));
  } else {
    body.pop();
  }

  const out = [`/* ${NOTE} */`, ':root {', ...body, '}'];
  if (tokens.color && second) {
    out.push('', '@media (prefers-color-scheme: dark) {', '  :root:not([data-theme="light"]) {', `    color-scheme: ${second};`,
      ...colorRows(second, '    '), '  }', '}');
    out.push('', ':root[data-theme="dark"] {', `  color-scheme: ${second};`, ...colorRows(second, '  '), '}');
  }
  if (tokens.grid) {
    const g = tokens.grid;
    for (const size of SIZES.slice(1)) {
      out.push('', `@media (min-width: ${tokens.breakpoint[size]}px) {`, '  :root {', `    --grid-columns: ${g.columns[size]};`,
        `    --grid-gutter: ${px(g.gutter[size])};`, `    --grid-margin: ${px(g.margin[size])};`, '  }', '}');
    }
  }
  return out.join('\n') + '\n';
}

function buildDart() {
  const out = [`// ${NOTE}`, "import 'package:flutter/painting.dart';", ''];
  const group = (cls, rows) => rows.length && out.push(`abstract final class ${cls} {`, ...rows, '}', '');
  const doubles = (name, cls) => group(cls, entries(tokens[name]).map(([k, v]) => `  static const double ${k} = ${v};`));
  const aliases = (name, cls) => group(cls, entries(tokens[name]).map(([k, v]) => `  static const double ${k} = AppSpacing.${v};`));

  doubles('space', 'AppSpacing');
  aliases('gap', 'AppGap');
  aliases('inset', 'AppInset');
  group('AppRadius', entries(tokens.radius).flatMap(([k, d]) => [
    `  static const double ${k} = ${d.value};`,
    `  static const BorderRadius ${k}All = BorderRadius.all(Radius.circular(${d.value}));`,
  ]));
  group('AppFontFamily', entries(tokens.fontFamily).map(([k, v]) => `  static const String? ${k} = ${dartFamily(v)};`));
  doubles('fontSize', 'AppFontSize');
  group('AppFontWeight', entries(tokens.fontWeight).map(([k, v]) => `  static const FontWeight ${k} = FontWeight.w${v};`));
  doubles('lineHeight', 'AppLineHeight');
  group('AppLetterSpacing', entries(tokens.letterSpacing).map(([k, v]) => `  static const double ${k} = ${v}; // em — multiply by font size`));
  doubles('iconSize', 'AppIconSize');
  doubles('controlSize', 'AppControlSize');
  doubles('opacity', 'AppOpacity');
  doubles('borderWidth', 'AppBorderWidth');
  doubles('breakpoint', 'AppBreakpoint');
  if (tokens.dimension) {
    group('AppSize', tokens.dimension.values.map((v) => `  static const double s${v} = ${v};`));
    if (tokens.dimension.spans) {
      group('AppSpan', Array.from({ length: spanCount() }, (_, i) => `  static const double c${i + 1} = ${spanWidth(i + 1)};`));
    }
  }
  if (tokens.viewport) {
    group('AppViewport', [`  static const double dialogMaxHeightFraction = ${tokens.viewport.dialogMaxHeightFraction};`]);
  }

  if (tokens.shadow) {
    out.push('abstract final class AppShadow {');
    entries(tokens.shadow).forEach(([k, d], i) => {
      if (i > 0) out.push('');
      out.push(`  static List<BoxShadow> ${k}(AppColors colors) {`, '    return [',
        `      BoxShadow(offset: Offset(${d.x}, ${d.y}), blurRadius: ${d.blur}, color: colors.shadow),`, '    ];', '  }');
    });
    out.push('}', '');
  }

  if (tokens.grid) {
    const g = tokens.grid;
    out.push('enum AppWindowSize {', '  compact,', '  medium,', '  expanded;', '',
      '  static AppWindowSize fromWidth(double width) {',
      '    if (width >= AppBreakpoint.expanded) return expanded;',
      '    if (width >= AppBreakpoint.medium) return medium;',
      '    return compact;', '  }', '}', '');
    out.push('abstract final class AppGrid {', `  static const double containerMax = ${g.containerMax};`, '');
    const accessors = [['columns', 'int', ''], ['gutter', 'double', '.0'], ['margin', 'double', '.0']];
    for (const [key, , suffix] of accessors) {
      out.push(`  static const _${key} = [${SIZES.map((s) => g[key][s] + suffix).join(', ')}];`);
    }
    out.push('');
    for (const [key, type] of accessors) {
      out.push(`  static ${type} ${key}(AppWindowSize size) => _${key}[size.index];`);
    }
    out.push('}', '');
  }

  if (tokens.color) {
    const names = entries(tokens.color).map(([k]) => k);
    out.push('class AppColors {', '  const AppColors({', ...names.map((n) => `    required this.${n},`), '  });', '');
    out.push(...names.map((n) => `  final Color ${n};`), '');
    for (const mode of modes) {
      out.push(`  static const ${mode} = AppColors(`,
        ...entries(tokens.color).map(([k, d]) => `    ${k}: ${dartColor(d[mode])},`), '  );');
      if (mode !== modes.at(-1)) out.push('');
    }
    out.push('}', '');
  }
  return out.join('\n');
}

validate();
validateDocRefs();
const check = process.argv.includes('--check');
const outputs = [['css', buildCss], ['dart', buildDart]].filter(([key]) => tokens.output?.[key]);
if (outputs.length === 0) fail('output must name at least one of css, dart');

let stale = false;
for (const [key, build] of outputs) {
  const target = path.join(root, tokens.output[key]);
  const next = build();
  if (check) {
    if (!existsSync(target) || readFileSync(target, 'utf8') !== next) {
      console.error(`stale: ${tokens.output[key]}`);
      stale = true;
    }
  } else {
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, next);
    console.log(`wrote ${tokens.output[key]}`);
  }
}
if (stale) process.exit(1);
