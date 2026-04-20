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

const readme = readFile('README.md');
assert(readme.includes('pi install npm:pi-code-reviewer'), 'README.md must include pi install npm:pi-code-reviewer');
assert(readme.includes('npm install -g pi-code-reviewer'), 'README.md must include npm install -g pi-code-reviewer');
assert(readme.includes('/skill:code-reviewer'), 'README.md must include /skill:code-reviewer');
assert(readme.includes('./skills/code-reviewer/references/INSTALL.md'), 'README.md must link to the detailed INSTALL.md guide');
assert(readme.includes('Plain npm installation documents package availability but is not guaranteed Pi registration by itself.'), 'README.md must state that plain npm installation is not guaranteed Pi registration by itself');

const installDoc = readFile('skills/code-reviewer/references/INSTALL.md');
assert(installDoc.includes('npm pack --silent'), 'INSTALL.md must include npm pack --silent');
assert(installDoc.includes('pi install -l "$UNPACK_DIR/package"'), 'INSTALL.md must include pi install -l "$UNPACK_DIR/package"');
assert(installDoc.includes('pi --no-session -p "/skill:code-reviewer"'), 'INSTALL.md must include pi --no-session -p "/skill:code-reviewer"');

const rubric = readFile('skills/code-reviewer/references/review-rubric.md');
assert(rubric.includes('Code Quality') && rubric.includes('Refactoring') && rubric.includes('Documentation') && rubric.includes('Security') && rubric.includes('Test Coverage'), 'review-rubric.md must cover all 5 categories');

const severity = readFile('skills/code-reviewer/references/severity-guidelines.md');
assert(severity.includes('## High') && severity.includes('## Medium') && severity.includes('## Low'), 'severity-guidelines.md must define High, Medium, Low levels');

const outputContract = readFile('skills/code-reviewer/references/output-contract.md');
assert(outputContract.includes('REVIEW.md') && outputContract.includes('REVIEW-TODO.md'), 'output-contract.md must specify both output files');

const reviewTemplate = readFile('skills/code-reviewer/assets/review-template.md');
assert(reviewTemplate.includes('### High') && reviewTemplate.includes('### Medium') && reviewTemplate.includes('### Low'), 'review-template.md must show severity sub-headers');

const todoTemplate = readFile('skills/code-reviewer/assets/todo-template.md');
assert(todoTemplate.includes('- [ ]') && todoTemplate.includes('**[High]**') && todoTemplate.includes('**[Medium]**') && todoTemplate.includes('**[Low]**'), 'todo-template.md must show checkbox format with severity badges');

console.log('✓ validate:docs passed');
