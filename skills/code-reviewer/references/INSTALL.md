# Phase 1 Install and Discovery Smoke Test

Use this procedure to verify the packaged artifact installs cleanly and Pi resolves the correct `code-reviewer` skill.

## 1. Build the package tarball

```bash
npm pack --silent
```

## 2. Unpack the tarball into a temp directory

```bash
TARBALL="$(ls pi-code-reviewer-*.tgz | tail -n 1)"
UNPACK_DIR="$(mktemp -d)"
tar -xzf "$TARBALL" -C "$UNPACK_DIR"
```

## 3. Create a clean temp project and install the unpacked package

```bash
TEST_PROJECT="$(mktemp -d)"
(cd "$TEST_PROJECT" && pi install -l "$UNPACK_DIR/package")
```

The exact install command is:

```bash
pi install -l "$UNPACK_DIR/package"
```

## 4. Run the discovery smoke command

Prefer the headless check when the local Pi environment supports it:

```bash
(cd "$TEST_PROJECT" && pi --no-session -p "/skill:code-reviewer")
```

The exact command string is:

```bash
pi --no-session -p "/skill:code-reviewer"
```

If the environment is not headless-safe, open interactive Pi in the same `TEST_PROJECT` and run `/skill:code-reviewer` manually.

## 5. Verify the active skill identity

Ask the active skill to reply with the exact Phase 1 package marker and package name. Success requires output containing both of these exact strings:

- `PHASE_1_PACKAGE_MARKER: pi-code-reviewer`
- `pi-code-reviewer`

Generic skill resolution without the marker is not a pass, because another installed `code-reviewer` skill could false-pass the smoke test.

## Smoke Test

After installation, verify the skill produces prioritized output:

1. Run the skill against a test repository:
   ```
   /skill:code-reviewer
   ```

2. Check that `.planning/REVIEW.md` contains:
   - A `## Summary` table with category and severity counts
   - Five category sections with findings
   - A `## Prioritized Issue Table` sorted by severity

3. Check that `.planning/REVIEW-TODO.md` contains:
   - Categorized checklist items
   - Severity badges (`**[High]**`, `**[Medium]**`, `**[Low]**`)
   - File references and impact notes

4. Verify the Summary table counts match the actual findings in the category sections.
