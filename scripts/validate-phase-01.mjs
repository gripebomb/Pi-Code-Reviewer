import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const validationRunPath = path.join(root, '.planning/phases/01-package-foundation/01-VALIDATION-RUN.json');
const requiredPackagedFiles = [
  'package/package.json',
  'package/README.md',
  'package/skills/code-reviewer/SKILL.md',
  'package/skills/code-reviewer/references/README.md',
  'package/skills/code-reviewer/references/INSTALL.md',
  'package/skills/code-reviewer/assets/README.md',
];

function fail(message, error) {
  console.error(`✗ ${message}`);
  if (error?.stdout) process.stderr.write(String(error.stdout));
  if (error?.stderr) process.stderr.write(String(error.stderr));
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function run(command, args, options = {}) {
  try {
    return execFileSync(command, args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      ...options,
    }).trim();
  } catch (error) {
    fail(`Command failed: ${command} ${args.join(' ')}`, error);
  }
}

run('npm', ['run', 'validate:metadata']);
run('npm', ['run', 'validate:docs']);

for (const file of ['package.json', 'README.md', 'skills/code-reviewer/SKILL.md', 'skills/code-reviewer/references/README.md', 'skills/code-reviewer/references/INSTALL.md', 'skills/code-reviewer/assets/README.md']) {
  assert(fs.existsSync(path.join(root, file)), `Missing required source file: ${file}`);
}

const tarballName = run('npm', ['pack', '--silent']).split('\n').filter(Boolean).pop();
assert(tarballName, 'npm pack --silent did not return a tarball name');
const tarball = path.resolve(root, tarballName);
assert(fs.existsSync(tarball), `Tarball not found: ${tarball}`);

const tarContents = run('tar', ['-tzf', tarball]).split('\n').filter(Boolean);
for (const entry of requiredPackagedFiles) {
  assert(tarContents.includes(entry), `Tarball is missing required entry: ${entry}`);
}

const unpackDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pi-code-reviewer-unpack-'));
run('tar', ['-xzf', tarball, '-C', unpackDir]);
const packageDir = path.join(unpackDir, 'package');
assert(fs.existsSync(packageDir), `Unpacked package directory not found: ${packageDir}`);

const testProject = fs.mkdtempSync(path.join(os.tmpdir(), 'pi-code-reviewer-test-project-'));
run('pi', ['install', '-l', packageDir], { cwd: testProject });

const settingsPath = path.join(testProject, '.pi/settings.json');
assert(fs.existsSync(settingsPath), `.pi/settings.json was not created in ${testProject}`);
const settingsText = fs.readFileSync(settingsPath, 'utf8');
assert(settingsText.includes(packageDir), `.pi/settings.json does not record the unpacked package path: ${packageDir}`);

const output = {
  tarball,
  unpackDir,
  packageDir,
  testProject,
  packageName: 'pi-code-reviewer',
  expectedMarker: 'PHASE_1_PACKAGE_MARKER: pi-code-reviewer',
};

fs.writeFileSync(validationRunPath, `${JSON.stringify(output, null, 2)}\n`);
console.log('✓ validate:phase-01 passed');
console.log(JSON.stringify(output, null, 2));
