# Review Report Template

This template provides guidance for the shape of `.planning/REVIEW.md`. Use it as a reference for formatting — adapt the content based on what you find in the repository. Every review will look different depending on the codebase.

## Expected Header Shape

```markdown
# Code Review: [repository name]

**Date:** [YYYY-MM-DD]
**Scope:** Whole repository

> **Note:** This review replaces a previous review that existed at this path.
```

Include this note only if a previous `.planning/REVIEW.md` was overwritten by this run.

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
