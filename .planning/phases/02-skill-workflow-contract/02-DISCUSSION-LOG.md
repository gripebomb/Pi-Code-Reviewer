# Phase 2: Skill Workflow Contract - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-04-20
**Phase:** 02-skill-workflow-contract
**Areas discussed:** SKILL.md structure, Report structure & tone, Workflow UX, Template/reference design

---

## SKILL.md Structure

| Option | Description | Selected |
| ---------- | ---------------------------------- | -------- |
| Concise orchestrator | Short skill file, delegates details to reference docs | ✓ |
| Self-contained monolith | Everything in one SKILL.md file | |
| Hybrid with inline essentials | Core workflow inline, rubric/examples in references | |

**User's choice:** Concise orchestrator
**Notes:** Matches architecture research recommendation and avoids the "one giant SKILL.md" anti-pattern.

### Follow-up: Pipeline granularity

| Option | Description | Selected |
| ---------- | ---------------------------------- | -------- |
| 3-phase pipeline | Scope, analyze, report — minimal scaffolding | |
| 5-phase pipeline | Scope, gather, evaluate, prioritize, write — more guidance | ✓ |
| Agent's discretion | Let planning/research decide granularity | |

**User's choice:** 5-phase pipeline
**Notes:** Clear checkpoints for consistent behavior without micromanaging.

---

## Report Structure & Tone

### Section detail level

| Option | Description | Selected |
| ---------- | ---------------------------------- | -------- |
| Findings-only | Bullet list of findings, no narrative | |
| Summary + findings | 1-2 sentence assessment per section, then findings | ✓ |
| Agent's discretion | Let planning determine depth | |

**User's choice:** Summary + findings
**Notes:** Quick read on each category before diving into details.

### Finding format within sections

| Option | Description | Selected |
| ---------- | ---------------------------------- | -------- |
| Flat bullet list | Each finding as a bullet with file, severity, description | |
| Severity-grouped sub-sections | Findings under High/Medium/Low sub-headers | ✓ |
| Inline table per section | Markdown table with File/Severity/Finding/Recommendation columns | |

**User's choice:** Severity-grouped sub-sections
**Notes:** Lets users triage most important issues first within each category.

### Report tone

| Option | Description | Selected |
| ---------- | ---------------------------------- | -------- |
| Direct and clinical | Factual, no hedging | |
| Actionable but conversational | Context and reasoning per finding | ✓ |
| Agent's discretion | Let planning figure out balance | |

**User's choice:** Actionable but conversational
**Notes:** More context per finding helps users understand why something matters.

---

## Workflow UX

### Progressive status

| Option | Description | Selected |
| ---------- | ---------------------------------- | -------- |
| Fully autonomous | Silent execution, report at end | |
| Progressive status | Announces phases as it works | ✓ |
| Agent's discretion | Let planning decide | |

**User's choice:** Progressive status
**Notes:** Code reviews can take time; feedback prevents "is it stuck?" worry.

### Interactivity

| Option | Description | Selected |
| ---------- | ---------------------------------- | -------- |
| Fully non-interactive | No prompts, produces output autonomously | ✓ |
| Interactive for ambiguity | May pause for clarifying questions | |
| Agent's discretion | Let planning determine balance | |

**User's choice:** Fully non-interactive
**Notes:** Simplest and most predictable. User can re-run with different scope if needed (Phase 3).

### Existing artifact handling

| Option | Description | Selected |
| ---------- | ---------------------------------- | -------- |
| Always overwrite | Replace without acknowledgment | |
| Warn before overwrite | Note in report that previous review was replaced | ✓ |
| Agent's discretion | Let planning figure out approach | |

**User's choice:** Warn (non-blocking) before overwrite
**Notes:** No blocking prompts, but user isn't surprised old review was replaced.

---

## Template/Reference Design

### Template rigidity

| Option | Description | Selected |
| ---------- | ---------------------------------- | -------- |
| Exact templates | Fixed headers, column order, badge format | |
| Guidance with examples | Describe what's needed, show example, allow adaptation | ✓ |
| Agent's discretion | Let planning determine rigidity | |

**User's choice:** Guidance with examples
**Notes:** Different repos have different finding profiles; flexibility serves the user better.

### Rubric split (SKILL.md vs. references)

| Option | Description | Selected |
| ---------- | ---------------------------------- | -------- |
| Rubric in references only | SKILL.md just says "evaluate each category" | |
| Summary inline, detail in references | One-line category descriptions in SKILL.md, full rubric in references | |
| Agent's discretion | Let planning figure out the split | ✓ |

**User's choice:** Agent's discretion
**Notes:** Planner can determine how much orientation the agent needs inline vs. loaded on demand.

---

## Agent's Discretion

- Exact SKILL.md wording and instruction phrasing
- Exact reference doc filenames
- Rubric detail split between SKILL.md and references
- Severity badge/label formatting
- "Previous review replaced" acknowledgment wording

## Deferred Ideas

None - discussion stayed within phase scope.
