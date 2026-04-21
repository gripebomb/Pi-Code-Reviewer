import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
let failureCount = 0;
let checkCount = 0;

function logPass(message) {
  checkCount += 1;
  console.log(`  ✓ ${message}`);
}

function logFail(message) {
  checkCount += 1;
  failureCount += 1;
  console.error(`  ✗ ${message}`);
}

function assert(condition, message) {
  if (condition) {
    logPass(message);
  } else {
    logFail(message);
  }
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function readFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function isValidSemver(version) {
  return /^\d+\.\d+\.\d+(-[a-zA-Z0-9._-]+)?(\+[a-zA-Z0-9._-]+)?$/.test(version);
}

console.log('Phase 5 Release Readiness Validation');
console.log('=====================================');

// 1. Validate package metadata
console.log('\n1. Package Metadata');
const pkgPath = path.join(root, 'package.json');
assert(fileExists('package.json'), 'package.json exists');

const pkg = JSON.parse(readFile('package.json'));
assert(pkg.name === 'pi-code-reviewer', 'package name is "pi-code-reviewer"');
assert(isValidSemver(pkg.version), `version "${pkg.version}" is valid semver`);
assert(
  Array.isArray(pkg.keywords) &&
    pkg.keywords.includes('pi-package') &&
    pkg.keywords.includes('pi') &&
    pkg.keywords.includes('skill') &&
    pkg.keywords.includes('code-review'),
  'keywords includes "pi-package", "pi", "skill", "code-review"',
);
assert(
  pkg.pi && pkg.pi.skills &&
    (pkg.pi.skills === './skills' ||
      (Array.isArray(pkg.pi.skills) && pkg.pi.skills.includes('./skills'))),
  'pi.skills points to "./skills"',
);
assert(
  Array.isArray(pkg.files) && pkg.files.includes('README.md') && pkg.files.includes('skills/'),
  'files includes "README.md" and "skills/"',
);

// 2. Validate skill structure
console.log('\n2. Skill Structure');
assert(fileExists('skills/code-reviewer/SKILL.md'), 'SKILL.md exists');
assert(fileExists('skills/code-reviewer/references/output-contract.md'), 'output-contract.md exists');
assert(fileExists('skills/code-reviewer/references/severity-guidelines.md'), 'severity-guidelines.md exists');
assert(fileExists('skills/code-reviewer/references/review-rubric.md'), 'review-rubric.md exists');
assert(fileExists('skills/code-reviewer/assets/review-template.md'), 'review-template.md exists');
assert(fileExists('skills/code-reviewer/assets/todo-template.md'), 'todo-template.md exists');

// 3. Validate fixture outputs
console.log('\n3. Fixture Outputs');
const fixtures = ['fixture-a', 'fixture-b', 'fixture-c'];
const categories = ['Code Quality', 'Refactoring', 'Documentation', 'Security', 'Test Coverage'];

for (const fixture of fixtures) {
  const reviewPath = `test/fixtures/${fixture}/.planning/REVIEW.md`;
  const todoPath = `test/fixtures/${fixture}/.planning/REVIEW-TODO.md`;

  assert(fileExists(reviewPath), `${fixture}: REVIEW.md exists`);
  assert(fileExists(todoPath), `${fixture}: REVIEW-TODO.md exists`);

  if (fileExists(reviewPath)) {
    const review = readFile(reviewPath);
    assert(review.includes('## Summary'), `${fixture}: REVIEW.md has Summary section`);
    assert(review.includes('## Prioritized Issue Table'), `${fixture}: REVIEW.md has Prioritized Issue Table`);

    for (const category of categories) {
      assert(review.includes(`## ${category}`), `${fixture}: REVIEW.md has ${category} section`);
    }

    const hasSeverity = review.includes('### High') || review.includes('### Medium') || review.includes('### Low');
    assert(hasSeverity, `${fixture}: REVIEW.md has at least one severity sub-header`);
  }

  if (fileExists(todoPath)) {
    const todo = readFile(todoPath);
    for (const category of categories) {
      assert(todo.includes(`## ${category}`), `${fixture}: REVIEW-TODO.md has ${category} section`);
    }
    assert(todo.includes('- [ ]'), `${fixture}: REVIEW-TODO.md has checkbox items`);
    const hasBadge = todo.includes('**[High]**') || todo.includes('**[Medium]**') || todo.includes('**[Low]**');
    assert(hasBadge, `${fixture}: REVIEW-TODO.md has severity badges`);
  }
}

// 4. Validate CLI support
console.log('\n4. CLI Support');
if (pkg.bin) {
  const binEntries = typeof pkg.bin === 'string' ? [pkg.bin] : Object.values(pkg.bin);
  for (const binPath of binEntries) {
    assert(fileExists(binPath), `bin entry "${binPath}" exists`);
  }
} else {
  console.log('  ⚠ No bin entry in package.json (planned for later)');
}

// 5. Validate documentation
console.log('\n5. Documentation');
assert(fileExists('README.md'), 'README.md exists');
if (fileExists('README.md')) {
  const readmeStat = fs.statSync(path.join(root, 'README.md'));
  assert(readmeStat.size > 100, 'README.md is non-empty (>100 bytes)');
}
assert(fileExists('skills/code-reviewer/references/INSTALL.md'), 'INSTALL.md exists');

// Summary
console.log('\n-------------------------------------');
console.log(`Checks run: ${checkCount}`);
if (failureCount === 0) {
  console.log('\n✓ All release-readiness checks passed');
  process.exit(0);
} else {
  console.log(`\n✗ ${failureCount} release-readiness check(s) failed`);
  process.exit(1);
}
