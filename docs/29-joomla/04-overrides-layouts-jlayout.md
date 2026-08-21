---
tags:
  - Joomla
  - Intermédiaire
  - Pratique
description: "Surcharger Cassiopeia sans toucher au core : override de même nom toujours actif, layout alternatif opt-in sans underscore, JLayout sous html/layouts, enfant avant parent."
estimated_time: "40 min"
fiche_number: 4
total_fiches: 24
cursus: "Joomla CMS"
id: "web.joomla.overrides-layouts-jlayout"
course_id: "web.joomla"
content_type: "lesson"
order: 4
---

# 04 - Overrides, layouts et JLayout

> **En bref** : Tu distingues l'override de même nom (toujours actif), le layout alternatif (opt-in, sans underscore) et JLayout sous `html/layouts`, avec l'enfant résolu avant le parent. Lecture estimée : 40 min.

## Prérequis

- Fiche 3 : [Template enfant Cassiopeia](03-template-enfant-cassiopeia.md)
- Un template enfant Cassiopeia déjà créé
- Ne pas éditer les fichiers livrés du parent (règle de la fiche 03)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras poser un override de même nom, un layout alternatif sans underscore, et un JLayout sous `html/layouts`, en sachant que l'enfant gagne sur le parent.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un override de même nom ?

**Définition** : Un **override de même nom** est un PHP sous `html/` du template, avec le **même nom** que le layout cœur. Il s'applique **toujours**. Tu n'as rien à cocher dans le formulaire module ou composant.

**Le problème que l'override de même nom résout** :

Sans ce mécanisme, voici les problèmes rencontrés :

1. **Core édité** : tu modifies `components/com_content/tmpl/...` ou le PHP Cassiopeia. L'update écrase.
2. **Fichier hors `html/`** : Joomla ne le charge pas.
3. **Confusion avec l'alternatif** : tu cherches une liste alors que le même nom est déjà actif.

| Fichier cœur              | Override de même nom     | Actif ?  |
| ------------------------- | ------------------------ | -------- |
| `default.php`             | `html/.../default.php`   | toujours |
| fragment `default_x.php`  | `html/.../default_x.php` | toujours |

**Analogie concrète** : Une étiquette collée par-dessus l'étiquette d'origine. Dès qu'elle est collée, on la lit. Pas besoin de le redire à chaque livraison.

**Ce qu'un override de même nom n'est PAS** :

- Ce n'est pas un layout alternatif (opt-in, concept suivant).
- Ce n'est pas `user.css` (WAM, fiches 03 et 05).
- Ce n'est pas une édition de `components/` ou de `templates/cassiopeia/` livré.

---

### Qu'est-ce qu'un layout alternatif sans underscore ?

**Définition** : Un **layout alternatif** est un PHP **opt-in**. Tu le choisis sur le formulaire du **module** ou du **composant**. Le nom de fichier **principal** ne contient **pas** d'underscore. Les **plugins n'offrent pas** ce choix.

**Le problème que cette règle d'underscore résout** :

Sans cette règle, voici les problèmes rencontrés :

1. **Fragment pris pour un alternatif** : `default_links.php` (underscore) est un **fragment** chargé par `default.php`.
2. **Fichier jamais proposé** : `mon_layout.php` n'est pas un nom principal d'alternatif.
3. **Plugin** : tu cherches une liste « Alternative layout » sur un plugin. Elle n'existe pas.

| Type de fichier   | Underscore dans le nom principal | Activation                      |
| ----------------- | -------------------------------- | ------------------------------- |
| Override même nom | possible                         | toujours si le cœur l'appelle   |
| Layout alternatif | **interdit**                     | opt-in, formulaire module / composant |
| Plugin            | -                                | pas de choix alternatif         |

Exemples de noms (règle, pas une API nouvelle) : `blog.php` = candidat alternatif ; `default.php` = principal (override toujours actif) ; `default_links.php` = fragment.

**Analogie concrète** : `default.php` est la recette du jour (override collé en permanence). `blog.php` est une **autre** recette à **cocher** sur le bon de commande. `default_links.php` est une sous-étape de la recette du jour, pas un plat au menu.

**Ce qu'un layout alternatif n'est PAS** :

- Ce n'est pas un override toujours actif.
- Ce n'est pas un nom `quelque_chose.php` pour le fichier principal.
- Ce n'est pas un réglage de plugin.

---

### Qu'est-ce qu'un JLayout sous `html/layouts` ?

**Définition** : Un **JLayout** est un fragment réutilisable rendu par `LayoutHelper::render`. L'appel `LayoutHelper::render('joomla.content...')` pointe vers `layouts/joomla/content/...php`. Tu le surcharges sous `html/layouts` du template (`html/layouts/joomla/content/...php`). Depuis Joomla 5.2, le courrier cœur passe par **Mail Templates** ; le chrome HTML est le JLayout `mailtemplate.php` (tableau 3 rangées), surchargeable dans le template **site**.

**Le problème que JLayout résout** :

Sans JLayout, voici les problèmes rencontrés :

1. **Copier-coller** : le même bloc HTML est recopié dans plusieurs vues.
2. **Surcharge impossible sans core** : le fragment vit sous `layouts/` livré.
3. **Mauvais dossier** : tu poses un fichier sous `html/com_content/` et `LayoutHelper::render('joomla.content...')` ne le voit pas.

| Appel | Fichier cœur | Surcharge template |
| ----- | ------------ | ------------------ |
| `LayoutHelper::render('joomla.content...')` | `layouts/joomla/content/...php` | `html/layouts/joomla/content/...` |

**Analogie concrète** : JLayout est une fiche technique partagée (encadré auteur) utilisée par plusieurs recettes. Tu remplaces la fiche dans le classeur `html/layouts` de **ta** photocopie.

**Ce que JLayout n'est PAS** :

- Ce n'est pas le layout de vue `tmpl/default.php`.
- Ce n'est pas un fichier posé n'importe où sous `html/` sans le préfixe `layouts/`.

---

### Qu'est-ce que l'ordre enfant puis parent ?

**Définition** : Au tag 6.1.3, les overrides de l'**enfant** sont résolus **avant** le parent (détail interne du tag 6.1.3 ; cette fiche ne s'appuie pas sur la page Templates 6.1 du manuel) :

- `HtmlView` : `array_unshift` parent puis enfant (l'enfant se retrouve en tête)
- `ModuleHelper::getLayoutPath` : teste l'enfant puis le parent
- `FileLayout` : liste `html/layouts` enfant puis parent

`HtmlDocument::_fetchTemplate` : `index.php` / `error.php` enfant, sinon parent, sinon `system`. Le guide : l'enfant réutilise tout le parent **sauf** les homonymes.

**Le problème que cet ordre résout** :

Sans ordre stable, voici les problèmes rencontrés :

1. **Parent qui gagne** : tu poses `html/` sur l'enfant et tu vois encore le parent.
2. **Double fichier** : même nom sur enfant et parent, tu ne sais pas lequel s'exécute.
3. **Confusion avec le WAM** : pour `joomla.asset.json`, le parent est chargé **puis** l'enfant (fiche 05). Ici, l'enfant est **cherché d'abord**.

| Mécanisme | Ordre |
| --------- | ----- |
| `HtmlView`, `ModuleHelper::getLayoutPath`, `FileLayout` | enfant puis parent |
| `index.php` / `error.php` | enfant, sinon parent, sinon `system` |

**Analogie concrète** : Deux classeurs. On ouvre **toujours le tien** (enfant) d'abord. Si la fiche y est, on s'arrête.

**Ce que cet ordre n'est PAS** :

- Ce n'est pas une fusion des deux PHP : un homonyme enfant **remplace**.
- Ce n'est pas l'ordre des `joomla.asset.json` (fiche 05).

---

## Étapes Pratiques

### Étape 1 : Poser un override de même nom

Recrée le **même nom** sous `html/` de **l'enfant**. Recharge **sans** option « Alternative layout ».

**Résultat attendu** :

```text
Le HTML change. Aucune case de layout alternatif cochée.
Le fichier sous components/ (ou modules/) et le parent livré sont intacts.
```

---

### Étape 2 : Distinguer fragment, override et alternatif

```text
default.php            -> override de même nom, toujours actif
default_links.php      -> fragment (underscore), pas un alternatif
blog.php               -> candidat alternatif (pas d'underscore), opt-in
```

Les plugins n'offrent pas le choix alternatif.

---

### Étape 3 : Poser un layout alternatif sans underscore

1. Crée un PHP **sans underscore** dans le nom principal, sous `html/` de l'enfant.
2. Choisis-le sur le formulaire **module** ou **composant**.
3. N'ouvre pas un formulaire de **plugin** pour ce choix.

**Résultat attendu** :

```text
Tant que le formulaire n'a pas ce layout, le site reste sur le défaut (ou son override).
Après choix, le fichier alternatif s'applique.
```

---

### Étape 4 : Surcharger un JLayout et vérifier l'ordre

1. `LayoutHelper::render('joomla.content...')` vers `layouts/joomla/content/...php`.
2. Surcharge : `html/layouts/joomla/content/...` de **l'enfant**.
3. Si le même nom existe sur parent et enfant : l'enfant s'exécute (`FileLayout`, `HtmlView`, `ModuleHelper::getLayoutPath`).

**Résultat attendu** :

```text
Le fragment change. layouts/ cœur intact. Enfant avant parent.
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `find templates -path "*/html/*" -name "*.php"` | Overrides déjà posés |
| `ls layouts/joomla/content/` | Fragments JLayout cœur |
| `grep -n "LayoutHelper::render" components/com_content -r \| head` | Appels JLayout dans com_content |

---

## Pièges Fréquents

### Piège 1 : Éditer le PHP cœur « comme un override »

⚠️ **Problème** : Un fichier sous `components/` ou `templates/cassiopeia/` livré n'est pas un override.

✅ **Solution** : `html/` de **l'enfant**. Même nom = toujours actif.

---

### Piège 2 : Underscore dans le nom du layout alternatif

⚠️ **Problème** : `mon_layout.php` n'est pas un principal alternatif. `default_xxx.php` est un fragment.

✅ **Solution** : Nom principal **sans underscore**. Plugins : pas de choix alternatif.

---

### Piège 3 : Poser un JLayout sous `html/com_...` seulement

⚠️ **Problème** : `LayoutHelper::render('joomla.content...')` lit `html/layouts/...`.

✅ **Solution** : `html/layouts/joomla/content/...` sur l'enfant.

---

### Piège 4 : Croire que le parent gagne, ou fusionner avec le WAM

⚠️ **Problème** : Enfant **avant** parent pour les PHP. Pour le JSON : parent **puis** enfant (fiche 05).

✅ **Solution** : Deux mécanismes, deux phrases. N'édite pas le parent.

---

## Checklist de Validation

- [ ] Override de même nom sous `html/` de l'enfant = toujours actif
- [ ] Layout alternatif = opt-in, nom principal sans underscore, module ou composant
- [ ] Les plugins n'offrent pas ce choix
- [ ] JLayout `joomla.content...` se surcharge sous `html/layouts`
- [ ] `HtmlView`, `ModuleHelper::getLayoutPath`, `FileLayout` : enfant avant parent
- [ ] Core et parent Cassiopeia livré intacts

---

## Exercice Pratique

**Énoncé** : Pour chaque fichier, dis s'il est override toujours actif, fragment, layout alternatif opt-in, ou JLayout, et s'il faut un choix de formulaire.

1. `html/com_content/article/default.php`
2. `html/com_content/article/default_links.php`
3. `html/com_content/category/blog.php`
4. `html/layouts/joomla/content/info_block.php`

**Indications** :

- Underscore dans `default_links.php`
- Pas d'underscore dans `blog.php`
- `layouts/joomla/content` correspond à `LayoutHelper::render('joomla.content...')`

**Résultat attendu** : Quatre lignes, type + « formulaire : oui / non ».

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

1. `default.php` : **override de même nom**. Toujours actif. Formulaire : **non**.
2. `default_links.php` : **fragment** (underscore). Pas un alternatif. Formulaire : **non**.
3. `blog.php` : **layout alternatif**. Opt-in formulaire **composant**. Formulaire : **oui**. Pas un plugin.
4. `html/layouts/joomla/content/info_block.php` : **JLayout**. Formulaire : **non**. Enfant puis parent (`FileLayout`).

Aucun de ces fichiers ne se pose dans `templates/cassiopeia/` livré.

---

## Navigation

← Fiche précédente : **[Template enfant Cassiopeia](03-template-enfant-cassiopeia.md)**

→ Fiche suivante : **[Web Asset Manager](05-web-asset-manager.md)**
