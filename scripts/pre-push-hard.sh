#!/bin/bash
# Validation déterministe avant push : tests, lint, build MkDocs épinglé.
# Usage: ./scripts/pre-push-hard.sh
set -euo pipefail
cd "$(dirname "$0")/.."

npm run validate

IMAGE="squidfunk/mkdocs-material:9.7.7"
docker run --rm -v "$(pwd)":/docs "${IMAGE}" build --strict
