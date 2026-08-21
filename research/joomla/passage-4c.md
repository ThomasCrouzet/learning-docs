# Passage 4C - ZIP 6.1.3, CLI framework, Writing Tests

**Statut** : Partial  
**Date de consultation** : 20 août 2026  
**Cible** : tag `joomla-cms` 6.1.3  
**Les `[S1]` à `[S24]` de ce fichier** correspondent à `P4C-S1` ... `P4C-S24` dans [sources.md](sources.md).

---

Les ZIP Full et Update 6.1.3 sont attestés (noms, tailles, empreintes d'archive entière) mais leur arbre interne n'est pas public : sans décompression, `favicon.ico`, `joomla-favicon.svg`, `joomla-favicon-pinned.svg`, `media/system/images` et `media/templates/site/cassiopeia/images` restent **non prouvés dans les paquets**.

Le framework `joomla/console` 4.0.0, épinglé par `composer.lock` du tag `6.1.3`, n'enregistre que `list` et `help` ; un plugin `group=console` s'ajoute via `BEFORE_EXECUTE`, et le cœur 6.1.3 n'en contient aucun.

La page manuelle 6.1 « Writing Tests » est toujours un stub TODO ; le substitut versionné est `tests/System/README.md` (Cypress) plus `tests/Unit/README.md` et `tests/Integration/README.md` (PHPUnit, sans « Create New Tests »).

## ZIP Full et Update : paquets, pas d'inventaire

GitHub publie les zip Full et Update ci-dessous, plus tar.gz/tar.zst ; le Source code (zip/tar.gz) n'a pas de SHA-256. [S1] downloads.joomla.org ne donne que MD5/SHA1 d'archive entière (pas de SHA-256, pas de listing interne) ; les URLs `?format=zip` redirigent vers `update.joomla.org/releases/6.1.3/Joomla_6.1.3-Stable-{Full|Update}_Package.zip`. [S2]

| Archive | Taille GitHub | SHA-256 GitHub | Taille downloads | MD5 | SHA1 |
| ------- | ------------- | -------------- | ---------------- | --- | ---- |
| `Joomla_6.1.3-Stable-Full_Package.zip` | 33.8 MB | `a49305652503f9344d046d55471f324a07882996132ed967c3b0fe34707ae4a1` | 33.77 MB | `f93e413f57d8a870739a712f55e59eb6` | `1cef729293c88df1c2e6caeaec35c1a2ee9a7ced` |
| `Joomla_6.1.3-Stable-Update_Package.zip` | 31.5 MB | `9065eb82536b84ba981925b486303d1c847f126009ea8db378e7e5b5428087b8` | 31.49 MB | `bf2f5949507ec386167abcbe9a52348c` | `66c12ab62f41c8f88875e4d18fca2eac7309b099` |

Le Full zip est servi mais dépasse 10 MB : le corps n'a pas été récupéré, et ni GitHub ni downloads.joomla.org ne publient les chemins membres. Aucune preuve d'un fichier intérieur du type `media/system/images/favicon.ico` n'est donc disponible. [S5]

L'identité octet-à-octet GitHub (SHA-256) vs downloads (MD5/SHA1) n'est pas recoupée par un même algorithme ; les tailles affichées sont proches.

## Chemins demandés : git 6.1.3 vs ZIP

Au tag, `media/`, `media/system/images` et `media/templates/site/cassiopeia/images` n'existent pas (404) ; `.gitignore` ignore `/media` ; le miroir jsDelivr n'a pas non plus de `media/` racine. [S3] Les favicons attestés sont uniquement sous `build/media_source/` (et `installation/`), pas dans un listing ZIP.

| Chemin | Tag git 6.1.3 | ZIP Full / Update |
| ------ | ------------- | ----------------- |
| `media/` | absent | non listé |
| `media/system/images` | 404 | non listé |
| `media/templates/site/cassiopeia/images` | 404 | non listé |
| `favicon.ico` | `build/media_source/system/images/favicon.ico` ; aussi `installation/favicon.ico` (1.97 KB) ; absent de cassiopeia/images | non listé |
| `joomla-favicon.svg` | `build/media_source/system/images/joomla-favicon.svg` | non listé |
| `joomla-favicon-pinned.svg` | `build/media_source/system/images/joomla-favicon-pinned.svg` | non listé |
| `build/media_source/templates/site/cassiopeia/images` | `logo.svg`, `select-bg.svg`, `select-bg-active.svg`, `select-bg-active-rtl.svg`, `select-bg-rtl.svg`, `template_preview.png`, `template_thumbnail.png` | non listé |

Ces blobs `media_source` ne sont pas un inventaire des ZIP. [S4] Le guide Favicons décrit un ordre de résolution à l'installation (Cassiopeia d'abord, « they are not there », puis `media/system/images`, « they are there »), pas un listing d'archive 6.1.3. [S6]

Le Source code GitHub du tag suit l'arbre git (sans `media/`), pas le Full Package.

## CLI extra : `getDefaultCommands()` (joomla/console 4.0.0)

`composer.lock` du tag 6.1.3 épingle `joomla/console` à 4.0.0, commit `b58fb572436ad9e230061ff6929aa1446849efe8`. [S7] `Joomla\Console\Application::getDefaultCommands()` n'instancie que `new Command\ListCommand()` et `new Command\HelpCommand()`. [S8]

| Classe | `$defaultName` enregistré |
| ------ | ------------------------- |
| `ListCommand` | `list` [S9] |
| `HelpCommand` | `help` [S10] |

`initCommands()` parcourt cette liste et appelle `addCommand()` ; `getDefaultName()` lit `$defaultName` de la classe appelée ; le constructeur d'`AbstractCommand` applique ce nom si aucun n'est passé. [S11] `src/Command` du package ne contient que `AbstractCommand`, `HelpCommand` et `ListCommand`. Le CMS fusionne ces deux via `parent::getDefaultCommands()` (`array_merge`) sans remplacer la liste parente. [S12]

Aucune exécution runtime de `php cli/joomla.php list` : noms déduits du source 4.0.0.

## Plugin `group=console` : enregistrement, pas de plugin cœur

Un plugin `group=console` implémente `SubscriberInterface`, mappe `ApplicationEvents::BEFORE_EXECUTE` vers `registerCommands()`, puis `getApplication()->addCommand()` avec une `AbstractCommand` (Hello World : `$defaultName = 'hello:world'`). [S13]

Au tag 6.1.3, `ConsoleApplication::execute()` importe les groupes `behaviour`, `system` et `console` puis appelle `parent::execute()`. [S14] Le parent déclenche `ApplicationEvents::BEFORE_EXECUTE` (`application.before_execute`) avant `doExecute()`. [S15]

Il n'y a **pas** de plugin console cœur au tag : `plugins/console` est 404 ; 24 groupes listés, sans `console`. [S16] Le seed `#__extensions` de `installation/sql/mysql/base.sql` n'insère aucune ligne `folder='console'` ni `plg_console_*`. [S17] Les commandes CLI du cœur passent par le service provider `Console` et `getDefaultCommands()`, pas par un plugin : `importPlugin('console')` n'importe rien sur une install cœur. [S18]

Un site déjà installé peut avoir un plugin `group=console` **tiers** dans `#__extensions`. Seeds PostgreSQL / SQL Server non relus.

## Substitut « Writing Tests » (TODO manuel inchangé)

La page 6.1 (Current) « Writing Tests » n'est encore qu'un stub TODO. [S19] Le substitut versionné au tag 6.1.3 est `tests/System/README.md`, section « Create New Tests » (fichier `.cy.js`, `foo` = nom d'extension) : [S20]

| Type | Dossier specs |
| ---- | ------------- |
| Composant | `tests/System/integration/{site or administrator}/components/com_*foo*` |
| Module | `…/modules/mod_*foo*` |
| Plugin | `tests/System/integration/plugins/{type}/*foo*` |
| API | `tests/System/integration/api/com_*foo*` |

« Test Development » impose : Repeatable ; Not depend on other tests ; Small ; Do one thing. [S21]

Exécution Cypress : `npm run cypress:run` ; `npx cypress run --spec tests/System/integration/install/Installation.cy.js` ; motif `{administrator,site,api,plugins}/**/*.cy.js` ; `npm run cypress:open` ; `docker compose down && docker compose up system-tests`. Familles `db_`, `api_`, `config_setParameter` ; tâches `queryDB`, `writeRelativeFile`. [S22]

`tests/Unit/README.md` : checkout, `composer install`, `./libraries/vendor/bin/phpunit --testsuite Unit`. Pas de « Create New Tests ». [S23]

`tests/Integration/README.md` : copier `phpunit.xml.dist` vers `phpunit.xml`, constantes `JTEST_DB_*`, LDAP optionnel, `./libraries/vendor/bin/phpunit --testsuite Integration`. Pas de section « Create New Tests ». [S24]

Aucun de ces README ne se déclare substitut officiel de la page manuelle : le lien de substitution est une lecture externe.

## Pièges

- Croire que le tag git contient `media/` : ignoré par `.gitignore` ; artefact de build / paquet, pas le dépôt.
- Ajouter `list` / `help` au catalogue CMS comme des commandes métier : ce sont les commandes **framework** fusionnées par `parent::getDefaultCommands()`.
- Chercher un plugin console cœur : `importPlugin('console')` n'importe rien sur une install neuve 6.1.3.
- Enseigner « Create New Tests » depuis Unit/Integration README : seul le README System (Cypress) a cette section.
- Présenter le listing ZIP des favicons comme prouvé : **non listé** ; rester sur `media_source` + mécanisme CLI déjà lu au 3B.

## Vérification locale du ZIP Update (20 août 2026)

Le runner de recherche n'a pas décompressé l'archive. Listing local de `Joomla_6.1.3-Stable-Update_Package.zip` (GitHub release 6.1.3) via `unzip -l` :

| Chemin dans le ZIP Update | Présent |
| ------------------------- | ------- |
| `media/system/images/favicon.ico` | oui (2019 octets) |
| `media/system/images/joomla-favicon.svg` | oui |
| `media/system/images/joomla-favicon-pinned.svg` | oui |
| `media/templates/site/cassiopeia/images/` | oui (dossier) |
| `media/templates/site/cassiopeia/images/favicon.ico` | **non** |
| `media/templates/site/cassiopeia/images/joomla-favicon.svg` | **non** |
| `media/templates/site/cassiopeia/images/logo.svg` | oui |
| `media/templates/site/cassiopeia/images/select-bg*.svg` | oui |
| `media/templates/site/cassiopeia/images/template_preview.png` | oui |
| `media/templates/site/cassiopeia/images/template_thumbnail.png` | oui |

Conséquence alignée sur 3B/4B : éditer `media/system/images/favicon.ico` (ou les `joomla-favicon*`) = **écrasé** à l'update. Déposer les **mêmes noms** sous `media/templates/site/cassiopeia/images` = **pas dans le ZIP**, donc conservé (sauf piste `deleteUnexistingFiles`). Éditer `logo.svg` Cassiopeia = **écrasé**.

Le ZIP Full n'a pas été listé ici (même release, arbre attendu plus large). Identité SHA-256 GitHub vs MD5 downloads : non recoupée.

## Lacunes restantes de ce passage

- ZIP Full 6.1.3 : non listé localement (seul l'Update l'a été).
- Page manuelle Writing Tests : toujours TODO.
- Unit et Integration : lancement PHPUnit seulement, sans gabarit « Create New Tests ».
- `php cli/joomla.php list` non exécuté en live.
