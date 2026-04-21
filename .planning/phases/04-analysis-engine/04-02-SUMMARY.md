---
phase: 04-analysis-engine
plan: 02
subsystem: code-reviewer
name: "Wire Analysis Guides into Skill Workflow and Enforce Path References"
tags: [analysis, workflow, skill-instructions, path-references, cross-references]
dependency_graph:
  requires: [04-01]
  provides: [operational-workflow, path-reference-validation, rubric-cross-references]
  affects: [SKILL.md, output-contract.md, review-rubric.md]
tech_stack:
  added: []
  patterns: [evaluation-order, cross-category-awareness, path-reference-enforcement, quality-checks]
key_files:
  created: []
  modified:
    - skills/code-reviewer/SKILL.md
    - skills/code-reviewer/references/output-contract.md
    - skills/code-reviewer/references/review-rubric.md
decisions:
  - "D-05: Phase 3 evaluation follows fixed order (Code Quality → Refactoring → Documentation → Security → Test Coverage) to build cumulative understanding"
  - "D-06: Cross-category awareness elevates severity when security-critical paths lack tests or complex functions lack documentation"
  - "D-07: Phase 4 quality checks enforce path reference requirements before report generation"
  - "D-08: Output contract Path Reference Requirements section makes concrete file/path references mandatory for actionable output"
  - "D-09: Review rubric cross-references category-analysis-guide.md to bridge high-level criteria with operationalized inspection steps"
metrics:
  duration: "3m"
  completed_date: "2026-04-21T01:03:10Z"
  tasks_completed: 3
  files_created: 0
  files_modified: 3
  lines_added: ~110
---

# Phase 04 Plan 02: Wire Analysis Guides into Skill Workflow and Enforce Path References

**One-liner:** Updated SKILL.md Phases 3-4 with specific evaluation and prioritization instructions, added Path Reference Requirements to the output contract, and cross-referenced the review rubric with the new analysis guides.

## What Was Built

### Updated Files

1. **`skills/code-reviewer/SKILL.md`** (modified — Phase 3)
   - Added "◆ Evaluating categories..." status message
   - Added 5-step evaluation workflow using evidence map as primary input
   - References: review-rubric.md, category-analysis-guide.md, evidence-synthesis.md, severity-guidelines.md
   - Added **Evaluation Order** section: Code Quality → Refactoring → Documentation → Security → Test Coverage
   - Added **Cross-Category Awareness** section with 3 relationship rules
   - Added **Uncertainty Handling** section with evidence gap guidance
   - Kept existing per-category status messages and 5 category sub-sections

2. **`skills/code-reviewer/SKILL.md`** (modified — Phase 4)
   - Added **Classification Process** with 4-step severity assignment
   - Added severity criteria definitions: High (immediate risk), Medium (fragility), Low (polish)
   - Added context-awareness rule: same pattern varies by code location
   - Added **Grouping and Ordering** rules: category → severity → impact
   - Added **Quality Checks** checklist with 5 verification items including path reference validation
   - Added fallback instruction: revisit Phase 3 if checks fail

3. **`skills/code-reviewer/references/output-contract.md`** (modified)
   - Added **Path Reference Requirements** section after Header, before Category Sections
   - Defined 4 required formats: with line number, without line number, directory wildcard, scope description
   - Added 5 rules for path references (line numbers, wildcards, backticks, verification)
   - Added Good/Bad examples for path reference formats
   - Added 2 new rules to existing Rules section: mandatory backtick references, wildcard allowance for systemic issues

4. **`skills/code-reviewer/references/review-rubric.md`** (modified)
   - Added **Related Guides** section with 3 cross-references (category-analysis-guide.md, evidence-synthesis.md, evidence-gathering.md)
   - Added "See `references/category-analysis-guide.md` for specific inspection steps and signals." to all 5 category sections
   - Maintained standalone readability — cross-references are additive

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

No stubs identified. All modifications are complete, internally consistent, and backward compatible.

## Threat Flags

No new threat surface introduced. This plan updates documentation-only artifacts (markdown instruction files) with no network endpoints, auth paths, file access patterns, or schema changes.

Path reference rules explicitly mitigate T-04-05 (Repudiation/Finding quality) by requiring concrete evidence, and T-04-06 (Elevation of Privilege/Severity inflation) by enforcing severity-guidelines.md alignment through quality checks.

## Self-Check: PASSED

- [x] `skills/code-reviewer/SKILL.md` exists and has been updated
- [x] `skills/code-reviewer/references/output-contract.md` exists and has been updated
- [x] `skills/code-reviewer/references/review-rubric.md` exists and has been updated
- [x] All 3 commits verified in git history

- [x] SKILL.md Phase 3 references category-analysis-guide.md (7 matches found)
- [x] SKILL.md Phase 3 has Evaluation Order section
- [x] SKILL.md Phase 3 has Cross-Category Awareness section
- [x] SKILL.md Phase 4 has Classification Process section
- [x] SKILL.md Phase 4 has Quality Checks with path reference verification
- [x] output-contract.md has Path Reference Requirements section (3 matches found)
- [x] review-rubric.md cross-references category-analysis-guide.md (8 matches found)
- [x] review-rubric.md cross-references evidence-synthesis.md
- [x] review-rubric.md cross-references evidence-gathering.md
- [x] Commit 67f0582: SKILL.md Phase 3 update
- [x] Commit 0f38f43: SKILL.md Phase 4 update
- [x] Commit 94af649: output contract + rubric updates

## Commits

| Hash | Type | Message |
|------|------|---------|
| 67f0582 | feat | update SKILL.md Phase 3 with category evaluation instructions |
| 0f38f43 | feat | update SKILL.md Phase 4 with prioritization instructions |
| 94af649 | feat | update output contract with path reference rules and cross-reference rubric |
