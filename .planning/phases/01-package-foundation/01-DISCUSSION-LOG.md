# Phase 1: Package Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-04-20T03:18:30Z
**Phase:** 1-package-foundation
**Areas discussed:** Publish identity, Package structure, Installation docs path, Proof of installability, Package-name fallback

---

## Publish identity

| Option | Description | Selected |
| ---------- | ---------------------------------- | -------- |
| Unscoped package | `pi-code-reviewer`; simplest public install/docs path if available | ✓ |
| Scoped package | `@scope/pi-code-reviewer`; stronger ownership branding but noisier docs | |
| Temporary dev name now, rename later | Move fast now and rename later | |

**User's choice:** Unscoped package, ideally `pi-code-reviewer`
**Notes:** User wants a public unscoped canonical identity, not a temporary placeholder.

---

## Package structure

| Option | Description | Selected |
| ---------- | ---------------------------------- | -------- |
| Minimal skill package | `package.json` + `README.md` + `skills/code-reviewer/SKILL.md` only | |
| Skill-first, future-ready package | Installable now, but laid out so references/assets/tests can be added naturally later | ✓ |
| Manifest-heavy multi-resource package now | Pre-create broader package resource directories immediately | |

**User's choice:** Skill-first, future-ready package
**Notes:** User prefers avoiding a later repo reorganization while keeping Phase 1 focused.

---

## Installation docs path

| Option | Description | Selected |
| ---------- | ---------------------------------- | -------- |
| Pi-first docs | Lead with `pi install`, npm as secondary | |
| Dual-path docs | Document both npm install and `pi install`, then share one smoke test path | ✓ |
| Developer-first docs | Center local clone/pack/manual verification flows | |

**User's choice:** Dual-path docs
**Notes:** Documentation should clearly support both normal npm users and Pi package installation users.

---

## Proof of installability

| Option | Description | Selected |
| ---------- | ---------------------------------- | -------- |
| Files exist in repo | Scaffold and docs only | |
| Packed artifact verified | Run `npm pack` and inspect tarball contents | |
| Packed artifact + local install/discovery smoke test | Verify tarball contents and confirm Pi discovers installed skill | ✓ |

**User's choice:** Packed artifact + local install/discovery smoke test
**Notes:** The user wants real packaging/discovery proof, not just a source-tree scaffold.

---

## Package-name fallback

| Option | Description | Selected |
| ---------- | ---------------------------------- | -------- |
| Closest unscoped fallback | Keep unscoped naming if the preferred name is unavailable | |
| Scoped fallback | Use `@scope/pi-code-reviewer` if the unscoped name is taken | |
| Stop and rename deliberately | Pause and choose a new canonical name intentionally | ✓ |

**User's choice:** Stop and rename deliberately
**Notes:** If `pi-code-reviewer` is unavailable, do not improvise fallback branding during implementation.

---

## the agent's Discretion

- Exact placeholder resource files and README wording
- Exact smoke-test command sequence

## Deferred Ideas

None
