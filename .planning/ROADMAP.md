# Roadmap: Pi Code Reviewer

## Overview

Pi Code Reviewer will ship as a skill-first Pi package that users can install via npm or `pi install`, invoke with `/skill:code-reviewer`, and use to generate actionable review artifacts in `.planning/`. The roadmap starts with package discovery and invocation correctness, then builds review scope selection, analysis quality, and finally the prioritized output artifacts that make the package immediately useful before commit or push.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Package Foundation** - Make the package installable and discoverable as a Pi skill.
- [ ] **Phase 2: Skill Workflow Contract** - Define the `/skill:code-reviewer` experience and fixed report structure.
- [ ] **Phase 3: Review Scope Modes** - Support whole-repo and changed-files-focused review with explicit mode reporting.
- [ ] **Phase 4: Analysis Engine** - Produce evidence-based findings across the five review categories.
- [ ] **Phase 5: Actionable Outputs** - Generate prioritized artifacts users can act on immediately.

## Phase Details

### Phase 1: Package Foundation
**Goal**: Users can install Pi Code Reviewer and discover it as an available Pi skill.
**Depends on**: Nothing (first phase)
**Requirements**: [DIST-01, DIST-02, DIST-03]
**Success Criteria** (what must be TRUE):
  1. User can install the package from npm without manual repo setup.
  2. User can install the package with `pi install` and Pi discovers the skill.
  3. User can follow package documentation to understand installation and invocation.
**Plans**: 4 plans

Plans:
- [ ] 01-01: Create npm package scaffold, Pi manifest, skill directory structure, and a unique Phase 1 smoke marker.
- [ ] 01-02: Add installation and invocation documentation with marker-aware smoke-test instructions.
- [ ] 01-03: Verify packed/installable artifact contents, exact local validators, and preserved local smoke handoff.
- [ ] 01-04: Publish the canonical package and verify registry npm/Pi installs plus marker-based discovery.

### Phase 2: Skill Workflow Contract
**Goal**: Users can start the review workflow with `/skill:code-reviewer` and receive the correct report structure.
**Depends on**: Phase 1
**Requirements**: [INVK-01, RPRT-01]
**Success Criteria** (what must be TRUE):
  1. Installed package exposes a working `/skill:code-reviewer` command.
  2. Running the skill produces a markdown review organized into Code Quality, Refactoring, Documentation, Security, and Test Coverage sections.
  3. The skill instructions clearly define the expected workflow and output contract.
**Plans**: 3 plans

Plans:
- [ ] 02-01: Author the core SKILL.md workflow and supporting reference docs.
- [ ] 02-02: Create reusable REVIEW/TODO templates and report contract guidance.
- [ ] 02-03: Validate invocation flow and structured output skeleton on sample repos.

### Phase 3: Review Scope Modes
**Goal**: Users can review either the whole repository or current changes and understand which mode was used.
**Depends on**: Phase 2
**Requirements**: [INVK-02, INVK-03, INVK-04]
**Success Criteria** (what must be TRUE):
  1. User can run a whole-repository review and get a complete review pass.
  2. User can run a changed-files-focused review when git metadata is available.
  3. Generated output states whether the run used whole-repo mode or changed-files mode, including fallback behavior when needed.
**Plans**: 3 plans

Plans:
- [ ] 03-01: Implement review mode selection rules and optional git-aware scope detection.
- [ ] 03-02: Define repo traversal heuristics and exclusions for large/noisy codebases.
- [ ] 03-03: Test mode selection and fallback behavior across fixture repositories.

### Phase 4: Analysis Engine
**Goal**: Users receive evidence-based findings across all five requested review categories.
**Depends on**: Phase 3
**Requirements**: [ANLY-01, ANLY-02, ANLY-03, ANLY-04, ANLY-05, RPRT-02]
**Success Criteria** (what must be TRUE):
  1. User receives code-quality and refactoring findings with concrete repository evidence.
  2. User receives documentation, security, and test-coverage findings, including explicit uncertainty or absence when evidence is limited.
  3. Findings reference concrete files or paths wherever supporting evidence exists.
**Plans**: 3 plans

Plans:
- [ ] 04-01: Define category-specific review heuristics and severity guidance.
- [ ] 04-02: Implement evidence gathering and synthesis for code, docs, config, and tests.
- [ ] 04-03: Validate findings quality and path references against representative fixtures.

### Phase 5: Actionable Outputs
**Goal**: Users get prioritized review artifacts they can use immediately to decide what to fix next.
**Depends on**: Phase 4
**Requirements**: [RPRT-03, OUTP-01, OUTP-02, OUTP-03]
**Success Criteria** (what must be TRUE):
  1. User receives `.planning/REVIEW.md` as a persistent review artifact.
  2. User receives `.planning/REVIEW-TODO.md` as a categorized markdown checklist.
  3. Review output includes a prioritized issue table so the user can decide what to fix first.
  4. Another agent or human can use the generated TODO checklist as an actionable follow-up list.
**Plans**: 3 plans

Plans:
- [ ] 05-01: Implement prioritized issue-table generation and severity sorting.
- [ ] 05-02: Write persistent REVIEW and categorized TODO artifacts into `.planning/`.
- [ ] 05-03: Harden publish readiness with fixture tests, docs polish, and release verification.

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
| ----- | -------------- | ------ | --------- |
| 1. Package Foundation | 0/4 | Not started | - |
| 2. Skill Workflow Contract | 0/3 | Not started | - |
| 3. Review Scope Modes | 0/3 | Not started | - |
| 4. Analysis Engine | 0/3 | Not started | - |
| 5. Actionable Outputs | 0/3 | Not started | - |
