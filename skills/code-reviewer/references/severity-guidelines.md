# Severity Guidelines

Classification criteria for review findings. Load this document before prioritizing findings.

## High

Findings that represent immediate risk or broken behavior:

- Active bugs, likely runtime failures, or logic errors that can break common workflows
- Security vulnerabilities with a clear exploit path, such as injection risk, auth bypass, or exposed secrets
- Data loss, corruption, or irreversible state risk
- Critical missing error handling that will cause normal operations to fail noisily or unpredictably
- Code that will not compile, build, deploy, or run without modification
- Defects that significantly weaken user trust, operational safety, or release readiness

## Medium

Findings that represent fragility, maintainability risk, or significant improvement opportunities:

- Code that works today but is fragile, tightly coupled, or difficult to maintain safely
- Significant refactoring opportunities that would reduce duplication, improve readability, or clarify ownership
- Missing tests for important, complex, or frequently changed functionality
- Documentation gaps affecting public APIs, setup steps, contributor onboarding, or critical operational behavior
- Inconsistent patterns that make the codebase harder to navigate and more error-prone to extend
- Moderate security concerns without a fully demonstrated exploit path but with meaningful risk signals

## Low

Findings that represent polish or incremental improvement:

- Style or convention inconsistencies that do not currently affect correctness
- Minor optimization opportunities with limited practical impact
- Nice-to-have documentation improvements such as clearer examples or smoother wording
- Test coverage gaps in low-risk or rarely changed code paths
- Dead code, unused imports, or stale comments that add noise more than direct risk
- Small maintainability issues that are worth fixing when touching nearby code anyway

## Examples

### High Example
> **Unhandled promise rejection in `parseConfig()`** (`src/config.ts:42`)
> The error path isn't handled — if the config file is malformed, the promise rejection will crash the process. Wrap in try/catch or add a `.catch()` handler.

### Medium Example
> **Mixed import styles across utility files** (`src/utils/*.ts`)
> Some files use `import type { ... }` and others use `import { ... }` for type-only imports. Standardizing on `import type` would make intent clearer and prevent accidental runtime imports.

### Low Example
> **Unused import in `helpers.ts`** (`src/helpers.ts:3`)
> The `formatDate` import is not used anywhere in the file. Removing it would reduce noise.
