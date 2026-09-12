#!/bin/bash
# Audit hebdomadaire optionnel via la façade Codex.
# Hors CI publique.

set -euo pipefail

cd "$(dirname "$0")/.." || exit 1

RECENT=$(git log --since="7 days ago" --name-only --pretty=format: -- 'docs/**/*.md' | sort -u | grep -v '^$' || true)

if [ -z "$RECENT" ]; then
  echo "Aucune fiche modifiee cette semaine."
  exit 0
fi

FILE_LIST=$(echo "$RECENT" | tr '\n' ', ')
FILE_COUNT=$(echo "$RECENT" | wc -l | tr -d ' ')

echo "Audit de $FILE_COUNT fiche(s) modifiee(s) cette semaine..."

OUT_DIR="${TMPDIR:-/tmp}"
OUT_FILE="${OUT_DIR}/learning-docs-audit-hebdo.txt"

if [[ ! -x /Users/thomas/bin/ai ]]; then
  echo "Façade ~/bin/ai introuvable - liste des fichiers a auditer manuellement :"
  echo "$RECENT"
  exit 0
fi

AI_CONSUMER=autism-hero.nightly-audit AI_SHELL_TOOL=1 /Users/thomas/bin/ai "Audite ces fiches modifiees recemment selon les règles de CONTRIBUTING.md. Pour chaque fiche, verifie : frontmatter complet, section En Bref, navigation, structure des concepts, blocs de code avec langage. Resume en tableau. Fiches : $FILE_LIST" > "$OUT_FILE"

# Optional macOS notification when not running headless
if [[ "$(uname -s)" == "Darwin" ]] && [[ ! -f "${HOME}/.config/learning-docs/headless" ]] && command -v osascript >/dev/null 2>&1; then
  osascript -e 'display notification "Audit hebdomadaire termine - '"$FILE_COUNT"' fiche(s)" with title "Learning Docs" sound name "Glass"' || true
fi

echo "=== Resultat ==="
cat "$OUT_FILE"
