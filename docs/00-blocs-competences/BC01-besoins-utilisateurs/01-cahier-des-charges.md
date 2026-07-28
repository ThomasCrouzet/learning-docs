---
tags:
  - Certification
  - Débutant
  - Pratique
description: "BC01 - 01 - Le Cahier des Charges Technique"
estimated_time: "35 min"
fiche_number: 1
total_fiches: 3
cursus: "BC01 - Besoins utilisateurs"
---

# BC01 - 01 - Le Cahier des Charges Technique

> **En bref** : À la fin de cette fiche, tu sauras rédiger un cahier des charges technique complet pour un projet informatique, en respectant une structure professionnelle. Lecture estimée : 35 min.


## Prérequis

- Fiche **[00 - Présentation de la Certification](../00-presentation-certification.md)** (`../00-presentation-certification.md`)

Aucune connaissance technique préalable n'est requise. Cette fiche est accessible aux débutants.

## Objectif de cette fiche

À la fin de cette fiche, tu sauras rédiger un cahier des charges technique complet pour un projet informatique, en respectant une structure professionnelle.

---

## Concepts

### Qu'est-ce qu'un cahier des charges technique ?

**Définition** : Un cahier des charges technique (CDC ou CdC) est un document écrit qui décrit précisément ce qu'un projet informatique doit faire, comment il doit fonctionner, et quelles sont les contraintes techniques à respecter.

**Le problème que le cahier des charges résout** :

Sans cahier des charges, voici les problèmes rencontrés :

1. **Incompréhension** : Le développeur ne comprend pas ce que le client veut vraiment.
2. **Modifications incessantes** : Le client change d'avis en cours de route car rien n'était fixé.
3. **Conflits** : Disputes sur ce qui était prévu ou non.
4. **Dépassement de budget** : Impossible d'estimer correctement sans périmètre défini.

**Comment le cahier des charges résout ces problèmes** :

| Problème | Solution apportée par le CDC |
| -------- | ---------------------------- |
| Incompréhension | Tout est écrit noir sur blanc |
| Modifications incessantes | Les changements nécessitent un avenant écrit |
| Conflits | Le CDC sert de référence contractuelle |
| Dépassement de budget | Le périmètre défini permet d'estimer |

**Analogie concrète** : Imagine que tu veux construire une maison. Le cahier des charges, c'est le plan de l'architecte. Sans plan, le maçon ne sait pas où mettre les murs, combien de pièces faire, ni où placer les fenêtres. Avec le plan, tout le monde sait exactement ce qui doit être construit.

**Ce qu'un cahier des charges n'est PAS** :

- Un CDC n'est pas un manuel d'utilisation. Le manuel explique comment utiliser le produit fini. Le CDC décrit ce qu'il faut construire.
- Un CDC n'est pas un devis. Le devis indique le prix. Le CDC décrit le travail à faire.
- Un CDC n'est pas figé à jamais. Il peut évoluer via des avenants, mais tout changement doit être documenté.

---

### Quelle est la différence entre CDC fonctionnel et CDC technique ?

**Définition** : Il existe deux types de cahiers des charges qui se complètent.

| CDC Fonctionnel | CDC Technique |
| --------------- | ------------- |
| Décrit **ce que** le système doit faire | Décrit **comment** le système doit le faire |
| Rédigé par le client / chef de projet | Rédigé par l'équipe technique |
| Langage métier (compréhensible par tous) | Langage technique (pour les développeurs) |
| Exemple : "L'utilisateur doit pouvoir se connecter" | Exemple : "Authentification via JWT avec expiration 24h" |

**Analogie concrète** : Pour une maison, le CDC fonctionnel dit "je veux une cuisine ouverte sur le salon". Le CDC technique dit "mur porteur en béton armé de 20cm, ouverture de 3m avec IPN de 200mm".

Dans cette fiche, nous nous concentrons sur le **CDC technique**.

---

### Quelles sont les sections d'un CDC technique ?

**Définition** : Un CDC technique complet contient plusieurs sections obligatoires, organisées dans un ordre logique.

**Structure standard** :

| Section | Contenu |
| ------- | ------- |
| 1. Présentation du projet | Contexte, objectifs, périmètre |
| 2. Description fonctionnelle | Ce que le système doit faire (résumé) |
| 3. Architecture technique | Schéma global, choix technologiques |
| 4. Spécifications détaillées | Description de chaque composant |
| 5. Contraintes techniques | Performance, sécurité, compatibilité |
| 6. Environnements | Développement, test, production |
| 7. Livrables | Ce qui sera fourni |
| 8. Planning | Jalons et dates |
| 9. Annexes | Glossaire, références |

---

## Étapes Pratiques

### Étape 1 : Créer la structure du document

Crée un nouveau fichier pour ton cahier des charges. Utilise cette structure de base :

```markdown
# Cahier des Charges Technique

## Informations du document

| Élément | Valeur |
| ------- | ------ |
| Projet | [Nom du projet] |
| Version | 1.0 |
| Date | [Date de rédaction] |
| Auteur | [Ton nom] |
| Statut | Brouillon / En revue / Validé |

## Historique des versions

| Version | Date | Auteur | Modifications |
| ------- | ---- | ------ | ------------- |
| 1.0 | [Date] | [Nom] | Création initiale |

---

## 1. Présentation du projet

### 1.1 Contexte

[Pourquoi ce projet existe ? Quel problème résout-il ?]

### 1.2 Objectifs

[Qu'est-ce que le projet doit accomplir ?]

### 1.3 Périmètre

[Ce qui est inclus et ce qui est exclu]

---

## 2. Description fonctionnelle

[Résumé des fonctionnalités principales]

---

## 3. Architecture technique

### 3.1 Vue d'ensemble

[Schéma d'architecture]

### 3.2 Choix technologiques

| Composant | Technologie | Justification |
| --------- | ----------- | ------------- |
| Backend | [Ex: PHP/Symfony] | [Pourquoi ce choix] |
| Frontend | [Ex: JavaScript] | [Pourquoi ce choix] |
| Base de données | [Ex: PostgreSQL] | [Pourquoi ce choix] |

---

## 4. Spécifications détaillées

### 4.1 [Composant 1]

[Description détaillée]

### 4.2 [Composant 2]

[Description détaillée]

---

## 5. Contraintes techniques

### 5.1 Performance

[Temps de réponse, charge supportée]

### 5.2 Sécurité

[Authentification, chiffrement, conformité]

### 5.3 Compatibilité

[Navigateurs, systèmes, versions]

---

## 6. Environnements

| Environnement | Usage | URL |
| ------------- | ----- | --- |
| Développement | Travail quotidien | localhost |
| Test | Validation | test.example.com |
| Production | Utilisateurs finaux | www.example.com |

---

## 7. Livrables

| Livrable | Description | Format |
| -------- | ----------- | ------ |
| Code source | Application complète | Git repository |
| Documentation | Guide d'installation | Markdown |
| Tests | Suite de tests automatisés | PHPUnit |

---

## 8. Planning

| Jalon | Date | Livrable |
| ----- | ---- | -------- |
| Kick-off | [Date] | CDC validé |
| Sprint 1 | [Date] | [Fonctionnalité] |
| Recette | [Date] | Application testée |
| Mise en production | [Date] | Application live |

---

## 9. Annexes

### 9.1 Glossaire

| Terme | Définition |
| ----- | ---------- |
| [Terme technique] | [Explication] |

### 9.2 Références

- [Document 1]
- [Document 2]
```

---

### Étape 2 : Rédiger la présentation du projet

Cette section pose le contexte. Elle doit répondre à trois questions.

**Question 1 : Pourquoi ce projet existe ?**

```markdown
### 1.1 Contexte

L'entreprise XYZ gère actuellement ses commandes clients via des fichiers Excel.
Ce système pose plusieurs problèmes :
- Risque d'erreurs de saisie
- Pas de suivi en temps réel
- Difficulté à générer des statistiques

Le projet vise à remplacer ce système par une application web.
```

**Question 2 : Qu'est-ce que le projet doit accomplir ?**

```markdown
### 1.2 Objectifs

Les objectifs du projet sont :
1. Centraliser la gestion des commandes dans une base de données
2. Permettre le suivi en temps réel du statut des commandes
3. Générer automatiquement des rapports et statistiques
4. Réduire le temps de traitement d'une commande de 50%
```

**Question 3 : Qu'est-ce qui est inclus et exclu ?**

```markdown
### 1.3 Périmètre

**Inclus dans le projet** :
- Gestion des commandes (création, modification, suppression)
- Gestion des clients
- Tableau de bord avec statistiques
- Export des données en CSV

**Exclu du projet** :
- Gestion de la facturation (sera traité dans un projet ultérieur)
- Application mobile (hors périmètre)
- Intégration avec le système comptable existant
```

---

### Étape 3 : Décrire l'architecture technique

Cette section explique les choix technologiques et l'organisation du système.

**Exemple de schéma d'architecture** (en texte) :

````markdown
### 3.1 Vue d'ensemble

L'application suit une architecture 3-tiers :

```text
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Navigateur    │────▶│   Serveur Web   │────▶│  Base de        │
│   (Frontend)    │     │   (Backend)     │     │  données        │
│                 │◀────│                 │◀────│                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
     HTML/CSS/JS            PHP/Symfony           PostgreSQL
```
````

**Exemple de tableau de choix technologiques** :

```markdown
### 3.2 Choix technologiques

| Composant | Technologie | Version | Justification |
| --------- | ----------- | ------- | ------------- |
| Langage backend | PHP | 8.3 | Maîtrisé par l'équipe, performant |
| Framework backend | Symfony | 7.4 LTS | Structure MVC, ORM intégré, sécurité |
| Base de données | PostgreSQL | 16 | Robuste, fonctionnalités avancées |
| Serveur web | Nginx | 1.26 | Performance, configuration flexible |
| Conteneurisation | Docker | 24+ | Environnements reproductibles |
| Frontend | Twig + jQuery | - | Intégré à Symfony, suffisant pour le besoin |

**Note** : Alternatives modernes à jQuery : **Alpine.js** (léger, déclaratif, ~15 Ko) ou **Hotwire/Stimulus** (intégré à Symfony UX).
```

---

### Étape 4 : Spécifier les contraintes techniques

Cette section définit les exigences non-fonctionnelles.

```markdown
## 5. Contraintes techniques

### 5.1 Performance

| Métrique | Valeur cible |
| -------- | ------------ |
| Temps de réponse moyen | < 200ms |
| Temps de réponse maximum | < 2s |
| Utilisateurs simultanés | 50 minimum |
| Disponibilité | 99.5% (hors maintenance planifiée) |

### 5.2 Sécurité

| Exigence | Implémentation |
| -------- | -------------- |
| Authentification | Formulaire de login avec session sécurisée |
| Mots de passe | Hashés avec Argon2id (préféré) ou bcrypt (coût 12 minimum) |
| Communication | HTTPS obligatoire (TLS 1.2 minimum, TLS 1.3 recommandé) |
| Protection CSRF | Token Symfony activé sur tous les formulaires |
| Conformité | RGPD (données personnelles en Europe) |

### 5.3 Compatibilité

| Élément | Versions supportées |
| ------- | ------------------- |
| Navigateurs | Chrome 90+, Firefox 90+, Safari 14+, Edge 90+ |
| Résolution écran | 1280x720 minimum |
| JavaScript | Requis pour les fonctionnalités interactives |
```

---

### Étape 5 : Définir les livrables

Liste précisément ce qui sera fourni à la fin du projet.

```markdown
## 7. Livrables

| Livrable | Description | Format | Critère d'acceptation |
| -------- | ----------- | ------ | --------------------- |
| Code source | Application complète | Repository Git | Tests passants, code documenté |
| Documentation technique | Guide d'installation et d'architecture | Markdown | Permet une installation en < 30min |
| Documentation utilisateur | Manuel d'utilisation | PDF | Couvre toutes les fonctionnalités |
| Tests automatisés | Tests unitaires et fonctionnels | PHPUnit/Behat | Couverture > 80% |
| Données de test | Jeu de données pour démonstration | Fixtures Doctrine | 100 commandes, 50 clients |
```

---

## Commandes Utiles

Cette fiche ne contient pas de commandes techniques car elle porte sur la rédaction de documentation.

---

## Pièges Fréquents

### Piège 1 : Être trop vague

⚠️ **Problème** : Des phrases comme "le système doit être rapide" ou "l'interface doit être ergonomique" ne veulent rien dire de précis.

✅ **Solution** : Toujours quantifier et préciser.

```markdown
<!-- ❌ Vague -->
Le système doit être rapide.

<!-- ✅ Précis -->
Le temps de réponse doit être inférieur à 200ms pour 95% des requêtes.
```

---

### Piège 2 : Oublier le périmètre d'exclusion

⚠️ **Problème** : Ne pas dire ce qui est exclu laisse la porte ouverte aux demandes supplémentaires.

✅ **Solution** : Toujours lister explicitement ce qui n'est PAS inclus.

```markdown
<!-- ❌ Incomplet -->
Le projet inclut la gestion des commandes.

<!-- ✅ Complet -->
**Inclus** : Gestion des commandes (création, modification, suppression, liste)

**Exclu** :
- Gestion de la facturation
- Notifications par email
- Application mobile
```

---

### Piège 3 : Ne pas versionner le document

⚠️ **Problème** : Sans numéro de version, impossible de savoir si tout le monde a la même version du CDC.

✅ **Solution** : Toujours inclure un tableau de versions et mettre à jour à chaque modification.

```markdown
## Historique des versions

| Version | Date | Auteur | Modifications |
| ------- | ---- | ------ | ------------- |
| 1.0 | 15/01/2024 | Jean Dupont | Création initiale |
| 1.1 | 22/01/2024 | Jean Dupont | Ajout contrainte performance |
| 1.2 | 05/02/2024 | Marie Martin | Modification périmètre (facturation exclue) |
```

---

### Piège 4 : Mélanger le "quoi" et le "comment"

⚠️ **Problème** : Le CDC technique doit décrire les choix techniques, mais pas les détails d'implémentation ligne par ligne.

✅ **Solution** : Rester au niveau architectural. Les détails d'implémentation vont dans le code.

```markdown
<!-- ❌ Trop détaillé -->
La fonction de login utilise la méthode POST sur /api/login,
elle reçoit un JSON avec les champs "email" et "password",
elle appelle UserRepository::findByEmail(), puis vérifie le hash...

<!-- ✅ Niveau approprié -->
L'authentification utilise un système de sessions côté serveur.
Les mots de passe sont hashés avec bcrypt.
Un token CSRF protège le formulaire de login.
```

---

## Checklist de Validation

- [ ] Je comprends la différence entre CDC fonctionnel et CDC technique
- [ ] Je sais structurer un CDC avec les 9 sections standard
- [ ] Je sais rédiger un contexte et des objectifs clairs
- [ ] Je sais définir un périmètre avec inclusions ET exclusions
- [ ] Je sais justifier mes choix technologiques dans un tableau
- [ ] Je sais quantifier les contraintes de performance et sécurité
- [ ] Je sais lister les livrables avec leurs critères d'acceptation

---

## Exercice Pratique

**Énoncé** : Rédige le début d'un CDC technique pour le projet suivant :

> Une association de quartier veut un site web pour permettre aux habitants de signaler des problèmes (nid de poule, lampadaire cassé, dépôt sauvage). Les signalements doivent pouvoir être consultés par la mairie.

**Indications** :

- Rédige les sections 1 (Présentation), 3.2 (Choix technologiques) et 5.2 (Sécurité)
- Définis clairement le périmètre (inclus/exclu)
- Justifie au moins 3 choix technologiques
- Liste au moins 3 contraintes de sécurité

**Résultat attendu** : Un document Markdown d'environ 50-80 lignes couvrant ces sections.

---

## Solution de l'Exercice

> **Note** : Cette section contient une solution possible. Essaie d'abord de résoudre l'exercice par toi-même.

---

```markdown
# Cahier des Charges Technique - Signalement Quartier

## Informations du document

| Élément | Valeur |
| ------- | ------ |
| Projet | Signalement Quartier |
| Version | 1.0 |
| Date | 15/01/2024 |
| Auteur | [Ton nom] |
| Statut | Brouillon |

---

## 1. Présentation du projet

### 1.1 Contexte

L'association de quartier "Les Voisins Solidaires" reçoit actuellement les
signalements de problèmes par téléphone ou email. Ce système présente
plusieurs inconvénients :
- Pas de suivi centralisé des signalements
- Difficulté à localiser précisément les problèmes
- La mairie ne peut pas consulter les signalements directement
- Pas de visibilité pour les habitants sur l'état de leur signalement

### 1.2 Objectifs

1. Permettre aux habitants de signaler un problème via un formulaire web
2. Localiser les signalements sur une carte
3. Permettre à la mairie de consulter et traiter les signalements
4. Informer les habitants de l'avancement de leur signalement

### 1.3 Périmètre

**Inclus dans le projet** :
- Formulaire de signalement (type de problème, description, photo, localisation)
- Carte interactive des signalements
- Interface d'administration pour la mairie
- Notification par email du changement de statut

**Exclu du projet** :
- Application mobile native (le site sera responsive)
- Système de vote/commentaires sur les signalements
- Intégration avec les outils internes de la mairie
- Statistiques avancées et tableaux de bord

---

## 3.2 Choix technologiques

| Composant | Technologie | Version | Justification |
| --------- | ----------- | ------- | ------------- |
| Backend | PHP/Symfony | 7.4 LTS | Framework robuste, adapté aux CRUD, bonne documentation |
| Base de données | PostgreSQL | 16 | Support natif des données géographiques (PostGIS) |
| Serveur web | Nginx | 1.26 | Performance, gestion efficace des fichiers statiques |
| Conteneurisation | Docker | 24+ | Environnement identique dev/prod |
| Cartographie | Leaflet.js | 1.9+ | Open source, fonctionne offline, pas de clé API |
| Upload images | VichUploaderBundle | - | Intégration native Symfony, redimensionnement |

---

## 5.2 Sécurité

| Exigence | Implémentation |
| -------- | -------------- |
| Authentification habitants | Optionnelle (signalement anonyme possible) |
| Authentification mairie | Login/mot de passe avec rôle ADMIN |
| Mots de passe | Hashés avec bcrypt (coût 13) |
| Communication | HTTPS obligatoire |
| Protection CSRF | Token Symfony sur tous les formulaires |
| Upload fichiers | Validation type MIME (images uniquement), taille max 5 Mo |
| Données personnelles | Conformité RGPD, pas de données sensibles stockées |
| Protection spam | Honeypot + rate limiting (5 signalements/heure/IP) |
```

---

## Navigation

→ Fiche suivante : **[BC01 - 02 - L'Étude de Marché et Veille Technologique](02-etude-de-marche.md)**
