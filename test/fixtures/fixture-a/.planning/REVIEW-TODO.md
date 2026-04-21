# Code Review TODO

**Generated:** 2026-04-21
**Repository:** fixture-a

## Code Quality

- [ ] **[High]** Add error handling for `loadConfig()` promise rejection in `startServer()` (`src/app.js:15`)
- [ ] **[Medium]** Reduce nesting in `loadConfig()` debug/trace logic (`src/config.js:14-28`)
- [ ] **[Medium]** Standardize async patterns and add try/catch in `app.js`
- [ ] **[Low]** Remove unused `os` import (`src/app.js:3`)
- [ ] **[Low]** Remove or gate debug `console.log` statements (`src/app.js:24-27`)

## Refactoring

- [ ] **[Medium]** Extract trace-level configuration logic from `loadConfig()` into helper (`src/config.js`)
- [ ] **[Medium]** Separate config validation from app initialization (`src/config.js`)

## Documentation

- [ ] **[Medium]** Add install and run instructions to README (`README.md`)

## Security

- [ ] **[High]** Move hardcoded API key to environment variable (`src/config.js:5`)
- [ ] **[Low]** Review `/config` endpoint for information leakage (`src/app.js:30-32`)

## Test Coverage

No action items.
