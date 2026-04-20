import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'package.json',
  'README.md',
  'skills/code-reviewer/SKILL.md',
  'skills/code-reviewer/references/README.md',
  'skills/code-reviewer/references/INSTALL.md',
  'skills/code-reviewer/assets/README.md',
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
assert(skill.includes('/skill:code-reviewer'), 'SKILL.md must mention /skill:code-reviewer');
assert(skill.includes('PHASE_1_PACKAGE_MARKER: pi-code-reviewer'), 'SKILL.md must contain the exact Phase 1 marker');

console.log('✓ validate:metadata passed');
