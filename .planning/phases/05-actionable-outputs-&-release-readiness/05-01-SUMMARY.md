---
phase: 05-actionable-outputs-&-release-readiness
plan: 01
subsystem: documentation
tags: [markdown, code-review, prioritization, templates]

# Dependency graph
requires:
  - phase: 04-analysis-engine
    provides: "Category evaluation and severity classification framework"
provides:
  - Prioritized output contract with Summary table and Prioritized Issue Table
  - SKILL.md Phase 5 instructions for generating prioritized reports
  - Review template with complete prioritized report example
  - TODO template with complete prioritized checklist example
affects:
  - 05-actionable-outputs-&-release-readiness
  - code-reviewer skill execution workflow

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Header → Summary → Category Sections → Prioritized Issue Table report structure"
    - "Category × severity count table with bold totals row"
    - "Flat prioritized table sorted by severity then alphabetical category"
    - "TODO checklist with severity badges and impact notes"

key-files:
  created: []
  modified:
    - skills/code-reviewer/references/output-contract.md
    - skills/code-reviewer/SKILL.md
    - skills/code-reviewer/assets/review-template.md
    - skills/code-reviewer/assets/todo-template.md

key-decisions:
  - "Summary table placed immediately after header, before category sections, to give users immediate quantitative overview"
  - "Prioritized Issue Table placed after all category sections as a flat, scannable view for decision-making"
  - "Sort order: severity first (High→Medium→Low), then alphabetical by category within each severity level"
  - "TODO items include impact notes to explain why each fix matters without re-reading the full review"

patterns-established:
  - "Report structure: Header → Summary → 5 Category Sections → Prioritized Issue Table"
  - "Summary table: 5 categories × 3 severity levels + Total row, always included even if zero counts"
  - "Prioritized Issue Table: every finding from category sections appears once, with 3-8 word summary and backtick-wrapped location"
  - "TODO checklist: severity badges (**[High]** etc.) + impact note for each item, sorted by severity within category"

requirements-completed:
  - RPRT-03
  - OUTP-01
  - OUTP-02

# Metrics
duration: 3min
completed: 2026-04-21
---

# Phase 05 Plan 01: Prioritized Output Format Summary

**Prioritized review output contract with category × severity Summary table, flat Prioritized Issue Table, and template examples for consistent actionable reporting**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-21T02:02:51Z
- **Completed:** 2026-04-21T02:06:01Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Defined complete prioritized output format in output-contract.md with Summary table and Prioritized Issue Table specifications
- Updated SKILL.md Phase 5 with explicit report structure (Header → Summary → Categories → Prioritized Table) and quality checks
- Added complete working examples to both review-template.md and todo-template.md
- All existing content preserved — changes are purely additive

## Task Commits

Each task was committed atomically:

1. **Task 1: Add prioritized issue table and Summary section to output contract** — `a1d0141` (feat)
2. **Task 2: Update SKILL.md Phase 5 with prioritized output instructions** — `d4c1071` (feat)
3. **Task 3: Update review and TODO templates with prioritized examples** — `730211b` (feat)

## Files Created/Modified

- `skills/code-reviewer/references/output-contract.md` — Added Summary Section (category × severity count table), Prioritized Issue Table section (flat sorted table), and updated Category Sections rules to reference Summary placement and standard order
- `skills/code-reviewer/SKILL.md` — Replaced brief Phase 5 instructions with detailed Report Structure subsection (4-step ordering) and Quality Checks subsection (5 verification items)
- `skills/code-reviewer/assets/review-template.md` — Added Complete Prioritized Report Example with full Summary table, category sections, and Prioritized Issue Table
- `skills/code-reviewer/assets/todo-template.md` — Added Complete Prioritized TODO Example with severity badges and impact notes for each item

## Decisions Made

- Summary table placed immediately after header (not at end) so users see quantitative overview first
- Prioritized Issue Table uses "Finding" column with 3-8 word summary rather than full finding title, optimizing for scanability
- TODO impact notes are one-sentence explanations of consequence, keeping checklist concise but actionable
- Sort order within severity levels is alphabetical by category to provide deterministic, predictable output

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## Known Stubs

No stubs present. All examples in templates are complete and self-contained.

## Threat Flags

No new security-relevant surface introduced. All changes are documentation/formatting specifications.

## Self-Check: PASSED

- [x] `skills/code-reviewer/references/output-contract.md` exists and contains Summary + Prioritized Issue Table sections
- [x] `skills/code-reviewer/SKILL.md` exists and Phase 5 references both new sections with quality checks
- [x] `skills/code-reviewer/assets/review-template.md` exists and contains complete prioritized example
- [x] `skills/code-reviewer/assets/todo-template.md` exists and contains complete prioritized example with severity badges
- [x] Commit `a1d0141` exists in git history
- [x] Commit `d4c1071` exists in git history
- [x] Commit `730211b` exists in git history
- [x] No unexpected file deletions across all commits
- [x] No untracked files left behind

## Next Phase Readiness

- Output contract is complete and ready for skill execution
- Templates provide concrete examples for future plan phases that implement report generation
- No blockers — next plan in this phase can build on the defined format to implement actual report generation logic

---
*Phase: 05-actionable-outputs-&-release-readiness*
*Completed: 2026-04-21*
