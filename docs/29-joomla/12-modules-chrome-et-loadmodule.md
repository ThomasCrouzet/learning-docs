---
tags:
  - Joomla
  - Intermédiaire
  - Pratique
description: "Affectation #__modules_menu (0/1/-1), rendu bootModule vers dispatcher vers chrome, et balises {loadmodule} / {loadposition} / {loadmoduleid}."
estimated_time: "40 min"
fiche_number: 12
total_fiches: 24
cursus: "Joomla CMS"
id: "web.joomla.modules-chrome-et-loadmodule"
course_id: "web.joomla"
content_type: "lesson"
order: 12
---

# 12 - Modules, chrome et loadmodule

> **En bref** : Un module s'affiche si `#__modules_menu` correspond à l'Itemid, s'il est rendu par `bootModule` puis le chrome, et si une balise `{loadmodule}` dans un article a bien un espace et des virgules. Lecture estimée : 40 min.

## Prérequis

- Fiche [03 - Template enfant Cassiopeia](03-template-enfant-cassiopeia.md) (positions `jdoc`)
- Fiche [11 - SEF, menus et Itemid](11-sef-menus-et-itemid.md) (`Itemid` = `#__menu.id`)
- Plugin **Content - Load Modules** (`plg_content_loadmodule`) présent (livré `enabled=1`)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras lire l'affectation pages (`0` / ids / ids négatifs), suivre le rendu `bootModule` vers dispatcher vers chrome, écrire les trois balises avec un **espace obligatoire**, et ne pas attendre que les associations de modules 6.1.0 changent le HTML frontend.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que `#__modules_menu` ?

**Définition** : L'affectation d'un module aux pages **n'est pas** dans `#__modules`. Elle est dans `#__modules_menu`, clé primaire `(moduleid, menuid)`.

| Mode UI | Valeur `assignment` | Colonne `menuid` |
| ------- | ------------------- | ---------------- |
| On all pages | 0 | `0` |
| No pages | liste vide / non numérique | aucune ligne |
| Only on the pages selected | 1 | ids **positifs** (`#__menu.id`) |
| On all pages except those selected | -1 | ids **négatifs** |

`ModuleHelper::getModuleList` garde les lignes où `menuid = Itemid` **ou** `menuid <= 0`. Ensuite `cleanModuleList` **exclut** `menuid === -Itemid`.

**Le problème que cette table résout** :

Sans elle, un module publié dans `sidebar-right` apparaîtrait sur **toutes** les pages qui ont ce `jdoc`.

**Comment filtrer concrètement** :

| Tu veux | Ligne `#__modules_menu` |
| ------- | ----------------------- |
| Partout | `menuid = 0` |
| Seulement l'item 101 | `menuid = 101` |
| Partout **sauf** l'item 101 | `menuid = -101` |
| Nulle part | aucune ligne |

Position et publication sont **d'autres** contrôles : `#__modules.published`, `publish_up` / `publish_down`, access, extension `enabled`. `getModuleList` **n'a pas** de prédicat sur le nom de position. La position est le slot Cassiopeia du `jdoc` (`sidebar-right`, `menu`, …).

**Analogie concrète** : Le plat est prêt (`published=1`). L'étiquette de table (`#__modules_menu`) dit « toutes », « 101 seulement » ou « toutes sauf 101 ». Le `jdoc` est le plateau, pas l'étiquette.

**Ce que `#__modules_menu` n'est PAS** : ce n'est pas la colonne position. `menuid = 0` = **toutes** les pages, pas « aucune ».

Module invisible malgré une position : `published`, dates, access, extension disabled, ou `menuid === -Itemid`.

---

### `bootModule` vers dispatcher vers chrome

**Définition** : Le rendu site d'un module 6.x suit une chaîne fixe.

1. `HtmlDocument` parse les `jdoc` `module` / `modules`.
2. `ModulesRenderer` appelle un `ModuleRenderer` par module de la position.
3. `ModuleHelper::renderRawModule` fait :

```php
$app->bootModule($name, $appName)->getDispatcher($mod, $app)->dispatch();
```

1. Le **chrome** enveloppe ensuite le HTML brut.

`AbstractModuleDispatcher::dispatch` (depuis 4.0.0) : `loadLanguage`, `getLayoutData`, `require getLayoutPath`. Sans dispatcher namespacé, `ModuleDispatcherFactory` instancie `ModuleDispatcher`, qui inclut `modules/mod_*/mod_*.php`.

**Chromes** système : `html5.php`, `none.php`, `outline.php`, `table.php`. Cassiopeia : `card.php`, `noCard.php`. Sidebars Cassiopeia = `style="card"` ; menu / topbar / footer / debug = `none`. `params.style` peut forcer `Template-chromeName`. `tp=1` ajoute `outline`. `ChromestyleField` liste inherit (`0`) puis les options groupées Template-style.

**Le problème que cette chaîne résout** :

Sans dispatcher, un module 6 namespacé n'a pas d'entrée. Sans chrome, pas d'enveloppe titre / `<div>`. Sans `jdoc`, nulle part où s'insérer.

**Analogie concrète** : `bootModule` = sortir le plat ; `dispatch` = le cuisiner ; chrome = le dresser (`card` ou `none`).

**Ce que le chrome n'est PAS** : ce n'est pas l'affectation pages, ni une seconde API `{loadmodule}` (même renderer `module`).

Ne pas enseigner comme 6.1.3 les options module marquées « [New in 6.2] » sur le guide Login Form.

---

### `plg_content_loadmodule` : trois balises, espace obligatoire

**Définition** : Les balises dans un article sont développées **uniquement** par le plugin cœur `plg_content_loadmodule` (groupe `content`), abonné à `onContentPrepare`. Classe : `Joomla\Plugin\Content\LoadModule\Extension\LoadModule`.

À l'install : `enabled=1`, `ordering` 7, params `{"style":"xhtml"}`.

Un **espace** est obligatoire après le nom du tag. Les portes PHP sont des `str_contains` sur `'{loadposition '`, `'{loadmodule '`, `'{loadmoduleid '` (sensibles à la casse), puis une regex `/i`. **Sans espace**, la porte échoue.

Formes reconnues :

- `{loadposition position[,style]}`
- `{loadmodule type[,title[,style]]}` (`type` = `login` ou `mod_login` ; titre découpé par **virgules**, puis `htmlspecialchars_decode`)
- `{loadmoduleid N}` avec `N` = `[1-9][0-9]*` seulement

Chaînes en-GB : `{loadmoduleid 1}`, `{loadposition user1}`, `{loadmodule mod_login}`, `{loadmodule mod_login,module title,style}`.

Le paramètre plugin `style` (liste XML `none` / `html5` / `table`, défaut manifeste `none`) sert de **repli**. `xhtml` est remappé vers `html5`. Sur une install 6.1.3 fraîche, les params SQL sont déjà `{"style":"xhtml"}` : le fallback réel après get+remap est **`html5`**, pas `none`. `{loadmoduleid}` **ignore** ce paramètre et force toujours `none`.

Après substitution, le plugin appelle `$document->loadRenderer('module')->render(...)` via `ModuleHelper::getModules` / `getModule` / `getModuleById`. Ces helpers ne voient que `ModuleHelper::load()` : publié, extension enabled, client, ACL, dates, **assignation menu**, langue. Un module **non assigné à la page courante**, ou exclu, **ne s'affiche pas** malgré le shortcode. Le guide demande l'assignation **All menu items**. Si le plugin est désactivé, le texte `{loadposition ...}` **reste visible**.

**Le problème que ces balises résolvent** :

Un article a besoin d'un module **dans le corps**, pas seulement dans un `jdoc`.

**Analogie concrète** : La mention « insérer l'encadré Login » n'est reconnue que s'il y a **un espace** après le mot magique, et des **virgules** entre type, titre et style.

**Ce que ces balises ne sont PAS** : `{loadmodule mod_login Login 2}` **sans virgules** (extrait de guide) échoue (`explode(',')`). Sans titre = **première** instance du type. Client API : tags non développés. Indexer Finder : macros retirées sans rendu.

---

### La modale n'insère jamais `{loadmodule}`

**Définition** : Le bouton éditeur n'est **pas** `plg_content_loadmodule`. C'est `plg_editors-xtd_module`, qui ouvre la modale `com_modules`.

Le template `administrator/components/com_modules/tmpl/modules/modal.php` n'écrit que `data-html="{loadmoduleid ID}"` (titre) et `data-html="{loadposition position}"`. **Jamais** `{loadmodule}`. Bouton **absent** des modules Custom.

**Le problème que cette distinction résout** :

Après le bouton tu trouves `{loadmoduleid 42}` ou `{loadposition ...}`, jamais `{loadmodule type,titre}`. Ce n'est pas un bug.

**Analogie concrète** : Un tampon encreur n'imprime que deux formules. La troisième formule existe dans le règlement, mais le tampon ne la porte pas. Tu l'écris à la main si tu en as besoin.

**Ce que la modale n'est PAS** : ce n'est pas un second parseur. Une fois collé, `plg_content_loadmodule` remplace au `onContentPrepare`.

Dans Custom, `prepare_content` vaut **0** par défaut : un `{loadmodule}` imbriqué ne tourne pas tant que Prepare Content n'est pas activé.

---

### Associations de modules 6.1.0 : stockées, pas substituées en frontend

**Définition** : Depuis **6.1.0** (`@since`), `ModuleModel::$associationsContext = 'com_modules.item'`. Les paires sont dans `#__associations` avec `context = 'com_modules.item'`, `id` = identifiant du module, `key = md5(json_encode($associations))`.

L'UI admin (modules **site**, `client_id = 0`) expose un onglet Associations, une colonne, un bouton toolbar. Condition : multilinguisme + plugin System - Language Filter, paramètre `item_associations` (défaut 1). `Associations::isEnabled()` est le garde-fou.

**Au rendu site, l'association n'échange pas le module affiché.** `ModuleHelper::getModuleList()` filtre `#__modules.language` (langue courante ou `*`) **sans JOIN** `#__associations`. Les `rel=alternate` viennent des associations de **menus** ou du **composant** courant, pas des modules. Chaque instance reste une ligne `#__modules` indépendante.

Le guide Associations **n'enseigne pas encore** ce type. L'annonce 6.1 le décrit comme pour les articles. Un module `*` avec associations déclenche un **avertissement** à l'enregistrement.

**Le problème que cette absence de substitution pose** :

Tu associes FR et EN et tu attends un remplacement au switch, comme un article. Ça n'arrive pas. Il faut un module par langue (ou `*`) plus l'affectation pages.

**Analogie concrète** : Un trombone dans le classeur admin (`#__associations`). Le frontend **ne lit pas** le trombone.

**Ce que `com_modules.item` n'est PAS** : pas une substitution frontend, pas dans le guide 6.1 (PR #46671 Documentation Required). `ModuleModel::delete()` ne nettoie pas `#__associations` (orphelins possibles, non vérifiés en base réelle).

---

## Étapes Pratiques

### Étape 1 : Affecter un module à une seule page

1. Crée ou ouvre un module site, position `sidebar-right`.
2. Onglet Menu Assignment : **Only on the pages selected**, coche un item dont l'id est 101.
3. Enregistre.

**Résultat attendu** : une ligne `#__modules_menu` `(moduleid, 101)` ; absent ailleurs. Pour exclure 101 : `menuid = -101` (`cleanModuleList`).

---

### Étape 2 : Chrome et balises dans un article

Dans Cassiopeia, `sidebar-right` a `style="card"` ; menu / topbar / footer / debug ont `style="none"`.

Plugin **Content - Load Modules** activé. Module assigné à **Toutes les pages de menu**. Dans le corps :

```text
{loadmoduleid 1}
{loadposition sidebar-right}
{loadmodule mod_login,Login Form,none}
```

**Résultat attendu** : HTML du renderer module ; `{loadmoduleid}` en chrome `none`. Sans espace (`{loadmoduleid1}`) : aucun remplacement.

---

### Étape 3 : Vérifier ce que la modale colle

Bouton Module de l'éditeur : titre puis position.

**Résultat attendu** : `{loadmoduleid N}` ou `{loadposition nom}`. Jamais `{loadmodule}`. Pas de bouton sur un module Custom.

---

## Commandes Utiles

| Balise / table | Action |
| -------------- | ------ |
| `{loadposition position[,style]}` | Tous les modules d'une position (espace obligatoire) |
| `{loadmodule type[,title[,style]]}` | Une instance par type et titre, **virgules** |
| `{loadmoduleid N}` | Instance d'id N, chrome **none** forcé |
| `#__modules_menu.menuid = 0` | Toutes les pages |
| `#__modules_menu.menuid = 101` | Page 101 seulement |
| `#__modules_menu.menuid = -101` | Toutes sauf 101 |
| `#__associations` `context='com_modules.item'` | Paires admin 6.1.0, **sans** substitution frontend |

---

## Pièges Fréquents

### Piège 1 : Oublier l'espace dans la balise

⚠️ **Problème** : `{loadmoduleid1}` ou `{loadmodulemod_login}` : sans espace, `str_contains` échoue. Le texte brut reste.

✅ **Solution** : `{loadmoduleid 1}`, `{loadmodule mod_login}`, `{loadposition user1}`. Espace **obligatoire**.

---

### Piège 2 : Titre sans virgule

⚠️ **Problème** : `{loadmodule mod_login Login 2}` comme dans un extrait de guide. `explode(',')` ne sépare pas le titre.

✅ **Solution** : `{loadmodule mod_login,Login 2}` ou `{loadmodule mod_login,Login 2,html5}`.

---

### Piège 3 : Shortcode sans assignation All pages

⚠️ **Problème** : Le module n'est assigné qu'à un autre Itemid. `getModule` ne le voit pas. Balise remplacée par vide.

✅ **Solution** : Assigner à **On all pages** (`menuid = 0`) pour un module chargé dans un article.

---

### Piège 4 : Attendre `{loadmodule}` depuis la modale

⚠️ **Problème** : La modale n'écrit **jamais** `{loadmodule}`.

✅ **Solution** : Saisir `{loadmodule ...}` à la main, ou accepter `{loadmoduleid}` / `{loadposition}`.

---

### Piège 5 : Croire que l'association 6.1.0 permute le module en frontend

⚠️ **Problème** : FR/EN associés dans l'admin, le frontend montre encore le module de la langue filtrée (ou `*`), sans JOIN `#__associations`.

✅ **Solution** : Publier un module par langue. Traiter `#__associations` `com_modules.item` comme un lien admin, pas une substitution.

---

## Checklist de Validation

- [ ] Je lis `#__modules_menu` : `0` / positif / négatif
- [ ] Je suis `bootModule` vers dispatcher vers chrome
- [ ] Je connais les chromes système et Cassiopeia `card` / `noCard`
- [ ] J'écris les trois balises avec un **espace** et des **virgules**
- [ ] Je sais que la modale n'insère jamais `{loadmodule}`
- [ ] Je sais que les associations modules 6.1.0 ne substituent pas le frontend

---

## Exercice Pratique

**Énoncé** : Sur l'article de l'Itemid 101, tu veux le module Login d'id 8, chrome none, et tous les modules de `sidebar-right`. Un collègue a collé `{loadmodule mod_login Login 2}` et `{loadmoduleid8}`. La modale a collé `{loadmoduleid 8}`. Les modules Login FR et EN sont associés depuis 6.1.0 ; le collègue croit que le switch de langue remplace tout seul le HTML. Login n'est assigné qu'à l'item 55.

Corrige les balises. Dis ce que fait la modale. Dis si l'association permute le frontend. Dis pourquoi Login peut rester invisible sur 101.

**Indications** :

- Espace, virgules, `menuid`.
- `{loadmoduleid}` force `none`.

**Résultat attendu** : Balises valides + trois phrases (modale, associations, assignation).

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Balises valides** :

```text
{loadmoduleid 8}
{loadposition sidebar-right}
{loadmodule mod_login,Login 2,none}
```

`{loadmoduleid8}` : espace manquant, porte `str_contains` échoue. `{loadmodule mod_login Login 2}` : virgule manquante.

**Modale** : elle a collé `{loadmoduleid 8}` ; elle n'insère **jamais** `{loadmodule}`. `{loadmoduleid}` force le chrome `none`.

**Associations** : lignes `#__associations` `context='com_modules.item'` depuis 6.1.0. **Pas** de JOIN au rendu site. Le switch de langue **ne remplace pas** le module. Il faut un module par langue (ou `*`) + filtre de langue.

**Invisible sur 101** : `#__modules_menu` n'a que `menuid = 55`. `getModuleList` / `getModuleById` ignorent le module. Passer à **On all pages** (`menuid = 0`) pour un chargement depuis l'article.

---

## Navigation

← Fiche précédente : **[SEF, menus et Itemid](11-sef-menus-et-itemid.md)**

→ Fiche suivante : **[Finder, CLI et absences](13-finder-cli-et-absences.md)**
