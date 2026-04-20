# Phase 3: Review Scope Modes - Context

**Gathered:** 2026-04-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Support whole-repo and changed-files-focused review with explicit mode reporting in the output. Users can run either mode and the generated report clearly states which mode was used, including fallback behavior when git metadata is unavailable. This phase modifies the existing SKILL.md workflow pipeline (Phase 1: Determine Scope), updates the output-contract and review-template to support dynamic scope reporting, and adds git-aware scope detection logic. It does not implement analysis heuristics (Phase 4) or prioritized output artifacts (Phase 5).

</domain>

<decisions>
## Implementation Decisions

### Mode selection logic
- **D-01:** The skill **auto-detects the review mode from git state** — no user prompt, no configuration flag. If git commands produce a non-empty diff, changed-files mode is used; otherwise, whole-repo mode applies. This preserves the non-interactive philosophy (Phase 2, D-07).
- **D-02:** Mode detection runs during **Phase 1 (Determine Scope)** of the existing 5-phase pipeline. The status message updates from `◆ Determining review scope...` to include the detected mode, e.g., `◆ Determining review scope... → Changed files (branch diff against main)`.

### Changed-files scope definition
- **D-03:** Changed-files mode uses a **prioritized fallback chain**: (1) branch diff against default branch (`git merge-base <default> HEAD` → `git diff`), (2) uncommitted changes (`git diff HEAD`), (3) last commit (`git diff HEAD~1 HEAD`). The first source that produces a non-empty diff wins.
- **D-04:** The skill **reports which diff source was used** in the output, satisfying INVK-04. The report header states the source explicitly, e.g., "branch diff against main" or "uncommitted changes."

### Fallback & reporting behavior
- **D-05:** If git commands fail (not a git repo, git not installed, no commits), the skill **silently falls back to whole-repo mode** and adds a brief note in the report header: e.g., "Git metadata unavailable — falling back to whole-repo review." The review is never blocked by missing git state.
- **D-06:** The report header scope line includes a **file count and diff source** when in changed-files mode: e.g., `**Scope:** Changed files — 23 files modified (branch diff against main)`. In whole-repo mode: `**Scope:** Whole repository`. This replaces the current hardcoded `**Scope:** Whole repository` in output-contract.md.

### Repo traversal heuristics
- **D-07:** Evidence gathering respects **`.gitignore` as the primary filter** (when present), supplemented by a **fixed skip list** for common non-ignored noise: `node_modules`, `dist`, `build`, `__pycache__`, `.next`, `coverage`, `vendor`, `.terraform`, `target`, `.gradle`, `*.min.js`, `*.min.css`.
- **D-08:** The traversal heuristics **primarily affect whole-repo mode**. In changed-files mode, `git diff` already limits to tracked files (`.gitignore` is implicitly respected), so the supplemental skip list mainly prevents the skill from reading generated or vendored files that appear in the diff.

### the agent's Discretion
- Exact git commands and error-handling patterns, as long as the fallback chain is respected.
- How to detect the default branch name (e.g., `main`, `master`, or from `git remote`).
- Exact supplemental skip list entries, as long as common noise directories are excluded.
- How to present the scope note in the report header (wording and placement), as long as it includes the mode, file count, and diff source per D-06.
- How the traversal heuristics are documented in SKILL.md vs. a reference doc.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project requirements and phase scope
- `.planning/ROADMAP.md` - Phase 3 goal, success criteria, and plan breakdown for Review Scope Modes.
- `.planning/PROJECT.md` - Product positioning, scope constraints, and review mode requirements.
- `.planning/REQUIREMENTS.md` - Invocation requirements `INVK-02`, `INVK-03`, and `INVK-04` that Phase 3 must satisfy.

### Prior phase context
- `.planning/phases/01-package-foundation/01-CONTEXT.md` - Phase 1 decisions on skill-first package layout.
- `.planning/phases/02-skill-workflow-contract/02-CONTEXT.md` - Phase 2 decisions on 5-phase pipeline, non-interactive workflow, progressive status, and report structure.

### Files to modify (from Phase 2 output)
- `skills/code-reviewer/SKILL.md` - Current workflow definition. Phase 1 (Determine Scope) section needs git-aware scope detection logic added.
- `skills/code-reviewer/references/output-contract.md` - Report formatting rules. Header scope line needs to support dynamic mode reporting with file counts.
- `skills/code-reviewer/assets/review-template.md` - Report shape guidance. Needs updated scope examples showing both whole-repo and changed-files headers.

### Files to create or extend
- `skills/code-reviewer/references/scope-detection.md` (or inline in SKILL.md) — Git detection commands, fallback chain logic, and diff source identification. Location is the agent's discretion.

### Pi skill/package rules
- `/Users/dustinmidyett/.nvm/versions/node/v22.13.1/lib/node_modules/@mariozechner/pi-coding-agent/docs/skills.md` - Official Pi skill discovery, naming, and SKILL.md structure.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `skills/code-reviewer/SKILL.md`: The Phase 1 (Determine Scope) section already has a placeholder comment: "Phase 3 adds scope mode selection, but for now you should assess the whole repo." This is the primary edit target.
- `skills/code-reviewer/references/output-contract.md`: Defines the `**Scope:**` header format — currently hardcoded to `Whole repository`. Needs a dynamic template.
- `skills/code-reviewer/assets/review-template.md`: Shows the expected header shape with the static scope line. Needs updated examples.
- `skills/code-reviewer/references/severity-guidelines.md`: Unchanged by this phase — no modifications needed.
- `skills/code-reviewer/references/review-rubric.md`: Unchanged by this phase — no modifications needed.

### Established Patterns
- The 5-phase pipeline (D-02 from Phase 2) is the structural backbone. Phase 3 only modifies Phase 1 of the pipeline; Phases 2–5 remain unchanged.
- Progressive status messages use the format `◆ <verb>...`. Scope detection should follow this pattern.
- Reference docs are loaded on demand (`Before evaluating, read references/...`). New scope-detection guidance should follow this pattern.
- The skill is fully non-interactive (D-07 from Phase 2). All mode decisions are automatic.

### Integration Points
- SKILL.md Phase 1 is where scope detection logic lives. It currently uses `find`, `ls`, and `read` for repo mapping — git commands will be added here.
- `output-contract.md` Header section defines the `**Scope:**` line that `review-template.md` mirrors. Both need the same update.
- Phase 4 (Analysis Engine) will use the scope information to determine evidence gathering depth — the scope mode should be clearly available as a variable/state the agent tracks through the pipeline.

</code_context>

<specifics>
## Specific Ideas

- The fallback chain should feel natural: a developer working on a feature branch gets a branch diff; someone with dirty working tree gets uncommitted changes; someone who just committed gets the last commit diff. The skill picks the most relevant scope automatically.
- The file count in the scope line is useful context — "3 files modified" vs "147 files modified" tells the user something immediately about the review breadth.
- The supplemental skip list should be concise. Common entries: `node_modules`, `dist`, `build`, `__pycache__`, `.next`, `coverage`, `vendor`, `.terraform`, `target`, `.gradle`, `*.min.js`, `*.min.css`.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 03-review-scope-modes*
*Context gathered: 2026-04-20*
