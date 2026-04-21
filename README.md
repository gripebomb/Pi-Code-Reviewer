# Pi Code Reviewer

Pi Code Reviewer is a Pi-installable code review skill package. Phase 1 focuses on package installation and skill discovery so users can confirm the package loads cleanly before the full review workflow ships in Phase 2.

## Recommended Pi install path

Use Pi's package installer when you want Pi to discover the skill in the expected way:

```bash
pi install npm:pi-code-reviewer
```

Pi discovery is validated through `pi install` for this package.

## Standard npm install path

You can also install the published package with npm:

```bash
npm install -g pi-code-reviewer
```

Plain npm installation documents package availability but is not guaranteed Pi registration by itself.

## Invocation

After installing the package through Pi, use the canonical skill command:

```text
/skill:code-reviewer
```

Phase 1 validates installation/discovery now and does not promise the full review workflow yet. The full repository review experience arrives in Phase 2.

## Output Format

After running the code reviewer, you'll find two files in `.planning/`:

### REVIEW.md

A comprehensive review report with:

- **Summary table** — counts of findings per category and severity at a glance
- **Category sections** — detailed findings grouped by Code Quality, Refactoring, Documentation, Security, and Test Coverage
- **Prioritized Issue Table** — all findings sorted by severity (High → Medium → Low) so you can decide what to fix first

### REVIEW-TODO.md

An actionable checklist derived from the findings:

- Grouped by category
- Sorted by severity within each category
- Each item includes a severity badge, file reference, and impact note
- Check off items as you fix them, or hand the list to another agent

### Severity Levels

- **High** — Immediate risk or broken behavior. Fix first.
- **Medium** — Fragility or significant improvement opportunity. Fix next.
- **Low** — Polish or incremental improvement. Fix when convenient.

## Smoke test

Use `/skill:code-reviewer` immediately after installation to confirm Pi can resolve the skill. For the detailed local smoke-test checklist, including the marker-based verification flow used in Phase 1 validation, see [./skills/code-reviewer/references/INSTALL.md](./skills/code-reviewer/references/INSTALL.md).
