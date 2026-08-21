---
tags:
  - Joomla
  - Intermédiaire
  - Pratique
description: "Passer de Joomla 5.4.x à 6.x par une mise à niveau in-place : plugins de compatibilité, canal TUF, MariaDB 10.4 et extraction du ZIP."
estimated_time: "45 min"
fiche_number: 7
total_fiches: 24
cursus: "Joomla CMS"
---

# 07 - Montée de 5.4 vers 6

> **En bref** : L'entrée officielle en Joomla 6.x est une mise à niveau in-place depuis 5.4.x, pas une migration, avec deux plugins de compatibilité à ne pas confondre. Lecture estimée : 45 min.

## Prérequis

- Fiche [01 - CMS, Framework et versions](01-cms-vs-framework-et-versions.md)
- Fiche [02 - Installation de Joomla 6.1.3](02-installation-6-1-3.md)
- Un site déjà en **5.4.x** (dernier paquet 5.x : 5.4.8, 18 août 2026) ou un environnement de test copié depuis ce site
- PHP **8.3.0** minimum (recommandé **8.4**)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras distinguer une montée 5.4 vers 6 d'une migration, désactiver le bon plugin de compatibilité avant J6, et expliquer ce que TUF et l'extracteur web font réellement pour MariaDB 10.4 et pour les fichiers homonymes.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une mise à niveau in-place 5.4 vers 6 ?

**Définition** : Une mise à niveau in-place remplace les fichiers et le schéma du CMS **sur le même site**, depuis **5.4.x** vers **6.x**. Le guide officiel la nomme **upgrade**, pas **migration**.

**Le problème que cette distinction résout** :

Sans elle, tu prépares un site neuf (migration) ou tu tentes un saut 4.4.x vers 6.x. Le chemin documenté est 4.4.x vers 5.x, puis 5.4.x vers 6.x, sur **le même** site. L'offre 6.x passe par TUF, pas par `core/j6/default.xml` (404).

**Analogie concrète** : Remplacer le moteur d'une voiture en gardant carrosserie et immatriculation. Une migration serait de changer de voiture et de transvaser les cartons.

**Ce qu'une mise à niveau in-place n'est PAS** :

- Ce n'est pas une migration 3.x ou 4.x vers un site neuf.
- Ce n'est pas un saut 4.4.x vers 6.x. Le chemin documenté est 4.4.x vers 5.x, puis 5.4.x vers 6.x.
- Ce n'est pas une installation neuve 6.x. Une install neuve 6 livre le plugin **Behaviour - Backward Compatibility 6** installé et **désactivé**. Une montée depuis 5.4.x l'active toute seule.

---

### Les deux plugins Behaviour - Backward Compatibility

**Définition** : Deux plugins distincts du groupe `behaviour` gèrent l'héritage de code entre séries majeures.

| Plugin (nom UI) | Rôle | Quand |
| --------------- | ---- | ----- |
| **Behaviour - Backward Compatibility** (sans numéro) | Couche **J4 vers J5** | À **désactiver avant** de passer à J6 |
| **Behaviour - Backward Compatibility 6** | Couche **J5 vers J6**, essentielle | Activé automatiquement en 5.4.x ; install neuve 6 : installé, désactivé |

**Le problème que cette paire résout** :

Une extension écrite pour la série précédente casse quand des classes disparaissent. Les **deux** plugins activés ensemble sont interdits pendant la montée vers J6 : tu retires la couche J4 vers J5 **avant** J6.

**Analogie concrète** : Deux adaptateurs électriques de générations différentes. Tu n'empiles pas les deux. Tu retires l'adaptateur J4 vers J5 **avant** de brancher l'adaptateur J5 vers J6.

**Ce que ces plugins ne sont PAS** :

- Le plugin **sans numéro** n'est pas « la compatibilité J6 ». C'est la couche **J4 vers J5**.
- **Backward Compatibility 6** n'est pas optionnel pour une montée 5.4 vers 6 : le guide le traite comme **essentiel**. Tu pourras le désactiver plus tard en J6, **après** avoir vérifié chaque extension tierce, pas avant la montée.
- Ce ne sont pas des composants. Ce sont des plugins `behaviour`, chargés avant les autres plugins.

---

### TUF, XML 6.x et MariaDB 10.4

**Définition** : L'offre 6.x arrive par **TUF** (The Update Framework). La collection XML officielle s'arrête à 5.4.8 (`core/j5/default.xml`). Le fichier `core/j6/default.xml` répond **404**. Il n'y a pas de flux XML 6.x.

**Le problème que TUF pose si on lit seulement le guide** :

Le guide 5 vers 6 liste MariaDB **10.6** parmi les exigences, et le tableau Supported du projet met aussi 10.6. Le **minimum forcé à l'install** et la cible TUF 6.x déclarent `supported_databases.mariadb = "10.4"`. `com_joomlaupdate` **n'occulte pas** l'offre 6.x pour une MariaDB **10.4.x**.

**Comment lire les deux bornes ensemble** :

| Source | Borne MariaDB | Conséquence pédagogique |
| ------ | ------------- | ----------------------- |
| TUF 6.x (dont `Joomla_6.1.3-Stable-Update_Package.zip`) | `mariadb=10.4` | 10.4.x **passe** le minimum du manifeste |
| Guide 5 vers 6 / ligne Supported | 10.6 | Recommandation de plate-forme, pas un masquage de l'offre |
| Installateur CMS (`DatabaseHelper::$dbMinimumMariaDb`) | `'10.4'` | Minimum **forcé** à l'installation |
| `UpdateModel::getPhpOptions` | ne teste **pas** MariaDB | PHP, zlib, xml, json, schéma seulement |

Cibles TUF des paquets 6.x stables (tag 6.1.3) :

- `mariadb` 10.4, `mysql` 8.0.13, `postgresql` 12.0
- `php_minimum` 8.3.0, `channel` 6.x, `targetplatform` `(6\.[0-4])|^(5\.4)`

Le canal TUF 6.x s'appelle **Default** une fois en 6.x, et **Joomla Next** tant que tu es en 5.4.x.

**Analogie concrète** : Le panneau du magasin (guide) dit « huile 10.6 recommandée ». L'étiquette sur la bouteille (TUF) accepte déjà 10.4. Le magasin **n'enlève pas** la bouteille 6.x du rayon.

**Ce que TUF n'est PAS** :

- TUF n'est pas le XML `core/j6/default.xml` (404).
- MariaDB 10.4.x ne fait **pas** cacher l'offre 6.x : `UpdateModel` next-major teste sqlsrv/sqlazure et les plugins `compat` / `compat6`, pas le numéro MariaDB. `getAutoUpdateRequirementsState()` parcourt `getPhpOptions()` seulement.
- PHP **8.5** n'est pas dans le tableau 6.1 (la CI du tag exécute 8.3/8.4/8.5 : écart doc/CI, pas une exigence 6.1).

---

### Extracteur web : homonyme écrasé, extra conservé

**Définition** : Le chemin web de `com_joomlaupdate` extrait le ZIP à la racine via `administrator/components/com_joomlaupdate/extract.php` (`ZIPExtraction`). Le fichier `restore.php` est **absent**.

**Le problème que cette règle résout** :

Sans connaître cette règle, tu modifies un fichier cœur en croyant qu'il survivra à la mise à jour, ou tu crois qu'un fichier **hors ZIP** sera effacé.

**Comment l'extracteur se comporte** :

| Cas | Résultat |
| --- | -------- |
| Fichier **homonyme** (même chemin qu'une entrée du ZIP) | **Écrasé** : ouverture en `'wb'` (troncature) |
| Fichier **extra** (chemin absent du ZIP) | **Conservé** : l'extracteur ne parcourt que les Local File Headers |
| `administrator/components/com_joomlaupdate/update.php` | Seul chemin dans `skipFiles` |
| Après extraction | `finalisation.php` appelle `JoomlaInstallerScript::deleteUnexistingFiles()` : **seulement** les pistes listées sont effacées |

La liste complète de `deleteUnexistingFiles()` pour 6.1.3 **n'est pas énumérée** ici. Côté CLI, le schéma est le même (`Folder::copy` avec force) : extra hors ZIP conservé, homonyme livré écrasé.

**Analogie concrète** : Un carton étiqueté versé sur une étagère. Chaque objet du carton **remplace** l'objet de même nom. Un objet hors carton reste, sauf s'il figure sur une liste d'obsolescence (non reproduite ici).

**Ce que l'extracteur n'est PAS** : ce n'est pas `restore.php` (absent), ni une fusion de contenus.

Le cœur **ne fournit pas** de composant de sauvegarde. Avant une montée, tu copies fichiers + base avec un outil **tiers** (zip, `mysqldump`, phpMyAdmin, Akeeba, cPanel).

---

## Étapes Pratiques

### Étape 1 : Vérifier 5.4.x et les deux plugins

**Système** vers **Informations système** : Joomla **5.4.x**, PHP **8.3.0+**. Si tu es en 4.4.x : d'abord 5.x, puis 5.4.x. **Pas de saut vers 6.x.**

**Système** vers **Plugins**, dossier **Behaviour**. Deux lignes distinctes :

1. **Behaviour - Backward Compatibility** (sans numéro) : couche J4 vers J5.
2. **Behaviour - Backward Compatibility 6** : couche J5 vers J6.

**Résultat attendu avant J6** :

```text
Behaviour - Backward Compatibility     : Désactivé
Behaviour - Backward Compatibility 6   : Activé (sur un site monté en 5.4.x)
```

---

### Étape 2 : Désactiver le plugin sans numéro **avant** J6

1. Ouvre **Behaviour - Backward Compatibility** (sans numéro).
2. Passe l'état à **Désactivé**.
3. Enregistre.

Les deux plugins ne peuvent pas être activés ensemble pendant la montée vers J6. Le plugin **sans numéro** **doit** être désactivé **avant** J6.

Sur un site 5.4.x, **Backward Compatibility 6** s'est activé tout seul lors de la montée vers 5.4.x. Ne le désactive pas pour « faire propre » avant J6 : il est essentiel pour cette étape.

**Résultat attendu** :

```text
Le plugin J4 vers J5 est désactivé.
Le plugin Backward Compatibility 6 reste activé.
```

---

### Étape 3 : Passer le canal sur Joomla Next

1. **Système** vers **Mise à jour** vers **Joomla**.
2. Bouton **Options**.
3. Canal de mise à jour : **Joomla Next**.
4. **Enregistrer et fermer**.

L'offre 6.x est **uniquement TUF**. Tu ne dois pas chercher un XML `core/j6/default.xml` : il est 404.

**Résultat attendu** :

```text
Le composant com_joomlaupdate propose un paquet 6.x
(canal TUF 6.x, nom UI « Joomla Next » tant que tu es en 5.4).
```

Si ta MariaDB est **10.4.x** (sous 10.6) : l'offre 6.x **n'est pas masquée** pour cette raison. Le minimum TUF est 10.4. Le guide qui écrit 10.6 est une **recommandation**, pas le masquage observé dans le code.

---

### Étape 4 : Lancer la mise à niveau (après sauvegarde tierce)

1. Sauvegarde **fichiers + base** avec un outil tiers (le cœur n'a pas de composant de sauvegarde).
2. Active le mode Debug le temps du test.
3. Dans **Système** vers **Mise à jour** vers **Joomla**, accuse réception des avertissements d'extensions, puis lance la mise à jour.

En CLI (PHP >= 8.3) : `core:update:check`, `core:update:channel`, `core:update`.

**Résultat attendu** :

```text
L'administration affiche Joomla 6.x (exemple : 6.1.3) en haut à droite.
Le frontend et l'administration répondent.
```

Pendant l'extract web, chaque homonyme du ZIP **écrase** le fichier local. Un fichier extra hors ZIP **reste**.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php cli/joomla.php core:update:check` | Vérifier les mises à jour Joomla (nom canonique ; l'alias `core:check-updates` est déprécié, retrait 7.0) |
| `php cli/joomla.php core:update:channel` | Gérer le canal de mise à jour du cœur |
| `php cli/joomla.php core:update` | Mettre à jour Joomla |
| `php cli/joomla.php update:joomla:remove-old-files` | Appeler `deleteUnexistingFiles()` (liste 6.1.3 non énumérée ici) |

---

## Pièges Fréquents

### Piège 1 : Sauter de 4.4.x à 6.x ou parler de migration

⚠️ **Problème** : Tu tentes 4.4 vers 6 d'un coup, ou tu prépares une migration (site neuf) alors que 5.4 vers 6 est un **upgrade in-place**.

✅ **Solution** : 4.4.x vers 5.x, puis 5.4.x vers 6.x sur le **même** site. Le `targetplatform` TUF 6.x accepte `(6\.[0-4])|^(5\.4)`, pas 4.4.

---

### Piège 2 : Laisser le plugin sans numéro activé

⚠️ **Problème** : **Behaviour - Backward Compatibility** (J4 vers J5, sans numéro) reste activé. La montée vers J6 l'interdit en combinaison avec le plugin 6.

✅ **Solution** : Désactiver le plugin **sans numéro** **avant** J6. Garder **Backward Compatibility 6** activé pendant la montée depuis 5.4.x.

---

### Piège 3 : Croire que MariaDB 10.4 cache l'offre 6.x

⚠️ **Problème** : Le guide écrit MariaDB 10.6. Tu conclus que 10.4.x masque le paquet 6.x.

✅ **Solution** : TUF déclare `mariadb=10.4`. `com_joomlaupdate` **n'occulte pas** l'offre 6.x pour 10.4.x. Distingue reco du guide et borne TUF réelle.

---

### Piège 4 : Chercher le XML 6.x

⚠️ **Problème** : Tu ouvres `https://update.joomla.org/core/j6/default.xml` et tu obtiens 404.

✅ **Solution** : L'offre 6.x est **TUF seul**. La collection XML s'arrête à 5.4.8 / `core/j5/default.xml`.

---

### Piège 5 : Modifier un fichier cœur et croire qu'il survit

⚠️ **Problème** : Un homonyme du ZIP est ouvert en `'wb'` : ton édition disparaît.

✅ **Solution** : Personnaliser hors fichiers livrés (template enfant, `user.css`). Un extra **hors ZIP** est conservé par l'extracteur, sauf piste `deleteUnexistingFiles()` (liste non énumérée ici).

---

## Checklist de Validation

- [ ] Je distingue upgrade in-place 5.4 vers 6 et migration
- [ ] Je sais qu'il n'existe pas de saut 4.4 vers 6
- [ ] Je désactive **Behaviour - Backward Compatibility** (sans numéro) **avant** J6
- [ ] Je traite **Behaviour - Backward Compatibility 6** comme essentiel en 5.4.x (auto-activé ; install neuve 6 : installé, désactivé)
- [ ] Je sais que TUF 6.x déclare `mariadb=10.4` et que l'offre n'est pas occultée pour 10.4.x
- [ ] Je sais que `core/j6/default.xml` est 404 (TUF seul)
- [ ] Je sais qu'un homonyme du ZIP est écrasé et qu'un extra hors ZIP est conservé par l'extracteur

---

## Exercice Pratique

**Énoncé** : Un site est en **4.4.14**, PHP 8.3, MariaDB **10.4.32**. L'équipe veut « passer direct en 6.1.3 ». Un développeur affirme : « MariaDB 10.4 cache l'offre 6.x, et il faut laisser les deux plugins de compatibilité activés. »

Réponds par écrit aux quatre questions suivantes :

1. Quel chemin de versions est documenté ?
2. Que faire du plugin **sans numéro** avant J6 ?
3. Que fait **Backward Compatibility 6** sur un 5.4.x, et sur une install neuve 6 ?
4. L'offre 6.x est-elle occultée pour MariaDB 10.4.x ? D'où vient l'offre (XML ou TUF) ?

**Indications** :

- Sépare reco du guide (MariaDB 10.6) et borne TUF (`mariadb=10.4`).
- Nomme les plugins par leur libellé UI, pas par un numéro inventé.

**Résultat attendu** : Quatre réponses courtes, sans saut 4.4 vers 6, sans XML 6.x.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

1. **Chemin** : 4.4.x vers 5.x, puis 5.4.x vers 6.x. Pas de saut 4.4 vers 6. C'est un **upgrade in-place** depuis 5.4.x, pas une migration.

2. **Plugin sans numéro** : **Behaviour - Backward Compatibility** (couche J4 vers J5) doit être **désactivé avant** J6. Les deux plugins ne peuvent pas être activés ensemble pendant la montée.

3. **Backward Compatibility 6** : essentiel pour 5.4 vers 6.x ; **activé automatiquement** lors d'une montée vers 5.4.x. Une **nouvelle** install 6 le livre **installé mais désactivé**.

4. **MariaDB 10.4.x** : `com_joomlaupdate` **n'occulte pas** l'offre 6.x. TUF déclare `mariadb=10.4`. Le XML `core/j6/default.xml` est **404** : offre 6.x = **TUF seul**. Le guide qui écrit 10.6 est une recommandation, pas ce masquage.

---

## Navigation

← Fiche précédente : **[Favicons et limites d'accessibilité](06-favicons-et-accessibilite.md)**

→ Fiche suivante : **[ACL : authorise et view levels](08-acl-authorise-et-view-levels.md)**
