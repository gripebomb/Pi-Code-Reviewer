# Code Review TODO

**Generated:** 2026-04-21
**Repository:** fixture-a

## Code Quality

- [ ] **[High]** Add error handling for `loadConfig()` promise rejection in `startServer()` (`src/app.js:14`)
  Unhandled rejections crash the process when config is missing or malformed.
- [ ] **[Medium]** Reduce nesting in `loadConfig()` debug/trace logic (`src/config.js:14-28`)
  Deep nesting makes the logic hard to follow and test.
- [ ] **[Medium]** Standardize async patterns and add try/catch in `app.js`
  Mixed callback/Promise styles create unclear error paths.
- [ ] **[Low]** Remove unused `os` import (`src/app.js:3`)
  Reduces noise and clarifies actual dependencies.
- [ ] **[Low]** Remove or gate debug `console.log` statements (`src/app.js:19-25`)
  Debug logs clutter production output and may leak state.

## Refactoring

- [ ] **[Medium]** Extract trace-level configuration logic from `loadConfig()` into helper (`src/config.js`)
  Separates file-reading concerns from trace-level computation.
- [ ] **[Medium]** Separate config validation from app initialization (`src/config.js`)
  Clarifies module boundaries and improves testability.

## Documentation

- [ ] **[Medium]** Add install and run instructions to README (`README.md`)
  New contributors cannot get started without reading source code.

## Security

- [ ] **[High]** Move hardcoded API key to environment variable (`src/config.js:5`)
  Exposed credentials must be rotated and removed from source control.
- [ ] **[Low]** Review `/config` endpoint for information leakage (`src/app.js:37-40`)
  Returns `process.env.NODE_ENV` without access controls.

## Test Coverage

No action items.
