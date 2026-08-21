---
tags:
  - Joomla
  - Projet
  - Pratique
description: "Enchaîner les jalons 6.1.3 : enfant Cassiopeia, module et com_example, plugin console, ACL, CLI, API /v1, Cypress, ZIP pkg_ et updateservers."
estimated_time: "60 min"
fiche_number: 24
total_fiches: 24
cursus: "Joomla CMS"
id: "web.joomla.fil-rouge"
course_id: "web.joomla"
content_type: "project"
order: 24
---

# 24 - Fil rouge

> **En bref** : Enchaîner sur un site 6.1.3 les jalons vérifiés du cursus (enfant Cassiopeia, extensions, ACL, CLI, API, tests, package) et t'arrêter aux critères de réussite, pas aux absences du cœur. Lecture estimée : 60 min.

**Projet facultatif** : Ce projet est autonome. Tu peux le réaliser, l’adapter ou le passer sans bloquer l’accès aux autres fiches.

## Prérequis

- [Template enfant Cassiopeia](03-template-enfant-cassiopeia.md)
- [ACL : authorise et view levels](08-acl-authorise-et-view-levels.md)
- [Finder, CLI et absences](13-finder-cli-et-absences.md)
- [Manifeste PSR-4 et com_example](17-manifeste-psr4-com-example.md)
- [SQL, packages et update servers](18-sql-packages-updateservers.md)
- [Plugin console et CLI](19-plugin-console-et-cli.md)
- [API /v1, CSRF et CORS](20-api-v1-csrf-cors.md)
- [Tests Cypress et dépréciations](23-tests-cypress-et-deprecations.md)

PHP 8.3.0, tag CMS **6.1.3**, site local déjà installé.

## Objectif de cette fiche

À la fin de cette fiche, tu sauras parcourir les huit jalons dans l'ordre, juger chacun avec le critère de réussite du corpus, et reconnaître le piège associé (parent édité, `$defaultName` manquant, `debug:*`, secrets dumpés).

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le fil rouge 6.1.3 ?

**Définition** : Le fil rouge est une **séquence pédagogique** de jalons réalisables avec la matière vérifiée du CMS 6.1.3. Ce n'est pas un parcours officiel. Aucune source 6.1 / guide / tag n'énonce cinq parcours intégrateur / admin / templates / extensions / expert : c'est un overlay de ce cursus.

**Le problème que le fil rouge résout** :

Sans séquence, voici les problèmes rencontrés :

1. **Jalons dans le désordre** : un plugin console sans CLI cœur, une API sans ACL, un ZIP sans manifeste.
2. **Critères flous** : « ça marche » sans URL, sans commande, sans droit nommé.
3. **Absences prises pour des oublis** : sauvegarde cœur, `debug:*`, option SameSite CMS, plugin console cœur, page Writing Tests, catalogue d'événements hors 5 pages.

**Les huit jalons (réussite / piège)** :

| Jalon | Réussite | Piège |
| ----- | -------- | ----- |
| 1. Enfant Cassiopeia | System → Site Templates → Create Child Template ; `user.css` dans `css/` ; fichiers enfant hors updates | Éditer le parent Cassiopeia |
| 2. Module puis `com_example` | Install + `index.php?option=com_example` ; `<namespace path="src">`, `services/provider.php` | `<files>` incomplet ; classe ≠ chemin disque |
| 3. Plugin console | `group="console"`, `hello:world`, `doExecute` vers 0 ; `php cli/joomla.php hello:world` | Groupe console / `$defaultName` manquant |
| 4. ACL | `$user->authorise('core.edit', 'com_content.article.22')` **distinct** des view levels | Confondre action et visibilité |
| 5. CLI cœur | `user:list`, `scheduler:run`, `finder:index`, `extension:list` | Chercher `debug:*` / `log:*` / `perf:*` (n'existent pas) |
| 6. API `/v1` | `X-Joomla-Token` + `core.login.api` **et** `core.login.site` | Page Web Services 6.1 encore inachevée / titrée 4.x |
| 7. Tests | CI tag : PHPUnit + Cypress, MariaDB 10.4 ; `tests/Unit/bootstrap.php` ; Create New Tests dans `tests/System/README.md` | Attendre un tutoriel d'écriture dans le manuel |
| 8. Packaging | ZIP + `pkg_*.xml` + `<updateservers>` type `extension` ou `collection` | `id` ≠ `element` ; `group` plugin manquant ; `config:get` affiche les secrets en clair |

**Analogie concrète** : C'est un sentier balisé qui relie huit refuges. Chaque refuge a un tampon (critère) et un ravin (piège). Tu ne construis pas un neuvième refuge « sauvegarde cœur » ou « commande `debug:cache` » : le sentier officiel du CMS ne les contient pas.

**Ce que le fil rouge n'est PAS** :

- Ce n'est pas une checklist de production (staging, déploiement, WCAG Cassiopeia/Atum : absents du cœur / non déclarés).
- Ce n'est pas une preuve que `config:get` est un export partageable.
- Ce n'est pas le saut 4.4 vers 6.x (inexistant : 4.4.x → 5.x puis 5.4.x → 6.x).

---

## Étapes Pratiques

Parcours les jalons **dans l'ordre**. Un jalon non tamponné bloque le suivant seulement si le suivant en dépend (le plugin console a besoin du CLI ; l'API a besoin d'un compte et des droits).

### Étape 1 : Template enfant + `user.css`

1. Create Child Template depuis Cassiopeia (héritable).
2. Pose `user.css` dans le `css/` de **l'enfant** (chargé après le preset LTR/RTL).
3. Ne touche pas aux fichiers livrés du parent.

**Résultat attendu** : le style enfant survit à une mise à jour ; le parent n'a pas été édité.

---

### Étape 2 : Module puis `com_example`

1. Installe le module tutoriel, vérifie son affichage (position + `#__modules_menu`).
2. Installe `com_example` namespacé : `<namespace path="src">`, `services/provider.php` (MVCFactory, DispatcherFactory, `ComponentInterface`).
3. Ouvre `index.php?option=com_example`.

**Résultat attendu** : le composant répond. Si une classe est introuvable, le premier suspect est `<files>` incomplet.

---

### Étape 3 : Plugin console `hello:world`

1. Manifeste `group="console"`.
2. `SubscriberInterface` → `ApplicationEvents::BEFORE_EXECUTE` → `addCommand()`.
3. `$defaultName = 'hello:world'` ; `doExecute` ramène `0`.
4. `php cli/joomla.php hello:world`

**Résultat attendu** : code 0. Le dossier `plugins/console` cœur reste absent : c'est **ton** plugin, pas un oubli d'installation.

---

### Étape 4 : ACL `authorise` ≠ view levels

Dans l'extension (pas un patch `com_content` cœur) :

```php
$canEdit = $user->authorise('core.edit', 'com_content.article.22');
$levels  = $user->getAuthorisedViewLevels();
```

**Résultat attendu** : tu peux expliquer une page **visible** (view level) sur laquelle l'édition est **refusée** (`authorise` faux), et l'inverse pour un root (`authorise` court-circuité à `true`).

---

### Étape 5 : Quatre commandes CLI cœur

```bash
php cli/joomla.php user:list
php cli/joomla.php scheduler:run
php cli/joomla.php finder:index
php cli/joomla.php extension:list
```

**Résultat attendu** : les quatre s'exécutent. `debug:*` n'apparaît pas dans `list`. Tu n'invoques pas `cli/finder_indexer.php` (absent). Tu n'envoies pas `config:get` dans un ticket (dump secret / mot de passe DB / `smtppass`).

---

### Étape 6 : API `/v1` + jeton

```bash
curl -sS \
  -H "X-Joomla-Token: TON_JETON" \
  "https://exemple.local/api/index.php/v1/content/articles"
```

Le compte a `core.login.api` **et** `core.login.site`. Le jeton API n'est pas `form.token`. CORS se lit sur 6.1.3 (`isOriginAllowed`, CVE-2026-71573).

**Résultat attendu** : appel authentifié. Tu ne t'appuies pas sur le tutoriel Web Services 6.1 (stub, titre 4.x).

---

### Étape 7 : Tests

1. `./libraries/vendor/bin/phpunit --testsuite Unit`
2. Un `.cy.js` sous `tests/System/integration/...` selon Create New Tests (Repeatable, indépendant, petit, une chose).
3. Tu n'écris pas de PHPUnit `HtmlView::escape` / `MediaHelper` « du cœur » : ils sont absents du tag. Specs médias : `Media.cy.js`, `Files.cy.js`.

**Résultat attendu** : Unit part ; le spec d'extension est au bon chemin. Manuel Writing Tests : ignoré comme gabarit.

---

### Étape 8 : ZIP `pkg_` + `<updateservers>`

1. Zippe les archives filles avec `pkg_<name>.xml`.
2. Déclare `<updateservers>` (`extension` ou `collection`).
3. Aligne `id` et `element` ; pour un plugin, n'oublie pas `group`.

**Résultat attendu** : package installable, serveur d'update déclaré. Pas de secret `config:get` dans le XML.

---

## Commandes Utiles

| Commande | Jalon |
| -------- | ----- |
| Create Child Template + `user.css` | 1 |
| `index.php?option=com_example` | 2 |
| `php cli/joomla.php hello:world` | 3 |
| `$user->authorise('core.edit', 'com_content.article.22')` | 4 |
| `php cli/joomla.php user:list` | 5 |
| `php cli/joomla.php scheduler:run` | 5 |
| `php cli/joomla.php finder:index` | 5 |
| `php cli/joomla.php extension:list` | 5 |
| `curl -H "X-Joomla-Token: …" …/api/index.php/v1/content/articles` | 6 |
| `./libraries/vendor/bin/phpunit --testsuite Unit` | 7 |
| ZIP `pkg_*.xml` + `<updateservers>` | 8 |

---

## Pièges Fréquents

### Piège 1 : Éditer Cassiopeia parent

⚠️ **Problème** : `user.css` ou un override posé dans le parent, écrasé à l'update.

✅ **Solution** : enfant + `html/` enfant (résolu **avant** le parent). Homonyme `joomla.asset.json` : **remplacement** d'item, pas une fusion.

---

### Piège 2 : `<files>` incomplet / `$defaultName` manquant

⚠️ **Problème** : `com_example` 404 classe ; `hello:world` inconnue.

✅ **Solution** : chaque fichier PHP du namespace dans `<files>` ; `$defaultName = 'hello:world'`.

---

### Piège 3 : Action ACL = niveau de vue

⚠️ **Problème** : tu testes « est-ce que l'article s'affiche » pour décider `core.edit`.

✅ **Solution** : `authorise` lit `#__assets.rules`. `getAuthorisedViewLevels()` est un autre chemin.

---

### Piège 4 : Absences prises pour des pannes

⚠️ **Problème** : tu ouvres un ticket « CLI cassé » parce que `debug:*` manque, ou « CMS incomplet » parce que SameSite / sauvegarde / plugin console cœur / Writing Tests manquent.

✅ **Solution** : ces absences sont du corpus. Inventaire CLI = 36 commandes CMS + `list`/`help`. SameSite = php.ini préservé. Sauvegarde = tiers. Tests d'écriture = README Cypress.

---

### Piège 5 : `config:get` dans le livrable

⚠️ **Problème** : le ZIP ou le rapport de fil rouge contient un dump de secrets.

✅ **Solution** : `GetConfigurationCommand` n'a pas de rédaction. La barre de debug HTTP masque `password|secret|token|smtppass` ; le CLI non.

---

## Checklist de Validation

- [ ] Enfant Cassiopeia + `user.css` (parent intact)
- [ ] Module installé et `com_example` répond à `option=com_example`
- [ ] `php cli/joomla.php hello:world` code 0
- [ ] `authorise('core.edit', 'com_content.article.22')` expliqué sans le confondre avec un view level
- [ ] `user:list`, `scheduler:run`, `finder:index`, `extension:list` exécutés
- [ ] `/api/index.php/v1` avec `X-Joomla-Token` et les deux `core.login.*`
- [ ] PHPUnit Unit et un spec Cypress au chemin Create New Tests
- [ ] ZIP `pkg_` + `<updateservers>` sans secrets

---

## Exercice Pratique

**Énoncé** : Un site 6.1.3 a les symptômes suivants. Pour chacun, nomme le jalon, le tampon manquant et le piège.

1. `hello:world` : commande inconnue ; `user:list` fonctionne.
2. L'article s'affiche en Public mais le bouton d'édition est refusé ; le développeur parle de « view level cassé ».
3. `php cli/joomla.php debug:cache` : commande inconnue.
4. L'appel `/v1` a un jeton mais le compte n'a que `core.login.api`.
5. Personne n'écrit de spec : « le manuel Writing Tests est vide ».
6. Le rapport d'install colle la sortie de `config:get`.

**Résultat attendu** : six diagnostics, sans secret, sans fiche 25.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

1. **Jalon 3** : plugin `group="console"` absent ou `$defaultName` manquant. Le CLI cœur (jalon 5) n'enregistre pas `hello:world`.
2. **Jalon 4** : visibilité (view levels) ≠ `authorise('core.edit', 'com_content.article.22')`. Ce n'est pas « le niveau de vue qui édite ».
3. **Jalon 5** : `debug:*` n'existe pas. Utiliser `cache:clean` si le besoin est le cache, pas inventer une famille debug.
4. **Jalon 6** : il manque `core.login.site`. Le jeton n'y supplée pas. Page Web Services encore titrée 4.x : ce n'est pas le critère.
5. **Jalon 7** : substitut `tests/System/README.md` Create New Tests. Pas de tutoriel d'écriture manuel.
6. **Jalon 8 / CLI** : `config:get` dump secret, mot de passe DB, `smtppass`. Retirer le dump du rapport.

Tu as parcouru les 24 fiches du cursus Joomla CMS (ancre 6.1.3). Il n'y a pas de fiche 25.

---

## Navigation

← Fiche précédente : **[Tests Cypress et dépréciations](23-tests-cypress-et-deprecations.md)**

→ Retour à l'index : **[Cursus Joomla CMS](index.md)**
