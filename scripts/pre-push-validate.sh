#!/bin/bash
# Validation sémantique des fiches modifiées avant push via Claude Code headless
# Usage : ./scripts/pre-push-validate.sh

set -euo pipefail

CHANGED=$(git diff --name-only origin/master...HEAD -- docs/ 2>/dev/null | grep '\.md$' || true)

if [ -z "$CHANGED" ]; then
  echo "Aucune fiche modifiée, rien à valider."
  exit 0
fi

COUNT=$(echo "$CHANGED" | wc -l | tr -d ' ')
echo "Validation sémantique de $COUNT fiche(s) modifiée(s)..."

# Vérification que claude est disponible
if ! command -v claude &>/dev/null; then
  echo "Erreur : claude CLI non trouvé. Installez Claude Code pour utiliser ce script."
  exit 1
fi

claude -p "Vérifie ces fiches modifiées et signale uniquement les problèmes critiques :
- Structure manquante (Prérequis, Objectif, Navigation, En Bref)
- Liens internes cassés (fichiers cibles inexistants)
- Frontmatter incomplet (tags, description, estimated_time, fiche_number, total_fiches, cursus)
- Incohérence total_fiches/fiche_number

Fiches à vérifier :
$CHANGED

Réponds avec un tableau synthétique. Si tout est OK, dis-le en une ligne." \
  --allowedTools 'Read,Glob,Grep' \
  2>/dev/null
