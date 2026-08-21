# Glossaire - classes, fichiers, commandes (Joomla CMS 6.1.3)

**Date** : 20 août 2026  
**Sources** : [passage-1.md](passage-1.md), [passage-2.md](passage-2.md)  
**Légende type** : API stable = à enseigner comme contrat ; recommandation = doc officielle ; détail interne = convention observée, pas un contrat ; dépréciation = encore là, retrait annoncé.

## Bootstrap et applications

| Nom | Rôle | Fichier / ancrage | Type |
| --- | ---- | ----------------- | ---- |
| `index.php` | Front controller site ; PHP >= 8.3.0 ; `_JEXEC` | tag 6.1.3 `index.php` | API stable |
| `includes/app.php` | Conteneur DI, alias session site, `SiteApplication::execute()` | tag 6.1.3 | détail interne |
| `SiteApplication` | Application site | `libraries/src/Application/SiteApplication.php` | API stable |
| `AdministratorApplication` | Application admin | `administrator/includes/app.php` | API stable |
| `ApiApplication` | Application API ; `isOriginAllowed` depuis 6.1.3 | `api/includes/app.php` | API stable |
| `Joomla\Console\Application` / `cli/joomla.php` | Entrée CLI, session `session.cli` | `cli/joomla.php` | API stable |
| `CMSApplication::execute` | Plugins behaviour/system, `doExecute`, render, respond | `libraries/src/Application/CMSApplication.php` | détail interne (flux observé) |
| `CMSApplication::initialiseTemplate` | Validation template, défaut `system` | `@since 6.1.0` | API stable |
| `ComponentHelper::renderComponent` | `bootComponent()->getDispatcher()->dispatch()` | `libraries/src/Component/ComponentHelper.php` | détail interne |
| `ComponentDispatcher::dispatch` | `core.manage` en admin, `controller.task`, MVCFactory | `libraries/src/Dispatcher/ComponentDispatcher.php` | détail interne |
| `Factory::createContainer` | Enregistre Application, Database, Session, Form, WAM, etc. | `libraries/src/Factory.php` | recommandation DI depuis J4 |
| `Factory::getDbo` et getters historiques | Remplacés par le conteneur ; `getContainer()` n'est pas un substitut 1:1 de `getDbo()` | @deprecated 4.3, retrait 7.0 | dépréciation |
| `Factory::getMailer` | Idem | @deprecated 4.4.0, retrait 7.0 | dépréciation |
| `Document::addScript` / `addStyleSheet` | Manuel WAM dit « retiré en Joomla 6 » ; encore présentes | @deprecated 4.3, retrait 7.0 | dépréciation + contradiction doc |

## ACL, session, sécurité

| Nom | Rôle | Fichier / ancrage | Type |
| --- | ---- | ----------------- | ---- |
| `User::authorise` | Action + asset ; racine court-circuite à true | `libraries/src/User/User.php` | API stable |
| `Access::check` | Lit `#__assets.rules` JSON imbriqué | `libraries/src/Access/Access.php` | API stable |
| `User::getAuthorisedViewLevels` | Visibilité (niveaux Public, Guest, etc.) | idem | API stable |
| `Session::checkToken` / `HTMLHelper::_('form.token')` | CSRF ; aussi `HTTP_X_CSRF_TOKEN` | `libraries/src/Session/Session.php` | API stable |
| `Input::get` | Filtre par défaut `cmd` | manuel Input 6.1 | API stable |
| `HtmlView::escape` | `htmlspecialchars(..., ENT_QUOTES, UTF-8)` | `libraries/src/MVC/View/HtmlView.php` | API stable |
| `OutputFilter::stringJSSafe` | JS en `\uXXXX` | `libraries/src/Filter/OutputFilter.php` | API stable |
| `MediaHelper::canUpload` | Liste blanche, MIME optionnel, SVG sanitizer | `libraries/src/Helper/MediaHelper.php` | API stable |
| `InputFilter::isSafeFile` | Octet nul, extensions interdites, `<?php`, PHAR | `libraries/src/Filter/InputFilter.php` | API stable |
| `$secret` | Secret de site, hash de nom de session | `configuration.php` | détail interne |
| `GetConfigurationCommand` | `config:get` dump sans rédaction (secret, mot de passe DB) | Console | API stable |
| `JoomlaStorage` | Cookie `httponly` ; `session_set_cookie_params` 5 args, **pas** SameSite | session storage | détail interne |
| `NativeStorage::setOptions` | Liste blanche d'options ; **ignore** `cookie_samesite` | joomla/session 4.0.0 | détail interne |
| `Joomla\Input\Cookie::set` | Clé optionnelle `samesite` Lax/Strict | joomla/input 4.0.0 | API framework, pas la session CMS |
| plg_system_httpheaders | CSP, HSTS, XFO, Referrer-Policy, COOP | plugin system | reco ; pas Set-Cookie |
| Homonyme WAM | Même `type`+`name` : dernier JSON chargé remplace l'item entier | `WebAssetRegistry::add` | API stable |
| `ApiApplication::isOriginAllowed` | CORS, CVE-2026-71573 | `@since 6.1.3` | API stable |
| `IpHelper::setAllowIpOverrides` | Désactivé sauf `behind_loadbalancer` | `includes/framework.php` | détail interne |

## Cache, scheduler, médias, routage

| Nom | Rôle | Fichier / ancrage | Type |
| --- | ---- | ----------------- | ---- |
| Plugin System - Page Cache | Cache page ; **non** vidé en sauvant un article | guide Cache | recommandation |
| Cache Conservative vs Progressive | Vue/module | guide Cache | recommandation |
| `CacheControllerFactoryInterface` | Remplace `Cache::getInstance()` (retrait 7.0) | tag 6.1.3 | dépréciation |
| `ApcuStorage` / `FileStorage` / `MemcachedStorage` / `RedisStorage` | Seuls moteurs expédiés | tag 6.1.3 | détail interne |
| `ScheduleRunner` | Lazy (défaut) XOR Web Cron | tag 6.1.3 | détail interne |
| `com_media` `file_path` / `image_path` | Défauts `files` / `images` (guide dit `images` / `images`) | `administrator/components/com_media/config.xml` | API + contradiction |
| `SiteRouter` | SSL, init, SEF parse/build, pagination, rewrite | `libraries/src/Router/SiteRouter.php` | API stable |
| `RouterServiceInterface::createRouter` | Routeur de composant, sinon `RouterLegacy` | manuel Routing 6.1 | API stable |
| `com_finder` | Smart Search ; `finder:index` | plugins `finder/*` | API stable |
| `#__workflow_associations` | Workflows (étapes/transitions) | table interne | détail interne |

## Templates

| Nom | Rôle | Fichier / ancrage | Type |
| --- | ---- | ----------------- | ---- |
| Cassiopeia | Template site héritable ; positions topbar, menu, sidebars, footer, debug, error-403/404 | `templates/cassiopeia/` | recommandation |
| Atum | Template admin ; classes a11y utilisateur | `administrator/templates/atum/` | détail interne |
| `user.css` / `user.js` | Assets optionnels via WAM après preset LTR/RTL | `joomla.asset.json` Cassiopeia | recommandation |
| Override de même nom | Toujours appliqué | guide Layouts | recommandation |
| Layout alternatif | Opt-in, pas d'underscore dans le nom principal | guide Layouts | recommandation |
| JLayout | Surcharge sous `html/layouts` | `LayoutHelper::render` | API stable |
| Ordre enfant puis parent | `HtmlView`, `ModuleHelper::getLayoutPath`, `FileLayout` | tag 6.1.3 | détail interne |
| Mail Templates | Depuis 5.2 ; chrome `mailtemplate.php` | guide Mail Templates | recommandation |

## Extensions et CLI

| Nom | Rôle | Fichier / ancrage | Type |
| --- | ---- | ----------------- | ---- |
| `<namespace path="src">` | PSR-4 | manifeste | API stable |
| `services/provider.php` | MVCFactory, DispatcherFactory, ComponentInterface | tutoriel `com_example` | API stable |
| `#__schemas.version_id` | Distinct de `<version>` du manifeste | manuel Manifest | API stable |
| `pkg_<name>.xml` | Package d'extensions | manuel Packages | API stable |
| `<updateservers>` | Types `extension` ou `collection` | manuel Update Servers | API stable |
| `/api/index.php/v1` + `X-Joomla-Token` | Web services ; `core.login.api` **et** `core.login.site` | manuel Web Services | API stable |
| Plugin Behaviour - Backward Compatibility | Couche J4 vers J5 ; à désactiver avant J6 | guide 5 vers 6 | recommandation |
| Plugin Behaviour - Backward Compatibility 6 | Essentiel 5.4 vers 6.x ; install neuve 6 : installé, désactivé | manuel compat-plugin | recommandation |

Catalogue CLI cœur (36 noms) : voir le tableau de [passage-3c.md](passage-3c.md). Absentes : `debug:*`, `log:*`, `perf:*`. Alias déprécié : `core:check-updates` (retrait 7.0). `cli/finder_indexer.php` n'existe plus.

## Champs, langues, menus, modules

| Nom | Rôle | Fichier / ancrage | Type |
| --- | ---- | ----------------- | ---- |
| `{field 1}` / `{field 1,layout}` | Jeton Content - Fields (espace obligatoire) | `plg_content_fields` regex | API stable |
| `FieldsFormServiceInterface` | Câblage content / contact / users seulement | composants cœur | API stable |
| `#__fields` / `#__fields_values` | Définitions et valeurs | supports.sql | détail interne |
| `core.edit.value` | Éditer une valeur de champ | `{component}.field.{id}` | API stable |
| System - Language Filter | Commutateur multilangue | `plugins/system/languagefilter` | API stable |
| `#__languages` / `#__associations` | Content languages et paires | tables | détail interne |
| `language/overrides/{lang}.override.ini` | Gagne via `array_replace` après en-GB puis langue active | CMS Language | recommandation |
| Itemid | `#__menu.id` : ACL page, modules, cache, classe body | `SiteApplication` | API stable |
| `#__modules_menu` | Affectation pages (`0`, ids, ids négatifs) | `ModuleHelper::getModuleList` | détail interne |
| `bootModule` → dispatcher → chrome | Rendu module 6.x | `ModuleHelper::renderRawModule` | API stable |
