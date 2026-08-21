# Passage 2 - Exploitation, CLI, sécurité, glossaire, fil rouge

**Statut** : Partial  
**Date de consultation** : 20 août 2026  
**Cible** : tag `joomla-cms` 6.1.3, manuel 6.1 Current, guide.joomla.org  
**Ne re-prouve pas** : bootstrap HTTP, DI Factory, CSRF de base, child templates, `user.css`, manifeste PSR-4, packages, `/api/index.php/v1`, PHP 8.3 min (voir [passage-1.md](passage-1.md))

Les références `[S1]` à `[S23]` de **ce fichier** sont celles du passage 2, listées dans [sources.md](sources.md) comme `P2-S1` ... `P2-S23`.

---

Le trio officiel pour Joomla 6.1.3 est le manuel programmeur 6.1 (Current), le guide utilisateur, et le tag GitHub du 18 août 2026 : 6.x est une mise à niveau in-place depuis 5.4.x, sans saut depuis une version inférieure à 5.4 ; PHP 8.5 n'apparaît pas dans le tableau d'exigences. [S19]

Ce passage comble ACL, cache, scheduler, médias, SEF au-delà de `parse()`, Finder, workflows, CLI hors HTTP, échappement XSS, uploads, secrets, ordre des overrides `html/` enfant, `initialiseTemplate` (6.1.0), CORS `isOriginAllowed` (6.1.3), borne MariaDB réellement forcée, et Framework 4.x vendu dans le CMS 6.

Le cœur ne livre ni sauvegarde/staging/déploiement, ni commandes `debug:*` / `log:*` / `perf:*`, ni audit de sécurité d'extensions, ni niveau WCAG pour Cassiopeia/Atum.

Restent hors corpus : champs personnalisés (guide lu, code 6.1.3 non inspecté), associations de langues, favicons, pages programmeur encore TODO, et toute carte officielle en cinq parcours.

## ACL, cache, scheduler, médias, SEF

`$user->authorise($action, $assetname)` raccourcit à `true` pour un utilisateur racine (`root_user` ou `core.admin` sur l'asset racine), sinon `Access::check()` lit le JSON imbriqué `#__assets.rules` ; la visibilité est un autre chemin, `getAuthorisedViewLevels()`. [S1]

La page programmeur 6.1 renvoie encore au tutoriel ACL J3.x et affirme que l'ACL n'a pas changé de 3 à 4 ou 5 ; le guide sépare permissions d'action (héritage Global vers composant vers élément) et niveaux Public / Guest / Registered / Special / Super Users, sans citer `authorise()`.

Trois couches d'administration : plugin System - Page Cache ; cache vue/module Conservative vs Progressive ; cache par module. Sauver un article ne vide pas le cache page, mais vide le cache vue conservative de `com_content`. [S2]

La liste moteurs/API du guide est périmée (`JCache` / `JCacheView` / `JController`, APC, Eaccelerator, File, Memcache, Redis, XCache) : 6.1.3 n'expédie que `ApcuStorage`, `FileStorage`, `MemcachedStorage`, `RedisStorage`, et `Cache::getInstance()` est déprécié 4.2, retiré en 7.0 au profit de `CacheControllerFactoryInterface`.

Au 6.1, onze types de tâches cœur (plugins `task`) ; trois actives à l'install (purge de sessions 24 h, notification de mise à jour 24 h, rotation des logs 30 jours). [S3]

Lazy (défaut, activité site / JS) et Web Cron (`curl` vers `com_ajax`, hash) sont mutuellement exclusifs. Le tag aligne neuf dossiers `plugins/task/{checkfiles,deleteactionlogs,globalcheckin,privacyconsent,requests,rotatelogs,sessiongc,sitestatus,updatenotification}` (`sitestatus` = trois routines hors ligne) et `ScheduleRunner` (`lazy_scheduler.enabled` true, `webcron.enabled` false, 403 si hash faux).

`com_media` passe par `MediaHelper::canUpload()` depuis `LocalAdapter::checkContent` : extensions `restrict_uploads_extensions` / `ignore_extensions`, liste MIME `upload_mime` si `restrict_uploads` et `check_mime`, sanitizer SVG enshrined. [S4]

SVG absent des défauts 6.1.3 (pas de `svg` ni `image/svg+xml`), conforme au guide SVG (ajouter `,svg` et `,image/svg+xml` ; sanitizer depuis 4.1).

Contradiction : le guide Media Options dit que chemins fichiers et images pointent tous deux vers `images` ; `config.xml` fixe `file_path` = `files` (dossiers cœur exclus) et `image_path` = `images`.

Au-delà de `parse()`, `SiteRouter` attache SSL, init, SEF parse/build, pagination, rewrite et base path ; le routeur de composant vient de `RouterServiceInterface::createRouter()` ou `RouterLegacy` ; `build()` appelle `preprocess()` puis `build()`. [S5]

`parseSefRoute()` exige, filtre langue actif, un item `*` ou la balise courante ; reste de chemin = 404 depuis 4.0. Côté site : `sef` / `sef_rewrite` / `sef_suffix` et `htaccess.txt` vers `.htaccess`.

## Workflows, Finder, sauvegardes

Pas de composant cœur de sauvegarde, staging ou déploiement : le guide Backup = fichiers + base, et oriente vers Akeeba (Install from Web), cPanel, `mysqldump`, phpMyAdmin, zip. [S6]

Les workflows (étapes/transitions, affectation par catégorie ; changement seulement via lot Super User ou `#__workflow_associations`) et Smart Search (`com_finder` + `plugins/finder/{categories,contacts,content,newsfeeds,tags}`, index `php joomla.php finder:index`, Solr uniquement tiers) sont bien cœur.

Incertitude : la page Large Sites cite aussi `finder_indexer.php` ; le point d'entrée canonique 6.1.3 n'a pas été recoupé fichier par fichier dans l'arbre `cli/`.

## CLI et événements hors HTTP

`php cli/joomla.php` (PHP >= 8.3) n'a aucune commande `debug:*`, `log:*` ou `perf:*` : debug/logs = Global Configuration + plugin HTTP DebugBar/Server-Timing ; l'observabilité CLI la plus proche est `finder:index` (durée, pic mémoire) et `scheduler:run` (durée par tâche). [S7]

Noms stables vérifiés :

- `cache:clean`
- `config:get`, `config:set`
- `session:gc`, `session:metadata:gc`
- `user:add`, `user:list`, `user:reset-password`
- `site:down`
- `extension:list`, `extension:install`, `extension:enable` (depuis 6.1.0), `extension:discover`, `extension:discover:install`
- `update:extensions:check`, `update:joomla:remove-old-files`
- `core:update`, `core:update:check`, `core:update:channel`, `core:autoupdate:register`, `core:autoupdate:unregister`
- `finder:index`
- `scheduler:list`, `scheduler:run`, `scheduler:state`
- `maintenance:database`

Le manuel montre `user:list` ; le guide documente `installation/joomla.php install`, pas un catalogue post-install.

`ConsoleApplication::execute()` importe les groupes `behaviour`, `system` et `console` ; un plugin console s'enregistre sur `application.before_execute`. [S8]

Le tag 6.1.3 n'a pas d'arbre `plugins/console/`. L'index Finder importe aussi `finder` et déclenche `onStartIndex`, `onBeforeIndex`, `onBuildIndex`. La table d'événements 6.1 est orientée HTTP et omet `BEFORE_EXECUTE` (code stable, doc incomplète).

`core:check-updates` est un alias déprécié de `core:update:check` (retrait 7.0). Les tests Console ne couvrent que `ExtensionDiscover*` et `Loader`.

Plusieurs classes Console enregistrées n'ont pas été ouvertes pour `$defaultName` (`SiteUpCommand`, `AddUserToGroupCommand`, `DeleteUserCommand`, `ExtensionDisableCommand`, `ExtensionRemoveCommand`, commandes Database Export/Import, etc.).

## Sécurité manquante (sans couverture OWASP complète)

`HtmlView::escape()` = `htmlspecialchars(..., ENT_QUOTES, UTF-8)` (`null` vers `''`) ; JS = `OutputFilter::stringJSSafe()` en `\uXXXX`. [S9]

Les tests unitaires couvrent `OutputFilter`, pas `HtmlView::escape` (seulement `AbstractViewTest.php`) ; `/mvc/view/` et `/mvc/mvc-view/` sont 404. Recoupement OWASP (recommandation, pas un audit) : encodage d'entités HTML et unicode JS.

Uploads : `canUpload()` (nom sûr, exécutables imbriqués, liste blanche, taille, MIME optionnel, SVG) plus `InputFilter::isSafeFile()` (octet nul, `FORBIDDEN_FILE_EXTENSIONS`, `<?php` / short-tag / stub PHAR). [S10]

`tests/Unit/Libraries/Cms/Helper` est absent du tag (404). La fiche OWASP File Upload n'a pas été relue : la règle d'upload vient du code Joomla seulement.

`$secret` est obligatoire (dist vide, commentaire « générer une chaîne aléatoire ») et entre dans le nom de session `md5(secret + session_name)` ; le CLI utilise `RuntimeStorage` (pas de cookies). [S11]

`config:get` dump tout le tableau (secret, mot de passe DB, `smtppass`) sans rédaction ; la barre de debug HTTP masque `password|secret|token|smtppass`.

Cookies CMS : seulement `cookie_domain` / `cookie_path` ; `JoomlaStorage` pose `httponly` sans SameSite (pas d'option dans `application.xml`). Incertitude : `plugins/system/httpheaders` et `php.ini session.cookie_samesite` n'ont pas été inspectés.

L'inventaire CLI (`extension:list|discover|discover:install|install|enable`, `update:extensions:check`) n'est pas une suite d'audit. [S12]

## Templates : héritage `html/`, 6.1.0, a11y

Les overrides enfant sont résolus **avant** le parent : `HtmlView` fait `array_unshift` parent puis enfant ; `ModuleHelper::getLayoutPath` teste l'enfant puis le parent ; `FileLayout` liste `html/layouts` enfant puis parent ; `HtmlDocument::_fetchTemplate` charge `index.php`/`error.php` enfant, sinon parent, sinon `system`. [S13]

Le guide : l'enfant réutilise tout le parent sauf les fichiers homonymes. La fusion `joomla.asset.json` enfant/parent n'est pas spécifiée dans le manuel 6.1.

`CMSApplication::initialiseTemplate()` / `isValidTemplate()` sont `@since 6.1.0` (tags 6.1.0 et 6.1.3) : défaut `system`, parent vide. [S14]

`SiteApplication` charge le style menu/requête, accepte un template si `index.php` existe sur l'enfant ou le parent, sinon `cassiopeia`. Le changelog utilisateur 6.1.0 ne mentionne pas `initialiseTemplate` : l'introduction est attestée seulement par `@since`.

Pratique intégrateur (enfant Cassiopeia, `user.css`/`user.js`, `html/`, positions) : guide, pas les pages programmeur Templates (TODO). [S20]

Cassiopeia 6.1.3 est `<inheritable>1</inheritable>` (positions `topbar`, `menu`, `sidebar-left/right`, `footer`, `debug`, `error-403/404`) ; fichiers enfant non touchés par les mises à jour.

Opinion du guide : « excellent general purpose accessible and responsive template », contraste fond/texte, sans niveau WCAG. L'Accessibility Statement du projet (16 décembre 2022) parle de WCAG 2.1 / ATAG 2.0 pour Joomla 4, pas d'un niveau Cassiopeia 6.1.3. Le manuel vise WCAG 2.2 AA pour les **extensions** ; `/docs/accessibility/wcag/` est 404.

Favicons : `index.php` enregistre `joomla-favicon.svg`, `favicon.ico`, `joomla-favicon-pinned.svg` via `HTMLHelper::image` ; pour un template héritable, recherche `media/templates/{client}/{child}/images` puis parent puis `media/system/images`. Les trois fichiers sont dans `build/media_source/system/images` sur 6.1.3, pas dans le listing images Cassiopeia. L'écrasement à l'update n'est pas prouvé depuis le ZIP.

## Plateforme (inconnues du passage 1)

| Technologie | Recommended | Supported (peut n'être pas forcé) | Minimum forcé |
| ----------- | ----------- | --------------------------------- | ------------- |
| PHP | 8.4 | 8.3.0 | 8.3.0. PHP 8.5 absent du tableau [S19] |
| MariaDB | 12.0 | 10.6 (aussi exigence du guide 5 vers 6) | 10.4 (`DatabaseHelper::$dbMinimumMariaDb` + CI integration/Cypress) [S16] |

`UpdateModel::getPhpOptions` vérifie PHP, zlib, xml, json, schéma, **pas** la version MariaDB. Incertitude : `com_joomlaupdate` masque-t-il l'offre 6.x si MariaDB est 10.4.x mais sous 10.6 ? Non montré dans `getPhpOptions`.

Pas de saut 4.4 vers 6.x : d'abord 4.4.x vers 5.x, puis 5.4.x vers 6.x (upgrade, pas migration). [S17]

Le CMS 6.1.3 vend le Framework **4.x** (`joomla/*` en `^4.0`, `joomla/filter` 4.0.2, `joomla/filesystem` `dev-4.x-shtml` as 4.2.1, `php ^8.3.0`), pas un package Framework 6. [S18]

`ApiApplication::isOriginAllowed` (`@since 6.1.3`) découpe `cors_allow_origin` et compare l'`Origin` en `in_array` strict ; `respond()` / `handlePreflight()` ne reflètent origine et credentials que sur hit (`*` = ACAO `*` sans credentials). [S15]

JSST [20260802] CVE-2026-71573 : 4.0.0-5.4.7 et 6.0.0-6.1.2, corrigé en 5.4.8 / 6.1.3. Aucun test PHPUnit/Cypress nommé pour CORS trouvé sous `tests/` du tag.

Getters `Factory` (`getDbo`, `getConfig`, `getSession`, `getLanguage`, `getDocument`, `getUser`, `getCache` 4.3 vers 7.0 ; `getMailer` 4.4.0 vers 7.0) : DI/conteneur, et `getContainer()` n'est **pas** un substitut 1:1 de `getDbo()`. [S22]

WAM 6.1 : `addScript`/`addStyleSheet` « deprecated (removed in Joomla 6) » ; `joomla.asset.json` recommandé, pas obligatoire. Le tag 6.1.3 n'a pas été audité fichier par fichier pour confirmer un retrait.

Avant J6 : désactiver Behaviour - Backward Compatibility ; le plugin compat 6 s'active tout seul en 5.4.x. [S23]

CI du tag 6.1.3 : jobs unit, integration et Cypress sur PHP 8.3, 8.4 **et 8.5**, MariaDB 10.4. La page 5.4 new-features documente « Support for PHP 8.5 ». Aucune page 6.1 inspectée n'en fait une exigence documentée.

`tests/Unit/bootstrap.php` existe sur le tag 6.1.3. La page Writing Tests du manuel est TODO.

## Jalons fil rouge (corpus 6.1, pas un cursus officiel)

Ancrage manuel : cinq types (composants, modules, plugins, templates, langues) + packages / files / libraries ; Get Started oriente vers le tutoriel module. [S21]

| Jalon | Critère de réussite (sources) | Erreurs typiques |
| ----- | ----------------------------- | ---------------- |
| Template enfant Cassiopeia | System vers Site Templates vers Create Child Template ; `user.css` dans `css/` ; fichiers enfant hors updates [S20] | Modifier les fichiers cœur du parent |
| Module puis `com_example` | Install + `index.php?option=com_example` ; `<namespace path="src">My\Component\Example</namespace>`, `services/provider.php` | Dossier oublié dans `<files>` ; classe ≠ chemin disque |
| Plugin console | `group="console"`, `hello:world`, `doExecute` vers 0 ; `php cli/joomla.php` (PHP 8.3.0) | Groupe console / `$defaultName` manquant |
| ACL | `$user->authorise('core.edit', 'com_content.article.22')` distinct des view levels [S1] | Confondre action et niveau de vue |
| CLI cœur | `user:list`, `scheduler:run`, `finder:index`, `extension:list` [S7] | Chercher `debug:*` / `log:*` / `perf:*` (n'existent pas) |
| API Web Services | Page 6.1 encore titrée « Joomla 4.x », inachevée [S23] | Pas de critère de réussite documenté ici (l'API `/v1` + `X-Joomla-Token` reste celle du passage 1) |
| Tests | CI 6.1.3 : unit PHP + Cypress/`tests-system` (MariaDB 10.4) ; `tests/Unit/bootstrap.php` (PHPUnit) ; Writing Tests TODO | Pas de tutoriel d'écriture dans le manuel |
| Packaging | ZIP + `pkg_*.xml` ; `<updateservers>` type `extension` | Nom de manifeste, `id` ≠ `element`, `group` plugin manquant, `blockChildUninstall` ; WAM : URI sans sous-dossier `js`/`css` [S22] |

## Carte de lecture par rôle (organisation de ce corpus, pas un parcours nommé)

Aucune source 6.1 / guide / tag n'énonce cinq parcours intégrateur / admin / templates / extensions / expert. C'est un overlay pédagogique.

- **Intégrateur** : enfant Cassiopeia, `user.css`/`user.js`, positions, overrides `html/` (guide).
- **Admin** : groupes et view levels, trois caches, scheduler Lazy vs Web Cron, SEF + htaccess, workflows, Finder, backups tiers.
- **Templates** : ordre enfant vers parent dans le code 6.1.3 ; pages Templates/a11y TODO ; aucun WCAG 2.x déclaré.
- **Extensions** : tutoriels module / `com_example` / console / package / update servers ; `authorise()` ; PSR-4 déjà traité au passage 1.
- **Expert** : Framework `^4.0`, CORS 6.1.3, dépréciations Factory/Cache 7.0, événements console, CI PHPUnit/Cypress, plugin compat.

## Glossaire (6.1.3 / 6.1)

Voir aussi [glossaire.md](glossaire.md).

| Nom | Rôle | Type |
| --- | ---- | ---- |
| `User::authorise` / `Access::check` | ACL actions sur `#__assets.rules` | API stable |
| `User::getAuthorisedViewLevels` | Niveaux de vue | API stable |
| `CacheControllerFactoryInterface` | Remplace `Cache::getInstance()` (retrait 7.0) | dépréciation |
| `ApcuStorage` / `FileStorage` / `MemcachedStorage` / `RedisStorage` | Seuls moteurs cache tag 6.1.3 | détail interne |
| `MediaHelper::canUpload` / `InputFilter::isSafeFile` | Uploads | API stable |
| `SiteRouter` / `RouterServiceInterface` / `RouterLegacy` | Pipeline SEF | API stable |
| `ScheduleRunner` | Lazy vs Web Cron | détail interne |
| `cli/joomla.php` / `Joomla\Console\Application` | Entrée CLI | API stable |
| `ApplicationEvents::BEFORE_EXECUTE` | Enregistrement commandes console | API stable (doc lacunaire) |
| `HtmlView::escape` / `OutputFilter::stringJSSafe` | Sortie HTML / JS | API stable |
| `configuration.php` `$secret` | Secret de site, hash de session | détail interne |
| `GetConfigurationCommand` | `config:get` sans rédaction | API stable |
| `CMSApplication::initialiseTemplate` | `@since 6.1.0` | API stable |
| `ApiApplication::isOriginAllowed` | `@since 6.1.3`, CVE-2026-71573 | API stable |
| `DatabaseHelper::$dbMinimumMariaDb` | `'10.4'` | détail interne |
| `#__workflow_associations` / `#__extensions` / `#__schemas.version_id` | Tables internes | détail interne |

## Catalogue versionné (extraits)

| Élément | URL / ancrage | Version | Nature |
| ------- | ------------- | ------- | ------ |
| Permissions / `$user->authorise` | manual.joomla.org 6.1 Permissions | 6.1 Current | reco (intro J3.x) + API |
| Cache admin | guide.joomla.org Cache | Current | reco ; API moteurs périmée |
| Task Scheduler | guide.joomla.org Task Scheduler | 6.1 | reco |
| Media Options / SVG | guide.joomla.org | Current | reco ; contradiction `config.xml` 6.1.3 |
| Routing | manual.joomla.org 6.1 Routing | 6.1 | API |
| SEF | guide.joomla.org Search Engine Friendly URLs | Current | reco |
| Backup / Workflows / Smart Search | guide.joomla.org | Current | reco (Akeeba = tiers) |
| Console plugin hello:world | manual.joomla.org 6.1 | 6.1 | tutoriel |
| Exigences | https://manual.joomla.org/docs/get-started/technical-requirements/ | 6.1 | reco vs minimum forcé |
| Upgrade 5 vers 6 / 4 vers 5 | guide.joomla.org migration | Current | reco |
| Tag / paquets | https://github.com/joomla/joomla-cms/releases/tag/6.1.3 | 6.1.3 | stable |
| Annonce 6.1.3 / 5.4.8 | joomla.org release-news | 18 août 2026 | reco |
| `composer.json` Framework 4.x | tag 6.1.3 `composer.json` | 6.1.3 | détail interne |
| CORS | JSST [20260802] CVE-2026-71573 | 5.4.8 / 6.1.3 | stable |
| XSS mapping | OWASP XSS Prevention Cheat Sheet | reco externe | recommandation |

## Lacunes restantes de ce passage

Voir [lacunes.md](lacunes.md) pour le tableau combiné des deux passages.

| Lacune | État dans ce corpus | Confiance |
| ------ | ------------------- | --------- |
| Champs personnalisés | Guide utilisateur existant, code 6.1.3 et tests non inspectés | partielle |
| Langues (content languages, associations, overlays) | Seulement le filtre langue de `parseSefRoute` [S5] ; overlays = Language Overrides `.override.ini` | partielle |
| Menus / modules hors SEF | Hors pipeline `SiteRouter` | lacune |
| Favicons `media/templates` vs update | Mécanisme de résolution lu, écrasement ZIP non prouvé | partielle |
| Pages manuel Templates, Web Services API, Unit Testing, Writing Tests, Accessibility | TODO / 404 [S23] | élevée (absence) |
| Tests `HtmlView::escape` et `MediaHelper` | Absents ; Helper 404 [S9] [S10] | élevée |
| Carte officielle 5 parcours | Absente | élevée |
| Couverture OWASP complète | Non revendiquée | - |
| PHP 8.5 pour 6.1.3 / 5.4.8 | Absent du tableau 6.1 ; CI 6.1.3 exécute PHP 8.5 | élevée (écart doc/CI) |
| SameSite cookies | Absent de `application.xml` / `JoomlaStorage` ; `httpheaders` non lu | partielle |
| Fusion `joomla.asset.json` enfant/parent | Non spécifiée | lacune |

Affirmation écartée à la vérification : le regroupement « avis 20260803-20260805/08/09 » comme ACL webservice est faux. 6.1.3 corrige bien l'ACL webservice (CVE-2026-71574, avis 20260803/04/05) ; 20260808 = ACL batch-copy ; 20260809 = ACL schema.org contact, pas des endpoints webservice.
