---
tags:
  - Projet
  - Intermédiaire
  - Pratique
description: "Rédiger un cahier des charges : spécifications fonctionnelles, spécifications techniques, maquettes et critères d'acceptation."
estimated_time: "75 min"
fiche_number: 4
total_fiches: 6
cursus: "Gestion de projet"
---

# 04 - Rédiger un cahier des charges

> **En bref** : Apprendre à rédiger un cahier des charges complet avec spécifications fonctionnelles, spécifications techniques, maquettes et critères d'acceptation. Lecture estimée : 75 min.

## Prérequis

- [01 - Introduction à la gestion de projet IT](01-introduction-gestion-projet.md)
- [02 - Méthodes agiles](02-methodes-agiles.md)
- [03 - Outils de gestion de projet](03-outils-projet.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras structurer un cahier des charges, distinguer spécifications fonctionnelles et techniques, rédiger des maquettes textuelles et définir des critères d'acceptation vérifiables.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un cahier des charges ?

**Définition** : Un cahier des charges (CdC) est un document qui décrit ce que le logiciel doit faire (les besoins) et comment il doit le faire (les contraintes). C'est le contrat entre le client (celui qui commande) et l'équipe de développement (celle qui réalise).

**Le problème que le cahier des charges résout** :

Sans cahier des charges, voici les problèmes rencontrés :

1. **Besoins non formalisés** : le client explique oralement ce qu'il veut, chacun comprend différemment.
2. **Périmètre flou** : sans document de référence, le client ajoute des fonctionnalités en permanence ("ah, j'avais aussi pensé à...").
3. **Litiges à la livraison** : "ce n'est pas ce que j'avais demandé" sans preuve écrite de ce qui avait été convenu.

**Comment le cahier des charges résout ces problèmes** :

| Problème | Solution apportée par le cahier des charges |
| --- | --- |
| Besoins non formalisés | Document écrit et validé par les deux parties |
| Périmètre flou | Liste exhaustive des fonctionnalités incluses et exclues |
| Litiges à la livraison | Référence contractuelle vérifiable |

**Analogie concrète** : Le cahier des charges, c'est comme le plan d'un architecte avant de construire une maison. Le plan montre le nombre de pièces, leur taille, l'emplacement des fenêtres et des portes. Sans ce plan, le maçon construit selon son interprétation, et le propriétaire découvre à la fin qu'il n'y a pas de toilettes au rez-de-chaussée.

**Ce que le cahier des charges n'est PAS** :

- Le cahier des charges n'est pas un document technique destiné aux développeurs. C'est un document métier compréhensible par le client.
- Le cahier des charges n'est pas figé pour toujours. En méthode agile, il évolue. Mais chaque changement est formalisé et accepté par les deux parties.
- Le cahier des charges n'est pas un roman. Il doit être concis, structuré et vérifiable.

---

### Qu'est-ce qu'une spécification fonctionnelle ?

**Définition** : Une spécification fonctionnelle décrit ce que le logiciel doit faire du point de vue de l'utilisateur, sans détailler comment il le fait techniquement.

**Le problème que les spécifications fonctionnelles résolvent** :

Sans spécifications fonctionnelles, voici les problèmes rencontrés :

1. **Fonctionnalités implicites** : "évidemment, il faut un moteur de recherche" - non, rien n'est évident.
2. **Priorités floues** : on ne sait pas quelles fonctionnalités sont indispensables et lesquelles sont optionnelles.
3. **Validation impossible** : comment vérifier que le logiciel est conforme sans liste de ce qu'il doit faire ?

**Comment les spécifications fonctionnelles résolvent ces problèmes** :

| Problème | Solution apportée |
| --- | --- |
| Fonctionnalités implicites | Liste exhaustive et explicite |
| Priorités floues | Classification par priorité (MoSCoW) |
| Validation impossible | Critères d'acceptation pour chaque fonctionnalité |

**La méthode MoSCoW pour prioriser** :

| Priorité | Signification | Exemple |
| --- | --- | --- |
| **M**ust have | Indispensable, le projet échoue sans | Inscription, connexion |
| **S**hould have | Important, mais le projet fonctionne sans | Recherche avancée |
| **C**ould have | Souhaitable, si le temps le permet | Thème sombre |
| **W**on't have (this time) | Exclu de cette version | Application mobile |

**Analogie concrète** : Les spécifications fonctionnelles, c'est comme la liste des courses avant d'aller au supermarché. "Must have" : les oeufs, la farine et le beurre (tu fais un gâteau). "Should have" : le sucre glace (pour la décoration). "Could have" : les framboises (si elles ne sont pas trop chères). "Won't have" : le saumon (c'est pour un autre repas).

---

### Qu'est-ce qu'une spécification technique ?

**Définition** : Une spécification technique décrit comment le logiciel doit être construit : quelles technologies utiliser, quelle architecture, quelles contraintes de performance.

**Le problème que les spécifications techniques résolvent** :

Sans spécifications techniques, voici les problèmes rencontrés :

1. **Choix technologiques incohérents** : chaque développeur utilise les outils qu'il préfère.
2. **Contraintes ignorées** : personne ne vérifie si le serveur peut supporter 10 000 utilisateurs simultanés.
3. **Intégration impossible** : les composants développés séparément ne fonctionnent pas ensemble.

**Comment les spécifications techniques résolvent ces problèmes** :

| Problème | Solution apportée |
| --- | --- |
| Choix technologiques incohérents | Stack technique définie et documentée |
| Contraintes ignorées | Exigences non fonctionnelles listées (performance, sécurité) |
| Intégration impossible | Architecture définie avant le développement |

**Les exigences non fonctionnelles** :

| Catégorie | Question | Exemple |
| --- | --- | --- |
| Performance | Combien de requêtes par seconde ? | 1 000 requêtes/seconde |
| Disponibilité | Quel pourcentage de temps en ligne ? | 99,9% (8h45 d'arrêt par an) |
| Sécurité | Quelles données protéger ? | Mots de passe hashés (bcrypt) |
| Scalabilité | Combien d'utilisateurs à terme ? | 50 000 utilisateurs actifs |
| Compatibilité | Quels navigateurs / appareils ? | Chrome, Firefox, Safari, mobile |
| Accessibilité | Quel niveau WCAG ? | WCAG 2.2 niveau AA (RGAA 4.x s'appuie encore surtout sur WCAG 2.1 AA) |

**Analogie concrète** : Les spécifications techniques, c'est comme les normes de construction d'une maison. Le plan d'architecte (spécifications fonctionnelles) montre les pièces. Les normes techniques (spécifications techniques) disent quel type de béton utiliser, quelle épaisseur d'isolation, quel diamètre de tuyaux. Le propriétaire ne lit pas ces normes, mais l'artisan en a besoin.

---

### Qu'est-ce qu'une maquette ?

**Définition** : Une maquette (wireframe ou mockup) est une représentation visuelle de l'interface utilisateur qui montre la disposition des éléments sur chaque écran, sans détailler le design graphique.

**Le problème que les maquettes résolvent** :

Sans maquettes, voici les problèmes rencontrés :

1. **Interprétations visuelles divergentes** : le client imagine un tableau de bord, le développeur code une liste.
2. **Ergonomie découverte trop tard** : on découvre que le parcours utilisateur est compliqué seulement après le développement.
3. **Aller-retour coûteux** : modifier une interface codée prend 10 fois plus de temps que modifier une maquette.

**Comment les maquettes résolvent ces problèmes** :

| Problème | Solution apportée par les maquettes |
| --- | --- |
| Interprétations visuelles divergentes | Représentation visuelle partagée |
| Ergonomie découverte trop tard | Validation du parcours utilisateur avant le code |
| Aller-retour coûteux | Modifier un dessin coûte 5 minutes, modifier du code coûte des heures |

**Les trois niveaux de maquette** :

| Niveau | Nom | Détail | Outil |
| --- | --- | --- | --- |
| 1 | Wireframe basse fidélité | Rectangles et texte, pas de couleur | Papier, Excalidraw |
| 2 | Wireframe haute fidélité | Disposition précise, texte réel | Figma, Balsamiq |
| 3 | Mockup | Design final avec couleurs, polices, images | Figma, Adobe XD |

**Analogie concrète** : Les maquettes, c'est comme les dessins d'un architecte d'intérieur. Avant d'acheter les meubles et de peindre les murs, tu fais un plan avec l'emplacement de chaque meuble. Tu peux déplacer le canapé sur le plan en 2 secondes. Le déplacer dans la réalité prend 20 minutes et risque de rayer le parquet.

---

## Étapes Pratiques

### Étape 1 : Structurer un cahier des charges

Voici la structure type d'un cahier des charges pour un projet web :

```text
STRUCTURE D'UN CAHIER DES CHARGES

1. CONTEXTE ET OBJECTIFS
   1.1 Présentation du projet
   1.2 Objectifs du projet
   1.3 Cible (utilisateurs)
   1.4 Périmètre (inclus / exclu)

2. SPÉCIFICATIONS FONCTIONNELLES
   2.1 Liste des fonctionnalités (classées MoSCoW)
   2.2 Parcours utilisateur (user flows)
   2.3 Maquettes (wireframes)
   2.4 Règles de gestion

3. SPÉCIFICATIONS TECHNIQUES
   3.1 Stack technique
   3.2 Architecture
   3.3 Exigences non fonctionnelles (performance, sécurité)
   3.4 Contraintes techniques

4. CRITÈRES D'ACCEPTATION
   4.1 Definition of Done
   4.2 Critères par fonctionnalité

5. PLANNING ET BUDGET
   5.1 Jalons
   5.2 Budget estimé

6. ANNEXES
   6.1 Glossaire
   6.2 Références
```

---

### Étape 2 : Rédiger des spécifications fonctionnelles

Voici un exemple pour une application de prise de rendez-vous médicaux :

```text
2. SPÉCIFICATIONS FONCTIONNELLES

2.1 Liste des fonctionnalités

MUST HAVE :
- F01 : Le patient peut rechercher un médecin par spécialité et
  localisation
- F02 : Le patient peut voir les créneaux disponibles d'un médecin
- F03 : Le patient peut réserver un créneau
- F04 : Le patient reçoit une confirmation par email
- F05 : Le médecin peut gérer son planning (ajouter/supprimer des
  créneaux)

SHOULD HAVE :
- F06 : Le patient peut annuler un rendez-vous jusqu'à 24h avant
- F07 : Le patient reçoit un rappel par email 24h avant le
  rendez-vous
- F08 : Le médecin peut voir la liste de ses rendez-vous du jour

COULD HAVE :
- F09 : Le patient peut laisser un avis après la consultation
- F10 : Le patient peut voir l'itinéraire vers le cabinet

WON'T HAVE (V1) :
- Paiement en ligne
- Téléconsultation
- Application mobile native
```

---

### Étape 3 : Créer une maquette textuelle

Voici une maquette textuelle (wireframe basse fidélité) pour la page de recherche de médecins :

```text
+----------------------------------------------------------+
|  LOGO     [Rechercher un médecin]          [Connexion]    |
+----------------------------------------------------------+
|                                                           |
|  RECHERCHER UN MÉDECIN                                    |
|                                                           |
|  Spécialité : [Généraliste        v]                      |
|  Ville :      [____________________ ]                     |
|  Date :       [JJ/MM/AAAA]                                |
|                                                           |
|  [  RECHERCHER  ]                                         |
|                                                           |
+----------------------------------------------------------+
|                                                           |
|  RÉSULTATS (3 médecins trouvés)                           |
|                                                           |
|  +------------------------------------------------------+ |
|  | Dr. Martin - Généraliste                              | |
|  | 12 rue des Lilas, 69001 Lyon                          | |
|  | Prochaine disponibilité : Lundi 14h00                 | |
|  | [VOIR LES CRÉNEAUX]                                   | |
|  +------------------------------------------------------+ |
|                                                           |
|  +------------------------------------------------------+ |
|  | Dr. Dupont - Généraliste                              | |
|  | 8 avenue Victor Hugo, 69002 Lyon                      | |
|  | Prochaine disponibilité : Mardi 09h30                 | |
|  | [VOIR LES CRÉNEAUX]                                   | |
|  +------------------------------------------------------+ |
|                                                           |
+----------------------------------------------------------+
|  Pied de page - Mentions légales - Contact                |
+----------------------------------------------------------+
```

---

### Étape 4 : Rédiger des règles de gestion

Les règles de gestion décrivent le comportement du système dans des cas précis :

```text
RÈGLES DE GESTION

RG-01 : Un patient ne peut pas avoir deux rendez-vous le même jour
        chez le même médecin.
RG-02 : Un créneau réservé n'apparaît plus dans les disponibilités.
RG-03 : L'annulation est possible jusqu'à 24 heures avant le
        rendez-vous. Au-delà, l'annulation est impossible.
RG-04 : Un médecin ne peut pas supprimer un créneau déjà réservé.
        Il doit d'abord contacter le patient.
RG-05 : Les créneaux sont proposés par tranche de 30 minutes
        (09h00, 09h30, 10h00, etc.).
RG-06 : Un patient peut avoir au maximum 3 rendez-vous à venir
        (pour éviter les réservations abusives).
RG-07 : Le médecin peut bloquer des plages horaires (congés,
        formations) sans affecter les rendez-vous déjà pris.
```

---

### Étape 5 : Rédiger les spécifications techniques

```text
3. SPÉCIFICATIONS TECHNIQUES

3.1 Stack technique
- Front-end : React 19, TypeScript
- Back-end : Symfony 7.4, PHP 8.3
- Base de données : PostgreSQL 16
- Serveur web : Nginx 1.26
- Conteneurisation : Docker

3.2 Architecture
- API REST (back-end) + SPA (front-end)
- Authentification : JWT (JSON Web Token)
- Envoi d'emails : via SMTP (Mailjet ou Brevo)

3.3 Exigences non fonctionnelles
- Performance : temps de réponse < 500 ms pour les recherches
- Disponibilité : 99,5% (hors maintenance planifiée)
- Sécurité : HTTPS obligatoire, données de santé chiffrées
  en base, conformité RGPD
- Compatibilité : Chrome, Firefox, Safari (2 dernières versions),
  responsive mobile
- Accessibilité : WCAG 2.2 niveau AA (bonne pratique ; le RGAA 4.x reste centré sur WCAG 2.1 AA)

3.4 Contraintes
- Hébergement en France (données de santé = HDS obligatoire)
- Conformité RGPD (voir cursus Droit et RGPD)
- Pas de dépendance à un service tiers hors UE
```

---

## Pièges Fréquents

### Piège 1 : Un cahier des charges trop vague

**Problème** : "Le site doit être rapide et ergonomique." Rapide comment ? Ergonomique selon quel critère ?

**Solution** : Quantifie tout. "Le temps de chargement de la page d'accueil doit être inférieur à 2 secondes sur une connexion 4G." "La navigation doit respecter la règle des 3 clics : toute fonctionnalité accessible en 3 clics maximum."

---

### Piège 2 : Oublier les cas limites

**Problème** : Le cahier des charges décrit le fonctionnement normal mais pas les cas d'erreur. Que se passe-t-il si l'utilisateur entre une date invalide ? Si le médecin n'a aucun créneau libre ?

**Solution** : Pour chaque fonctionnalité, liste les cas d'erreur et le comportement attendu :

```text
F02 : Voir les créneaux disponibles
- Cas nominal : le médecin a des créneaux -> afficher la liste
- Cas 1 : aucun créneau disponible -> message "Aucune disponibilité
  pour les 30 prochains jours"
- Cas 2 : le médecin a désactivé son compte -> message "Ce praticien
  ne prend plus de rendez-vous en ligne"
```

---

### Piège 3 : Mélanger besoins et solutions

**Problème** : "On veut un menu hamburger en haut à gauche avec une animation de slide-in de 300ms." C'est une solution technique, pas un besoin.

**Solution** : Exprime le besoin d'abord : "L'utilisateur doit pouvoir accéder au menu de navigation depuis n'importe quelle page." Le choix du menu hamburger vs barre de navigation est une décision de design, pas un besoin fonctionnel.

---

## Checklist de Validation

- Je sais structurer un cahier des charges complet (contexte, fonctionnel, technique, acceptation)
- Je sais distinguer spécification fonctionnelle (le "quoi") et spécification technique (le "comment")
- Je sais utiliser la méthode MoSCoW pour prioriser les fonctionnalités
- Je sais créer une maquette textuelle simple
- Je sais rédiger des règles de gestion précises
- Je sais formuler des exigences non fonctionnelles mesurables

---

## Exercice Pratique

**Énoncé** : Rédige un cahier des charges simplifié (sections 1 et 2) pour une application de gestion de bibliothèque personnelle. L'application doit permettre à un utilisateur de cataloguer ses livres, de suivre ses lectures et de partager des recommandations.

Le cahier des charges doit contenir :

1. La section "Contexte et objectifs" (présentation, objectifs, cible, périmètre)
2. La section "Spécifications fonctionnelles" avec :
   - Au moins 10 fonctionnalités classées en MoSCoW
   - Une maquette textuelle de la page d'accueil
   - Au moins 5 règles de gestion
3. Des critères d'acceptation pour 2 fonctionnalités (format Given/When/Then)

**Indications** :

- La cible est un lecteur individuel (pas une bibliothèque publique)
- Pense aux fonctionnalités sociales (partage, recommandations) comme "Should have"
- Les règles de gestion doivent couvrir les cas limites (doublon, livre sans auteur, etc.)

**Résultat attendu** : Un document d'environ 2 pages, structuré selon le template.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```text
CAHIER DES CHARGES - Application MyBooks

1. CONTEXTE ET OBJECTIFS

1.1 Présentation
Application web permettant de gérer sa bibliothèque personnelle :
cataloguer ses livres, suivre ses lectures et partager ses
recommandations.

1.2 Objectifs
- Permettre le catalogage rapide (ajout en moins de 30 secondes)
- Suivre sa progression de lecture (livres lus, en cours, à lire)
- Partager des recommandations avec ses amis

1.3 Cible
Lecteurs individuels, 18-65 ans, lecteurs de 5 à 50 livres par an.
Utilisateurs avec un niveau technique basique (savent utiliser un
navigateur web).

1.4 Périmètre
Inclus : catalogage, suivi de lecture, recommandations
Exclu : vente de livres, emprunt entre utilisateurs, intégration
avec des liseuses

2. SPÉCIFICATIONS FONCTIONNELLES

2.1 Fonctionnalités (MoSCoW)

MUST HAVE :
- F01 : Créer un compte et se connecter
- F02 : Ajouter un livre (titre, auteur, ISBN optionnel)
- F03 : Classer un livre par statut (à lire, en cours, lu)
- F04 : Voir sa bibliothèque sous forme de liste
- F05 : Rechercher un livre dans sa bibliothèque

SHOULD HAVE :
- F06 : Scanner un code-barres ISBN pour ajouter un livre
  automatiquement
- F07 : Ajouter une note et un commentaire personnel à un livre
- F08 : Partager une recommandation avec un ami par email

COULD HAVE :
- F09 : Voir des statistiques de lecture (livres lus par mois,
  genres préférés)
- F10 : Exporter sa bibliothèque en CSV

WON'T HAVE (V1) :
- Réseau social de lecteurs
- Suggestions automatiques de livres
- Application mobile native

2.2 Maquette - Page d'accueil (connecté)

+----------------------------------------------------------+
|  MyBooks    [Rechercher...]    [Ma bibliothèque] [Profil] |
+----------------------------------------------------------+
|                                                           |
|  Bonjour Thomas ! Tu as 42 livres dans ta bibliothèque.  |
|                                                           |
|  EN COURS DE LECTURE (2)                                  |
|  +------------------------------------------------------+|
|  | Clean Code - Robert C. Martin          [60%] [Voir]  ||
|  | Dune - Frank Herbert                   [30%] [Voir]  ||
|  +------------------------------------------------------+|
|                                                           |
|  AJOUTÉS RÉCEMMENT                                        |
|  +------------------------------------------------------+|
|  | Le Petit Prince - Saint-Exupéry    Statut: À lire    ||
|  | 1984 - George Orwell               Statut: Lu        ||
|  +------------------------------------------------------+|
|                                                           |
|  [+ AJOUTER UN LIVRE]                                     |
|                                                           |
+----------------------------------------------------------+

2.3 Règles de gestion

RG-01 : Un livre est identifié par son ISBN. Si deux livres ont
        le même ISBN, le système propose de fusionner.
RG-02 : Un livre sans ISBN est identifié par le couple
        (titre + auteur). Le titre seul ne suffit pas.
RG-03 : Un livre ne peut avoir qu'un seul statut à la fois
        (à lire, en cours, lu).
RG-04 : Le passage de "à lire" à "lu" passe automatiquement par
        "en cours" (on ne peut pas marquer "lu" un livre "à lire").
RG-05 : La suppression d'un livre est définitive. Un message de
        confirmation est affiché avant la suppression.

2.4 Critères d'acceptation

F02 : Ajouter un livre

1. ÉTANT DONNÉ que je suis connecté
   QUAND je clique sur "Ajouter un livre" et que je remplis
   titre = "Dune" et auteur = "Frank Herbert"
   ALORS le livre est ajouté avec le statut "À lire" par défaut

2. ÉTANT DONNÉ que je suis connecté
   QUAND je clique sur "Ajouter un livre" et que le titre est vide
   ALORS un message d'erreur s'affiche : "Le titre est obligatoire"

3. ÉTANT DONNÉ un livre "Dune" déjà dans ma bibliothèque
   QUAND j'ajoute un livre avec le même ISBN
   ALORS un message s'affiche : "Ce livre existe déjà dans ta
   bibliothèque"

F03 : Classer un livre par statut

1. ÉTANT DONNÉ un livre avec le statut "À lire"
   QUAND je change le statut en "En cours"
   ALORS le statut est mis à jour et le livre apparaît dans la
   section "En cours de lecture"

2. ÉTANT DONNÉ un livre avec le statut "À lire"
   QUAND j'essaie de changer le statut en "Lu" directement
   ALORS un message s'affiche : "Change d'abord le statut en
   'En cours' avant de marquer comme lu"
```

---

## Navigation

← Fiche précédente : **[03 - Outils de gestion de projet](03-outils-projet.md)**

→ Fiche suivante : **[05 - Qualité et documentation technique](05-qualite-documentation.md)**
