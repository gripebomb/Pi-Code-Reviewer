# Evidence Gathering Guide

How to gather and organize evidence during Phase 2 of the code review workflow. Load this document before starting evidence collection.

## Overview

Evidence gathering is a two-pass process: **breadth-first exploration** to understand the repository landscape, followed by **depth-first analysis** of files that appear risky, central, or under-documented. The goal is to build a comprehensive evidence map that covers all five review categories before synthesizing findings.

## File Read Order (Breadth-First)

Read files in this order to build a complete picture of the repository:

### 1. Root Directory and Key Config Files

Start with the repository root to understand the project structure:

- List the root directory (`ls` or equivalent)
- Read key configuration files that reveal the technology stack:
  - `package.json` — Node.js dependencies, scripts, metadata
  - `tsconfig.json` — TypeScript configuration and module structure
  - `pyproject.toml`, `setup.py`, `requirements.txt` — Python project info
  - `Cargo.toml` — Rust project structure
  - `go.mod` — Go module dependencies
  - `Makefile`, `justfile` — Build and task automation
  - `Dockerfile`, `docker-compose.yml` — Containerization setup
  - `.github/workflows/*.yml` — CI/CD configuration
  - `.gitignore` — What the project considers generated or sensitive

**What to record:** Technology stack, primary language, framework, build system, dependency count and maturity, CI presence.

### 2. Entry Points

Read the main entry points to understand the application architecture:

- `main`, `index`, `app`, `server` files (with appropriate extensions)
- CLI entry points (`bin/`, `cmd/`, or `__main__` blocks)
- Library exports (`__init__.py`, `index.ts`, `lib.rs`)
- Configuration loading and initialization code

**What to record:** Application type (CLI, web service, library), initialization patterns, dependency injection approach, global state setup.

### 3. Test Infrastructure

Identify and sample test files to understand testing practices:

- Locate test directories: `tests/`, `test/`, `__tests__/`, `spec/`, `*.test.*`, `*.spec.*`
- Read 1-2 representative test files (one unit test, one integration test if available)
- Check for test configuration: `jest.config.js`, `pytest.ini`, `vitest.config.ts`
- Look for CI test commands in config files

**What to record:** Test framework, test organization, assertion patterns, coverage tools, mock usage, test naming conventions.

### 4. Documentation Files

Read available documentation to understand intent vs. reality:

- `README.md` — Project overview, setup, usage
- `CONTRIBUTING.md` — Contributor guidelines
- `CHANGELOG.md` or release notes
- `docs/` directory contents
- Inline documentation generators (`typedoc`, `sphinx`, `rustdoc`)

**What to record:** Documentation completeness, accuracy vs. code reality, setup clarity, API documentation presence.

### 5. Technology Stack and Conventions

Based on the above, document:

- Primary language(s) and versions
- Framework(s) and major libraries
- Code style conventions (linting rules, formatter config)
- Module organization pattern (monorepo, layered, feature-based)
- State management approach

## Depth-First Triggers

After the breadth-first pass, go deeper into files that match these criteria:

### Complexity Signals

- Files with >50 lines of non-trivial logic
- Functions with >3 nesting levels (if visible from initial scan)
- Classes/modules with >5 public methods
- Files with high cyclomatic complexity (many branches, loops, error paths)

### Security-Sensitive Operations

- Files handling authentication or authorization
- Input validation and sanitization code
- File system access (read/write/delete operations)
- Network requests and external API calls
- Database queries and ORM usage
- Command execution (`eval`, `exec`, `subprocess`)
- Template rendering and HTML generation

### Error Handling Paths

- Files with try/catch or equivalent error handling
- Promise chains without `.catch()` or `await` without try/catch
- Error logging and reporting code
- Recovery and retry logic

### Central Modules

- Files imported by many other modules (high fan-out)
- Utility libraries used across the codebase
- Configuration management files
- Data models and schemas
- API route definitions

### Maintenance Signals

- Files with TODO, FIXME, HACK, XXX comments
- Deprecated function usage
- Large commented-out code blocks
- Files with frequent git history changes (if visible)

## Evidence Types to Collect

For each file read, collect evidence across these dimensions:

### Structural Evidence

- **File organization:** Directory structure, module boundaries, separation of concerns
- **Import patterns:** Circular dependencies, deep import chains, unused imports
- **Module size:** Lines of code, number of exports, cohesion
- **Naming conventions:** Consistency, clarity, domain alignment

**Record as:** `src/utils/helpers.ts` — 3 unused imports (`fs`, `path`, `lodash`); mixed naming (camelCase vs snake_case)

### Behavioral Evidence

- **Error handling:** Try/catch coverage, error propagation, recovery strategies
- **Edge cases:** Null checks, boundary conditions, malformed input handling
- **State management:** Global state, mutation patterns, concurrency handling
- **Async patterns:** Promise usage, callback nesting, async/await consistency

**Record as:** `src/api/users.ts:45` — `getUser()` has no error handler for database timeout; returns unhandled promise

### Qualitative Evidence

- **Naming quality:** Do names communicate intent? Are they consistent?
- **Comment usefulness:** Do comments explain why, not what? Are they stale?
- **Complexity signals:** Deep nesting, long functions, large parameter lists
- **Code duplication:** Similar blocks across files, copy-paste patterns

**Record as:** `src/services/auth.ts` — Function `validateTokenAndRefreshIfNeeded()` is 87 lines with 4 nesting levels; name is descriptive but too long

### Configurational Evidence

- **Security settings:** CORS configuration, TLS settings, permission defaults
- **Build configs:** Optimization flags, source maps, bundle analysis
- **Dependency versions:** Outdated packages, known vulnerable versions
- **Environment handling:** `.env` usage, secret management, configuration validation

**Record as:** `package.json` — `lodash@4.17.15` (known CVE-2020-8203); no `engines` field specified

### Test-Related Evidence

- **Test existence:** Which modules have tests, which don't
- **Coverage patterns:** Happy path vs error path coverage
- **Assertion quality:** Specific assertions vs generic "not null" checks
- **Test organization:** Parallel to source, separate directory, co-located

**Record as:** `tests/` — Only 3 test files for 12 source modules; no tests for `src/security/` directory

## Sufficiency Criteria

Stop gathering evidence when ALL of the following are true:

1. **All entry points have been read** — You understand how the application starts and initializes
2. **At least one test file examined** (if tests exist) — You understand the testing approach
3. **Security-sensitive files identified and read** — You've inspected auth, input handling, and file access code
4. **Key config files read** — You know the tech stack, dependencies, and build process
5. **Evidence map covers all 5 categories** — You have at least one observation for each of: Code Quality, Refactoring, Documentation, Security, Test Coverage

### When to Expand Beyond Sufficiency

Continue gathering only if:
- A category has no observations yet (keep looking)
- A file shows significant issues that need more context
- Cross-file patterns are emerging (duplication, inconsistency)
- The repository is very small (<5 source files) — read everything

### When to Stop Early

You may stop before full depth if:
- Context window is approaching limits (prioritize breadth over depth)
- The repository is a well-known pattern (standard framework scaffold)
- Evidence is already overwhelming (focus on synthesis)

## Evidence Map Format

Organize collected evidence using this structure:

```markdown
## Evidence Map

### Category: Code Quality
- `src/config.ts:23-45` — Complex nested conditionals in `parseConfig()` (4 levels deep)
- `src/utils/api.ts` — Mixed async patterns: callbacks in `fetchData()`, promises in `postData()`
- `src/models/user.ts:12` — Unused import `crypto`

### Category: Refactoring
- `src/validation/` — Same email regex in `user.ts`, `signup.ts`, and `admin.ts`
- `src/services/` — 3 services import each other circularly (auth → user → auth)

### Category: Documentation
- `README.md` — Missing "Contributing" section, no API examples
- `src/services/auth.ts:34` — Comment says "TODO: add refresh logic" (stale?)

### Category: Security
- `src/config.ts:8` — Hardcoded API key: `const API_KEY = "sk-live-..."`
- `src/routes/upload.ts:15` — No file type validation before saving

### Category: Test Coverage
- `tests/auth.test.ts` — Only tests happy path; no error cases
- `src/security/` — No test files for any module in this directory
```

### Evidence Map Rules

1. **Category-tagged observations:** Every observation belongs to one of the five categories
2. **File-path-indexed notes:** Include line numbers when available (`file.ts:line`)
3. **Severity signals:** Tag with preliminary severity when obvious:
   - `[HIGH-SIGNAL]` — Clear security issue, unhandled error in critical path
   - `[MED-SIGNAL]` — Inconsistency, missing test, moderate complexity
   - `[LOW-SIGNAL]` — Style issue, unused import, minor documentation gap
4. **Cross-references:** Link related observations:
   - "See also: Security observation about `upload.ts` for related input validation gap"

### Example Evidence Map Entry

```markdown
### Category: Security
- `src/routes/upload.ts:15-22` — File upload handler saves to disk without validating file type or size. 
  [HIGH-SIGNAL] Could allow executable uploads.
  Cross-ref: See Documentation gap — upload endpoint is not documented in README.
  Cross-ref: See Test Coverage — no tests for upload error paths (malformed files, oversized uploads).
```

## Integration with Scope Detection

Respect `candidate_paths` from `references/scope-detection.md`:

- In **changed-files mode**, start with the changed files as your primary evidence targets
- Expand outside `candidate_paths` only for minimal surrounding context needed to explain a finding
- In **whole-repo mode**, follow the full breadth-first order above
- Never treat deleted files as evidence targets (they are excluded from `candidate_paths`)

## Quality Checks

Before leaving Phase 2, verify:

- [ ] At least one observation exists for each of the 5 categories (or an explicit evidence gap is noted)
- [ ] Every observation includes a file path reference
- [ ] Security-sensitive files have been inspected
- [ ] The evidence map would enable a stranger to understand the key issues
- [ ] No finding has been synthesized yet (Phase 3 handles that)

## Common Pitfalls

1. **Reading too deep too early** — Don't analyze a single file for 20 minutes before seeing the big picture
2. **Skipping config files** — `package.json` and similar reveal more than many source files
3. **Ignoring test files** — Tests reveal intended behavior and show what's considered important
4. **Forgetting documentation** — README gaps are findings too
5. **Collecting without organizing** — Build the evidence map as you go, not at the end
