# Output Contract

Formatting rules for review artifacts. Load this document before writing report files.

## REVIEW.md Structure

The report at `.planning/REVIEW.md` must follow this structure.

### Header

```markdown
# Code Review: [repository name]

**Date:** [review date]
**Scope:** Whole repository
```

If a previous `.planning/REVIEW.md` was replaced, add this note directly under the header:

```markdown
> **Note:** This review replaces a previous review that existed at this path.
```

### Category Sections

The report contains exactly five sections in this order:

1. `## Code Quality`
2. `## Refactoring`
3. `## Documentation`
4. `## Security`
5. `## Test Coverage`

Each category section opens with a 1-2 sentence summary assessment, then lists findings grouped by severity.

```markdown
## [Category Name]

[1-2 sentence summary assessment of the category state.]

### High

- **[Finding title]** (`path/to/file.ext:line`)
  [Description of the finding with context and reasoning. Explain what the issue is,
  why it matters, and the likely impact on users or maintainers.]

### Medium

- **[Finding title]** (`path/to/file.ext`)
  [Description]

### Low

- **[Finding title]**
  [Description]
```

Rules:
- Every category must appear even if it has no significant findings.
- For an empty category, write a short summary assessment such as: "No significant documentation issues found. The current docs cover the main contributor and user flows." Then omit the severity sub-sections.
- Omit `### High`, `### Medium`, or `### Low` only when there are no findings at that level.
- Each finding should include a bold title, a file or path reference in backticks when evidence supports it, and a multi-line description with context.
- The tone should be conversational, actionable, and specific rather than mechanical.

### Example Section

```markdown
## Code Quality

The codebase is generally readable, but error handling is inconsistent in a few important paths. Most modules stay focused, though a couple of utility areas would benefit from cleanup.

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
```

## REVIEW-TODO.md Structure

The TODO checklist at `.planning/REVIEW-TODO.md` must follow this structure.

### Header

```markdown
# Code Review TODO

**Generated:** [date]
**Repository:** [repo name]
```

### Category Checklists

Include five sections that match the review categories. Each finding becomes a checkbox item.

```markdown
## Code Quality

- [ ] **[High]** Handle promise rejection in `parseConfig()` (`src/config.ts:42`)
- [ ] **[Medium]** Standardize import styles across `src/utils/*.ts`

## Refactoring

- [ ] **[Medium]** Extract duplicated validation logic into a shared utility

## Documentation

- [ ] **[Low]** Add usage examples to README for CLI commands

## Security

- [ ] **[High]** Remove hardcoded API key from `src/config.ts`

## Test Coverage

- [ ] **[Medium]** Add tests for error paths in `parseConfig()`
```

Rules:
- Every category section must appear even if empty.
- If a category has no action items, write `No action items.` under that heading.
- Prefix each item with its severity in bold using `**[High]**`, `**[Medium]**`, or `**[Low]**`.
- Sort items within each category by severity: High first, then Medium, then Low.
- Include file references in backticks when available.
- The checklist should read like a practical action list that a developer or another agent can execute.
