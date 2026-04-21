---
phase: 05-actionable-outputs-&-release-readiness
plan: 04
subsystem: packaging
tags: [npm, cli, publish, verification, bin, npmignore]

# Dependency graph
requires:
  - phase: 05-02
    provides: "Package metadata with keywords, engines, pi.skills"
  - phase: 05-03
    provides: "Fixture outputs, review templates, skill structure"
provides:
  - "CLI wrapper for pi-code-reviewer command"
  - "npm bin entry in package.json"
  - ".npmignore excluding test fixtures and scripts"
  - "Automated publish-and-verify pipeline script"
affects:
  - "npm registry publication"
  - "Consumer install experience"
  - "Pi skill discovery"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Executable Node.js CLI wrapper with --help/--version/default modes"
    - "npm pack dry-run verification before publish"
    - "Post-publish temp-directory install verification"

key-files:
  created:
    - bin/pi-code-reviewer.js
    - scripts/publish-and-verify.mjs
    - .npmignore
  modified:
    - package.json

key-decisions:
  - "CLI wrapper is a thin usage guide, not a full review engine — the skill logic lives in SKILL.md"
  - "npm publish uses --access public for scoped package safety"
  - ".npmignore excludes test fixtures, scripts, and planning artifacts to keep package lean"

patterns-established:
  - "CLI wrapper pattern: Node.js executable with --help, --version, default message"
  - "Publish pipeline pattern: validate → version-check → pack-dry-run → publish → post-verify → cleanup"
  - "npmignore pattern: exclude test/, scripts/, .planning/, .git/ from published package"

requirements-completed: [DIST-01, D-08, D-09, D-10, D-12]

# Metrics
duration: 6min
completed: 2026-04-21
---

# Phase 5 Plan 4: npm Publication and CLI Support Summary

**CLI wrapper with --help/--version, npm bin entry, .npmignore exclusions, and automated publish-and-verify pipeline**

## Performance

- **Duration:** 6 min
- **Started:** 2026-04-21T02:12:36Z
- **Completed:** 2026-04-21T02:18:36Z
- **Tasks:** 2 completed (Task 3 paused at checkpoint)
- **Files modified:** 4

## Accomplishments
- Created executable CLI wrapper (`bin/pi-code-reviewer.js`) with `--help`, `--version`, and default invocation
- Updated `package.json` with `bin` entry and included `bin/` in `files` array
- Created `.npmignore` to exclude `test/`, `scripts/`, `.planning/`, `.git/` from npm package
- Built `scripts/publish-and-verify.mjs` automating the full validation → pack → publish → verify pipeline
- Pipeline validates release-readiness, checks git cleanliness, verifies version uniqueness, dry-runs pack, publishes, and verifies install from registry

## Task Commits

Each task was committed atomically:

1. **Task 1: Add CLI wrapper and bin entry** - `f65877e` (feat)
2. **Task 2: Create publish and verification script** - `8f8d532` (feat)

## Files Created/Modified

- `bin/pi-code-reviewer.js` — Executable CLI wrapper handling `--help`, `--version`, and default usage message
- `package.json` — Added `bin` entry mapping `pi-code-reviewer` to `./bin/pi-code-reviewer.js`; included `bin/` in `files` array
- `.npmignore` — Excludes `test/`, `scripts/`, `.planning/`, `.git/`, `.gitignore` from npm package
- `scripts/publish-and-verify.mjs` — Full publish pipeline: validate → version-check → pack-dry-run → publish → post-verify → cleanup

## Decisions Made

- **CLI wrapper is usage-guide only**: The wrapper prints Pi skill installation/invocation instructions rather than implementing review logic, which lives in `SKILL.md`. This keeps the CLI lightweight and the skill the canonical review engine.
- **npm publish uses `--access public`**: Ensures the package is publicly accessible even if the scope might suggest otherwise.
- **.npmignore over `files` array for exclusions**: While `files` array is whitelist-based, `.npmignore` provides explicit exclusion intent for test fixtures and planning artifacts, making the packaging policy clear.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed JSON syntax check false positive**
- **Found during:** Task 1 verification
- **Issue:** `node --check package.json` failed with SyntaxError because `--check` validates JavaScript syntax, not JSON syntax
- **Fix:** Switched verification to `node -e "JSON.parse(...)"` which correctly validates JSON
- **Files modified:** None (verification command only)
- **Verification:** JSON.parse succeeded, package.json is valid
- **Committed in:** N/A (verification step, not code change)

---

**Total deviations:** 1 auto-fixed (1 bug in verification approach)
**Impact on plan:** No impact on deliverables. Package.json was always valid; only the verification command was wrong.

## Issues Encountered

- `node --check package.json` is not the right tool for JSON validation — it validates JavaScript module syntax. Used `JSON.parse()` instead.

## Known Stubs

None — all implemented files are fully functional with no placeholder data.

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| T-05-06 | scripts/publish-and-verify.mjs | Git cleanliness check before publish prevents tampered/uncommitted code from reaching registry |
| T-05-07 | .npmignore | Explicitly excludes test fixtures, scripts, and planning artifacts from published package |
| T-05-08 | scripts/publish-and-verify.mjs | All steps logged; failures abort before publish; structured output for audit trail |

## Auth Gates

- **Task 3 (checkpoint)**: npm publish requires `npm login`. The publish script will fail at Step 4 if the user is not authenticated. Run `npm login` before executing `node scripts/publish-and-verify.mjs`.

## Next Phase Readiness

- All automation is in place for npm publication
- Awaiting human verification of actual publish and registry install
- Once approved, the package will be live on npm and installable via `npm install pi-code-reviewer`

---
*Phase: 05-actionable-outputs-&-release-readiness*
*Plan: 04*
*Completed: 2026-04-21*
