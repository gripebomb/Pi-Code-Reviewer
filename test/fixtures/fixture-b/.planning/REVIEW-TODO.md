# Code Review TODO

**Generated:** 2026-04-21
**Repository:** fixture-b

## Code Quality

- [ ] **[Medium]** Sanitize error responses in `authenticateToken()` to avoid leaking internals (`src/auth.js:44-49`, `src/auth.js:58-64`)
  Verbose errors aid attackers in understanding the auth mechanism.
- [ ] **[Medium]** Remove raw database error details from API responses (`src/api.js:21-22`)
  The executed SQL query and raw error message are returned to clients on failure.

## Refactoring

- [ ] **[Medium]** Consolidate `validatePassword()` and `validatePasswordStrict()` into single function (`src/auth.js:5-21`)
  Nearly identical checks with different error messages create maintenance burden.
- [ ] **[Medium]** Extract database access into a service layer (`src/api.js`)
  Routes directly access `db`, making testing and database swaps difficult.

## Documentation

- [ ] **[Low]** Add API endpoint documentation with examples to README (`README.md`)
  API consumers must read source code to understand how to use the service.

## Security

- [ ] **[High]** Replace SQL string concatenation with parameterized queries (`src/api.js`)
  Direct interpolation of user input allows arbitrary SQL injection.
- [ ] **[High]** Strengthen password validation requirements (`src/auth.js`)
  Minimum length of 4 characters with no complexity requirements is below security standards.
- [ ] **[Medium]** Add input validation to all API endpoints (`src/api.js`)
  Missing fields cause database errors rather than clean 400 responses.
- [ ] **[Medium]** Implement rate limiting on authentication endpoints (`src/auth.js`)
  Brute force attacks against token validation are not mitigated.
- [ ] **[Medium]** Update outdated dependencies (`package.json`)
  `lodash@4.17.15` has known CVE-2020-8203; `express` and `sqlite3` are significantly behind.
- [ ] **[Low]** Increase bcrypt rounds to 12+ (`src/auth.js:24`)
  Only 8 rounds reduces hash strength against brute force.
- [ ] **[Low]** Remove default JWT secret fallback (`src/auth.js:3`)
  Hardcoded default allows token forgery if environment variable is missing.

## Test Coverage

No action items.
