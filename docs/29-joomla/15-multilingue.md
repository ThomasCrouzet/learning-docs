---
tags:
  - Joomla
  - Intermédiaire
  - Pratique
description: "Packs UI vs content languages, Language Filter, #__associations, switcher (pack+home+ACL), overrides .override.ini, overlay template ignoré, item * en 404."
estimated_time: "50 min"
fiche_number: 15
total_fiches: 24
cursus: "Joomla CMS"
id: "web.joomla.multilingue"
course_id: "web.joomla"
content_type: "lesson"
order: 15
---

# 15 - Site multilingue

> **En bref** : Tu sépares packs d'interface et content languages, tu actives System - Language Filter avec `#__associations`, tu n'affiches une langue dans le switcher que si pack + accueil + ACL sont réunis, et tu évites le 404 de l'item `*`. Lecture estimée : 50 min.

## Prérequis

- Fiche [08 - ACL : authorise et view levels](08-acl-authorise-et-view-levels.md) : le switcher filtre aussi le niveau d'accès
- Fiche [11 - SEF, menus et Itemid](11-sef-menus-et-itemid.md) : préfixe SEF et item de menu
- Fiche [14 - Champs personnalisés](14-champs-personnalises.md)
- CMS 6.1.3 avec au moins deux packs site installés si tu reproduis le switcher

## Objectif de cette fiche

À la fin de cette fiche, tu sauras publier une content language distincte du pack UI, activer le Language Filter et les associations, expliquer pourquoi le switcher reste vide, et éviter le 404 d'un item All Languages vers un article ensuite associé.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un pack UI vs une content language ?

**Définition** : Joomla 6.1 distingue les **packs d'interface** (`#__extensions`, `type=language`, `enabled=1`, `LanguageHelper::getInstalledLanguages()`) et les **content languages** (`#__languages`). `getLanguages()` ne retient que `published=1` (ordre `ordering`). `getContentLanguages()` part de `#__languages` et, si `$checkInstalled` (défaut vrai), **intersecte** avec les packs site (`client_id` 0).

**Le problème que cette distinction résout** :

Sans elle, voici les problèmes rencontrés :

1. **Pack sans édition** : tu installes fr-FR, le site n'a toujours qu'une content language non publiée.
2. **Édition sans pack** : tu publies une content language dont le pack site manque ; le switcher l'ignore.
3. **Ordre flou** : plusieurs langues publiées sans `ordering` compris.

**Comment le cœur résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Pack sans édition | System vers Install Languages, puis System vers Content Languages (publier / ordonner) |
| Édition sans pack | Intersection pack site + ligne `#__languages` publiée |
| Ordre flou | `ordering` des content languages publiées |

**Analogie concrète** : Installer un clavier français (pack UI) n'imprime pas le journal en français (content language). Tu as besoin des deux : le clavier **et** le numéro du journal publié dans cette langue.

**Ce que cette distinction n'est PAS** :

- Un pack UI n'est pas une content language.
- Publier une content language n'installe pas le pack.
- Le guide Current enchaîne bien les deux écrans ; ce n'est pas un seul bouton.

---

### Qu'est-ce que le Language Filter et `#__associations` ?

**Définition** : Le plugin **System - Language Filter** est le commutateur. `onBeforeExecute` (site) appelle `setLanguageFilter(true)`. `Multilanguage::isEnabled()` lit ce drapeau côté site, le plugin activé côté admin. `Associations::isEnabled()` exige en plus `item_associations` (défaut 1 dans `languagefilter.xml`, `true` en PHP). Les paires sont dans `#__associations`.

**Le problème que le filtre résout** :

Sans filtre ni associations, voici les problèmes rencontrés :

1. **Pas de commutateur** : sans plugin actif, `Multilanguage::isEnabled()` n'est pas vrai côté site.
2. **Silos** : sans `item_associations`, pas de paires dans `#__associations`.
3. **Alias 404** : `parseSefRoute` n'accepte un alias que si le filtre est off, ou si l'item est `*` ou de la langue courante.

Le guide : activer le filtre, Item Associations = Yes, puis Components vers Multilingual Associations (articles, catégories, contacts, items de menu, news feeds). Depuis 6.1.0 les modules site ont aussi un contexte `com_modules.item` en admin ; le frontend **ne joint pas** ces lignes pour échanger le module affiché (fiche [12 - Modules, chrome et loadmodule](12-modules-chrome-et-loadmodule.md)).

`LanguageFilter::parseRule` (`PROCESS_BEFORE`) consomme un préfixe SEF connu (`sefs[]`) ou, si `remove_default_prefix`, pose la langue site de `com_languages` (défaut en-GB). Ensuite `parseSefRoute` n'accepte un alias que si le filtre est off, ou si `item->language === '*'` ou égal au tag courant. Un chemin encore non vide lève `RouteNotFoundException` (`JERROR_PAGE_NOT_FOUND`).

**Analogie concrète** : Le filtre est l'aiguillage de la gare : il lit le préfixe de voie (`/fr/`). Les associations sont les numéros de correspondance collés sur deux rames (même trajet, deux langues).

**Ce que le filtre n'est PAS** :

- Ce n'est pas le module Language Switcher (le filtre commute, le module affiche des liens).
- Ce n'est pas une association automatique : les paires se créent dans Multilingual Associations.

---

### Qu'est-ce que le Language Switcher (pack + home + ACL) ?

**Définition** : Le module `mod_languages` n'affiche une content language que s'il existe **un pack UI site**, **un accueil spécifique** à ce `lang_code`, et **un niveau d'accès autorisé**. Les trois manques vident ou réduisent le module.

**Le problème que cette règle résout** :

Sans les trois conditions, voici les problèmes rencontrés :

1. **Pack UI site manquant** : la content language n'apparaît pas.
2. **Accueil `lang_code` manquant** : même effet, module incomplet.
3. **View level refusé** : la langue est publiée, le visiteur ne la voit pas.

Ordre des liens construits par le helper :

1. Association composant
2. Sinon association menu (`index.php?lang={sef}&Itemid=...`)
3. Sinon l'item actif `language='*'` (même Itemid + `lang=sef`)
4. Sinon l'accueil de la langue cible (ou l'URL courante si cette langue est déjà active)

**Analogie concrète** : Un panneau de correspondance n'affiche une ligne que si le train existe (pack), s'il y a une station terminus (accueil `lang_code`), et si ton titre de transport est valable (ACL). Un seul manque : la ligne disparaît du panneau.

**Ce que le switcher n'est PAS** :

- Ce n'est pas un traducteur automatique.
- Ce n'est pas un bouton magique : pack + home + ACL, les trois.

---

### Qu'est-ce qu'un override `.override.ini` et un overlay template ?

**Définition** : Hors debug, le Framework (`Joomla\Language\Language` 4.0.0, `$default = 'en-GB'`) charge d'abord en-GB, puis la langue active, puis `language/overrides/{lang}.override.ini` (gagne via `array_replace`). Le CMS charge aussi l'override de la langue par défaut seulement si `!$debug && $lang !== en-GB`. Chemins guide : `siteroot/language/overrides/en-GB.override.ini` et l'équivalent administrator.

`HtmlDocument::_fetchTemplate` demande `tpl_{template}` d'abord depuis `JPATH_BASE`, et seulement en échec depuis le dossier template (`||`). `Language::load()` s'arrête au premier `{basePath}/language/{lang}/{extension}.ini` réussi. Cassiopeia 6.1.3 a `language/en-GB/tpl_cassiopeia.ini` (clés `TPL_CASSIOPEIA_*`) et **pas** d'overlay `templates/cassiopeia/language/` (404). Un fichier homonyme sous le template n'est donc **pas fusionné** si `JPATH_BASE` a déjà l'ini.

En debug : plus de fallback en-GB, ni d'override de la langue par défaut.

**Le problème que ces fichiers résolvent** :

Sans l'ordre de chargement, voici les problèmes rencontrés :

1. **Chaîne non traduite** : tu modifies un ini template alors que `JPATH_BASE` a déjà le fichier.
2. **Debug trompeur** : tu actives le debug et tu perds le fallback en-GB.
3. **Overlay fantôme** : Cassiopeia 6.1.3 n'a pas `templates/cassiopeia/language/`.

**Analogie concrète** : Trois classeurs lus dans l'ordre : dictionnaire anglais, dictionnaire de la langue active, post-it collé (fichier `.override.ini`) qui gagne. Un quatrième classeur dans le tiroir du template n'est ouvert **que** si le premier tiroir (`JPATH_BASE`) est vide. Cassiopeia a déjà une fiche dans le premier tiroir : le tiroir template reste fermé.

**Ce que ces fichiers ne sont PAS** :

- L'overlay `templates/*/language/` n'est pas un merge par-dessus `JPATH_BASE`.
- Atum / Cassiopeia cœur n'ont pas de dossier `language/` sous le template au tag 6.1.3.
- Le debug n'est pas un « mode plus complet » pour les chaînes : il **retire** des replis.

---

### Qu'est-ce que le 404 de l'item `*` vers un article associé ?

**Définition** : Un item de menu `language='*'` (All Languages) n'est pas filtré par tag dans `parseSefRoute`. Si ce item pointe vers un article **ensuite associé** à d'autres langues, le changement de langue produit **Page Not Found**. Le `*` passe le routeur ; l'article associé, non, pour cette combinaison.

**Le problème que cette règle rend visible** :

Sans elle, voici les problèmes rencontrés :

1. **Un seul item `*`** : tu publies un Main Menu All Languages « pour toutes les langues ».
2. **Association tardive** : tu associes ensuite l'article cible.
3. **404 au switch** : le `*` passe le routeur ; l'article associé, non.

**Analogie concrète** : Un couloir commun (`*`) mène à une porte. Plus tard tu poses des serrures différentes par langue sur cette porte. Le couloir existe encore ; la porte cible, dans l'autre langue, n'est plus la même. Tu arrives sur un mur (404).

**Ce que ce 404 n'est PAS** :

- Ce n'est pas un bug du préfixe SEF à lui seul.
- Ce n'est pas « le `*` est interdit ». C'est le couple item `*` **plus** article ensuite associé qui 404 au switch.

---

## Étapes Pratiques

### Étape 1 : Pack puis content language

System vers Install Languages : installer le pack site. System vers Content Languages : publier, ordonner. Vérifier l'intersection pack site (`client_id` 0) + `published=1`.

**Résultat attendu** :

```text
Une ligne #__extensions type=language enabled=1 (pack UI)
Une ligne #__languages published=1 pour le même lang_code
```

---

### Étape 2 : Language Filter et associations

Activer System - Language Filter. Item Associations = Yes. Components vers Multilingual Associations : paires articles (puis menus, catégories, contacts, news feeds selon le besoin). Créer un **accueil** par `lang_code`.

**Résultat attendu** :

```text
Multilanguage::isEnabled() vrai côté site
Associations::isEnabled() vrai (item_associations)
Lignes dans #__associations
Un item accueil par langue affichée
```

---

### Étape 3 : Switcher et piège de l'item `*`

Placer `mod_languages`. Contrôler pack UI site + accueil + ACL. Ne pas pointer un item Main Menu `*` vers un article que tu associes ensuite.

**Résultat attendu** :

```text
Le module n'affiche que les langues complètes (pack + home + ACL).
Un item * vers un article ensuite associé : 404 au changement de langue.
```

---

## Commandes Utiles

| Élément | Action |
| ------- | ------ |
| System vers Install Languages | Installer un pack UI |
| System vers Content Languages | Publier / ordonner `#__languages` |
| System - Language Filter | Activer le commutateur site |
| Item Associations = Yes | Autoriser `#__associations` |
| `mod_languages` | Afficher le switcher (pack + home + ACL) |
| `language/overrides/{lang}.override.ini` | Gagner après en-GB puis langue active |

---

## Pièges Fréquents

### Piège 1 : Switcher vide

⚠️ **Problème** : Pack UI site, accueil `lang_code` ou view level manquant. Le module n'affiche pas la langue.

✅ **Solution** : Vérifier les trois conditions, pas seulement le module publié.

---

### Piège 2 : Item `*` puis article associé

⚠️ **Problème** : Main Menu All Languages vers un article ensuite associé = **Page Not Found** au switch.

✅ **Solution** : Un item d'accueil (et d'article) **par langue**, plus une association d'items de menu.

---

### Piège 3 : Override, debug, overlay template

⚠️ **Problème** : En debug, plus de fallback en-GB ni d'override de la langue par défaut. Un ini sous `templates/{tpl}/language/` est ignoré dès que `JPATH_BASE/language/{lang}/tpl_{tpl}.ini` existe.

✅ **Solution** : Écrire `language/overrides/{lang}.override.ini`. Ne pas compter sur un overlay template cœur (Cassiopeia n'en a pas).

---

## Checklist de Validation

- [ ] Je distingue pack UI (`#__extensions`) et content language (`#__languages`)
- [ ] J'active Language Filter et `item_associations`
- [ ] Je sais que les paires sont dans `#__associations`
- [ ] Je n'attends une langue dans le switcher que si pack + home + ACL
- [ ] Je place les overrides dans `.override.ini` après en-GB
- [ ] Je n'associe pas un item `*` à un article ensuite associé

---

## Exercice Pratique

**Énoncé** : Un site 6.1.3 a le pack site fr-FR installé, une content language fr-FR publiée, le Language Filter actif, un module Language Switcher, un seul item Main Menu `language='*'` vers l'article A. On associe ensuite A avec l'article B (en-GB). Le visiteur clique FR dans le switcher.

1. Le switcher affiche-t-il FR si aucun accueil `fr-FR` n'existe ?
2. Que se passe-t-il au clic si l'accueil FR existe mais l'item `*` pointe vers A associé ?
3. Où coller la chaîne `TPL_CASSIOPEIA_*` pour qu'elle gagne, sachant que `JPATH_BASE/language/fr-FR/tpl_cassiopeia.ini` existe ?

**Indications** :

- Trois conditions du switcher.
- Guide de setup : item `*` + article associé = 404.
- Overlay template : `||` sans merge.

**Résultat attendu** : Trois réponses courtes, chacune appuyée sur une règle de cette fiche.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

1. **Non.** Pack + content language ne suffisent pas. Sans accueil spécifique `lang_code` (et ACL), `mod_languages` n'affiche pas FR.
2. **404 (Page Not Found).** L'item `*` passe `parseSefRoute` ; l'article associé ne correspond plus au switch. Il faut un item par langue, associé.
3. **`language/overrides/fr-FR.override.ini`** (site), lu après en-GB puis fr-FR, gagne via `array_replace`. Un fichier sous `templates/cassiopeia/language/` n'est pas fusionné : `JPATH_BASE` a déjà l'ini, le second opérande `||` n'est pas évalué. Cassiopeia 6.1.3 n'a d'ailleurs pas ce dossier overlay.

---

## Navigation

← Fiche précédente : **[Champs personnalisés](14-champs-personnalises.md)**

→ Fiche suivante : **[Mail, workflows et sauvegardes](16-mail-workflows-et-sauvegardes.md)**
