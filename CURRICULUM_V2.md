# Architecture du cursus v2

Ce document décrit le modèle pédagogique canonique et les règles de maintenance.

## Vocabulaire

| Terme | Définition |
| ----- | ---------- |
| Domaine | Grande famille de navigation. |
| Cursus | Ensemble pédagogique cohérent consacré à un sujet et doté d’un identifiant stable. |
| Module | Sous-ensemble facultatif d’un cursus long. Un module n’est pas compté comme un cursus. |
| Fiche | Unité pédagogique consultable indépendamment, identifiée dans son frontmatter. |
| Parcours | Recommandation facultative selon un objectif. Il ne constitue ni une obligation, ni une preuve de niveau. |
| Collection | Regroupement éditorial ou visuel qui ne modifie pas le nombre de cursus. |

Aucun projet fil rouge global, capstone ou projet final obligatoire ne doit structurer le catalogue. Les projets existants restent autonomes, facultatifs et indépendants.

## Sources canoniques

| Information | Source |
| ----------- | ------ |
| Domaines, cursus, modules, collections, titres, ordre et relations | `curriculum/catalog.yml` |
| Parcours facultatifs | `curriculum/paths.yml` |
| Identité, rattachement, type, ordre, description et temps d’une fiche | Frontmatter de la fiche |
| Schémas publics de maintenance | `curriculum/schemas/*.schema.json` |
| Prérequis de fiche | Liens Markdown de la seule section `## Prérequis` |

`mkdocs.yml`, `docs/carte-cursus.md`, `docs/parcours.md`, les statistiques du README et de l’accueil, ainsi que `docs/assets/curriculum-v2.json` sont générés. Leurs régions générées ne doivent pas être modifiées directement.

## Identifiants et compatibilité

Les identifiants utilisent des segments ASCII lisibles séparés par des points. Ils ne dépendent ni du titre public, ni de la position dans un tableau. Un identifiant de fiche reprend l’identifiant de son cursus ou module, puis un segment stable dérivé du nom historique de fichier sans son préfixe numérique.

Les chemins Markdown publics sont conservés. Les champs historiques `cursus`, `fiche_number` et `total_fiches` restent lisibles pendant la transition. `course_id`, `module_id`, `content_type` et `order` font autorité dans le modèle v2. Aucun retrait des champs historiques n’est planifié sans migration publique séparée.

## Graphe de prérequis

Le générateur analyse uniquement les liens situés sous `## Prérequis`. Un lien vers une fiche devient `requires_ids`. Un lien vers un index de cursus ou de module devient `requires_course_ids`. Un lien local introuvable ou un cycle bloque `npm run lint:curriculum`.

Le manifest expose aussi `available_next_ids`. L’interface peut recommander plusieurs entrées et explique les prérequis manquants. Elle laisse toujours la personne commencer malgré une recommandation ou explorer librement.

## Ajouter un élément

### Ajouter un cursus ou un module

1. Ajouter le domaine, le cursus ou le module dans `curriculum/catalog.yml`.
2. Utiliser un identifiant inédit et un ordre inédit dans son parent.
3. Ajouter l’index et les fiches sans renommer les URL existantes.
4. Exécuter `npm run migrate:curriculum` si de nouvelles fiches doivent recevoir leurs métadonnées v2.
5. Exécuter `npm run generate:curriculum`.
6. Exécuter `npm run validate` puis le build strict.

### Ajouter une fiche

1. Créer la fiche dans une racine `content_root` déclarée.
2. Conserver les champs historiques exigés par le dépôt.
3. Ajouter `id`, `course_id`, `content_type` et `order`, ainsi que `module_id` si nécessaire.
4. Utiliser un type parmi `lesson`, `lab`, `project`, `review` et `reference`.
5. Déclarer les prérequis humains avec des liens dans `## Prérequis`.
6. Régénérer et valider.

### Ajouter un parcours

1. Ajouter l’objectif dans `curriculum/paths.yml`.
2. Déclarer plusieurs points d’entrée lorsque plusieurs ordres sont valides.
3. Conserver `can_skip_known: true` et `free_exploration: true`.
4. Ne promettre ni emploi, ni certification, ni niveau professionnel.
5. Régénérer et valider.

## Génération et validation

```bash
npm run migrate:curriculum
npm run generate:curriculum
npm run lint:curriculum
npm run validate
docker run --rm -v "$(pwd)":/docs squidfunk/mkdocs-material:9.7.7 build --strict
```

`generate:curriculum` écrit les artefacts. `lint:curriculum` compare les artefacts attendus en mémoire, sans écrire. La même vérification est incluse dans `lint:ci`.

Le rapport de migration déterministe est dans `CURRICULUM_V2_MIGRATION.md`.

## Stockage local et limites

L’orientation utilise uniquement `learning-docs:orientation:v2` dans `localStorage`. La valeur contient des identifiants de parcours, cursus et fiches connus. Elle est facultative, tolère une absence ou un JSON corrompu et peut être supprimée depuis l’interface. Aucune donnée sensible, télémétrie, connexion, API externe ou backend n’est utilisé.

L’algorithme est volontairement simple. Il classe les fiches par objectif, disponibilité des prérequis, ordre du cursus et identifiant stable. Il ne mesure pas un niveau réel et ne produit aucun score, série, échéance ou récompense.
