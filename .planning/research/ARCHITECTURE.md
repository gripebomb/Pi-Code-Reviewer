# Architecture Research

**Domain:** Pi-installable code reviewer skill/package
**Researched:** 2026-04-19
**Confidence:** HIGH

## Standard Architecture

### System Overview

```text
┌────────────────────────────────────────────────────────────────────┐
│                    Distribution / Package Layer                   │
├────────────────────────────────────────────────────────────────────┤
│ package.json + `pi` manifest + npm metadata + README             │
└──────────────────────────────┬─────────────────────────────────────┘
                               │ installed via npm / `pi install`
┌──────────────────────────────▼─────────────────────────────────────┐
│                         Skill UX Layer                            │
├────────────────────────────────────────────────────────────────────┤
│ skills/code-reviewer/SKILL.md                                     │
│ references/review-rubric.md                                       │
│ references/output-contract.md                                     │
│ assets/review-template.md / todo-template.md                      │
└──────────────────────────────┬─────────────────────────────────────┘
                               │ invoked via `/skill:code-reviewer`
┌──────────────────────────────▼─────────────────────────────────────┐
│                      Review Execution Layer                       │
├────────────────────────────────────────────────────────────────────┤
│ Pi built-in tools: read, bash, grep, find, ls, write             │
│ Optional helper scripts: detect-scope.mjs, normalize-findings.mjs │
└──────────────────────────────┬─────────────────────────────────────┘
                               │ scans repo / git diff / docs / tests
┌──────────────────────────────▼─────────────────────────────────────┐
│                       Artifact Output Layer                       │
├────────────────────────────────────────────────────────────────────┤
│ .planning/REVIEW.md                                               │
│ .planning/REVIEW-TODO.md                                          │
└────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
| --------- | -------------- | ---------------------- |
| Package manifest | Declares package identity, Pi resources, and installability | `package.json` with `keywords: ["pi-package"]` and `pi.skills` / conventional `skills/` directory |
| Skill instructions | Define review workflow, output contract, and safe operating procedure | `skills/code-reviewer/SKILL.md` with Agent Skills-compliant frontmatter |
| Reference docs | Hold detailed rubric, severity rules, and examples without bloating the skill entrypoint | Markdown files under `references/` loaded on demand by the agent |
| Helper scripts (optional) | Handle deterministic tasks such as detecting review scope or normalizing intermediate data | Lightweight Node/TS scripts under `scripts/` |
| Output templates/assets | Keep REVIEW and TODO structure consistent | Markdown assets or embedded examples referenced by the skill |
| Tests/fixtures | Validate package behavior against representative repos | Fixture directories + Vitest or shell-based smoke tests |

## Recommended Project Structure

```text
.
├── package.json                 # npm metadata + `pi` manifest
├── README.md                    # install + usage docs
├── skills/
│   └── code-reviewer/
│       ├── SKILL.md             # primary skill entrypoint
│       ├── references/
│       │   ├── review-rubric.md
│       │   ├── severity-guidelines.md
│       │   └── output-contract.md
│       ├── assets/
│       │   ├── review-template.md
│       │   └── todo-template.md
│       └── scripts/
│           ├── detect-scope.mjs
│           └── normalize-findings.mjs
├── test/
│   ├── fixtures/
│   └── package-smoke.test.ts
└── examples/
    └── sample-invocations.md
```

### Structure Rationale

- **`skills/code-reviewer/`:** keeps the user-facing workflow self-contained and compatible with Pi skill discovery.
- **`references/`:** allows progressive disclosure so the main skill stays concise while still shipping detailed guidance.
- **`assets/`:** stabilizes report shape and TODO formatting across runs.
- **`scripts/`:** optional deterministic helpers for tasks where plain model reasoning over shell output is too noisy.
- **`test/fixtures/`:** crucial for a shared package whose behavior must survive refactors and packaging changes.

## Architectural Patterns

### Pattern 1: Skill-First Orchestration (Recommended)

**What:** The skill is the product surface. It instructs Pi to inspect the repo using built-in tools and optionally call helper scripts.
**When to use:** v1, when `/skill` is the desired UX and no custom UI/tooling is required.
**Trade-offs:** Lowest complexity and most native Pi fit, but less deterministic than a dedicated extension tool for advanced flows.

### Pattern 2: Deterministic Helper Sidecars

**What:** Small scripts do constrained jobs such as selecting changed files, extracting test/documentation paths, or formatting the final issue table.
**When to use:** When a subtask benefits from code-level determinism but the overall workflow is still naturally skill-driven.
**Trade-offs:** Slightly more package complexity, but better reproducibility without committing to an extension architecture.

### Pattern 3: Optional Extension Escalation (Later)

**What:** Add an extension only if the package needs custom tools, UI, persistent state, or command registration beyond `/skill:name`.
**When to use:** After validating that the skill-only workflow has a concrete limitation.
**Trade-offs:** More power and control, but significantly more implementation and compatibility surface.

## Data Flow

### Request Flow

```text
User runs `/skill:code-reviewer [args]`
    ↓
Pi loads `SKILL.md`
    ↓
Skill determines scope
    ├── whole repo via find/read/grep/ls
    └── changed files via git status / git diff (fallback to whole repo)
    ↓
Skill inspects code, docs, config, tests, and repo signals
    ↓
Findings are grouped into 5 categories + prioritized issue table
    ↓
Pi writes `.planning/REVIEW.md`
    ↓
Pi writes `.planning/REVIEW-TODO.md`
```

### Key Data Flows

1. **Installation flow:** npm or `pi install` brings package into Pi’s discovered resource set.
2. **Invocation flow:** `/skill:code-reviewer` forces skill load and passes optional arguments into the skill context.
3. **Analysis flow:** built-in tools gather repo evidence; optional helper scripts narrow scope or normalize structure.
4. **Artifact flow:** findings are rendered into two markdown outputs in `.planning/`.

## Build Order Implications

1. **Package and discovery first** - without valid Pi package/skill loading, nothing else matters.
2. **Core skill contract second** - define fixed outputs, review sections, severity logic, and mode selection rules.
3. **Repo analysis heuristics third** - implement whole-repo and git-aware changed-file workflows.
4. **Artifact generation fourth** - ensure REVIEW/TODO outputs are stable and actionable.
5. **Tests and polish fifth** - add fixtures, docs, and edge-case hardening after the happy path works.

## Anti-Patterns

### Anti-Pattern 1: Extension Before Need

**What people do:** Start with a custom extension because Pi supports them.
**Why it's wrong:** It adds complexity before confirming that built-in tools plus a skill cannot deliver the desired outcome.
**Do this instead:** Ship a skill-first package and introduce an extension only for proven gaps.

### Anti-Pattern 2: One Giant SKILL.md

**What people do:** Put every rubric, example, and edge case into the main skill file.
**Why it's wrong:** Bloats context and makes the primary instructions harder for the agent to follow consistently.
**Do this instead:** Keep the main skill focused and move details into reference docs and templates.

### Anti-Pattern 3: Treating “language-agnostic” as “language-expert”

**What people do:** Promise deep analysis across every ecosystem in v1.
**Why it's wrong:** The package becomes over-scoped and inconsistent.
**Do this instead:** Provide reliable repo-level heuristics and explicitly note where confidence is lower.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
| ------- | ------------------- | ----- |
| npm registry | Publish/install package | Required for npm install and `pi install npm:...`. |
| git CLI | Local diff/status queries | Core to changed-files review mode. |
| Pi package loader | Discovers skills from package resources | High-confidence behavior from official Pi docs. |

### Internal Boundaries

| Boundary | Communication | Notes |
| -------- | ------------- | ----- |
| Package manifest ↔ skill directory | Package discovery | Must stay aligned or the skill will not load correctly. |
| Skill ↔ helper scripts | Shell/script invocation | Keep helpers optional and narrow. |
| Analysis pipeline ↔ output templates | File generation | Stable templates reduce drift in report quality. |

## Extension Work in v1?

**Recommendation:** Optional, not foundational.

The official Pi docs make it clear that:
- skills are the native mechanism for `/skill:name` workflows,
- packages can ship skills directly,
- extensions are best reserved for custom tools, UI, event hooks, and stateful behavior.

That makes an extension unnecessary for the core v1 promise. The roadmap should treat extension work as a later enhancement path, not a prerequisite for shipping.

## Sources

- Official Pi README - skill commands, package install, extensions vs skills framing
- `docs/skills.md` - skill discovery, command registration, structure, and frontmatter
- `docs/packages.md` - package manifests, conventional directories, install semantics, dependencies
- `docs/extensions.md` - confirms extensions are for custom tools/UI/events and are not required for skill packaging
- `examples/extensions/README.md` - examples showing extension scope and optionality
- `examples/extensions/subagent/README.md` - evidence for project-local packaged agent resources, not required for v1 but useful architectural contrast

---
*Architecture research for: Pi-installable code reviewer skill/package*
*Researched: 2026-04-19*
