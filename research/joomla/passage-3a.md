# Passage 3A - Champs, langues, menus et modules

**Statut** : Partial  
**Date de consultation** : 20 août 2026  
**Cible** : tag `joomla-cms` 6.1.3, manuel 6.1 Current, guide.joomla.org  
**Les `[S1]` à `[S18]` de ce fichier** correspondent à `P3A-S1` ... `P3A-S18` dans [sources.md](sources.md).

---

Sur Joomla CMS **6.1.3**, les trois lacunes d'exploitation contenu se ferment sur le tag et les docs primaires, sans ré-ouvrir `SiteRouter::parse()`, les moteurs de cache page, ni le pipeline déjà lu.

`com_fields` expose **21 noms de types** cœur (18 plugins) et ne câble nativement que content, contact et users ; le plugin Content - Fields rend `{field 1}` (espace obligatoire), pas `{field:n}`.

Le multilangue sépare packs UI et content languages : le commutateur est System - Language Filter, les paires `#__associations`, le module Language Switcher.

Hors routeur, l'Itemid (`#__menu.id`) autorise la page, assigne les modules et suffixe le cache module ; le rendu est `bootModule` vers dispatcher vers chrome.

## Champs personnalisés (`com_fields`)

Le tag 6.1.3 livre 18 plugins sous `plugins/fields` : calendar, checkboxes, color, editor, imagelist, integer, list, media, note, number, radio, sql, subform, text, textarea, url, user, usergrouplist. Le plugin media enregistre en plus audio, document et video (basenames de `tmpl/*.php`), soit 21 noms ; `FieldsPlugin::onCustomFieldsGetTypes()` prend ce basename. Le 5.4.8 n'a ni note ni number, et `media/tmpl` n'a que `media.php`. Help61:Fields:_Edit parle encore de 16 types : écart documentaire, pas le code 6.1.3. [S1]

Aucune page manuel 6.1 Current dédiée à `com_fields` n'a été trouvée (Custom Fields Overview = sous-classes `FormField`, pas les champs personnalisés).

Le câblage `FieldsFormServiceInterface` (étend `FieldsServiceInterface`) se limite à `com_content.article` / `com_content.categories` (les vues site form, featured et category se replient sur article), `com_contact.contact` / `com_contact.mail` / `com_contact.categories` (le formulaire site contact se replie sur mail), et `com_users.user` (inscription et profil se replient sur user). `com_newsfeeds`, `com_banners` et `com_tags` n'implémentent pas l'interface. Le plugin System - Fields reassocie `com_categories.category` vers `{extension}.categories` et `com_tags.tag` vers le `type_alias` de l'item tagué. [S2]

Les plugins de type s'abonnent à `onCustomFieldsGetTypes`, `onCustomFieldsPrepareField`, `onCustomFieldsPrepareDom` et `onContentPrepareForm`. Le plugin système Fields gère `onContentNormaliseRequestData`, `onContentPrepareForm`, `onContentAfterSave`, `onContentAfterDelete`, `onUserAfterSave`, `onUserAfterDelete`, `onContentAfterTitle`, `onContentBeforeDisplay`, `onContentAfterDisplay` et `onContentPrepare` (remplit `$item->jcfields`). L'édition de valeur exige `core.edit.value` sur `{component}.field.{id}` ; l'asset `FieldTable` porte ce nom, parent `{component}.fieldgroup.{id}` ou le composant (`access.xml` de content, contact et users). Help61 Permissions liste Delete, Edit, Edit State et Edit Custom Field Value. CVE-2026-72531 (ACL webservice champs, 4.0.0-5.4.7 et 6.0.0-6.1.2) est corrigée en 5.4.8 et 6.1.3 (JSST 20260804). [S3]

`plg_content_fields` est activé dans le seed SQL 6.1.3. Le rendu des jetons exige un espace : `/{(field|fieldgroup)\s+(.*?)}/i` ; le premier fragment avant virgule est casté `(int)` (pas de jeton par nom). L'ini officielle en-GB documente `{field 1}`, `{field 1,foo}` (layout alternatif) et `{fieldgroup 2}` ; le remplacement passe par `FieldsHelper::render($context, 'field.'|'fields.' . $layout, ...)`. Le guide joomla.center (10 août 2026) illustre `{field:12}` et `{field:event-date}`, syntaxe que ce regex **ne reconnaît pas**. [S4]

Overrides de layout : (1) valeur plugin via `PluginHelper::getLayoutPath('fields', $plugin, $type)` : `templates/{tpl}/html/plg_fields_{name}/{layout}.php` puis `plugins/fields/{name}/tmpl/` ; (2) affichage `field.render` / `fields.render`, `FieldLayoutField` proposant les `*.php` (sauf `render`) de `components/{extension}/layouts/field` et `templates/{tpl}/html/layouts/{extension|com_fields|}/field`. `FieldsHelper::render()` tente d'abord le composant du contexte, puis `com_fields`. Le cœur ne livre que `components/com_fields/layouts/field/render.php`. [S5]

Définitions dans `#__fields` (type par défaut `text`), groupes `#__fields_groups`, affectation catégories `#__fields_categories`, valeurs `#__fields_values` (`field_id`, `item_id` varchar, `value` mediumtext). `FieldModel::setFieldValue()` n'écrit que si `canEditFieldValue()` passe ; une valeur vide devient `null` (ligne supprimée). Critère Cypress `Field.cy.js` : créer un champ à `context=com_content.article` produit le message système **Field saved**. [S6]

Contrats stables : interface de service + événements `onCustomFields*`. Chemins tmpl, arbre d'assets et remaps système : détail interne. Help61 « 16 types » : reco/doc décalée, pas une API.

Les tests système ne couvrent que le CRUD admin ; aucun test 6.1.3 n'assert `{field 1}`, le refus ACL de `setFieldValue`, ni le rendu audio/video/document.

## Langues et multilangue

Joomla 6.1 distingue packs UI installés (`#__extensions`, `type=language`, `enabled=1`, `LanguageHelper::getInstalledLanguages()`) et content languages (`#__languages`). `getLanguages()` ne retient que `published=1` (ordre `ordering`) ; `getContentLanguages()` part de `#__languages` et, si `$checkInstalled` (défaut vrai), intersecte avec les packs site (`client_id` 0). Le guide Current enchaîne System vers Install Languages puis System vers Content Languages (publier / ordonner). [S7]

Le plugin System - Language Filter est le commutateur : `onBeforeExecute` (site) appelle `setLanguageFilter(true)`. `Multilanguage::isEnabled()` lit ce drapeau côté site, le plugin activé côté admin. `Associations::isEnabled()` exige en plus `item_associations` (défaut 1 dans `languagefilter.xml`, `true` en PHP). Les paires sont dans `#__associations`. Le guide : activer le filtre, Item Associations = Yes, puis Components vers Multilingual Associations (articles, catégories, contacts, items de menu, news feeds). [S8]

Le module Language Switcher (`mod_languages`) n'affiche une content language que s'il existe un pack UI site, un accueil spécifique à ce `lang_code`, et un niveau d'accès autorisé. Lien, dans l'ordre : association composant, sinon association menu (`index.php?lang={sef}&Itemid=...`), sinon l'item actif `language='*'` (même Itemid + `lang=sef`), sinon l'accueil de la langue cible (ou l'URL courante si cette langue est déjà active). [S9]

Hors debug, le Framework (`Joomla\Language\Language` 4.0.0, `$default = 'en-GB'`) charge d'abord en-GB, puis la langue active, puis `language/overrides/{lang}.override.ini` (gagne via `array_replace`). Le CMS charge aussi l'override de la langue par défaut seulement si `!$debug && $lang !== en-GB`. En debug, ni le fallback en-GB ni l'override de la langue par défaut ne sont chargés. Chemins guide : `siteroot/language/overrides/en-GB.override.ini` et l'équivalent administrator. [S10]

`HtmlDocument::_fetchTemplate` demande `tpl_{template}` d'abord depuis `JPATH_BASE`, et seulement en échec depuis le dossier template (`||`) ; en cas d'héritage, même schéma pour `tpl_{inherits}`. `Language::load()` s'arrête au premier `{basePath}/language/{lang}/{extension}.ini` réussi. Cassiopeia 6.1.3 a `language/en-GB/tpl_cassiopeia.ini` (clés `TPL_CASSIOPEIA_*`) et **pas** d'overlay `templates/cassiopeia/language/` (404) : un fichier homonyme sous le template n'est donc pas fusionné. [S11]

Sans relire `SiteRouter::parse()` : `LanguageFilter::parseRule` (`PROCESS_BEFORE`) consomme un préfixe SEF connu (`sefs[]`) ou, si `remove_default_prefix`, pose la langue site de `com_languages` (défaut en-GB). Ensuite `parseSefRoute` n'accepte un alias que si le filtre est off, ou si `item->language === '*'` ou égal au tag courant. Un chemin encore non vide lève `RouteNotFoundException` dans le `Router` parent (`JERROR_PAGE_NOT_FOUND`). Un item `*` n'est pas filtré par tag, mais un lien All Languages vers un article ensuite associé 404 au changement de langue (guide de setup). [S12]

CRUD admin `com_languages` / `com_associations` non ouvert au-delà de `LanguageHelper`, `Associations.php` et `AssociationModel::getForm`. Version exacte du paquet `joomla/language` dans `composer.lock` non lue (`$default = 'en-GB'` pris du Framework 4.0.0).

## Menus, Itemid et modules (hors pipeline `SiteRouter`)

Le guide 6.1 liste les types d'items frontend cœur comme venant d'environ 10 composants (plus de 30 types, 36 dénombrés) : Articles (Archived, Category Blog, Category List, Create Article, Featured, List All Categories, Single Article), Configuration (Display Template Options, Site Configuration Options), Contacts (Create, Featured, List All Categories, List in a Category, Single), News Feeds (3, vues non listées une par une), Privacy (Confirm Request, Create Request, Extend Consent), Smart Search (Search), System Links (Menu Heading, Menu Item Alias, Separator, URL), Tags (3, vues non listées), Users (Edit Profile, Login Form, Logout, Password Reset, Registration, User Profile, Username Reminder), Wrapper (Iframe). `#__menu.type` est documenté Component, URL, Alias ou Separator. Single Article est `components/com_content/tmpl/article/default.xml`. [S13]

Itemid = `#__menu.id`. Après routage, `SiteApplication` lit `Itemid` et appelle `authorise($Itemid)` (redirection login, ou 403 / accueil). Le même entier sélectionne les modules (`ModuleHelper::getModuleList` lie `:itemId`), clé le cache callback `com_modules` (`groups.clientId.itemId`), suffixe le cache par module (`cachemode` `itemid` par défaut) et devient la classe body Cassiopeia `itemid-{Itemid}`. [S14]

L'affectation pages n'est pas dans `#__modules` :

| Mode UI | `assignment` | `#__modules_menu.menuid` |
| ------- | ------------ | ------------------------ |
| On all pages | 0 | `0` [S15] |
| No pages | liste vide / non numérique | aucune ligne |
| Only on the pages selected | 1 | ids positifs |
| On all pages except those selected | -1 | ids négatifs |

PK `(moduleid, menuid)`. `getModuleList` garde `menuid = Itemid` ou `menuid <= 0` ; `cleanModuleList` exclut `menuid === -Itemid`.

Position et publication sont des contrôles distincts. La position est le slot Cassiopeia nommé par `<jdoc:include type="modules" name="sidebar-right" style="card" />` (liste `<positions>`, topbar à debug). La publication est `#__modules.published` plus `publish_up` / `publish_down`, plus access et extension `enabled`. `getModuleList` exige `published=1`, `e.enabled=1`, `client_id` et access, fenêtre de dates vs maintenant : **aucun prédicat sur la chaîne position**. Cassiopeia met `style="card"` sur les sidebars et `style="none"` sur menu, topbar, footer, debug. [S16]

Rendu site : `HtmlDocument` parse d'abord les `jdoc` `module`/`modules` ; `ModulesRenderer` appelle un `ModuleRenderer` par module de la position ; `ModuleHelper::renderRawModule` fait `$app->bootModule($name, $appName)->getDispatcher($mod, $app)->dispatch()` (manuel 6.1 Current, classes `Module.php` / `ModuleDispatcher.php`) ; le chrome enveloppe ensuite. `AbstractModuleDispatcher::dispatch` (depuis 4.0.0) : `loadLanguage`, `getLayoutData`, `require getLayoutPath`. Sans dispatcher namespacé, `ModuleDispatcherFactory` instancie `ModuleDispatcher`, qui inclut `modules/mod_*/mod_*.php`. `params.style` peut forcer `Template-chromeName` et le `basePath` layout ; sinon le style d'attributs vaut `none` ; `tp=1` ajoute `outline`. Chromes système : `layouts/chromes` `html5.php`, `none.php`, `outline.php`, `table.php` ; Cassiopeia ajoute `card.php` et `noCard.php`. `ChromestyleField` liste inherit (`0`) puis les options groupées Template-style. [S17]

Le cache **par module** (onglet Advanced, distinct des moteurs de cache page déjà lus) : Use global ou No caching ; le Cache Time module est en **secondes**, le global en **minutes** ; l'identité combine id module, view levels et Itemid. `mod_menu.xml` : `cache=1` (`JGLOBAL_USE_GLOBAL`), `cache_time=900`, `cachemode` caché `itemid`. `ModuleRenderer` n'enveloppe `renderModule` via `moduleCache` que si `cache==1`, cache application `>= 1`, et `cachemode` ni `id` ni `safeuri`. `moduleCache` coupe si `owncache`/`cache` vaut 0, si le cache global vaut 0, ou si l'utilisateur est connecté. Modes documentés : `static`, `itemid` (défaut), `safeuri`, `id`. [S18]

Ne pas enseigner comme 6.1.3 les options module marquées « [New in 6.2] » sur le guide Login Form. Associations de modules (`ModuleModel::$associationsContext = 'com_modules.item'` depuis 6.1.0) et `{loadmodule}` / modules dans les articles : non tracés.

## Glossaire de ce passage

**Tables.** `#__fields`, `#__fields_groups`, `#__fields_categories`, `#__fields_values` ; `#__extensions` (packs `type=language`) ; `#__languages` (content languages) ; `#__associations` ; `#__menu` ; `#__modules` ; `#__modules_menu`.

**Contrats / classes.** `FieldsFormServiceInterface` / `FieldsServiceInterface` ; `ContentComponent`, `ContactComponent`, `UsersComponent` ; `FieldsPlugin` ; `FieldsHelper` ; `FieldTable` ; `FieldModel::setFieldValue` ; `FieldLayoutField` ; plugin système Fields ; `plg_content_fields` ; `LanguageHelper` ; `LanguageFilter` ; `Multilanguage` ; `Associations` ; `LanguagesHelper` (`mod_languages`) ; CMS `Language` ; Framework `Joomla\Language\Language` 4.0.0 ; `HtmlDocument` ; `SiteApplication::authorise` ; `ModuleHelper` ; `ModuleRenderer` ; `AbstractModuleDispatcher` ; `ModuleDispatcherFactory` / `ModuleDispatcher` ; `ChromestyleField`.

## Pièges et diagnostic

- Jeton `{field:n}` / `{field:name}` : aucun remplacement ; utiliser `{field 1}` ou `{field 1,layout}`.
- Help « 16 types » : le tag 6.1.3 en a 21 noms ; ne pas caler un diagnostic sur Help61:Fields:_Edit.
- Valeur champ vide : pas de ligne `#__fields_values` (null vers delete) ; échec silencieux si `core.edit.value` manque.
- News feeds / banners / tags : pas d'attache `FieldsServiceInterface` ; un tag n'hérite des champs que via remap `type_alias`.
- Language Switcher vide : pack UI site, accueil `lang_code` ou view level manquant.
- Item Main Menu `*` vers un article ensuite associé : **Page Not Found** au switch (le `*` passe `parseSefRoute`, l'article associé non).
- Debug langue : plus de fallback en-GB ni d'override de la langue par défaut.
- Overlay `templates/{tpl}/language/` : ignoré dès que `JPATH_BASE/language/{lang}/tpl_{tpl}.ini` existe.
- Module invisible malgré une position Cassiopeia : `published`, fenêtre de dates, access, extension disabled, ou `menuid === -Itemid`.
- Cache module : secondes vs minutes ; coupé pour tout utilisateur connecté ; `cachemode` `id`/`safeuri` hors du raccourci `ModuleRenderer`.
- Instance < 6.1.3 (ou < 5.4.8 en 5.4) : CVE-2026-72531 sur les endpoints webservice champs.

**Critères de réussite.** Champ : message **Field saved** à `context=com_content.article`, valeur en `#__fields_values` après `core.edit.value`, jeton `{field N}` remplacé. Multilingue : filtre actif, content languages publiées, associations oui, switcher limité aux langues complètes (pack + home + ACL), préfixe SEF consommé avant l'alias. Module : `published=1` + `jdoc` de position + ligne `#__modules_menu` compatible Itemid, HTML issu de `dispatch()` puis chrome.

## Lacunes restantes de ce passage

| Sujet | Statut | Détail |
| ----- | ------ | ------ |
| Fusion overlay langue template | Comportement lu | Si `JPATH_BASE/language/{lang}/tpl_{template}.ini` existe déjà, l'opérateur `\|\|` n'appelle jamais le dossier template : pas de merge. Cassiopeia 6.1.3 n'a pas ce dossier. |
| Types News Feeds / Tags nommés un par un | Non fourni par le paquet | Le guide dit « 3 » pour chaque famille, sans lister les vues. |
| `{loadmodule}` / associations modules 6.1.0 | Non tracés | Hors ce passage |
| Page manuel `com_fields` 6.1 | Absente | Enseigner depuis le code + Help décalée |
