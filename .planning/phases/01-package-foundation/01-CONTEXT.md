# Phase 1: Package Foundation - Context

**Gathered:** 2026-04-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Make Pi Code Reviewer installable from npm and discoverable through Pi package installation so users can find and invoke it as a Pi skill. This phase covers package identity, package layout, installation/invocation documentation, and proof that the packed artifact installs and is discoverable. It does not add review workflow behavior beyond what is needed to prove installation and skill discovery.

</domain>

<decisions>
## Implementation Decisions

### Publish identity
- **D-01:** Target an **unscoped public npm package**.
- **D-02:** The preferred canonical package name is **`pi-code-reviewer`**.
- **D-03:** If `pi-code-reviewer` is unavailable, stop and deliberately choose a new canonical name rather than improvising a fallback during implementation.

### Package structure
- **D-04:** Use a **future-ready, skill-first package layout** rather than a minimal one-off scaffold.
- **D-05:** The initial scaffold should be organized so Phase 2 can add reference docs, assets, and related skill resources without a repo reorganization.

### Installation documentation
- **D-06:** README/documentation should support **both installation paths**: standard npm install and `pi install`.
- **D-07:** Documentation should include a shared post-install smoke test centered on **`/skill:code-reviewer`**.
- **D-08:** Docs should be written for end users first, while still enabling local verification during development.

### Installability verification
- **D-09:** Phase 1 is not complete when files merely exist in the repo; it must verify the **packed npm artifact**.
- **D-10:** Phase 1 must include a **real local install/discovery smoke test** to confirm Pi can discover the packaged skill after installation.

### the agent's Discretion
- Exact file names for placeholder reference/assets docs, as long as the package remains skill-first and future-ready.
- Exact wording and ordering of README installation examples, as long as both npm and `pi install` paths are clearly documented.
- Specific smoke-test command sequence, as long as it proves packed artifact contents and Pi skill discovery.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project requirements and phase scope
- `.planning/ROADMAP.md` - Phase 1 goal, success criteria, and plan breakdown for Package Foundation.
- `.planning/PROJECT.md` - Product positioning, skill-first direction, and package-level constraints.
- `.planning/REQUIREMENTS.md` - Distribution requirements `DIST-01`, `DIST-02`, and `DIST-03` that Phase 1 must satisfy.
- `.planning/STATE.md` - Current project state and active focus on Phase 1.

### Project research already completed
- `.planning/research/STACK.md` - Recommended package stack, manifest shape, directory layout, and packaging guidance specific to this project.
- `.planning/research/ARCHITECTURE.md` - Recommended skill-first package architecture and build-order implications.

### Pi package and skill rules
- `../../.nvm/versions/node/v22.13.1/lib/node_modules/@mariozechner/pi-coding-agent/docs/packages.md` - Official Pi package install flows, manifest rules, conventional directories, and dependency guidance.
- `../../.nvm/versions/node/v22.13.1/lib/node_modules/@mariozechner/pi-coding-agent/docs/skills.md` - Official Pi skill discovery, naming, structure, and `/skill:name` behavior.
- `../../.nvm/versions/node/v22.13.1/lib/node_modules/@mariozechner/pi-coding-agent/README.md` - Top-level Pi usage, `/skill:name` invocation model, and package install command examples.

### Pi examples for concrete shape
- `../../.nvm/versions/node/v22.13.1/lib/node_modules/@mariozechner/pi-coding-agent/examples/extensions/dynamic-resources/SKILL.md` - Minimal example of a valid skill file shape.
- `../../.nvm/versions/node/v22.13.1/lib/node_modules/@mariozechner/pi-coding-agent/examples/sdk/04-skills.ts` - Example showing skill discovery/loading concepts from Pi's SDK side.
- `../../.nvm/versions/node/v22.13.1/lib/node_modules/@mariozechner/pi-coding-agent/examples/README.md` - Map of official examples relevant to skills and extensions.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.planning/research/STACK.md`: already proposes the recommended package metadata, directory layout, and tooling for this phase.
- `.planning/research/ARCHITECTURE.md`: already defines the preferred skill-first package structure and where future resources should live.

### Established Patterns
- The project is currently **planning-first**; there is no existing package scaffold to preserve or migrate.
- Project-level direction already favors a **skill-first Pi package** over an extension-first architecture.
- Future phases expect package resources under a stable skill directory, so Phase 1 should create a layout that later phases can extend rather than replace.

### Integration Points
- `package.json` at repo root will be the primary integration point for npm metadata and Pi package manifest configuration.
- `README.md` at repo root will carry installation and invocation guidance.
- `skills/code-reviewer/` will be the package resource Pi must discover after install.
- Packaging verification should check the actual packed artifact, not just local source files.

</code_context>

<specifics>
## Specific Ideas

- The package should feel like a **native Pi skill package**, not a generic npm library with Pi support bolted on.
- The canonical user validation path is: install package → invoke `/skill:code-reviewer` → confirm Pi discovers the skill.
- If naming is blocked by npm availability, pause and choose a new permanent name intentionally rather than introducing temporary fallback branding.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 01-package-foundation*
*Context gathered: 2026-04-20*
