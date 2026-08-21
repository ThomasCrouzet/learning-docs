---
tags:
  - Joomla
  - Débutant
  - Pratique
description: "Créer un template enfant Cassiopeia, poser user.css et user.js via le WAM après le preset LTR/RTL, et connaître les positions y compris error-403 et error-404."
estimated_time: "35 min"
fiche_number: 3
total_fiches: 24
cursus: "Joomla CMS"
---

# 03 - Template enfant Cassiopeia

> **En bref** : Tu crées un enfant Cassiopeia avec Create Child Template, tu poses `user.css` / `user.js` via le WAM après le preset LTR/RTL, et tu n'édites pas le parent. Lecture estimée : 35 min.

## Prérequis

- Fiche 2 : [Installation de Joomla 6.1.3](02-installation-6-1-3.md)
- Un site 6.1.3 installé, avec accès administrateur
- Notions HTML/CSS (sélecteurs, couleurs)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer un template enfant Cassiopeia, y poser `user.css` et `user.js` sans toucher au parent, et citer les positions du tag 6.1.3 y compris `error-403` et `error-404`.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un template enfant héritable ?

**Définition** : Cassiopeia 6.1.3 est **héritable** : `<inheritable>1</inheritable>`. Un enfant réutilise tout le parent **sauf** les fichiers homonymes. Les fichiers enfant ne sont pas touchés par les mises à jour. `SiteApplication` accepte un template si `index.php` existe sur l'enfant **ou** le parent, sinon `cassiopeia`. `HtmlDocument::_fetchTemplate` charge `index.php` / `error.php` enfant, sinon parent, sinon `system`. `CMSApplication::initialiseTemplate()` existe depuis 6.1.0 (défaut `system`).

**Le problème que l'enfant résout** :

Sans enfant, voici les problèmes rencontrés :

1. **Core édité** : tu modifies les PHP / CSS livrés. L'update les écrase.
2. **Copie totale** : tu dupliques tout Cassiopeia et tu suis chaque fichier à chaque update.
3. **`index.php` recopié sans besoin** : l'enfant n'a pas à dupliquer le parent s'il l'hérite.

**Analogie concrète** : Le parent est le livre imprimé de la bibliothèque. L'enfant est **ta** photocopie annotée. Tu n'écris pas sur l'exemplaire imprimé.

**Ce qu'un template enfant n'est PAS** :

- Ce n'est pas une copie à éditer de `templates/cassiopeia/` livré.
- Ce n'est pas Atum (template **administrateur**).
- Ce n'est pas, à lui seul, un override `html/` (fiche 04).

---

### Qu'est-ce que Create Child Template ?

**Définition** : Dans l'administrateur 6.1, le chemin documenté est **System** vers **Site Templates** vers **Create Child Template**, parent = Cassiopeia. C'est le critère de réussite du jalon « template enfant ». Le PHP vit sous `templates/` ; les médias Cassiopeia installés vivent sous `media/templates/site/cassiopeia`. Les pages programmeur Templates 6.1 ne sont pas la source de cette fiche : la pratique vient du guide.

**Le problème que cette action résout** :

Sans ce bouton, voici les problèmes rencontrés :

1. **Dossier inventé** : manifeste incomplet, non héritable.
2. **Parent modifié** : tu « personnalises » les fichiers cœur.
3. **Médias mal placés** : tu édites le PHP et les médias du parent.

**Analogie concrète** : Create Child Template est le formulaire « photocopie officielle ». Un dossier bricolé dans le rayon n'a pas l'étiquette parent/enfant.

**Ce que Create Child Template n'est PAS** :

- Ce n'est pas « Duplicate » d'un CSS parent, ni l'édition de `templates/cassiopeia/index.php`.

---

### Qu'est-ce que `user.css` et `user.js` via le WAM après LTR/RTL ?

**Définition** : Cassiopeia charge `user.css` et `user.js` via le **Web Asset Manager** (`joomla.asset.json`), **après** le preset LTR/RTL, le CSS de langue et le thème de couleur. Le guide place `user.css` dans `css/`. Ces fichiers sont **optionnels**. Tu les poses sur **l'enfant**, pas sur le parent. Le remplacement d'un item JSON (homonyme `type`+`name`) est la fiche 05.

**Le problème que `user.css` / `user.js` résolvent** :

Sans ces fichiers dédiés, voici les problèmes rencontrés :

1. **CSS cœur édité** : l'update l'écrase.
2. **Ordre de cascade faux** : un CSS chargé avant le preset LTR/RTL passe sous le thème.
3. **JS collé dans `index.php`** : encore une modification cœur.

| Étape Cassiopeia (ordre enseigné) | Rôle |
| --------------------------------- | ---- |
| Preset LTR ou RTL                 | Direction du texte |
| CSS de langue                     | Ajustements par langue |
| Thème de couleur                  | Couleurs du style |
| `user.css` / `user.js` via WAM    | Tes ajouts, **après** le reste |

**Analogie concrète** : Preset, langue et couleur sont les couches d'usine. `user.css` est le vernis posé **en dernier** sur **ta** photocopie.

**Ce que `user.css` n'est PAS** :

- Ce n'est pas un fichier livré obligatoire.
- Ce n'est pas `logo.svg` du parent (livré, fiche 06).

---

### Qu'est-ce que les positions Cassiopeia du tag 6.1.3 ?

**Définition** : Une **position** est un emplacement nommé pour des modules. Cassiopeia 6.1.3 déclare : `topbar`, `menu`, `sidebar-left`, `sidebar-right`, `footer`, `debug`, `error-403`, `error-404`. Les deux dernières sont utilisées dans `error.php`. Le **guide** Cassiopeia s'arrête à `debug` et parle de polices None/local/web. Le core 5.4/6.1 ajoute la pile **system font**, `systemFontBody` / `systemFontHeading`, et `error-403` / `error-404`. Tu cites le XML du **tag**.

**Le problème que les positions du tag résolvent** :

Sans liste du tag, voici les problèmes rencontrés :

1. **Guide en retard** : tu omets `error-403` / `error-404`.
2. **Module invisible** : position absente du XML.
3. **Page d'erreur sans module** : tu ignores `error.php`.

| Position        | Rôle                                         |
| --------------- | -------------------------------------------- |
| `topbar`        | Bandeau supérieur                            |
| `menu`          | Navigation                                   |
| `sidebar-left`  | Colonne gauche                               |
| `sidebar-right` | Colonne droite                               |
| `footer`        | Pied de page                                 |
| `debug`         | Zone de debug                                |
| `error-403`     | Modules de la page 403 (`error.php`)         |
| `error-404`     | Modules de la page 404 (`error.php`)         |

**Analogie concrète** : Les positions sont des boîtes aux lettres étiquetées. Le guide a oublié deux étiquettes que le bâtiment 6.1.3 a déjà posées.

**Ce qu'une position n'est PAS** :

- Ce n'est pas un article, ni un override `html/`.
- Ce n'est pas la liste du guide si le guide s'arrête à `debug`.

---

### Qu'est-ce que la règle « ne pas éditer le parent » ?

**Définition** : Modifier les fichiers livrés de Cassiopeia est une modification du **core**, écrasée à la mise à jour. Chemin durable : enfant, `user.css` / `user.js`, overrides `html/` (fiche 04). Pas d'exception « petit changement ».

**Le problème que cette règle résout** :

Sans cette règle, voici les problèmes rencontrés :

1. **Perte à l'update** : CSS, PHP, `logo.svg` livrés reviennent.
2. **Écart indébuggable** : tu ne sépares plus cœur et local.
3. **Faux enfant** : le dossier enfant existe, tu édites encore le parent.

**Analogie concrète** : Écrire au stylo sur le livre de la bibliothèque. Au prochain tirage, tes notes ont disparu.

**Ce que cette règle n'est PAS** :

- Ce n'est pas « ne jamais créer de fichier » : tu crées sur **l'enfant**.
- Ce n'est pas une exception pour `logo.svg` (fiche 06 : fichier **livré** dans le ZIP Update).

---

## Étapes Pratiques

### Étape 1 : Créer l'enfant

1. Administrateur : **System** puis **Site Templates**.
2. **Create Child Template**, parent **Cassiopeia**.
3. Choisis un nom d'enfant (nom de travail, pas un nom officiel du tag).

**Résultat attendu** :

```text
Un template site enfant apparaît. Parent = Cassiopeia.
templates/cassiopeia/ livré n'a pas été édité.
```

---

### Étape 2 : Poser `user.css` et `user.js` sur l'enfant

Dans `css/` de **l'enfant** (guide : `user.css` dans `css/`) :

```css
/* user.css enfant : WAM après preset LTR/RTL */
body {
  background-color: #f4f6f8;
}
```

```javascript
/* user.js enfant : pas dans index.php du parent */
document.documentElement.setAttribute("data-enfant", "1");
```

Assigne le style enfant au site.

**Résultat attendu** :

```text
Le fond change. data-enfant="1" est présent.
Le CSS et l'index.php livrés du parent sont intacts.
```

---

### Étape 3 : Lister les positions du tag

Dans les modules, vérifie : `topbar`, `menu`, `sidebar-left`, `sidebar-right`, `footer`, `debug`, `error-403`, `error-404`.

```bash
grep -n "inheritable\|error-403\|error-404\|topbar" templates/cassiopeia/templateDetails.xml
```

**Résultat attendu** :

```text
<inheritable>1</inheritable> et les positions du tag, y compris error-403 / error-404.
```

---

### Étape 4 : Vérifier que le parent n'a pas bougé

```bash
grep -n "user.css\|user.js" templates/cassiopeia/index.php
```

**Résultat attendu** :

```text
Tu n'as pas ajouté user.css à la main dans l'index.php parent.
Le chargement passe par joomla.asset.json (fiche 05).
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `ls templates/` | Dossiers templates site (parent + enfant) |
| `ls media/templates/site/cassiopeia/` | Médias installés du parent |
| `grep -n "inheritable" templates/cassiopeia/templateDetails.xml` | Confirmer l'héritabilité |
| `grep -n "error-403" templates/cassiopeia/templateDetails.xml` | Positions d'erreur du tag |

---

## Pièges Fréquents

### Piège 1 : Éditer le parent « pour aller plus vite »

⚠️ **Problème** : Édition core, écrasée à l'update. Erreur typique du jalon enfant.

✅ **Solution** : Create Child Template, puis `user.css` / `user.js` / `html/` sur l'enfant.

---

### Piège 2 : Recopier `index.php` sur l'enfant sans besoin

⚠️ **Problème** : Tu maintiens un duplicata. `index.php` sur l'enfant **ou** le parent suffit.

✅ **Solution** : L'enfant réutilise le parent sauf homonymes.

---

### Piège 3 : Suivre le guide jusqu'à `debug` seulement

⚠️ **Problème** : Le guide omet `error-403`, `error-404` et la pile system font.

✅ **Solution** : Citer `templateDetails.xml` du tag 6.1.3.

---

### Piège 4 : Poser `user.css` dans `index.php` avant le preset

⚠️ **Problème** : Tes règles passent sous le thème LTR/RTL.

✅ **Solution** : Laisser le WAM charger `user.css` / `user.js` **après** preset, langue et couleur.

---

## Checklist de Validation

- [ ] Cassiopeia 6.1.3 est héritable (`<inheritable>1</inheritable>`)
- [ ] Enfant créé via System vers Site Templates vers Create Child Template
- [ ] Aucun fichier livré du parent édité
- [ ] `user.css` / `user.js` sur l'enfant, optionnels, WAM après LTR/RTL
- [ ] Positions : `topbar`, `menu`, `sidebar-left`, `sidebar-right`, `footer`, `debug`, `error-403`, `error-404`
- [ ] Je sais que le guide qui s'arrête à `debug` est en retard sur le tag

---

## Exercice Pratique

**Énoncé** : On te demande : « change le fond et le logo dans `templates/cassiopeia/`, c'est plus rapide ». Rédige un refus en trois points (fond, logo, positions d'erreur).

**Indications** :

- Fond : `user.css` de l'enfant, WAM après LTR/RTL
- Logo : fichier **livré** (`logo.svg` est dans le ZIP Update, fiche 06)
- Positions : citer `error-403` / `error-404`

**Résultat attendu** : Trois points, zéro édition du parent livré.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

1. **Fond** : Create Child Template. `user.css` dans `css/` de **l'enfant**. WAM après LTR/RTL. Pas la feuille livrée.
2. **Logo** : `media/templates/site/cassiopeia/images/logo.svg` est **livré** (ZIP Update). L'éditer = core écrasé. Fiche 06.
3. **Positions d'erreur** : le XML du tag déclare `error-403` et `error-404` (`error.php`). Un module d'erreur se pose là, sans éditer `error.php` du parent.

Phrase de refus : « Je ne modifie pas `templates/cassiopeia/`. Je crée un enfant et je pose `user.css` / `user.js`. »

---

## Navigation

← Fiche précédente : **[Installation de Joomla 6.1.3](02-installation-6-1-3.md)**

→ Fiche suivante : **[Overrides, layouts et JLayout](04-overrides-layouts-jlayout.md)**
