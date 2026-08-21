# Sources - Dossier Joomla CMS

**Date de consultation** : 20 août 2026  
**Règle** : `manual.joomla.org` versionnée, `guide.joomla.org`, annonces et code `joomla-cms` = primaires. `docs.joomla.org` = archive datée.

Les identifiants `[S1]` à `[S24]` du [passage 1](passage-1.md) restent `S1` ... `S24`. Les identifiants locaux des passages suivants sont préfixés `P2-`, `P3A-`, `P3B-`, `P3C-`, `P4A-`, `P4B-`, `P4C-`, `P4D-` dans ce fichier.

## Passage 1

| Id | Titre | URL | Type | Recoupement |
| -- | ----- | --- | ---- | ----------- |
| S1 | Joomla! Downloads - Latest | https://downloads.joomla.org/us/latest | primaire | paquets 4.x + annonce 6.1.3/5.4.8 |
| S2 | Technical Requirements 6.1 Current | https://manual.joomla.org/docs/get-started/technical-requirements/ | primaire | même page 6.1 |
| S3 | Technical Requirements 5.4 Legacy | https://manual.joomla.org/docs/5.4/get-started/technical-requirements/ | primaire | 6.1 Current + 4.4 Archived |
| S4 | Joomla 6.1.3 et 5.4.8 Security and Bugfix Release | https://www.joomla.org/announcements/release-news/5957-joomla-6-1-3-5-4-8-security-bugfix-release.html | primaire | feuille de route projet |
| S5 | Joomla 5 to 6 Planning and Upgrade Step by Step | https://guide.joomla.org/user-manual/migration/joomla-5-to-6-planning-and-upgrade-step-by-step | primaire | https://manual.joomla.org/updates/54-60/compat-plugin/ |
| S6 | Joomla! Framework | https://framework.joomla.org/ | primaire | - |
| S7 | Métadonnées GitHub joomla/joomla-cms ; release 6.1.3 ; versions du manuel | https://api.github.com/repos/joomla/joomla-cms | primaire | `/releases/latest` + https://manual.joomla.org/versions/ |
| S8 | Front controllers 6.1.3 | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/index.php | dépôt tag 6.1.3 | `includes/app.php`, admin, api, `cli/joomla.php` |
| S9 | CMSApplication, SiteApplication, ComponentHelper, ComponentDispatcher 6.1.3 ; événements application manuel 6.1 | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Application/CMSApplication.php | dépôt + manuel | WebAssetRegistry + https://manual.joomla.org/docs/building-extensions/plugins/plugin-events/application/ |
| S10 | Factory et CMSApplication 6.1.3 | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Factory.php | dépôt tag 6.1.3 | CMSApplication.php |
| S11 | Session 6.1.3 ; CSRF / Input / Secure DB Queries manuel 6.1 ; OWASP CSRF | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Session/Session.php | primaire + OWASP | `includes/framework.php` |
| S12 | Lifecycle et Web Asset Manager manuel 6.1 ; Document.php 6.1.3 | https://manual.joomla.org/docs/general-concepts/the-lifecycle/ | primaire | WAM + Document.php + CMSApplication.php |
| S13 | Guide : Template Overrides, Basics, Child Templates, Cassiopeia Customisation | https://guide.joomla.org/user-manual/templates/templates-template-overrides | primaire | pages child / basics / customisation |
| S14 | Cassiopeia index.php, joomla.asset.json, templateDetails.xml | https://github.com/joomla/joomla-cms/blob/6.1-dev/templates/cassiopeia/index.php | dépôt 6.1-dev | guide templateDetails |
| S15 | Guide : Template Layouts ; Template Overrides | https://guide.joomla.org/user-manual/templates/templates-template-layouts | primaire | overrides |
| S16 | Guide : Mail Templates | https://guide.joomla.org/user-manual/mail-templates | primaire | - |
| S17 | Guide Cassiopeia templateDetails.xml vs core 5.4-dev / 6.1-dev / 6.1.3 | https://guide.joomla.org/user-manual/templates/templates-cassiopeia-templatedetails-xml | primaire vs code | XML core + index.php 6.1.3 |
| S18 | Cassiopeia Customisation ; index.php Cassiopeia et Atum | https://guide.joomla.org/user-manual/templates/templates-cassiopeia-template-customisation | primaire vs code | index.php 6.1-dev |
| S19 | Build Extensions manuel 6.1 | https://manual.joomla.org/docs/building-extensions/ | primaire | - |
| S20 | Step 1 Basic Component manuel 6.1 | https://manual.joomla.org/docs/building-extensions/components/component-development-tutorial/step01-basic-component/ | primaire | tutoriel module |
| S21 | Manifest Files manuel 6.1 | https://manual.joomla.org/docs/building-extensions/install-update/installation/manifest/ | primaire | - |
| S22 | Packages manuel 6.1 | https://manual.joomla.org/docs/building-extensions/install-update/installation/package/ | primaire | Update Servers |
| S23 | tests/README.md branche 5.4-dev | https://raw.githubusercontent.com/joomla/joomla-cms/5.4-dev/tests/README.md | dépôt 5.4-dev | phpunit.xml.dist + tests/System/README.md |
| S24 | Web Services manuel 6.1 | https://manual.joomla.org/docs/general-concepts/webservices/ | primaire | page User |

## Passage 2

| Id | Titre | URL | Type | Recoupement |
| -- | ----- | --- | ---- | ----------- |
| P2-S1 | Permissions manuel 6.1 ; User.php / Access.php 6.1.3 ; guide Access Control | https://manual.joomla.org/docs/general-concepts/acl/acl-permissions/ | primaire + dépôt | code 6.1.3 + guide |
| P2-S2 | Cache guide utilisateur vs storages 6.1.3 | https://guide.joomla.org/user-manual/system/system-cache | primaire vs code | moteurs réellement expédiés |
| P2-S3 | Task Scheduler guide 6.1 ; ScheduleRunner.php 6.1.3 | https://guide.joomla.org/user-manual/scheduled-tasks | primaire + dépôt | plugins/task |
| P2-S4 | Media Options / SVG vs com_media config.xml et MediaHelper.php 6.1.3 | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/administrator/components/com_media/config.xml | primaire vs code | guide SVG + MediaHelper |
| P2-S5 | Routing manuel 6.1 ; SiteRouter.php 6.1.3 ; guide SEF | https://manual.joomla.org/docs/general-concepts/routing/ | primaire + dépôt | guide Search Engine Friendly URLs |
| P2-S6 | Backup / Workflows / Smart Search vs plugins/finder 6.1.3 | https://guide.joomla.org/user-manual/system/system-backup | primaire | plugins finder |
| P2-S7 | cli/joomla.php, commandes Console, application.xml, plg_system_debug | https://github.com/joomla/joomla-cms/blob/6.1.3/cli/joomla.php | dépôt + manuel | FinderIndexCommand, TasksRunCommand, tutoriel console, guide CLI install |
| P2-S8 | ConsoleApplication.php 6.1.3 ; listing plugins ; événements application | https://github.com/joomla/joomla-cms/blob/6.1.3/libraries/src/Application/ConsoleApplication.php | dépôt + manuel | ApplicationEvents framework (arbre vendor 404 dans le CMS) |
| P2-S9 | HtmlView.php, OutputFilter, tests ; MVC manuel ; OWASP XSS | https://github.com/joomla/joomla-cms/blob/6.1.3/libraries/src/MVC/View/HtmlView.php | dépôt + OWASP | OutputFilterTest ; pages MVC view 404 |
| P2-S10 | MediaHelper.php et InputFilter.php 6.1.3 | https://github.com/joomla/joomla-cms/blob/6.1.3/libraries/src/Helper/MediaHelper.php | dépôt | tests Helper 404 |
| P2-S11 | configuration.php-dist, Session, GetConfigurationCommand, cookies, Debug | https://github.com/joomla/joomla-cms/blob/6.1.3/installation/configuration.php-dist | dépôt | JoomlaStorage, application.xml |
| P2-S12 | Commandes Console extension/update et tests Console 6.1.3 | https://github.com/joomla/joomla-cms/blob/6.1.3/libraries/src/Console/ExtensionsListCommand.php | dépôt | CheckUpdatesCommand, ExtensionEnableCommand |
| P2-S13 | HtmlView / FileLayout / ModuleHelper / HtmlDocument 6.1.3 ; guide Child Templates | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/MVC/View/HtmlView.php | dépôt + guide | ordre enfant avant parent |
| P2-S14 | CMSApplication::initialiseTemplate 6.1.3 (aussi 6.1.0) | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Application/CMSApplication.php | dépôt | SiteApplication.php |
| P2-S15 | ApiApplication::isOriginAllowed ; JSST 20260802 | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Application/ApiApplication.php | dépôt + avis sécu | CVE-2026-71573 |
| P2-S16 | DatabaseHelper.php ; exigences 6.1 ; guide 5 vers 6 ; UpdateModel ; ci.yml | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/installation/src/Helper/DatabaseHelper.php | dépôt + manuel | MariaDB 10.4 forcé |
| P2-S17 | Notes de release 6.1.3 ; guides 4 vers 5 et 5 vers 6 | https://github.com/joomla/joomla-cms/releases/tag/6.1.3 | primaire | pas de saut 4.4 vers 6.x |
| P2-S18 | composer.json 6.1.3 (Framework 4.x) | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/composer.json | dépôt | packages joomla/* ^4.0 |
| P2-S19 | Annonce 6.1.3/5.4.8, tag, exigences, guide 5 vers 6 | https://www.joomla.org/announcements/release-news/joomla-6-1-3-5-4-8-security-bugfix-release.html | primaire | PHP 8.5 absent du tableau |
| P2-S20 | Child Templates / Cassiopeia ; templateDetails.xml 6.1.3 ; pages Templates manuel | https://guide.joomla.org/user-manual/templates/templates-child-templates | primaire vs TODO | pages programmeur Templates inachevées |
| P2-S21 | Build Extensions, tutoriels, Packages, Update Servers, console hello:world | https://manual.joomla.org/docs/building-extensions/ | primaire | cli/joomla.php |
| P2-S22 | Factory.php 6.1.3 ; Web Asset Manager 6.1 | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Factory.php | dépôt + manuel | dépréciations 7.0 |
| P2-S23 | Pages 6.1 inachevées (Templates, Web Services, Unit, Writing Tests, a11y) ; bootstrap tests | https://manual.joomla.org/docs/building-extensions/templates/template/ | primaire (TODO) | tests/Unit/bootstrap.php 6.1.3 |

## Passage 3A

| Id | Titre | URL | Type | Recoupement |
| -- | ----- | --- | ---- | ----------- |
| P3A-S1 | plugins/fields 6.1.3 ; FieldsPlugin.php ; Help61 Fields Edit | https://github.com/joomla/joomla-cms/tree/6.1.3/plugins/fields | dépôt vs Help | 21 noms vs 16 types Help |
| P3A-S2 | Content/Contact/Users + System Fields | https://github.com/joomla/joomla-cms/blob/6.1.3/administrator/components/com_content/src/Extension/ContentComponent.php | dépôt | FieldsFormServiceInterface |
| P3A-S3 | FieldsPlugin, FieldsHelper, FieldTable, access.xml, JSST 20260804 | https://github.com/joomla/joomla-cms/blob/6.1.3/administrator/components/com_fields/src/Plugin/FieldsPlugin.php | dépôt + avis sécu | CVE-2026-72531 |
| P3A-S4 | plg_content_fields Fields.php + ini | https://github.com/joomla/joomla-cms/blob/6.1.3/plugins/content/fields/src/Extension/Fields.php | dépôt | regex `{field 1}` |
| P3A-S5 | PluginHelper::getLayoutPath, FieldLayoutField, FieldsHelper::render | https://github.com/joomla/joomla-cms/blob/6.1.3/libraries/src/Plugin/PluginHelper.php | dépôt | overrides layouts |
| P3A-S6 | supports.sql, FieldModel, Field.cy.js | https://github.com/joomla/joomla-cms/blob/6.1.3/installation/sql/mysql/supports.sql | dépôt + tests | tables champs |
| P3A-S7 | Multilingual manuel 6.1 ; LanguageHelper.php | https://manual.joomla.org/docs/general-concepts/multilingual/ | primaire + dépôt | packs vs content languages |
| P3A-S8 | LanguageFilter, Associations, languagefilter.xml | https://github.com/joomla/joomla-cms/blob/6.1.3/plugins/system/languagefilter/src/Extension/LanguageFilter.php | dépôt + guide | #__associations |
| P3A-S9 | LanguagesHelper (mod_languages) | https://github.com/joomla/joomla-cms/blob/6.1.3/modules/mod_languages/src/Helper/LanguagesHelper.php | dépôt + guide | switcher |
| P3A-S10 | CMS Language.php ; Framework Language 4.0.0 ; guide Overrides | https://github.com/joomla/joomla-cms/blob/6.1.3/libraries/src/Language/Language.php | dépôt | ordre en-GB / active / override.ini |
| P3A-S11 | HtmlDocument + tpl_cassiopeia.ini | https://github.com/joomla/joomla-cms/blob/6.1.3/libraries/src/Document/HtmlDocument.php | dépôt | overlay template 404 |
| P3A-S12 | LanguageFilter parseRule + SiteRouter parseSefRoute | https://github.com/joomla/joomla-cms/blob/6.1.3/plugins/system/languagefilter/src/Extension/LanguageFilter.php | dépôt | préfixe SEF |
| P3A-S13 | Guide Menu Item Types + article default.xml | https://guide.joomla.org/user-manual/menus/menus-menu-item-types | primaire | types frontend |
| P3A-S14 | SiteApplication, ModuleHelper, cassiopeia index, base.sql | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Application/SiteApplication.php | dépôt | Itemid |
| P3A-S15 | Guide Module Display by Menu Item + ModuleModel | https://guide.joomla.org/user-manual/modules/modules-module-display-by-menu-item | primaire + dépôt | #__modules_menu |
| P3A-S16 | Guide custom module + getModuleList | https://guide.joomla.org/user-manual/modules/modules-how-do-you-create-a-custom-module-3f | primaire + dépôt | position vs publication |
| P3A-S17 | Extension Dispatcher Modules 6.1 + chrome | https://manual.joomla.org/docs/general-concepts/extension-and-dispatcher/extension-dispatcher-module/ | primaire + dépôt | bootModule |
| P3A-S18 | Guide Cache + ModuleRenderer + mod_menu.xml | https://guide.joomla.org/user-manual/system/system-cache | primaire vs code | cache module secondes |

## Passage 3B

| Id | Titre | URL | Type | Recoupement |
| -- | ----- | --- | ---- | ----------- |
| P3B-S1 | application.xml fieldset cookie 6.1.3 | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/administrator/components/com_config/forms/application.xml | dépôt | configuration.php-dist, chaînes com_config |
| P3B-S2 | JoomlaStorage 6.1.3 | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Session/Storage/JoomlaStorage.php | dépôt | session_set_cookie_params 5 args |
| P3B-S3 | NativeStorage::setOptions (joomla/session 4.0.0) | https://raw.githubusercontent.com/joomla-framework/session/4.0.0/src/Storage/NativeStorage.php | vendor | ignore cookie_samesite |
| P3B-S4 | plg_system_httpheaders + guide HTTP Headers | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/plugins/system/httpheaders/src/Extension/Httpheaders.php | dépôt + guide | pas Set-Cookie / SameSite |
| P3B-S5 | Manuel 6.1 Session Object Changes / To Logon | https://manual.joomla.org/updates/44-50/removed-backward-incompatibility/ | primaire | pas de page SameSite Current |
| P3B-S6 | Joomla\\Input\\Cookie::set (joomla/input 4.0.0) | https://raw.githubusercontent.com/joomla-framework/input/4.0.0/src/Cookie.php | vendor | samesite optionnel, hors session CMS |
| P3B-S7 | MediaHelper canUpload / checkFileExtension | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Helper/MediaHelper.php | dépôt | OWASP File Upload |
| P3B-S8 | OWASP File Upload + MediaHelper::checkMimeType | https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html | OWASP + code | MIME par octets, pas Content-Type |
| P3B-S9 | LocalAdapter::checkContent + isSafeFile | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/plugins/filesystem/local/src/Adapter/LocalAdapter.php | dépôt | File::upload 4.2, tracker #48038 |
| P3B-S10 | MediaHelper::isValidSvg + composer.json | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Helper/MediaHelper.php | dépôt | sanitizer booléen, pas CDR |
| P3B-S11 | com_media config.xml + plg_filesystem_local | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/administrator/components/com_media/config.xml | dépôt | stockage sous racine web |
| P3B-S12 | layouts com_content author.php + OWASP XSS | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/layouts/joomla/content/info_block/author.php | dépôt + OWASP | HTMLHelper::link, readmore, default_links |
| P3B-S13 | Cassiopeia index.php favicons 6.1.3 | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/templates/cassiopeia/index.php | dépôt | HTMLHelper::image |
| P3B-S14 | build/media_source images + recreate-media.mjs | https://github.com/joomla/joomla-cms/tree/6.1.3/build/media_source/templates/site/cassiopeia/images | dépôt | favicons dans system/images |
| P3B-S15 | RemoveOldFilesCommand + deleteUnexistingFiles | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Console/RemoveOldFilesCommand.php | dépôt | aucune entrée favicon |
| P3B-S16 | UpdateCoreCommand::copyFileTo + Folder::copy | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Console/UpdateCoreCommand.php | dépôt | écrase si le chemin est dans le paquet |
| P3B-S17 | Guide Favicons, Cassiopeia Customisation, Child Templates | https://guide.joomla.org/user-manual/templates/templates-favicons | primaire | conflit « will not be affected » tranché |
| P3B-S18 | WebAssetRegistry add / parseRegistryFile | https://github.com/joomla/joomla-cms/blob/6.1.3/libraries/src/WebAsset/WebAssetRegistry.php | dépôt | homonyme remplace, pas de fusion |
| P3B-S19 | SiteApplication::dispatch parent puis enfant | https://github.com/joomla/joomla-cms/blob/6.1.3/libraries/src/Application/SiteApplication.php | dépôt | ordre d'enregistrement |
| P3B-S20 | addTemplateRegistryFile / addExtensionRegistryFile | https://github.com/joomla/joomla-cms/blob/6.1.3/libraries/src/WebAsset/WebAssetRegistry.php | dépôt | pas de règle parent/enfant |
| P3B-S21 | AdministratorApplication::dispatch | https://github.com/joomla/joomla-cms/blob/6.1.3/libraries/src/Application/AdministratorApplication.php | dépôt | même ordre parent puis enfant |
| P3B-S22 | WebAssetRegistryTest.php 6.1.3 | https://github.com/joomla/joomla-cms/blob/6.1.3/tests/Unit/Libraries/Cms/WebAsset/WebAssetRegistryTest.php | tests | add() override, pas parent/enfant fichiers |
| P3B-S23 | Manuel 6.1 Web Asset Manager Register / Overriding | https://manual.joomla.org/docs/general-concepts/web-asset-manager/ | primaire | dernier homonyme gagne |

## Passage 3C

| Id | Titre | URL | Type | Recoupement |
| -- | ----- | --- | ---- | ----------- |
| P3C-S1 | Console.php, Application.php, database Export/Import 4.0.0 | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Service/Provider/Console.php | dépôt | 24 commandes provider |
| P3C-S2 | ConsoleApplication::getDefaultCommands | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Application/ConsoleApplication.php | dépôt | 13 commandes de plus |
| P3C-S3 | CheckJoomlaUpdatesCommand alias déprécié | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Console/CheckJoomlaUpdatesCommand.php | dépôt | core:check-updates, retrait 7.0 |
| P3C-S4 | cli/joomla.php + FinderIndexCommand | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/cli/joomla.php | dépôt | finder:index |
| P3C-S5 | cli/ finder_indexer.php absent | https://github.com/joomla/joomla-cms/blob/6.1.3/cli/finder_indexer.php | dépôt (404) | plus de script legacy |
| P3C-S6 | plugins/ 6.1.3 (24 groupes) | https://api.github.com/repos/joomla/joomla-cms/contents/plugins?ref=6.1.3 | dépôt | pas plugins/console |
| P3C-S7 | Plugin Events manuel 6.1 | https://manual.joomla.org/docs/building-extensions/plugins/plugin-events/ | primaire | 5 pages seulement |
| P3C-S8 | Plugin/Events archive Wayback 18 janv. 2025 | https://web.archive.org/web/20250118015419/https://docs.joomla.org/Plugin/Events | archive | live Cloudflare |
| P3C-S9 | plugin-events/index.md vs archive | https://raw.githubusercontent.com/joomla/Manual/main/docs/building-extensions/plugins/plugin-events/index.md | primaire vs archive | événements ajoutés/retirés |
| P3C-S10 | Plugin/Events/Finder Wayback 17 fév. 2025 | https://web.archive.org/web/20250217075238/https://docs.joomla.org/Plugin/Events/Finder | archive | Needs completion |
| P3C-S11 | Console Plugin Hello World 6.1 | https://manual.joomla.org/docs/building-extensions/plugins/plugin-examples/basic-console-plugin-helloworld/ | primaire | group=console, pas de dossier |
| P3C-S12 | TUF targets.json update.joomla.org | https://update.joomla.org/cms/targets.json | primaire | mariadb 10.4 |
| P3C-S13 | ConstraintChecker.php 6.1.3 | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Updater/ConstraintChecker.php | dépôt + tests | 10.4.x passe |
| P3C-S14 | TufAdapter.php 6.1.3 | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Updater/Adapter/TufAdapter.php | dépôt | canal vs contraintes env |
| P3C-S15 | Update.php + vue noupdate | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Updater/Update.php | dépôt | layout noupdate |
| P3C-S16 | XML collection list.xml ; j6/default.xml 404 | https://update.joomla.org/core/list.xml | primaire | offre 6.x = TUF seul |
| P3C-S17 | UpdateModel.php 6.1.3 | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/administrator/components/com_joomlaupdate/src/Model/UpdateModel.php | dépôt | pas de check MariaDB next-major |
| P3C-S18 | AbstractViewTest.php (pas HtmlView::escape) | https://github.com/joomla/joomla-cms/blob/6.1.3/tests/Unit/Libraries/Cms/MVC/View/AbstractViewTest.php | tests | HtmlViewTest 404 |
| P3C-S19 | Cypress com_media Files.cy.js / Media.cy.js | https://github.com/joomla/joomla-cms/blob/6.1.3/tests/System/integration/api/com_media/Files.cy.js | tests | Helper 404, Upload.cy.js 404 |
| P3C-S20 | Page Templates manuel 6.1 (TODO) | https://manual.joomla.org/docs/building-extensions/templates/template/ | primaire (stub) | substitut = guide |
| P3C-S21 | Web Services API 6.1 (TODO) + page conceptuelle 4.x | https://manual.joomla.org/docs/web-services-api/ | primaire (stub) | Cypress API |
| P3C-S22 | Unit Testing 6.1 (TODO) + tests/Unit/README.md | https://manual.joomla.org/docs/testing/automated/unit/ | primaire (stub) | phpunit --testsuite Unit |
| P3C-S23 | accessibility/wcag/ 404 | https://manual.joomla.org/docs/accessibility/wcag/ | primaire (404) | hub a11y TODO |

## Passage 4A

| Id | Titre | URL | Type | Recoupement |
| -- | ----- | --- | ---- | ----------- |
| P4A-S1 | LoadModule.php 6.1.3 | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/plugins/content/loadmodule/src/Extension/LoadModule.php | dépôt | xml + provider + base.sql |
| P4A-S2 | Guide Modules inside Articles | https://guide.joomla.org/user-manual/modules/modules-how-do-you-put-a-module-inside-an-article-3f | primaire + code | trois formes + espace |
| P4A-S3 | loadmodule.xml + SQL style xhtml | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/plugins/content/loadmodule/loadmodule.xml | dépôt | fallback html5 |
| P4A-S4 | com_modules modal.php + editors-xtd module | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/administrator/components/com_modules/tmpl/modules/modal.php | dépôt | jamais {loadmodule} |
| P4A-S5 | ModuleHelper.php | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Helper/ModuleHelper.php | dépôt | liste publiée seulement |
| P4A-S6 | Content Events 6.1 + LoadModule | https://manual.joomla.org/docs/building-extensions/plugins/plugin-events/content/ | primaire | onContentPrepare |
| P4A-S7 | ModuleModel + AdminModel | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/administrator/components/com_modules/src/Model/ModuleModel.php | dépôt | associationsContext 6.1.0 |
| P4A-S8 | module edit/list + AssociationsHelper | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/administrator/components/com_modules/tmpl/module/edit.php | dépôt | UI site seulement |
| P4A-S9 | Associations::isEnabled + languagefilter.xml | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Language/Associations.php | dépôt | item_associations |
| P4A-S10 | ModuleHelper + LanguageFilter (pas de JOIN associations) | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Helper/ModuleHelper.php | dépôt | pas de substitution frontend |
| P4A-S11 | Annonce Joomla 6.1 / PR #46671 | https://www.joomla.org/announcements/release-news/joomla-6-1-is-here.html | primaire | Documentation Required |
| P4A-S12 | Guide Multilingual Associations | https://guide.joomla.org/user-manual/languages/languages-multilingual-associations | primaire | modules absents du guide |
| P4A-S13 | com_newsfeeds/tmpl 6.1.3 | https://github.com/joomla/joomla-cms/tree/6.1.3/components/com_newsfeeds/tmpl | dépôt | 3 default.xml |
| P4A-S14 | com_newsfeeds.sys.ini | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/administrator/language/en-GB/com_newsfeeds.sys.ini | dépôt | titres en-GB |
| P4A-S15 | com_tags tag/list.xml + MenutypesModel | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/components/com_tags/tmpl/tag/list.xml | dépôt | 3e type = layout list |
| P4A-S16 | Guide Menu Item Types | https://guide.joomla.org/user-manual/menus/menus-menu-item-types | primaire | six titres déjà nommés |
| P4A-S18 | MenutypesModel + tmpl admin | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/administrator/components/com_menus/src/Model/MenutypesModel.php | dépôt | pas de type frontend extra |
| P4A-S19 | atum/language 404 | https://github.com/joomla/joomla-cms/tree/6.1.3/administrator/templates/atum/language | dépôt (404) | pas d'overlay |
| P4A-S20 | trees templates / administrator/templates | https://github.com/joomla/joomla-cms/tree/6.1.3/templates | dépôt | aucun dossier language/ |
| P4A-S21 | tpl_atum.ini + templateDetails.xml | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/administrator/language/en-GB/tpl_atum.ini | dépôt | copie install, pas overlay runtime |
| P4A-S22 | Language::load | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Language/Language.php | dépôt | un seul basePath |
| P4A-S23 | HtmlDocument::_fetchTemplate | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Document/HtmlDocument.php | dépôt | \|\| pas de merge |
| P4A-S24 | cassiopeia_extended templateDetails.xml | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/templates/cassiopeia_extended/templateDetails.xml | dépôt | parent cassiopeia, pas de language/ |

## Passage 4C

| Id | Titre | URL | Type | Recoupement |
| -- | ----- | --- | ---- | ----------- |
| P4C-S1 | GitHub expanded assets 6.1.3 | https://github.com/joomla/joomla-cms/releases/expanded_assets/6.1.3 | primaire | SHA-256 Full/Update |
| P4C-S2 | Joomla Downloads 6.1.3 | https://downloads.joomla.org/cms/joomla6/6-1-3 | primaire | MD5/SHA1, pas de listing interne |
| P4C-S3 | Tag 6.1.3 path media (404) | https://github.com/joomla/joomla-cms/tree/6.1.3/media | dépôt | .gitignore /media |
| P4C-S4 | build/media_source/system/images | https://github.com/joomla/joomla-cms/tree/6.1.3/build/media_source/system/images | dépôt | favicons source |
| P4C-S5 | Full Package ZIP update.joomla.org | https://update.joomla.org/releases/6.1.3/Joomla_6.1.3-Stable-Full_Package.zip | primaire | corps > 10 MB non lu |
| P4C-S6 | Guide Favicons | https://guide.joomla.org/user-manual/templates/templates-favicons | primaire | ordre de résolution install, pas listing ZIP |
| P4C-S7 | composer.lock 6.1.3 | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/composer.lock | dépôt | joomla/console 4.0.0 |
| P4C-S8 | joomla/console 4.0.0 Application.php | https://raw.githubusercontent.com/joomla-framework/console/4.0.0/src/Application.php | vendor | getDefaultCommands |
| P4C-S9 | ListCommand.php | https://raw.githubusercontent.com/joomla-framework/console/4.0.0/src/Command/ListCommand.php | vendor | `list` |
| P4C-S10 | HelpCommand.php | https://raw.githubusercontent.com/joomla-framework/console/4.0.0/src/Command/HelpCommand.php | vendor | `help` |
| P4C-S11 | AbstractCommand.php | https://raw.githubusercontent.com/joomla-framework/console/4.0.0/src/Command/AbstractCommand.php | vendor | $defaultName |
| P4C-S12 | CMS ConsoleApplication.php | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Application/ConsoleApplication.php | dépôt | array_merge parent |
| P4C-S13 | Console Plugin Hello World 6.1 | https://manual.joomla.org/docs/building-extensions/plugins/plugin-examples/basic-console-plugin-helloworld/ | primaire | BEFORE_EXECUTE |
| P4C-S14 | CMS ConsoleApplication execute | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Application/ConsoleApplication.php | dépôt | importPlugin console |
| P4C-S15 | Framework Application::execute | https://raw.githubusercontent.com/joomla-framework/console/4.0.0/src/Application.php | vendor | BEFORE_EXECUTE |
| P4C-S16 | plugins/console 404 + listing plugins/ | https://github.com/joomla/joomla-cms/blob/6.1.3/plugins/console | dépôt (404) | 24 groupes, pas console |
| P4C-S17 | base.sql seed extensions | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/installation/sql/mysql/base.sql | dépôt | pas folder=console |
| P4C-S18 | Console provider + PluginHelper | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Service/Provider/Console.php | dépôt | commandes cœur via DI |
| P4C-S19 | Writing Tests manuel 6.1 | https://manual.joomla.org/docs/testing/automated/unit/writing-test/ | primaire (TODO) | stub inchangé |
| P4C-S20 | tests/System/README.md | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/tests/System/README.md | dépôt | Create New Tests Cypress |
| P4C-S23 | tests/Unit/README.md | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/tests/Unit/README.md | dépôt | phpunit Unit seulement |
| P4C-S24 | tests/Integration/README.md | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/tests/Integration/README.md | dépôt | phpunit Integration, pas Create New Tests |
| P4C-local | Listing `unzip -l` du ZIP Update GitHub 6.1.3 | https://github.com/joomla/joomla-cms/releases/download/6.1.3/Joomla_6.1.3-Stable-Update_Package.zip | paquet | favicons dans media/system/images |

## Passage 4B

| Id | Titre | URL | Type |
| -- | ----- | --- | ---- |
| P4B-S1 | JoomlaStorage.php 6.1.3 | https://github.com/joomla/joomla-cms/blob/6.1.3/libraries/src/Session/Storage/JoomlaStorage.php | dépôt |
| P4B-S2 | PHP session_set_cookie_params | https://www.php.net/manual/en/function.session-set-cookie-params.php | PHP |
| P4B-S3 | php-src PHP-8.3.0 session.c | https://github.com/php/php-src/blob/PHP-8.3.0/ext/session/session.c | PHP |
| P4B-S4 | PHP session.cookie_samesite | https://www.php.net/manual/en/session.configuration.php#ini.session.cookie-samesite | PHP |
| P4B-S5 | Authentication Cookie plugin | https://github.com/joomla/joomla-cms/blob/6.1.3/plugins/authentication/cookie/src/Extension/Cookie.php | dépôt |
| P4B-S6 | PHP setcookie + joomla/input Cookie | https://www.php.net/manual/en/function.setcookie.php | PHP + vendor |
| P4B-S7 | article.xml filterText | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/administrator/components/com_content/forms/article.xml | dépôt |
| P4B-S8 | ComponentHelper::filterText | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Component/ComponentHelper.php | dépôt |
| P4B-S9 | TinyMCE DisplayTrait | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/plugins/editors/tinymce/src/PluginTraits/DisplayTrait.php | dépôt |
| P4B-S10 | article/default.php + OWASP XSS | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/components/com_content/tmpl/article/default.php | dépôt + OWASP |
| P4B-S11 | com_contact default.php / address | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/components/com_contact/tmpl/contact/default.php | dépôt |
| P4B-S12 | com_contact default_links.php + UrlFilter | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/components/com_contact/tmpl/contact/default_links.php | dépôt + OWASP |
| P4B-S13 | com_media config.xml | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/administrator/components/com_media/config.xml | dépôt |
| P4B-S16 | LocalAdapter.php | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/plugins/filesystem/local/src/Adapter/LocalAdapter.php | dépôt |
| P4B-S18 | OWASP File Upload | https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html | OWASP |
| P4B-S19 | com_joomlaupdate extract.php | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/administrator/components/com_joomlaupdate/extract.php | dépôt |
| P4B-S22 | finalisation.php | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/administrator/components/com_joomlaupdate/finalisation.php | dépôt |

## Passage 4D

| Id | Titre | URL | Type |
| -- | ----- | --- | ---- |
| P4D-S1 | plugins/task Checkfiles.php | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/plugins/task/checkfiles/src/Extension/Checkfiles.php | dépôt |
| P4D-S2 | plugins/finder Content.php | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/plugins/finder/content/src/Extension/Content.php | dépôt |
| P4D-S3 | plugins/fields Media.php | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/plugins/fields/media/src/Extension/Media.php | dépôt |
| P4D-S4 | plugins/webservices Content.php | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/plugins/webservices/content/src/Extension/Content.php | dépôt |
| P4D-S5 | plugins/privacy UserPlugin.php | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/plugins/privacy/user/src/Extension/UserPlugin.php | dépôt |
| P4D-S6 | plugins/workflow Publishing.php | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/plugins/workflow/publishing/src/Extension/Publishing.php | dépôt |
| P4D-S7 | actionlog Joomla.php | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/plugins/actionlog/joomla/src/Extension/Joomla.php | dépôt |
| P4D-S13 | Plugin Events manuel 6.1 | https://manual.joomla.org/docs/building-extensions/plugins/plugin-events/ | primaire (5 pages) |
| P4D-S17 | CoreEventAware.php | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Event/CoreEventAware.php | dépôt |
| P4D-S19 | Plugin Events 6.1 + outdated wiki | https://manual.joomla.org/docs/building-extensions/plugins/plugin-events/ | primaire |
| P4D-S22 | CMSPlugin.php dépréciation listeners J3 | https://raw.githubusercontent.com/joomla/joomla-cms/6.1.3/libraries/src/Plugin/CMSPlugin.php | dépôt |
| P4D-S24 | plugins/ 6.1.3 | https://github.com/joomla/joomla-cms/tree/6.1.3/plugins | dépôt |

## Fiabilité

- **Haute** : manuel 6.1, guide utilisateur, tag Git 6.1.3, annonces officielles, portal downloads, code inspecté au tag.
- **Moyenne** : dates de support 6.x 2028/2029 (en-têtes de colonnes absents du HTML de la feuille de route) ; guide Cache encore rédigé pour Joomla 5 ; pages manuel encore titrées Joomla 4.x.
- **Archive** : `docs.joomla.org` (non utilisée au passage 1 : interstitiel Cloudflare sur la page des versions).
- **À ne pas enseigner comme API garantie** : flux `execute()` / `dispatch()` lu dans le CMS ; page Lifecycle 6.1 inachevée ; `ScheduleRunner` et listes de storages cache (détail interne).
- **Écarts doc/code à figer dans les fiches** : WAM « retiré en Joomla 6 » vs méthodes encore là jusqu'à 7.0 ; Media Options `file_path` ; moteurs de cache du guide ; PHP 8.5 absent du tableau mais présent en CI 6.1.3.
