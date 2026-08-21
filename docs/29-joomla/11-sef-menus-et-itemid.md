---
tags:
  - Joomla
  - Intermédiaire
  - Concept
description: "SiteRouter au-delà de parse, options sef / sef_rewrite / sef_suffix, Itemid = #__menu.id, 404 depuis 4.0, types News Feeds et Tags."
estimated_time: "40 min"
fiche_number: 11
total_fiches: 24
cursus: "Joomla CMS"
id: "web.joomla.sef-menus-et-itemid"
course_id: "web.joomla"
content_type: "lesson"
order: 11
---

# 11 - SEF, menus et Itemid

> **En bref** : Les URLs conviviales passent par `SiteRouter` (SSL, SEF parse/build, rewrite) ; `Itemid` est `#__menu.id` ; un reste de chemin est une 404 depuis Joomla 4.0. Lecture estimée : 40 min.

## Prérequis

- Fiche [03 - Template enfant Cassiopeia](03-template-enfant-cassiopeia.md)
- Fiche [08 - ACL : authorise et view levels](08-acl-authorise-et-view-levels.md)
- Fiche [10 - Scheduler : Lazy et Web Cron](10-scheduler-lazy-et-webcron.md)
- Un serveur Apache capable de lire un fichier `.htaccess` (pour `sef_rewrite`)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras activer `sef` / `sef_rewrite` / `sef_suffix`, renommer `htaccess.txt` en `.htaccess`, expliquer le rôle de `Itemid`, et nommer les trois types de menu News Feeds et les trois types Tags (dont Compact List = `tag/list.xml`).

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que `SiteRouter` au-delà de `parse()` ?

**Définition** : `SiteRouter` (`libraries/src/Router/SiteRouter.php`) n'est pas qu'un appel `parse()`. Il attache, dans le pipeline site :

- SSL
- initialisation
- SEF **parse** et **build**
- pagination
- rewrite
- base path

Le routeur **de composant** vient de `RouterServiceInterface::createRouter()`, ou de `RouterLegacy` si le composant n'expose pas ce service. `build()` appelle `preprocess()` **puis** `build()`.

**Le problème que ce pipeline résout** :

Sans `build()`, les liens restent en query string. Sans `parse()`, l'URL conviviale ne redevient pas `option` / `view` / `Itemid`. Sans rewrite, `index.php/` reste visible. `RouterLegacy` sert un composant sans `createRouter()`.

Côté site, `doExecute()` fait `initialiseApp()`, `route()` (`parse`, `onAfterRoute`, autorisation `Itemid`), puis `dispatch()`. Flux **observé dans le code**, pas un contrat d'API publié.

**Analogie concrète** : Un standard. `parse` = « 2042 = Comptabilité, ligne 22 ». `build` = l'inverse. SSL, rewrite et pagination sont d'autres manettes du **même** standard.

**Ce que `SiteRouter` n'est PAS** :

- Ce n'est pas seulement `parse()`. Les fiches qui s'arrêtent à `parse()` laissent SSL, build, pagination et rewrite hors champ.
- Ce n'est pas le routeur admin. Cette fiche couvre le site.

---

### `sef`, `sef_rewrite`, `sef_suffix` et `htaccess.txt`

**Définition** : Trois options site (Configuration globale, onglet Site) commandent les URLs conviviales.

| Option | Effet |
| ------ | ----- |
| `sef` | Active les Search Engine Friendly URLs |
| `sef_rewrite` | Réécriture : retire `index.php/` de l'URL, **à condition** que le serveur applique les règles |
| `sef_suffix` | Ajoute un suffixe (`.html`) aux URLs |

Le CMS livre `htaccess.txt` à la racine. Pour Apache, tu le **renommes** en `.htaccess`.

**Le problème que ces trois options résolvent** :

Sans `sef`, query string. Avec `sef` sans rewrite : `/index.php/alias`. Avec rewrite **sans** `.htaccess` : 404 ou `index.php` encore visible.

**Analogie concrète** : `sef` = nom de salle au lieu d'un numéro de dossier. `sef_rewrite` = tu enlèves « bâtiment A / » **si** Apache a collé `.htaccess`. `sef_suffix` = tu ajoutes « .html ».

**Ce que `sef_rewrite` n'est PAS** : sans renommer `htaccess.txt`, l'option seule ne crée pas `.htaccess`. `htaccess.txt` cible Apache ; cette fiche n'invente pas un `try_files` Nginx.

---

### `Itemid` = `#__menu.id`

**Définition** : `Itemid` est l'entier **`#__menu.id`**. Ce n'est pas l'id d'un article.

Après routage, `SiteApplication` lit `Itemid` et appelle `authorise($Itemid)` : redirection vers le login, ou 403 / accueil, selon le cas. Le même entier :

- sélectionne les modules (`ModuleHelper::getModuleList` lie `:itemId`) ;
- entre dans la clé de cache callback `com_modules` (`groups.clientId.itemId`) ;
- suffixe le cache par module (`cachemode` `itemid` par défaut) ;
- devient la classe body Cassiopeia `itemid-{Itemid}`.

**Le problème que `Itemid` résout** :

Sans item de menu, Joomla ne sait pas **quelle page** tu visites pour l'ACL, les modules et le cache. Deux articles peuvent partager un composant et diverger de modules dès que l'Itemid change (ACL `authorise($Itemid)`, `#__modules_menu`, clé de cache, classe `itemid-101`).

**Analogie concrète** : Le numéro de table (`#__menu.id`) commande l'addition, les plats et le set, pas le nom du plat (id article).

**Ce que `Itemid` n'est PAS** :

- Ce n'est pas `id` de `com_content`.
- Ce n'est pas optionnel pour l'autorisation de page : après `parse`, l'application s'en sert.

Le guide 6.1 dénombre plus de 30 types d'items frontend cœur (36 comptés), issus d'environ 10 composants. `#__menu.type` est documenté : Component, URL, Alias ou Separator. Un item Single Article vient de `components/com_content/tmpl/article/default.xml`.

---

### Reste de chemin = 404 depuis 4.0

**Définition** : `parseSefRoute()` exige, si le filtre de langue est actif, un item `*` **ou** la balise de langue courante. Si un **reste de chemin** n'est pas consommé, le `Router` parent lève `RouteNotFoundException` (`JERROR_PAGE_NOT_FOUND`). Ce comportement date de **Joomla 4.0**.

**Le problème que cette 404 résout** :

En 3.x, un suffixe non reconnu pouvait encore afficher une page « à peu près ». Depuis 4.0 : **page introuvable**, pas une approximation.

**Analogie concrète** : Un code d'immeuble n'accepte plus un chiffre en trop. Avant, le gardien ouvrait parfois la porte « à peu près ». Maintenant, un reste de code = accès refusé, pas le palier du voisin.

**Ce que cette 404 n'est PAS** :

- Ce n'est pas propre à J6 : c'est en place depuis 4.0.
- Ce n'est pas le seul 404 langue. Un item menu `*` vers un article **ensuite associé** peut 404 au changement de langue (guide de setup). Le `*` passe `parseSefRoute` ; l'article associé, non. Détail repris dans la fiche multilangue.

---

### Types News Feeds (3 XML) et Tags (3, dont Compact List)

**Définition** : News Feeds et Tags exposent **chacun trois** types d'item de menu site. Les titres en-GB viennent des XML de layout. `MenutypesModel` n'ajoute `layout` à la requête que si le fichier **n'est pas** `default.xml`.

| Famille | View | Fichier | Titre en-GB |
| ------- | ---- | ------- | ----------- |
| News Feeds | `categories` | `components/com_newsfeeds/tmpl/categories/default.xml` | List All Catégories in a News Feed Category Tree |
| News Feeds | `category` | `components/com_newsfeeds/tmpl/category/default.xml` | List News Feeds in a Category |
| News Feeds | `newsfeed` | `components/com_newsfeeds/tmpl/newsfeed/default.xml` | Single News Feed |
| Tags | `tag` | `components/com_tags/tmpl/tag/default.xml` | Tagged Items |
| Tags | `tags` | `components/com_tags/tmpl/tags/default.xml` | List All Tags |
| Tags | `tag` | `components/com_tags/tmpl/tag/list.xml` (layout `list`) | Compact List of Tagged Items |

Si tu ne listes que les `default.xml` de Tags, tu n'as **que deux** types. Le troisième est **`tag/list.xml`**, titre **Compact List of Tagged Items**.

**Le problème que ces XML résolvent** :

Le guide dit « 3 » pour chaque famille sans lister les vues. Sans `list.xml`, Compact List disparaît de l'inventaire.

**Analogie concrète** : Un menu de restaurant annonce « 3 desserts ». Si tu ne comptes que les fiches intitulées « default », tu rates la tarte qui s'appelle « list ». Le troisième dessert est bien là, sous un autre nom de fichier.

**Ce que ces six types ne sont PAS** :

- Ce n'est pas des types administrator : les tmpl admin n'ajoutent pas de type frontend.
- `COM_TAGS_TAGS_VIEW_COMPACT_TITLE` et `COM_TAGS_TAG_VIEW_LIST_TITLE` existent encore dans `com_tags.sys.ini` **sans** XML correspondant sous `components/com_tags/tmpl` au tag 6.1.3. Ne pas inventer un quatrième type frontend à partir de ces chaînes.

---

## Étapes Pratiques

### Étape 1 : Activer SEF et préparer `.htaccess`

1. Configuration globale, onglet Site : `sef` = Oui.
2. À la racine du site, copie ou renomme `htaccess.txt` vers `.htaccess`.
3. `sef_rewrite` = Oui.
4. (Option) `sef_suffix` = Oui si tu veux le suffixe `.html`.

**Résultat attendu** :

```text
Une URL d'article ressemble à /alias-de-menu/alias-article
sans index.php/ dès que rewrite + .htaccess fonctionnent.
```

Si `index.php/` reste visible : `.htaccess` absent ou Apache n'applique pas `AllowOverride`.

---

### Étape 2 : Relier une URL à un `Itemid`

1. Ouvre **Menus** vers un menu site. Note l'**id** d'un item (colonne id = `#__menu.id`).
2. Ouvre la page correspondante en frontend.
3. Inspecte le `<body>` Cassiopeia.

**Résultat attendu** :

```text
<body class="... itemid-101 ...">
si l'item de menu a l'id 101.
Les modules de cette page suivent cet Itemid (fiche 12).
```

---

### Étape 3 : Produire une 404 par reste de chemin

Avec SEF actif, ajoute un segment inventé après une URL d'article valide.

**Résultat attendu** :

```text
Page 404 (RouteNotFoundException / JERROR_PAGE_NOT_FOUND).
Comportement en place depuis Joomla 4.0 : le reste de chemin n'est pas ignoré.
```

---

### Étape 4 : Créer un item Compact List of Tagged Items

1. **Menus** vers **Nouvel item**.
2. Type : **Tags** vers **Compact List of Tagged Items**.
3. Vérifie que ce n'est pas le même type que **Tagged Items**.

**Résultat attendu** :

```text
Le type Compact List correspond à tag/list.xml (layout list),
pas à tag/default.xml.
News Feeds propose bien trois types : tree de catégories, liste de catégorie, fil unique.
```

---

## Commandes Utiles

| Action | Effet |
| ------ | ----- |
| `sef` = Oui | URLs conviviales |
| `htaccess.txt` renommé en `.htaccess` | Règles Apache disponibles |
| `sef_rewrite` = Oui | Retrait de `index.php/` |
| `sef_suffix` = Oui | Suffixe `.html` |
| Lire `#__menu.id` | Valeur de `Itemid` |

---

## Pièges Fréquents

### Piège 1 : `sef_rewrite` sans `.htaccess`

⚠️ **Problème** : `htaccess.txt` n'est pas lu par Apache sous ce nom.

✅ **Solution** : Renommer en `.htaccess` à la racine **avant** de cocher rewrite.

---

### Piège 2 : Confondre `Itemid` et id d'article

⚠️ **Problème** : Tu caches des modules « pour l'article 22 » alors que l'Itemid est 101.

✅ **Solution** : `Itemid` = `#__menu.id`. L'id article est un autre paramètre. La classe body est `itemid-{Itemid}`.

---

### Piège 3 : Un reste d'URL « à peu près »

⚠️ **Problème** : Tu ajoutes `/foo` après un alias et tu attends la même page qu'en J3.

✅ **Solution** : Depuis 4.0, reste de chemin = 404.

---

### Piège 4 : Compter seulement deux types Tags

⚠️ **Problème** : Tu ouvres `tmpl/tag/default.xml` et `tmpl/tags/default.xml`. Compact List manque.

✅ **Solution** : Le troisième fichier est `components/com_tags/tmpl/tag/list.xml`. `MenutypesModel` ajoute `layout` parce que le fichier n'est pas `default.xml`.

---

### Piège 5 : S'arrêter à `parse()`

⚠️ **Problème** : Tes liens générés (`build`) ou le rewrite te semblent « hors routeur ».

✅ **Solution** : `SiteRouter` attache aussi SSL, init, build (`preprocess` puis `build`), pagination, rewrite et base path.

---

## Checklist de Validation

- [ ] Je situe `SiteRouter` au-delà de `parse()` (SSL, build, rewrite, pagination)
- [ ] Je distingue `sef`, `sef_rewrite`, `sef_suffix`
- [ ] Je renomme `htaccess.txt` en `.htaccess` pour Apache
- [ ] Je définis `Itemid` comme `#__menu.id`
- [ ] Je sais qu'un reste de chemin est une 404 depuis 4.0
- [ ] Je nomme 3 types News Feeds et 3 types Tags, Compact List = `tag/list.xml`

---

## Exercice Pratique

**Énoncé** : Un site 6.1.3 a `sef` = Oui, `sef_rewrite` = Oui, mais `htaccess.txt` n'a pas été renommé. Un intégrateur cherche le type de menu « Compact List of Tagged Items » uniquement sous `tag/default.xml`. Un testeur ajoute `/extra` à une URL d'article et s'étonne de la 404. Un rédacteur parle de l'Itemid 22 parce que l'article a l'id 22 ; l'item de menu a l'id 101.

Corrige les quatre points. Donne le fichier XML exact de Compact List et les trois vues News Feeds.

**Indications** :

- `Itemid` = `#__menu.id`.
- 404 depuis 4.0, pas une nouveauté 6.x.

**Résultat attendu** : Quatre corrections + XML Compact List + 3 vues News Feeds.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

1. **Rewrite** : renommer `htaccess.txt` en `.htaccess`. `sef_rewrite` sans ce fichier laisse `index.php/` ou produit des 404 serveur.

2. **Compact List** : fichier `components/com_tags/tmpl/tag/list.xml` (layout `list`), pas `tag/default.xml` (Tagged Items).

3. **`/extra`** : reste de chemin non consommé = `RouteNotFoundException` / 404 **depuis 4.0**.

4. **Itemid** : **101** (`#__menu.id`), pas 22 (id article). Classe body `itemid-101`. ACL page, modules et cache suivent 101.

**News Feeds** : `categories` (List All Catégories in a News Feed Category Tree), `category` (List News Feeds in a Category), `newsfeed` (Single News Feed).

---

## Navigation

← Fiche précédente : **[Scheduler : Lazy et Web Cron](10-scheduler-lazy-et-webcron.md)**

→ Fiche suivante : **[Modules, chrome et loadmodule](12-modules-chrome-et-loadmodule.md)**
