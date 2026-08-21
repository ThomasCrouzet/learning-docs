# Passage 4A - loadmodule, associations modules, types News Feeds/Tags, overlays langue

**Statut** : Partial  
**Date de consultation** : 20 août 2026  
**Cible** : tag `joomla-cms` 6.1.3  
**Les `[S1]` à `[S24]` de ce fichier** correspondent à `P4A-S1` ... `P4A-S24` dans [sources.md](sources.md).

---

Au tag **6.1.3**, les balises `{loadposition}`, `{loadmodule}` et `{loadmoduleid}` dans le contenu (articles) sont développées uniquement par le plugin cœur `plg_content_loadmodule`, abonné à `onContentPrepare` ; le rendu qui suit réutilise le renderer `module` déjà existant, ce n'est pas une seconde API de chargement. [S1]

Depuis 6.1.0, des associations d'instances de modules (comme pour les articles) sont stockées dans `#__associations` avec `context = 'com_modules.item'` ; l'UI admin site les expose, le frontend **ne les joint pas** et n'échange pas le module affiché. [S7]

News Feeds et Tags exposent chacun trois types d'item de menu site, déjà nommés dans le guide. [S13]

Aucun template cœur du tag n'a de dossier `language/` sous le template : si `JPATH_BASE/language/{lang}/tpl_*.ini` existe, l'ini homonyme sous le template n'est jamais chargé (pas de fusion). [S20]

## Modules dans les articles

Le plugin est l'élément `loadmodule`, groupe `content`, classe `Joomla\Plugin\Content\LoadModule\Extension\LoadModule` : manifeste `plugins/content/loadmodule/loadmodule.xml`, code `plugins/content/loadmodule/src/Extension/LoadModule.php`. L'INSERT SQL d'installation le pose `enabled=1`, `ordering` 7, params `{"style":"xhtml"}`.

Un espace est obligatoire après le nom du tag (portes `str_contains` sur `'{loadposition '`, `'{loadmodule '`, `'{loadmoduleid '`, puis regex `/i`). Formes reconnues :

- `{loadposition position[,style]}`
- `{loadmodule type[,title[,style]]}` (`type` = `login` ou `mod_login`, titre découpé par virgules puis `htmlspecialchars_decode`)
- `{loadmoduleid N}` avec `N` = `[1-9][0-9]*` seulement

Chaînes officielles en-GB : `{loadmoduleid 1}`, `{loadposition user1}`, `{loadmodule mod_login}`, `{loadmodule mod_login,module title,style}`. Le guide 6.1 reprend ces trois formes et cite des styles optionnels `html`, `outline`, `table`, `card`, `noCard`. [S2]

Le paramètre plugin `style` (liste XML `none` / `html5` / `table`, défaut manifeste `none`) sert de repli ; `xhtml` est remappé vers `html5`. Sur une install 6.1.3 fraîche les params SQL sont déjà `{"style":"xhtml"}`, donc le fallback réel après get+remap est `html5`, pas `none`. `{loadmoduleid}` ignore ce paramètre et force toujours `none`. Après substitution, le plugin appelle `$document->loadRenderer('module')->render(...)` via `ModuleHelper::getModules` / `getModule` / `getModuleById`. [S3]

L'insertion depuis l'éditeur n'est pas ce plugin : `plg_editors-xtd_module` ouvre la modale `com_modules`. Le template `administrator/components/com_modules/tmpl/modules/modal.php` n'écrit que `data-html="{loadmoduleid ID}"` (bouton titre) et `data-html="{loadposition position}"` (bouton position), **jamais** `{loadmodule}`. Le bouton est absent des modules Custom. [S4]

Les modules inclus ne sont pas lus hors liste : `getModules` / `getModule` / `getModuleById` ne voient que `ModuleHelper::load()` (publié, extension enabled, client, ACL, dates, assignation menu, langue). Un module non assigné à la page courante, ou exclu, ne s'affiche pas malgré le shortcode. Le guide exige l'assignation à All menu items et note que, si Content - Load Modules est désactivé, le texte `{loadposition ...}` reste visible. [S5]

Client API : retour immédiat, tags non développés ; contexte `com_finder.indexer` : macros retirées sans rendu. [S6]

## Associations de modules depuis 6.1.0

`ModuleModel::$associationsContext = 'com_modules.item'` (`@since 6.1.0`). `save()` délègue au parent `AdminModel` : si le contexte est défini, `Associations::isEnabled()` est vrai et `$data['associations']` n'est pas vide, les anciennes lignes `#__associations` de ce contexte sont supprimées puis des lignes `(id, context, key)` sont insérées, `id` = identifiant du module, `key = md5(json_encode($associations))` ; l'élément courant est ajouté si `language !== '*'`. Un module en langue `*` qui porte des associations déclenche un avertissement.

L'UI n'expose les associations que pour les modules site (`client_id = 0`) : onglet Associations (fieldset `item_associations`, un champ `type=modal_module` par langue de contenu), colonne Association dans la liste, bouton toolbar `JTOOLBAR_ASSOCIATIONS`. `ModulesComponent` implémente `AssociationServiceInterface` ; `AssociationsHelper` (`@since 6.1.0`) déclare `$itemTypes = ['module']` et la table `#__modules`. [S8]

Tout cela est conditionné par le multilinguisme et le plugin System - Language Filter, paramètre `item_associations` (défaut 1). `Associations::isEnabled()` est le garde-fou partagé. [S9]

Au rendu site, l'association **n'échange pas** le module affiché : `ModuleHelper::getModuleList()` filtre `#__modules.language` (langue courante ou `*`) quand le language filter est actif, **sans JOIN** `#__associations`. Les `rel=alternate` se construisent depuis les associations de menus ou du composant courant, pas des modules. Chaque instance reste une ligne `#__modules` indépendante. [S10]

Livré par le PR **#46671** (mergé le 23 janvier 2026, jalon 6.1.0, label Documentation Required). L'annonce « Joomla 6.1 is here! » du 14 avril 2026 la décrit comme l'association d'instances de modules entre langues, comme les articles. [S11] Le guide utilisateur (Multilingual Associations) **n'enseigne pas encore** ce type : il liste Content, Contacts, Menus, News Feeds, Others, pas les modules. [S12]

`ModuleModel::delete()` surcharge le parent sans le nettoyage `#__associations` : des orphelins de contexte `com_modules.item` sont possibles (non vérifiés en base réelle).

## Types de menu News Feeds et Tags

Le frontend `components/com_newsfeeds/tmpl` ne contient que `categories/`, `category/` et `newsfeed/`, chacun un seul XML public `default.xml`. Pour Tags, `tmpl` n'a que `tag/` et `tags/` : se limiter aux `default.xml` ne donne que deux types ; le troisième est `tag/list.xml`. `MenutypesModel` n'ajoute `layout` à la requête que si le fichier n'est pas `default.xml`. [S15]

| Famille | View | Fichier | Titre en-GB |
| ------- | ---- | ------- | ----------- |
| News Feeds | `categories` | `components/com_newsfeeds/tmpl/categories/default.xml` | List All Categories in a News Feed Category Tree |
| News Feeds | `category` | `components/com_newsfeeds/tmpl/category/default.xml` | List News Feeds in a Category |
| News Feeds | `newsfeed` | `components/com_newsfeeds/tmpl/newsfeed/default.xml` | Single News Feed |
| Tags | `tag` | `components/com_tags/tmpl/tag/default.xml` | Tagged Items |
| Tags | `tags` | `components/com_tags/tmpl/tags/default.xml` | List All Tags |
| Tags | `tag` | `components/com_tags/tmpl/tag/list.xml` (layout `list`) | Compact List of Tagged Items |

La page guide Menu Item Types nomme déjà ces six titres. [S16] Les tmpl administrator n'ajoutent pas de type frontend. [S18]

`com_tags.sys.ini` définit encore `COM_TAGS_TAGS_VIEW_COMPACT_TITLE` et `COM_TAGS_TAG_VIEW_LIST_TITLE` sans XML correspondant sous `components/com_tags/tmpl` au tag 6.1.3.

## Overlay langue des templates cœur

Au tag 6.1.3, `administrator/templates/atum/language/` n'existe pas. [S19] Même constat pour `templates/cassiopeia_extended/language`, `templates/system/language`, `administrator/templates/system/language` ; `installation/template` n'en a pas non plus.

Les chaînes Atum sont dans `administrator/language/en-GB/tpl_atum.ini` et `tpl_atum.sys.ini`. Le manifeste cite `<languages folder="language">` (copie d'installation), pas un overlay runtime. [S21]

`Language::load()` s'arrête au premier parse non vide. Un appel ne prend qu'un seul `$basePath`. [S22]

Pour le template courant, `HtmlDocument::_fetchTemplate` fait `load('tpl_' . $template, JPATH_BASE) || load(..., $directory . '/' . $template)`. Si le premier réussit, le second opérande n'est pas évalué : **pas de merge**. [S23] Atum n'a pas d'overlay : seul `JPATH_BASE` est chargé. La branche inherit inverse l'ordre puis recharge l'enfant ; aucun enfant Atum n'est livré au tag. `cassiopeia_extended` a `<parent>cassiopeia</parent>`, pas de dossier `language/`, et `tpl_cassiopeia_extended.ini` est 404. [S24]

## Pièges

- Portes `str_contains` sensibles à la casse malgré les regex `/i`.
- Le guide montre `{loadmodule mod_login Login 2}` sans virgules alors que le parseur fait `explode(',')` : il faut `{loadmodule mod_login,Login 2[,style]}`.
- `{loadmodule}` sans titre = première instance du type ; la modale n'insère jamais cette forme.
- Nest dans Custom : `mod_custom.xml` a `prepare_content` default `0` (le Dispatcher ne prépare que si ce paramètre est vrai).
- Guide « style omis = none » vs install SQL `xhtml` vers `html5`.
- `{loadmoduleid}` force toujours le chrome `none`.
- Module langue `*` + associations : avertissement à l'enregistrement ; associations sans effet de substitution au rendu site.
- Guide Multilingual Associations : pas de type Modules alors que le code 6.1.0 l'a.

## Glossaire de ce passage

| Nom | Rôle | Type |
| --- | ---- | ---- |
| `plg_content_loadmodule` | Parse et remplace les trois balises sur `onContentPrepare` | API stable |
| `plg_editors-xtd_module` | Bouton éditeur ; n'insère que `{loadmoduleid}` et `{loadposition}` | API stable |
| `associationsContext` | `'com_modules.item'` ; clé = MD5 du JSON des ids | API stable (`@since 6.1.0`) |
| `Associations::isEnabled()` | Multilingue + Item Associations du Language Filter | API stable |
| `HtmlDocument::_fetchTemplate` | `tpl_*` depuis `JPATH_BASE` puis, en échec seulement, dossier template (`\|\|`, pas de fusion) | détail interne |
| `MenutypesModel` | Inventaire des types de menu depuis les XML de layout | détail interne |

## Lacunes restantes de ce passage

- Aucune page guide ou manuel 6.1 n'explique les associations de modules (PR #46671 Documentation Required) : enseigner depuis le code + l'annonce, pas depuis le guide.
- Manuel Content Events : `onContentPrepare` sans ces trois balises.
- Sémantique runtime propagate/clear des champs `modal_module` : attributs XML recensés, UI non exécutée.
- Titres de menu vérifiés en en-GB seulement.
- `ModuleModel::delete()` et orphelins `#__associations` : non vérifiés en base réelle.
