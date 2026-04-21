# Evidence Synthesis Rules

Rules for combining observations into concrete, actionable findings. Load this document before prioritizing findings in Phase 4.

## Overview

Evidence synthesis transforms the raw observations from Phase 2 and Phase 3 into structured findings. These rules ensure findings are concrete, consistent, and appropriately severe. Every finding must be supported by evidence from the evidence map.

## Rule 1: Concrete over Vague

**Every finding must tie to at least one specific file, path, or line.** No findings without evidence.

### Good Example
> **Unhandled promise rejection in `parseConfig()`** (`src/config.ts:42`)
> The error path isn't handled — if the config file is malformed, the promise rejection will crash the process. Wrap in try/catch or add a `.catch()` handler.

**Why it's good:** Specific function name, file path, line number, and concrete impact.

### Bad Example
> **Error handling could be improved**
> The codebase has some areas where errors aren't handled well. Consider adding more try/catch blocks.

**Why it's bad:** No file references, no specific locations, vague recommendation.

### Application
- Always include a file path in backticks
- Include line numbers when available (`file.ts:42`)
- Include function or module names when relevant
- For systemic issues, use directory wildcards: `src/utils/*.ts`

---

## Rule 2: Pattern over Instance

**Single occurrence = Low severity; repeated pattern (>2 files) = Medium/High.**

### Good Example (Medium — repeated pattern)
> **Mixed import styles across utility files** (`src/utils/*.ts`)
> Some files use `import type { ... }` and others use `import { ... }` for type-only imports. Standardizing on `import type` would make intent clearer and prevent accidental runtime imports.

**Why it's good:** Identifies a pattern across multiple files, not a one-off.

### Good Example (Low — single instance)
> **Unused import in `helpers.ts`** (`src/helpers.ts:3`)
> The `formatDate` import is not used anywhere in the file. Removing it would reduce noise.

**Why it's good:** Single instance correctly classified as Low.

### Bad Example (severity mismatch)
> **Inconsistent naming** (`src/utils.ts:15`)
> [High] One variable uses camelCase while another uses snake_case.

**Why it's bad:** A single naming inconsistency should be Low, not High.

### Application
- Count occurrences before assigning severity
- 1 file = Low (unless critical security/correctness)
- 2-3 files = Medium
- 4+ files or pervasive = High
- Security exceptions: one hardcoded secret is High regardless of count

---

## Rule 3: Impact over Count

**One critical security issue outweighs ten style issues.**

### Good Example (High impact, single instance)
> **Hardcoded API key in configuration** (`src/config.ts:8`)
> A production API key is committed directly to source code. This exposes credentials to anyone with repository access and makes rotation difficult. Move to environment variables and rotate the exposed key immediately.

**Why it's good:** Single instance but critical security impact justifies High.

### Good Example (Low impact, many instances)
> **Console.log statements in production code** (`src/server.ts:87`, `src/db.ts:34`)
> Debug logging statements appear in multiple production paths. These clutter logs and may leak internal state. Consider gating behind a debug flag or removing.

**Why it's good:** Multiple instances but limited impact = Low.

### Bad Example (count-driven severity)
> **Ten unused imports across codebase**
> [Medium] There are many unused imports that should be cleaned up.

**Why it's bad:** Count alone doesn't justify Medium; unused imports are Low regardless of quantity.

### Application
- Security and correctness issues trump style issues
- Data loss or corruption is always High
- Performance issues depend on severity of impact
- Style/consistency issues are rarely above Low

---

## Rule 4: Uncertainty Explicit

**When evidence is insufficient, state: "Evidence is limited: [specific gap]"**

### Good Example
> **Authentication mechanism unclear**> Evidence is limited: no auth middleware was found in the reviewed files, but protected routes exist in `src/routes/admin.ts`. The authentication check may be handled by a framework plugin or upstream middleware not visible in this scope.

**Why it's good:** Clearly states the evidence gap without inventing certainty.

### Bad Example
> **Missing authentication**> The admin routes have no authentication, which is a critical security vulnerability.

**Why it's bad:** Assumes auth is missing rather than handled elsewhere. Could be false positive.

### Application
- When you can't find something, say so explicitly
- Distinguish between "not found" and "doesn't exist"
- Note when controls may exist outside reviewed scope
- Use phrases like: "Evidence is limited," "Not visible in reviewed files," "May be handled by"

---

## Rule 5: Contextual Severity

**The same pattern can be High in security-critical code, Low in utilities.**

### Good Example (High in critical context)
> **Missing input validation in file upload handler** (`src/routes/upload.ts:15`)
> [High] The upload endpoint accepts files without validating type or size. In a public-facing upload handler, this could allow executable uploads and remote code execution.

### Good Example (Low in utility context)> **Missing input validation in debug script** (`scripts/debug.ts:8`)> [Low] A local debug script doesn't validate CLI arguments. Since this is not deployed and only used by developers, the risk is minimal.

**Why both are good:** Same pattern (missing validation), different contexts, appropriate severities.

### Bad Example (context-blind severity)> **Missing input validation** (`src/routes/upload.ts:15`, `scripts/debug.ts:8`)> [High] Both files lack input validation.

**Why it's bad:** Applies same severity regardless of context and exposure.

### Application
- Consider: Is this code on the critical path? Is it exposed to untrusted input? Is it deployed to production?
- Production-facing code with user input = higher severity
- Internal tools, tests, debug scripts = lower severity
- Security-critical modules (auth, payment, upload) = elevated severity

---

## Rule 6: Cross-Category Consolidation

**Related findings across categories should reference each other.**

### Good Example
> **Complex token validation lacks tests** (`src/auth.ts:45`)> [Medium] The token validation logic is complex (3 nesting levels, 2 async calls) but has no corresponding tests. See also Security finding about missing input validation on the token endpoint.

**Why it's good:** Links Code Quality (complexity) + Test Coverage (missing tests) + Security (input validation).

### Bad Example
> **Complex function in auth.ts**> [Medium] The function is too complex.

> **Missing tests for auth**> [Medium] Auth needs tests.

**Why it's bad:** Two separate findings that should be consolidated with cross-references.

### Application
- When a code quality issue creates a security risk, link them
- When missing tests correspond to complex or security-critical code, note the relationship
- When documentation gaps hide refactoring needs, connect them
- Use "See also:" to link related findings

---

## Rule 7: Finding Format

**Each finding must have: bold title, file/path reference, multi-line description with impact.**

### Required Format

```markdown
- **[Finding title]** (`path/to/file.ext:line`)
  [Description of what the issue is, with specific details.]
  [Why it matters and the likely impact on users or maintainers.]
  [Optional: suggested direction for fix, not detailed rewrite.]
```

### Good Example
```markdown
- **Unhandled promise rejection in `parseConfig()`** (`src/config.ts:42`)
  The `parseConfig()` function returns a Promise, but `loadApp()` on line 42 uses the
  result synchronously without await or .catch(). If the config file is malformed or
  missing, the unhandled rejection will crash the process.
  Add try/catch around the call or handle the rejection with .catch().
```

### Bad Example (missing impact)
```markdown
- **Promise issue** (`src/config.ts`)
  There's a problem with promises in the config file.
```

### Bad Example (no path)
```markdown
- **Error handling needs work**
  Some functions don't handle errors properly.
```

### Application
- Title should be specific and descriptive (not generic)
- Path reference in backticks, with line number when available
- Description explains what, why, and impact
- Keep tone conversational and actionable

---

## Synthesis Workflow

1. **Review evidence map** — Read all observations from Phase 2-3
2. **Group related observations** — Combine observations that describe the same issue
3. **Apply Rule 1** — Ensure every finding has concrete file/path evidence
4. **Apply Rule 2** — Count occurrences to determine if it's a pattern
5. **Apply Rule 3** — Assess impact independent of count
6. **Apply Rule 5** — Adjust severity based on context
7. **Apply Rule 6** — Link related findings across categories
8. **Apply Rule 4** — Flag any findings with insufficient evidence
9. **Apply Rule 7** — Format each finding with title, path, and description
10. **Review** — Check that no finding contradicts another

## Examples Summary

| Rule | Good Example | Bad Example |
|------|-------------|-------------|
| Concrete | `src/config.ts:42` — specific line | "Some config files" — vague |
| Pattern | 4 files have same issue = Medium | 1 file issue called High |
| Impact | Security issue = High regardless of count | 10 style issues = Medium |
| Uncertainty | "Evidence is limited: auth middleware not visible" | "Missing authentication" (assumed) |
| Contextual | Upload handler missing validation = High | Same severity for debug script |
| Cross-category | Links complexity + missing tests + security | Siloed findings for same root cause |
| Format | Bold title, path, multi-line description | Generic title, no path, one line |

## Quality Checks

Before finalizing findings:

- [ ] Every finding references at least one concrete file or path
- [ ] Severity reflects impact and pattern frequency, not just personal judgment
- [ ] Uncertain findings explicitly state the evidence gap
- [ ] Related findings across categories are cross-referenced
- [ ] Each finding follows the required format (title, path, description)
- [ ] No finding contradicts another finding
- [ ] Findings are actionable — a developer could use them to make changes
