---
tags:
  - Joomla
  - Testing
  - Pratique
description: "Page Writing Tests inachevée, substitut Cypress Create New Tests, PHPUnit tests/Unit/bootstrap.php, absences escape/MediaHelper, dépréciations 7.0 et plugin compat."
estimated_time: "50 min"
fiche_number: 23
total_fiches: 24
cursus: "Joomla CMS"
---

# 23 - Tests Cypress et dépréciations

> **En bref** : Remplacer la page manuelle Writing Tests (stub) par `tests/System/README.md` (Create New Tests Cypress), lancer PHPUnit via `tests/Unit/bootstrap.php`, noter l'absence de tests `escape` / `MediaHelper`, et préparer le retrait 7.0 (Factory, Cache, `addScript`) avec le plugin compat. Lecture estimée : 50 min.

## Prérequis

- Avoir lu [Architecture : DI et événements](22-architecture-di-evenements.md) (getters Factory, `addScript` encore présents)
- Avoir lu [Sécurité : escape, uploads, SameSite](21-securite-escape-uploads-samesite.md) (`HtmlView::escape`, `canUpload`)
- Node.js pour Cypress, Composer pour PHPUnit, tag CMS 6.1.3

## Objectif de cette fiche

À la fin de cette fiche, tu sauras où écrire un spec Cypress d'extension, comment lancer la suite Unit du tag, citer les tests qui **n'existent pas**, et lister les dépréciations visées 7.0 plus le rôle du plugin de compatibilité 6.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### La page Writing Tests est un stub : le substitut est Cypress

**Définition** : La page manuelle 6.1 Current « Writing Tests » n'est encore qu'un stub inachevé (page marquée inachevée dans le manuel). Le gabarit d'écriture versionné au tag 6.1.3 est `tests/System/README.md`, section **Create New Tests**. Les README Unit et Intégration n'ont **pas** cette section.

**Le problème que ce substitut résout** :

Sans lui, voici les problèmes rencontrés :

1. **Attendre un tutoriel officiel d'écriture** : la page manuelle ne le fournit pas. La page Unit Testing 6.1 est aussi un stub. Le hub Accessibility 6.1 vise WCAG 2.2 AA pour les **extensions** et reste inachevé ; `/docs/accessibility/wcag/` est 404.
2. **Écrire un test PHPUnit « comme le README System »** : seul Cypress a « Create New Tests ».
3. **Coller un spec au mauvais dossier** : le README impose un chemin par type d'extension (`foo` = nom d'extension).

**Dossiers Create New Tests (`tests/System/README.md`)** :

| Type | Dossier specs |
| ---- | ------------- |
| Composant | `tests/System/integration/{site or administrator}/components/com_*foo*` |
| Module | `tests/System/integration/modules/mod_*foo*` |
| Plugin | `tests/System/integration/plugins/{type}/*foo*` |
| API | `tests/System/integration/api/com_*foo*` |

La section « Test Development » impose : Repeatable ; Not dépend on other tests ; Small ; Do one thing.

**Analogie concrète** : La notice officielle d'écriture de tests est une page blanche dans le manuel. Dans le carton du produit (le tag 6.1.3) tu trouves une fiche Cypress qui dit où poser le fichier `.cy.js`. Les notices PHPUnit Unit/Intégration disent seulement comment **lancer** la suite, pas comment **créer** un test.

**Ce que ce substitut n'est PAS** :

- Ce n'est pas un substitut **officiel** déclaré par les README : le lien de substitution est une lecture du corpus, pas une phrase du projet Joomla qui dirait « cette page remplace le manuel ».
- Ce n'est pas `Upload.cy.js` : ce fichier est 404. Les specs médias présentes sont `Media.cy.js` et `Files.cy.js`.
- Ce n'est pas un test CORS nommé : aucun PHPUnit/Cypress nommé CORS sous `tests/` du tag.

**Exécution Cypress documentée dans ce README** :

```bash
npm run cypress:run
npx cypress run --spec tests/System/integration/install/Installation.cy.js
npm run cypress:open
```

Motif de specs : `{administrator,site,api,plugins}/**/*.cy.js`. Familles `db_`, `api_`, `config_setParameter` ; tâches `queryDB`, `writeRelativeFile`.

---

### PHPUnit du tag : bootstrap présent, `escape` / `MediaHelper` absents

**Définition** : `tests/Unit/bootstrap.php` existe au tag 6.1.3. `tests/Unit/README.md` décrit : checkout, `composer install`, puis `./libraries/vendor/bin/phpunit --testsuite Unit`. Pas de « Create New Tests ».

**Le problème que cette carte des absences résout** :

Sans elle, voici les problèmes rencontrés :

1. **Chercher `HtmlViewTest.php`** : 404. `tests/Unit/Libraries/Cms/MVC/View` ne contient que `AbstractViewTest.php`, qui n'appelle jamais `escape()`.
2. **Chercher `MediaHelperTest.php`** : 404 en Unit et Intégration. `tests/Unit/Libraries/Cms/Helper` est 404. `MediaHelper::canUpload()` existe pourtant.
3. **Croire que l'absence de test = absence de code** : `HtmlView::escape()` et `canUpload()` sont du code cœur. Ils n'ont pas de filet PHPUnit sur le tag.

**Substituts Cypress médias** :

| Spec | Ce qu'elle exerce |
| ---- | ----------------- |
| `Media.cy.js` | Gestionnaire média, refus de renommage en `.php`, statut 500 |
| `Files.cy.js` | `POST` `/media/files` en base64 |

**Intégration** : `tests/Integration/README.md` demande de copier `phpunit.xml.dist` vers `phpunit.xml`, de poser `JTEST_DB_*` (LDAP optionnel), puis `./libraries/vendor/bin/phpunit --testsuite Integration`. Pas de gabarit « Create New Tests ».

**CI du tag 6.1.3** : jobs unit, intégration et Cypress sur PHP **8.3, 8.4 et 8.5**, MariaDB **10.4**. PHP 8.5 est **absent** du tableau d'exigences 6.1 (reco 8.4, min 8.3.0) : écart doc/CI, pas une exigence documentée 6.1.

**Analogie concrète** : PHPUnit est le contrôle qualité de l'atelier (bootstrap + `--testsuite Unit`). Deux pièces critiques (`escape`, `canUpload`) n'ont pas de fiche de contrôle atelier. Cypress ouvre la porte du magasin et tente un renommage `.php` (`Media.cy.js`).

**Ce que cette suite n'est PAS** :

- Ce n'est pas une couverture XSS/upload du cœur.
- Ce n'est pas la page manuelle Unit Testing (stub). Substituts : README Unit, job CI `tests-unit`, page Setup unit, `tests/Unit/bootstrap.php`.

---

### Dépréciations 7.0 et plugin compat

**Définition** : Plusieurs API encore **présentes** en 6.1.3 portent un retrait annoncé en **7.0**. Le plugin **Behaviour - Backward Compatibility 6** (compat6) est la couche 5.4 vers 6.x : essentiel à la montée ; sur une **nouvelle** install 6 il est installé **désactivé**. Le plugin **Behaviour - Backward Compatibility** (sans numéro, couche J4 vers J5) doit être **désactivé avant** J6.

**Le problème que ce calendrier résout** :

Sans lui, voici les problèmes rencontrés :

1. **Lire le manuel WAM « retiré en Joomla 6 »** : `Document::addScript` / `addStyleSheet` sont encore là, `@deprecated 4.3`, retrait **7.0**. Enseigner WAM (`joomla.asset.json`), pas « déjà retiré en 6 ».
2. **Garder `Factory::getDbo()`** jusqu'à 7.0 sans plan : getters `getDbo` / `getConfig` / `getSession` / `getLanguage` / `getDocument` / `getUser` / `getCache` @deprecated 4.3 ; `getMailer` 4.4.0.
3. **`Cache::getInstance()`** : déprécié 4.2, retrait 7.0, au profit de `CacheControllerFactoryInterface`.
4. **Alias CLI** `core:check-updates` : `@deprecated 5.1.0`, retrait 7.0 (`core:update:check`).

**Analogie concrète** : Une étiquette « retiré en 6 » collée sur le manuel WAM ne correspond pas au carton 6.1.3 : l'outil est encore dans la caisse, avec une étiquette « 7.0 ». Le plugin compat6 est la rampe entre le quai 5.4 et le quai 6 ; sur une usine neuve 6, la rampe est livrée pliée (installée, désactivée).

**Ce que le plugin compat n'est PAS** :

- Ce n'est pas `plugins/behaviour/compat` au tag 6.1.3 (absent). Le groupe behaviour contient compat6, taggable, versionable.
- Ce n'est pas une excuse pour appeler `addScript` dans du code neuf : `joomla.asset.json` est la voie recommandée, pas obligatoire selon le manuel WAM 6.1.

---

## Étapes Pratiques

### Étape 1 : Lire Create New Tests, pas le stub manuel

Ouvre `tests/System/README.md` (tag 6.1.3). Repère la section Create New Tests et les quatre dossiers. Ignore la page manuelle Writing Tests comme source d'écriture.

**Résultat attendu** : tu sais où poser `com_example.cy.js` (site ou administrator, ou `api/`).

---

### Étape 2 : Lancer PHPUnit Unit

```bash
composer install
./libraries/vendor/bin/phpunit --testsuite Unit
```

**Résultat attendu** : la suite Unit part via `tests/Unit/bootstrap.php`. Tu ne cherches plus `HtmlViewTest.php` ni `MediaHelperTest.php`.

---

### Étape 3 : Lire les specs médias Cypress

Ouvre :

- `tests/System/integration/.../Media.cy.js` (refus de renommage `.php`, statut 500)
- `tests/System/integration/api/com_media/Files.cy.js` (`POST` `/media/files` base64)

**Résultat attendu** : tu cites ces deux fichiers comme substitut d'un PHPUnit `canUpload`, pas comme preuve d'`isSafeFile`.

---

### Étape 4 : Inventaire 7.0 dans **ton** extension

Liste dans l'extension (pas un patch cœur) :

1. `Factory::getDbo()` et autres getters.
2. `Document::addScript` / `addStyleSheet`.
3. `Cache::getInstance()`.
4. Alias `core:check-updates` dans un script.

Pour une montée 5.4 vers 6 : désactiver Backward Compatibility (J4 vers J5) **avant** J6 ; compat6 s'active tout seul en 5.4.x.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `./libraries/vendor/bin/phpunit --testsuite Unit` | Suite unit (bootstrap `tests/Unit/bootstrap.php`) |
| `./libraries/vendor/bin/phpunit --testsuite Integration` | Suite intégration (`phpunit.xml` + `JTEST_DB_*`) |
| `npm run cypress:run` | Cypress E2E du tag |
| `npx cypress run --spec tests/System/integration/install/Installation.cy.js` | Un spec isolé |
| `npm run cypress:open` | UI Cypress |
| `php cli/joomla.php core:update:check` | Vérifier les updates (pas `core:check-updates`) |

---

## Pièges Fréquents

### Piège 1 : « Create New Tests » dans le README Unit

⚠️ **Problème** : tu ouvres `tests/Unit/README.md` pour copier un gabarit d'écriture.

✅ **Solution** : ce README lance PHPUnit. Le gabarit d'écriture est `tests/System/README.md`.

---

### Piège 2 : « `escape()` / `canUpload()` ne sont pas testés donc absents »

⚠️ **Problème** : tu conclus que le code n'existe pas.

✅ **Solution** : le code est dans `HtmlView.php` et `MediaHelper.php`. PHPUnit correspondant : absent. Cypress : `Media.cy.js` / `Files.cy.js`.

---

### Piège 3 : « `addScript` a disparu en Joomla 6 »

⚠️ **Problème** : le manuel WAM 6.1 le dit.

✅ **Solution** : encore présent en 6.1.3, retrait annoncé 7.0. Voie neuve : WAM / `joomla.asset.json`.

---

### Piège 4 : Activer le mauvais plugin compat

⚠️ **Problème** : tu laisses Backward Compatibility J4-J5 actif en entrant en 6, ou tu cherches `plugins/behaviour/compat`.

✅ **Solution** : désactiver ce plugin **avant** J6. En 6.1.3 : compat6 (install neuve = installé, désactivé).

---

## Checklist de Validation

- [ ] Je n'attends plus un tutoriel d'écriture dans le manuel 6.1
- [ ] Je pose un `.cy.js` dans le dossier Create New Tests qui correspond au type d'extension
- [ ] Je lance `--testsuite Unit` avec le bootstrap du tag
- [ ] Je peux citer l'absence PHPUnit de `escape` et `MediaHelper`
- [ ] Je liste Factory / Cache / `addScript` comme retraits 7.0, pas comme absences 6.1.3

---

## Exercice Pratique

**Énoncé** : Tu ajoutes un composant `com_example`. Rédige :

1. Le chemin du spec Cypress site.
2. La commande PHPUnit Unit.
3. Deux tests cœur que tu **ne** trouveras pas.
4. Trois appels à bannir du code neuf (retrait 7.0).
5. L'état de compat6 sur une install neuve 6.

**Résultat attendu** : cinq réponses courtes, chemins du tag 6.1.3.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

1. `tests/System/integration/site/components/com_example/` (ou `administrator/...` selon le client). Fichier `.cy.js`.
2. `./libraries/vendor/bin/phpunit --testsuite Unit` après `composer install` (`tests/Unit/bootstrap.php`).
3. Pas de `HtmlView::escape` unitaire (`HtmlViewTest.php` 404). Pas de `MediaHelperTest.php`.
4. `Factory::getDbo()` (et getters listés), `Cache::getInstance()`, `Document::addScript` / `addStyleSheet`.
5. Plugin Behaviour - Backward Compatibility 6 : **installé, désactivé** sur une install neuve 6.

---

## Navigation

← Fiche précédente : **[Architecture : DI et événements](22-architecture-di-evenements.md)**

→ Fiche suivante : **[Fil rouge](24-fil-rouge.md)**
