---
phase: 1
slug: package-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-20
---

# Phase 1 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
| ---------------------- | --------------------------------------------------- |
| **Framework** | other - npm scripts plus shell/Node validators |
| **Config file** | `package.json` scripts (none yet - Wave 0 installs) |
| **Quick run command** | `npm run validate:metadata && npm run validate:docs` |
| **Full suite command** | `npm run validate:phase-01` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run validate:metadata && npm run validate:docs`
- **After every plan wave:** Run `npm run validate:phase-01`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
| --------- | ---- | ---- | ----------- | --------- | ----------------- | ----------- | --------- |
| `01-01-01` | 01 | 1 | DIST-01 | metadata/package structure | `test -f package.json && grep -F '"name": "pi-code-reviewer"' package.json && grep -F '"pi-package"' package.json && grep -F '"skills": ["./skills"]' package.json && test -f skills/code-reviewer/SKILL.md && test -f skills/code-reviewer/references/README.md && test -f skills/code-reviewer/assets/README.md` | ❌ W0 | ⬜ pending |
| `01-02-01` | 02 | 1 | DIST-03 | docs contract | `test -f README.md && grep -F 'pi install npm:pi-code-reviewer' README.md && grep -F 'npm install -g pi-code-reviewer' README.md && grep -F '/skill:code-reviewer' README.md` | ❌ W0 | ⬜ pending |
| `01-03-01` | 03 | 2 | DIST-01 | packed artifact | `TARBALL="$(npm pack --silent)" && tar -tzf "$TARBALL" | grep -E '^package/(package\.json|README\.md|skills/code-reviewer/SKILL\.md|skills/code-reviewer/references/README\.md|skills/code-reviewer/assets/README\.md)$'` | ❌ W0 | ⬜ pending |
| `01-03-02` | 03 | 2 | DIST-02 | local Pi install | `TARBALL="$(npm pack --silent)" && UNPACK_DIR="$(mktemp -d)" && tar -xzf "$TARBALL" -C "$UNPACK_DIR" && TEST_PROJECT="$(mktemp -d)" && (cd "$TEST_PROJECT" && pi install -l "$UNPACK_DIR/package" && test -f .pi/settings.json && grep -F "$UNPACK_DIR/package" .pi/settings.json >/dev/null)` | ❌ W0 | ⬜ pending |
| `01-03-03` | 03 | 2 | DIST-02 | Pi discovery smoke (auth-gated) | `MISSING — Wave 0/manual smoke for '/skill:code-reviewer' after local Pi auth` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `package.json` — add `validate:metadata`, `validate:docs`, and `validate:phase-01` scripts
- [ ] `README.md` — include both install paths and `/skill:code-reviewer` invocation instructions
- [ ] `skills/code-reviewer/SKILL.md` — valid skill frontmatter with `name: code-reviewer` and `description:`
- [ ] `skills/code-reviewer/references/README.md` — packable placeholder for Phase 2 docs
- [ ] `skills/code-reviewer/assets/README.md` — packable placeholder for Phase 2 assets
- [ ] `scripts/validate-phase-01.mjs` or equivalent npm-script-safe validator — orchestrates tarball inspection and temp `pi install -l` flow
- [ ] Manual/authenticated Pi smoke path for `/skill:code-reviewer` in a clean temp project

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
| ---------- | ----------- | ---------- | ----------------- |
| `/skill:code-reviewer` visibly resolves after local install | DIST-02 | Pi invocation depends on configured local auth/provider state and is not guaranteed to be headless-safe in every environment | In a clean temp project created from the unpacked tarball install, run `pi` and enter `/skill:code-reviewer`, or run `pi --no-session -p "/skill:code-reviewer"` if local auth is configured. Confirm the Phase 1 confirmation text appears instead of a missing-skill error. |
| Install from the real npm registry package | DIST-01 | Cannot be completed until the package is actually published and the final package name is confirmed available | After publish, run `TMP="$(mktemp -d)" && npm install --prefix "$TMP" pi-code-reviewer` and confirm `SKILL.md` and placeholder docs exist under `$TMP/node_modules/pi-code-reviewer/skills/code-reviewer/`. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
