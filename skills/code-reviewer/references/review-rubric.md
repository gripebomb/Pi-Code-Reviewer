# Code Review Rubric

Detailed evaluation criteria for each review category. Load this document before evaluating categories.
Use it to decide what evidence matters, not as a checklist that forces findings where none exist.
Prefer concrete observations tied to files, commands, tests, docs, or configuration over vague impressions.
A healthy category can still be documented with a short summary when the evidence is strong and no meaningful findings emerge.

## Code Quality

Evaluate:
- **Error handling:** Are errors caught, surfaced, and handled in ways that preserve user trust and system stability?
- **Correctness signals:** Look for branches that appear logically incomplete, assumptions that are not checked, or behavior that likely diverges from the intended result.
- **Code complexity:** Watch for deep nesting, overly long functions, large parameter lists, or modules that do too many jobs at once.
- **Naming and readability:** Do names communicate intent clearly, and can a reader follow the flow without reverse-engineering every line?
- **Consistency:** Note mixed conventions, inconsistent async patterns, varying error styles, or different approaches to similar problems.
- **Dead code:** Look for unused imports, unreachable branches, stale feature flags, commented-out code, or abandoned helpers.
- **Type safety:** Where the language supports it, check whether types are used intentionally or bypassed with unsafe casts, `any`, or missing contracts.

Signals to notice:
- Repeated bug patterns across files often point to a broader quality issue instead of an isolated mistake.
- Strong code quality usually shows up as predictable structure, readable control flow, and obvious error paths.

## Refactoring

Evaluate:
- **Duplication:** Is the same logic repeated across files or modules in ways that should be extracted into shared utilities?
- **Coupling:** Are components tightly tied together in ways that make testing, replacement, or reuse harder than necessary?
- **Abstraction level:** Do functions stay focused, or do they mix parsing, validation, I/O, formatting, and orchestration in one place?
- **Module boundaries:** Are responsibilities separated cleanly, or do modules reach across layers and create hidden dependencies?
- **Data flow clarity:** Is state passed and transformed clearly, or is there global mutation, deeply threaded data, or hard-to-follow control flow?
- **Over-engineering:** Note unnecessary indirection, excessive configuration, or patterns that add ceremony without solving a real problem.
- **Change friction:** Ask whether a normal feature change would require editing too many files because the design is too entangled.

Signals to notice:
- Refactoring findings should explain how a structural change would reduce duplication, clarify responsibilities, or lower future bug risk.
- Avoid recommending abstraction for its own sake; note when the current simple design is appropriate.

## Documentation

Evaluate:
- **README quality:** Does the project explain what it is, how to install it, how to run it, and how a user should approach it?
- **Setup guidance:** Are environment variables, build steps, local dev commands, and troubleshooting notes documented where a contributor expects them?
- **API documentation:** Are public functions, modules, classes, or commands described with enough context to use them safely?
- **Inline comments:** Do comments clarify tricky or non-obvious behavior instead of restating the code line by line?
- **Architecture guidance:** For non-trivial systems, is there documentation that explains the major pieces, data flow, and important decisions?
- **Examples:** Are there usage examples for key workflows, CLI commands, configuration, or public interfaces?
- **Documentation drift:** Look for comments and docs that appear stale, misleading, or inconsistent with the current implementation.

Signals to notice:
- Missing docs matter most when they slow onboarding, hide required setup, or make public behavior hard to use correctly.
- Strong documentation is accurate, discoverable, and matched to how the project is actually operated today.

## Security

Evaluate:
- **Input validation:** Is external input validated before it reaches risky operations such as file access, command execution, templating, or database queries?
- **Authentication and authorization:** Where auth exists, check for missing guards, weak assumptions, insecure token handling, or privilege leaks.
- **Secrets management:** Look for hardcoded keys, tokens, passwords, insecure defaults, or secrets committed into config files and examples.
- **Dependency risk signals:** Check for obviously outdated packages, suspicious install scripts, or dependency patterns that deserve follow-up.
- **Error exposure:** Do logs, stack traces, or API responses leak internals, credentials, file paths, or sensitive implementation details?
- **Configuration security:** Review CORS settings, TLS assumptions, permissions, sandboxing, and any security-sensitive runtime configuration.
- **Data handling:** Consider whether sensitive data is stored, transmitted, or cached in ways that increase exposure risk.

Signals to notice:
- Security findings should distinguish between confirmed vulnerabilities, risky patterns, and evidence gaps that need follow-up.
- Call out when a repository lacks enough visible context to fully verify a security control.

## Test Coverage

Evaluate:
- **Test existence:** Are there tests at all, and what frameworks or runners appear to be in use?
- **Coverage breadth:** Which important paths are covered, and which critical modules or workflows appear untested?
- **Behavior verification:** Do tests assert outcomes clearly, or do they mostly execute code without validating meaningful results?
- **Edge cases and failure modes:** Are boundary conditions, malformed input, retries, error paths, and regressions covered?
- **Test maintainability:** Are tests organized clearly, readable, and resistant to brittle implementation coupling?
- **Integration confidence:** Is there evidence of higher-level tests for the most important user flows, not just isolated unit checks?
- **CI integration:** Is there automation that runs tests consistently so coverage stays useful over time?

Signals to notice:
- Test coverage is not only about count; it is also about whether important behavior, regressions, and failure paths are protected.
- If tests are absent, say so directly and note the practical risk that creates for future changes.

## Uncertainty Handling

When evidence for a category is limited, say that directly instead of guessing. For example: "No test files were found in the repository. Tests may be absent, generated elsewhere, or stored outside the scanned scope." If documentation is sparse or a security mechanism is implied but not fully visible, call out the evidence gap as part of the assessment.
