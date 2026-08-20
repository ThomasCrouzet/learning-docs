---
tags:
  - UX
  - Débutant
  - Concept
description: "Principes UX pour développeurs : différence UX/UI, heuristiques de Nielsen, accessibilité WCAG, personas et parcours utilisateur."
estimated_time: "60 min"
fiche_number: 1
total_fiches: 4
cursus: "UX Design"
---

# 01 - Principes UX pour développeurs

> **En bref** : Comprendre les fondamentaux de l'expérience utilisateur, les 10 heuristiques de Nielsen, l'accessibilité WCAG et la création de personas. Lecture estimée : 60 min.

## Prérequis

- Avoir suivi le cursus [HTML / CSS](../fondamentaux/04-html-css/index.md) pour connaître les bases de la structure web
- Savoir ce qu'est une page web (HTML, CSS, liens entre pages)
- Aucune connaissance préalable de l'UX n'est requise (tout est expliqué ci-dessous)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras distinguer UX et UI, appliquer les 10 heuristiques de Nielsen pour évaluer une interface, comprendre les niveaux d'accessibilité WCAG et créer un persona utilisateur.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'UX (Expérience Utilisateur) ?

**Définition** : L'UX (User Experience) désigne l'ensemble des émotions, perceptions et réactions d'une personne lorsqu'elle utilise un produit, un système ou un service. En développement web, l'UX couvre tout ce qui influence la facilité d'utilisation, l'efficacité et la satisfaction de l'utilisateur face à une application.

**Le problème que l'UX résout** :

Sans réflexion UX, voici les problèmes rencontrès :

1. **Utilisateurs perdus** : Les visiteurs ne trouvent pas ce qu'ils cherchent et quittent le site. Le taux de rebond est élevé.
2. **Fonctionnalités inutilisees** : Les développeurs construisent des fonctionnalités que personne n'utilise parce qu'elles ne répondent pas aux besoins réels des utilisateurs.
3. **Support surcharge** : Les utilisateurs contactent le support pour des actions qui devraient être evidentes. Chaque appel coûte du temps et de l'argent.

**Comment l'UX résout ces problèmes** :

| Problème | Solution apportée par l'UX |
| --- | --- |
| Utilisateurs perdus | Une navigation claire et des parcours logiques guident l'utilisateur vers son objectif |
| Fonctionnalités inutilisees | La recherche utilisateur identifie les vrais besoins avant le développement |
| Support surcharge | Une interface intuitive réduit le besoin d'aide externe |

**Analogie concrète** : L'UX, c'est comme l'amenagement d'un supermarche. Les rayons sont organises par catégorie, les produits les plus achetes sont à hauteur des yeux, et la signaletique guide les clients. Sans cet amenagement, les clients tourneraient en rond sans trouver ce qu'ils cherchent.

**Ce que l'UX n'est PAS** :

- L'UX n'est pas le design graphique. Un site peut être beau mais inutilisable (boutons trop petits, navigation confuse). L'UX s'intéresse à l'utilité et la facilité d'utilisation, pas seulement à l'apparence.
- L'UX n'est pas une étape unique. C'est un processus continu d'amélioration base sur les retours des utilisateurs.

---

### Quelle est la difference entre UX et UI ?

**Définition** : L'UI (User Interface) désigne les éléments visuels avec lesquels l'utilisateur interagit : boutons, menus, couleurs, typographie, icônes. L'UX englobe l'UI mais va bien au-delà en incluant la structure, le parcours utilisateur, la performance et la satisfaction globale.

**Comparaison UX vs UI** :

| UX (Expérience Utilisateur) | UI (Interface Utilisateur) |
| --- | --- |
| Comment ca fonctionne | Comment ca ressemble |
| Architecture de l'information | Choix des couleurs et typographies |
| Parcours utilisateur | Disposition des éléments visuels |
| Recherche utilisateur et tests | Design graphique et animations |
| S'applique à tout produit (app, objet, service) | S'applique aux interfaces numériques |

**Analogie concrète** : Si tu construis une maison, l'UX c'est le plan de l'architecte (ou placer les pièces, comment circuler). L'UI c'est la decoration intérieure (couleurs des murs, style des meubles). Une maison peut être magnifiquement decoree mais invivable si le plan est mal conçu.

---

### Qu'est-ce que les 10 heuristiques de Nielsen ?

**Définition** : Les 10 heuristiques de Nielsen sont des principes généraux de conception d'interface utilisable, publiés par Jakob Nielsen en 1994. Ce sont des règles de bon sens basées sur des décennies de recherche en ergonomie. Elles servent de grille d'évaluation rapide pour détecter les problèmes d'utilisabilité.

**Le problème que les heuristiques résolvent** :

Sans heuristiques, voici les problèmes rencontrès :

1. **Évaluations subjectives** : Chaque membre de l'équipe à un avis différent sur ce qui est "bien" ou "mal". Les discussions tournent en rond sans critères objectifs.
2. **Problèmes découverts trop tard** : Les défauts d'utilisabilité sont trouvés après le lancement, quand les corriger coûte cher.
3. **Manque de méthode** : Sans grille de lecture, les évaluations sont incomplètes et les problèmes importants passent inaperçus.

**Comment les heuristiques résolvent ces problèmes** :

| Problème | Solution apportée par les heuristiques |
| --- | --- |
| Évaluations subjectives | Des critères objectifs et partagés par toute l'équipe |
| Problèmes découverts trop tard | Une évaluation rapide possible des les premières maquettes |
| Manque de méthode | Une grille structurée en 10 points qui couvre tous les aspects clés |

**Les 10 heuristiques** :

| # | Heuristique | Description | Exemple concret |
| --- | --- | --- | --- |
| 1 | Visibilite de l'état du système | L'utilisateur doit toujours savoir ou il en est | Barre de progression lors d'un telechargement |
| 2 | Correspondance avec le monde réel | Le système doit utiliser le langage de l'utilisateur | Un site e-commerce parle de "panier", pas de "collection d'objets" |
| 3 | Contrôle et liberté de l'utilisateur | L'utilisateur doit pouvoir annuler et revenir en arrière | Bouton "Annuler" après suppression d'un email |
| 4 | Cohérence et standards | Les éléments similaires doivent se comporter de la même manière | Tous les boutons de validation sont au même endroit et de la même couleur |
| 5 | Prevention des erreurs | Empecher les erreurs plutôt que de les corriger après | Griser le bouton "Envoyer" tant que le formulaire est incomplet |
| 6 | Reconnaissance plutôt que rappel | L'utilisateur ne devrait pas avoir à memoriser des informations | Un champ de recherche affiche les recherches recentes |
| 7 | Flexibilite et efficacité | Permettre aux experts d'aller plus vite | Raccourcis clavier (Ctrl+S pour sauvegarder) |
| 8 | Design esthetique et minimaliste | Chaque élément superflu est du bruit qui dilue l'information utile | Une page de paiement ne montre que les champs nécessaires |
| 9 | Aide à la reconnaissance et correction des erreurs | Les messages d'erreur doivent être clairs et proposer une solution | "Email invalide. Exemple : `prenom@domaine.fr`" au lieu de "Erreur 422" |
| 10 | Aide et documentation | L'aide doit être disponible, concise et orientee action | Une infobulle qui explique un champ de formulaire au survol |

**Analogie concrète** : Les heuristiques de Nielsen sont comme une checklist de sécurité pour un pilote d'avion. Avant chaque vol, le pilote vérifie 10 points essentiels. Cela ne garantit pas un vol parfait, mais cela évite les erreurs les plus graves.

---

### Qu'est-ce que l'accessibilité web (WCAG) ?

**Définition** : L'accessibilité web consiste à concevoir des sites et applications utilisables par toutes les personnes, y compris celles ayant des handicaps visuels, auditifs, moteurs ou cognitifs. Les WCAG (Web Content Accessibility Guidelines) sont les standards internationaux publiés par le W3C.

La version de référence technique actuelle est **WCAG 2.2** (recommandation W3C). En France, le **RGAA** (référentiel en vigueur de la série 4.x, ex. 4.1.2) s'appuie principalement sur **WCAG 2.1 niveau AA** ; viser **WCAG 2.2 AA** reste une bonne pratique (les critères 2.1 restent inclus, avec des ajouts 2.2).

**Le problème que l'accessibilité résout** :

Sans accessibilité, voici les problèmes rencontrès :

1. **Exclusion d'utilisateurs** : 15% de la population mondiale vit avec un handicap. Un site inaccessible exclut potentiellement des millions de personnes.
2. **Non-conformité légale** : En France, la loi impose l'accessibilité pour les sites publics (RGAA). Ne pas s'y conformer expose à des sanctions.
3. **Mauvaise expérience pour tous** : Les bonnes pratiques d'accessibilité ameliorent l'expérience pour tous les utilisateurs (sous-titrès utiles dans un environnement bruyant, contraste suffisant en plein soleil).

**Comment l'accessibilité résout ces problèmes** :

| Problème | Solution apportée par l'accessibilité |
| --- | --- |
| Exclusion d'utilisateurs | Des critères techniques précis pour rendre le contenu perceptible, utilisable et comprehensible par tous |
| Non-conformité légale | Le respect des WCAG assure la conformité avec les obligations légales (RGAA en France, ADA aux USA) |
| Mauvaise expérience pour tous | Les principes d'accessibilité ameliorent l'ergonomie globale du site |

**Les 3 niveaux WCAG** :

| Niveau | Exigence | Exemple | Cible |
| --- | --- | --- | --- |
| A (minimum) | Critères de base indispensables | Toutes les images ont un texte alternatif (`alt`) | Tout site web |
| AA (recommande) | Critères supplémentaires pour une bonne accessibilité | Contraste texte/fond minimum de 4.5:1 | Standard vise par la majorité des projets |
| AAA (optimal) | Critères avances pour une accessibilité maximale | Contraste texte/fond minimum de 7:1, langue des signes pour les videos | Sites specialises (santé, administration) |

**Les 4 principes WCAG (POUR)** :

1. **Perceptible** : L'information doit être présentable de manière perceptible par tous les sens (texte alternatif pour les images, sous-titres pour les vidéos)
2. **Opérable** : L'interface doit être navigable au clavier, avec assez de temps, sans provoquer de crises (épilepsie)
3. **Compréhensible** : Le contenu et l'interface doivent être clairs (langage simple, comportements prévisibles, aide à la saisie)
4. **Robuste** : Le contenu doit être interprétable par les technologies d'assistance (lecteurs d'écran, plages braille)

> **Note** : L'acronyme français **POUR** correspond à Perceptible, Opérable, compréhensible (U pour _Understandable_ en anglais), Robuste. Ne pas confondre le 3e principe avec "utilisable" : en anglais, _Operable_ est le 2e principe, _Understandable_ est le 3e.

**Analogie concrète** : L'accessibilité web, c'est comme les rampes d'accès dans les bâtiments. Elles sont concues pour les personnes en fauteuil roulant, mais elles facilitent aussi la vie des parents avec poussettes, des livreurs avec chariots et des personnes agees.

**Ce que l'accessibilité n'est PAS** :

- L'accessibilité n'est pas un ajout à la fin du projet. Elle doit être intégrée des la conception (c'est moins coûteux que de corriger après).
- L'accessibilité n'est pas reservee aux sites publics. Tout site beneficie de l'accessibilité : meilleur SEO, meilleure expérience utilisateur, conformité légale.

---

### Qu'est-ce qu'un persona ?

**Définition** : Un persona est un personnage fictif mais réaliste qui représente un groupe d'utilisateurs cibles. Il est base sur des données réelles (entretiens, statistiques, observation) et décrit les objectifs, comportements, frustrations et contexte d'utilisation d'un type d'utilisateur.

**Le problème que les personas résolvent** :

Sans personas, voici les problèmes rencontrès :

1. **Conception pour soi-même** : Les développeurs construisent le produit selon leurs propres préférences, qui ne correspondent pas forcément aux besoins des utilisateurs réels.
2. **Utilisateur abstrait** : L'équipe parle de "l'utilisateur" de manière vague. Personne n'a la même image en tete, ce qui mène à des décisions incohérentes.
3. **Priorités floues** : Sans savoir qui utilise le produit et pourquoi, il est impossible de prioriser les fonctionnalités.

**Comment les personas résolvent ces problèmes** :

| Problème | Solution apportée par les personas |
| --- | --- |
| Conception pour soi-même | Le persona recentre les décisions sur les besoins réels des utilisateurs |
| Utilisateur abstrait | Toute l'équipe partage la même représentation concrete de l'utilisateur |
| Priorités floues | Les objectifs du persona guident la priorisation des fonctionnalités |

**Structure d'un persona** :

Un persona contient toujours ces éléments :

- **Nom et photo** : Pour le rendre concret et memorable
- **Données demographiques** : Age, profession, localisation, niveau technique
- **Objectifs** : Ce que la personne cherche à accomplir avec le produit
- **Frustrations** : Les obstacles qu'elle rencontre actuellement
- **Contexte d'utilisation** : Quand, ou et comment elle utilise le produit (mobile, bureau, en deplacement)
- **Citation representative** : Une phrase qui resume son attitude

**Analogie concrète** : Un persona, c'est comme la fiche descriptive d'un client type dans un restaurant. Le chef sait que "Marie, 35 ans, vegetarienne, pressee le midi, cherche un plat sain en moins de 10 minutes". Cette fiche guide le menu, le service et l'amenagement.

**Ce qu'un persona n'est PAS** :

- Un persona n'est pas un vrai utilisateur. C'est une synthese de plusieurs utilisateurs réels regroupes par comportements communs.
- Un persona n'est pas une invention. Il est base sur des données réelles (entretiens, analytics, enquetes). Un persona invente sans données est inutile.

---

### Qu'est-ce qu'un parcours utilisateur ?

**Définition** : Un parcours utilisateur (user journey) est une représentation visuelle de toutes les étapes qu'un utilisateur traverse pour accomplir un objectif avec un produit. Il inclut les actions, les pensees, les émotions et les points de friction à chaque étape.

**Le problème que le parcours utilisateur résout** :

Sans parcours utilisateur, voici les problèmes rencontrès :

1. **Vision fragmentee** : Chaque membre de l'équipe voit une partie de l'expérience (le développeur voit le code, le désigner voit l'interface, le product owner voit les fonctionnalités) mais personne ne voit l'expérience complete.
2. **Points de friction invisibles** : Les moments ou l'utilisateur hesite, se trompe ou abandonne ne sont pas identifies.
3. **Optimisations locales** : L'équipe améliore une page isolement sans voir l'impact sur le parcours global.

**Comment le parcours utilisateur résout ces problèmes** :

| Problème | Solution apportée par le parcours utilisateur |
| --- | --- |
| Vision fragmentee | Une vue d'ensemble partagée de l'expérience complete, de bout en bout |
| Points de friction invisibles | Chaque étape identifie les émotions et obstacles de l'utilisateur |
| Optimisations locales | Le contexte global permet de prioriser les améliorations qui comptent le plus |

**Anatomie d'un parcours utilisateur** :

| Élément | Description | Exemple (site e-commerce) |
| --- | --- | --- |
| Étape | L'action principale à ce moment | "Recherche un produit" |
| Action | Ce que l'utilisateur fait concrètement | Tape un mot-clé dans la barre de recherche |
| Pensee | Ce que l'utilisateur se dit | "Est-ce que je vais trouver ce que je cherche ?" |
| Emotion | Ce que l'utilisateur ressent | Neutre (début de parcours) |
| Point de friction | Un obstacle ou une difficulté | Pas de suggestion automatique dans la recherche |
| Opportunite | Une amélioration possible | Ajouter l'auto-completion dans la barre de recherche |

**Analogie concrète** : Un parcours utilisateur, c'est comme le plan de vol d'un passager aérien. Il commence à la réservation en ligne, passe par l'enregistrement, le contrôle de sécurité, l'embarquement, le vol, et se termine à la récupération des bagages. Cartographier chaque étape permet d'identifier où le passager perd du temps ou se sent frustré.

---

## Étapes Pratiques

### Étape 1 : Évaluer un site web avec les heuristiques de Nielsen

Choisis un site web que tu utilises souvent (un site e-commerce, un réseau social, un outil en ligne). Tu vas l'évaluer avec les 10 heuristiques de Nielsen.

Prepare un tableau sur papier ou dans un editeur de texte avec ces colonnes :

```text
| # | Heuristique                | Respectee ? | Observation                        |
| - | -------------------------- | ----------- | ---------------------------------- |
| 1 | Visibilite de l'etat       | Oui / Non   | [Ce que tu observes]               |
| 2 | Correspondance monde reel  | Oui / Non   | [Ce que tu observes]               |
| 3 | Controle et liberte        | Oui / Non   | [Ce que tu observes]               |
| 4 | Coherence et standards     | Oui / Non   | [Ce que tu observes]               |
| 5 | Prevention des erreurs     | Oui / Non   | [Ce que tu observes]               |
| 6 | Reconnaissance > rappel    | Oui / Non   | [Ce que tu observes]               |
| 7 | Flexibilite et efficacite  | Oui / Non   | [Ce que tu observes]               |
| 8 | Design minimaliste         | Oui / Non   | [Ce que tu observes]               |
| 9 | Aide aux erreurs           | Oui / Non   | [Ce que tu observes]               |
| 10| Aide et documentation      | Oui / Non   | [Ce que tu observes]               |
```

Pour chaque heuristique, navigue sur le site et note :

- Si l'heuristique est respectee ou non
- Un exemple concret de ce que tu observes (positif ou négatif)

**Résultat attendu** :

```text
Un tableau rempli avec 10 observations concretes, par exemple :
| 1 | Visibilite de l'etat | Oui | Lors de l'ajout au panier, un badge s'affiche |
| 5 | Prevention des erreurs | Non | Le formulaire accepte un email sans @ |
```

---

### Étape 2 : Verifier l'accessibilité d'une page web

Ouvre une page web dans ton navigateur et effectue ces 5 vérifications manuelles :

1. **Navigation au clavier** : Appuie sur la touche Tab pour naviguer dans la page. Chaque élément interactif (lien, bouton, champ) doit être atteignable et visuellement mis en avant (outline visible).

2. **Textes alternatifs** : Fais un clic droit sur une image, puis "Inspecter". Vérifie que la balise `<img>` contient un attribut `alt` avec une description utile.

3. **Contraste des couleurs** : Ouvre les outils de développement du navigateur (F12), va dans l'onglet "Accessibilite" ou utilise l'outil en ligne "WebAIM Contrast Checker". Le ratio minimum est 4.5:1 pour le texte normal (niveau AA).

4. **Zoom a 200%** : Appuie sur Ctrl++ (ou Cmd++) jusqu'a atteindre un zoom de 200%. Le contenu doit rester lisible sans defilement horizontal.

5. **Structure des titres** : Ouvre les outils de développement et cherche les balises `<h1>` a `<h6>`. Il doit y avoir un seul `<h1>`, et les niveaux doivent se suivre logiquement (pas de `<h1>` suivi de `<h3>` sans `<h2>`).

Note tes observations dans un tableau :

```text
| Verification       | Resultat | Observation                         |
| ------------------ | -------- | ----------------------------------- |
| Navigation clavier | OK / KO  | [Ce que tu observes]                |
| Textes alternatifs | OK / KO  | [Ce que tu observes]                |
| Contraste          | OK / KO  | [Ratio mesure]                      |
| Zoom 200%          | OK / KO  | [Ce que tu observes]                |
| Structure titres   | OK / KO  | [Hierarchie trouvee]                |
```

**Résultat attendu** :

```text
Un tableau rempli avec 5 observations, par exemple :
| Navigation clavier | KO | Le menu deroulant n'est pas accessible au Tab |
| Contraste          | OK | Ratio 5.2:1 pour le texte principal             |
```

---

### Étape 3 : Créer un persona

Tu vas créer un persona pour un projet fictif : une application de gestion de recettes de cuisine.

Remplis cette fiche persona sur papier ou dans un editeur de texte :

```text
PERSONA
=======

Nom : [Prenom + Nom fictif]
Age : [Age]
Profession : [Metier]
Localisation : [Ville]
Niveau technique : [Debutant / Intermediaire / Avance]

Objectifs :
- [Objectif 1 : ce que cette personne veut accomplir]
- [Objectif 2]
- [Objectif 3]

Frustrations :
- [Frustration 1 : ce qui l'empeche d'atteindre ses objectifs]
- [Frustration 2]
- [Frustration 3]

Contexte d'utilisation :
- Appareil principal : [Smartphone / Tablette / Ordinateur]
- Moment d'utilisation : [Quand cette personne utilise l'app]
- Environnement : [Ou elle se trouve quand elle l'utilise]

Citation : "[Une phrase qui resume l'attitude de cette personne]"
```

**Résultat attendu** :

```text
PERSONA
=======

Nom : Sophie Martin
Age : 32 ans
Profession : Infirmiere
Localisation : Lyon
Niveau technique : Intermediaire

Objectifs :
- Trouver rapidement une recette avec les ingredients disponibles
- Planifier les repas de la semaine en avance
- Decouvrir de nouvelles recettes vegetariennes

Frustrations :
- Les sites de recettes sont remplis de publicites qui ralentissent la navigation
- Pas le temps de chercher longtemps, elle a besoin de resultats immediats
- Les recettes trouvees en ligne demandent souvent des ingredients introuvables

Contexte d'utilisation :
- Appareil principal : Smartphone
- Moment d'utilisation : Le dimanche pour planifier, en semaine en cuisinant
- Environnement : Dans la cuisine, mains parfois occupees

Citation : "Je veux cuisiner sainement sans y passer des heures."
```

---

### Étape 4 : Dessiner un parcours utilisateur

À partir du persona créé à l'étape 3, dessine le parcours utilisateur pour l'objectif "Trouver une recette avec les ingrédients disponibles".

Utilise ce modèle sur papier ou dans un editeur de texte :

```text
PARCOURS UTILISATEUR
====================

Persona : [Nom du persona]
Objectif : [L'objectif a atteindre]

Etape 1 : [Nom de l'etape]
- Action : [Ce que l'utilisateur fait]
- Pensee : [Ce qu'il se dit]
- Emotion : [Content / Neutre / Frustre]
- Point de friction : [Eventuel obstacle]
- Opportunite : [Amelioration possible]

Etape 2 : [Nom de l'etape]
- Action : [...]
- Pensee : [...]
- Emotion : [...]
- Point de friction : [...]
- Opportunite : [...]

[Continuer pour chaque etape du parcours]
```

**Résultat attendu** :

```text
PARCOURS UTILISATEUR
====================

Persona : Sophie Martin
Objectif : Trouver une recette avec les ingredients disponibles

Etape 1 : Ouverture de l'application
- Action : Ouvre l'application sur son smartphone
- Pensee : "Qu'est-ce que je peux faire avec ce qu'il y a dans le frigo ?"
- Emotion : Neutre
- Point de friction : Aucun
- Opportunite : Afficher directement le champ de recherche par ingredients

Etape 2 : Saisie des ingredients
- Action : Tape "poulet, tomates, riz" dans le champ de recherche
- Pensee : "J'espere trouver quelque chose de rapide"
- Emotion : Neutre
- Point de friction : Pas d'auto-completion pour les ingredients
- Opportunite : Suggerer les ingredients au fur et a mesure de la saisie

Etape 3 : Consultation des resultats
- Action : Parcourt la liste des recettes proposees
- Pensee : "Celle-ci a l'air faisable en 30 minutes"
- Emotion : Contente
- Point de friction : Pas de filtre par temps de preparation
- Opportunite : Ajouter un filtre "Pret en X minutes"

Etape 4 : Lecture de la recette
- Action : Ouvre la recette selectionnee et lit les etapes
- Pensee : "Les etapes sont claires, je peux commencer"
- Emotion : Contente
- Point de friction : L'ecran se met en veille pendant la lecture
- Opportunite : Mode "cuisine" qui empeche la mise en veille
```

---

## Commandes Utiles

| Commande / Action | Description |
| --- | --- |
| Touche Tab dans le navigateur | Naviguer au clavier pour tester l'accessibilité |
| F12 (ou Cmd+Option+I sur Mac) | Ouvrir les outils de développement du navigateur |
| Ctrl++ / Ctrl+- (ou Cmd) | Zoomer / dezoomer pour tester la lisibilite |
| Lighthouse dans Chrome DevTools | Audit automatise d'accessibilité (onglet Lighthouse > Accessibilite) |
| WebAIM Contrast Checker (en ligne) | Verifier le ratio de contraste entre deux couleurs |

---

## Pièges Fréquents

### Piège 1 : Confondre UX et UI

⚠️ **Problème** : Tu penses que rendre un site "joli" suffit à offrir une bonne expérience utilisateur. Tu investis tout le temps dans les couleurs et la typographie.

✅ **Solution** : L'UX commence par la structure et les parcours. Un site visuellement simple mais ou l'utilisateur trouve facilement ce qu'il cherche offre une meilleure expérience qu'un site magnifique mais ou la navigation est confuse. Travaille l'UX d'abord (structure, parcours, contenu), l'UI ensuite (couleurs, typographie, animations).

---

### Piège 2 : Créer des personas inventes sans données

⚠️ **Problème** : Tu inventes des personas bases sur tes propres suppositions. "Je pense que nos utilisateurs sont des hommes de 25 ans passionnes de tech."

✅ **Solution** : Base toujours tes personas sur des données réelles. Même avec peu de moyens, tu peux analyser les statistiques du site (Google Analytics), lire les avis utilisateurs, ou interroger 5 personnes de ton entourage qui correspondent à ta cible. Un persona sans données est une fiction inutile.

---

### Piège 3 : Ignorer l'accessibilité en pensant "on verra plus tard"

⚠️ **Problème** : Tu repousses l'accessibilité à la fin du projet. Quand tu t'y mets enfin, corriger les problèmes nécessite de revoir toute l'architecture du site.

✅ **Solution** : Integre l'accessibilité des le début. Les bonnes pratiques de base (textes alternatifs, navigation clavier, contraste suffisant, structure des titres) ne demandent pas plus de temps si elles sont appliquees des la première ligne de code. Les corriger après est toujours plus coûteux.

---

## Checklist de Validation

- [ ] Je sais expliquer la difference entre UX et UI en une phrase
- [ ] Je connais les 10 heuristiques de Nielsen et je peux en citer au moins 5
- [ ] Je sais ce que signifient les niveaux WCAG A, AA et AAA
- [ ] J'ai évalue un site web avec les heuristiques de Nielsen
- [ ] J'ai vérifie l'accessibilité d'une page web (5 tests manuels)
- [ ] J'ai créé un persona complet avec objectifs, frustrations et contexte
- [ ] J'ai dessine un parcours utilisateur avec actions, pensees et émotions

---

## Exercice Pratique

**Énoncé** : Choisis un site web ou une application que tu utilises quotidiennement. Réalise une évaluation UX complète en trois parties.

**Partie 1 - Évaluation heuristique** :

- Évalue le site avec les 10 heuristiques de Nielsen
- Pour chaque heuristique non respectee, propose une amélioration concrete

**Partie 2 - Audit d'accessibilité** :

- Effectue les 5 vérifications manuelles (clavier, alt, contraste, zoom, titres)
- Note les problèmes trouvés avec leur niveau de gravite (bloquant, important, mineur)

**Partie 3 - Persona et parcours** :

- Créé un persona pour ce site/application
- Dessine le parcours utilisateur pour une action courante (ex : acheter un produit, publier un message, rechercher une information)

**Indications** :

- Choisis un site que tu connais bien pour avoir assez de contexte
- Sois spécifique dans tes observations (cite les pages, les éléments, les textes exacts)
- Pour le persona, base-toi sur ton propre usage si tu n'as pas d'autrès données

**Résultat attendu** :

- Un tableau d'évaluation heuristique avec 10 observations et des propositions d'amélioration
- Un tableau d'audit d'accessibilité avec 5 vérifications et des niveaux de gravite
- Une fiche persona complete
- Un parcours utilisateur en 4 a 6 étapes

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Voici un exemple de solution pour le site **Wikipedia** :

**Partie 1 - Évaluation heuristique de Wikipedia** :

| # | Heuristique | Respectee ? | Observation | Amélioration |
| --- | --- | --- | --- | --- |
| 1 | Visibilite de l'état | Oui | La page affiche le titre de l'article et le fil d'Ariane | - |
| 2 | Correspondance monde réel | Oui | Langage courant, structure encyclopedique familiere | - |
| 3 | Contrôle et liberté | Oui | Bouton "Retour" du navigateur fonctionne, historique des modifications | - |
| 4 | Cohérence et standards | Oui | Même structure pour tous les articles (sommaire, sections, références) | - |
| 5 | Prevention des erreurs | Partiel | L'editeur previent avant de quitter sans sauvegarder | Ajouter un apercu obligatoire avant publication |
| 6 | Reconnaissance > rappel | Oui | Barre de recherche avec suggestions | - |
| 7 | Flexibilite et efficacité | Partiel | Pas de raccourcis clavier pour la navigation entre articles | Ajouter des raccourcis (J/K pour précédent/suivant) |
| 8 | Design minimaliste | Non | Les articles longs sont denses, beaucoup de liens et de notes | Ajouter un mode "lecture simplifiée" |
| 9 | Aide aux erreurs | Oui | "Aucun article ne correspond" avec suggestions alternatives | - |
| 10 | Aide et documentation | Oui | Pages d'aide détaillées, tutoriels pour les editeurs | - |

**Partie 2 - Audit d'accessibilité de Wikipedia** :

| Vérification | Résultat | Observation | Gravite |
| --- | --- | --- | --- |
| Navigation clavier | OK | Tous les liens et boutons sont accessibles au Tab | - |
| Textes alternatifs | OK | Les images ont des attributs alt descriptifs | - |
| Contraste | OK | Texte noir sur fond blanc, ratio supérieur à 7:1 | - |
| Zoom 200% | OK | Le contenu se reajuste sans defilement horizontal | - |
| Structure titrès | OK | Un seul h1 (titre de l'article), hiérarchie logique h2 > h3 > h4 | - |

**Partie 3 - Persona Wikipedia** :

```text
PERSONA
=======

Nom : Lucas Dupont
Age : 17 ans
Profession : Lyceen en Terminale
Localisation : Bordeaux
Niveau technique : Intermediaire

Objectifs :
- Trouver rapidement une information fiable pour un expose
- Comprendre un sujet complexe grace a un resume accessible
- Citer ses sources correctement pour un travail scolaire

Frustrations :
- Les articles sont parfois trop longs et techniques
- Difficile de savoir quelles parties sont les plus fiables
- Le sommaire ne met pas en avant les sections les plus utiles pour un debutant

Contexte d'utilisation :
- Appareil principal : Ordinateur portable
- Moment d'utilisation : Le soir en semaine et le week-end
- Environnement : A son bureau, en faisant ses devoirs

Citation : "Je veux comprendre l'essentiel sans lire 30 pages."
```

**Parcours utilisateur - "Trouver une information pour un expose"** :

```text
Etape 1 : Recherche initiale
- Action : Tape le sujet dans la barre de recherche Wikipedia
- Pensee : "J'espere que l'article existe en francais"
- Emotion : Neutre
- Point de friction : Aucun
- Opportunite : -

Etape 2 : Lecture du sommaire
- Action : Parcourt le sommaire de l'article pour trouver la section pertinente
- Pensee : "C'est long, ou est la partie qui m'interesse ?"
- Emotion : Legerement frustre
- Point de friction : Le sommaire est une longue liste sans mise en valeur
- Opportunite : Mettre en evidence les sections les plus consultees

Etape 3 : Lecture de la section
- Action : Lit la section ciblee et les paragraphes associes
- Pensee : "C'est technique, mais je comprends l'idee generale"
- Emotion : Concentre
- Point de friction : Termes techniques sans definition inline
- Opportunite : Ajouter des infobulles sur les termes complexes

Etape 4 : Prise de notes
- Action : Copie les passages importants et note la reference
- Pensee : "Comment je cite ca dans mon expose ?"
- Emotion : Neutre
- Point de friction : Pas de bouton "Citer cet article" visible
- Opportunite : Bouton de citation bien visible avec le format scolaire
```

---

## Navigation

→ Fiche suivante : **[Wireframes et maquettes](02-wireframes-maquettes.md)**
