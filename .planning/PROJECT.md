# Pi Code Reviewer

## What This Is

Pi Code Reviewer is a Pi-installable code review skill/package for Pi users who want an intensive repository audit on demand, especially before committing or pushing changes. The package will be installable via npm and via a `pi install ...` flow, then invoked with `/skill` inside Pi to inspect a repository and produce a concise, highly actionable review. Its output should be language-agnostic in v1 and help users quickly understand code quality, refactoring opportunities, documentation gaps, security concerns, and test coverage issues.

## Core Value

A Pi user can run one skill against a codebase and immediately get a reliable, prioritized review report they can use to decide what to fix before code leaves their machine.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- [x] User can install the package via npm or a `pi install ...` command. Validated in Phase 1: Package Foundation
- [x] User can invoke the package as a Pi skill via `/skill`. Validated in Phase 2: Skill Workflow Contract
- [x] User receives a concise markdown review with sections for Code Quality, Refactoring, Documentation, Security, and Test Coverage. Validated in Phase 2: Skill Workflow Contract
- [x] User receives generated review artifacts in `.planning/`, including `REVIEW.md` and a markdown checklist TODO file grouped by category. Validated in Phase 2: Skill Workflow Contract

### Active

<!-- Current scope. Building toward these. -->

- [ ] User can review either the whole repository or a changed-files-focused slice when git context exists.
- [ ] User receives actionable findings with file/path references.
- [ ] User receives a prioritized issue table by priority/severity to help choose what to fix next.
- [ ] The review experience works across typical codebases without being limited to a single language ecosystem in v1.

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Auto-fixing code - v1 is focused on trustworthy review and prioritization, not mutation.
- PR/GitHub integration - repository-host integration is useful but not required for the core on-demand Pi skill workflow.
- CI integration - defer automation until the local interactive review workflow is solid.

## Context

The project exists because there appears to be a gap in the Pi package ecosystem: the user searched Pi packages and did not find a reusable code reviewer package/extension. Today, Pi users likely need to improvise one-off prompts or ad hoc review flows, which makes results inconsistent and harder to reuse.

This package is intended as a reusable review utility for Pi users generally, not just for one private workflow. The primary usage moment is before commit/push, but the skill should still be usable at any point a repo health check is needed. “Intensive” in this context means a serious repo/code review that can inspect repository contents, evaluate code quality, suggest refactoring, assess documentation, identify security issues, and gauge test coverage.

The user wants generated artifacts, not just terminal output. In v1, the report should be concise but highly actionable, with file/path references and a table of issues ranked by priority/severity so the user can immediately decide what to address next. Output files should live in `.planning/`.

## Constraints

- **Distribution**: Must be installable through npm and through a Pi install flow - package adoption depends on fitting normal Pi package installation patterns.
- **Invocation**: Must work through `/skill` - the user experience should feel native inside Pi.
- **Scope**: Must support both whole-repo and changed-files-focused review modes - users need flexibility depending on timing and git context.
- **Compatibility**: v1 should be language-agnostic - the package should work across typical codebases instead of being optimized only for one language.
- **Output Style**: Reports must be concise but actionable, with file/path references - users need something they can read quickly and act on.
- **Artifacts**: Review outputs should be written into `.planning/` - the workflow requires persistent files, not only ephemeral chat output.

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
| -------- | --------- | ------- |
| Package will be distributed through npm and Pi install flows | Installation needs to match how Pi users discover and adopt reusable packages | - Pending |
| Package will be invoked through `/skill` | The experience should feel native inside Pi instead of requiring a separate CLI-first workflow | - Pending |
| v1 review outputs will include `REVIEW.md` plus a markdown checklist TODO artifact in `.planning/` | Users want persistent, actionable outputs they can read and hand off | - Pending |
| v1 will support both whole-repo and changed-files-focused review modes | Different review moments need different scan scopes | - Pending |
| v1 will target language-agnostic analysis | The package should be broadly useful across typical codebases | - Pending |
| v1 excludes auto-fixing, PR/GitHub integration, and CI integration | Focus should stay on a strong local review workflow first | - Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-19 after initialization*
