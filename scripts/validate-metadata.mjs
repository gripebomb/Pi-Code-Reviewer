import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'package.json',
  'README.md',
  'skills/code-reviewer/SKILL.md',
  'skills/code-reviewer/references/README.md',
  'skills/code-reviewer/references/INSTALL.md',
  'skills/code-reviewer/references/review-rubric.md',
  'skills/code-reviewer/references/severity-guidelines.md',
  'skills/code-reviewer/references/output-contract.md',
  'skills/code-reviewer/assets/README.md',
  'skills/code-reviewer/assets/review-template.md',
  'skills/code-reviewer/assets/todo-template.md',
];

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

for (const file of requiredFiles) {
  assert(fs.existsSync(path.join(root, file)), `Missing required file: ${file}`);
}

const pkg = JSON.parse(readFile('package.json'));
assert(pkg.name === 'pi-code-reviewer', 'package.json name must be pi-code-reviewer');
assert(pkg.description === 'Pi-installable code review skill package.', 'package.json description must match the Phase 1 contract');
assert(Array.isArray(pkg.keywords) && pkg.keywords.includes('pi-package'), 'package.json keywords must include pi-package');
assert(pkg.engines?.node === '>=20', 'package.json engines.node must be >=20');
assert(Array.isArray(pkg.files), 'package.json files must be an array');
assert(pkg.files.length === 2 && pkg.files[0] === 'README.md' && pkg.files[1] === 'skills/', 'package.json files must contain only README.md and skills/ in that order');
assert(Array.isArray(pkg.pi?.skills) && pkg.pi.skills.length === 1 && pkg.pi.skills[0] === './skills', 'package.json pi.skills must equal ["./skills"]');
assert(pkg.scripts?.['validate:metadata'] === 'node scripts/validate-metadata.mjs', 'package.json validate:metadata script is missing or incorrect');
assert(pkg.scripts?.['validate:docs'] === 'node scripts/validate-docs.mjs', 'package.json validate:docs script is missing or incorrect');
assert(pkg.scripts?.['validate:phase-01'] === 'node scripts/validate-phase-01.mjs', 'package.json validate:phase-01 script is missing or incorrect');

const skill = readFile('skills/code-reviewer/SKILL.md');
assert(skill.includes('name: code-reviewer'), 'SKILL.md must contain name: code-reviewer');
assert(skill.includes('description:'), 'SKILL.md must contain a description line');
assert(skill.includes('## Phase 1: Determine Scope'), 'SKILL.md must contain Phase 1: Determine Scope heading');
assert(skill.includes('## Phase 2: Gather Evidence'), 'SKILL.md must contain Phase 2: Gather Evidence heading');
assert(skill.includes('## Phase 3: Evaluate Categories'), 'SKILL.md must contain Phase 3: Evaluate Categories heading');
assert(skill.includes('## Phase 4: Prioritize Findings'), 'SKILL.md must contain Phase 4: Prioritize Findings heading');
assert(skill.includes('## Phase 5: Write Report'), 'SKILL.md must contain Phase 5: Write Report heading');
assert(skill.includes('references/review-rubric.md'), 'SKILL.md must instruct loading references/review-rubric.md');
assert(skill.includes('references/severity-guidelines.md'), 'SKILL.md must instruct loading references/severity-guidelines.md');
assert(skill.includes('references/output-contract.md'), 'SKILL.md must instruct loading references/output-contract.md');
assert(skill.includes('assets/review-template.md'), 'SKILL.md must instruct loading assets/review-template.md');
assert(skill.includes('assets/todo-template.md'), 'SKILL.md must instruct loading assets/todo-template.md');
assert(skill.includes('.planning/REVIEW.md'), 'SKILL.md must reference .planning/REVIEW.md output path');
assert(skill.includes('.planning/REVIEW-TODO.md'), 'SKILL.md must reference .planning/REVIEW-TODO.md output path');

console.log('✓ validate:metadata passed');
