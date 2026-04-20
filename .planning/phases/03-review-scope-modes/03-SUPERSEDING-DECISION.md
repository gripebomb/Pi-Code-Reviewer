# Phase 3 Superseding Decision: Default-Branch Whole-Repo Rule

## Why this exists

This note supersedes the conflicting fallback-chain wording in 03-CONTEXT.md D-03 and the mirrored wording in 03-RESEARCH.md.

## Authoritative policy

- Clean repos with a usable default-branch comparison must resolve to whole-repo mode.
- Only use last commit when the default branch cannot be resolved or compared, the repo is otherwise clean, and HEAD~1 exists.
- Treat nonignored untracked files as part of the uncommitted changes candidate set while reporting the winning diff source as uncommitted changes.

## Downstream alignment required

- `skills/code-reviewer/SKILL.md`
- `skills/code-reviewer/references/scope-detection.md`
- `skills/code-reviewer/references/output-contract.md`
- `skills/code-reviewer/assets/review-template.md`
- `scripts/validate-phase-03.mjs`
