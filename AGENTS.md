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

## References by task

- Contribution workflow and review criteria: `CONTRIBUTING.md`.
- Navigation and source layout: `mkdocs.yml` and `README.md`.
- Document model and formatting: `.codex/references/editorial.md`.
- Local automation: `.codex/hooks/` and `/Users/thomas/bin/ai`.
