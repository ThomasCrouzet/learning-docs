#!/usr/bin/env bash
# Retire les préfixes "# NN - " des titres H1 dans toutes les fiches
# Transforme "# 01 - Créer un environnement..." en "# Créer un environnement..."
# Ne touche pas aux fichiers index.md ni tags.md

set -euo pipefail

DOCS_DIR="docs"
COUNT=0

while IFS= read -r file; do
  # Vérifie si la première ligne commence par # NN -
  first_line=$(head -1 "$file")
  if echo "$first_line" | grep -qE '^# [0-9]{2} - '; then
    # Retire le préfixe "NN - " (macOS sed)
    sed -i '' '1 s/^# [0-9][0-9] - /# /' "$file"
    new_title=$(head -1 "$file")
    echo "  $file"
    echo "    Avant: $first_line"
    echo "    Après: $new_title"
    COUNT=$((COUNT + 1))
  fi
done < <(find "$DOCS_DIR" -name "*.md" -not -name "index.md" -not -name "tags.md" | sort)

echo ""
echo "Total: $COUNT fichiers renommés"
