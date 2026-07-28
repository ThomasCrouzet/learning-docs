#!/bin/bash
# Génère les PDFs pour tous les .md modifiés depuis le dernier commit
# Usage: ./scripts/pdf-changed.sh

if [ ! -x "./create-pdf.sh" ]; then
  echo "create-pdf.sh est un outil local non versionné et doit être présent à la racine."
  exit 1
fi

CHANGED=$(git diff --name-only HEAD~1 -- 'docs/**/*.md')

if [ -z "$CHANGED" ]; then
  echo "Aucun fichier .md modifié."
  exit 0
fi

echo "Fichiers modifiés :"
echo "$CHANGED"
echo "---"

for file in $CHANGED; do
  if [ -f "$file" ]; then
    echo "Génération PDF : $file"
    ./create-pdf.sh "$file"
  fi
done
