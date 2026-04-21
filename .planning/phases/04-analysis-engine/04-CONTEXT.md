# Phase 4 Context: Analysis Engine

## Decisions

### D-01: Evidence Gathering Algorithm
**Decision:** The skill will use a breadth-first, then depth-first evidence gathering approach.
**Rationale:** Maximizes context window efficiency while ensuring important files get adequate attention.
**Implementation:** Add detailed Phase 2 instructions to SKILL.md specifying file read order and sufficiency criteria.

### D-02: Category Analysis Operationalization
**Decision:** Create category-specific analysis guides that translate rubric criteria into actionable inspection steps.
**Rationale:** The rubric describes WHAT to look for; analysis guides describe HOW to look for it.
**Implementation:** Create `references/category-analysis-guide.md` with per-category inspection patterns.

### D-03: Evidence Synthesis Rules
**Decision:** Define explicit rules for combining observations into findings.
**Rationale:** Prevents vague or unsupported findings and ensures consistency.
**Implementation:** Create `references/evidence-synthesis.md` with synthesis rules and examples.

### D-04: Path Reference Validation
**Decision:** Every finding MUST include a concrete file or path reference. Systemic issues use directory wildcards or scope descriptions.
**Rationale:** RPRT-02 requires concrete file/path references for actionable output.
**Implementation:** Update output-contract.md with path reference rules and add validation fixtures.

### D-05: Uncertainty Handling Standardization
**Decision:** When evidence is limited, findings must explicitly state the evidence gap rather than invent certainty.
**Rationale:** Maintains trust in the review when the repository doesn't provide enough context.
**Implementation:** Add uncertainty handling section to evidence-synthesis.md and update rubric cross-references.

### D-06: Analysis Quality Validation
**Decision:** Use fixture repositories with known issues to validate analysis quality.
**Rationale:** Need objective way to verify that the analysis engine produces correct findings.
**Implementation:** Create test fixtures and a validation script that checks generated reports against expected findings.

## Deferred Ideas

- **Language-specific analysis modules**: Deferred to v2 (DEPT-01). Phase 4 stays language-agnostic.
- **Automated severity scoring algorithm**: Deferred. Continue using human-judgment-based High/Medium/Low with clear criteria.
- **Cross-reference analysis between findings**: Interesting but complex; defer to v2.
- **Historical trend analysis**: Comparing reviews over time; defer to v2.

## the agent's Discretion

- **Fixture complexity**: The agent can choose simple vs. complex fixture repos based on what best validates the analysis engine. Simpler is better for v1.
- **Validation approach**: Can use manual validation (human checks report quality) or automated validation (script checks path references exist). Either is acceptable for v1.
- **Guide detail level**: Analysis guides should be detailed enough to be actionable but not so verbose that they exceed context window limits.

## Cross-References

- **Phase 2**: SKILL.md workflow structure (5 phases) — Phase 4 enhances Phases 2-4
- **Phase 3**: Scope detection algorithm — Phase 4 analysis respects `candidate_paths` from scope detection
- **Phase 5**: Will consume Phase 4's findings to generate prioritized outputs and persistent artifacts

## Requirements Mapping

| Requirement | Decision | Status |
|-------------|----------|--------|
| ANLY-01 (code quality findings) | D-02 (category analysis guides) | Planned |
| ANLY-02 (refactoring findings) | D-02 (category analysis guides) | Planned |
| ANLY-03 (documentation findings) | D-02 (category analysis guides) | Planned |
| ANLY-04 (security findings) | D-02 (category analysis guides) | Planned |
| ANLY-05 (test coverage findings) | D-02 (category analysis guides) | Planned |
| RPRT-02 (file/path references) | D-04 (path reference validation) | Planned |

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Analysis guides too vague to improve quality | Medium | High | Validate against fixtures; iterate based on results |
| Context window limits prevent deep analysis | Medium | Medium | Breadth-first approach; prioritize risky files |
| Path references in reports don't exist | Low | High | Validation script checks paths against repo |
| Over-engineering the analysis engine | Medium | Medium | Stay instruction-based; don't build separate engine |

## Success Criteria

1. Analysis guides produce more concrete, actionable findings than rubric alone
2. Generated reports consistently include file/path references for findings
3. Fixture validation confirms the analysis engine catches known issues
4. SKILL.md Phase 2-4 instructions are specific enough for autonomous execution
