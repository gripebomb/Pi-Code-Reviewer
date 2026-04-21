#!/usr/bin/env node

/**
 * pi-code-reviewer CLI
 *
 * Usage:
 *   pi-code-reviewer [options]
 *
 * This is a thin wrapper that prints instructions for using the skill
 * inside Pi. The actual review logic lives in the skill instructions.
 */

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
pi-code-reviewer — Code review skill for Pi

Usage:
  pi-code-reviewer [options]

Options:
  --help, -h     Show this help message
  --version, -v  Show version number

This package is designed to be used as a Pi skill.
Install it with:

  pi install pi-code-reviewer

Then invoke it inside Pi with:

  /skill:code-reviewer

The skill will analyze your repository and produce:
  - .planning/REVIEW.md — comprehensive review report
  - .planning/REVIEW-TODO.md — actionable checklist
`);
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  const pkg = require('../package.json');
  console.log(pkg.version);
  process.exit(0);
}

console.log(`
pi-code-reviewer — Code review skill for Pi

This package is designed to be used as a Pi skill.
Install it with:

  pi install pi-code-reviewer

Then invoke it inside Pi with:

  /skill:code-reviewer

For more information:
  pi-code-reviewer --help
`);
process.exit(0);
