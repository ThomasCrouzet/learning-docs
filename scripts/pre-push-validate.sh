#!/bin/bash
# Validation sémantique des fiches modifiées avant push via la façade Codex
# Usage : ./scripts/pre-push-validate.sh
set -euo pipefail
cd "$(dirname "$0")/.."

if git rev-parse --verify github/main >/dev/null 2>&1; then
  BASE=github/main
elif git rev-parse --verify origin/main >/dev/null 2>&1; then
  BASE=origin/main
else
  echo "Impossible de résoudre github/main ou origin/main" >&2
  exit 1
fi

CHANGED=$(git diff --name-only "${BASE}...HEAD" -- 'docs/**/*.md' || true)

if [ -z "$CHANGED" ]; then
  echo "Aucune fiche modifiée, rien à valider."
  exit 0
fi

COUNT=$(printf '%s\n' "$CHANGED" | wc -l | tr -d ' ')
echo "Validation sémantique de $COUNT fiche(s) modifiée(s)..."

if [[ ! -x /Users/thomas/bin/ai ]]; then
  echo "Erreur : la façade ~/bin/ai est introuvable ou non exécutable." >&2
  exit 1
fi

AI_CONSUMER=autism-hero.pre-push-validate AI_SHELL_TOOL=1 /Users/thomas/bin/ai "Vérifie ces fiches modifiées et signale uniquement les problèmes critiques :
- Structure manquante (Prérequis, Objectif, Navigation, En Bref)
- Liens internes cassés (fichiers cibles inexistants)
- Frontmatter incomplet (tags, description, estimated_time, fiche_number, total_fiches, cursus)
- Incohérence total_fiches/fiche_number

Fiches à vérifier :
$CHANGED

Réponds avec un tableau synthétique. Si tout est OK, dis-le en une ligne."
