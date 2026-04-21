# Scope Detection

## Scope State

- `mode` = `whole-repo` | `changed-files`
- `diff_source` = `branch diff against <branch>` | `uncommitted changes` | `last commit` | `null`
- `candidate_paths` = final filtered readable file list
- `file_count` = count of the final filtered readable file list
- `fallback_note` = `Git metadata unavailable — falling back to whole-repo review.` or `null`

## Detection Algorithm

1. Check `git rev-parse --is-inside-work-tree`.
2. Resolve the default branch in this order: `refs/remotes/origin/HEAD`, local `main`, local `master`.
3. For branch diff candidates, run `git merge-base "$default_branch" HEAD` and then `git diff --name-only --diff-filter=ACMR "$base"...HEAD`.
4. For uncommitted candidates, combine tracked paths from `git diff --name-only --diff-filter=ACMR HEAD` with nonignored untracked paths from `git ls-files --others --exclude-standard`, then remove blank lines and duplicates.
5. Use whole-repo mode for a clean repo on the resolved default branch.
6. A clean repo with a usable default-branch comparison stops at whole-repo mode and does not continue to last commit.
7. Only use last commit when the default branch cannot be resolved or compared, the repo is otherwise clean, and HEAD~1 exists.
8. For the last commit edge-case candidate set, run `git diff --name-only --diff-filter=ACMR HEAD~1 HEAD`.
9. If `git rev-parse --verify HEAD` fails because the repo has no commits, treat git metadata as unavailable for scope selection: choose whole-repo mode, set `diff_source` to `null`, and preserve the fallback note.
10. For whole-repo enumeration inside git repos, run `git ls-files --cached --others --exclude-standard`.
11. For non-git fallback, use the existing `find` + `ls` mapping flow.

When git metadata is available and `HEAD` exists, treat nonignored untracked files as part of the uncommitted changes candidate set while keeping the reported diff source as `uncommitted changes`.

## Traversal Filters

When git is available, `.gitignore` is the primary filter. After that, apply this supplemental skip list to candidate paths before deep reads:

- `node_modules`
- `dist`
- `build`
- `__pycache__`
- `.next`
- `coverage`
- `vendor`
- `.terraform`
- `target`
- `.gradle`
- `*.min.js`
- `*.min.css`

## Failure and Fallback Matrix

| Situation | Behavior |
| --- | --- |
| non-git directory | Skip git commands, fall back to whole-repo mode, and set `fallback_note` to `Git metadata unavailable — falling back to whole-repo review.` |
| missing git | Fall back to whole-repo mode and preserve the fallback note. |
| no commits | Fall back to whole-repo mode and preserve the fallback note because `HEAD` is unavailable. |
| no `origin` remote | Try local `main`, then local `master`; if neither gives a usable comparison, evaluate the edge-case `last commit` rule. |
| current branch equals default branch | If the branch diff and uncommitted candidate sets are empty, resolve to whole-repo mode; a clean repo with a usable default-branch comparison resolves to whole-repo mode and does not continue into `last commit`. |
| no usable default-branch comparison | Skip the branch-diff step; only use `last commit` when the repo is otherwise clean and `HEAD~1` exists. |
| deleted paths from diff | Exclude them by using `--diff-filter=ACMR`; deleted files are not reviewable candidate paths. |
| tracked generated files in diff | Apply the supplemental skip list before deep reads even if git reports the file as changed. |
| unreadable paths | Drop unreadable paths from `candidate_paths`, recompute `file_count`, and if no readable paths remain, fall back silently to whole-repo mode with the fallback note preserved when git metadata is unavailable or invalid. |

## Status and Header Examples

- `◆ Determining review scope... → Whole repository`
- `◆ Determining review scope... → Changed files (branch diff against main)`
- `◆ Determining review scope... → Changed files (uncommitted changes)`
- `◆ Determining review scope... → Changed files (last commit)`
- `**Scope:** Whole repository`
- `**Scope:** Changed files — 7 files modified (branch diff against main)`
- `**Scope:** Changed files — 2 files modified (uncommitted changes)`
- `**Scope:** Changed files — 1 files modified (uncommitted changes)`
- `**Scope:** Changed files — 3 files modified (last commit)`
- `> **Note:** Git metadata unavailable — falling back to whole-repo review.`

Use the literal phrase `files modified` for changed-files headers even when the count is 1.

Clean default-branch repos that produce no branch diff and no uncommitted candidate paths must stop at whole-repo mode rather than continuing into `last commit`.
