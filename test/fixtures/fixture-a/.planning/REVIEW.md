# Code Review: fixture-a

**Date:** 2026-04-21
**Scope:** Whole repository

## Summary

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Code Quality | 1 | 2 | 2 | 5 |
| Refactoring | 0 | 2 | 0 | 2 |
| Documentation | 0 | 1 | 0 | 1 |
| Security | 1 | 0 | 1 | 2 |
| Test Coverage | 0 | 0 | 0 | 0 |
| **Total** | **2** | **5** | **3** | **10** |

## Code Quality

The codebase has several error handling gaps and inconsistent async patterns that could lead to runtime failures.

### High

- **Unhandled promise rejection in `startServer()`** (`src/app.js:14`)
  The `loadConfig()` call returns a Promise, but `startServer()` never attaches a `.catch()` handler. If the config file is missing or malformed, the unhandled rejection will crash the process.

### Medium

- **Deep nesting in `loadConfig()`** (`src/config.js:14-28`)
  The `loadConfig()` function has 4+ levels of nested conditionals for debug/trace configuration. This makes the logic hard to follow and test.

- **Mixed async patterns** (`src/app.js`)
  `loadConfig()` uses callback-style `fs.readFile` internally but exposes a Promise API. The caller in `app.js` uses `.then()` without `.catch()`. Standardizing on async/await with try/catch would make error paths clearer.

### Low

- **Unused import `os`** (`src/app.js:3`)
  The `os` module is imported but never referenced. Removing it reduces noise.

- **Console.log in production code** (`src/app.js:19-25`)
  Debug logging statements appear in the server startup path. These clutter logs and may leak internal state. Consider gating behind a debug flag or removing.

## Refactoring

The config module has grown beyond a single responsibility and would benefit from extraction.

### Medium

- **Long function `loadConfig()`** (`src/config.js:7-35`)
  The function handles file reading, parsing, and nested conditional configuration in one body. Consider extracting the nested trace logic into a helper.

- **Config validation mixed with initialization** (`src/config.js`)
  `validateConfig()` and `initializeApp()` are in the same file but serve different purposes. Separating validation utilities from app setup would clarify boundaries.

## Documentation

The README is incomplete for a new contributor.

### Medium

- **Missing install and run instructions** (`README.md`)
  The README describes what the project is but provides no setup steps, dependency installation, or how to start the server. New contributors cannot get started without reading source code.

## Security

A hardcoded secret and information leakage are present.

### High

- **Hardcoded API key in source code** (`src/config.js:5`)
  The `API_KEY` is committed directly to the repository. This exposes credentials to anyone with read access. Move to environment variables and rotate the exposed key.

### Low

- **Environment info exposed via config endpoint** (`src/app.js:37-40`)
  The `/config` endpoint returns `process.env.NODE_ENV` without additional checks. While not a direct vulnerability, it leaks deployment context.

## Test Coverage

No test files were found in the repository. Tests may be absent, generated elsewhere, or stored outside the scanned scope.

## Prioritized Issue Table

| # | Severity | Category | Finding | File |
|---|----------|----------|---------|------|
| 1 | **High** | Code Quality | Unhandled promise rejection in `startServer()` | `src/app.js:14` |
| 2 | **High** | Security | Hardcoded API key in source code | `src/config.js:5` |
| 3 | **Medium** | Code Quality | Deep nesting in `loadConfig()` | `src/config.js:14-28` |
| 4 | **Medium** | Code Quality | Mixed async patterns | `src/app.js` |
| 5 | **Medium** | Refactoring | Long function `loadConfig()` | `src/config.js:7-35` |
| 6 | **Medium** | Refactoring | Config validation mixed with initialization | `src/config.js` |
| 7 | **Medium** | Documentation | Missing install and run instructions | `README.md` |
| 8 | **Low** | Code Quality | Unused import `os` | `src/app.js:3` |
| 9 | **Low** | Code Quality | Console.log in production code | `src/app.js:19-25` |
| 10 | **Low** | Security | Environment info exposed via config endpoint | `src/app.js:37-40` |
