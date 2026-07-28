# Learning Docs

Pedagogical documentation for learning software development, infrastructure, DevOps, and related topics **with explicit structure and progressive steps**.

**Language of the learning content: French** (`docs/`). This README and other contributor-facing governance files are in English so international contributors can orient themselves quickly.

| Metric (recalculated from the repo) | Value |
| ----------------------------------- | ----: |
| Pedagogical fiches (structure gate) | **604** |
| Cursus (generated map) | **64** |
| Markdown pages under `docs/` | **~700** |

Authoritative counts live in [`docs/carte-cursus.md`](docs/carte-cursus.md) (`npm run generate:cursus-map`). Do not treat marketing round numbers as source of truth.

Public site (when deployed): <https://thomascrouzet.github.io/learning-docs/>

---

## What this is

- A large set of Markdown **fiches** (lesson sheets) with the same predictable sections: prerequisites, objectives, concepts, practical steps, pitfalls, checklist, exercise, navigation.
- Built as an **MkDocs Material** wiki, with **Node.js** validators and tests.
- Designed for **self-paced** learning, including offline use after you clone or host the site locally.
- Written with **neurodivergent learners in mind**, using stable patterns, explicit instructions, short steps, and reduced implicit context.

## AI provenance and editorial responsibility

The editorial rules favour explicit prerequisites, a stable structure, concrete examples, and reduced cognitive load. These choices are intended to make the material more compatible with common needs among neurodivergent learners. **This is not** a claim that the wiki is universally adapted to every neurodivergent person, nor a substitute for professional pedagogy, clinical guidance, or dedicated user research.

The **majority of the corpus was generated or substantially expanded with AI assistance**. Human review is progressive and remains incomplete. Automated checks catch structure, many links, and tooling regressions, but they **do not** prove that every technical sentence or code example is correct.

This provenance is a core part of the project, not a footnote. The repository publishes its review method, known limits, and freshness policy so readers can judge the level of confidence for themselves. Audit tools can generate machine-readable reports locally, but generated audit artefacts are not versioned. See [docs/a-propos.md](docs/a-propos.md) and [docs/politique-fraicheur.md](docs/politique-fraicheur.md).

## Domains (overview)

Web stack (Docker, PHP, Symfony, PostgreSQL, JavaScript, TypeScript, React), quality (testing, architecture, API design), infrastructure (CI/CD, Kubernetes, Ansible, monitoring, cloud), systems and Epitech tracks, cybersecurity, AI, Faust (audio DSP), crypto-currencies (critical tone, not hype), project management, GDPR intro, UX, and reference sheets.

Full map: [`docs/carte-cursus.md`](docs/carte-cursus.md).

---

## Quick start (clean clone)

```bash
git clone https://github.com/ThomasCrouzet/learning-docs.git
cd learning-docs
npm ci
docker compose up -d
```

Open `http://localhost:8100`.

**Requirements**: Node.js >= 22, Docker. Package manager: **npm** only (`package-lock.json`).

### Validation and build

| Task | Command |
| ---- | ------- |
| Unit tests | `npm test` |
| Full gate (tests + lint suite) | `npm run validate` |
| Documentary audit | `npm run audit:docs` |
| Snippet runtime sample | `npm run audit:snippets` |
| Regenerate cursus map | `npm run generate:cursus-map` |
| Strict MkDocs build | `docker run --rm -v "$(pwd)":/docs squidfunk/mkdocs-material:9.7.6 build --strict` |
| Or with local Python | `pip install -r requirements.txt && mkdocs build --strict` |

The principal reference stack versions are summarized in [docs/a-propos.md](docs/a-propos.md). Prefer LTS or maintained lines over bleeding edge unless a fiche is explicitly about legacy.

---

## Contributing and support

- [CONTRIBUTING.md](CONTRIBUTING.md) - how to propose changes
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [SECURITY.md](SECURITY.md) - vulnerability reporting
- Issue templates under `.github/ISSUE_TEMPLATE/` (factual error, outdated content, broken link, accessibility)

## Licence

| Part | Licence |
| ---- | ------- |
| Pedagogical content (`docs/`) | [CC BY 4.0](LICENSE) |
| Project tooling (`scripts/`, CI helpers, …) | [MIT](LICENSE-CODE) |
| Third-party assets (KaTeX and Mermaid) | [NOTICE](NOTICE) |

## Repository layout (short)

```text
docs/           # wiki content (French)
scripts/        # validators and generators
e2e/            # Playwright accessibility checks
mkdocs.yml      # site navigation and theme
docker-compose.yml
```

Local maintainer prompts, generated audit reports, and one-off work plans are not part of the published teaching surface; prefer the public docs and scripts above.
