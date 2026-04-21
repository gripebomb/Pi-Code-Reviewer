# Code Review TODO

**Generated:** 2026-04-21
**Repository:** fixture-b

## Code Quality

- [ ] **[Medium]** Sanitize error responses in `authenticateToken()` to avoid leaking internals (`src/auth.js:55-64`)
- [ ] **[Medium]** Remove raw database error details from API responses (`src/api.js:18-20`)

## Refactoring

- [ ] **[Medium]** Consolidate `validatePassword()` and `validatePasswordStrict()` into single function (`src/auth.js:9-22`)
- [ ] **[Medium]** Extract database access into a service layer (`src/api.js`)

## Documentation

- [ ] **[Low]** Add API endpoint documentation with examples to README (`README.md`)

## Security

- [ ] **[High]** Replace SQL string concatenation with parameterized queries (`src/api.js`)
- [ ] **[High]** Strengthen password validation requirements (`src/auth.js`)
- [ ] **[Medium]** Add input validation to all API endpoints (`src/api.js`)
- [ ] **[Medium]** Implement rate limiting on authentication endpoints (`src/auth.js`)
- [ ] **[Medium]** Update outdated dependencies (`package.json`)
- [ ] **[Low]** Increase bcrypt rounds to 12+ (`src/auth.js`)
- [ ] **[Low]** Remove default JWT secret fallback (`src/auth.js:3`)

## Test Coverage

No action items.
