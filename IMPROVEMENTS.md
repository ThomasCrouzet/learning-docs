# Learning Docs improvements

Keep generated content boundaries and optional learning paths described in [AGENTS.md](AGENTS.md) and [CONTRIBUTING.md](CONTRIBUTING.md).

| Priority | Component | Improvement and benefit | Observable completion criterion |
| --- | --- | --- | --- |
| P1 | `scripts/run-snippet-runtime.js`, `scripts/lib/snippet-runtime.js` | Separate syntax validation from code execution and define an isolated execution policy for TypeScript examples. | Untrusted examples cannot read the operator HOME, start uncontrolled processes, or reach the network; skipped execution remains explicit. |
| P1 | `scripts/lib/curriculum-v2.js`, curriculum schemas | Add precise diagnostics for malformed links and unsupported path encodings before generation. | Invalid source paths produce actionable file and prerequisite errors without partially replacing generated outputs. |
| P2 | `docs/javascripts/orientation-v2.js` | Version and bound local preferences against the current curriculum manifest. | Removed IDs, corrupt data, unavailable storage, and large stored lists retain usable orientation and reset controls. |
| P2 | `docs/javascripts/extra.js`, browser journeys | Verify repeated instant navigation, listener cleanup, reading restoration, and keyboard behavior. | A repeatable browser artifact shows stable controls across route changes, small screens, and disabled storage. |
| P2 | `review-evidence/`, campaign validators | Link review claims to exact source identities and executed checks. | Stale or incomplete evidence cannot report a completed review merely because expected text remains present. |
| P2 | `mkdocs.yml`, vendored assets, browser reports | Record the full offline rendering contract for math, diagrams, search, and orientation. | A network-captured browser run works without external assets and distinguishes syntax checks from learner-visible behavior. |
