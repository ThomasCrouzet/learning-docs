# Rapport de migration du cursus v2

Ce rapport décrit la migration déterministe exécutée par `scripts/migrate-curriculum-v2.js`.

- Fiches migrées : 635
- Règle d’identifiant : identifiant du cursus ou du module, puis nom stable de la fiche sans son numéro d’ordre
- Rattachement : racine de contenu la plus spécifique déclarée dans `curriculum/catalog.yml`
- Ordre : valeur historique `fiche_number`, conservée pour compatibilité
- Champs historiques : `cursus`, `fiche_number` et `total_fiches` conservés pendant la transition

## Types attribués

- `lesson` : 586
- `project` : 24
- `reference` : 24
- `review` : 1

## Ambiguïtés résolues

- Les phases Cybersécurité et Intelligence artificielle deviennent des modules, comme les phases Faust et Crypto-monnaies.
- Les sous-ensembles de Compétences métier deviennent des modules d’un seul cursus.
- Les fichiers contenant « projet » ou « fil-rouge » restent des projets autonomes et facultatifs. Ils ne sont jamais des prérequis globaux.
- Les liens vers une fiche dans la section Prérequis deviennent `requires_ids`. Les liens vers un index deviennent `requires_course_ids`.
- Aucun lien situé hors de la section Prérequis n’est utilisé par le graphe.

## Réserves documentées

- Les objectifs pédagogiques ne sont pas synthétisés automatiquement.
- Le sens humain des prérequis existants est conservé. Le validateur garantit leur résolution et l’absence de cycle, pas leur pertinence éditoriale.
- Le champ historique `cursus` est déprécié au profit de `course_id`, mais son retrait n’est pas planifié avant une migration publique séparée.
