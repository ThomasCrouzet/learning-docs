---
tags:
  - Joomla
  - Débutant
  - Référence
description: "Distinguer le CMS Joomla du Framework, figer le tag 6.1.3, et lire PHP, MariaDB et le chemin de montée sans saut 4.4 vers 6."
estimated_time: "30 min"
fiche_number: 1
total_fiches: 24
cursus: "Joomla CMS"
---

# 01 - CMS, Framework et versions

> **En bref** : Tu distingues le CMS Joomla du Framework, tu figes les exemples sur le tag 6.1.3, et tu lis les écarts PHP 8.5 et MariaDB 10.4 / 10.6. Lecture estimée : 30 min.

## Prérequis

- Savoir lancer `php -v` dans un terminal
- Aucune connaissance préalable de Joomla n'est requise (tout est expliqué ci-dessous)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer la différence entre le CMS et le Framework, citer les bornes PHP et MariaDB du tag 6.1.3, et refuser un saut 4.4 vers 6.x.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le CMS Joomla par rapport au Framework ?

**Définition** : Le **CMS Joomla!** est le produit de ce cursus : site, administrateur, API `/v1` et CLI. Le **Joomla! Framework** est un produit distinct : des bibliothèques PHP via Composer, sans fonctionnalités CMS. L'un n'exige pas d'installer l'autre. Le CMS 6.1.3 vend toutefois des paquets `joomla/*` en `^4.0`, pas un Framework 6.

**Le problème que cette distinction résout** :

Sans cette distinction, voici les problèmes rencontrés :

1. **Mauvais produit** : tu installes des paquets Composer `joomla/*` en croyant obtenir un site administrable.
2. **Mauvaise version** : tu parles d'un « Framework 6 » pour le CMS 6.1.3.
3. **Dépendance inventée** : tu crois qu'il faut installer le Framework à part.

**Comment cette distinction résout ces problèmes** :

| Problème            | Solution                                                          |
| ------------------- | ----------------------------------------------------------------- |
| Mauvais produit     | Cibler le CMS. L'un n'exige pas d'installer l'autre.              |
| Mauvaise version    | Le CMS 6.1.3 vend `joomla/*` ^4.0 (`composer.json` du tag).       |
| Dépendance inventée | Pas d'install Framework séparée pour faire tourner le CMS.        |

**Analogie concrète** : Le CMS est un appartement meublé. Le Framework est une caisse d'outils. Tu peux utiliser la caisse sans emménager. L'appartement 6.1.3 contient des outils de la caisse **4.x**.

**Ce que cette distinction n'est PAS** :

- Ce n'est pas une égalité « CMS 6 = Framework 6 ». Les cinq parcours de ce cursus ne sont **pas** une carte officielle 6.1 (overlay pédagogique).

---

### Qu'est-ce que le tag 6.1.3 et la série 5.x Legacy ?

**Définition** : L'ancre des exemples est le tag Git `joomla-cms` **6.1.3** (18 août 2026). La cible est **6.x** (manuel programmeur **6.1 Current**). **5.x** est Legacy : correctifs seulement. **4.x** et **3.x** sont hors support.

**Le problème que cette ancre résout** :

Sans ancre de tag, voici les problèmes rencontrés :

1. **Branche Git trompeuse** : la branche par défaut reste `5.4-dev` alors que la release et le manuel Current sont en 6.1.3.
2. **Mélange 5.x / 6.x** : 5.4.8 sort le même jour que 6.1.3, mais 5.x est gelé en bugfix.
3. **Code `HEAD`** : copier `HEAD` de `5.4-dev` dans une fiche 6.x produit des écarts.

**Tableau des séries** :

| Série | Dernier paquet        | PHP min / reco | Support                                                        |
| ----- | --------------------- | -------------- | -------------------------------------------------------------- |
| 6.x   | 6.1.3, 18 août 2026   | 8.3.0 / 8.4    | 14 oct. 2025 · 17 oct. 2028 · 16 oct. 2029 (2028/2029 inférés) |
| 5.x   | 5.4.8, 18 août 2026   | 8.1.0 / 8.3    | bugfix 13 oct. 2026, sécu 12 oct. 2027                         |
| 4.x   | 4.4.14, 30 sept. 2025 | 7.2.5 / 8.2    | hors support                                                   |
| 3.x   | -                     | -              | fin 17 août 2023 ; LTS jusqu'au 17 fév. 2025                   |

Les dates 6.x 2028/2029 suivent la grille 5.x. Les en-têtes de colonnes absents de la feuille de route empêchent de nommer officiellement chaque jalon : ce cursus les signale comme **inférés**.

**Analogie concrète** : Figer le tag, c'est photocopier une page datée plutôt que le brouillon encore ouvert (`5.4-dev`).

**Ce que le tag 6.1.3 n'est PAS** :

- Ce n'est pas `HEAD` de la branche par défaut GitHub.
- Ce n'est pas la série 5.x Legacy, même publiée le même jour.

---

### Qu'est-ce que PHP 8.3.0 / 8.4 et l'absence de 8.5 du tableau ?

**Définition** : Pour Joomla 6.1, _Minimum_ est la version refusée par le CMS, _Supported_ le plancher encore corrigé. PHP **minimum et supported** = **8.3.0**. PHP **recommended** = **8.4**. PHP **8.5** est **absent** du tableau d'exigences 6.1. `index.php` du tag impose PHP >= 8.3.0. La CI du tag exécute 8.3, 8.4 **et** 8.5. La page 5.4 new-features documente le support 8.5.

**Le problème que cette lecture résout** :

Sans séparer tableau et CI, voici les problèmes rencontrés :

1. **PHP trop ancien** : 8.2 (reco 4.x) est sous le minimum 6.x.
2. **8.5 présenté comme exigence 6.1** : le tableau 6.1 ne le liste pas.
3. **CI prise pour documentation** : la CI n'écrit pas la ligne du tableau.

| Source                    | PHP cité                                      |
| ------------------------- | --------------------------------------------- |
| Tableau d'exigences 6.1   | min / supported 8.3.0, reco 8.4, **pas 8.5**  |
| `index.php` tag 6.1.3     | PHP >= 8.3.0                                  |
| CI du tag 6.1.3           | 8.3 / 8.4 / 8.5                               |

**Analogie concrète** : Le tableau 6.1 est le menu à la porte. La CI est ce que la cuisine teste. Un plat testé (8.5) n'est pas pour autant écrit sur le menu.

**Ce que PHP 8.5 n'est PAS dans ce cursus** :

- Ce n'est pas une ligne du tableau 6.1, donc pas « Joomla 6.1 exige 8.5 ».
- Ce n'est pas une interdiction : la CI du tag l'exécute. Tu notes l'écart.

---

### Qu'est-ce que l'écart MariaDB 10.4 forcé / 10.6 Supported ?

**Définition** : L'installateur **force** MariaDB **10.4** (`DatabaseHelper::$dbMinimumMariaDb`). La ligne _Supported_ 6.1 et le guide 5 vers 6 citent **10.6**. Le canal TUF 6.x déclare `mariadb=10.4`. `com_joomlaupdate` **n'occulte pas** l'offre 6.x pour 10.4.x. `UpdateModel::getPhpOptions` vérifie PHP, zlib, xml, json, schéma, **pas** la version MariaDB. Le flux XML 6.x est 404 (TUF seul). Reco tableau 6.x : MariaDB 12.0. MySQL 6.x : 8.0.13. PostgreSQL : 14.0 supported, 12.0 min, 17.6 reco.

**Le problème que cet écart nommé résout** :

Sans le nommer, voici les problèmes rencontrés :

1. **Refus inventé** : tu crois que 10.4.x ne peut pas installer 6.1.3.
2. **Seuil unique** : tu fusionnes minimum forcé et supported / guide.
3. **Update mal lu** : tu crois que l'offre 6.x est cachée sous 10.6.

| Source                                    | Borne MariaDB      |
| ----------------------------------------- | ------------------ |
| Installateur (`DatabaseHelper`)           | minimum forcé 10.4 |
| Tableau 6.1 _Supported_ + guide 5 vers 6  | 10.6               |
| TUF 6.x                                   | 10.4               |

**Analogie concrète** : La porte s'ouvre à **1,60 m** (10.4 forcé). L'affiche du hall dit **1,70 m** (10.6). Les deux chiffres restent distincts.

**Ce que MariaDB 10.4 n'est PAS** :

- Ce n'est pas la ligne _Supported_ 10.6.
- Ce n'est pas un masquage 6.x par `com_joomlaupdate` pour 10.4.x (code + TUF, pas un essai live).

---

### Qu'est-ce que l'absence de saut 4.4 vers 6 ?

**Définition** : L'entrée officielle en 6.x est une **mise à niveau in-place depuis 5.4.x**, pas une migration, **pas un saut** depuis 4.4.x. Chemin : 4.4.x vers 5.x, puis 5.4.x vers 6.x. Avant J6 : désactiver **Behaviour - Backward Compatibility** (couche J4 vers J5). **Behaviour - Backward Compatibility 6** est essentiel (activé tout seul en 5.4.x ; install neuve 6 : installé, désactivé). Détail : fiche [07 - Montée de 5.4 vers 6](07-montee-5-4-vers-6.md).

**Le problème que ce chemin résout** :

Sans chemin explicite, voici les problèmes rencontrés :

1. **Saut 4.4 vers 6** : aucun chemin documenté.
2. **Confusion upgrade / migration** : 5.4 vers 6 est un upgrade in-place.
3. **PHP 8.3 pris pour un saut** : un PHP assez récent ne crée pas le chemin 4.4 vers 6.

| Départ    | Étape suivante | Interdit        |
| --------- | -------------- | --------------- |
| 4.4.x     | 5.x            | sauter vers 6.x |
| 5.x < 5.4 | 5.4.x          | sauter vers 6.x |
| 5.4.x     | 6.x in-place   | -               |

**Analogie concrète** : Tu ne passes pas de la 4e à la terminale. 4.4.x, puis 5.x, puis 5.4.x, puis 6.x.

**Ce que ce chemin n'est PAS** :

- Ce n'est pas l'installation neuve 6.1.3 (fiche 02).
- Ce n'est pas un saut « si PHP est 8.3 ».

---

## Étapes Pratiques

### Étape 1 : Vérifier PHP

```bash
php -v
```

**Résultat attendu** :

```text
PHP 8.3.x (ou 8.4.x)
```

En dessous de 8.3.0 : tu n'installes pas Joomla 6.1.3 sur cet interpréteur. Si tu vois 8.5 : présent en CI du tag, **absent** du tableau 6.1.

---

### Étape 2 : Séparer CMS et Framework

Écris trois phrases :

1. « Je cible le **CMS** Joomla 6.1.3. »
2. « Le **Framework** est un produit Composer distinct. »
3. « Le CMS 6.1.3 vend le Framework **4.x** (`joomla/*` ^4.0). »

**Résultat attendu** :

```text
Aucune phrase qui dise « Framework 6 » pour le CMS 6.1.3.
```

---

### Étape 3 : Distinguer MariaDB 10.4 et 10.6

```bash
mysql --version
```

**Résultat attendu** : une ligne contenant le numéro MariaDB (ou MySQL). Règle :

- **< 10.4** : sous le minimum **forcé** de l'installateur
- **10.4.x** : accepté à l'install ; sous Supported 10.6
- **10.6.x ou plus** : aligne Supported / guide 5 vers 6 (reco tableau : 12.0)

---

### Étape 4 : Tracer un chemin sans saut

**Résultat attendu** :

```text
4.4.14  -> 5.x, puis 5.4.x, puis 6.x
5.4.8   -> 6.x in-place
6.1.3   -> déjà en 6.x (install neuve : fiche 02)
```

---

## Commandes Utiles

| Commande                              | Action                                 |
| ------------------------------------- | -------------------------------------- |
| `php -v`                              | Version PHP (min CMS 6.1.3 : 8.3.0)    |
| `php -m`                              | Modules PHP (détail fiche 02)          |
| `mysql --version`                     | Version client MySQL / MariaDB         |
| `php -r 'echo PHP_VERSION, PHP_EOL;'` | Numéro PHP seul                        |

---

## Pièges Fréquents

### Piège 1 : Confondre CMS et Framework

⚠️ **Problème** : Tu cites un « Framework 6 » ou tu installes Composer en croyant obtenir l'administrateur.

✅ **Solution** : CMS = ce cursus. Framework = bibliothèques distinctes. CMS 6.1.3 vend `joomla/*` **^4.0**.

---

### Piège 2 : Copier `HEAD` de `5.4-dev`

⚠️ **Problème** : La branche par défaut n'est pas la release 6.1.3.

✅ **Solution** : Ancre = tag **6.1.3**. 5.x = Legacy. 4.x / 3.x = hors support.

---

### Piège 3 : Écrire « PHP 8.5 est exigé » ou « interdit » en 6.1

⚠️ **Problème** : Le tableau 6.1 ne liste pas 8.5. La CI du tag l'exécute.

✅ **Solution** : Min CMS = 8.3.0. Reco = 8.4. 8.5 = absent du tableau, présent en CI.

---

### Piège 4 : Fusionner MariaDB 10.4 et 10.6, ou sauter 4.4 vers 6

⚠️ **Problème** : Tu refuses 10.4.x au nom du guide, ou tu sautes 4.4 vers 6.

✅ **Solution** : Forcé installateur = 10.4. Supported / guide = 10.6. Chemin : 4.4.x vers 5.x vers 5.4.x vers 6.x.

---

## Checklist de Validation

- [ ] Je distingue CMS et Framework (l'un n'exige pas l'autre)
- [ ] Je cite `joomla/*` ^4.0, pas un Framework 6
- [ ] Je fige les exemples sur le tag 6.1.3, pas `HEAD` de `5.4-dev`
- [ ] Je sais que 5.x est Legacy
- [ ] Je cite PHP 8.3.0 min / 8.4 reco, et 8.5 absent du tableau 6.1 mais présent en CI
- [ ] Je distingue MariaDB 10.4 forcé et 10.6 Supported
- [ ] Je refuse un saut 4.4 vers 6.x

---

## Exercice Pratique

**Énoncé** : Un site est en **Joomla 4.4.14**, PHP **8.2**, MariaDB **10.4.32**. On te demande « d'aller en 6.1.3 demain ». Rédige une note de quatre points : produit, chemin de séries, PHP, MariaDB.

**Indications** :

- Produit = CMS, pas Framework
- Pas de saut 4.4 vers 6
- PHP 8.2 est sous 8.3.0
- MariaDB 10.4.32 = minimum forcé, sous Supported 10.6

**Résultat attendu** : Quatre points, sans « on saute en 6 » et sans « Framework 6 ».

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

1. **Produit** : CMS Joomla 6.1.3. Le Framework est distinct ; le CMS 6 vend `joomla/*` ^4.0.
2. **Chemin** : 4.4.14 vers **5.x**, puis **5.4.x**, puis **6.x** in-place. 5.x est Legacy.
3. **PHP** : 8.2 est sous 8.3.0. Monter à 8.3.0 (min) ou 8.4 (reco) avant la série 6. 8.5 n'est pas une ligne du tableau 6.1.
4. **MariaDB** : 10.4.32 passe le minimum **forcé** 10.4. Ce n'est pas Supported 10.6 ni la reco 12.0. Update n'occulte pas 6.x pour 10.4.x.

---

## Navigation

→ Fiche suivante : **[Installation de Joomla 6.1.3](02-installation-6-1-3.md)**
