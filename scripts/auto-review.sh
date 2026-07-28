#!/bin/bash
# Audit qualité des fiches modifiées (utilisable manuellement ou en CI)
# Usage : ./scripts/auto-review.sh

CHANGED=$(git diff --cached --name-only 2>/dev/null | grep '^docs/.*\.md$')

if [ -z "$CHANGED" ]; then
  # Fallback : fichiers modifiés non commités
  CHANGED=$(git diff --name-only HEAD 2>/dev/null | grep '^docs/.*\.md$')
fi

if [ -z "$CHANGED" ]; then
  echo "Aucune fiche modifiée à auditer."
  exit 0
fi

echo "Audit des fiches modifiées :"
echo "$CHANGED"
echo "---"

claude -p "Vérifie la conformité de ces fiches aux règles de CONTRIBUTING.md. Pour chaque fichier, vérifie : frontmatter (estimated_time, fiche_number, total_fiches, cursus), section 'En bref', sections obligatoires, blocs de code avec langage, navigation. Liste les problèmes trouvés par fichier. Fichiers : $CHANGED" --allowedTools Read,Glob,Grep
