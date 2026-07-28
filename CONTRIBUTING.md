# Contributing to Learning Docs

Thanks for helping improve this pedagogical wiki.

**Language**: the learning content under `docs/` is **primarily French**. Governance files (this one, `README`, `SECURITY`, issue templates) may be in English for international contributors. Prefer French for new or edited fiches unless a page is already bilingual.

## Before you start

1. Read [README.md](README.md) and [docs/a-propos.md](docs/a-propos.md) (origin, limits, and AI provenance).
2. Follow the fiche quality bar documented below (structure, frontmatter, "En bref", navigation, accents, no em dashes).
3. Use **npm** only (`package-lock.json`). Do not introduce yarn/pnpm/bun lockfiles.

## Development setup

```bash
git clone https://github.com/ThomasCrouzet/learning-docs.git
cd learning-docs
npm ci
docker compose up -d
```

Wiki: `http://localhost:8100` (MkDocs Material).

**Requirements**: Node.js >= 22, Docker (for the wiki server / strict build).

### Useful commands

| Task | Command |
| ---- | ------- |
| Unit tests | `npm test` |
| Full validation | `npm run validate` |
| Lint Markdown only | `npm run lint` |
| Regenerate cursus map | `npm run generate:cursus-map` |
| Documentary audit | `npm run audit:docs` |
| Strict site build | `docker run --rm -v "$(pwd)":/docs squidfunk/mkdocs-material:9.7.6 build --strict` |

## What to contribute

High-value contributions:

- Factual corrections (wrong command, obsolete version, false claim)
- Broken internal links and navigation fixes
- Clearer prerequisites, exercises, and expected results
- Accessibility improvements
- Tooling/tests that catch real regressions

Avoid:

- Marketing fluff, slogans, or decorative badges without value
- Mass machine-translated dumps of whole curricula
- Secrets, personal data, private hostnames, or real credentials in examples
- Lowering lint/test thresholds to make CI green

## Fiche quality bar

Each pedagogical fiche should keep:

- YAML frontmatter: `tags`, `description`, `estimated_time`, `fiche_number`, `total_fiches`, `cursus`
- H1 title, blockquote **En bref**, Prérequis, Objectif, Concepts, steps when relevant
- Realistic pitfalls, checklist, exercise + solution when the fiche teaches a skill
- Bidirectional **Navigation** links
- French accents in prose; language tags on fenced code blocks
- No em dash characters (`-`); use simple hyphens (`-`)

After structural moves (add/remove/renumber fiches), run:

```bash
npm run generate:cursus-map
npm run lint:consistency
npm run lint:cursus-map
```

and update `mkdocs.yml` navigation if needed.

## Pull requests

1. Create a focused branch from the default branch.
2. Keep commits small and readable.
3. Run `npm run validate` locally.
4. Describe **what** changed and **why**, with paths of fiches touched.
5. For factual claims, cite primary sources (official docs, release notes) in the PR description when useful.
6. Do not add AI co-author trailers or promotional tool branding in commits.

## Reporting issues

Use the issue templates when available:

- Factual error
- Outdated content
- Broken link
- Accessibility problem

Include: path or URL of the fiche, relevant excerpt, tool version, OS, and expected vs observed behaviour.

## Editorial and AI policy

The majority of the existing corpus was generated or substantially expanded with AI assistance. New content may also use AI assistance, but contributors and maintainers remain responsible for every proposed change and merge. Automated lint and tests prove structure and many technical gates; they **do not** certify every factual sentence. See [docs/a-propos.md](docs/a-propos.md).

## Licence

By contributing, you agree that your contributions are licensed under the same terms as the project (see [LICENSE](LICENSE) and [NOTICE](NOTICE)).
