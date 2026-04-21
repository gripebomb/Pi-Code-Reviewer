# Phase 4 Research: Analysis Engine

## Research Date
2026-04-20

## Phase Goal
Users receive evidence-based findings across all five requested review categories.

## Current State Analysis

### What Exists (from Phases 1-3)
- **SKILL.md**: Complete 5-phase workflow (Scope → Gather Evidence → Evaluate Categories → Prioritize → Write Report)
- **review-rubric.md**: Detailed evaluation criteria for all 5 categories with signals to notice
- **severity-guidelines.md**: High/Medium/Low classification with examples
- **output-contract.md**: Report structure and formatting rules
- **scope-detection.md**: Git-aware scope detection algorithm
- **Templates**: review-template.md and todo-template.md for output shape

### What's Missing for Evidence-Based Analysis
1. **Evidence Gathering Heuristics**: No systematic approach for HOW to read files, WHAT to look for, or HOW to build an evidence map
2. **Category-Specific Analysis Patterns**: The rubric describes WHAT to evaluate but not HOW to evaluate it programmatically/structurally
3. **Evidence Synthesis Rules**: No guidance on how to combine observations into findings
4. **Path Reference Validation**: No mechanism to ensure findings actually cite concrete files/paths
5. **Uncertainty Quantification**: The rubric mentions uncertainty handling but doesn't systematize it

## Research Findings

### Evidence Gathering Best Practices

**Breadth-First Exploration**: 
- Start with file tree and key config files (package.json, tsconfig, Makefile, etc.)
- Read entry points and main modules first
- Identify technology stack and conventions
- Look for test directories, docs, and configuration files

**Depth-First Analysis**:
- Focus on files that appear risky, central, or under-documented
- Look for patterns across multiple files (duplication, inconsistency)
- Check error handling paths, not just happy paths
- Examine imports/dependencies for coupling signals

**Evidence Types to Collect**:
1. **Structural**: File organization, module boundaries, import graphs
2. **Behavioral**: Error handling, edge cases, state management
3. **Qualitative**: Naming, comments, complexity metrics (nesting, length)
4. **Configurational**: Security settings, build configs, dependency versions
5. **Test-related**: Test files, coverage patterns, assertion quality

### Category-Specific Analysis Patterns

**Code Quality**:
- Look for: unhandled promises, missing try/catch, deep nesting (>3 levels), long functions (>50 lines), inconsistent error patterns
- Evidence: specific line numbers, function names, error paths
- Uncertainty: when language features make it unclear (e.g., implicit returns)

**Refactoring**:
- Look for: repeated code blocks (>3 lines), modules with >5 responsibilities, circular imports, global state
- Evidence: file paths of duplicates, coupling metrics, abstraction leaks
- Uncertainty: when similar-but-not-identical code might or might not be extractable

**Documentation**:
- Look for: README completeness, API docs, inline comments on non-obvious logic, architecture docs
- Evidence: missing sections, stale comments, undocumented public APIs
- Uncertainty: when conventions are obvious to domain experts but not newcomers

**Security**:
- Look for: hardcoded secrets, missing input validation, unsafe eval, insecure dependencies, verbose error messages
- Evidence: specific lines with secrets, unvalidated inputs, dependency versions with known CVEs
- Uncertainty: when security controls are implied but not visible (e.g., middleware not in scope)

**Test Coverage**:
- Look for: test files, test frameworks, assertion quality, edge cases, CI config
- Evidence: untested critical paths, brittle tests, missing error-path tests
- Uncertainty: when tests might exist outside the reviewed scope

### Evidence Synthesis Rules

1. **Concrete over Vague**: Every finding must tie to at least one specific file/path/line
2. **Pattern over Instance**: Single issues are Low; repeated patterns are Medium/High
3. **Impact over Count**: One critical security issue > ten style inconsistencies
4. **Uncertainty Explicit**: When evidence is insufficient, state the gap rather than guess
5. **Contextual Severity**: Same pattern can be High in one context, Low in another

### Path Reference Requirements (RPRT-02)

Every finding should include:
- File path (relative to repo root)
- Line number when available (use `:line` format)
- Function/module name when relevant
- Use backticks for all path references

When path is unavailable (e.g., systemic issue):
- Use directory path with wildcard: `src/utils/*.ts`
- Or describe the scope: "across all route handlers"
- Never omit path entirely unless truly systemic and unlocatable

## Standard Stack

- **Language**: Markdown (skill instructions)
- **Runtime**: Pi skill execution environment
- **Analysis Method**: LLM-based with structured prompting
- **Output Format**: Markdown reports

## Architecture Patterns

### Evidence Gathering Phase (Phase 2 in SKILL.md)
The skill already defines Phase 2 as "Gather Evidence" but doesn't specify HOW. Phase 4 should:
1. Define the evidence gathering algorithm
2. Specify what files to read in what order
3. Define how to build the evidence map
4. Specify when to stop gathering (sufficiency criteria)

### Category Evaluation Phase (Phase 3 in SKILL.md)
The skill defines 5 categories but doesn't specify evaluation order or cross-category synthesis. Phase 4 should:
1. Define evaluation order (Code Quality → Refactoring → Documentation → Security → Test Coverage)
2. Specify how findings in one category inform another
3. Define when to consolidate related findings across categories

### Prioritization Phase (Phase 4 in SKILL.md)
The skill mentions prioritization but doesn't define the algorithm. Phase 4 should:
1. Define severity assignment rules (using severity-guidelines.md)
2. Specify how to handle conflicting severities
3. Define the sorting/grouping algorithm

## Don't Hand-Roll

- **Don't create a custom analysis language**: Use natural language with structured markdown
- **Don't build a separate analysis engine**: The skill IS the analysis engine; enhance the instructions
- **Don't create custom severity scoring**: Use the existing High/Medium/Low with clear criteria
- **Don't build path validation as code**: Document the requirement and validate through examples

## Common Pitfalls

1. **Over-analysis**: Reading every file exhaustively wastes context window; breadth-first with targeted depth is better
2. **False certainty**: Inventing findings where evidence is weak undermines trust
3. **Category silos**: Not connecting related findings across categories (e.g., missing tests for a security-critical path)
4. **Path drift**: Findings that reference files that weren't actually read or don't exist
5. **Severity inflation**: Labeling everything as High reduces the value of the classification

## Out of Scope for Phase 4

- **Auto-fixing**: Not implementing automated fixes (v1 scope decision)
- **Language-specific AST parsing**: Staying language-agnostic (v1 scope decision)
- **Machine-readable output formats**: JSON/XML outputs deferred to v2 (FORM-01)
- **CI integration**: Automation deferred to v2 (INTG-02)
- **Deep per-language analysis**: Ecosystem-specific analyzers deferred to v2 (DEPT-01)

## Research Conclusion

Phase 4 should enhance the skill's analysis capabilities by:
1. Adding detailed evidence gathering instructions to SKILL.md Phase 2
2. Creating category-specific analysis guides that operationalize the rubric
3. Defining evidence synthesis rules that ensure concrete, actionable findings
4. Adding path reference validation to the output contract
5. Creating fixture-based validation to verify analysis quality

The work is primarily documentation and instruction refinement, not new code. The skill executes in the Pi environment using the LLM's reasoning capabilities, so the "engine" is the quality of the instructions and reference docs.

## Files to Create/Modify

### New Files
- `skills/code-reviewer/references/evidence-gathering.md` — How to gather and organize evidence
- `skills/code-reviewer/references/category-analysis-guide.md` — Operationalized analysis patterns per category
- `skills/code-reviewer/references/evidence-synthesis.md` — Rules for combining observations into findings

### Modified Files
- `skills/code-reviewer/SKILL.md` — Enhance Phase 2 (Gather Evidence) and Phase 3 (Evaluate Categories) with specific instructions
- `skills/code-reviewer/references/output-contract.md` — Add path reference validation rules
- `skills/code-reviewer/references/review-rubric.md` — Cross-reference new analysis guides

### Validation
- Fixture repos with known issues to test analysis quality
- Validation script to check path references in generated reports
