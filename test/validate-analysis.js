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

// ─── CLI ────────────────────────────────────────────────────────────────────

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
const lines = reviewContent.split('\n');

// ─── State ──────────────────────────────────────────────────────────────────

const results = {
  structure: { passed: true, issues: [] },
  paths: { passed: true, issues: [] },
  severity: { passed: true, issues: [] },
};

const CATEGORIES = [
  'Code Quality',
  'Refactoring',
  'Documentation',
  'Security',
  'Test Coverage',
];

const SEVERITIES = ['High', 'Medium', 'Low'];

// ─── Helpers ────────────────────────────────────────────────────────────────

function findSection(startIdx, headingPattern) {
  for (let i = startIdx; i < lines.length; i++) {
    if (headingPattern.test(lines[i])) return i;
  }
  return -1;
}

function getSectionRange(startIdx, headingRegex) {
  const start = findSection(startIdx, headingRegex);
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

function validateStructure() {
  console.log('\n📋 STRUCTURE VALIDATION\n');

  for (const category of CATEGORIES) {
    const range = getSectionRange(0, new RegExp(`^##\\s+${category}$`));
    if (!range) {
      results.structure.issues.push(`Missing category section: ${category}`);
      results.structure.passed = false;
      console.log(`  ❌ Missing category: ${category}`);
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
        results.structure.issues.push(`${category}: missing summary assessment`);
        results.structure.passed = false;
        console.log(`  ❌ ${category}: missing summary assessment`);
      } else {
        console.log(`  ⚠️  ${category}: no findings (summary check skipped)`);
      }
    } else {
      console.log(`  ✅ ${category}: section + summary present`);
    }
  }

  // Check severity sub-sections are omitted only when empty
  for (const category of CATEGORIES) {
    const range = getSectionRange(0, new RegExp(`^##\\s+${category}$`));
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
        results.structure.issues.push(`${category}: ### ${sev} is present but has no findings`);
        results.structure.passed = false;
        console.log(`  ❌ ${category}: ### ${sev} has no findings (should be omitted)`);
      }
    }
  }

  if (results.structure.passed) {
    console.log('\n  ✅ Structure checks PASSED');
  } else {
    console.log(`\n  ❌ Structure checks FAILED (${results.structure.issues.length} issues)`);
  }
}

// ─── 2. Validate Path References ────────────────────────────────────────────

function validatePathReferences() {
  console.log('\n📁 PATH REFERENCE VALIDATION\n');

  let totalFindings = 0;
  let findingsWithPaths = 0;
  let findingsWithoutPaths = 0;
  const invalidPaths = [];

  for (const category of CATEGORIES) {
    const range = getSectionRange(0, new RegExp(`^##\\s+${category}$`));
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

  console.log(`  Total findings: ${totalFindings}`);
  console.log(`  Findings with paths: ${findingsWithPaths} (${pathRate.toFixed(1)}%)`);
  console.log(`  Findings without paths: ${findingsWithoutPaths}`);

  if (invalidPaths.length > 0) {
    results.paths.passed = false;
    results.paths.issues.push(`${invalidPaths.length} invalid path reference(s)`);
    console.log(`\n  ❌ Invalid paths (${invalidPaths.length}):`);
    for (const inv of invalidPaths) {
      console.log(`     - ${inv.path} (${inv.category})`);
    }
  } else {
    console.log(`  ✅ All path references resolve correctly`);
  }

  if (totalFindings > 0 && pathRate < 80) {
    results.paths.passed = false;
    results.paths.issues.push(`Path reference rate ${pathRate.toFixed(1)}% is below 80% threshold`);
    console.log(`  ❌ Path reference rate below 80% threshold`);
  } else if (totalFindings > 0) {
    console.log(`  ✅ Path reference rate meets 80% threshold`);
  }

  if (results.paths.passed) {
    console.log('\n  ✅ Path checks PASSED');
  } else {
    console.log(`\n  ❌ Path checks FAILED (${results.paths.issues.length} issues)`);
  }
}

// ─── 3. Validate Severity ───────────────────────────────────────────────────

function validateSeverity() {
  console.log('\n⚠️  SEVERITY VALIDATION\n');

  const counts = {};
  for (const cat of CATEGORIES) counts[cat] = { High: 0, Medium: 0, Low: 0 };

  for (const category of CATEGORIES) {
    const range = getSectionRange(0, new RegExp(`^##\\s+${category}$`));
    if (!range) continue;

    const findings = extractFindings(range.content);
    for (const f of findings) {
      counts[category][f.severity]++;
    }
  }

  // Print counts table
  console.log('  Findings per category/severity:');
  console.log('  ' + '-'.repeat(55));
  console.log(`  ${'Category'.padEnd(18)} ${'High'.padStart(6)} ${'Medium'.padStart(8)} ${'Low'.padStart(6)}`);
  console.log('  ' + '-'.repeat(55));
  for (const cat of CATEGORIES) {
    const { High, Medium, Low } = counts[cat];
    console.log(`  ${cat.padEnd(18)} ${String(High).padStart(6)} ${String(Medium).padStart(8)} ${String(Low).padStart(6)}`);
  }
  console.log('  ' + '-'.repeat(55));

  // Flag categories with only High findings (possible severity inflation)
  for (const cat of CATEGORIES) {
    const { High, Medium, Low } = counts[cat];
    const total = High + Medium + Low;
    if (total > 0 && High > 0 && Medium === 0 && Low === 0) {
      results.severity.issues.push(`${cat}: only High findings — possible severity inflation`);
      results.severity.passed = false;
      console.log(`\n  ⚠️  ${cat}: only High findings — possible severity inflation`);
    }
  }

  // Flag categories with no findings but missing summary
  for (const cat of CATEGORIES) {
    const range = getSectionRange(0, new RegExp(`^##\\s+${cat}$`));
    if (!range) continue;
    const { High, Medium, Low } = counts[cat];
    const total = High + Medium + Low;
    if (total === 0) {
      const hasSummary = range.content.split('\n').slice(1).some(l => l.trim().length > 10 && !/^###/.test(l));
      if (!hasSummary) {
        results.severity.issues.push(`${cat}: no findings and no summary assessment`);
        results.severity.passed = false;
        console.log(`  ❌ ${cat}: no findings but missing summary assessment`);
      }
    }
  }

  if (results.severity.passed) {
    console.log('\n  ✅ Severity checks PASSED');
  } else {
    console.log(`\n  ❌ Severity checks FAILED (${results.severity.issues.length} issues)`);
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

console.log(`\n═══════════════════════════════════════════════════════════════`);
console.log(`  VALIDATE ANALYSIS`);
console.log(`  Review:  ${reviewPath}`);
console.log(`  Fixture: ${fixtureDir}`);
console.log(`═══════════════════════════════════════════════════════════════`);

validateStructure();
validatePathReferences();
validateSeverity();

// ─── Summary ────────────────────────────────────────────────────────────────

const allPassed = results.structure.passed && results.paths.passed && results.severity.passed;

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  SUMMARY');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`  Structure:  ${results.structure.passed ? '✅ PASS' : '❌ FAIL'} (${results.structure.issues.length} issues)`);
console.log(`  Paths:      ${results.paths.passed ? '✅ PASS' : '❌ FAIL'} (${results.paths.issues.length} issues)`);
console.log(`  Severity:   ${results.severity.passed ? '✅ PASS' : '❌ FAIL'} (${results.severity.issues.length} issues)`);
console.log('───────────────────────────────────────────────────────────────');
console.log(`  OVERALL:    ${allPassed ? '✅ ALL CHECKS PASSED' : '❌ SOME CHECKS FAILED'}`);
console.log('═══════════════════════════════════════════════════════════════\n');

process.exit(allPassed ? 0 : 1);
