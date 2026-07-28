#!/bin/bash
# Optional local cron helper: daily validate + optional notification webhook.
# Not required for public CI. Do not hardcode private hostnames.
# Example cron: 0 3 * * * /path/to/learning-docs/scripts/nightly-validate.sh

set -euo pipefail

cd "$(dirname "$0")/.." || exit 1

RESULT=$(npm run validate 2>&1) || true
EXIT=$?

if [ "$EXIT" -ne 0 ]; then
  if [[ -n "${LEARNING_DOCS_NOTIFY_URL:-}" ]]; then
    curl -s \
      -H "Title: Learning Docs - Validation failed" \
      -H "Priority: high" \
      -H "Tags: x" \
      -d "$(echo "$RESULT" | tail -20)" \
      "$LEARNING_DOCS_NOTIFY_URL" >/dev/null 2>&1 || true
  else
    echo "Validation failed (exit $EXIT). Set LEARNING_DOCS_NOTIFY_URL to push a notification." >&2
    echo "$RESULT" | tail -40
  fi
fi

exit "$EXIT"
