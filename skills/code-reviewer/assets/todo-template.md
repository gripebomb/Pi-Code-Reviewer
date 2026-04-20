# Review TODO Template

This template provides guidance for the shape of `.planning/REVIEW-TODO.md`. The TODO checklist is an actionable follow-up list derived from the review findings. A developer or another agent should be able to work through these items without re-reading the full review.

## Expected Header Shape

```markdown
# Code Review TODO

**Generated:** [YYYY-MM-DD]
**Repository:** [repo name]
```

## Required Categories

Write these five sections in the same order as the review report:

- `## Code Quality`
- `## Refactoring`
- `## Documentation`
- `## Security`
- `## Test Coverage`

## Per-Item Pattern

Each checklist item should:

1. Start with a Markdown checkbox: `- [ ]`
2. Include a severity badge in bold: `**[High]**`, `**[Medium]**`, or `**[Low]**`
3. Use a brief, actionable title that references the finding
4. Include a file or path reference in backticks when available
5. Be sorted by severity within each category, with High items first

## Example Checklist

```markdown
# Code Review TODO

**Generated:** 2026-04-20
**Repository:** my-project

## Code Quality

- [ ] **[High]** Handle unhandled promise rejection in `parseConfig()` (`src/config.ts:42`)
- [ ] **[Medium]** Standardize import styles across utility modules (`src/utils/*.ts`)
- [ ] **[Medium]** Break down `processRequest()` into smaller functions (`src/handler.ts:15-98`)
- [ ] **[Low]** Remove debug `console.log` from server startup (`src/server.ts:87`)

## Refactoring

- [ ] **[Medium]** Extract duplicated validation logic from `createUser()` and `updateUser()` into shared `validateUserData()` (`src/services/user.ts`)

## Documentation

- [ ] **[Low]** Add usage examples to README for CLI commands

## Security

- [ ] **[High]** Remove hardcoded API key from `src/config.ts` and use environment variable instead

## Test Coverage

- [ ] **[Medium]** Add error-path tests for `parseConfig()` (`tests/config.test.ts`)
- [ ] **[Low]** Add edge-case tests for date utility functions (`tests/utils/date.test.ts`)
```

For categories with no action items, write `No action items.` under the heading — do not omit the section.

Each TODO item should be specific enough to act on without looking up the review report. Include the file path and a brief description of what to do.

The TODO is designed to be used as a literal checklist. When using an agent for follow-up, point it at this file and have it work through items one at a time.
