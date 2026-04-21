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

```markdown
# Code Review: [repository name]

**Date:** [review date]
**Scope:** Changed files — [N] files modified ([diff source])
```

```markdown
# Code Review: [repository name]

**Date:** [review date]
**Scope:** Whole repository
> **Note:** Git metadata unavailable — falling back to whole-repo review.
```

- File count is based on the final filtered readable candidate-path set, not the raw diff output.
- Deleted files are excluded from the count and must not be treated as reviewable evidence targets.
- Use one of these diff-source values only: branch diff against <default branch>, uncommitted changes, last commit.
- Use the literal phrase `files modified` for changed-files headers even when the count is 1.
- A clean repo with a usable default-branch comparison must render `**Scope:** Whole repository` and must not fall through to `last commit`.
- Use `last commit` only for the documented edge case where no usable default-branch comparison exists and the repo is otherwise clean.
- Keep the fallback note on its own blockquote line; do not append it to the Scope line.

If a previous `.planning/REVIEW.md` was replaced, add this note directly under the header:

```markdown
> **Note:** This review replaces a previous review that existed at this path.
```

## Path Reference Requirements

Every finding MUST include a concrete file or path reference. This is required for actionable output.

### Required Format

- **With line number**: `path/to/file.ext:42`
- **Without line number**: `path/to/file.ext`
- **Directory wildcard**: `src/utils/*.ts` (for systemic issues across multiple files)
- **Scope description**: "across all route handlers" (only when truly unlocatable)

### Rules

1. Include line numbers when the specific line is visible in the evidence
2. Use directory wildcards for issues that appear in multiple files with the same pattern
3. Never omit path entirely unless the issue is truly systemic and cannot be localized
4. Use backticks for all path references
5. Verify that referenced paths exist in the reviewed scope

### Examples

**Good**:
- `src/config.ts:42` — specific line with the issue
- `src/utils/*.ts` — pattern repeated across multiple utility files
- `tests/` — missing tests for the entire test directory

**Bad**:
- "the config file" — not specific enough
- "some utility files" — no path reference
- Missing path entirely — not actionable

### Summary Section

Immediately after the header, include a summary table showing total findings per category and severity.

```markdown
## Summary

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Code Quality | 1 | 2 | 1 | 4 |
| Refactoring | 0 | 1 | 2 | 3 |
| Documentation | 0 | 0 | 1 | 1 |
| Security | 1 | 0 | 0 | 1 |
| Test Coverage | 0 | 1 | 1 | 2 |
| **Total** | **2** | **4** | **5** | **11** |
```

Rules:
- Include this section in every review, even if all counts are zero.
- Use bold for the Total row.
- Categories must appear in the standard order: Code Quality, Refactoring, Documentation, Security, Test Coverage.
- If a category has no findings, show `0` in each severity column.

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
- The Summary section must appear immediately after the header, before any category section.
- Category sections must maintain the standard order: Code Quality, Refactoring, Documentation, Security, Test Coverage.
- Every category must appear even if it has no significant findings.
- For an empty category, write a short summary assessment such as: "No significant documentation issues found. The current docs cover the main contributor and user flows." Then omit the severity sub-sections.
- Omit `### High`, `### Medium`, or `### Low` only when there are no findings at that level.
- Each finding should include a bold title, a file or path reference in backticks when evidence supports it, and a multi-line description with context.
- The tone should be conversational, actionable, and specific rather than mechanical.
- Every finding must include a file or path reference in backticks when evidence supports it.
- Systemic issues may use directory wildcards or scope descriptions.

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

## Prioritized Issue Table

After the five category sections, include a flat prioritized table that lists all findings sorted by severity first (High → Medium → Low), then by category within each severity level.

```markdown
## Prioritized Issue Table

| Priority | Category | Finding | Location |
|----------|----------|---------|----------|
| **High** | Security | Hardcoded API key in config | `src/config.ts:42` |
| **High** | Code Quality | Unhandled promise rejection | `src/app.ts:15` |
| **Medium** | Code Quality | Mixed import styles | `src/utils/*.ts` |
| **Medium** | Refactoring | Duplicated validation logic | `src/auth.ts:30`, `src/api.ts:45` |
| **Medium** | Test Coverage | Missing error path tests | `tests/app.test.ts` |
| **Low** | Code Quality | Debug console.log left in code | `src/server.ts:87` |
| **Low** | Refactoring | Unused helper function | `src/helpers.ts:12` |
| **Low** | Documentation | Missing usage examples | `README.md` |
| **Low** | Test Coverage | Brittle assertion pattern | `tests/utils.test.ts:8` |
| **Low** | Test Coverage | Missing edge case coverage | `tests/app.test.ts` |
```

Rules:
- Every finding from the category sections must appear in this table.
- Sort order: High severity first (alphabetical by category within High), then Medium (alphabetical by category), then Low (alphabetical by category).
- The "Finding" column should be a brief 3-8 word summary of the issue.
- The "Location" column should include the backtick-wrapped file/path reference from the finding.
- If a finding spans multiple locations, list all separated by commas.
- This table is what users scan first to decide what to fix next.

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
