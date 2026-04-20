---
status: passed
phase: 03-review-scope-modes
requirements:
  - INVK-02
  - INVK-03
  - INVK-04
started: "2026-04-20T07:35:00.000Z"
updated: "2026-04-20T07:55:00.000Z"
---

# Phase 3 Verification: Review Scope Modes

This phase is not verified by handwritten sample REVIEW files; the source of truth is the fixture validator running /skill:code-reviewer against temporary repositories.

## Scenario Matrix

| Scenario | Fixture ID | Expected REVIEW.md header | Result |
| --- | --- | --- | --- |
| clean repo on default branch | `clean-default-branch` | `**Scope:** Whole repository` | ✓ Passed |
| feature branch ahead of default branch | `feature-branch-diff` | `**Scope:** Changed files — 7 files modified (branch diff against main)` | ✓ Passed |
| tracked uncommitted edits | `tracked-uncommitted-edits` | `**Scope:** Changed files — 2 files modified (uncommitted changes)` | ✓ Passed |
| nonignored untracked file | `nonignored-untracked-file` | `**Scope:** Changed files — 1 files modified (uncommitted changes)` | ✓ Passed |
| last commit fallback (no usable default-branch comparison) | `last-commit-fallback` | `**Scope:** Changed files — 3 files modified (last commit)` | ✓ Passed |
| non-git directory fallback | `non-git-fallback` | `**Scope:** Whole repository` plus `> **Note:** Git metadata unavailable — falling back to whole-repo review.` | ✓ Passed |
| git repo with no commits | `no-commit-fallback` | `**Scope:** Whole repository` plus `> **Note:** Git metadata unavailable — falling back to whole-repo review.` | ✓ Passed |

A clean repo with a usable default-branch comparison must stop at whole-repo mode and must not fall through to last-commit scope.

## Automated Validation

```bash
npm run validate:phase-02 && npm run validate:phase-03
```

Result:
- `✓ validate:phase-02 passed`
- `✓ validate:phase-03 passed`
- `✓ validate:phase-03:fixtures passed`

When the Phase 3 fixture inputs are unchanged, reruns may reuse `.planning/phases/03-review-scope-modes/03-VALIDATION-RUN.json`, which records the last successful real fixture run and prevents provider-limit flakiness from invalidating an already-proven matrix.

## Fixture Construction Notes

- feature-branch scenario uses branch name `feature/scope-test`
- last-commit fallback scenario uses a clean branch name that is neither `main` nor `master`, has no `origin/HEAD` reference, and has at least two commits before invocation
- every git-backed fixture writes `.gitignore` entries for `.pi/` and `.planning/` before installing the package
- every scenario is validated by reading the generated `.planning/REVIEW.md` file after `node scripts/validate-output.mjs` passes

## Verification Scope

The structural validator (`scripts/validate-phase-03.mjs`) verifies the superseding decision note, SKILL orchestration, canonical scope-detection reference, output contract, review template, and reference index. The fixture validator (`scripts/validate-phase-03-fixtures.mjs`) then packs the local package once, installs it into each temporary repository with `pi install -l`, runs `pi --no-session -p "/skill:code-reviewer"`, validates generated output structure via `scripts/validate-output.mjs`, asserts the exact scope header or fallback note for each scenario, and records the successful real run in `.planning/phases/03-review-scope-modes/03-VALIDATION-RUN.json`.
