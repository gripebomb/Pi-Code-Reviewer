# Phase 5: Actionable Outputs & Release Readiness - Context

**Gathered:** 2026-04-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Generate prioritized, actionable review artifacts (REVIEW.md with prioritized issue table, REVIEW-TODO.md checklist) and prepare the package for npm publication. This phase makes the analysis engine's output immediately useful and verifies the package works when installed.

Phase 5 covers:
- Output artifact generation (prioritized tables, checklists)
- Release readiness (validation scripts, smoke tests)
- Distribution verification (npm pack, Pi install simulation)

Out of scope: Auto-fixing, PR/GitHub integration, CI integration (all Phase 1+ boundaries).

</domain>

<decisions>
## Implementation Decisions

### Prioritized Issue Table Format
- **D-01:** Group findings by category (Code Quality, Refactoring, Documentation, Security, Test Coverage), then by severity (High → Medium → Low) within each category.
- **D-02:** Preserve the existing SKILL.md Phase 5 structure — category-first grouping matches the analysis workflow.
- **D-03:** Include a flat "Summary" section at the top showing total findings per category × severity for quick overview.

### TODO Checklist Structure
- **D-04:** Full context per checklist item: checkbox, severity badge [HIGH/MEDIUM/LOW], file path, finding summary, and brief impact note.
- **D-05:** Group checklist items by category, not severity. Lets users tackle one category at a time.
- **D-06:** Format: `- [ ] [HIGH] src/app.js:42 — Unhandled promise rejection\n  Impact: May crash server on unhandled errors`

### Release Readiness Criteria
- **D-07:** Full smoke test required before release: verify install → discover → run → categorized output on fixture repos.
- **D-08:** Package must support BOTH Pi invocation (`/skill:code-reviewer`) and CLI invocation (`pi-code-reviewer` binary).
- **D-09:** CLI support means adding a `bin` entry in package.json and creating a minimal CLI wrapper.

### Distribution Verification
- **D-10:** Automated simulation: `npm pack` → install from tarball → verify skill discoverable → run against fixture repos.
- **D-11:** Smoke test level: Phase 4 equivalent (install + discover + categorized findings with severity). No Phase 5 validation script run required for basic smoke test.
- **D-12:** Include a release script or npm script that runs the full validation pipeline.

### the agent's Discretion
- Exact markdown table formatting (pipe-separated, grid, etc.)
- CLI wrapper implementation details (args parsing, help text)
- Release script implementation (bash, npm scripts, or JS)
- Version bumping strategy (manual vs. automated)

</decisions>

<specifics>
## Specific Ideas

- "I want to print the TODO list and hand it to someone — needs severity badges for quick scanning"
- "Should work both inside Pi and from command line — some people don't want to open Pi for a quick review"
- "Smoke test should prove the whole pipeline, not just 'hello world'"

</specifics>

<canonical_refs>
## Canonical References

### Output Contract
- `skills/code-reviewer/references/output-contract.md` — Defines REVIEW.md and TODO output structure
- `skills/code-reviewer/references/severity-guidelines.md` — High/Medium/Low criteria

### Analysis Infrastructure
- `skills/code-reviewer/references/review-rubric.md` — 5 categories and evaluation criteria
- `skills/code-reviewer/references/category-analysis-guide.md` — Per-category inspection steps

### Validation
- `test/validate-analysis.js` — Report validation script (structure, paths, severity)
- `test/fixtures/fixture-a/` — Code quality + docs test case
- `test/fixtures/fixture-b/` — Security + refactoring test case
- `test/fixtures/fixture-c/` — Edge case test case

### Package Configuration
- `package.json` — Current package metadata, scripts, Pi manifest
- `skills/code-reviewer/SKILL.md` — Main skill workflow (Phases 1-5)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `test/validate-analysis.js` — Can be extended to validate Phase 5 outputs (REVIEW-TODO.md structure)
- `skills/code-reviewer/SKILL.md` — Phase 5 section needs updating with prioritized output instructions
- `skills/code-reviewer/references/output-contract.md` — Already defines output structure; needs path reference requirements added

### Established Patterns
- Package uses `npm scripts` for validation (validate:phase-01, validate:phase-02, etc.)
- Pi manifest in package.json `pi.skills` field
- Skills live in `skills/` directory

### Integration Points
- New `bin` entry in package.json for CLI support
- New `scripts/validate-phase-05.mjs` or similar for release validation
- SKILL.md Phase 5 should reference the prioritized output format

</code_context>

<deferred>
## Deferred Ideas

- GitHub Actions CI pipeline — out of scope for v1 (belongs in v2 or post-release)
- Automated version bumping and changelog generation — nice to have, not critical for v1
- Multi-language fixture validation — v2 scope (DEPT-01)

</deferred>

---

*Phase: 05-actionable-outputs-&-release-readiness*
*Context gathered: 2026-04-20*
