# Code Review: fixture-b

**Date:** 2026-04-21
**Scope:** Whole repository

## Summary

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Code Quality | 0 | 2 | 0 | 2 |
| Refactoring | 0 | 2 | 0 | 2 |
| Documentation | 0 | 0 | 1 | 1 |
| Security | 2 | 3 | 2 | 7 |
| Test Coverage | 0 | 0 | 0 | 0 |
| **Total** | **2** | **7** | **3** | **12** |

## Code Quality

The codebase has inconsistent error handling and verbose error responses that leak internal details to clients.

### Medium

- **Verbose error messages leak internals** (`src/auth.js:44-49`, `src/auth.js:58-64`)
  The `authenticateToken()` function returns detailed error messages including expected token format, internal error codes, and stack traces. This aids attackers in understanding the auth mechanism.

- **Database error details exposed to clients** (`src/api.js:21-22`)
  The `/users` POST endpoint returns the raw database error message and the executed SQL query to the client on failure.

## Refactoring

Significant duplication and tight coupling make the codebase harder to maintain safely.

### Medium

- **Duplicate password validation logic** (`src/auth.js:5-21`)
  `validatePassword()` and `validatePasswordStrict()` implement nearly identical checks with slightly different error messages. Consolidate into a single validation function.

- **Tight coupling between routes and database** (`src/api.js`)
  All route handlers directly access the `db` object. There is no service layer, making the routes hard to test and the database hard to swap.

## Documentation

The README covers basic setup but lacks API usage guidance.

### Low

- **Missing API documentation** (`README.md`)
  The README describes setup but provides no endpoint documentation, request/response examples, or authentication usage. API consumers must read source code to understand how to use the service.

## Security

Multiple security vulnerabilities are present, from weak authentication to SQL injection.

### High

- **SQL injection via string concatenation** (`src/api.js:16-17`, `src/api.js:29-30`, `src/api.js:44-45`)
  The `/users` POST, GET, and DELETE endpoints build SQL queries by directly interpolating user input. An attacker can inject arbitrary SQL. Use parameterized queries.
  > Cross-reference: Also noted in **Code Quality** as "Database error details exposed to clients" — the same endpoints that leak errors also accept raw input.

- **Weak password validation** (`src/auth.js:5-8`)
  Passwords are accepted with a minimum length of 4 characters and no complexity requirements. This is below current security standards.
  > Cross-reference: Also noted in **Refactoring** as "Duplicate password validation logic" — the weak validation is duplicated across two functions.

### Medium

- **No input validation on endpoints** (`src/api.js`)
  Request parameters and body fields are used directly without validation or sanitization. Missing fields cause database errors rather than clean 400 responses.

- **Missing rate limiting on authentication** (`src/auth.js:68-78`)
  The `authenticateToken()` and `requireAdmin()` functions have no rate limiting. Brute force attacks against token validation are not mitigated.

- **Outdated dependencies with known vulnerabilities** (`package.json`)
  `lodash@4.17.15` has known CVE-2020-8203. `express@4.16.0` and `sqlite3@4.0.0` are significantly behind current versions.

### Low

- **Weak bcrypt rounds** (`src/auth.js:24`)
  `bcrypt.hashSync(password, 8)` uses only 8 rounds. While not immediately critical, increasing to 12+ rounds improves hash strength.

- **Default JWT secret fallback** (`src/auth.js:3`)
  The `JWT_SECRET` falls back to a hardcoded default if the environment variable is missing. In production this would allow token forgery.

## Test Coverage

No test files were found in the repository. Tests may be absent, generated elsewhere, or stored outside the scanned scope.

## Prioritized Issue Table

| # | Severity | Category | Finding | File |
|---|----------|----------|---------|------|
| 1 | **High** | Security | SQL injection via string concatenation | `src/api.js` |
| 2 | **High** | Security | Weak password validation | `src/auth.js:5-8` |
| 3 | **Medium** | Code Quality | Verbose error messages leak internals | `src/auth.js` |
| 4 | **Medium** | Code Quality | Database error details exposed to clients | `src/api.js:21-22` |
| 5 | **Medium** | Refactoring | Duplicate password validation logic | `src/auth.js:5-21` |
| 6 | **Medium** | Refactoring | Tight coupling between routes and database | `src/api.js` |
| 7 | **Medium** | Security | No input validation on endpoints | `src/api.js` |
| 8 | **Medium** | Security | Missing rate limiting on authentication | `src/auth.js:68-78` |
| 9 | **Medium** | Security | Outdated dependencies with known vulnerabilities | `package.json` |
| 10 | **Low** | Documentation | Missing API documentation | `README.md` |
| 11 | **Low** | Security | Weak bcrypt rounds | `src/auth.js:24` |
| 12 | **Low** | Security | Default JWT secret fallback | `src/auth.js:3` |
