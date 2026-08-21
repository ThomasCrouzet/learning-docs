# Passage 4D - Catalogue d'événements observé dans le code 6.1.3

**Statut** : Partial (liste déterministe ; le corps synthétisé n'a pas passé la validation de citations du runner)  
**Date de consultation** : 20 août 2026  
**Cible** : tag `joomla-cms` 6.1.3  
**Nature** : **convention observée** (`getSubscribedEvents` / `SubscriberInterface`), **pas** une API publiée. Le manuel 6.1 ne versionne que 5 pages (application, content, installer, module, user-auth).  
**Les `[S1]` à `[S24]` de ce fichier** correspondent à `P4D-S1` ... `P4D-S24` dans [sources.md](sources.md).

Ne pas enseigner l'archive `docs.joomla.org/Plugin/Events` (libellé Joomla 3.x, pages souvent « does not exist », live Cloudflare) comme contrat 6.1. Le contrat d'écoute J3 (méthodes `on*` à arguments positionnels) est encore présent mais **@deprecated, retrait 7.0**. Le contrat 6.1 documenté est `SubscriberInterface` plus une classe d'événement nommée. [S19][S22]

Liste **partielle** : rate-limit GitHub ; fichiers non ouverts (entre autres) : `plugins/task/globalcheckin`, `plugins/task/rotatelogs`, la majorité de `plugins/fields/*` hors media, la majorité de `plugins/webservices/*` hors content/media/users.

## Groupes prioritaires (code 6.1.3)

| Groupe | Événements observés | Fichier exemple | Notes |
| ------ | ------------------- | --------------- | ----- |
| task | `onTaskOptionsList`, `onExecuteTask`, `onContentPrepareForm` (sauf SiteStatus) | `plugins/task/checkfiles/src/Extension/Checkfiles.php` | Pas de page plugin-events 6.1 [S1] |
| finder | parent + `onFinderAfterDelete`, `onFinderAfterSave`, `onFinderBeforeSave`, `onFinderChangeState` ; Content/Contacts/Newsfeeds + `onFinderCategoryChangeState` | `plugins/finder/content/src/Extension/Content.php` | Categories et Tags n'ont pas CategoryChangeState [S2] |
| fields | parent `onCustomFields*` ; extras inspectés : `onCustomFieldsBeforePrepareField`, `onContentPrepareData` | `plugins/fields/media/src/Extension/Media.php` | Pas de `@event` ; héritage aussi dans `FieldsPlugin.php` [S3] |
| webservices | `onBeforeApiRoute` seulement (Content, Media, Users inspectés) | `plugins/webservices/content/src/Extension/Content.php` | Liste partielle [S4] |
| privacy | tous : `onPrivacyExportRequest` ; UserPlugin + `onPrivacyCanRemoveData`, `onPrivacyRemoveData` | `plugins/privacy/user/src/Extension/UserPlugin.php` | [S5] |
| workflow | Publishing : `onAfterDisplay`, `onContentBeforeChangeState`, `onContentBeforeSave`, `onContentPrepareForm`, `onContentVersioningPrepareTable`, `onTableBeforeStore`, `onWorkflowAfterTransition`, `onWorkflowBeforeTransition`, `onWorkflowFunctionalityUsed` ; Featuring : `onContentBeforeChangeFeatured` à la place de ChangeState ; Notification : PrepareForm + AfterTransition | `plugins/workflow/publishing/src/Extension/Publishing.php` | [S6] |
| multifactorauth | `onUserMultifactorGetMethod`, Captive, GetSetup, SaveSetup, Validate ; Email + `onUserMultifactorBeforeDisplayMethods` | plugins MFA | `$allowLegacyListeners` @deprecated 4.3, retrait 7.0 (style d'écoute, pas un nom d'événement) [S6] |
| extension | Joomla/Finder/NamespaceMap : `onExtensionAfterInstall`, `onExtensionAfterUpdate`, `onExtensionAfterUninstall` ; Joomlaupdate : `onExtensionBeforeSave`, `onExtensionAfterSave` | plugins/extension | [S6] |
| editors | None/Codemirror : `onEditorSetup` ; TinyMCE : `onEditorSetup`, `onAjaxTinymce` | plugins/editors | Pas les noms archive `onInit`/`onDisplay`/`onGetContent` ; @todo traits à retirer en J7 [S6][S15] |

## Autres groupes (code 6.1.3)

| Groupe | Événements observés | Notes |
| ------ | ------------------- | ----- |
| actionlog | Écoute beaucoup de content/user/extension ; noms propres : `onAfterLogPurge`, `onAfterLogExport` | Seul plugin du groupe [S7] |
| api-authentication | `onUserAuthenticate` (basic, token) | `ApiApplication::$authenticationPluginType = 'api-authentication'` [S8] |
| authentication (hors user-auth) | Cookie : `onPrivacyCollectAdminCapabilities` en plus de `onUserAuthenticate` / AfterLogin / AfterLogout | joomla et ldap = `onUserAuthenticate` déjà dans user-auth.md [S8] |
| behaviour | compat6 : `onAfterInitialiseDocument` ; taggable/versionable : événements `onTable*` | Pas de `plugins/behaviour/compat`, seulement compat6, taggable, versionable [S9] |
| captcha | `onCaptchaSetup`, `onAjaxPowcaptcha` | Seul plugin : powcaptcha [S9] |
| editors-xtd | `onEditorButtonsSetup` (8 plugins) | `onDisplay` legacy @deprecated 7.0 [S10] |
| filesystem | `onSetupProviders` | Seul plugin : local [S10] |
| media-action | `onContentPrepareForm` (hérité) ; resize + `onContentBeforeSave` | crop surcharge PrepareForm sans `getSubscribedEvents` propre [S10] |
| quickicon | `onGetIcons` (8 plugins) ; eos + `onAjaxEos` | `CoreEventAware` mappe `onGetIcon` (singulier), pas le nom dispatché `onGetIcons` [S11] |
| sampledata | `onSampledataGetOverview` ; `onAjaxSampledataApplyStep1`-4 (blog), 1-8 (multilang), 1-9 (testing) | CoreEventAware ne mappe que GetOverview [S11] |
| schemaorg | dispatch : `onSchemaPrepareData`, `onSchemaPrepareForm`, `onSchemaPrepareSave`, `onSchemaBeforeCompileHead` | Abonnements variables selon plugin [S12] |
| console | `application.before_execute` | Tutoriel seulement ; `plugins/console` absent au tag [S12] |

## Manuel 6.1 vs code

- Cinq pages plugin-events seulement ; Finder, Fields, Privacy, Workflow, Web Services, task, captcha : **404**. [S13][S19]
- Les exemples 6.1 (editors, editors-xtd, captcha, console, filesystem) spécifient des événements **sans** reprendre les noms archive J3 (`onInit`, `onSave`, `onSetContent`, `onDisplay`, `onGetContent`, `onGetInsertMethod`). [S15]
- `CoreEventAware.php` 6.1.3 nomme encore Finder, Privacy, Sample Data, Quickicon, Schemaorg, Workflow, ActionLog, custom-fields, extension-install, API-route : convention code, pas une page catalogue. [S17]
- L'archive 3.x sous-dénombre Fields/Privacy/Workflow par rapport aux classes d'événement 6.1.3. [S23]

## Pièges

- Enseigner l'archive Plugin/Events comme contrat 6.1.
- Copier les signatures positionnelles J3 (retrait prévu 7.0).
- Confondre `onGetIcon` (`CoreEventAware`) et `onGetIcons` (dispatché).
- Inventer une table complète : plusieurs arbres n'ont pas été parcourus fichier par fichier.
- Groupe `ajax` documenté dans les exemples, **absent** des 24 dossiers `plugins/` 6.1.3.

## Lacunes restantes de ce passage

Fichiers non ouverts (task globalcheckin/rotatelogs, majorité fields/webservices). Dispatch sites de `onAfterLogPurge` / `onAfterLogExport` non ouverts. Noms Workflow réellement `dispatch()` non extraits au-delà des abonnements. Présence en PHP 6.1.3 de `onContentSearch`, `onContentSearchAreas`, `onAfterSessionStart`, `onUserBeforeDataValidation` non vérifiée (seulement absents de l'index 6.1).
