---
tags:
  - Joomla
  - Débutant
  - Pratique
description: "Installer Joomla CMS 6.1.3 en local depuis le paquet Full, avec les modules PHP exigés, 256 Mo de mémoire, _JEXEC et le minimum PHP dans index.php."
estimated_time: "40 min"
fiche_number: 2
total_fiches: 24
cursus: "Joomla CMS"
---

# 02 - Installation de Joomla 6.1.3

> **En bref** : Tu prépares PHP 8.3+, les modules exigés et 256 Mo de mémoire, puis tu installes le CMS 6.1.3 depuis le paquet Full en vérifiant `_JEXEC` et le minimum PHP dans `index.php`. Lecture estimée : 40 min.

## Prérequis

- Fiche 1 : [CMS, Framework et versions](01-cms-vs-framework-et-versions.md)
- Un interpréteur PHP 8.3.0 ou plus, avec un serveur local (Apache 2.4 ou Nginx 1.26+)
- Une base MySQL 8.0.13, MariaDB 10.4+ (minimum forcé) ou PostgreSQL 12.0+
- Le fichier local `Joomla_6.1.3-Stable-Full_Package.zip` (environnement hors ligne)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras vérifier les prérequis PHP du CMS 6.1.3, extraire le paquet Full, et relier `index.php` (PHP >= 8.3.0 et `_JEXEC`) à l'installateur.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le paquet Full 6.1.3 ?

**Définition** : Une install neuve utilise l'archive **Full** `Joomla_6.1.3-Stable-Full_Package.zip` (release 6.1.3, 18 août 2026). L'archive **Update** `Joomla_6.1.3-Stable-Update_Package.zip` superpose des fichiers sur un site déjà installé. Le ZIP Full n'a **pas** été listé fichier par fichier dans la recherche de ce cursus (seul l'Update l'a été). Tu n'inventes pas son arbre interne.

**Le problème que le choix Full / Update résout** :

Sans distinguer les archives, voici les problèmes rencontrés :

1. **Mauvais ZIP** : tu décompresses l'Update dans un dossier vide.
2. **Mauvais Git** : tu clones `HEAD` de `5.4-dev` au lieu du paquet 6.1.3.
3. **Arbre inventé** : tu décris le Full comme si son listing interne était prouvé.

| Archive            | Usage                          | Listing interne recherche |
| ------------------ | ------------------------------ | ------------------------- |
| Full Package 6.1.3 | Install neuve (cette fiche)    | non listé                 |
| Update Package     | Superposition site existant    | listé (favicons, fiche 06) |
| Tag git `6.1.3`    | Lire le code ; git ignore `/media` | pas un paquet d'install |

**Analogie concrète** : Le Full est le carton complet du meuble. L'Update est le sachet de pièces de rechange. Tu ne montes pas le meuble avec le sachet.

**Ce que le paquet Full n'est PAS** :

- Ce n'est pas l'Update Package, ni un clone `5.4-dev`, ni un Framework Composer à part.

---

### Qu'est-ce que `index.php` : PHP >= 8.3.0 et `_JEXEC` ?

**Définition** : `index.php` à la racine est le **front controller** du site. Au tag 6.1.3, il impose PHP >= **8.3.0** et définit `_JEXEC`, puis le flux observé charge `includes/app.php` (`SiteApplication::execute()`). `_JEXEC` marque que la requête est passée par ce front controller.

**Le problème que ce front controller résout** :

Sans ce fichier unique, voici les problèmes rencontrés :

1. **PHP trop bas** : 8.2 exécute des fichiers jusqu'à une erreur plus tardive.
2. **Inclusion directe** : sans `_JEXEC`, un visiteur vise un PHP interne.
3. **Portes mélangées** : admin, API et CLI ont leurs propres entrées.

| Porte | Fichier / ancrage              | Application                  |
| ----- | ------------------------------ | ---------------------------- |
| Site  | `index.php`                    | `SiteApplication`            |
| Admin | `administrator/includes/app.php` | `AdministratorApplication` |
| API   | `api/includes/app.php`         | `ApiApplication`             |
| CLI   | `cli/joomla.php` (PHP >= 8.3)  | `Joomla\Console\Application` |

Le flux `execute()` / `dispatch()` est une **convention lue dans le code**. Cette fiche s'appuie sur le flux observé dans le code 6.1.3. La page Lifecycle 6.1 du manuel n'est pas utilisée ici.

**Analogie concrète** : `index.php` est l'accueil du bâtiment. `_JEXEC` est le badge visiteur. La règle « 8.3.0 minimum » est écrite sur cette porte.

**Ce que `_JEXEC` n'est PAS** :

- Ce n'est pas un jeton CSRF, ni le `$secret` de `configuration.php`.
- Ce n'est pas une API à appeler dans tes extensions : c'est une constante du front controller.

---

### Qu'est-ce que les modules PHP exigés et la mémoire 256 Mo ?

**Définition** : Pour Joomla 5.x et 6.x, les modules exigés sont `json`, `simplexml`, `dom`, `zlib`, `gd`, et **un** connecteur parmi `mysqlnd` **ou** `pdo_mysql` **ou** `pdo_pgsql`. La mémoire PHP **recommandée** en 6.x est **au moins 256 Mo**.

**Le problème que cette liste résout** :

Sans liste fermée, voici les problèmes rencontrés :

1. **Module manquant** : images sans `gd`, XML sans `simplexml` / `dom`, archive sans `zlib`.
2. **Mauvais connecteur** : PDO SQLite seulement, sans les trois noms ci-dessus.
3. **Mémoire trop basse** : 128 Mo affiche `phpinfo()`, pas l'admin 6.x.

| Exigence         | Valeur 6.x                                            |
| ---------------- | ----------------------------------------------------- |
| `json` `simplexml` `dom` `zlib` `gd` | tous obligatoires                      |
| Base             | un parmi `mysqlnd` / `pdo_mysql` / `pdo_pgsql`        |
| `memory_limit`   | recommandé >= 256 Mo                                  |

**Analogie concrète** : Les modules sont les outils dans la caisse avant le montage. Un tournevis parmi trois modèles suffit pour la base. 256 Mo est la taille recommandée de l'établi.

**Ce que cette liste n'est PAS** :

- Ce n'est pas le CLI `php cli/joomla.php` (`php -m` est PHP).
- Ce n'est pas « tous les connecteurs à la fois ».
- Ce n'est pas le minimum MariaDB 10.4 (fiche 01).

---

### Qu'est-ce que l'installateur web et `installation/joomla.php` ?

**Définition** : Après extraction du Full, tu lances l'installateur web, ou `installation/joomla.php install` (CLI documenté par le guide). L'installateur écrit `configuration.php`, y compris `$secret` (obligatoire ; le dist est vide, commentaire : générer une chaîne aléatoire). `$secret` entre dans le nom de session. Le minimum MariaDB **forcé** ici est 10.4, pas 10.6.

**Le problème que l'installateur résout** :

Sans installateur, voici les problèmes rencontrés :

1. **Pas de `configuration.php`** : pas de secret, pas d'accès base.
2. **`$secret` vide** : le dist ne doit pas rester en l'état.
3. **Mauvaise borne base** : tu refuses 10.4.x au nom du guide 5 vers 6.

**Analogie concrète** : Extraire le ZIP pose les cartons. L'installateur signe le contrat de bail (`configuration.php`).

**Ce que l'installateur n'est PAS** :

- Ce n'est pas `php cli/joomla.php` (CLI **après** install ; le manuel montre `user:list`).
- Ce n'est pas `com_joomlaupdate`, ni un composant de sauvegarde (le cœur n'en fournit pas).

---

## Étapes Pratiques

### Étape 1 : Vérifier PHP, les modules et la mémoire

```bash
php -v
php -m
php -r 'echo ini_get("memory_limit"), PHP_EOL;'
```

**Résultat attendu** :

```text
PHP 8.3.0 ou plus (reco tableau 6.1 : 8.4)
Modules : json, simplexml (ou SimpleXML), dom, zlib, gd
Un parmi : mysqlnd, pdo_mysql, pdo_pgsql
memory_limit : 256M ou plus (recommandé 6.x)
```

---

### Étape 2 : Extraire le paquet Full 6.1.3

```bash
unzip Joomla_6.1.3-Stable-Full_Package.zip -d /chemin/vers/docroot
ls /chemin/vers/docroot/index.php
```

**Résultat attendu** :

```text
/chemin/vers/docroot/index.php
```

Tu n'utilises pas `Joomla_6.1.3-Stable-Update_Package.zip` pour cette install neuve.

---

### Étape 3 : Lire PHP min et `_JEXEC` dans `index.php`

```bash
grep -n "_JEXEC\|8.3.0" index.php
```

**Résultat attendu** :

```text
Des lignes de index.php qui portent 8.3.0 et _JEXEC
```

Faits du tag : PHP < 8.3.0 refusé ; `_JEXEC` défini ; suite vers `includes/app.php` (flux observé).

---

### Étape 4 : Lancer l'installateur

1. Pointe le navigateur vers la racine extraite, ou lance `installation/joomla.php install`.
2. Base : MySQL 8.0.13+, MariaDB **10.4+** (forcé, distinct de Supported 10.6), ou PostgreSQL 12.0+.
3. Vérifie que `configuration.php` existe et que `$secret` n'est plus vide.

**Résultat attendu** :

```text
Le site répond. /administrator/ répond. configuration.php est à la racine.
```

`php cli/joomla.php user:list` est du CLI **post-install** (fiche 13), toujours PHP >= 8.3.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php -v` | Version PHP (minimum 8.3.0) |
| `php -m` | Modules chargés |
| `php -r 'echo ini_get("memory_limit"), PHP_EOL;'` | Limite mémoire |
| `grep -n _JEXEC index.php` | Garde `_JEXEC` dans `index.php` |
| `php installation/joomla.php install` | Install CLI documentée par le guide |

---

## Pièges Fréquents

### Piège 1 : Extraire l'Update Package dans un dossier vide

⚠️ **Problème** : L'Update sert à un site déjà installé.

✅ **Solution** : `Joomla_6.1.3-Stable-Full_Package.zip` pour une install neuve.

---

### Piège 2 : PHP 8.2, `gd` absent, ou 128 Mo

⚠️ **Problème** : `index.php` refuse PHP < 8.3.0. `gd` est exigé. La reco 6.x est 256 Mo.

✅ **Solution** : `php -v`, `php -m`, `memory_limit`. Liste fermée : `json`, `simplexml`, `dom`, `zlib`, `gd`, plus un connecteur.

---

### Piège 3 : Cloner `5.4-dev`

⚠️ **Problème** : La branche Git par défaut n'est pas 6.1.3. `media/` n'est pas dans git.

✅ **Solution** : Paquet Full 6.1.3. Lire le code sur le tag, pas sur `HEAD`.

---

### Piège 4 : Croire que l'installateur force MariaDB 10.6

⚠️ **Problème** : 10.6 est Supported / guide 5 vers 6. Le minimum **forcé** est 10.4.

✅ **Solution** : Relire la fiche 01. Ne pas fusionner les bornes.

---

## Checklist de Validation

- [ ] PHP >= 8.3.0 (`index.php` du tag 6.1.3)
- [ ] `php -m` montre `json`, `simplexml`, `dom`, `zlib`, `gd`
- [ ] Un parmi `mysqlnd` / `pdo_mysql` / `pdo_pgsql`
- [ ] `memory_limit` >= 256M (recommandation 6.x)
- [ ] Archive **Full** 6.1.3, pas l'Update
- [ ] `_JEXEC` et `8.3.0` vus dans `index.php`
- [ ] `configuration.php` existe après l'installateur
- [ ] Je n'invente pas l'arbre interne du ZIP Full

---

## Exercice Pratique

**Énoncé** : Ta machine affiche `PHP 8.3.6`, `memory_limit=128M`, modules `json`, `dom`, `zlib`, `pdo_mysql`, **sans** `gd` ni `simplexml`. Tu as uniquement `Joomla_6.1.3-Stable-Update_Package.zip`. Dis ce qui bloque une install neuve 6.1.3.

**Indications** :

- Sépare version PHP, mémoire, modules, archive
- `pdo_mysql` suffit comme connecteur
- `gd` et `simplexml` sont exigés
- L'Update n'est pas le paquet d'une install neuve

**Résultat attendu** : Une liste de blocages avec la correction de chacun.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

1. **PHP 8.3.6** : passe (>= 8.3.0).
2. **`memory_limit=128M`** : sous la reco 256 Mo. Passer à `256M` ou plus.
3. **`gd` et `simplexml` absents** : les activer.
4. **`json`, `dom`, `zlib`, `pdo_mysql`** : présents. `pdo_mysql` remplit le « un parmi trois ».
5. **Archive Update** : bloquant. Obtenir `Joomla_6.1.3-Stable-Full_Package.zip`.

Ensuite : extraire le Full, `grep` `_JEXEC` et `8.3.0`, lancer l'installateur web ou `installation/joomla.php install`.

---

## Navigation

← Fiche précédente : **[CMS, Framework et versions](01-cms-vs-framework-et-versions.md)**

→ Fiche suivante : **[Template enfant Cassiopeia](03-template-enfant-cassiopeia.md)**
