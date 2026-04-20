# Project Research Summary

**Project:** Pi Code Reviewer
**Domain:** Pi-installable repository/code review skill/package
**Researched:** 2026-04-19
**Confidence:** HIGH

## Executive Summary

This project is best built as a **skill-first Pi package**: an npm package that exposes a skill under `skills/code-reviewer/`, ships a standards-compliant `SKILL.md`, and relies on Pi’s built-in repo-inspection tools plus lightweight helper scripts where determinism is needed. The official Pi docs strongly support this shape: skills are the native `/skill:name` mechanism, packages can distribute skills directly through npm or git, and extensions are optional for cases that need custom tools, UI, or state.

For v1, the most important product decision is to stay focused on a **local, on-demand audit workflow**. The package should let a Pi user install it with npm or `pi install`, invoke `/skill:code-reviewer`, choose whole-repo or git-aware changed-files review, and receive `.planning/REVIEW.md` plus `.planning/REVIEW-TODO.md`. The report must be concise but highly actionable, with a prioritized issue table and the five requested sections: Code Quality, Refactoring, Documentation, Security, and Test Coverage.

The biggest risks are avoidable: packaging the skill incorrectly so Pi cannot discover it, over-claiming language-agnostic depth, and producing polished but non-actionable prose. Those risks point to a roadmap that starts with package/discovery correctness, then builds review heuristics and scope control, then locks down output quality and prioritization. Extension work should remain optional until the core skill workflow proves insufficient.

## Key Findings

### Recommended Stack

The recommended stack is a small npm package with a `pi` manifest (or conventional `skills/` directory), `keywords: ["pi-package"]`, and a primary skill at `skills/code-reviewer/SKILL.md`. Use Node.js 20+ and TypeScript 5.x for any helper scripts and tests, but keep the core experience skill-driven so it works naturally with `/skill:code-reviewer` and Pi’s built-in tools.

**Core technologies:**
- **Markdown skill (`SKILL.md`)**: primary workflow surface - because Pi natively maps skills to `/skill:name` commands.
- **npm package + `pi` manifest**: distribution layer - because both direct npm installation and `pi install npm:...` depend on valid package metadata.
- **Node.js / TypeScript**: helper-script and test substrate - because Pi package development and any future extension work fit naturally in the TS ecosystem.
- **Built-in Pi tools (`read`, `bash`, `grep`, `find`, `ls`, `write`)**: main execution substrate - because they already cover repo inspection and artifact generation.

### Expected Features

The table-stakes v1 scope is clear: installable package, explicit `/skill:code-reviewer` invocation, whole-repo review, changed-files review with git fallback, REVIEW/TODO artifact generation in `.planning/`, file/path references, and a priority/severity issue table. These are the minimum features required to deliver the value promised in PROJECT.md.

**Must have (table stakes):**
- Installable Pi package with discoverable skill
- Whole-repo and changed-files-focused review modes
- REVIEW.md with the 5 required sections
- REVIEW-TODO.md as a categorized markdown checklist
- Prioritized findings table with severity/priority and file references

**Should have (competitive):**
- Consistent severity rubric
- Light deterministic helpers for scope detection or normalization
- Stable templates and fixture-based tests

**Defer (v2+):**
- PR/GitHub integration
- CI/policy-gate mode
- Deep language-specific analyzers across many ecosystems
- Extension-led UX unless a real v1 gap appears

### Architecture Approach

The package should be organized as a skill-first architecture with clear boundaries: package metadata for discovery and distribution, a focused `SKILL.md` entrypoint for UX, reference docs and templates for consistency, optional helper scripts for deterministic sub-tasks, and `.planning/` markdown outputs as the product artifact. The data flow should move from install → explicit skill invocation → scope detection → repo evidence gathering → synthesis into REVIEW/TODO files.

**Major components:**
1. **Package manifest** - owns installability, Pi resource declaration, and publish/discovery correctness.
2. **Skill workflow** - owns invocation, mode selection, output contract, and review rubric.
3. **Analysis helpers** - optionally own deterministic tasks like git-aware scope detection.
4. **Artifact generator** - owns `.planning/REVIEW.md` and `.planning/REVIEW-TODO.md` structure and consistency.
5. **Tests/fixtures** - own packaging smoke tests and regression coverage.

### Critical Pitfalls

1. **Package discovery failure** - avoid by validating actual Pi skill discovery after install, not just npm publish success.
2. **Invocation ambiguity** - avoid by documenting `/skill:code-reviewer` as the canonical path.
3. **Context overload on large repos** - avoid by adding explicit scope rules and git-aware narrowed mode.
4. **Non-actionable reports** - avoid by requiring priority/severity triage, file references, and a categorized TODO artifact.
5. **Over-claiming language-agnostic depth** - avoid by using heuristic repo-level analysis and honest confidence signaling.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Package Foundation
**Rationale:** Nothing else matters if Pi cannot install or discover the package reliably.
**Delivers:** npm package skeleton, Pi manifest, valid skill layout, canonical invocation docs, packaging smoke test.
**Addresses:** installability, `/skill:code-reviewer` UX, discovery correctness.
**Avoids:** discovery and runtime dependency pitfalls.

### Phase 2: Core Review Engine
**Rationale:** After discovery works, the next priority is reliable review scope and evidence gathering.
**Delivers:** whole-repo mode, git-aware changed-files mode, traversal rules, category rubric, evidence collection heuristics.
**Uses:** built-in Pi tools and optional scope helper script.
**Implements:** analysis pipeline and scope selection logic.

### Phase 3: Output Contract and Prioritization
**Rationale:** The product’s real value is in actionable outputs, not just analysis.
**Delivers:** `.planning/REVIEW.md`, `.planning/REVIEW-TODO.md`, prioritized issue table, severity/priority model, templates.
**Addresses:** the user’s “what should I fix first?” need.
**Avoids:** readable-but-non-actionable report quality failures.

### Phase 4: Hardening and Publish Readiness
**Rationale:** Once the core workflow exists, make it trustworthy for sharing.
**Delivers:** fixture-based tests, documentation polish, install verification from tarball, language-agnostic guardrails, publish checklist.
**Addresses:** package trust and regression prevention.
**Avoids:** over-claiming coverage or shipping a package that only works in dev.

### Phase Ordering Rationale

- Package/discovery must precede review logic because an undiscoverable skill has zero user value.
- Review scope and heuristics must precede output polish because the report is only as good as its evidence.
- Output contract deserves its own phase because prioritization and TODO generation are core product value, not mere polish.
- Hardening comes last so real workflow lessons can shape tests, docs, and publish checks.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2:** Large-repo traversal rules and git-aware scope selection may need additional exploration against fixture repos.
- **Phase 4:** Publish-validation details may need confirmation once the exact package layout is implemented.

Phases with standard patterns (skip research-phase):
- **Phase 1:** Pi package + skill discovery follows well-documented official patterns.
- **Phase 3:** Markdown artifact templating and TODO generation are straightforward once the findings model is stable.

## Confidence Assessment

| Area | Confidence | Notes |
| ---- | ---------- | ----- |
| Stack | HIGH | Based directly on official Pi README and package/skill docs. |
| Features | MEDIUM | Strongly grounded in user goals and Pi workflow conventions, but less backed by external competitor research. |
| Architecture | HIGH | Official docs clearly separate skill/package responsibilities from extension responsibilities. |
| Pitfalls | HIGH | Most major failure modes are direct consequences of official discovery/install/runtime rules. |

**Overall confidence:** HIGH

### Gaps to Address

- **Exact package name and branding:** decide during implementation, then confirm npm availability and Pi gallery presentation.
- **Cross-platform shell assumptions:** validate whether helper scripts should replace some shell logic for portability.
- **Severity rubric calibration:** refine once real fixture repos reveal what “high/medium/low” should mean in practice.

## Sources

### Primary (HIGH confidence)
- Official Pi README - install flows, `/skill:name`, package conventions, extensions vs skills
- Official Pi `docs/skills.md` - skill discovery, frontmatter rules, invocation behavior
- Official Pi `docs/packages.md` - package manifest, conventional directories, install semantics, dependency guidance
- Official Pi `docs/extensions.md` - confirms extension scope and why extension work is optional here

### Secondary (MEDIUM confidence)
- `examples/extensions/README.md` - extension patterns and optionality
- `examples/sdk/04-skills.ts` - confirms skill discovery/filtering behavior
- `examples/sdk/README.md` - SDK/resource-loader context for packaged skills
- `examples/extensions/plan-mode/README.md` - analogous read-oriented analysis workflow pattern

### Tertiary (LOW confidence)
- None used; this research leaned heavily on official Pi docs plus direct project goals.

---
*Research completed: 2026-04-19*
*Ready for roadmap: yes*
