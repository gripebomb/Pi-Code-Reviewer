# Phase 3: Review Scope Modes - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-04-20
**Phase:** 03-review-scope-modes
**Areas discussed:** Mode selection logic, Changed-files scope definition, Fallback & reporting behavior, Repo traversal heuristics

---

## Mode Selection Logic

| Option | Description | Selected |
| ------ | ----------- | -------- |
| Auto-detect from git state | If git status/diff shows changes, use changed-files mode; otherwise whole-repo. Silent inference, no user prompt. | ✓ |
| Always whole-repo, changed-files only when base ref is detectable | Whole-repo default. Changed-files activates only with a clear comparison point (parent commit, merge base). Uncommitted changes alone wouldn't trigger it. | |
| Always whole-repo, changed-files via explicit instruction only | Skill always reviews whole repo. Changed-files mode requires the user to mention it in their prompt. | |

**User's choice:** Auto-detect from git state (Option 1)
**Notes:** Aligns with the non-interactive philosophy from Phase 2 (D-07). Matches the user's mental model of "I have uncommitted work, review what I've changed."

---

## Changed-Files Scope Definition

| Option | Description | Selected |
| ------ | ----------- | -------- |
| Uncommitted changes only | `git diff HEAD` — staged + unstaged. "Review before I commit" use case. | |
| Last commit only | `git diff HEAD~1 HEAD`. "Did my last commit introduce problems" use case. | |
| Branch diff against default branch | `git merge-base main HEAD` then `git diff`. "Review my PR" use case. | |
| All of the above, prioritized | Try branch diff first, fall back to uncommitted, then last commit. Report which source was used. | ✓ |

**User's choice:** Prioritized fallback chain — all three sources (Option 4)
**Notes:** Covers the three most common review moments (PR prep, pre-commit, post-commit) without user input. Reporting which source was used satisfies INVK-04.

---

## Fallback & Reporting Behavior

### Fallback when git is unavailable

| Option | Description | Selected |
| ------ | ----------- | -------- |
| Silent fallback to whole-repo with note in report | If git commands fail, fall back to whole-repo mode and add a brief note in the report header explaining why. Review is never blocked. | ✓ |
| Error and stop | If git info can't be obtained, report an error and don't proceed. User must fix git state first. | |

**User's choice:** Silent fallback to whole-repo with note in report (Option 1)
**Notes:** Resilience over strictness. Missing git shouldn't block a review.

### Mode indicator in the report

| Option | Description | Selected |
| ------ | ----------- | -------- |
| Simple label | `**Scope:** Whole repository` or `**Scope:** Changed files (branch diff against main)`. One line, matches current pattern. | |
| Label with file count | `**Scope:** Changed files — 23 files modified (branch diff against main)`. Adds count so user can gauge review breadth at a glance. | ✓ |
| Label with summary table | A small table showing diff source and file breakdown (added, modified, deleted counts). | |

**User's choice:** Label with file count (Option 2)
**Notes:** File count is useful context — "3 files" vs "147 files" tells the user something immediately about review breadth without cluttering the header.

---

## Repo Traversal Heuristics

| Option | Description | Selected |
| ------ | ----------- | -------- |
| Fixed skip list in SKILL.md | Hardcoded list of directories/patterns to skip. Simple, predictable. | |
| Respect `.gitignore` + additional skip list | `.gitignore` as primary filter (if present), plus a small supplemental list for common non-ignored noise. Adapts to each project. | ✓ |
| Respect `.gitignore` only | Trust the project's `.gitignore` completely. No supplemental list. If missing, review everything. | |

**User's choice:** Respect `.gitignore` + additional skip list (Option 2)
**Notes:** `.gitignore` gives project-specific exclusions for free. Supplemental list catches common artifacts that might not be gitignored. Primarily affects whole-repo mode — in changed-files mode, `git diff` already limits to tracked files.

---

## the agent's Discretion

- Exact git commands and error-handling patterns
- How to detect the default branch name (main, master, from git remote)
- Exact supplemental skip list entries
- How the scope note is worded and placed in the report header
- How traversal heuristics are documented (SKILL.md inline vs. reference doc)

## Deferred Ideas

None - discussion stayed within phase scope.
