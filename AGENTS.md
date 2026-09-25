# AGENTS.md

## Scope

Learning Docs is an offline programming course in French Markdown.
Keep explicit teaching, generated file boundaries, and language suitable for the learner.
The French exception applies to learning content. Use English and ASD-STE100 for agent and maintenance documentation.

## Editorial rules

- Keep frontmatter, `En bref`, prerequisites, and links in both navigation directions.
- Explain prerequisites and concepts with concrete examples.
- Do not manually edit generated course files.
- Keep French accents in French prose. Omit accents from identifiers and code.
- Do not use U+2014 in controlled content.

## Commands

```bash
npm run lint
npm run lint:frontmatter
npm run lint:curriculum
npm test
npm run validate           # For a shared change or release.
```

Post-edit hooks process the applicable documents. No global validator runs at session end.
Use the narrowest check for one document. Use `npm run validate` for navigation, shared rules, or a release across modules.

GitHub Pages artifacts and deployment run only on GitHub. Gitea runs the same source and browser validation jobs.
Include `[skip deploy]` in the pushed head commit message for validation-only publication.

## Testing policy

- Never write unit tests after you write code.
- Highly prefer E2E tests as the sole testing mechanism.
- Use E2E tests to verify complex features through observable results.
- At the end of each E2E run, produce a verifiable and repeatable artifact.
- Record the command, source revision, local changes, environment, fixtures, and results with the artifact.
- If isolation is necessary, first document all identified failure modes. Then write the tests and implementation.
- Keep an isolated test only for a concrete failure that E2E tests cannot detect.
- Do not add tests for coverage percentages, type contracts, dependency behavior, or mocked call sequences alone.

Run browser tests with `npm run test:e2e -- --workers=1` against an isolated MkDocs candidate.
Serve the candidate on loopback. Set `BASE_URL` to that server.
Playwright writes `audit-artifacts/playwright-report/` and `audit-artifacts/playwright-results/`.
Save the run context beside these artifacts.

Browser coverage checks selected routes, accessibility, and orientation.
It does not exercise malformed Markdown, invalid catalogs, audit evidence, or snippet rejection.
Keep isolated checks for those failures, text corruption, broken navigation, incorrect reading times, and generated document errors.
Keep corpus-wide content checks where browser tests only inspect selected pages.
Conditional skips and permissive browser assertions do not establish equivalent coverage.

Use `npm test -- --maxWorkers=1` for the isolated suite, with file filters for narrow changes.
Use a disposable source copy for the full suite: the snippet CLI rewrites `audit-reports/snippet-runtime-latest.*`.

## References by task

- Contribution workflow and review criteria: `CONTRIBUTING.md`.
- Navigation and source layout: `mkdocs.yml` and `README.md`.
- Document model and formatting: `.codex/references/editorial.md`.
- Local automation: `.codex/hooks/` and `/Users/thomas/bin/ai`.
