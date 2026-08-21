---
tags:
  - Joomla
  - Intermédiaire
  - Pratique
description: "Champs personnalisés com_fields : 21 noms / 18 plugins, câblage content/contact/users, jeton {field 1} avec espace, core.edit.value, CVE-2026-72531."
estimated_time: "45 min"
fiche_number: 14
total_fiches: 24
cursus: "Joomla CMS"
id: "web.joomla.champs-personnalises"
course_id: "web.joomla"
content_type: "lesson"
order: 14
---

# 14 - Champs personnalisés

> **En bref** : Tu crées un champ `com_fields` sur content, contact ou users, tu l'affiches avec `{field 1}` (espace obligatoire, pas `{field:n}`), et tu contrôles l'écriture par `core.edit.value`. Lecture estimée : 45 min.

## Prérequis

- Fiche [08 - ACL : authorise et view levels](08-acl-authorise-et-view-levels.md) : action `authorise` distincte de la visibilité
- Fiche [12 - Modules, chrome et loadmodule](12-modules-chrome-et-loadmodule.md) : jetons dans un article, plugin Content
- Fiche [13 - Finder, CLI et absences](13-finder-cli-et-absences.md)
- CMS Joomla 6.1.3 (Help61 « 16 types » est faux sur ce tag)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras nommer les 21 types cœur, coller le jeton `{field 1}` reconnu par le regex, limiter le câblage natif à content / contact / users, et refuser une valeur de champ sans `core.edit.value`.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que `com_fields` ?

**Définition** : `com_fields` est le composant des champs personnalisés. Au tag 6.1.3 il livre **18 plugins** sous `plugins/fields` et **21 noms de types**. Le plugin `media` enregistre en plus `audio`, `document` et `video` (basenames de `tmpl/*.php`). `FieldsPlugin::onCustomFieldsGetTypes()` prend ce basename.

**Le problème que `com_fields` résout** :

Sans champs personnalisés, voici les problèmes rencontrés :

1. **Donnée hors modèle** : un article n'a pas de colonne « date d'événement » ou « numéro de badge ».
2. **Doc décalée** : Help61:Fields:_Edit parle encore de **16 types**. Ce n'est pas le code 6.1.3.
3. **Composant non câblé** : tu ajoutes un champ à un news feed ou une bannière, et rien n'apparaît.

**Comment `com_fields` résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Donnée hors modèle | Définition dans `#__fields`, valeur dans `#__fields_values` |
| Doc décalée | Compter 21 noms / 18 plugins sur le tag, pas Help61 |
| Composant non câblé | Interface `FieldsFormServiceInterface` limitée à trois composants |

**Analogie concrète** : Une armoire de dossiers n'a que des tiroirs prévus (titre, texte). Tu ajoutes des intercalaires étiquetés. Seules trois armoires du siège ont les rails : Articles, Contacts, Utilisateurs.

**Ce que `com_fields` n'est PAS** :

- Ce n'est pas le manuel 6.1 « Custom Fields Overview » (sous-classes `FormField`, autre sujet).
- Ce n'est pas un câblage universel. `com_newsfeeds`, `com_banners` et `com_tags` n'implémentent pas l'interface.

Les 18 plugins : calendar, checkboxes, color, editor, imagelist, integer, list, media, note, number, radio, sql, subform, text, textarea, url, user, usergrouplist.

Les 21 noms : les 18 ci-dessus, plus audio, document, video. Le 5.4.8 n'a ni note ni number ; `media/tmpl` n'y a que `media.php`. Ce cursus reste sur 6.1.3.

Type par défaut d'une définition : `text`. Tables : `#__fields`, `#__fields_groups`, `#__fields_categories`, `#__fields_values` (`field_id`, `item_id` varchar, `value` mediumtext).

---

### Qu'est-ce que le câblage content, contact, users ?

**Définition** : `FieldsFormServiceInterface` (étend `FieldsServiceInterface`) n'est implémentée nativement que par trois composants cœur.

**Le problème que ce câblage résout** :

Sans liste close, voici les problèmes rencontrés :

1. **Composant visé par erreur** : tu ajoutes un champ à un news feed, une bannière ou un tag « comme pour un article ».
2. **Vue site différente du formulaire admin** : tu ne sais pas sur quel contexte le formulaire site se replie.
3. **Catégorie / tag** : tu crois qu'un tag a ses propres champs, alors que le plugin système fait un remap.

Seuls ces contextes sont branchés :

| Contexte | Repli site |
| -------- | ---------- |
| `com_content.article` / `com_content.categories` | vues form, featured, category se replient sur article |
| `com_contact.contact` / `com_contact.mail` / `com_contact.categories` | formulaire site contact se replie sur mail |
| `com_users.user` | inscription et profil se replient sur user |

Le plugin System - Fields reassocie `com_categories.category` vers `{extension}.categories` et `com_tags.tag` vers le `type_alias` de l'item tagué. Un tag n'hérite des champs que via ce remap.

**Analogie concrète** : Trois prises murales dans la pièce. Tu peux brancher un intercalaire sur ces prises. Le reste du mobilier n'a pas de prise, même si l'étiquette « champ » existe dans le tiroir admin.

**Ce que ce câblage n'est PAS** :

- Ce n'est pas une interdiction d'écrire une extension qui implémente l'interface. C'est le périmètre **cœur** 6.1.3.
- Ce n'est pas « tags ont des champs comme les articles » : pas d'`FieldsServiceInterface` sur `com_tags`.

Contrats stables : interface de service et événements `onCustomFieldsGetTypes`, `onCustomFieldsPrepareField`, `onCustomFieldsPrepareDom`. Les plugins de type s'abonnent aussi à `onContentPrepareForm`. Chemins tmpl et arbre d'assets : détail interne.

---

### Qu'est-ce que le jeton `{field 1}` ?

**Définition** : `plg_content_fields` (activé dans le seed SQL 6.1.3) remplace des jetons dans le contenu. Le regex exige un **espace** : `/{(field|fieldgroup)\s+(.*?)}/i`. Le premier fragment avant virgule est casté `(int)`. Pas de jeton par nom.

**Le problème que ce jeton résout** :

Sans syntaxe exacte, voici les problèmes rencontrés :

1. **Jeton mort** : `{field:12}` ou `{field:event-date}` (guide joomla.center, 10 août 2026) ne matchent pas le regex.
2. **Mauvais identifiant** : tu mets un nom de champ. Le parseur veut un entier.
3. **Layout ignoré** : tu oublies la virgule du layout alternatif.

**Comment le plugin résout ces problèmes** :

L'ini officielle en-GB documente :

```text
{field 1}
{field 1,foo}
{fieldgroup 2}
```

`{field 1,foo}` demande le layout alternatif `foo`. Le remplacement passe par `FieldsHelper::render($context, 'field.'|'fields.' . $layout, ...)`. `FieldsHelper::render()` tente d'abord le composant du contexte, puis `com_fields`. Le cœur ne livre que `components/com_fields/layouts/field/render.php`.

Overrides : (1) valeur plugin via `PluginHelper::getLayoutPath('fields', $plugin, $type)` : `templates/{tpl}/html/plg_fields_{name}/{layout}.php` puis `plugins/fields/{name}/tmpl/` ; (2) affichage `field.render` / `fields.render` sous `html/layouts`.

Le plugin système Fields remplit `$item->jcfields` sur `onContentPrepare` et gère aussi `onContentAfterSave`, `onUserAfterSave`, `onContentAfterTitle`, `onContentBeforeDisplay`, `onContentAfterDisplay`.

**Analogie concrète** : Un publipostage. Le modèle attend `{field 1}` avec un espace, comme `{nom 1}` sur une étiquette de courrier. `{field:1}` est une autre marque d'imprimante : la tienne ne la lit pas.

**Ce que ce jeton n'est PAS** :

- Ce n'est pas `{field:n}` ni `{field:name}`.
- Ce n'est pas un test 6.1.3 : aucun test du tag n'assert le remplacement `{field 1}`. Le CRUD admin Cypress attend le message **Field saved** pour `context=com_content.article`.

---

### Qu'est-ce que `core.edit.value` ?

**Définition** : L'édition d'une **valeur** de champ exige `core.edit.value` sur l'asset `{component}.field.{id}`. `FieldTable` porte ce nom. Parent : `{component}.fieldgroup.{id}` ou le composant (`access.xml` de content, contact et users). Help61 Permissions liste Delete, Edit, Edit State et Edit Custom Field Value.

**Le problème que cette action résout** :

Sans elle, voici les problèmes rencontrés :

1. **Droit trop large** : `core.edit` sur l'article ne dit pas si on peut remplir le champ.
2. **Échec silencieux** : `FieldModel::setFieldValue()` n'écrit que si `canEditFieldValue()` passe.
3. **Ligne fantôme** : une valeur vide devient `null` (ligne `#__fields_values` supprimée).

**Analogie concrète** : La clé du bureau ouvre le dossier (éditer l'article). Une deuxième clé ouvre l'intercalaire (éditer la valeur du champ). Sans la deuxième clé, le tiroir se referme sans bruit : pas d'erreur spectaculaire, pas de ligne en base.

**Ce que `core.edit.value` n'est PAS** :

- Ce n'est pas un view level. C'est une action ACL, fiche [08 - ACL : authorise et view levels](08-acl-authorise-et-view-levels.md).
- Ce n'est pas une garantie webservice sur une instance ancienne.

CVE-2026-72531 (ACL webservice champs, 4.0.0-5.4.7 et 6.0.0-6.1.2) est corrigée en **5.4.8** et **6.1.3** (JSST 20260804). Une instance inférieure reste exposée.

---

## Étapes Pratiques

### Étape 1 : Créer un champ article

Dans l'admin : Content vers Fields. Contexte `com_content.article`. Type `text` (défaut). Enregistrer.

**Résultat attendu** :

```text
Message système : Field saved
Une ligne dans #__fields (type text par défaut)
```

C'est le critère Cypress `Field.cy.js` du tag 6.1.3.

---

### Étape 2 : Poser le jeton dans un article

Dans le texte de l'article, coller le jeton avec un **espace**, l'entier étant l'id du champ :

```text
{field 1}
```

Variante layout : `{field 1,foo}`. Groupe : `{fieldgroup 2}`.

**Résultat attendu** :

```text
En frontal, le jeton est remplacé par le rendu du champ.
{field:1} ou {field:event-date} restent affichés tels quels (regex non matché).
```

---

### Étape 3 : Vérifier la valeur et l'ACL

Saisir une valeur sur l'article. Contrôler `#__fields_values` (`field_id`, `item_id`, `value`). Vider la valeur : la ligne disparaît (`null` vers suppression).

Un compte sans `core.edit.value` sur `com_content.field.{id}` : `setFieldValue()` n'écrit pas.

**Résultat attendu** :

```text
Valeur non vide : une ligne #__fields_values
Valeur vide : aucune ligne
Sans core.edit.value : pas d'écriture
```

---

## Commandes Utiles

| Commande / jeton | Action |
| ---------------- | ------ |
| `{field 1}` | Rendre le champ d'id 1 (espace obligatoire) |
| `{field 1,foo}` | Rendre le champ 1 avec le layout `foo` |
| `{fieldgroup 2}` | Rendre le groupe d'id 2 |
| `{field:1}` | Aucun remplacement (syntaxe non reconnue) |
| `core.edit.value` sur `{component}.field.{id}` | Autoriser l'écriture de la valeur |

---

## Pièges Fréquents

### Piège 1 : `{field:n}` ou `{field:name}`

⚠️ **Problème** : joomla.center illustre `{field:12}` et `{field:event-date}`. Le regex 6.1.3 exige `\s+` puis un entier.

✅ **Solution** : Suivre l'ini en-GB : `{field 1}`, `{field 1,layout}`, `{fieldgroup 2}`. Pas Help61 ni joomla.center pour la syntaxe.

---

### Piège 2 : Help « 16 types »

⚠️ **Problème** : Tu cadres un diagnostic sur 16 types. Le tag 6.1.3 en a 21 noms (18 plugins, media ajoute audio / document / video).

✅ **Solution** : Compter les plugins sous `plugins/fields` et les tmpl de `media`.

---

### Piège 3 : News feeds, banners, tags, valeur vide, CVE

⚠️ **Problème** : Pas d'`FieldsServiceInterface` sur news feeds / banners / tags. Valeur vide = pas de ligne. Instance antérieure à 6.1.3 (ou à 5.4.8 en 5.4) : CVE-2026-72531 sur les endpoints webservice champs.

✅ **Solution** : Câbler content, contact ou users. Lire `#__fields_values` après un vide. Rester sur 6.1.3.

---

## Checklist de Validation

- [ ] Je cite 21 noms / 18 plugins, pas « 16 types »
- [ ] Je limite le câblage cœur à content, contact, users
- [ ] J'écris `{field 1}` avec un espace, jamais `{field:n}`
- [ ] Je relie l'écriture à `core.edit.value` sur `{component}.field.{id}`
- [ ] Je connais les tables `#__fields` et `#__fields_values`
- [ ] Je sais que CVE-2026-72531 est corrigée en 6.1.3

---

## Exercice Pratique

**Énoncé** : Pour chaque cas, dis si le jeton ou le champ **fonctionne** sur un 6.1.3 cœur, et pourquoi.

1. Article, champ id 1, texte `{field 1}`
2. Article, même champ, texte `{field:1}`
3. News feed, champ créé dans l'admin Fields
4. Article, utilisateur sans `core.edit.value`, enregistrement d'une valeur
5. Help61 dit « 16 types » : tu cherches le 17e type `number`

**Indications** :

- Regex : espace puis entier.
- Interface native : trois composants.
- `number` existe au tag 6.1.3.

**Résultat attendu** : Cinq décisions (oui / non / partiel) avec la règle exacte.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

1. **Oui** : `com_content.article` est câblé ; `{field 1}` match le regex ; id 1 est casté `(int)`.
2. **Non** : `{field:1}` ne match pas `/{(field|fieldgroup)\s+(.*?)}/i`.
3. **Non (cœur)** : `com_newsfeeds` n'implémente pas `FieldsFormServiceInterface`.
4. **Non écriture** : `setFieldValue()` exige `canEditFieldValue()` / `core.edit.value`. Échec silencieux possible.
5. **Le 17e type existe** : Help61 est faux. `number` et `note` sont des plugins 6.1.3. Total : 21 noms.

---

## Navigation

← Fiche précédente : **[Finder, CLI et absences](13-finder-cli-et-absences.md)**

→ Fiche suivante : **[Site multilingue](15-multilingue.md)**
