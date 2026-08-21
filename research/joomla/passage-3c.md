# Passage 3C - CLI, Finder, événements plugins, MariaDB Update, tests

**Statut** : Partial  
**Date de consultation** : 20 août 2026  
**Cible** : tag `joomla-cms` 6.1.3, manuel 6.1 Current, guide.joomla.org  
**Les `[S1]` à `[S23]` de ce fichier** correspondent à `P3C-S1` ... `P3C-S23` dans [sources.md](sources.md).

---

Au tag joomla-cms 6.1.3, le CLI unique est `php cli/joomla.php` : **36 commandes distinctes** y sont enregistrées (provider Console + `WritableContainerLoader`, et `ConsoleApplication::getDefaultCommands()`), avec un seul alias de nom déprécié, `core:check-updates`.

L'indexation Finder se lance par `finder:index` ; `cli/finder_indexer.php` n'existe plus.

Le manuel programmeur 6.1 Current ne versionne les événements de plugins que pour Application/System, Content, Installer, Module et User/Authentication ; le reste des groupes sous `plugins/` reste à l'archive docs.joomla.org ou hors catalogue.

`com_joomlaupdate` n'occulte pas l'offre 6.x sur MariaDB 10.4.x (minimum TUF 10.4, pas 10.6).

Il n'y a pas de tests PHPUnit pour `HtmlView::escape` ni `MediaHelper`, et plusieurs pages 6.1 restent des stubs TODO ou un 404.

Incertitudes : le parent `Joomla\Console\Application::getDefaultCommands()` n'a pas été inspecté (commandes framework extra possibles) ; `execute()` importe le groupe `console`, donc des plugins peuvent enregistrer d'autres commandes.

## Catalogue CLI 6.1.3

Les 24 commandes du provider `Console.php` sont mappées par `getDefaultName()` dans `WritableContainerLoader` ; `getDefaultCommands()` en instancie 13 autres, dont `CheckJoomlaUpdatesCommand` déjà présent dans le chargeur. Sauf mention contraire, les classes sont dans `Joomla\CMS\Console` ; `database:export` / `database:import` sont `Joomla\Database\Command\ExportCommand` et `ImportCommand` (joomla/database 4.0.0). [S1][S2]

| Commande | Classe | Rôle |
| -------- | ------ | ---- |
| `cache:clean` | `CleanCacheCommand` | Nettoyer les entrées de cache |
| `config:get` | `GetConfigurationCommand` | Afficher la valeur d'une option de configuration |
| `config:set` | `SetConfigurationCommand` | Définir une option de configuration |
| `core:autoupdate:register` | `AutomatedUpdatesRegisterCommand` | Inscrire le site au service de mise à jour automatique du cœur |
| `core:autoupdate:unregister` | `AutomatedUpdatesUnregisterCommand` | Désinscrire le site (libellé `setDescription` : « unautomated core update service ») |
| `core:update` | `UpdateCoreCommand` | Mettre à jour Joomla |
| `core:update:channel` | `CoreUpdateChannelCommand` | Gérer le canal de mise à jour du cœur |
| `core:update:check` | `CheckJoomlaUpdatesCommand` | Vérifier les mises à jour Joomla |
| `database:export` | `ExportCommand` | Exporter la base |
| `database:import` | `ImportCommand` | Importer la base |
| `extension:disable` | `ExtensionDisableCommand` | Désactiver une extension |
| `extension:discover` | `ExtensionDiscoverCommand` | Découvrir des extensions |
| `extension:discover:install` | `ExtensionDiscoverInstallCommand` | Installer les extensions découvertes |
| `extension:discover:list` | `ExtensionDiscoverListCommand` | Lister les extensions découvertes |
| `extension:enable` | `ExtensionEnableCommand` | Activer une extension |
| `extension:install` | `ExtensionInstallCommand` | Installer une extension depuis une URL ou un chemin |
| `extension:list` | `ExtensionsListCommand` | Lister les extensions installées |
| `extension:remove` | `ExtensionRemoveCommand` | Supprimer une extension |
| `finder:index` | `FinderIndexCommand` | Purger et reconstruire l'index |
| `maintenance:database` | `MaintenanceDatabaseCommand` | Maintenance de la structure de la base |
| `scheduler:list` | `TasksListCommand` | Lister les tâches planifiées |
| `scheduler:run` | `TasksRunCommand` | Exécuter une ou plusieurs tâches planifiées |
| `scheduler:state` | `TasksStateCommand` | Activer, désactiver ou mettre à la corbeille une tâche |
| `session:gc` | `SessionGcCommand` | Collecte des sessions |
| `session:metadata:gc` | `SessionMetadataGcCommand` | Collecte des métadonnées de session |
| `site:create-public-folder` | `SiteCreatePublicFolderCommand` | Créer un dossier public |
| `site:down` | `SiteDownCommand` | Passer le site hors ligne |
| `site:up` | `SiteUpCommand` | Passer le site en ligne |
| `update:extensions:check` | `CheckUpdatesCommand` | Vérifier les mises à jour d'extensions en attente |
| `update:joomla:remove-old-files` | `RemoveOldFilesCommand` | Supprimer les anciens fichiers système |
| `user:add` | `AddUserCommand` | Ajouter un utilisateur |
| `user:addtogroup` | `AddUserToGroupCommand` | Ajouter un utilisateur à un groupe |
| `user:delete` | `DeleteUserCommand` | Supprimer un utilisateur |
| `user:list` | `ListUserCommand` | Lister les utilisateurs |
| `user:removefromgroup` | `RemoveUserFromGroupCommand` | Retirer un utilisateur d'un groupe |
| `user:reset-password` | `ChangeUserPasswordCommand` | Changer le mot de passe d'un utilisateur |

Le seul alias de commande est `core:check-updates` sur `CheckJoomlaUpdatesCommand` (nom canonique `core:update:check`) : le constructeur est annoté `@deprecated 5.1.0 will be removed in 7.0` (« Use core:update:check instead of core:check-updates ») et appelle `setAliases(['core:check-updates'])`. [S3]

## Point d'entrée Finder

`cli/` au tag 6.1.3 ne contient que `joomla.php` et `index.html`. `cli/joomla.php` instancie `Joomla\Console\Application` ; `FinderIndexCommand::$defaultName` vaut `finder:index` (« Purge and rebuild the index »). L'invocation versionnée est donc `php cli/joomla.php finder:index`. [S4]

`cli/finder_indexer.php` est absent de l'arbre 6.1.3 (404 GitHub) : ce n'est pas un script conservé comme déprécié. [S5]

Les pages wiki Large Sites / automatic Smart Search n'ont pas pu être lues (Cloudflare) : ne pas les traiter comme preuve primaire inspectée.

## Groupes d'événements plugins

`plugins/` au tag 6.1.3 a exactement **24 groupes**, sans `plugins/console`. [S6] Le manuel 6.1 Current ne documente des événements que pour Application/System, Content, Installer, System (Module) et System (Authentication)/User (fichiers `application.md`, `content.md`, `installer.md`, `module.md`, `user-auth.md`). [S7] L'index archive Plugin/Events (libellé Joomla! 3.x, capture 18 janv. 2025) liste 21 groupes plus « Other Core Component Events » ; la page live n'a pas pu être lue (Cloudflare). [S8]

| Groupe `plugins/` | Manuel 6.1 Current | Archive Plugin/Events |
| ----------------- | ------------------ | --------------------- |
| actionlog | - | Other Core Component Events |
| api-authentication | - | Api Authentication |
| authentication | System (Authentication) (`user-auth.md`) | Authentication |
| behaviour | - | Behaviour |
| captcha | - | Captcha |
| content | Content (`content.md`) | Content |
| editors | - | Editors |
| editors-xtd | - | Editors-xtd |
| extension | - | Extensions |
| fields | - | Fields |
| filesystem | - | Filesystem |
| finder | - | Finder |
| installer | Installer (`installer.md`) | Installer |
| media-action | - | Media Action |
| multifactorauth | - | - |
| privacy | - | Privacy |
| quickicon | - | Quick Icons |
| sampledata | - | Sampledata |
| schemaorg | - | Schemaorg |
| system | Application/System (`application.md`) + System (Module) (`module.md`) | System |
| task | - | - |
| user | User (`user-auth.md`) | User |
| webservices | - | Web Services |
| workflow | - | Workflow |

Sur les groupes communs, l'index 6.1 ajoute des événements HTTP/boot (`onBeforeRespond`, `onAfterRespond`, `onBeforeExtensionBoot`, `onAfterExtensionBoot`), de document (`onAfterInitialiseDocument`), de validation (`onContentNormaliseRequestData`, `onContentBeforeValidateData`), d'état (`onContentBeforeChangeState`, `onCategoryChangeState`), d'installeur (`onInstallerBeforePackageDownload`, `onInstallerBeforeUpdateSiteDownload`) et utilisateur/reset (`onUserAfterLogout`, `onUserLogoutFailure`, `onUserBeforeResetRequest`, `onUserAfterResetRequest`, `onUserBeforeResetComplete`, `onUserAfterResetComplete`, `onUserLoginButtons`). L'archive conserve `onAfterSessionStart`, `onContentSearch`, `onContentSearchAreas` et `onUserBeforeDataValidation`, absents de l'index 6.1. Des noms restent partagés (`onAfterInitialise`, `onContentPrepare`, `onUserLogin`, `onInstallerAddInstallationTab`, six événements module). [S9]

Finder, privacy, editors, extension, sampledata et webservices n'ont aucune page `plugin-events` 6.1 : l'archive nomme notamment `onFinderCategoryChangeState`, `onFinderChangeState`, `onFinderAfterDelete`, `onFinderBeforeSave`, `onFinderAfterSave`, `onFinderResult`, `onPrepareFinderContent` ; `onPrivacyCanRemoveData`, `onPrivacyExportRequest`, `onPrivacyRemoveData` ; `onInit` / `onSave` / `onSetContent` / `onDisplay` / `onGetContent` / `onGetInsertMethod` ; `onExtensionAfterInstall` et apparentés ; `onSampledataGetOverview` et `onAjaxSampledataApplyStep1`-`3` ; `onBeforeApiRoute`. La page archive Finder est marquée Needs completion, corps d'événements vides. [S10]

Le tutoriel 6.1 Hello World décrit un plugin `group="console"` abonné à `ApplicationEvents::BEFORE_EXECUTE`, événement hors table Plugin Events ; `plugins/console` n'existe pas au tag. `plugins/task` existe mais n'apparaît ni dans l'index 6.1 ni dans le sommaire archive. [S11]

De nombreuses sous-pages archive étaient « page does not exist » (Behaviour, Fields, Filesystem, etc.) : ces noms n'ont pas été vérifiés sur des pages de détail. Les fichiers internes de `plugins/task` n'ont pas été re-listés (rate-limit GitHub).

## com_joomlaupdate et MariaDB 10.4.x

Les cibles TUF des paquets 6.x stables (dont `Joomla_6.1.3-Stable-Update_Package.zip`) déclarent `supported_databases.mariadb = "10.4"` (pas 10.6), `mysql` 8.0.13, `postgresql` 12.0, `php_minimum` 8.3.0, `channel` 6.x, `targetplatform` version `(6\.[0-4])|^(5\.4)`. [S12]

`ConstraintChecker` (identique en 5.4.8) ne fait échouer la contrainte DB que si `version_compare` de la version installée au minimum du manifeste est faux ; un 10.3.34-MariaDB échoue contre un min 10.4, un 10.4.x passe contre le minimum TUF 10.4. [S13] `TufAdapter::getUpdateTargets` conserve le candidat 6.x si seules les contraintes d'environnement (`php_minimum` / `supported_databases`) échouent ; un écart de canal (5.x vs 6.x) l'écarte sans remplir ces échecs, donc une MariaDB trop basse n'empêche pas l'écriture dans `#__updates`, un mauvais canal si. [S14]

Si `ConstraintChecker::check()` échoue, `Update::loadFromTuf` n'écrit pas `latest`/`downloadurl` ; la vue passe en layout `noupdate` / `_NODOWNLOAD` et peut afficher `COM_JOOMLAUPDATE_NODOWNLOAD_EMPTYSTATE_REASON_DATABASE`. Avec le min officiel 10.4, MariaDB 10.4.x ne prend pas ce chemin. [S15]

La collection XML officielle s'arrête à 5.4.8 / `core/j5/default.xml` (`mariadb="10.4"`) ; `core/j6/default.xml` est 404. L'offre 6.x est uniquement TUF. [S16]

L'offre 6.x n'est donc **pas masquée** pour MariaDB 10.4.x sous 10.6 : le canal TUF 6.x (Default en 6.x, « Joomla Next » en 5.4) la sélectionne, et le minimum DB du manifeste est 10.4. Les contrôles next-major de `UpdateModel` ne portent pas sur la version MariaDB (`isDatabaseTypeSupported()` = sqlsrv/sqlazure seulement, plus les plugins `behaviour/compat` et `compat6`) ; `getAutoUpdateRequirementsState()` ne parcourt que `getPhpOptions()`. [S17]

Aucune exécution live sur un site 5.4/6.1.3 avec MariaDB 10.4.x : résultat déduit du code et des métadonnées TUF/XML. `version_compare("10.4.32", "10.4")` n'a pas été exécuté ici (les tests du tag couvrent 10.3 vs 10.3/10.4).

## Tests et pages manuel TODO

Pas de test unitaire `HtmlView::escape` : `tests/Unit/Libraries/Cms/MVC/View` ne contient que `AbstractViewTest.php` (jamais `escape()`) ; `HtmlViewTest.php` est 404. `HtmlView::escape()` existe pourtant (`htmlspecialchars` `ENT_QUOTES`, `null` vers `''`). [S18]

Pas de PHPUnit `MediaHelper` (`tests/Unit/Libraries/Cms/Helper` 404, `MediaHelperTest.php` Unit et Integration 404), alors que `MediaHelper::canUpload()` existe. Substitut Cypress : `Media.cy.js` (gestionnaire média, refus de renommage en `.php`, statut 500) et `Files.cy.js` (`POST` `/media/files` en base64). `Upload.cy.js` est 404. [S19]

La page programmeur Templates 6.1 est un stub TODO. Substitut à enseigner : guide Child Templates et Template Overrides. [S20]

Le tutoriel Web Services API 6.1 est TODO ; la page conceptuelle 6.1 reste titrée « Communicate with the Joomla 4.x Web Services API » (`X-Joomla-Token`, cURL, `/v1/content/articles`). Substitut code : tests Cypress API (dont `com_media`) et `tests/README.md`. [S21]

La page Unit Testing 6.1 est un stub TODO. Substituts : `tests/Unit/README.md` (`./libraries/vendor/bin/phpunit --testsuite Unit`), job CI `tests-unit` (PHP 8.3/8.4/8.5), page Setup unit, bootstrap `tests/Unit/bootstrap.php`. [S22]

`/docs/accessibility/wcag/` en 6.1 est 404 (absence à enseigner). Le hub Accessibility 6.1 vise WCAG 2.2 AA pour les **extensions** mais est inachevé. [S23]

Writing Tests du manuel non réexaminé ici. Un substitut d'écriture existe dans `tests/System/README.md` (Create New Tests / Test Development) sans re-prouver le TODO manuel.

## Lacunes restantes de ce passage

- Catalogue d'événements 6.1 Current : ne couvre pas la majorité des 24 dossiers `plugins/` ; Finder archive incomplet ; `task`, `multifactorauth` et le groupe console (tutoriel seulement) sans catalogue versionné.
- Pas de flux XML 6.x (TUF seul).
- Pas de PHPUnit pour `HtmlView::escape` ni `MediaHelper` ; pas de `Upload.cy.js`.
- Pages programmeur Templates, Web Services API (tutoriel) et Unit Testing : stubs, avec les substituts ci-dessus.
- WCAG 6.1 : 404. Aucun substitut versionné ici pour la page Writing Tests au-delà de `tests/System/README.md`.
- Commandes CLI supplémentaires possibles via le parent framework ou des plugins `group="console"`.
