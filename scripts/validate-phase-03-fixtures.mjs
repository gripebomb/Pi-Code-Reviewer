import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const packCommand = 'npm pack --silent';
const installCommand = 'pi install -l';
const skillCommand = 'pi --no-session -p "/skill:code-reviewer"';
const gitignoreContent = '.pi/\n.planning/\n';
const fallbackNote = '> **Note:** Git metadata unavailable — falling back to whole-repo review.';
const wholeRepoScope = '**Scope:** Whole repository';
const branchDiffScope = '**Scope:** Changed files — 7 files modified (branch diff against main)';
const trackedEditsScope = '**Scope:** Changed files — 2 files modified (uncommitted changes)';
const untrackedFileScope = '**Scope:** Changed files — 1 files modified (uncommitted changes)';
const lastCommitScope = '**Scope:** Changed files — 3 files modified (last commit)';
const cachePath = path.join(root, '.planning/phases/03-review-scope-modes/03-VALIDATION-RUN.json');
const cacheInputs = [
  '.planning/phases/03-review-scope-modes/03-SUPERSEDING-DECISION.md',
  'package.json',
  'scripts/validate-output.mjs',
  'skills/code-reviewer/SKILL.md',
  'skills/code-reviewer/references/scope-detection.md',
  'skills/code-reviewer/references/output-contract.md',
  'skills/code-reviewer/assets/review-template.md',
];

function fail(message, error) {
  console.error(`✗ ${message}`);
  if (error?.stdout) process.stderr.write(String(error.stdout));
  if (error?.stderr) process.stderr.write(String(error.stderr));
  process.exit(1);
}

function computeFingerprint() {
  const hash = crypto.createHash('sha256');
  for (const relativePath of cacheInputs) {
    const absolutePath = path.join(root, relativePath);
    assert(fs.existsSync(absolutePath), `Missing cache input: ${relativePath}`);
    hash.update(relativePath);
    hash.update('\n');
    hash.update(fs.readFileSync(absolutePath));
    hash.update('\n');
  }
  return hash.digest('hex');
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function run(command, args, options = {}) {
  const cwd = options.cwd ?? root;
  try {
    return execFileSync(command, args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      env: {
        ...process.env,
        ...(options.env ?? {}),
      },
    }).trim();
  } catch (error) {
    fail(`Command failed in ${cwd}: ${command} ${args.join(' ')}`, error);
  }
}

function mkdirp(target) {
  fs.mkdirSync(target, { recursive: true });
}

function writeFile(target, content) {
  mkdirp(path.dirname(target));
  fs.writeFileSync(target, content);
}

function writeFiles(baseDir, files) {
  for (const [relativePath, content] of Object.entries(files)) {
    writeFile(path.join(baseDir, relativePath), content);
  }
}

function gitInit(dir, branch) {
  run('git', ['init', '-b', branch], { cwd: dir });
  run('git', ['config', 'user.email', 'fixture@example.com'], { cwd: dir });
  run('git', ['config', 'user.name', 'Phase 3 Fixture'], { cwd: dir });
}

function gitCommitAll(dir, message) {
  run('git', ['add', '.'], { cwd: dir });
  run('git', ['commit', '-m', message], { cwd: dir });
}

function installLocalPackage(dir, packageDir) {
  run('pi', ['install', '-l', packageDir], { cwd: dir });
}

function reviewPath(dir) {
  return path.join(dir, '.planning/REVIEW.md');
}

function todoPath(dir) {
  return path.join(dir, '.planning/REVIEW-TODO.md');
}

function runSkill(dir) {
  return run('pi', ['--no-session', '-p', '/skill:code-reviewer'], { cwd: dir });
}

function runSkillUntilArtifactsExist(dir, attempts = 2) {
  let lastOutput = '';
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    lastOutput = runSkill(dir);
    if (fs.existsSync(reviewPath(dir)) && fs.existsSync(todoPath(dir))) {
      return lastOutput;
    }
  }

  fail(`Skill did not generate review artifacts in ${dir} after ${attempts} attempt(s). Last output:\n${lastOutput}`);
}

function readReview(dir) {
  const target = reviewPath(dir);
  assert(fs.existsSync(target), `Missing generated review file: ${target}`);
  return fs.readFileSync(target, 'utf8');
}

function validateGeneratedOutput(dir) {
  run('node', ['scripts/validate-output.mjs', reviewPath(dir)], { cwd: root });
}

function baseProjectFiles(name) {
  return {
    'package.json': JSON.stringify({
      name,
      version: '1.0.0',
      private: true,
      scripts: {
        start: 'node src/index.js',
      },
    }, null, 2) + '\n',
    'README.md': `# ${name}\n\nTiny fixture repo with intentionally weak documentation.\n`,
    'src/index.js': `const { loadConfig } = require('./config');\n\nfunction main(user) {\n  const config = loadConfig();\n  console.log('running', user, config.apiKey);\n  return user.trim();\n}\n\nmain('fixture-user');\n\nmodule.exports = { main };\n`,
    'src/config.js': `function loadConfig() {\n  return {\n    apiKey: 'sk-fixture-secret',\n    mode: 'development',\n  };\n}\n\nmodule.exports = { loadConfig };\n`,
    'src/auth.js': `function authenticate(user) {\n  if (!user) {\n    return true;\n  }\n\n  return Boolean(user);\n}\n\nmodule.exports = { authenticate };\n`,
    'src/utils.js': `function normalizeName(name) {\n  return String(name || '').trim().toLowerCase();\n}\n\nmodule.exports = { normalizeName };\n`,
    'docs/notes.md': '# Notes\n\nNo setup steps, architecture notes, or test instructions yet.\n',
  };
}

function featureBranchFiles(name) {
  return {
    'package.json': JSON.stringify({
      name,
      version: '1.1.0',
      private: true,
      scripts: {
        start: 'node src/index.js',
        lint: 'node src/index.js',
      },
    }, null, 2) + '\n',
    'README.md': `# ${name}\n\nFeature branch update with almost no contributor guidance.\n`,
    'src/index.js': `const { loadConfig } = require('./config');\nconst { authenticate } = require('./auth');\n\nfunction main(user) {\n  const config = loadConfig();\n  console.log('feature branch running', user, config.apiKey);\n  return authenticate(user) ? config.mode : 'denied';\n}\n\nmain('feature-user');\n\nmodule.exports = { main };\n`,
    'src/config.js': `function loadConfig() {\n  return {\n    apiKey: 'sk-feature-secret',\n    mode: 'feature',\n    retries: 0,\n  };\n}\n\nmodule.exports = { loadConfig };\n`,
    'src/auth.js': `function authenticate(user) {\n  if (!user) {\n    return true;\n  }\n\n  return user !== 'blocked';\n}\n\nmodule.exports = { authenticate };\n`,
    'src/utils.js': `function normalizeName(name) {\n  return String(name || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');\n}\n\nmodule.exports = { normalizeName };\n`,
    'docs/notes.md': '# Feature Notes\n\nThis branch changes behavior but still skips setup, security, and testing guidance.\n',
  };
}

function trackedEditFiles() {
  return {
    'src/index.js': "const { loadConfig } = require('./config');\n\nfunction main(user) {\n  const config = loadConfig();\n  console.log('tracked edits running', user, config.apiKey);\n  return `${user}:${config.mode}`;\n}\n\nmain('tracked-user');\n\nmodule.exports = { main };\n",
    'src/config.js': `function loadConfig() {\n  return {\n    apiKey: 'sk-tracked-secret',\n    mode: 'tracked-edits',\n  };\n}\n\nmodule.exports = { loadConfig };\n`,
  };
}

function lastCommitFiles() {
  return {
    'README.md': '# last-commit-fixture\n\nSecond commit changed this file without adding real usage documentation.\n',
    'src/index.js': `const { loadConfig } = require('./config');\n\nfunction main(user) {\n  const config = loadConfig();\n  console.log('last commit fallback', user, config.apiKey);\n  return config.mode;\n}\n\nmain('last-commit-user');\n\nmodule.exports = { main };\n`,
    'src/config.js': `function loadConfig() {\n  return {\n    apiKey: 'sk-last-commit-secret',\n    mode: 'last-commit',\n  };\n}\n\nmodule.exports = { loadConfig };\n`,
  };
}

function setupCleanDefaultBranch(dir) {
  gitInit(dir, 'main');
  writeFile(path.join(dir, '.gitignore'), gitignoreContent);
  writeFiles(dir, baseProjectFiles('clean-default-branch'));
  gitCommitAll(dir, 'initial commit');
}

function setupFeatureBranchDiff(dir) {
  gitInit(dir, 'main');
  writeFile(path.join(dir, '.gitignore'), gitignoreContent);
  writeFiles(dir, baseProjectFiles('feature-branch-diff'));
  gitCommitAll(dir, 'baseline main');
  run('git', ['checkout', '-b', 'feature/scope-test'], { cwd: dir });
  writeFiles(dir, featureBranchFiles('feature-branch-diff'));
  gitCommitAll(dir, 'feature branch changes');
}

function setupTrackedUncommittedEdits(dir) {
  gitInit(dir, 'main');
  writeFile(path.join(dir, '.gitignore'), gitignoreContent);
  writeFiles(dir, baseProjectFiles('tracked-uncommitted-edits'));
  gitCommitAll(dir, 'baseline main');
  writeFiles(dir, trackedEditFiles());
}

function setupNonignoredUntrackedFile(dir) {
  gitInit(dir, 'main');
  writeFile(path.join(dir, '.gitignore'), gitignoreContent);
  writeFiles(dir, baseProjectFiles('nonignored-untracked-file'));
  gitCommitAll(dir, 'baseline main');
  writeFile(
    path.join(dir, 'src/new-helper.js'),
    `function buildToken(user) {\n  return \'plain-token-\' + user;\n}\n\nmodule.exports = { buildToken };\n`,
  );
}

function setupLastCommitFallback(dir) {
  gitInit(dir, 'review/scope-test');
  writeFile(path.join(dir, '.gitignore'), gitignoreContent);
  writeFiles(dir, baseProjectFiles('last-commit-fallback'));
  gitCommitAll(dir, 'first review commit');
  writeFiles(dir, lastCommitFiles());
  gitCommitAll(dir, 'second review commit');
}

function setupNonGitFallback(dir) {
  writeFiles(dir, baseProjectFiles('non-git-fallback'));
}

function setupNoCommitFallback(dir) {
  gitInit(dir, 'main');
  writeFile(path.join(dir, '.gitignore'), gitignoreContent);
  writeFiles(dir, baseProjectFiles('no-commit-fallback'));
}

const scenarios = [
  {
    id: 'clean-default-branch',
    expectedScope: wholeRepoScope,
    setup: setupCleanDefaultBranch,
    assertReview(review) {
      assert(review.includes(wholeRepoScope), 'clean-default-branch must use whole-repo scope');
      assert(!review.includes('last commit'), 'clean-default-branch must not mention last commit');
      assert(!review.includes('Git metadata unavailable'), 'clean-default-branch must not include the git fallback note');
    },
  },
  {
    id: 'feature-branch-diff',
    expectedScope: branchDiffScope,
    setup: setupFeatureBranchDiff,
    assertReview(review) {
      assert(review.includes(branchDiffScope), 'feature-branch-diff must use the branch diff scope header');
    },
  },
  {
    id: 'tracked-uncommitted-edits',
    expectedScope: trackedEditsScope,
    setup: setupTrackedUncommittedEdits,
    assertReview(review) {
      assert(review.includes(trackedEditsScope), 'tracked-uncommitted-edits must use the uncommitted changes scope header');
    },
  },
  {
    id: 'nonignored-untracked-file',
    expectedScope: untrackedFileScope,
    setup: setupNonignoredUntrackedFile,
    assertReview(review) {
      assert(review.includes(untrackedFileScope), 'nonignored-untracked-file must use the uncommitted changes scope header for one file');
    },
  },
  {
    id: 'last-commit-fallback',
    expectedScope: lastCommitScope,
    setup: setupLastCommitFallback,
    assertReview(review) {
      assert(review.includes(lastCommitScope), 'last-commit-fallback must use the last commit scope header');
    },
  },
  {
    id: 'non-git-fallback',
    expectedScope: wholeRepoScope,
    setup: setupNonGitFallback,
    assertReview(review) {
      assert(review.includes(wholeRepoScope), 'non-git-fallback must use whole-repo scope');
      assert(review.includes(fallbackNote), 'non-git-fallback must include the git fallback note');
    },
  },
  {
    id: 'no-commit-fallback',
    expectedScope: wholeRepoScope,
    setup: setupNoCommitFallback,
    assertReview(review) {
      assert(review.includes(wholeRepoScope), 'no-commit-fallback must use whole-repo scope');
      assert(review.includes(fallbackNote), 'no-commit-fallback must include the git fallback note');
    },
  },
];

const fingerprint = computeFingerprint();

function tryUseCache() {
  if (!fs.existsSync(cachePath)) {
    return false;
  }

  try {
    const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    if (cache?.fingerprint !== fingerprint) {
      return false;
    }

    console.log('✓ validate:phase-03:fixtures passed');
    console.log(`Using cached real fixture run from ${cache.updated}.`);
    return true;
  } catch {
    return false;
  }
}

if (tryUseCache()) {
  process.exit(0);
}

const tarballName = run('npm', ['pack', '--silent']);
const tarball = path.resolve(root, tarballName.split('\n').filter(Boolean).pop());
assert(fs.existsSync(tarball), `Packed tarball not found: ${tarball}`);

const unpackDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pi-code-reviewer-phase-03-unpack-'));
run('tar', ['-xzf', tarball, '-C', unpackDir]);
const packageDir = path.join(unpackDir, 'package');
assert(fs.existsSync(packageDir), `Unpacked package directory not found: ${packageDir}`);

for (const scenario of scenarios) {
  const scenarioDir = fs.mkdtempSync(path.join(os.tmpdir(), `pi-code-reviewer-${scenario.id}-`));
  scenario.setup(scenarioDir);
  installLocalPackage(scenarioDir, packageDir);
  runSkillUntilArtifactsExist(scenarioDir, 2);
  validateGeneratedOutput(scenarioDir);

  const review = readReview(scenarioDir);
  assert(review.includes(scenario.expectedScope), `${scenario.id} review must contain the expected scope line`);
  scenario.assertReview(review);
}

writeFile(cachePath, `${JSON.stringify({
  updated: new Date().toISOString(),
  fingerprint,
  mode: 'real-fixture-run',
  scenarios: scenarios.map(({ id, expectedScope }) => ({ id, expectedScope })),
}, null, 2)}\n`);

console.log('✓ validate:phase-03:fixtures passed');
