# Category Analysis Guide

Operationalized inspection steps for each of the five review categories. Load this document before evaluating categories in Phase 3. Cross-reference with `references/review-rubric.md` for evaluation criteria and `references/evidence-gathering.md` for the evidence collection process.

## Overview

This guide translates the high-level rubric criteria into concrete, actionable inspection steps. For each category, follow the inspection sequence, look for the specified signals, and record evidence in the defined format.

---

## Code Quality

### Inspection Steps

Follow these steps in order for each relevant file:

1. **Error handling audit** — Scan for unhandled promises, missing try/catch blocks, uncaught exceptions, and error propagation gaps. Check both synchronous and asynchronous code paths.
2. **Complexity scan** — Identify functions with >3 nesting levels, >50 lines, or >5 parameters. Look for deeply nested conditionals and callback pyramids.
3. **Consistency check** — Compare naming conventions, async patterns (callbacks vs promises vs async/await), error styles, and formatting across files.
4. **Dead code detection** — Find unused imports, unreachable branches, stale feature flags, commented-out code, and abandoned helper functions.
5. **Type safety review** — Where the language supports types, check for unsafe casts, `any` types, missing type contracts, and implicit conversions.

### Concrete Signals

Look for these specific patterns:

- **Unhandled promises:** `promise.then(...)` without `.catch()` or `await` without try/catch
- **Deep nesting:** `if` inside `if` inside `for` inside `try` (4+ levels)
- **Long functions:** Functions exceeding 50 lines of logic (excluding comments/whitespace)
- **Inconsistent async:** Mixing `callback(err, result)`, `.then()`, and `async/await` in the same module
- **Unused imports:** Imports at top of file with no references in the code
- **Unsafe types:** `as any`, `@ts-ignore`, `type: ignore`, missing return type annotations
- **Silent failures:** Empty catch blocks, swallowed errors, `catch (e) { /* do nothing */ }`
- **Magic numbers:** Hardcoded numeric literals without named constants

### Evidence Format

Record each observation as:

```markdown
- `path/to/file.ext:line` — [Signal type]: [brief description]
  Context: [1-2 sentences of surrounding context]
  Impact: [why this matters]
```

Example:
```markdown
- `src/config.ts:42` — Unhandled promise: `parseConfig()` returns Promise but caller uses it synchronously
  Context: The `loadApp()` function calls `parseConfig()` without await on line 42, then immediately uses the result
  Impact: If config is malformed, the unhandled rejection will crash the process
```

### Uncertainty Handling

When language features make assessment unclear:

- **Implicit returns:** In languages with implicit returns (Ruby, Rust, some JavaScript patterns), note the pattern and flag if it reduces readability
- **Dynamic typing:** In Python/JavaScript without type hints, note the absence rather than penalizing
- **Language idioms:** What looks like a code smell in one language may be idiomatic in another (e.g., Go's error handling, Rust's `unwrap` in tests)
- **Framework conventions:** Some frameworks encourage patterns that look unusual (React hooks rules, Django managers)

When uncertain, record: `Language/framework convention unclear: [pattern] may be idiomatic or may need review`

---

## Refactoring

### Inspection Steps

1. **Duplication scan** — Look for repeated code blocks (>3 similar lines) across files or within the same file. Check both exact duplication and near-duplication.
2. **Coupling analysis** — Examine import graphs for circular dependencies. Check for modules that import many others or are imported by many others.
3. **Abstraction level review** — Assess whether functions mix responsibilities (parsing + validation + I/O + formatting). Look for functions that do "too much."
4. **Module boundary check** — Verify that responsibilities are separated cleanly. Check for modules reaching across layers or creating hidden dependencies.
5. **Data flow tracing** — Follow how state moves through the system. Look for global mutation, deeply threaded parameters, and hard-to-follow control flow.

### Concrete Signals

- **Duplication:** Same logic in 3+ locations (e.g., input validation, error formatting, API response handling)
- **Circular imports:** Module A imports B, B imports C, C imports A (or direct A↔B)
- **God modules:** Files with >500 lines, >10 exports, or handling >3 unrelated responsibilities
- **Mixed abstraction:** A function that reads from disk, parses JSON, validates schema, and saves to database
- **Global state:** Variables or singletons mutated from multiple locations
- **Feature envy:** Functions that primarily operate on data from another module
- **Primitive obsession:** Using strings/numbers instead of domain types (e.g., passing `userId: string` instead of `User`)
- **Long parameter lists:** Functions with >5 parameters, especially when parameters are often passed together

### Evidence Format

Record each observation as:

```markdown
- [Duplication/Coupling/Abstraction]: `primary-file.ext` (+ `related-file.ext`)
  Pattern: [what is repeated/coupled/mixed]
  Locations: [list of file paths and line ranges]
  Suggestion: [high-level refactoring direction, not detailed rewrite]
```

Example:
```markdown
- Duplication: `src/routes/user.ts` (+ `src/routes/admin.ts`, `src/routes/public.ts`)
  Pattern: Email validation regex and error message repeated in all three route handlers
  Locations: user.ts:23-28, admin.ts:19-24, public.ts:31-36
  Suggestion: Extract into shared validation utility
```

### When NOT to Refactor

Note when the current simple design is appropriate:

- **Single-use code:** A helper used in exactly one place doesn't need extraction
- **Obvious abstraction:** `add(a, b)` is not worth extracting from `calculateTotal()`
- **Temporary code:** Scripts, migrations, or one-off tools that won't evolve
- **Performance-critical paths:** Sometimes duplication is intentional for optimization
- **Learning/exploratory code:** Prototypes and spikes where structure is intentionally fluid

When skipping a potential refactoring, record: `Intentionally simple: [reason] — no action needed`

---

## Documentation

### Inspection Steps

1. **README completeness** — Check for: project description, installation steps, running instructions, usage examples, contribution guidelines, license info
2. **API documentation** — Look for JSDoc, docstrings, type annotations, or generated docs for public functions, classes, and modules
3. **Inline comment review** — Check if non-obvious logic has explanatory comments. Verify comments explain "why" not "what."
4. **Architecture guidance** — Look for docs explaining major pieces, data flow, and important decisions (ARCHITECTURE.md, ADRs, wiki)
5. **Setup and operational docs** — Check for environment variables, build steps, local dev commands, deployment notes, troubleshooting

### Concrete Signals

- **Missing README sections:** No install instructions, no usage examples, no contributing guide
- **Undocumented public APIs:** Exported functions/classes with no docstrings or type annotations
- **Stale comments:** Comments that contradict the code (e.g., "returns string" but function returns Promise)
- **TODO/FIXME without context:** Bare `TODO` with no explanation of what needs doing or why
- **Missing architecture docs:** Non-trivial systems with no explanation of how pieces fit together
- **No error documentation:** Common errors and their solutions not documented
- **Changelog gaps:** No record of breaking changes or migration notes
- **Internal knowledge assumed:** Docs that assume familiarity with internal tools or conventions

### Evidence Format

Record each observation as:

```markdown
- [Missing/Stale/Insufficient]: `path/to/file` — [documentation element]
  Current state: [what exists or doesn't exist]
  Gap: [what's missing and why it matters]
  Priority: [who is blocked: new contributors, API consumers, operators]
```

Example:
```markdown
- Missing: `README.md` — Installation instructions
  Current state: README describes what the project does but has no setup section
  Gap: New contributors don't know how to install dependencies or run the project
  Priority: Blocks all new contributors
```

### Uncertainty Handling

When conventions are obvious to domain experts:

- **Framework conventions:** If the project uses a well-known framework (Express, Django, Rails), some setup may be "standard" and not need explicit documentation
- **Language idioms:** Standard language patterns may not need comments
- **Internal tools:** Documentation for company-specific tools may exist elsewhere

When uncertain, record: `Documentation gap unclear: [element] may be covered by convention or external docs`

---

## Security

### Inspection Steps

1. **Input validation audit** — Check all points where external input enters the system: HTTP requests, file uploads, CLI arguments, environment variables, database reads
2. **Secrets handling** — Search for hardcoded keys, tokens, passwords in source files, config files, and test fixtures
3. **Authentication and authorization** — Verify auth guards exist on protected routes/resources. Check for missing or weak checks
4. **Dependency risk** — Review `package.json`, `requirements.txt`, `Cargo.toml` for outdated or suspicious packages
5. **Error exposure** — Check if errors, stack traces, or logs leak sensitive information (credentials, file paths, internal structure)
6. **Configuration safety** — Review CORS settings, TLS configuration, permission defaults, sandboxing

### Concrete Signals

Look for these dangerous patterns:

- **Hardcoded secrets:** `const API_KEY = "..."`, `password = "admin123"`, tokens in config files
- **Unsafe execution:** `eval()`, `exec()`, `Function()`, `subprocess.call(shell=True)`
- **Raw SQL:** String concatenation or interpolation in SQL queries without parameterization
- **Missing input validation:** Request parameters used directly in file paths, database queries, or system calls
- **Insecure deserialization:** `JSON.parse()` on untrusted input without schema validation, `pickle.loads()` on user data
- **Verbose errors:** Stack traces sent to clients, detailed error messages revealing internal paths
- **Weak crypto:** MD5 or SHA1 for passwords, no salt, custom crypto implementations
- **Missing auth guards:** Admin routes or sensitive endpoints without authentication checks
- **CORS misconfiguration:** `Access-Control-Allow-Origin: *` on authenticated endpoints
- **Dependency red flags:** Packages with known CVEs, very old versions, abandoned projects

### Evidence Format

Record each observation as:

```markdown
- [Severity signal: HIGH/MED/LOW]: `path/to/file.ext:line` — [vulnerability type]
  Pattern: [exact code pattern found]
  Risk: [what could happen]
  Verification: [how to confirm this is a real issue]
```

Example:
```markdown
- HIGH: `src/config.ts:8` — Hardcoded API key
  Pattern: `const API_KEY = "sk-live-abc123..."`
  Risk: Key is committed to repository and visible to anyone with read access
  Verification: Check if this key is active in production; rotate immediately if so
```

### Uncertainty Handling

When security controls are implied but not visible:

- **Middleware not in scope:** Auth may be handled by middleware outside the reviewed files — note the gap
- **Framework defaults:** Some frameworks provide security features by default (CSRF protection, XSS escaping) — verify rather than assume
- **External services:** Secrets may be injected by deployment platform — check for environment variable usage
- **Defense in depth:** A single missing check may be acceptable if other layers provide protection

When uncertain, record: `Security control implied but not visible: [control] may exist in middleware, framework, or infrastructure outside reviewed scope`

---

## Test Coverage

### Inspection Steps

1. **Test existence check** — Count test files vs source files. Identify which modules have tests and which don't.
2. **Framework identification** — Determine test framework (Jest, pytest, Mocha, Vitest, etc.) and configuration
3. **Coverage breadth** — For tested modules, check if tests cover: happy path, error paths, edge cases, boundary conditions
4. **Behavior verification** — Check if tests assert meaningful outcomes or just execute code ("smoke tests")
5. **Edge case and failure mode coverage** — Look for tests of: null input, empty collections, network failures, timeouts, malformed data
6. **CI integration** — Check if tests run automatically in CI (GitHub Actions, etc.)

### Concrete Signals

- **Missing tests:** Critical modules with no corresponding test files
- **Happy path only:** Tests that only check success cases, no error or edge case coverage
- **Brittle tests:** Tests tied to implementation details (exact error messages, internal structure) rather than behavior
- **Weak assertions:** `expect(result).toBeDefined()` instead of `expect(result).toBe(expectedValue)`
- **No error-path tests:** Functions with try/catch but no tests for the catch branch
- **Missing integration tests:** Only unit tests exist for features that need end-to-end verification
- **Flaky patterns:** Tests with timeouts, race conditions, or dependency on external state
- **Test code quality:** Tests that are hard to read, poorly named, or duplicate setup without helpers

### Evidence Format

Record each observation as:

```markdown
- [Gap/Quality/Brittleness]: `test-file.ext` (covers `source-file.ext`)
  Issue: [what's missing or wrong]
  Missing coverage: [specific behaviors not tested]
  Risk: [what could break without detection]
```

Example:
```markdown
- Gap: No test file for `src/security/token.ts`
  Issue: Token generation and validation have no automated tests
  Missing coverage: Token expiration, invalid signature, malformed payload
  Risk: Security-critical code can break silently; regressions won't be caught
```

### Uncertainty Handling

When tests might exist outside reviewed scope:

- **External test suites:** Tests may run in a separate repository or service
- **Generated tests:** Some frameworks generate tests that aren't in the repo (e.g., snapshot tests)
- **Manual testing:** Some projects rely on manual QA — note this as a coverage gap
- **Test configuration:** The test command may exist but tests may not be committed

When uncertain, record: `Test coverage unclear: tests may exist outside reviewed scope in [location if known]`

---

## Cross-Category Relationships

Some findings span multiple categories. When you observe these relationships, cross-reference them in the evidence map:

| Relationship | Example |
|-------------|---------|
| Security → Test Coverage | Missing tests for authentication logic |
| Code Quality → Refactoring | Complex error handling duplicated across files |
| Documentation → Security | Undocumented security assumptions in API |
| Refactoring → Test Coverage | Hard-to-test code suggests abstraction needed |
| Code Quality → Documentation | Complex logic lacks explanatory comments |

When cross-category relationships exist, record in both categories and link them:
```markdown
- `src/auth.ts:45` — Complex token validation (Code Quality)
  See also: Refactoring — duplicated in `src/admin.ts:23`
  See also: Test Coverage — no tests for error paths
```

## Evaluation Order

Evaluate categories in this order to build on previous observations:

1. **Code Quality** — Establishes baseline understanding of the codebase
2. **Refactoring** — Builds on code quality observations to identify structural issues
3. **Documentation** — Can be evaluated alongside code reading; note gaps as you go
4. **Security** — Requires understanding of data flow and input paths from previous categories
5. **Test Coverage** — Evaluated last because it depends on knowing what's important from the other categories

## Quality Checks

Before leaving Phase 3, verify:

- [ ] Each category has been evaluated using the inspection steps above
- [ ] Concrete signals have been checked, not just general impressions
- [ ] Evidence is recorded in the specified format
- [ ] Uncertainty is explicitly noted, not hidden
- [ ] Cross-category relationships are linked
- [ ] At least one observation exists per category (or an explicit "no findings" note)
