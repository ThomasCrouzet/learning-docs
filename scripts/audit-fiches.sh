#!/bin/bash
# Audit qualité de toutes les fiches d'un dossier via Claude
# Usage: ./scripts/audit-fiches.sh [docs/01-docker/]

DOSSIER="${1:-docs/}"

claude -p "Analyse toutes les fiches .md dans $DOSSIER et vérifie pour chacune :
1. Toutes les sections obligatoires décrites dans CONTRIBUTING.md sont présentes
2. Les blocs de code ont un langage spécifié
3. Pas de mots interdits (évidemment, simplement, il suffit de, en gros)
4. Les liens vers d'autres fiches sont valides
Affiche un tableau récapitulatif avec ✅/⚠️/❌ par critère."
