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
assert(readme.includes('Phase 1 validates installation/discovery now and does not promise the full review workflow yet.'), 'README.md must keep Phase 1 scope honest');

const installDoc = readFile('skills/code-reviewer/references/INSTALL.md');
assert(installDoc.includes('npm pack --silent'), 'INSTALL.md must include npm pack --silent');
assert(installDoc.includes('pi install -l "$UNPACK_DIR/package"'), 'INSTALL.md must include pi install -l "$UNPACK_DIR/package"');
assert(installDoc.includes('pi --no-session -p "/skill:code-reviewer"'), 'INSTALL.md must include pi --no-session -p "/skill:code-reviewer"');
assert(installDoc.includes('PHASE_1_PACKAGE_MARKER: pi-code-reviewer'), 'INSTALL.md must include the exact Phase 1 marker');
assert(installDoc.includes('Success requires output containing both of these exact strings:'), 'INSTALL.md must state that marker output is required for a pass');
assert(installDoc.includes('Generic skill resolution without the marker is not a pass'), 'INSTALL.md must explain why generic skill resolution is insufficient');

console.log('✓ validate:docs passed');
