#!/bin/bash
# Validation complète avant push via Claude Code headless
# Usage: ./scripts/headless-pre-push.sh

claude -p "Exécute dans l'ordre :
1. npm run validate
2. npm run lint:prereq-links
3. npm run lint:accents
4. docker run --rm -v \$(pwd):/docs squidfunk/mkdocs-material:latest build --strict 2>&1 | tail -20

Affiche un résumé OK/ERREUR par étape. Si tout passe, affiche 'READY TO PUSH'. Sinon, liste les erreurs." \
  --allowedTools Bash,Read
