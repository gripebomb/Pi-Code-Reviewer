# Feature Research

**Domain:** Pi-installable repository/code review skill
**Researched:** 2026-04-19
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
| ------- | ------------ | ---------- | ----- |
| Explicit `/skill:code-reviewer` workflow | Pi users expect a skill package to be invokable as a skill command once installed | LOW | Must be documented as the primary path because skill auto-invocation is not always reliable. |
| Whole-repo review mode | Core audit use case is a full repository health check | MEDIUM | Needs clear repository traversal rules and output limits. |
| Git-aware changed-files-focused review mode | Pre-commit/pre-push use cases naturally focus on current diffs | MEDIUM | Depends on git availability and sane fallback behavior. |
| Structured markdown report with fixed sections | User explicitly expects Code Quality, Refactoring, Documentation, Security, and Test Coverage | LOW | This is the core product promise and should not be optional in v1. |
| Actionable findings with file/path references | A review skill without references is hard to act on | MEDIUM | Findings should point to files and, when possible, functions/modules or line ranges. |
| Prioritized issue table | Users need help choosing what to fix first before push | MEDIUM | Should include severity/priority, category, location, and brief rationale. |
| Persistent output artifacts in `.planning/` | User expects generated files, not only chat output | LOW | At minimum: `.planning/REVIEW.md` and `.planning/REVIEW-TODO.md`. |
| Graceful handling of missing docs/tests | Many repos will have gaps; the skill must still produce useful output | LOW | Documentation and test coverage sections should call out absence explicitly. |

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
| ------- | ----------------- | ---------- | ----- |
| Severity rubric tailored for repo audits | Makes prioritization more trustworthy and repeatable | MEDIUM | Can be expressed as a reference doc or template shipped with the skill. |
| Review scope detection helper | Reduces prompt burden by automatically identifying changed-file vs full-repo paths | MEDIUM | Optional helper script can improve consistency without requiring an extension. |
| Consistent TODO checklist grouped by category | Makes handoff to another agent or human easier | LOW | Strong differentiator because many AI reviews stop at prose. |
| Lightweight fixture-based self-tests | Helps package consumers trust output quality across repo types | MEDIUM | Good for maintainability, not necessarily user-facing. |
| Optional future extension for richer UX | Opens path to custom commands/tools later | HIGH | Valuable later, but not required for initial user value. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
| ------- | ------------- | --------------- | ----------- |
| Auto-fixing code in v1 | Seems convenient and “complete” | Increases trust burden and changes the product from reviewer to mutator before the audit quality is proven | Keep v1 report-only with prioritized findings and TODO output. |
| PR/GitHub integration in v1 | Feels like a natural review destination | Adds API/auth complexity and distracts from the local Pi workflow the user actually wants first | Defer to a later milestone after local review UX is solid. |
| CI enforcement in v1 | Attractive for teams and policy gates | Requires determinism, non-interactive operation design, and often structured outputs beyond markdown | Defer until the local workflow and severity model stabilize. |
| Deep language-specific analyzers for many ecosystems in v1 | Sounds powerful and broad | Conflicts with language-agnostic v1 scope and explodes complexity | Stay heuristic/language-agnostic first; add ecosystem adapters later if demand appears. |

## Feature Dependencies

```text
Installable package
    └──requires──> valid package manifest and skill discovery layout

`/skill:code-reviewer`
    └──requires──> valid SKILL.md frontmatter + installed package

Changed-files review
    └──requires──> git-aware scope detection
                       └──requires──> sensible fallback to whole-repo review

Prioritized issue table
    └──requires──> normalized findings across all five report categories

Categorized TODO output
    └──enhances──> REVIEW.md by making findings immediately actionable
```

### Dependency Notes

- **Skill invocation requires correct packaging:** without valid `package.json`/`skills/` layout, none of the core UX exists.
- **Changed-files mode requires fallback behavior:** repos without git or with ambiguous diff state must still get a useful full review.
- **Prioritization depends on a consistent rubric:** otherwise the issue table becomes arbitrary and hard to trust.
- **TODO generation depends on stable category mapping:** each finding should land in one of the user-requested sections/checklist groups.

## MVP Definition

### Launch With (v1)

- [ ] Installable npm package with Pi package metadata - essential for distribution and discovery
- [ ] One review skill invoked with `/skill:code-reviewer` - essential for native Pi UX
- [ ] Whole-repo mode - essential for complete repo audits
- [ ] Changed-files-focused mode with git fallback - essential for pre-push workflow
- [ ] `.planning/REVIEW.md` with the five required sections - essential for the user promise
- [ ] `.planning/REVIEW-TODO.md` as a markdown checklist grouped by category - essential for actionability
- [ ] Prioritized findings table with severity/priority - essential for fix ordering

### Add After Validation (v1.x)

- [ ] Scope-detection helper script improvements - add when real repos reveal ambiguity or portability issues
- [ ] Better severity heuristics and wording polish - add once users react to early outputs
- [ ] Optional prompt arguments for focus area or tighter scope - add after core path works reliably

### Future Consideration (v2+)

- [ ] PR/GitHub integration - defer until local workflow is proven
- [ ] CI/non-interactive policy-gate mode - defer until outputs are deterministic enough
- [ ] Structured JSON export alongside markdown - defer until machine consumption becomes a real requirement
- [ ] Language-specific analyzer adapters - defer until usage data shows which ecosystems deserve deeper support

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
| ------- | ---------- | ------------------- | -------- |
| Installable Pi package | HIGH | MEDIUM | P1 |
| `/skill:code-reviewer` invocation | HIGH | LOW | P1 |
| Whole-repo review | HIGH | MEDIUM | P1 |
| Changed-files review | HIGH | MEDIUM | P1 |
| REVIEW.md with five sections | HIGH | LOW | P1 |
| REVIEW-TODO.md checklist | HIGH | LOW | P1 |
| Prioritized issue table | HIGH | MEDIUM | P1 |
| Severity rubric refinement | MEDIUM | MEDIUM | P2 |
| Helper script normalization layer | MEDIUM | MEDIUM | P2 |
| Custom extension UX | MEDIUM | HIGH | P3 |
| GitHub/CI integrations | MEDIUM | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor / Ecosystem Framing

| Feature | Ad hoc prompting | Generic code-review prompts | Our Approach |
| ------- | ---------------- | --------------------------- | ------------ |
| Repeatable invocation | Weak | Weak | Dedicated Pi skill command |
| Structured output files | Often absent | Inconsistent | REVIEW + categorized TODO in `.planning/` |
| Prioritized findings | Sometimes | Often subjective | Explicit issue table with severity/priority |
| Git-aware local workflow | Manual | Manual | First-class local repo review modes |

## Sources

- User-stated product goals in `.planning/PROJECT.md`
- Official Pi README and `docs/skills.md` for skill invocation expectations
- Official Pi `docs/packages.md` for distribution constraints and package UX
- Pi `examples/extensions/plan-mode/README.md` as evidence that scoped/read-only analysis workflows are a common pattern in Pi

---
*Feature research for: Pi-installable code review skill*
*Researched: 2026-04-19*
