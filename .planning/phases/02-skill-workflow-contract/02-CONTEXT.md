# Phase 2: Skill Workflow Contract - Context

**Gathered:** 2026-04-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Define the `/skill:code-reviewer` experience and fixed report structure. When a user invokes the skill, it runs a clear workflow pipeline and produces a markdown review organized into five categories (Code Quality, Refactoring, Documentation, Security, Test Coverage). This phase covers the SKILL.md workflow, reference/rubric docs, report templates, and validation that invocation produces the correct output skeleton. It does not implement scope selection (Phase 3), analysis heuristics (Phase 4), or prioritized output artifacts (Phase 5).

</domain>

<decisions>
## Implementation Decisions

### SKILL.md structure
- **D-01:** SKILL.md is a **concise orchestrator** — it defines workflow steps and delegates details (rubric, output contract, severity guidelines) to reference docs. Avoids the "one giant SKILL.md" anti-pattern from architecture research.
- **D-02:** The skill defines a **5-phase pipeline**: (1) Determine scope, (2) Gather evidence, (3) Evaluate categories, (4) Prioritize findings, (5) Write report artifacts. Each phase is a clear checkpoint for consistent behavior across runs.

### Report structure & tone
- **D-03:** Each of the 5 report sections opens with a **1-2 sentence summary assessment** of the category, followed by detailed findings. Users get a quick read before diving in.
- **D-04:** Findings within each section are **grouped by severity sub-headers** (`### High`, `### Medium`, `### Low`). Users can triage the most important issues first within each category.
- **D-05:** Report tone is **actionable but conversational** — findings include context and reasoning, not just flat facts. Example: "The error path in `parseConfig()` isn't handled — if the config file is malformed, the promise rejection will crash the process."

### Workflow UX
- **D-06:** The skill shows **progressive status** as it moves through phases (e.g., "◆ Determining review scope...", "◆ Analyzing code quality..."). No interaction required, but the user sees what's happening.
- **D-07:** The skill is **fully non-interactive** — no prompts, no questions. It makes its best choices and produces output. The user reviews artifacts afterward.
- **D-08:** When `.planning/REVIEW.md` already exists, the skill **notes in the report** that the previous review was replaced. No blocking prompt, just acknowledgment.

### Template/reference design
- **D-09:** Report templates use **guidance with examples** — they describe what each section should contain and show an example, but the agent can adapt formatting based on what it finds. Different repos have different finding profiles.
- **D-10:** The split between rubric detail in SKILL.md vs. reference docs is **the agent's discretion** during planning.

### the agent's Discretion
- Exact SKILL.md wording and instruction phrasing, as long as it follows the concise-orchestrator pattern with 5-phase pipeline.
- Exact reference doc filenames beyond what architecture research suggests (review-rubric, output-contract, severity-guidelines).
- How much rubric detail goes inline in SKILL.md vs. loaded from references.
- Exact formatting of the severity badges/labels in the report.
- How the "previous review replaced" acknowledgment is worded in the output.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project requirements and phase scope
- `.planning/ROADMAP.md` - Phase 2 goal, success criteria, and plan breakdown for Skill Workflow Contract.
- `.planning/PROJECT.md` - Product positioning, 5 review categories, skill-first direction, and output constraints.
- `.planning/REQUIREMENTS.md` - Invocation requirement `INVK-01` and reporting requirement `RPRT-01` that Phase 2 must satisfy.

### Prior phase context
- `.planning/phases/01-package-foundation/01-CONTEXT.md` - Phase 1 decisions on package structure, skill-first layout, and verification approach.

### Architecture and research
- `.planning/research/ARCHITECTURE.md` - Recommended skill-first architecture, component responsibilities, data flow, and anti-patterns (especially "one giant SKILL.md" and "extension before need").
- `.planning/research/STACK.md` - Package stack recommendations and directory layout.

### Existing code (from Phase 1)
- `skills/code-reviewer/SKILL.md` - Current Phase 1 placeholder that Phase 2 replaces with the real workflow.
- `skills/code-reviewer/references/README.md` - Stub that Phase 2 expands with real reference docs.
- `skills/code-reviewer/assets/README.md` - Stub that Phase 2 expands with report templates.
- `package.json` - Package manifest with Pi skill discovery config (`pi.skills`).

### Pi skill/package rules
- `/Users/dustinmidyett/.nvm/versions/node/v22.13.1/lib/node_modules/@mariozechner/pi-coding-agent/docs/skills.md` - Official Pi skill discovery, naming, SKILL.md structure, frontmatter, and `/skill:name` behavior.
- `/Users/dustinmidyett/.nvm/versions/node/v22.13.1/lib/node_modules/@mariozechner/pi-coding-agent/docs/packages.md` - Official Pi package manifests, conventional directories, and skill resource loading.
- `/Users/dustinmidyett/.nvm/versions/node/v22.13.1/lib/node_modules/@mariozechner/pi-coding-agent/examples/extensions/dynamic-resources/SKILL.md` - Minimal example of a valid skill file shape.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `skills/code-reviewer/SKILL.md`: Phase 1 placeholder — frontmatter is correct (name, description), body needs full replacement with Phase 2 workflow.
- `skills/code-reviewer/references/`: Directory exists with stub README. Ready for real reference docs.
- `skills/code-reviewer/assets/`: Directory exists with stub README. Ready for report templates.
- `package.json`: Already configured with `pi.skills: ["./skills"]` for Pi discovery.

### Established Patterns
- Phase 1 established a **skill-first package layout** — `skills/code-reviewer/` with `references/` and `assets/` subdirectories.
- Architecture research recommends **progressive disclosure** — concise skill entry, details in references.
- The package uses **no build step** — files ship as-is from the repo tree.

### Integration Points
- SKILL.md is the entry point Pi loads when `/skill:code-reviewer` is invoked.
- Reference docs are loaded by the agent on demand during skill execution.
- Asset templates guide the shape of `.planning/REVIEW.md` and `.planning/REVIEW-TODO.md` outputs.
- Phase 3 will extend SKILL.md with scope selection logic; Phase 2 should make that extensible.
- Phase 4 will replace placeholder heuristics with real analysis guidance; Phase 2 should define where that guidance lives.

</code_context>

<specifics>
## Specific Ideas

- The 5-phase pipeline should give the agent clear phase transitions so output is consistent even when different repos produce very different finding profiles.
- Progressive status messages should use the format `◆ <verb>...` to match the established pattern from GSD tooling.
- The summary+findings format means even a quick skim of each section heading tells the user if a category is healthy or needs attention.
- Report templates should include a concrete example so the agent understands the target shape, not just abstract guidance.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 02-skill-workflow-contract*
*Context gathered: 2026-04-20*
