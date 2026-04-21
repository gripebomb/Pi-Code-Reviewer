#!/usr/bin/env node

/**
 * Publish and Verify Pipeline
 *
 * Automates the full publish workflow:
 *   1. Pre-publish validation (release-readiness checks)
 *   2. Version check
 *   3. Pack test (dry-run)
 *   4. Publish to npm
 *   5. Post-publish verification (install from registry, verify contents)
 *   6. Cleanup and summary
 *
 * Usage:
 *   node scripts/publish-and-verify.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const __filename = fileURLToPath(import.meta.url);
const root = path.dirname(path.dirname(__filename));

let failedStep = null;
let allPassed = true;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    ...options,
  });
  if (result.error) {
    throw result.error;
  }
  return result;
}

function step(name) {
  console.log(`\n▶ ${name}`);
}

function pass(message) {
  console.log(`  ✓ ${message}`);
}

function fail(message) {
  console.log(`  ✗ ${message}`);
  allPassed = false;
  if (!failedStep) {
    failedStep = message;
  }
}

function warn(message) {
  console.log(`  ⚠ ${message}`);
}

console.log('Publish and Verify Pipeline');
console.log('==========================');

// ── Step 1: Pre-publish validation ──
step('Step 1: Pre-publish validation');

try {
  const validateResult = run('node', ['scripts/validate-phase-05.mjs']);
  if (validateResult.status === 0) {
    pass('Release-readiness validation passed');
  } else {
    fail('Release-readiness validation failed');
    console.error(validateResult.stderr || validateResult.stdout);
  }
} catch (err) {
  fail(`Validation script error: ${err.message}`);
}

// Verify git working directory is clean
try {
  const gitStatus = run('git', ['status', '--short']);
  const clean = !gitStatus.stdout.trim();
  if (clean) {
    pass('Git working directory is clean');
  } else {
    fail('Git working directory has uncommitted changes');
    console.log(gitStatus.stdout);
  }
} catch (err) {
  warn(`Could not check git status: ${err.message}`);
}

// ── Step 2: Version check ──
step('Step 2: Version check');

const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;
pass(`Current version: ${version}`);

// Check if version is already published (optional)
try {
  const viewResult = run('npm', ['view', pkg.name, 'version']);
  const publishedVersion = viewResult.stdout.trim();
  if (publishedVersion === version) {
    fail(`Version ${version} is already published on npm`);
  } else {
    pass(`Version ${version} is not yet published (latest: ${publishedVersion || 'none'})`);
  }
} catch (err) {
  // npm view fails if package doesn't exist yet — that's fine
  pass(`Package not yet on npm (or npm view failed)`);
}

// ── Step 3: Pack test ──
step('Step 3: Pack test (dry-run)');

try {
  const packResult = run('npm', ['pack', '--dry-run']);
  const packOutput = packResult.stdout + packResult.stderr;

  const hasReadme = packOutput.includes('README.md');
  const hasSkills = packOutput.includes('skills/');
  const hasBin = packOutput.includes('bin/');
  const hasPackageJson = packOutput.includes('package.json');

  if (hasReadme) pass('Tarball includes README.md');
  else fail('Tarball missing README.md');

  if (hasSkills) pass('Tarball includes skills/');
  else fail('Tarball missing skills/');

  if (hasBin) pass('Tarball includes bin/');
  else fail('Tarball missing bin/');

  if (hasPackageJson) pass('Tarball includes package.json');
  else fail('Tarball missing package.json');

  // Check exclusions
  const hasTest = packOutput.includes('test/');
  const hasScripts = packOutput.includes('scripts/');
  const hasPlanning = packOutput.includes('.planning/');

  if (!hasTest) pass('Tarball excludes test/');
  else fail('Tarball unexpectedly includes test/');

  if (!hasScripts) pass('Tarball excludes scripts/');
  else fail('Tarball unexpectedly includes scripts/');

  if (!hasPlanning) pass('Tarball excludes .planning/');
  else fail('Tarball unexpectedly includes .planning/');
} catch (err) {
  fail(`Pack test failed: ${err.message}`);
}

// ── Step 4: Publish ──
step('Step 4: Publish to npm');

if (!allPassed) {
  fail('Skipping publish due to earlier failures');
} else {
  try {
    const publishResult = run('npm', ['publish', '--access', 'public']);
    if (publishResult.status === 0) {
      pass('Package published successfully');
      if (publishResult.stdout) {
        console.log(`  ${publishResult.stdout.trim()}`);
      }
    } else {
      fail(`npm publish failed: ${publishResult.stderr || publishResult.stdout}`);
    }
  } catch (err) {
    fail(`npm publish error: ${err.message}`);
  }
}

// ── Step 5: Post-publish verification ──
step('Step 5: Post-publish verification');

if (!allPassed) {
  fail('Skipping post-publish verification due to earlier failures');
} else {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pi-cr-verify-'));
  pass(`Created temp directory: ${tmpDir}`);

  try {
    // Initialize a temp package and install from registry
    const initResult = run('npm', ['init', '-y'], { cwd: tmpDir });
    if (initResult.status !== 0) {
      throw new Error(`npm init failed: ${initResult.stderr}`);
    }

    const installResult = run('npm', ['install', `${pkg.name}@latest`], {
      cwd: tmpDir,
      timeout: 120000,
    });
    if (installResult.status === 0) {
      pass(`Installed ${pkg.name}@latest from registry`);
    } else {
      throw new Error(`npm install failed: ${installResult.stderr || installResult.stdout}`);
    }

    const installedPkgPath = path.join(tmpDir, 'node_modules', pkg.name);

    // Verify SKILL.md exists
    const skillMdPath = path.join(installedPkgPath, 'skills', 'code-reviewer', 'SKILL.md');
    if (fs.existsSync(skillMdPath)) {
      pass('SKILL.md exists in installed package');
    } else {
      fail('SKILL.md missing in installed package');
    }

    // Verify bin wrapper exists
    const binPath = path.join(installedPkgPath, 'bin', 'pi-code-reviewer.js');
    if (fs.existsSync(binPath)) {
      pass('bin/pi-code-reviewer.js exists in installed package');
    } else {
      fail('bin/pi-code-reviewer.js missing in installed package');
    }

    // Verify CLI works
    const npxResult = run('npx', ['pi-code-reviewer', '--version'], { cwd: tmpDir });
    const npxVersion = npxResult.stdout.trim();
    if (npxResult.status === 0 && npxVersion === version) {
      pass(`npx pi-code-reviewer --version returns ${npxVersion}`);
    } else {
      fail(`npx pi-code-reviewer --version returned "${npxVersion}" (expected ${version})`);
    }

    // Verify skill discoverability (pi.skills field)
    const installedPkgJsonPath = path.join(installedPkgPath, 'package.json');
    const installedPkg = JSON.parse(fs.readFileSync(installedPkgJsonPath, 'utf8'));
    if (installedPkg.pi && installedPkg.pi.skills) {
      pass(`pi.skills field present: ${JSON.stringify(installedPkg.pi.skills)}`);
    } else {
      fail('pi.skills field missing in installed package.json');
    }

    // Verify package contents (no test fixtures or scripts)
    const installedRoot = fs.readdirSync(installedPkgPath);
    const hasTestDir = installedRoot.includes('test');
    const hasScriptsDir = installedRoot.includes('scripts');
    const hasPlanningDir = installedRoot.includes('.planning');

    if (!hasTestDir) pass('Installed package excludes test/');
    else fail('Installed package unexpectedly includes test/');

    if (!hasScriptsDir) pass('Installed package excludes scripts/');
    else fail('Installed package unexpectedly includes scripts/');

    if (!hasPlanningDir) pass('Installed package excludes .planning/');
    else fail('Installed package unexpectedly includes .planning/');
  } catch (err) {
    fail(`Post-publish verification error: ${err.message}`);
  } finally {
    // ── Step 6: Cleanup ──
    step('Step 6: Cleanup');
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
      pass(`Removed temp directory: ${tmpDir}`);
    } catch (err) {
      warn(`Could not remove temp directory: ${err.message}`);
    }
  }
}

// ── Summary ──
console.log('\n-------------------------------------');
if (allPassed) {
  console.log('\n✓ Package published and verified successfully');
  console.log(`  Version: ${version}`);
  console.log(`  Registry: https://www.npmjs.com/package/${pkg.name}`);
  process.exit(0);
} else {
  console.log(`\n✗ Pipeline failed at step: ${failedStep || 'unknown'}`);
  process.exit(1);
}
