# Security policy

## Supported versions

This repository is a **static pedagogical documentation** project (Markdown + MkDocs + Node tooling). There is no application server shipped for production use beyond optional local preview.

Security-relevant surface:

- GitHub Actions workflows
- Node.js devDependencies used for lint/test
- Python packages used for MkDocs builds
- Example commands and configs inside `docs/` (illustrative only)

| Component | Support |
| --------- | ------- |
| Default branch documentation and tooling | Current |
| Older tags / forks | Best effort only |

## Reporting a vulnerability

**Do not** open a public issue for a real secret leak, credential exposure, or actionable vulnerability in tooling that could harm users.

Prefer one of:

1. GitHub **Security Advisories** / private vulnerability reporting on the repository (if enabled)
2. Contact the repository owner via their GitHub profile for private coordination

Please include:

- Description and impact
- Path or workflow involved
- Steps to reproduce (non-destructive)
- Whether a secret was exposed and whether rotation is needed

You should receive an acknowledgement when the report is seen. There is no paid bug bounty.

## What is not a vulnerability

- Pedagogical **examples** of API keys, passwords, JWT, or vault strings in `docs/**/*.md` that are clearly fake/demo material (see `.gitleaks.toml` allowlist rationale)
- Outdated library versions mentioned **in course text** for learning legacy code (report these as content issues if presented as current best practice without warning)
- Missing features or educational gaps

## Secrets and private data

Contributors must not commit:

- Real API keys, tokens, passwords, private keys, or `.env` files with secrets
- Personal data about real people without consent
- Private home-lab hostnames, Tailscale IPs, or internal webhooks in public docs

If you find a **real** secret in git history:

1. Assume it is compromised
2. Rotate/revoke it at the source
3. Report privately so maintainers can plan history cleanup if required

## Example code safety

Examples should prefer non-destructive commands. Where a command can destroy data (volumes, databases, force-push), the fiche must state the risk explicitly. Never present `docker compose down -v` as a routine step in this project's own maintenance docs.
