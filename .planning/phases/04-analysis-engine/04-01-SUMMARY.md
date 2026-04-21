---
phase: 04-analysis-engine
plan: 01
subsystem: code-reviewer
name: "Analysis Infrastructure for Evidence-Based Code Review"
tags: [analysis, evidence, skill-instructions, documentation]
dependency_graph:
  requires: [phase-03-scope-detection]
  provides: [evidence-gathering, category-analysis, evidence-synthesis]
  affects: [SKILL.md, review-rubric.md, output-contract.md]
tech_stack:
  added: []
  patterns: [breadth-first-evidence, category-tagged-observations, severity-signals]
key_files:
  created:
    - skills/code-reviewer/references/evidence-gathering.md
    - skills/code-reviewer/references/category-analysis-guide.md
    - skills/code-reviewer/references/evidence-synthesis.md
  modified:
    - skills/code-reviewer/SKILL.md
decisions:
  - "D-01: Evidence gathering uses breadth-first then depth-first approach with explicit sufficiency criteria"
  - "D-02: Category analysis guides operationalize rubric criteria into actionable inspection steps"
  - "D-03: Evidence synthesis rules enforce concrete findings with 7 specific rules"
  - "D-04: SKILL.md Phase 2 now references evidence-gathering.md for exact read order and depth triggers"
metrics:
  duration: "4m"
  completed_date: "2026-04-21T01:00:26Z"
  tasks_completed: 3
  files_created: 3
  files_modified: 1
  lines_added: ~830
---

# Phase 04 Plan 01: Analysis Infrastructure for Evidence-Based Code Review

**One-liner:** Created three reference documents and updated SKILL.md to define how the code reviewer skill gathers evidence, evaluates each category, and synthesizes observations into concrete findings.

## What Was Built

### New Reference Documents

1. **`skills/code-reviewer/references/evidence-gathering.md`** (267 lines)
   - Breadth-first file read order: root config → entry points → tests → docs → stack
   - Depth-first triggers: complexity, security-sensitive operations, error paths, central modules, maintenance signals
   - Five evidence types: structural, behavioral, qualitative, configurational, test-related
   - Sufficiency criteria: when to stop gathering evidence
   - Evidence map format with category tags, path indexing, severity signals, and cross-references
   - Integration with scope-detection.md for respecting candidate_paths

2. **`skills/code-reviewer/references/category-analysis-guide.md`** (322 lines)
   - Code Quality: error handling audit, complexity scan, consistency check, dead code detection, type safety review
   - Refactoring: duplication scan, coupling analysis, abstraction review, module boundaries, data flow tracing
   - Documentation: README completeness, API docs, inline comments, architecture guidance, operational docs
   - Security: input validation, secrets handling, auth checks, dependency risk, error exposure, config safety
   - Test Coverage: existence, framework ID, breadth, behavior verification, edge cases, CI integration
   - Each category includes concrete signals, evidence format, uncertainty handling, and cross-category relationships

3. **`skills/code-reviewer/references/evidence-synthesis.md`** (241 lines)
   - Rule 1: Concrete over Vague — every finding ties to a specific file/path/line
   - Rule 2: Pattern over Instance — single occurrence = Low, repeated pattern = Medium/High
   - Rule 3: Impact over Count — critical security outweighs style issues
   - Rule 4: Uncertainty Explicit — state evidence gaps rather than invent certainty
   - Rule 5: Contextual Severity — same pattern varies by context
   - Rule 6: Cross-Category Consolidation — link related findings
   - Rule 7: Finding Format — bold title, path reference, multi-line description with impact
   - Good vs bad examples for each rule
   - 10-step synthesis workflow

### Updated Files

4. **`skills/code-reviewer/SKILL.md`** (modified)
   - Phase 2 now instructs to read evidence-gathering.md before gathering evidence
   - Added evidence map building with category organization and severity signals
   - Added breadth-first preference instruction
   - Added evidence gap recording guidance
   - Reference Docs section expanded to include all three new documents

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

No stubs identified. All files contain complete, actionable instructions with concrete examples.

## Threat Flags

No new threat surface introduced. This plan creates documentation-only artifacts (markdown instruction files) with no network endpoints, auth paths, file access patterns, or schema changes.

## Self-Check: PASSED

- [x] `skills/code-reviewer/references/evidence-gathering.md` exists (267 lines, >50)
- [x] `skills/code-reviewer/references/category-analysis-guide.md` exists (322 lines, >100)
- [x] `skills/code-reviewer/references/evidence-synthesis.md` exists (241 lines, >40)
- [x] `skills/code-reviewer/SKILL.md` references evidence-gathering.md
- [x] category-analysis-guide.md covers all 5 categories
- [x] evidence-synthesis.md has 7 rules with examples
- [x] Commit 7fa527d: evidence gathering guide
- [x] Commit 1bf5da4: category analysis guide
- [x] Commit afd9b55: SKILL.md update + evidence synthesis

## Commits

| Hash | Type | Message |
|------|------|---------|
| 7fa527d | feat | create evidence gathering guide with breadth-first algorithm and sufficiency criteria |
| 1bf5da4 | feat | create category-specific analysis guide for all 5 review categories |
| afd9b55 | feat | update SKILL.md Phase 2 with evidence gathering instructions and reference new guides |
