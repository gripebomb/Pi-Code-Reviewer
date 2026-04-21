# Phase 5: Actionable Outputs & Release Readiness - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-20
**Phase:** 05-actionable-outputs-&-release-readiness
**Areas discussed:** Prioritized issue table, TODO checklist, Release readiness, Distribution verification

---

## Prioritized Issue Table Format

| Option | Description | Selected |
|--------|-------------|----------|
| Flat list sorted by severity | All findings in one table, sorted High→Medium→Low. Loses category grouping. | |
| Grouped by category, then severity | 5 separate sections (Code Quality, Refactoring, etc.), each with severity sub-sections. Matches SKILL.md. | ✓ |
| Both views | Top Issues table (flat, all High) + detailed breakdown by category. Most actionable. | |

**User's choice:** Grouped by category, then severity
**Notes:** User wants to preserve existing SKILL.md structure. Wants a flat summary at top for quick overview.

---

## TODO Checklist Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Simple checkboxes | Just `- [ ] Fix unhandled promise in src/app.js:42` | |
| Checkbox + severity badge | `- [ ] [HIGH] Fix unhandled promise in src/app.js:42` | |
| Full context per item | Includes severity, path, summary, impact note | ✓ |

| Option | Description | Selected |
|--------|-------------|----------|
| Group by category | Code Quality: [ ] item 1, Refactoring: [ ] item 2 | ✓ |
| Group by severity | ### High, ### Medium, ### Low | |

**User's choice:** Full context per item, grouped by category
**Notes:** User wants to print and hand off the list. Severity badges help quick scanning. Category grouping lets users tackle one area at a time.

---

## Release Readiness Criteria

| Option | Description | Selected |
|--------|-------------|----------|
| Full smoke test | Test pi install, skill discoverability, running skill produces correct output | ✓ |
| Validate only | Verify package.json, npm pack, README — no live test | |
| You decide | Let planner choose | |

| Option | Description | Selected |
|--------|-------------|----------|
| Pi only | /skill only, no separate CLI | |
| CLI + Pi | Both /skill and command line binary | ✓ |

**User's choice:** Full smoke test + CLI + Pi support
**Notes:** User wants to verify the full pipeline. Also wants CLI support for users who don't want to open Pi for quick reviews.

---

## Distribution Verification

| Option | Description | Selected |
|--------|-------------|----------|
| Simulate install | npm pack → install from tarball → verify discoverable → run | ✓ |
| Manual only | Document steps, manual verification when ready | |
| CI-based | GitHub Actions on every push | |

| Option | Description | Selected |
|--------|-------------|----------|
| Phase 1 | Install + discover + produces output | |
| Phase 4 | Install + discover + categorized findings with severity | ✓ |
| Phase 5 | All above + REVIEW.md/TODO pass validation script | |

**User's choice:** Simulate install, Phase 4 smoke level
**Notes:** Automated simulation proves the pipeline. Phase 4 smoke is sufficient — proves analysis engine works end-to-end.

---

## the agent's Discretion

- Exact markdown table formatting
- CLI wrapper implementation
- Release script implementation
- Version bumping strategy

## Deferred Ideas

- GitHub Actions CI pipeline
- Automated version bumping and changelog generation
- Multi-language fixture validation

---

*Phase: 05-actionable-outputs-&-release-readiness*
*Discussion date: 2026-04-20*
