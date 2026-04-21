#!/usr/bin/env node

/**
 * validate-analysis.js
 *
 * Validates generated review reports (REVIEW.md) against requirements.
 *
 * Usage:
 *   node test/validate-analysis.js <review.md> <fixture-dir>
 *
 * Example:
 *   node test/validate-analysis.js test/fixtures/fixture-a/.planning/REVIEW.md test/fixtures/fixture-a/
 */

const fs = require('fs');
const path = require('path');

// ─── State ──────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'Code Quality',
  'Refactoring',
  'Documentation',
  'Security',
  'Test Coverage',
];

const SEVERITIES = ['High', 'Medium', 'Low'];

// ─── Helpers ────────────────────────────────────────────────────────────────

function findSection(startIdx, headingPattern, lines) {
  for (let i = startIdx; i < lines.length; i++) {
    if (headingPattern.test(lines[i])) return i;
  }
  return -1;
}

function getSectionRange(startIdx, headingRegex, lines) {
  const start = findSection(startIdx, headingRegex, lines);
  if (start === -1) return null;
  // Find next ## heading or end of file
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return { start, end, content: lines.slice(start, end).join('\n') };
}

function extractFindings(sectionContent) {
  const findings = [];
  const sectionLines = sectionContent.split('\n');
  let currentSeverity = null;

  for (const line of sectionLines) {
    const sevMatch = line.match(/^###\s+(High|Medium|Low)$/);
    if (sevMatch) {
      currentSeverity = sevMatch[1];
      continue;
    }

    // Finding lines start with "- **"
    if (line.trim().startsWith('- **') && currentSeverity) {
      findings.push({ line: line.trim(), severity: currentSeverity });
    }
  }

  return findings;
}

function extractBacktickPaths(str) {
  const paths = [];
  const regex = /`([^`]+)`/g;
  let match;
  while ((match = regex.exec(str)) !== null) {
    const candidate = match[1].trim();
    // Filter out severity labels and short non-path strings
    if (/^(High|Medium|Low|\*\*)/i.test(candidate)) continue;
    if (candidate.length < 3) continue;
    // Look for path-like strings (contain / or . or end with known extensions)
    if (candidate.includes('/') || candidate.includes('.') || /\.(js|ts|json|md)$/.test(candidate)) {
      paths.push(candidate);
    }
  }
  return paths;
}

function pathExistsInFixture(fixtureBase, refPath) {
  // Handle line number suffixes like src/config.js:42
  const cleanPath = refPath.replace(/:\d+(-\d+)?$/, '');

  // Handle wildcards — check if directory exists
  if (cleanPath.includes('*')) {
    const dirPart = cleanPath.split('*')[0];
    const fullDir = path.join(fixtureBase, dirPart);
    return fs.existsSync(fullDir);
  }

  const fullPath = path.join(fixtureBase, cleanPath);
  return fs.existsSync(fullPath);
}

// ─── 1. Validate Structure ─────────────────────────────────────────────────

function validateStructure(reviewContent) {
  const lines = reviewContent.split('\n');
  const issues = [];
  let passed = true;

  for (const category of CATEGORIES) {
    const range = getSectionRange(0, new RegExp(`^##\\s+${category}$`), lines);
    if (!range) {
      issues.push(`Missing category section: ${category}`);
      passed = false;
      continue;
    }

    // Check for summary assessment (1-2 sentences before any ### or - **)
    const sectionBody = range.content.split('\n').slice(1); // skip heading
    let foundSummary = false;
    let foundSeverityHeading = false;

    for (const line of sectionBody) {
      if (/^###\s/.test(line)) {
        foundSeverityHeading = true;
        break;
      }
      if (line.trim().startsWith('- **')) break;
      if (line.trim().length > 10 && !foundSeverityHeading) {
        foundSummary = true;
      }
    }

    if (!foundSummary) {
      // Allow if section is very short (edge case: no findings)
      const hasFindings = extractFindings(range.content).length > 0;
      if (hasFindings) {
        issues.push(`${category}: missing summary assessment`);
        passed = false;
      }
    }
  }

  // Check severity sub-sections are omitted only when empty
  for (const category of CATEGORIES) {
    const range = getSectionRange(0, new RegExp(`^##\\s+${category}$`), lines);
    if (!range) continue;

    const sectionLines = range.content.split('\n');
    const presentSeverities = new Set();
    for (const line of sectionLines) {
      const match = line.match(/^###\s+(High|Medium|Low)$/);
      if (match) presentSeverities.add(match[1]);
    }

    const findings = extractFindings(range.content);
    const severitiesWithFindings = new Set(findings.map(f => f.severity));

    for (const sev of presentSeverities) {
      if (!severitiesWithFindings.has(sev)) {
        issues.push(`${category}: ### ${sev} is present but has no findings`);
        passed = false;
      }
    }
  }

  return { passed, issues };
}

// ─── 2. Validate Path References ────────────────────────────────────────────

function validatePathReferences(reviewContent, fixtureDir) {
  const lines = reviewContent.split('\n');
  const issues = [];
  let passed = true;

  let totalFindings = 0;
  let findingsWithPaths = 0;
  let findingsWithoutPaths = 0;
  const invalidPaths = [];

  for (const category of CATEGORIES) {
    const range = getSectionRange(0, new RegExp(`^##\\s+${category}$`), lines);
    if (!range) continue;

    const findings = extractFindings(range.content);
    for (const finding of findings) {
      totalFindings++;
      const paths = extractBacktickPaths(finding.line);

      if (paths.length === 0) {
        findingsWithoutPaths++;
        continue;
      }

      findingsWithPaths++;
      for (const p of paths) {
        if (!pathExistsInFixture(fixtureDir, p)) {
          invalidPaths.push({ category, path: p, line: finding.line.slice(0, 80) });
        }
      }
    }
  }

  const pathRate = totalFindings > 0 ? (findingsWithPaths / totalFindings) * 100 : 0;

  if (invalidPaths.length > 0) {
    passed = false;
    issues.push(`${invalidPaths.length} invalid path reference(s)`);
  }

  if (totalFindings > 0 && pathRate < 80) {
    passed = false;
    issues.push(`Path reference rate ${pathRate.toFixed(1)}% is below 80% threshold`);
  }

  return { passed, issues, totalFindings, findingsWithPaths, findingsWithoutPaths, pathRate, invalidPaths };
}

// ─── 3. Validate Severity ───────────────────────────────────────────────────

function validateSeverity(reviewContent) {
  const lines = reviewContent.split('\n');
  const issues = [];
  let passed = true;

  const counts = {};
  for (const cat of CATEGORIES) counts[cat] = { High: 0, Medium: 0, Low: 0 };

  for (const category of CATEGORIES) {
    const range = getSectionRange(0, new RegExp(`^##\\s+${category}$`), lines);
    if (!range) continue;

    const findings = extractFindings(range.content);
    for (const f of findings) {
      counts[category][f.severity]++;
    }
  }

  // Flag categories with only High findings (possible severity inflation)
  for (const cat of CATEGORIES) {
    const { High, Medium, Low } = counts[cat];
    const total = High + Medium + Low;
    if (total > 0 && High > 0 && Medium === 0 && Low === 0) {
      issues.push(`${cat}: only High findings — possible severity inflation`);
      passed = false;
    }
  }

  // Flag categories with no findings but missing summary
  for (const cat of CATEGORIES) {
    const range = getSectionRange(0, new RegExp(`^##\\s+${cat}$`), lines);
    if (!range) continue;
    const { High, Medium, Low } = counts[cat];
    const total = High + Medium + Low;
    if (total === 0) {
      const hasSummary = range.content.split('\n').slice(1).some(l => l.trim().length > 10 && !/^###/.test(l));
      if (!hasSummary) {
        issues.push(`${cat}: no findings and no summary assessment`);
        passed = false;
      }
    }
  }

  return { passed, issues, counts };
}

// ─── Module Exports ─────────────────────────────────────────────────────────

module.exports = {
  validateStructure,
  validatePathReferences,
  validateSeverity,
  CATEGORIES,
  SEVERITIES,
  extractFindings,
  extractBacktickPaths,
  pathExistsInFixture,
};

// ─── CLI ────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const [reviewPath, fixtureDir] = process.argv.slice(2);

  if (!reviewPath || !fixtureDir) {
    console.error('Usage: node test/validate-analysis.js <review.md> <fixture-dir>');
    process.exit(1);
  }

  if (!fs.existsSync(reviewPath)) {
    console.error(`Review file not found: ${reviewPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(fixtureDir)) {
    console.error(`Fixture directory not found: ${fixtureDir}`);
    process.exit(1);
  }

  const reviewContent = fs.readFileSync(reviewPath, 'utf8');

  const structureResult = validateStructure(reviewContent);
  const pathsResult = validatePathReferences(reviewContent, fixtureDir);
  const severityResult = validateSeverity(reviewContent);

  const allPassed = structureResult.passed && pathsResult.passed && severityResult.passed;

  process.exit(allPassed ? 0 : 1);
}