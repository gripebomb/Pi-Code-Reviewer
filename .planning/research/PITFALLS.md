# Pitfalls Research

**Domain:** Pi-installable code reviewer skill/package
**Researched:** 2026-04-19
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Shipping a package Pi cannot actually discover

**What goes wrong:**
The package publishes successfully to npm, but Pi does not expose the skill because the `skills/` layout or `pi` manifest is wrong.

**Why it happens:**
Developers focus on npm packaging but miss Pi’s resource discovery rules, Agent Skills naming rules, or package manifest conventions.

**How to avoid:**
Use a conventional `skills/code-reviewer/SKILL.md` layout, add `keywords: ["pi-package"]`, keep the skill name aligned with the parent directory, and verify discovery after install.

**Warning signs:**
- `pi install` succeeds but `/skill:code-reviewer` is missing
- Skill name warnings during load
- Package tarball missing `skills/` content

**Phase to address:**
Phase 1 - package foundation and discovery

---

### Pitfall 2: Relying on auto-loaded skills instead of explicit invocation

**What goes wrong:**
Users install the package but get inconsistent behavior because the model does not always auto-read the skill when they describe a review task.

**Why it happens:**
Pi docs explicitly note that models do not always load the full skill automatically.

**How to avoid:**
Make `/skill:code-reviewer` the canonical documented entry point and optimize the skill description secondarily for discovery.

**Warning signs:**
- Users say the package “sometimes works” only with special wording
- Outputs miss the mandated five-section structure
- Review runs look like generic prompting rather than the packaged workflow

**Phase to address:**
Phase 1 - package UX and documentation

---

### Pitfall 3: Over-claiming language-agnostic coverage

**What goes wrong:**
The package promises strong support for “any codebase” but produces shallow or misleading advice on unfamiliar stacks.

**Why it happens:**
“Language-agnostic” is interpreted as “equally deep in every ecosystem.”

**How to avoid:**
Define v1 as repo-level, heuristic analysis with confidence signaling. Be strong on structural review categories and explicit about lower-confidence domain-specific judgments.

**Warning signs:**
- Findings use generic filler language
- Severity feels arbitrary in non-JS repos
- Test/documentation/security sections repeat boilerplate without code references

**Phase to address:**
Phase 2 - review heuristics and output contract

---

### Pitfall 4: Whole-repo scans that blow up context and lose signal

**What goes wrong:**
Large repositories produce too much noise, causing the review to miss important issues or return vague summaries.

**Why it happens:**
The workflow tries to inspect everything uniformly without triage.

**How to avoid:**
Add explicit scope rules: favor representative files, configs, docs, tests, and architectural hotspots; use changed-files mode when possible; cap exploration breadth before synthesis.

**Warning signs:**
- Tool output becomes long and repetitive
- Findings rarely mention exact files
- REVIEW.md contains broad statements unsupported by evidence

**Phase to address:**
Phase 2 - scope selection and repo traversal

---

### Pitfall 5: Reports that are readable but not actionable

**What goes wrong:**
The skill produces polished prose with little prioritization, few file references, and no obvious next steps.

**Why it happens:**
The workflow optimizes for narrative review instead of issue triage.

**How to avoid:**
Require a prioritized issue table, category grouping, severity/priority labels, and a markdown checklist TODO artifact tied to concrete findings.

**Warning signs:**
- Users ask “what should I fix first?”
- Findings have no file references
- TODO output cannot be handed to another agent or human without re-interpretation

**Phase to address:**
Phase 3 - artifact generation and prioritization

---

### Pitfall 6: Runtime dependencies disappearing after install

**What goes wrong:**
The package works locally in development but fails when installed through Pi because helper scripts rely on `devDependencies` or unpublished files.

**Why it happens:**
Pi package installation for npm/git follows production-oriented dependency behavior.

**How to avoid:**
Put runtime dependencies in `dependencies`, verify the published tarball with `npm pack`, and run install smoke tests from the packed artifact.

**Warning signs:**
- Installed package cannot find imported modules
- Scripts run in the repo but not after install
- `pi install` works, but skill execution fails on helper script invocation

**Phase to address:**
Phase 1 - packaging and install validation

---

### Pitfall 7: Escalating to an extension too early

**What goes wrong:**
The project spends time on custom tools/UI/state before proving the core review flow.

**Why it happens:**
Pi extensions are powerful and tempting, especially for package authors.

**How to avoid:**
Treat extension work as optional until a concrete v1 limitation appears.

**Warning signs:**
- More effort spent on custom commands/tools than on review quality
- Roadmap phases fill with extension plumbing before output quality is validated
- The skill still lacks a stable report contract

**Phase to address:**
Phase 4 or later - enhancement, not initial ship

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
| -------- | ----------------- | -------------- | --------------- |
| Hard-coding report sections without a rubric | Faster first draft | Inconsistent severity and weak prioritization | Only for the first internal prototype, not for publishable v1 |
| Embedding all guidance directly in `SKILL.md` | Fewer files | Context bloat and harder maintenance | Rarely; better to move details into references |
| Using ad hoc shell output parsing everywhere | Fast initial implementation | Brittle behavior across platforms and repo shapes | Acceptable only until a helper script becomes clearly necessary |
| Advertising unsupported ecosystems as first-class | Better marketing | User trust loss | Never |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
| ----------- | -------------- | ---------------- |
| Pi package discovery | Assuming npm publish alone is sufficient | Validate actual Pi skill discovery after `pi install` |
| Git-based scope detection | Assuming git always exists and repo is clean | Detect git availability/state and fall back gracefully |
| Helper scripts | Depending on dev-only packages or omitted files | Keep runtime deps in `dependencies` and verify packed artifact contents |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
| ---- | -------- | ---------- | -------------- |
| Full recursive scans on large repos | Slow runs, noisy findings, weak specificity | Add scope heuristics and changed-file mode | Medium to large monorepos |
| Reading too many generated/vendor files | Review quality drops, context wasted | Exclude noisy directories and generated assets | Any repo with build artifacts or vendored code |
| Re-checking every file for every category separately | Duplicate work and repeated tool calls | Gather evidence once, then synthesize per category | Repos with many modules or docs/tests |

## Security Mistakes

| Mistake | Risk | Prevention |
| ------- | ---- | ---------- |
| Executing arbitrary repo scripts during review | Remote code execution / unsafe side effects | Keep v1 review read-oriented; use shell commands only for inspection and artifact generation |
| Treating missing security signals as “no issues” | False confidence | Report uncertainty explicitly when evidence is absent |
| Writing outputs outside an agreed location | Repository clutter or accidental overwrite | Standardize on `.planning/REVIEW.md` and `.planning/REVIEW-TODO.md` |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
| ------- | ----------- | --------------- |
| Ambiguous invocation | Users forget how to run the skill | Document one canonical command: `/skill:code-reviewer` |
| Long essays without triage | Users cannot act quickly before push | Lead with priority/severity table and concise category sections |
| Hidden fallback behavior | Users mistrust results when git is unavailable | State which mode was used and why in the report header |

## "Looks Done But Isn't" Checklist

- [ ] **Package install:** Verify the skill appears after `pi install` and not just after local development loading.
- [ ] **Skill discovery:** Verify skill name, directory name, and frontmatter all match Agent Skills rules.
- [ ] **Changed-files mode:** Verify the workflow falls back cleanly when git is missing or there are no staged/unstaged changes.
- [ ] **REVIEW.md:** Verify all five required sections exist and include file/path references where evidence exists.
- [ ] **TODO output:** Verify the checklist is grouped by category and sortable by priority/severity.
- [ ] **Language-agnostic claim:** Verify the report can gracefully express uncertainty on unfamiliar stacks instead of bluffing.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
| ------- | ------------- | -------------- |
| Discovery failure | LOW | Fix manifest/layout, repack, reinstall, re-run discovery smoke test |
| Weak prioritization | MEDIUM | Add severity rubric, normalize findings, refresh templates |
| Context overload on large repos | MEDIUM | Tighten traversal rules, add scope helper, test on large fixtures |
| Premature extension complexity | HIGH | Simplify back to skill-first flow, preserve only proven custom behavior |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
| ------- | ---------------- | ------------ |
| Package not discoverable | Phase 1 | Installed package exposes `/skill:code-reviewer` reliably |
| Invocation ambiguity | Phase 1 | README and examples use the same canonical command |
| Scope overload | Phase 2 | Large fixture repos still yield file-specific findings |
| Weak prioritization | Phase 3 | REVIEW/TODO outputs clearly show what to fix first |
| Premature extension complexity | Phase 4+ | Extension work only starts after the core review contract is stable |

## Sources

- Official Pi README - package installation, skill invocation, extension scope
- `docs/skills.md` - discovery rules, frontmatter validation, `/skill:name` behavior
- `docs/packages.md` - install semantics, dependency guidance, package manifests
- `docs/extensions.md` and extension examples README - confirms what extensions are for and why they should remain optional here

---
*Pitfalls research for: Pi-installable code review skill/package*
*Researched: 2026-04-19*
