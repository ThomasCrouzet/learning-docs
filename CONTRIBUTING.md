# Contribuer à Learning Docs

Merci d'aider à améliorer ce wiki pédagogique.

**Langue** : le contenu d'apprentissage sous `docs/` est **principalement en français**. Les fichiers de gouvernance et les messages destinés aux contributeurs sont aussi en français en premier. Une courte section anglaise peut exister dans le README pour l'orientation, mais elle ne remplace pas la présentation française. Préférer le français pour les fiches nouvelles ou modifiées, sauf si une page est déjà explicitement bilingue.

## Avant de commencer

1. Lire [README.md](README.md) et [docs/a-propos.md](docs/a-propos.md) (origine, limites, provenance IA).
2. Respecter le barème de qualité des fiches ci-dessous (structure, frontmatter, « En bref », navigation, accents, pas de tiret cadratin).
3. Utiliser **npm** uniquement (`package-lock.json`). Ne pas introduire de lockfile yarn/pnpm/bun.

## Installation de développement

```bash
git clone https://github.com/ThomasCrouzet/learning-docs.git
cd learning-docs
npm ci
docker compose up -d
```

Wiki : `http://localhost:8100` (MkDocs Material).

**Prérequis** : Node.js >= 22, Docker (serveur wiki / build strict).

### Commandes utiles

| Tâche | Commande |
| ----- | -------- |
| Tests unitaires | `npm test` |
| Validation complète | `npm run validate` |
| Lint Markdown seul | `npm run lint` |
| Régénérer la carte des cursus | `npm run generate:cursus-map` |
| Audit documentaire | `npm run audit:docs` |
| Build strict du site | `docker run --rm -v "$(pwd)":/docs squidfunk/mkdocs-material:9.7.7 build --strict` |

## Que contribuer

Contributions à forte valeur :

- Corrections factuelles (commande fausse, version obsolète, affirmation incorrecte)
- Liens internes cassés et navigation
- Prérequis, exercices et résultats attendus plus clairs
- Améliorations d'accessibilité
- Outillage / tests qui attrapent de vraies régressions

À éviter :

- Remplissage marketing, slogans ou badges décoratifs sans valeur
- Dumps massifs de cursus traduits mécaniquement
- Secrets, données personnelles, noms d'hôtes privés ou vrais identifiants dans les exemples
- Abaisser les seuils de lint/tests pour faire passer la CI

## Barème d'une fiche

Chaque fiche pédagogique doit conserver :

- Frontmatter YAML : `tags`, `description`, `estimated_time`, `fiche_number`, `total_fiches`, `cursus`
- Titre H1, blockquote **En bref**, Prérequis, Objectif, Concepts, étapes lorsque c'est pertinent
- Pièges réalistes, checklist, exercice + solution lorsque la fiche enseigne une compétence
- Liens de **Navigation** bidirectionnels
- Accents français dans la prose ; balises de langage sur les blocs de code
- Pas de tiret cadratin ; utiliser un tiret simple `-`

Après des déplacements structurels (ajout / suppression / renumérotation de fiches) :

```bash
npm run generate:cursus-map
npm run lint:consistency
npm run lint:cursus-map
```

et mettre à jour la navigation `mkdocs.yml` si besoin.

## Pull requests

1. Créer une branche ciblée depuis la branche par défaut.
2. Garder des commits petits et lisibles.
3. Lancer `npm run validate` en local.
4. Décrire **quoi** a changé et **pourquoi**, avec les chemins des fiches touchées.
5. Pour les affirmations factuelles, citer des sources primaires (docs officielles, notes de version) dans la description de PR lorsque c'est utile.
6. Ne pas ajouter de trailers de co-auteur IA ni de branding promotionnel d'outil dans les commits.

## Signaler un problème

Utiliser les modèles d'issues lorsqu'ils sont disponibles :

- Erreur factuelle
- Contenu obsolète
- Lien cassé
- Problème d'accessibilité

Inclure : chemin ou URL de la fiche, extrait concerné, version de l'outil, OS, et comportement attendu vs observé.

## Politique éditoriale et IA

La majorité du corpus existant a été générée ou largement enrichie avec une assistance IA. Le contenu nouveau peut aussi s'appuyer sur une assistance IA, mais les contributeurs et mainteneurs restent responsables de chaque changement proposé et fusionné. Lint et tests automatiques prouvent la structure et beaucoup de gates techniques ; ils **ne certifient pas** chaque phrase factuelle. Voir [docs/a-propos.md](docs/a-propos.md).

## Licence

En contribuant, tu acceptes que tes contributions soient sous les mêmes termes que le projet (voir [LICENSE](LICENSE) et [NOTICE](NOTICE)).
