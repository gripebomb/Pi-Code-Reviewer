import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reviewArg = process.argv[2] || '.planning/REVIEW.md';
const reviewPath = path.resolve(root, reviewArg);
const todoPath = path.join(path.dirname(reviewPath), 'REVIEW-TODO.md');
const categories = ['Code Quality', 'Refactoring', 'Documentation', 'Security', 'Test Coverage'];
const wholeRepoScopePattern = /^\*\*Scope:\*\* Whole repository$/m;
const changedFilesScopePattern = /^\*\*Scope:\*\* Changed files — \d+ files modified \((branch diff against [^)]+|uncommitted changes|last commit)\)$/m;
const gitFallbackNotePattern = /^> \*\*Note:\*\* Git metadata unavailable — falling back to whole-repo review\.$/m;

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

assert(fs.existsSync(reviewPath), `Missing required file: ${path.relative(root, reviewPath) || path.basename(reviewPath)}`);
const review = fs.readFileSync(reviewPath, 'utf8');

assert(review.includes('# Code Review:'), 'REVIEW.md must start with a Code Review header');
assert(/^\*\*Date:\*\*/m.test(review), 'REVIEW.md must contain a **Date:** line');
assert(wholeRepoScopePattern.test(review) || changedFilesScopePattern.test(review), 'REVIEW.md must contain a valid scope header');

const hasFallbackNote = review.includes('Git metadata unavailable — falling back to whole-repo review.');
if (hasFallbackNote) {
  assert(gitFallbackNotePattern.test(review), 'Fallback note must exactly match the Phase 3 output contract wording');
  assert(wholeRepoScopePattern.test(review), 'Fallback note is only valid with whole-repo scope');
}

for (const category of categories) {
  assert(review.includes(`## ${category}`), `REVIEW.md must contain ## ${category} section`);
}

const hasSeverityGrouping = review.includes('### High') || review.includes('### Medium') || review.includes('### Low');
assert(hasSeverityGrouping, 'REVIEW.md must contain at least one severity sub-header (### High, ### Medium, or ### Low)');

assert(fs.existsSync(todoPath), `Missing required file: ${path.relative(root, todoPath) || path.basename(todoPath)}`);
const todo = fs.readFileSync(todoPath, 'utf8');

for (const category of categories) {
  assert(todo.includes(`## ${category}`), `REVIEW-TODO.md must contain ## ${category} section`);
}

assert(todo.includes('- [ ]'), 'REVIEW-TODO.md must contain checkbox items (- [ ])');
const hasSeverityBadge = todo.includes('**[High]**') || todo.includes('**[Medium]**') || todo.includes('**[Low]**');
assert(hasSeverityBadge, 'REVIEW-TODO.md must contain at least one severity badge (**[High]**, **[Medium]**, or **[Low]**)');

console.log('✓ validate:output passed');
