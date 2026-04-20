# Phase 1 Research: Package Foundation

Confidence legend: **HIGH** = directly supported by current project research or official Pi docs, **MEDIUM** = strong recommendation with one meaningful implementation assumption, **LOW** = weak/contingent guidance.

## User Constraints

### Implementation Decisions

#### Publish identity
- **D-01:** Target an **unscoped public npm package**.
- **D-02:** The preferred canonical package name is **`pi-code-reviewer`**.
- **D-03:** If `pi-code-reviewer` is unavailable, stop and deliberately choose a new canonical name rather than improvising a fallback during implementation.

#### Package structure
- **D-04:** Use a **future-ready, skill-first package layout** rather than a minimal one-off scaffold.
- **D-05:** The initial scaffold should be organized so Phase 2 can add reference docs, assets, and related skill resources without a repo reorganization.

#### Installation documentation
- **D-06:** README/documentation should support **both installation paths**: standard npm install and `pi install`.
- **D-07:** Documentation should include a shared post-install smoke test centered on **`/skill:code-reviewer`**.
- **D-08:** Docs should be written for end users first, while still enabling local verification during development.

#### Installability verification
- **D-09:** Phase 1 is not complete when files merely exist in the repo; it must verify the **packed npm artifact**.
- **D-10:** Phase 1 must include a **real local install/discovery smoke test** to confirm Pi can discover the packaged skill after installation.

### the agent's Discretion
- Exact file names for placeholder reference/assets docs, as long as the package remains skill-first and future-ready.
- Exact wording and ordering of README installation examples, as long as both npm and `pi install` paths are clearly documented.
- Specific smoke-test command sequence, as long as it proves packed artifact contents and Pi skill discovery.

## Deferred Ideas

None - discussion stayed within phase scope.

## Phase Framing

- **HIGH:** Phase 1 should ship the **smallest publishable Pi package** that Pi can discover as `/skill:code-reviewer`.
- **HIGH:** Phase 1 should **not** implement the real review workflow contract. That belongs to Phase 2. The Phase 1 skill only needs to load cleanly, be discoverable, and provide a minimal install-confirmation experience.
- **HIGH:** The plan must treat **npm package-name availability** as an early blocking check. `D-03` means no auto-fallback naming.
- **HIGH:** `DIST-01` is stronger than “`npm pack` works.” A tarball check proves publishability, but the requirement is only truly satisfied once the package is installable from npm.
- **MEDIUM:** The README should present `pi install npm:pi-code-reviewer` as the **canonical Pi-usable path**, while still documenting plain npm installation separately to satisfy `DIST-01`/`D-06`. Official Pi docs guarantee skill discovery for `pi install`; they do **not** state that a normal `npm install -g` alone registers package resources with Pi.

## Standard Stack

| Confidence | Use | Why |
| ---------- | --- | --- |
| **HIGH** | Root-level **npm package** at repo root | Pi packages are distributed through npm/git and described by `package.json`. |
| **HIGH** | `package.json` with `name`, `description`, `keywords: ["pi-package"]`, `pi.skills`, `engines.node`, and a `files` whitelist | This is the minimum clean metadata set for Pi discoverability, npm distribution, and tarball correctness. |
| **HIGH** | Explicit Pi manifest: `"pi": { "skills": ["./skills"] }` | Pi supports convention directories, but an explicit manifest is clearer and easier to verify. |
| **HIGH** | Skill directory: `skills/code-reviewer/SKILL.md` | Official Pi skill discovery requires a directory containing `SKILL.md`; `/skill:name` uses the skill name. |
| **HIGH** | Agent Skills-compliant frontmatter with `name: code-reviewer` and a matching parent directory `code-reviewer/` | Pi validates this and warns on mismatches; missing description prevents loading. |
| **HIGH** | Root `README.md` | `DIST-03` requires install and invocation documentation. README is the primary user entrypoint. |
| **HIGH** | Future-ready subdirectories under the skill, backed by **real placeholder markdown files** such as `references/README.md` and `assets/README.md` | Empty directories do not survive packaging. Placeholder docs preserve structure and make Phase 2 additive instead of reorganizing the package. |
| **HIGH** | Prefer **zero runtime dependencies** in Phase 1 unless a real shipped script requires one | The phase is packaging/discovery/documentation focused; fewer dependencies mean fewer packaging risks. |
| **MEDIUM** | If a helper is needed, prefer a tiny Node `.mjs` script or npm script over adding a TypeScript build step now | Phase 1 does not need a compile pipeline unless an actual runtime script exists. |
| **HIGH** | Node runtime floor: `>=20` | Matches existing stack research and modern Pi/npm expectations. |

### Recommended package metadata

- **HIGH:** Include `keywords: ["pi-package"]` so the package is discoverable in Pi package/gallery flows.
- **HIGH:** Use a `files` whitelist instead of relying on `.npmignore`.
- **HIGH:** Put every runtime-needed file in the tarball: `SKILL.md`, any referenced docs/assets, and any shipped scripts.
- **MEDIUM:** Add standard npm metadata (`repository`, `homepage`, `bugs`, `license`) if available during implementation, but these are polish items, not the core discovery mechanism.

## Architecture Patterns

### 1. Skill-first package scaffold
- **HIGH:** The package should look like a **native Pi skill package**, not a generic npm library with Pi support bolted on.
- **HIGH:** The Phase 1 scaffold should center the product around `skills/code-reviewer/`, not around a CLI entrypoint or extension.
- **HIGH:** The root package is the distribution container; the skill directory is the user-facing capability surface.

### 2. Explicit manifest + conventional directory
- **HIGH:** Keep the conventional `skills/` directory **and** declare it explicitly in `package.json` under `pi.skills`.
- **HIGH:** This gives two benefits: human-inspectable package layout and explicit package intent for Pi.

### 3. Future-ready but still packable structure
- **HIGH:** Create the directories Phase 2 will extend now, but make them packable with real files.
- **HIGH:** Recommended Phase 1 shape:

```text
package.json
README.md
skills/
  code-reviewer/
    SKILL.md
    references/
      README.md
    assets/
      README.md
```

- **HIGH:** Do not create empty directories and assume npm will preserve them.
- **MEDIUM:** Do not add `scripts/` yet unless Phase 1 actually ships a script. That directory can be added later without a structural migration.

### 4. Minimal Phase 1 skill behavior
- **HIGH:** `SKILL.md` should be intentionally minimal and honest: it proves the package installed and the skill resolved, then points forward to the fuller workflow coming in Phase 2.
- **HIGH:** The skill should support the smoke test path `/skill:code-reviewer` without pretending the review engine exists yet.
- **HIGH:** This keeps Phase 1 aligned to `DIST-*` requirements and avoids stealing scope from `INVK-01`/`RPRT-01` in Phase 2.

### 5. Tarball-first verification flow
- **HIGH:** Verification should follow the artifact, not the source tree.
- **HIGH:** Recommended verification order:
  1. Build the npm tarball with `npm pack`
  2. Inspect tarball contents
  3. Unpack the tarball to a temp directory
  4. Run a **local Pi install from the unpacked tarball contents** in a clean temp project
  5. Run `/skill:code-reviewer` in Pi and confirm discovery
- **HIGH:** This is the cleanest way to satisfy both `D-09` and `D-10` without accidentally testing the source tree instead of the publishable artifact.

### 6. User-first documentation pattern
- **HIGH:** The README should be organized around the user path, not maintainer internals.
- **HIGH:** Recommended section order:
  1. What the package is
  2. Recommended Pi install path
  3. Standard npm install path
  4. Invocation with `/skill:code-reviewer`
  5. Shared smoke test
- **MEDIUM:** If the plain npm path cannot itself make Pi discover the skill, the README must say so directly instead of implying otherwise.

## Don't Hand-Roll

- **HIGH:** Do **not** build a custom extension in Phase 1. Pi packages already support shipping skills directly.
- **HIGH:** Do **not** add a custom CLI/bin purely to satisfy packaging. The product surface is `/skill:code-reviewer`, not a separate command.
- **HIGH:** Do **not** invent a custom skill-discovery mechanism. Use Pi’s documented `skills/` + `pi.skills` package rules.
- **HIGH:** Do **not** rely on model auto-invocation for validation. Document and test the explicit command `/skill:code-reviewer`.
- **HIGH:** Do **not** verify only the repository tree. `npm pack` is the source of truth for what users actually install.
- **HIGH:** Do **not** rely on `.npmignore` as the primary inclusion control when a simple `files` whitelist will do.
- **HIGH:** Do **not** store runtime-critical code or assets in `devDependencies` or untracked local files.
- **HIGH:** Do **not** reference future docs/assets from `SKILL.md` unless those files already exist in the tarball.
- **HIGH:** Do **not** use placeholder dotfiles alone (for example `.gitkeep`) as the only future-ready structure marker. Use real markdown placeholder files that are visible and packable.
- **HIGH:** Do **not** set `disable-model-invocation: true` in Phase 1; it reduces discoverability and adds no value here.

## Common Pitfalls

- **HIGH:** **Package name blocked on npm.** This must be checked early because `D-03` forbids ad hoc fallback naming.
- **HIGH:** **Skill name/frontmatter mismatch.** The directory must be `skills/code-reviewer/` and frontmatter `name` must be `code-reviewer`.
- **HIGH:** **Missing `description` in `SKILL.md`.** Pi does not load skills missing a description.
- **HIGH:** **Forgetting the `pi-package` keyword.** The package still may work, but it loses intended Pi-package discoverability.
- **HIGH:** **Relying only on conventional directories and forgetting the explicit manifest.** Pi can auto-discover, but the plan should favor explicitness for easier verification.
- **HIGH:** **Tarball drops referenced resources.** Any README, reference doc, asset, or script that the skill depends on must survive `npm pack`.
- **HIGH:** **Empty directories disappear from the package.** If Phase 1 wants visible future-ready structure, use placeholder markdown files.
- **HIGH:** **Testing Pi install against the repo directory instead of the packed artifact.** That does not satisfy `D-09`.
- **HIGH:** **Smoke test polluted by existing installed skills.** Pi keeps the first colliding skill name it finds. Run the smoke test in a clean temp project and prefer `pi install -l` there.
- **MEDIUM:** **Assuming plain `npm install -g pi-code-reviewer` automatically makes Pi load the skill.** Official Pi docs do not promise that. Keep `pi install npm:pi-code-reviewer` as the canonical Pi activation path.
- **HIGH:** **Overbuilding the scaffold.** A TypeScript build, extension boilerplate, or complex scripts add risk without helping Phase 1’s success criteria.
- **HIGH:** **README overpromises Phase 2 behavior.** Phase 1 docs should be honest: install/discovery now, full review contract later.
- **HIGH:** **Treating local tarball verification as equivalent to published npm availability.** It proves publish-readiness, not final `DIST-01` completion by itself.

## Verification Targets

- **HIGH:** `package.json` exists and declares the package as a Pi package with `pi.skills`.
- **HIGH:** `README.md` documents both installation paths and the `/skill:code-reviewer` invocation path.
- **HIGH:** `skills/code-reviewer/SKILL.md` loads successfully under Pi’s skill rules.
- **HIGH:** `npm pack` produces a tarball containing every runtime file the skill references.
- **HIGH:** A clean temp project can `pi install -l` from the **unpacked tarball contents** and then load `/skill:code-reviewer`.
- **HIGH:** The smoke test result proves discovery, not just file presence.
- **HIGH:** If the package is not actually published to npm by the end of the phase, the plan must explicitly treat `DIST-01` as still blocked.

## Code Examples

### `package.json`

```json
{
  "name": "pi-code-reviewer",
  "version": "0.1.0",
  "description": "Pi-installable code review skill package.",
  "keywords": ["pi-package", "pi", "skill", "code-review"],
  "license": "MIT",
  "engines": {
    "node": ">=20"
  },
  "files": [
    "skills/",
    "README.md"
  ],
  "pi": {
    "skills": ["./skills"]
  }
}
```

### `skills/code-reviewer/SKILL.md`

````markdown
---
name: code-reviewer
description: Confirms the Pi Code Reviewer package is installed and that the /skill:code-reviewer command resolves correctly in Pi.
---

# Pi Code Reviewer

This Phase 1 skill exists to verify package installation and Pi skill discovery.

If you can load this skill with `/skill:code-reviewer`, the package scaffold and discovery path are working.

The full repository review workflow is added in Phase 2.
````

### Future-ready placeholder docs

```text
skills/
  code-reviewer/
    references/
      README.md   # explains this directory will hold rubric/output docs in Phase 2
    assets/
      README.md   # explains this directory will hold templates/assets in Phase 2
```

### Tarball verification flow

```bash
# 1) Build the publishable artifact
npm pack

# 2) Inspect what will actually ship
TARBALL="$(ls pi-code-reviewer-*.tgz | tail -n 1)"
tar -tzf "$TARBALL" | sort

# 3) Unpack the artifact into a temp location
UNPACK_DIR="$(mktemp -d)"
tar -xzf "$TARBALL" -C "$UNPACK_DIR"

# 4) Create a clean temp project for Pi-local install
TEST_PROJECT="$(mktemp -d)"
cd "$TEST_PROJECT"
pi install -l "$UNPACK_DIR/package"

# 5) Open Pi in the temp project and run:
# /skill:code-reviewer
```

### README command examples

```bash
# Recommended Pi install path
pi install npm:pi-code-reviewer

# Standard npm install path
npm install -g pi-code-reviewer

# Canonical invocation after Pi installation
/skill:code-reviewer
```

## Sources

- `.planning/phases/01-package-foundation/01-CONTEXT.md`
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `.planning/research/STACK.md`
- `.planning/research/ARCHITECTURE.md`
- `.planning/PROJECT.md`
- `../../.nvm/versions/node/v22.13.1/lib/node_modules/@mariozechner/pi-coding-agent/docs/packages.md`
- `../../.nvm/versions/node/v22.13.1/lib/node_modules/@mariozechner/pi-coding-agent/docs/skills.md`
- `../../.nvm/versions/node/v22.13.1/lib/node_modules/@mariozechner/pi-coding-agent/README.md`
- `../../.nvm/versions/node/v22.13.1/lib/node_modules/@mariozechner/pi-coding-agent/examples/extensions/dynamic-resources/SKILL.md`
- `../../.nvm/versions/node/v22.13.1/lib/node_modules/@mariozechner/pi-coding-agent/examples/sdk/04-skills.ts`
