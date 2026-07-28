---
hide:
  - toc
description: "Origine du projet, méthode de production, limites, accessibilité cognitive et comment contribuer."
---

# À propos de ce wiki

> **En bref** : Ce wiki est une documentation pédagogique francophone structurée pour l'apprentissage en autonomie. Lecture estimée : 8 min.

## Objectif

Fournir des fiches de cours **explicites**, **ordonnées** et **vérifiables**, utilisables **hors ligne** après téléchargement ou hébergement local.

Le public visé est large : débutants, personnes en reconversion, et toute personne qui a besoin d'une progression prévisible. La structure privilégie l'**explicite**, la **prévisibilité**, les étapes courtes et la **réduction de la charge cognitive**.

### Origine humaine et public neurodivergent

Le projet a été conçu **initialement par une personne autiste** pour répondre à des **besoins d'apprentissage vécus** (consignes sans implicite, format stable, faible surcharge). Ces choix éditoriaux peuvent aider d'autres apprenants, y compris des personnes neurodivergentes.

Ce n'est **pas** :

- une affirmation d'adaptation universelle à toutes les personnes autistes ou neurodivergentes ;
- le résultat d'une recherche utilisateur formalisée auprès de la diversité des profils ;
- une validation clinique, neuropsychologique ou pédagogique professionnelle.

## Origine du contenu et assistance IA

- La **majorité du corpus a été générée ou largement développée avec l'aide de l'intelligence artificielle**.
- Cette provenance est volontairement affichée : elle permet de comprendre les forces et les limites du contenu avant de l'utiliser.
- Une **relecture et une validation humaines** progressives corrigent les erreurs, mettent à jour les versions et clarifient les consignes, mais cette relecture reste incomplète.
- Les contrôles automatiques (lint, structure, liens, build) **ne prouvent pas** l'exactitude de chaque phrase technique.
- Malgré ces contrôles, des **erreurs peuvent subsister** (commandes obsolètes, approximations, coquilles, exemples incomplets).

## Date et méthode de vérification

| Élément | Détail |
| ------- | ------ |
| Date de référence du contenu | juillet 2026 |
| Versions de référence (cadre pédagogique) | PHP 8.3 (correctifs sécurité jusqu'au 31 déc. 2027 ; support actif terminé fin 2025), Symfony 7.4 LTS (bugs jusqu'à nov. 2028, sécurité jusqu'à nov. 2029), PostgreSQL 16 (EOL nov. 2028), Node.js 22 LTS en maintenance (EOL 30 avr. 2027 ; Node 24 est l'Active LTS en 2026) |
| Contrôles automatiques | lints Markdown, frontmatter, structure des fiches, navigation, carte des cursus et audit documentaire local (`npm run audit:docs`) |
| Contrôles éditoriaux | relectures par cursus, corrections techniques ciblées, campagnes d'audit documentées |
| Fraîcheur | voir [Politique de fraîcheur](politique-fraicheur.md) |

Ces versions sont un **socle d'apprentissage cohérent**, pas une obligation d'installer exactement ces numéros en production. Vérifie toujours les pages de support officielles avant une mise à jour.

Une fiche peut être structurellement valide (lint OK) tout en contenant une imprécision technique. Signale-la si tu en trouves une.

### Rôles de responsabilité

| Rôle | Responsabilité |
| ---- | -------------- |
| Intention et cadre pédagogique | humains (mainteneurs) |
| Production ou enrichissement du contenu | majoritairement assisté par IA |
| Décision de fusion dans le dépôt | humains |
| Gates automatiques (lint, tests, build) | scripts CI / locaux |
| Certification juridique, fiscale, médicale ou de sécurité | **hors périmètre** de ce wiki |

## Principes d'accessibilité cognitive

Sans prétendre convenir à tous les styles d'apprentissage, les fiches visent à :

1. **Structure prévisible** : mêmes sections d'une fiche à l'autre (prérequis, objectif, concepts, étapes, pièges, checklist, exercice, navigation).
2. **Peu d'implicite** : chaque terme technique est défini ou relié à une fiche qui le définit.
3. **Étapes ordonnées** : une action principale par étape, avec résultat attendu lorsque c'est pertinent.
4. **Objectifs observables** : savoir faire X, pas « maîtriser le sujet ».
5. **Validation** : checklist et/ou exercice pour vérifier la compréhension.
6. **Ton direct** : pas d'infantilisation, pas de sarcasme, pas d'humour ambigu.

## Ce que ce wiki n'est pas

- Une **certification professionnelle** ni une promesse de devenir « expert » en quelques dizaines d'heures.
- Un substitut à la **documentation officielle** des outils cités.
- Une formation encadrée avec correction humaine systématique de tes exercices.
- Une validation médicale ou neuropsychologique de l'accessibilité.

### Niveaux d'apprentissage (honnêteté pédagogique)

| Niveau | Signification |
| ------ | ------------- |
| Lire et comprendre une introduction | Tu peux expliquer les idées principales avec tes mots. |
| Pratiquer avec accompagnement | Tu suis les étapes avec un tuteur, un pair ou des corrections. |
| Être autonome sur un périmètre | Tu reproduis et adaptes les exercices du cursus sans guide pas à pas. |
| Compétence professionnelle | Expérience réelle, relecture par des pairs, projets en production : hors portée d'une seule lecture du wiki. |

Les parcours suggérés indiquent des **temps de lecture et de pratique guidée**, pas un titre professionnel.

## Signaler une erreur

1. Vérifie la version de l'outil concerné (la tienne peut différer de la version de référence du wiki).
2. Note la fiche (chemin ou URL), le passage concerné et le comportement observé.
3. Ouvre une issue ou une pull request sur le dépôt du projet, ou contacte le mainteneur du site si tu utilises une instance publiée.

Merci d'inclure, si possible : commande exacte, message d'erreur, système (Linux / macOS / Windows) et version de l'outil.

## Contribuer

- Lis [CONTRIBUTING.md](https://github.com/ThomasCrouzet/learning-docs/blob/main/CONTRIBUTING.md) à la racine du dépôt.
- Respecte le **template de fiche** (frontmatter, En bref, navigation, accents français, pas d'em dash).
- Lance `npm run validate` avant de proposer un changement.
- Pour un audit structurel local : `npm run audit:docs`.
- Ne commite pas de secrets, de données personnelles, ni le dossier de build `site/`.
- La carte des cursus (`docs/carte-cursus.md`) est **générée** : utilise `npm run generate:cursus-map`.

## Licence

- Contenu pédagogique (`docs/`) : [CC BY 4.0](https://github.com/ThomasCrouzet/learning-docs/blob/main/LICENSE)
- Outillage (`scripts/`, CI) : [MIT](https://github.com/ThomasCrouzet/learning-docs/blob/main/LICENSE-CODE)
- Tiers (KaTeX et Mermaid) : [NOTICE](https://github.com/ThomasCrouzet/learning-docs/blob/main/NOTICE)
