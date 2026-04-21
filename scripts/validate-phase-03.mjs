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

function assertIncludes(text, needle, message) {
  assert(text.includes(needle), message);
}

const supersedingDecision = readFile('.planning/phases/03-review-scope-modes/03-SUPERSEDING-DECISION.md');
assertIncludes(
  supersedingDecision,
  'Clean repos with a usable default-branch comparison must resolve to whole-repo mode.',
  '03-SUPERSEDING-DECISION.md must lock clean default-branch repos to whole-repo mode',
);
assertIncludes(
  supersedingDecision,
  'Only use last commit when the default branch cannot be resolved or compared, the repo is otherwise clean, and HEAD~1 exists.',
  '03-SUPERSEDING-DECISION.md must gate last commit behind the documented edge case',
);
assertIncludes(
  supersedingDecision,
  'Treat nonignored untracked files as part of the uncommitted changes candidate set while reporting the winning diff source as uncommitted changes.',
  '03-SUPERSEDING-DECISION.md must include untracked files in uncommitted changes',
);

const skill = readFile('skills/code-reviewer/SKILL.md');
for (const needle of [
  'references/scope-detection.md',
  'Auto-detect the review scope from git state without asking the user or requiring a flag.',
  'mode',
  'diff_source',
  'candidate_paths',
  'file_count',
  'fallback_note',
  'branch diff against the default branch, uncommitted changes (tracked plus nonignored untracked files), then whole-repo when those comparable current-state checks are empty',
  'Only use `last commit` as an edge-case fallback when the default branch cannot be resolved or compared, the repo is otherwise clean, and `HEAD~1` exists.',
  'If the current branch matches the resolved default branch and there are no uncommitted changes, choose whole-repo mode instead of `last commit`.',
  'Respect detected review scope',
  'Carry scope metadata forward',
]) {
  assertIncludes(skill, needle, `SKILL.md must include: ${needle}`);
}

const scopeDetection = readFile('skills/code-reviewer/references/scope-detection.md');
for (const needle of [
  'git rev-parse --is-inside-work-tree',
  'git diff --name-only --diff-filter=ACMR',
  'git ls-files --cached --others --exclude-standard',
  'git ls-files --others --exclude-standard',
  'refs/remotes/origin/HEAD',
  'main',
  'master',
  'Use whole-repo mode for a clean repo on the resolved default branch.',
  'A clean repo with a usable default-branch comparison stops at whole-repo mode and does not continue to last commit.',
  'Only use last commit when the default branch cannot be resolved or compared, the repo is otherwise clean, and HEAD~1 exists.',
  'node_modules',
  'dist',
  'build',
  '__pycache__',
  '.next',
  'coverage',
  'vendor',
  '.terraform',
  'target',
  '.gradle',
  '*.min.js',
  '*.min.css',
]) {
  assertIncludes(scopeDetection, needle, `scope-detection.md must include: ${needle}`);
}

const outputContract = readFile('skills/code-reviewer/references/output-contract.md');
for (const needle of [
  '**Scope:** Whole repository',
  '**Scope:** Changed files — [N] files modified ([diff source])',
  '> **Note:** Git metadata unavailable — falling back to whole-repo review.',
  'File count is based on the final filtered readable candidate-path set, not the raw diff output.',
  'Deleted files are excluded from the count and must not be treated as reviewable evidence targets.',
  'A clean repo with a usable default-branch comparison must render `**Scope:** Whole repository` and must not fall through to `last commit`.',
  'Use `last commit` only for the documented edge case where no usable default-branch comparison exists and the repo is otherwise clean.',
]) {
  assertIncludes(outputContract, needle, `output-contract.md must include: ${needle}`);
}

const reviewTemplate = readFile('skills/code-reviewer/assets/review-template.md');
for (const needle of [
  '**Scope:** Whole repository',
  '**Scope:** Changed files — 7 files modified (branch diff against main)',
  '**Scope:** Changed files — 2 files modified (uncommitted changes)',
  '**Scope:** Changed files — 3 files modified (last commit)',
  'Use this header only for the documented edge case where no usable default-branch comparison exists and the repo is otherwise clean.',
  '> **Note:** Git metadata unavailable — falling back to whole-repo review.',
]) {
  assertIncludes(reviewTemplate, needle, `review-template.md must include: ${needle}`);
}

const referencesReadme = readFile('skills/code-reviewer/references/README.md');
assertIncludes(referencesReadme, 'scope-detection.md', 'references/README.md must mention scope-detection.md');

console.log('✓ validate:phase-03 passed');
