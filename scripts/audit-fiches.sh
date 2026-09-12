#!/bin/bash
# Audit qualité de toutes les fiches d'un dossier via la façade Codex
# Usage: ./scripts/audit-fiches.sh [docs/01-docker/]

set -euo pipefail

DOSSIER="${1:-docs/}"

AI_CONSUMER=autism-hero.audit-fiches AI_SHELL_TOOL=1 /Users/thomas/bin/ai "Analyse toutes les fiches .md dans $DOSSIER et vérifie pour chacune :
1. Toutes les sections obligatoires décrites dans CONTRIBUTING.md sont présentes
2. Les blocs de code ont un langage spécifié
3. Pas de mots interdits (évidemment, simplement, il suffit de, en gros)
4. Les liens vers d'autres fiches sont valides
Affiche un tableau récapitulatif avec ✅/⚠️/❌ par critère."
