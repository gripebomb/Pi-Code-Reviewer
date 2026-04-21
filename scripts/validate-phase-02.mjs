import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readFile(relativePath) {
  const absolutePath = path.join(root, relativePath);
  assert(fs.existsSync(absolutePath), `Missing required file: ${relativePath}`);
  return fs.readFileSync(absolutePath, 'utf8');
}

const skill = readFile('skills/code-reviewer/SKILL.md');
assert(skill.includes('## Phase 1: Determine Scope'), 'SKILL.md must have Phase 1: Determine Scope');
assert(skill.includes('## Phase 2: Gather Evidence'), 'SKILL.md must have Phase 2: Gather Evidence');
assert(skill.includes('## Phase 3: Evaluate Categories'), 'SKILL.md must have Phase 3: Evaluate Categories');
assert(skill.includes('## Phase 4: Prioritize Findings'), 'SKILL.md must have Phase 4: Prioritize Findings');
assert(skill.includes('## Phase 5: Write Report'), 'SKILL.md must have Phase 5: Write Report');

assert(skill.includes('◆ Determining review scope'), 'SKILL.md must have ◆ Determining review scope status');
assert(skill.includes('◆ Gathering evidence'), 'SKILL.md must have ◆ Gathering evidence status');
assert(skill.includes('◆ Prioritizing findings'), 'SKILL.md must have ◆ Prioritizing findings status');
assert(skill.includes('◆ Writing review report'), 'SKILL.md must have ◆ Writing review report status');

assert(skill.toLowerCase().includes('non-interactive'), 'SKILL.md must contain non-interactive rule');

assert(skill.includes('Code Quality'), 'SKILL.md must mention Code Quality');
assert(skill.includes('Refactoring'), 'SKILL.md must mention Refactoring');
assert(skill.includes('Documentation'), 'SKILL.md must mention Documentation');
assert(skill.includes('Security'), 'SKILL.md must mention Security');
assert(skill.includes('Test Coverage'), 'SKILL.md must mention Test Coverage');

assert(skill.includes('references/review-rubric.md'), 'SKILL.md must instruct reading review-rubric.md');
assert(skill.includes('references/severity-guidelines.md'), 'SKILL.md must instruct reading severity-guidelines.md');
assert(skill.includes('references/output-contract.md'), 'SKILL.md must instruct reading output-contract.md');
assert(skill.includes('assets/review-template.md'), 'SKILL.md must instruct reading review-template.md');
assert(skill.includes('assets/todo-template.md'), 'SKILL.md must instruct reading todo-template.md');

assert(skill.includes('.planning/REVIEW.md'), 'SKILL.md must specify .planning/REVIEW.md output');
assert(skill.includes('.planning/REVIEW-TODO.md'), 'SKILL.md must specify .planning/REVIEW-TODO.md output');
assert(skill.includes('previous review') || skill.includes('replaces a previous'), 'SKILL.md must handle previous review replacement');

const rubric = readFile('skills/code-reviewer/references/review-rubric.md');
assert(rubric.includes('## Code Quality'), 'review-rubric.md must cover Code Quality');
assert(rubric.includes('## Refactoring'), 'review-rubric.md must cover Refactoring');
assert(rubric.includes('## Documentation'), 'review-rubric.md must cover Documentation');
assert(rubric.includes('## Security'), 'review-rubric.md must cover Security');
assert(rubric.includes('## Test Coverage'), 'review-rubric.md must cover Test Coverage');

const severity = readFile('skills/code-reviewer/references/severity-guidelines.md');
assert(severity.includes('## High'), 'severity-guidelines.md must define ## High');
assert(severity.includes('## Medium'), 'severity-guidelines.md must define ## Medium');
assert(severity.includes('## Low'), 'severity-guidelines.md must define ## Low');

const outputContract = readFile('skills/code-reviewer/references/output-contract.md');
assert(outputContract.includes('REVIEW.md'), 'output-contract.md must specify REVIEW.md');
assert(outputContract.includes('REVIEW-TODO.md'), 'output-contract.md must specify REVIEW-TODO.md');
assert(outputContract.includes('### High') || outputContract.includes('**[High]**'), 'output-contract.md must reference severity levels');

const reviewTemplate = readFile('skills/code-reviewer/assets/review-template.md');
assert(reviewTemplate.includes('### High') && reviewTemplate.includes('### Medium') && reviewTemplate.includes('### Low'), 'review-template.md must show all severity sub-headers');
assert(reviewTemplate.includes('## Code Quality'), 'review-template.md must have an example category');

const todoTemplate = readFile('skills/code-reviewer/assets/todo-template.md');
assert(todoTemplate.includes('- [ ]'), 'todo-template.md must show checkbox format');
assert(todoTemplate.includes('**[High]**'), 'todo-template.md must show [High] severity badge');
assert(todoTemplate.includes('**[Medium]**'), 'todo-template.md must show [Medium] severity badge');
assert(todoTemplate.includes('**[Low]**'), 'todo-template.md must show [Low] severity badge');

console.log('✓ validate:phase-02 passed');
