# Phase 4 Validation: Analysis Engine

## Validation Date
2026-04-20

## Phase Goal
Users receive evidence-based findings across all five requested review categories.

## Validation Criteria

### V-01: Evidence Gathering Completeness
**Criterion:** The analysis engine reads representative files across the repository, not just a subset.
**Validation Method:** Review SKILL.md Phase 2 instructions for breadth-first approach and sufficiency criteria.
**Pass Condition:** Instructions specify reading key config files, entry points, and test directories before deep dives.

### V-02: Category Coverage
**Criterion:** All five categories (Code Quality, Refactoring, Documentation, Security, Test Coverage) are evaluated in every review.
**Validation Method:** Check that analysis guides exist for all 5 categories and SKILL.md mandates evaluating all 5.
**Pass Condition:** No category can be skipped; empty categories must have a summary assessment.

### V-03: Finding Concreteness
**Criterion:** Findings include specific file or path references wherever evidence supports them.
**Validation Method:** Run analysis against fixture repos and verify every finding has a path reference.
**Pass Condition:** >90% of findings include file/path references; systemic issues use directory wildcards.

### V-04: Severity Appropriateness
**Criterion:** Severity classifications (High/Medium/Low) align with severity-guidelines.md criteria.
**Validation Method:** Review generated reports against fixture repos with known issue severities.
**Pass Condition:** Severity assignments match expected classifications for known issues.

### V-05: Uncertainty Handling
**Criterion:** When evidence is limited, findings explicitly state uncertainty rather than inventing certainty.
**Validation Method:** Check reports for phrases like "evidence is limited", "unable to verify", "may be".
**Pass Condition:** No false certainty in findings; evidence gaps are called out.

### V-06: Cross-Category Consistency
**Criterion:** Related findings across categories are consistent (e.g., a security issue and missing test for the same path).
**Validation Method:** Review reports for internal consistency and cross-category references.
**Pass Condition:** No contradictory findings; related issues reference each other when appropriate.

### V-07: Path Reference Accuracy
**Criterion:** File/path references in findings actually exist in the repository.
**Validation Method:** Automated script checks all path references in generated reports against repo file list.
**Pass Condition:** 100% of path references resolve to existing files or directories.

## Validation Methods

### Manual Validation
1. Run skill against representative fixture repositories
2. Human reviewer assesses report quality, concreteness, and accuracy
3. Check that all 5 categories have content
4. Verify severity assignments feel appropriate

### Automated Validation
1. Script extracts all path references from generated REVIEW.md
2. Script verifies each path exists in the repository
3. Script counts findings per category
4. Script checks for required section headers

### Fixture Repositories
Create 2-3 fixture repos with known issues:
- **Fixture A**: Simple repo with clear code quality, documentation, and test coverage issues
- **Fixture B**: Repo with security concerns and refactoring opportunities
- **Fixture C**: Edge case repo (minimal files, no tests, no docs) to test uncertainty handling

## Validation Checklist

- [ ] Evidence gathering instructions are specific and actionable
- [ ] All 5 category analysis guides exist and are detailed
- [ ] Evidence synthesis rules are documented
- [ ] Path reference rules are documented in output contract
- [ ] Fixture repos are created with known issues
- [ ] Validation script checks path references
- [ ] Reports from fixture repos match expected findings
- [ ] Uncertainty is handled appropriately in edge cases
- [ ] Severity assignments align with guidelines
- [ ] Cross-category consistency is maintained

## Success Threshold

Phase 4 passes validation when:
1. All validation criteria (V-01 through V-07) are satisfied
2. Fixture-based validation confirms analysis quality
3. Path reference accuracy is 100%
4. All 5 categories are consistently evaluated
