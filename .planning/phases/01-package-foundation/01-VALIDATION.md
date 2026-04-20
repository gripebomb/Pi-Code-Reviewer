---
phase: 1
slug: package-foundation
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-20
updated: 2026-04-20
---

# Phase 1 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
| ---------------------- | --------------------------------------------------- |
| **Framework** | other - npm scripts plus shell/Node validators |
| **Config file** | `package.json` scripts |
| **Quick run command** | `npm run validate:metadata && npm run validate:docs` |
| **Full suite command** | `npm run validate:phase-01` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** `npm run validate:metadata && npm run validate:docs`
- **After every plan wave:** `npm run validate:phase-01`
- **Before phase verification:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
| --------- | ---- | ---- | ----------- | --------- | ----------------- | ----------- | --------- |
| `01-01-01` | 01 | 1 | DIST-01 | metadata/package structure | `npm run validate:metadata` | ✅ | ✅ green |
| `01-02-01` | 02 | 2 | DIST-03 | docs contract | `npm run validate:docs` | ✅ | ✅ green |
| `01-03-01` | 03 | 3 | DIST-01 | packed artifact + local Pi install | `npm run validate:phase-01` | ✅ | ✅ green |
| `01-03-02` | 03 | 3 | DIST-02 | local discovery smoke handoff | `npm run validate:phase-01` + recorded `testProject` reuse from `01-VALIDATION-RUN.json` | ✅ | ✅ ready |
| `01-04-01` | 04 | 4 | DIST-01 / DIST-02 | registry publish + registry install | registry commands recorded below after publish | ⚠ pending | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠ blocked*

---

## Wave 0 Requirements

- [x] `package.json` — includes `validate:metadata`, `validate:docs`, and `validate:phase-01` scripts
- [x] `README.md` — includes both install paths and `/skill:code-reviewer` invocation instructions
- [x] `skills/code-reviewer/SKILL.md` — valid skill frontmatter with `name: code-reviewer` and `description:`
- [x] `skills/code-reviewer/references/README.md` — packable placeholder for Phase 2 docs
- [x] `skills/code-reviewer/assets/README.md` — packable placeholder for Phase 2 assets
- [x] `scripts/validate-metadata.mjs` — exact manifest and marker checks
- [x] `scripts/validate-docs.mjs` — exact README and INSTALL contract checks
- [x] `scripts/validate-phase-01.mjs` — tarball inspection, temp `pi install -l`, and validation handoff generation
- [x] `.planning/phases/01-package-foundation/01-VALIDATION-RUN.json` — preserved handoff for local smoke reuse

---

## Automated Validation Commands

### Quick contract checks

```bash
npm run validate:metadata && npm run validate:docs
```

These scripts verify the exact Phase 1 manifest, skill marker, README commands, INSTALL reference commands, and the marker-based pass condition.

### Full local artifact validation

```bash
npm run validate:phase-01
```

This command must:

1. Run `npm run validate:metadata`
2. Run `npm run validate:docs`
3. Build the tarball with `npm pack --silent`
4. Verify the tarball contains the runtime file set:
   - `package/package.json`
   - `package/README.md`
   - `package/skills/code-reviewer/SKILL.md`
   - `package/skills/code-reviewer/references/README.md`
   - `package/skills/code-reviewer/references/INSTALL.md`
   - `package/skills/code-reviewer/assets/README.md`
5. Unpack the tarball into a temp directory
6. Create a clean temp project
7. Run `pi install -l` against the unpacked `package/` directory
8. Fail unless `.pi/settings.json` exists in that temp project and records the unpacked package path
9. Write `.planning/phases/01-package-foundation/01-VALIDATION-RUN.json` with `tarball`, `unpackDir`, `packageDir`, `testProject`, `packageName`, and `expectedMarker`

---

## Local Discovery Smoke Command Sequence

Run the full artifact validator first:

```bash
npm run validate:phase-01
```

Recover the validated temp project from the handoff artifact:

```bash
TEST_PROJECT="$(node -p "JSON.parse(require('node:fs').readFileSync('.planning/phases/01-package-foundation/01-VALIDATION-RUN.json','utf8')).testProject")"
PACKAGE_DIR="$(node -p "JSON.parse(require('node:fs').readFileSync('.planning/phases/01-package-foundation/01-VALIDATION-RUN.json','utf8')).packageDir")"
```

Create the marker-check prompt inside that exact temp project:

```bash
cat > "$TEST_PROJECT/.phase-01-smoke-prompt.txt" <<'EOF'
/skill:code-reviewer
Reply with the exact Phase 1 package marker and package name from the active skill instructions.
EOF
```

Run the smoke command from the validated install context:

```bash
(cd "$TEST_PROJECT" && pi --no-session -p "$(cat "$TEST_PROJECT/.phase-01-smoke-prompt.txt")")
```

**Success requires output containing both:**

- `PHASE_1_PACKAGE_MARKER: pi-code-reviewer`
- `pi-code-reviewer`

If Pi resolves some `code-reviewer` skill but the marker is missing, the smoke test fails. Generic skill resolution without the marker is not a pass.

If headless Pi cannot run because provider/auth is unavailable, use the same `TEST_PROJECT` for the documented interactive fallback and record the exact blocker instead of claiming success.

---

## Latest local smoke result

- **Validator command:** `npm run validate:phase-01`
- **Recovered test project:** `/var/folders/cl/f_zzvq0n4l7gj362k9dgpcmc0000gn/T/pi-code-reviewer-test-project-2n6dMH`
- **Recovered package directory:** `/var/folders/cl/f_zzvq0n4l7gj362k9dgpcmc0000gn/T/pi-code-reviewer-unpack-UyGGe7/package`
- **Prompt file:** `$TEST_PROJECT/.phase-01-smoke-prompt.txt`

Exact smoke command used:

```bash
(cd "$TEST_PROJECT" && pi --no-session -p "$(cat "$TEST_PROJECT/.phase-01-smoke-prompt.txt")")
```

Observed result:

```text
PHASE_1_PACKAGE_MARKER: pi-code-reviewer
Package name: pi-code-reviewer
```

Result: **PASS** — output contained both `PHASE_1_PACKAGE_MARKER: pi-code-reviewer` and `pi-code-reviewer`, so the validated local `pi install -l` flow resolved this package's shipped skill.

---

## Registry Validation (Plan 01-04)

Real npm-registry completion remains pending until Plan `01-04` publishes the `package.json` version and verifies both install paths against the registry.

Required registry evidence:

1. `npm view "pi-code-reviewer@$VERSION" version`
2. `npm install --prefix "$REGISTRY_NPM_TMP" "pi-code-reviewer@$VERSION"`
3. `(cd "$REGISTRY_PI_PROJECT" && pi install -l "npm:pi-code-reviewer@$VERSION")`
4. `.pi/settings.json` in that temp project records `npm:pi-code-reviewer@$VERSION`
5. Registry smoke output contains `PHASE_1_PACKAGE_MARKER: pi-code-reviewer` and `pi-code-reviewer`, or an explicit Pi auth/provider blocker is recorded

---

## Validation Sign-Off

- [x] All Phase 1 tasks have automated verification or an explicit auth-gated smoke fallback
- [x] Sampling continuity maintained with quick checks and one full suite command
- [x] Wave 0 covers the shipped scaffold, docs, validators, and handoff artifact
- [x] No watch-mode validation required
- [x] Feedback latency target remains under 30 seconds
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending final local smoke record and registry verification
