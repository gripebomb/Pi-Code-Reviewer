# Review Report Template

This template provides guidance for the shape of `.planning/REVIEW.md`. Use it as a reference for formatting — adapt the content based on what you find in the repository. Every review will look different depending on the codebase.

## Expected Header Shape

```markdown
# Code Review: [repository name]

**Date:** [YYYY-MM-DD]
**Scope:** Whole repository
```

```markdown
# Code Review: [repository name]

**Date:** [YYYY-MM-DD]
**Scope:** Changed files — 7 files modified (branch diff against main)
```

```markdown
# Code Review: [repository name]

**Date:** [YYYY-MM-DD]
**Scope:** Changed files — 2 files modified (uncommitted changes)
```

When exactly one file is in scope, still use `**Scope:** Changed files — 1 files modified (uncommitted changes)`.

Use this header only for the documented edge case where no usable default-branch comparison exists and the repo is otherwise clean.

```markdown
# Code Review: [repository name]

**Date:** [YYYY-MM-DD]
**Scope:** Changed files — 3 files modified (last commit)
```

```markdown
# Code Review: [repository name]

**Date:** [YYYY-MM-DD]
**Scope:** Whole repository
> **Note:** Git metadata unavailable — falling back to whole-repo review.
```

Include this note only if a previous .planning/REVIEW.md was overwritten by this run.

```markdown
> **Note:** This review replaces a previous review that existed at this path.
```

## Required Categories

Write these five sections in this order:

- `## Code Quality`
- `## Refactoring`
- `## Documentation`
- `## Security`
- `## Test Coverage`

## Per-Section Pattern

Each category section should:

1. Open with a 1-2 sentence summary assessment.
2. Use severity sub-headers when findings exist: `### High`, `### Medium`, `### Low`.
3. Omit a severity level only if there are no findings at that level.
4. Format each finding with a bold title, a file or path reference in backticks, and a multi-line description with enough context to explain why it matters.

## Example Category Section

```markdown
## Code Quality

The codebase shows generally clean patterns with some inconsistency in error handling and a few functions that have grown beyond their original scope.

### High

- **Unhandled promise rejection in `parseConfig()`** (`src/config.ts:42`)
  The error path isn't handled — if the config file is malformed, the promise rejection
  will crash the process. The `loadConfig()` function calls `parseConfig()` but never
  catches the rejection. Wrap the call in try/catch or add a `.catch()` handler to
  provide a meaningful error message and graceful shutdown.

### Medium

- **Mixed import styles across utility modules** (`src/utils/*.ts`)
  Some files use `import type { ... }` and others use `import { ... }` for type-only
  imports. `string-utils.ts` and `date-utils.ts` use bare imports while `validators.ts`
  uses the `type` keyword. Standardizing on `import type` for type-only imports would
  make intent clearer and prevent accidental runtime side-effects.

- **`processRequest()` exceeds 80 lines** (`src/handler.ts:15-98`)
  The function handles validation, transformation, persistence, and response formatting
  all in one body. Breaking it into `validateRequest()`, `transformPayload()`, and
  `formatResponse()` would make each step testable independently and easier to modify.

### Low

- **Console.log left in production code** (`src/server.ts:87`)
  A debug `console.log` statement appears in the server startup path. Consider removing
  it or replacing it with a proper logger call gated behind a debug flag.
```

For categories with no significant findings, write a positive summary and omit the severity sub-sections. Example: `The project has comprehensive test coverage. Unit and integration tests cover all major modules with meaningful assertions.`

Findings should be conversational and explain why something matters. Don't just state what exists — explain the impact and what could go wrong. Include enough context that someone reading only the report can understand and prioritize the issue.

## Complete Prioritized Report Example

```markdown
# Code Review: my-project

**Date:** 2026-04-20
**Scope:** Whole repository

## Summary

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Code Quality | 1 | 2 | 1 | 4 |
| Refactoring | 0 | 1 | 2 | 3 |
| Documentation | 0 | 0 | 1 | 1 |
| Security | 1 | 0 | 0 | 1 |
| Test Coverage | 0 | 1 | 1 | 2 |
| **Total** | **2** | **4** | **5** | **11** |

## Code Quality

The codebase is generally readable, but error handling is inconsistent in a few important paths.

### High

- **Unhandled promise rejection in `parseConfig()`** (`src/config.ts:42`)
  The error path isn't handled — if the config file is malformed, the promise rejection
  will crash the process. Wrap in try/catch or add a `.catch()` handler.

### Medium

- **Mixed import styles** (`src/utils/*.ts`)
  Some files use `import type { ... }` and others use `import { ... }` for type-only
  imports. Standardizing on `import type` would make intent clearer.

### Low

- **Console.log in production code** (`src/server.ts:87`)
  A debug `console.log` statement appears to be left in the server startup path.
  Consider removing it or gating it behind a debug flag.

## Refactoring

## Documentation

## Security

### High

- **Hardcoded API key in configuration** (`src/config.ts:42`)
  The API key is stored directly in source code. Move to environment variables or a
  secrets manager.

## Test Coverage

## Prioritized Issue Table

| Priority | Category | Finding | Location |
|----------|----------|---------|----------|
| **High** | Code Quality | Unhandled promise rejection | `src/config.ts:42` |
| **High** | Security | Hardcoded API key in config | `src/config.ts:42` |
| **Medium** | Code Quality | Mixed import styles | `src/utils/*.ts` |
| **Medium** | Refactoring | Duplicated validation logic | `src/auth.ts:30`, `src/api.ts:45` |
| **Medium** | Test Coverage | Missing error path tests | `tests/app.test.ts` |
| **Low** | Code Quality | Debug console.log left in code | `src/server.ts:87` |
| **Low** | Refactoring | Unused helper function | `src/helpers.ts:12` |
| **Low** | Documentation | Missing usage examples | `README.md` |
| **Low** | Test Coverage | Brittle assertion pattern | `tests/utils.test.ts:8` |
| **Low** | Test Coverage | Missing edge case coverage | `tests/app.test.ts` |
```
```
