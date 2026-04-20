# Requirements: Pi Code Reviewer

**Defined:** 2026-04-19
**Core Value:** A Pi user can run one skill against a codebase and immediately get a reliable, prioritized review report they can use to decide what to fix before code leaves their machine.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Distribution

- [ ] **DIST-01**: User can install the package from npm.
- [ ] **DIST-02**: User can install the package with `pi install`.
- [ ] **DIST-03**: User can identify from package documentation how to install and invoke the skill.

### Invocation

- [ ] **INVK-01**: User can invoke the review workflow with `/skill:code-reviewer` after installing the package.
- [ ] **INVK-02**: User can run a whole-repository review.
- [ ] **INVK-03**: User can run a changed-files-focused review when git information is available.
- [ ] **INVK-04**: User can see which review mode was used in the generated report.

### Analysis

- [ ] **ANLY-01**: User receives code-quality findings based on repository contents.
- [ ] **ANLY-02**: User receives refactoring opportunities based on repository contents.
- [ ] **ANLY-03**: User receives documentation findings, including missing or weak documentation when applicable.
- [ ] **ANLY-04**: User receives security findings or explicit security uncertainty when evidence is limited.
- [ ] **ANLY-05**: User receives test-coverage findings, including missing or weak test coverage when applicable.

### Reporting

- [ ] **RPRT-01**: User receives a concise markdown review organized into Code Quality, Refactoring, Documentation, Security, and Test Coverage sections.
- [ ] **RPRT-02**: User receives findings with concrete file or path references wherever supporting evidence exists.
- [ ] **RPRT-03**: User receives a prioritized issue table that lists findings by severity or priority so they can decide what to fix first.

### Outputs

- [ ] **OUTP-01**: User receives `.planning/REVIEW.md` as a persistent review artifact.
- [ ] **OUTP-02**: User receives `.planning/REVIEW-TODO.md` as a markdown checklist grouped by review category.
- [ ] **OUTP-03**: User can use the generated TODO checklist as an action list for themselves or another agent.

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Integrations

- **INTG-01**: User can publish review results to GitHub pull requests.
- **INTG-02**: User can run the reviewer in CI as a non-interactive quality gate.

### Output Formats

- **FORM-01**: User can export structured machine-readable findings alongside markdown outputs.

### Depth Enhancements

- **DEPT-01**: User receives deeper language-specific analysis for popular ecosystems.
- **DEPT-02**: User can use richer extension-powered commands or UI for review setup and result navigation.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
| ------- | ------ |
| Auto-fixing code | v1 is focused on trustworthy review and prioritization, not mutation. |
| GitHub pull request integration | Defer until the local Pi workflow proves valuable and stable. |
| CI enforcement | Defer until the workflow is deterministic enough for automation. |
| Deep per-language analyzers across many ecosystems | Conflicts with the language-agnostic v1 scope and would inflate complexity. |
| Custom extension-first UX | Not necessary to deliver the core `/skill` workflow in v1. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
| ----------- | ----- | ------ |
| DIST-01 | Phase 5 | Pending |
| DIST-02 | Phase 1 | Pending |
| DIST-03 | Phase 1 | Pending |
| INVK-01 | Phase 2 | Verified |
| RPRT-01 | Phase 2 | Verified |
| INVK-02 | Phase 3 | Pending |
| INVK-03 | Phase 3 | Pending |
| INVK-04 | Phase 3 | Pending |
| ANLY-01 | Phase 4 | Pending |
| ANLY-02 | Phase 4 | Pending |
| ANLY-03 | Phase 4 | Pending |
| ANLY-04 | Phase 4 | Pending |
| ANLY-05 | Phase 4 | Pending |
| RPRT-02 | Phase 4 | Pending |
| RPRT-03 | Phase 5 | Pending |
| OUTP-01 | Phase 5 | Pending |
| OUTP-02 | Phase 5 | Pending |
| OUTP-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 18 total
- Mapped to phases: 18
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-19*
*Last updated: 2026-04-20 after Phase 2 verification*
