---
name: prd-generator
description: "Generate a Product Requirements Document (PRD) for a new feature. Use when planning a feature, starting a new project, or when asked to create a PRD. Triggers on: create a prd, write prd for, plan this feature, requirements for, spec out."
version: 2.0.0
user-invocable: true
---

# PRD Generator

Create detailed Product Requirements Documents that are clear, actionable, and suitable for implementation.

---

## The Job

1. Run **First-Run Setup** if this environment has not been configured yet
2. Receive a feature description from the user
3. Ask 3-5 essential clarifying questions (with lettered options)
4. **If the feature creates or updates any page/screen:** run the UI/UX design pass and incorporate its output into the PRD's Design Considerations section
5. Generate a structured PRD based on answers + design guidance
6. Save to `tasks/prd-[feature-name].md`

**Important:** Do NOT start implementing. Just create the PRD.

---

## First-Run Setup (once per environment)

Before doing anything else, look for the config file `tasks/.prd-generator.json` at the repository root.

- **If it exists:** read it and skip this section. Never re-ask unless the user asks to reconfigure.
- **If it does not exist:** ask the setup questions below in a single message, then write the config file (creating `tasks/` if needed).

### Question 1 — Preferred UI/UX skill (always ask)

```
1. Do you have a preferred UI/UX skill I should use for design guidance in PRDs?
   A. Yes — [name the skill]
   B. No preference — pick whatever is available when a PRD touches UI
   C. None — skip the design pass entirely
```

Before asking, list the UI/UX-related skills you can actually see in this environment so the user can pick from real options.

### Question 2 — grill-me availability (ask only if missing)

Check whether the `grill-me` skill is installed. If it is, say nothing. If it is **not** installed, ask:

```
2. The `grill-me` skill isn't installed. It runs an exhaustive interview for
   complex features (more than 5 user stories) instead of a short question round.
   A. I'll install it now — wait for me
   B. Skip it — use standard clarifying questions instead
   C. Ask me again next time
```

Point the user at their skill manager or skills directory. Do not invent an install URL.

### Write the config

```json
{
  "uiUxMode": "preferred | agent-choice | none",
  "uiUxSkill": "<skill name, or null>",
  "grillMe": "installed | declined | remind-later"
}
```

`remind-later` is the only value that causes the grill-me question to be asked again on a later run.

---

## Complexity Check: When to Use grill-me

Before asking clarifying questions, estimate the scope of the output:

- If the feature would likely produce **more than 5 user stories**, it is complex enough to require deeper exploration.
- If `grill-me` is available, **invoke it** instead of asking the standard 3-5 questions. Let it interview the user exhaustively — resolving each decision branch — and use all answers gathered as the input to write the final PRD.
- If `grill-me` is not available (declined or not installed), run an expanded clarifying round instead: keep asking lettered questions until every decision branch is resolved. Do not shrink the PRD to fit a short interview.
- Only use the standard short question round below when the feature is clearly small (≤ 5 stories).

---

## UI/UX Design Pass (REQUIRED for any page/screen work)

**Every PRD that creates or updates a page, screen, modal, sheet, or any user-facing surface MUST include a design pass.** No specific skill is required to run it.

### When to trigger

- The feature introduces a **new page or screen**.
- The feature **modifies the layout, navigation, or visual structure** of an existing page.
- The feature adds **new UI components** (cards, forms, lists, charts, modals, etc.).

### How to run

Follow `uiUxMode` from the config:

- **`preferred`** — invoke the skill named in `uiUxSkill` and incorporate its output. If that skill is no longer available, tell the user once, then fall back to `agent-choice` for this run.
- **`agent-choice`** — decide for yourself how to produce design guidance: use any design/UI skill available in the current environment, the project's existing design system (tokens, theme files, component library, design docs), and your own judgement. Pick the best option available; do not warn about skills that are not installed.
- **`none`** — skip the design pass. Still fill Design Considerations with the project's existing conventions and components to reuse.

Whatever the source, the design pass must produce: style direction, color palette, typography, UX rules to enforce, and the existing components that should be reused. Add the relevant UX rules as acceptance criteria on UI user stories.

---

## Step 1: Clarifying Questions

Ask only critical questions where the initial prompt is ambiguous. Focus on:

- **Problem/Goal:** What problem does this solve?
- **Core Functionality:** What are the key actions?
- **Scope/Boundaries:** What should it NOT do?
- **Success Criteria:** How do we know it's done?

### Format Questions Like This:

```
1. What is the primary goal of this feature?
   A. Improve user onboarding experience
   B. Increase user retention
   C. Reduce support burden
   D. Other: [please specify]

2. Who is the target user?
   A. New users only
   B. Existing users only
   C. All users
   D. Admin users only

3. What is the scope?
   A. Minimal viable version
   B. Full-featured implementation
   C. Just the backend/API
   D. Just the UI
```

This lets users respond with "1A, 2C, 3B" for quick iteration. Remember to indent the options.

---

## Step 2: PRD Structure

Generate the PRD with these sections:

### 1. Introduction/Overview

Brief description of the feature and the problem it solves.

### 2. Goals

Specific, measurable objectives (bullet list).

### 3. User Stories

Each story needs:

- **Title:** Short descriptive name
- **Description:** "As a [user], I want [feature] so that [benefit]"
- **Acceptance Criteria:** Verifiable checklist of what "done" means

Each story should be small enough to implement in one focused session.

**Format:**

```markdown
### US-001: [Title]

**Description:** As a [user], I want [feature] so that [benefit].

**Acceptance Criteria:**

- [ ] Specific verifiable criterion
- [ ] Another criterion
- [ ] Typecheck/lint passes
- [ ] **[UI stories only]** Visually verified on the target platform
```

**Important:**

- Acceptance criteria must be verifiable, not vague. "Works correctly" is bad. "Button shows confirmation dialog before deleting" is good.
- **For any story with UI changes:** Always include a visual verification criterion (browser, simulator, or device, whichever fits the project).

### 4. Functional Requirements

Numbered list of specific functionalities:

- "FR-1: The system must allow users to..."
- "FR-2: When a user clicks X, the system must..."

Be explicit and unambiguous.

### 5. Non-Goals (Out of Scope)

What this feature will NOT include. Critical for managing scope.

### 6. Design Considerations (REQUIRED when feature touches any page/screen)

This section is **mandatory** for any feature that creates or updates a user-facing surface. Populate it with the output of the UI/UX design pass.

Include:

- **Style & visual direction** — recommended style (e.g. minimalism, glassmorphism), effects, and anti-patterns to avoid.
- **Color palette** — primary, secondary, surface, and semantic colors (prefer the project's existing color tokens).
- **Typography** — font pairing, scale, and weight hierarchy.
- **UX rules to enforce** — accessibility, touch targets, loading states, empty states, error states, navigation.
- **Existing components to reuse** — widgets/components already in the codebase that should be leveraged.
- **Source of the guidance** — which skill, design system, or design doc it came from.
- **Link to mockups** if available.

### 7. Technical Considerations (Optional)

- Known constraints or dependencies
- Integration points with existing systems
- Performance requirements

### 8. Success Metrics

How will success be measured?

- "Reduce time to complete X by 50%"
- "Increase conversion rate by 10%"

### 9. Open Questions

Remaining questions or areas needing clarification.

---

## Writing for Junior Developers

The PRD reader may be a junior developer or AI agent. Therefore:

- Be explicit and unambiguous
- Avoid jargon or explain it
- Provide enough detail to understand purpose and core logic
- Number requirements for easy reference
- Use concrete examples where helpful

---

## Output

- **Format:** Markdown (`.md`)
- **Location:** `tasks/` (for new/in-progress PRDs)
- **Filename:** `prd-[feature-name].md` (kebab-case)

### PRD Lifecycle

- **New PRDs** are saved to `tasks/prd-[feature-name].md`.
- **Implemented PRDs** are moved to `tasks/done/` once the feature is fully implemented.
- `tasks/prd-master.md` always stays in `tasks/` — it is the living tracker with open questions, screen registry, and status. Keep it up to date when creating or completing PRDs.
- When completing a feature, move its PRD to `tasks/done/` and update the link and status in `prd-master.md`.

---

## Example PRD

```markdown
# PRD: Task Priority System

## Introduction

Add priority levels to tasks so users can focus on what matters most. Tasks can be marked as high, medium, or low priority, with visual indicators and filtering to help users manage their workload effectively.

## Goals

- Allow assigning priority (high/medium/low) to any task
- Provide clear visual differentiation between priority levels
- Enable filtering and sorting by priority
- Default new tasks to medium priority

## User Stories

### US-001: Add priority field to database

**Description:** As a developer, I need to store task priority so it persists across sessions.

**Acceptance Criteria:**

- [ ] Add priority column to tasks table: 'high' | 'medium' | 'low' (default 'medium')
- [ ] Generate and run migration successfully
- [ ] Typecheck passes

### US-002: Display priority indicator on task cards

**Description:** As a user, I want to see task priority at a glance so I know what needs attention first.

**Acceptance Criteria:**

- [ ] Each task card shows colored priority badge (red=high, yellow=medium, gray=low)
- [ ] Priority visible without hovering or clicking
- [ ] Typecheck passes
- [ ] Visually verified on the target platform

### US-003: Add priority selector to task edit

**Description:** As a user, I want to change a task's priority when editing it.

**Acceptance Criteria:**

- [ ] Priority dropdown in task edit modal
- [ ] Shows current priority as selected
- [ ] Saves immediately on selection change
- [ ] Typecheck passes
- [ ] Visually verified on the target platform

### US-004: Filter tasks by priority

**Description:** As a user, I want to filter the task list to see only high-priority items when I'm focused.

**Acceptance Criteria:**

- [ ] Filter dropdown with options: All | High | Medium | Low
- [ ] Filter persists in URL params
- [ ] Empty state message when no tasks match filter
- [ ] Typecheck passes
- [ ] Visually verified on the target platform

## Functional Requirements

- FR-1: Add `priority` field to tasks table ('high' | 'medium' | 'low', default 'medium')
- FR-2: Display colored priority badge on each task card
- FR-3: Include priority selector in task edit modal
- FR-4: Add priority filter dropdown to task list header
- FR-5: Sort by priority within each status column (high to medium to low)

## Non-Goals

- No priority-based notifications or reminders
- No automatic priority assignment based on due date
- No priority inheritance for subtasks

## Technical Considerations

- Reuse existing badge component with color variants
- Filter state managed via URL search params
- Priority stored in database, not computed

## Success Metrics

- Users can change priority in under 2 clicks
- High-priority tasks immediately visible at top of lists
- No regression in task list performance

## Open Questions

- Should priority affect task ordering within a column?
- Should we add keyboard shortcuts for priority changes?
```

---

## Checklist

Before saving the PRD:

- [ ] First-run setup done, or `tasks/.prd-generator.json` already present
- [ ] Asked clarifying questions with lettered options
- [ ] Incorporated user's answers
- [ ] **[If feature touches any page/screen]** Ran the design pass per `uiUxMode` and filled Design Considerations
- [ ] User stories are small and specific
- [ ] UI user stories include UX acceptance criteria (accessibility, touch targets, loading states, etc.)
- [ ] Functional requirements are numbered and unambiguous
- [ ] Non-goals section defines clear boundaries
- [ ] Saved to `tasks/prd-[feature-name].md` (moves to `tasks/done/` once implemented)

---

## Changelog

Versioned with [semantic versioning](https://semver.org/): major = changed or removed behavior, minor = new behavior, patch = wording and fixes.

### 2.0.0

- **Removed** the hardcoded `ui-ux-pro-max` dependency. The design pass no longer requires, invokes, or warns about any specific skill.
- **Removed** the `dev-browser` skill from UI acceptance criteria in favor of platform-agnostic visual verification.
- **Added** First-Run Setup: on first use in a repo, ask for a preferred UI/UX skill and store the answer in `tasks/.prd-generator.json` so it is never asked again.
- **Added** `uiUxMode` (`preferred` / `agent-choice` / `none`) to drive the design pass. Under `agent-choice` the agent picks its own design source per feature.
- **Added** a one-time `grill-me` install prompt, shown only when the skill is missing, plus an expanded clarifying-question fallback when it is unavailable.
- **Added** a "Source of the guidance" field to Design Considerations.

### 1.0.0

- Initial release (unversioned).
