---
tags:
  - Joomla
  - Intermédiaire
  - Référence
description: "Enregistrer CSS et JS avec joomla.asset.json : un homonyme type+name remplace l'item entier, parent puis enfant, et Document::addScript n'est pas retiré en Joomla 6."
estimated_time: "35 min"
fiche_number: 5
total_fiches: 24
cursus: "Joomla CMS"
id: "web.joomla.web-asset-manager"
course_id: "web.joomla"
content_type: "reference"
order: 5
---

# 05 - Web Asset Manager

> **En bref** : Tu déclares les assets dans `joomla.asset.json`, tu apprends qu'un homonyme `type`+`name` remplace l'item entier, et tu corriges le manuel : `Document::addScript` n'est pas retiré en Joomla 6. Lecture estimée : 35 min.

## Prérequis

- Fiche 4 : [Overrides, layouts et JLayout](04-overrides-layouts-jlayout.md)
- Fiche 3 : [Template enfant Cassiopeia](03-template-enfant-cassiopeia.md) (`user.css` / `user.js` via WAM après LTR/RTL)
- Un template enfant Cassiopeia

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer le registre `joomla.asset.json`, le remplacement d'un homonyme `type`+`name`, l'ordre parent puis enfant, et l'écart du manuel WAM sur `addScript`.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le Web Asset Manager et `joomla.asset.json` ?

**Définition** : Le **Web Asset Manager** (WAM) est le registre CMS des feuilles et scripts. Chaque extension ou template peut déclarer des items dans `joomla.asset.json`. Au tag 6.1.3, ce JSON est **recommandé**, pas obligatoire. `Factory::createContainer()` enregistre notamment `WebAssetRegistry`. Cassiopeia charge `user.css` / `user.js` via ce registre **après** le preset LTR/RTL (fiche 03).

**Le problème que le WAM résout** :

Sans registre, voici les problèmes rencontrés :

1. **Inclusions dispersées** : chaque vue ajoute un script à sa façon.
2. **Enfant cassé** : tu veux remplacer un CSS du parent sans recopier `index.php`.
3. **`user.css` trop tôt** : chargé avant le preset LTR/RTL, tes règles passent dessous.

| Appel | Chemin enfilé |
| ----- | ------------- |
| Template site | `templates/{template}/joomla.asset.json` |
| Template admin | `administrator/templates/{template}/joomla.asset.json` |
| Extension | `media/{name}/joomla.asset.json` |

`addTemplateRegistryFile` / `addExtensionRegistryFile` n'enfilent qu'un chemin (pas de règle parent/enfant). Chemin déjà vu : ignoré. Sans fichier : pas enfilé. `dispatch()` enregistre ces JSON (flux observé dans le code 6.1.3, hors page Lifecycle du manuel).

**Analogie concrète** : `joomla.asset.json` est le bon de livraison. Le WAM range les caisses par étiquette. `user.css` arrive **après** les caisses d'usine.

**Ce que le WAM n'est PAS** :

- Ce n'est pas l'override PHP `html/` (fiche 04), ni une obligation, ni `Document::addScript` (encore là, plus bas).

---

### Qu'est-ce qu'un homonyme `type`+`name` ?

**Définition** : Deux items sont **homonymes** s'ils ont le même `type` **et** le même `name`. `WebAssetRegistry::add()` stocke `$this->assets[$type][$name]`. En collision : événement `override`, puis **nouvel item entier** (pas de fusion de `uri`, deps, attributs). Le manuel 6.1 le dit. Les tests 6.1.3 couvrent `add()` et le parse d'**un** JSON, pas deux fichiers template parent vs enfant.

**Le problème que cette règle résout** :

Sans règle unique, voici les problèmes rencontrés :

1. **Fusion inventée** : tu changes l'URI enfant en croyant garder les dépendances parent.
2. **Second JSON ignoré** : tu crois que le premier gagnant reste. C'est le **dernier** chargé qui gagne.
3. **Preset cassé** : tu remplaces un item sans recopier ses dépendances.

| Situation | Effet |
| --------- | ----- |
| Même `type`+`name` plus tard | **remplace** l'item entier |
| `name` identique, `type` différent | deux items distincts |
| Asset parent sans homonyme enfant | **reste** |
| Fusion champ à champ | **n'existe pas** |

**Analogie concrète** : L'étiquette de caisse est `type`+`name`. Une seconde caisse à la même étiquette **retire la première entière**. On ne verse pas les deux contenus ensemble.

**Ce qu'un homonyme n'est PAS** :

- Ce n'est pas une fusion, ni « le parent gagne toujours ».
- Ce n'est pas le fallback `HTMLHelper` `mediaPath` (résolution d'URI **après** l'enregistrement).

---

### Qu'est-ce que l'ordre parent puis enfant ?

**Définition** : `SiteApplication::dispatch` et `AdministratorApplication::dispatch` enregistrent le `joomla.asset.json` **parent d'abord**, **enfant ensuite**. `parseRegistryFiles` suit `dataFilesNew` dans cet ordre. L'homonyme **enfant l'emporte**. Les assets parent sans homonyme **restent**.

**Le problème que cet ordre résout** :

Sans cet ordre, voici les problèmes rencontrés :

1. **Contradiction avec `html/`** : pour les PHP, l'enfant est **cherché d'abord** (fiche 04). Pour le WAM, le parent est **chargé d'abord**, puis l'enfant écrase l'homonyme.
2. **JSON enfant « inerte »** : le parent chargé en premier ne bloque pas l'enfant.
3. **Parent disparu** : le JSON enfant n'efface pas le fichier parent entier.

| Mécanisme | Ordre | Homonyme |
| --------- | ----- | -------- |
| `joomla.asset.json` | parent **puis** enfant | enfant remplace l'item entier |
| Layouts PHP `html/` (fiche 04) | enfant **avant** parent | fichier enfant utilisé |

**Analogie concrète** : Bon de livraison usine d'abord, **le tien** ensuite. Même numéro de pièce : on barre la ligne d'usine. Les autres lignes d'usine restent.

**Ce que cet ordre n'est PAS** :

- Ce n'est pas `addTemplateRegistryFile` qui « sait » parent/enfant, ni un test d'intégration sur deux JSON (absent du tag). Preuve : `add()` + ordre de `dispatch`.

---

### Qu'est-ce que l'écart `Document::addScript` / « retiré en Joomla 6 » ?

**Définition** : Le manuel WAM 6.1 dit que `Document::addScript` et `Document::addStyleSheet` disparaîtront **en Joomla 6**. Dans le tag **6.1.3**, ces méthodes **existent encore**. Annotation : **@deprecated 4.3**, **retrait prévu 7.0**. La phrase du manuel « retiré en Joomla 6 » est **fausse** vis-à-vis du code 6.1.3. Le tag n'a pas été audité appel par appel ; la présence des méthodes infirme le manuel.

**Le problème que cet écart nommé résout** :

Sans le nommer, voici les problèmes rencontrés :

1. **« Interdit en 6 »** : tu ne comprends pas une extension qui appelle encore `addScript`.
2. **« Supporté sans fin »** : tu l'utilises dans du code neuf comme si 7.0 n'existait pas.
3. **Même écart** : `CMSApplication::getCfg()` dit « removed in 6.0 » alors que la méthode est encore là, annotation 7.0 (hors cursus principal).

| Source | Phrase |
| ------ | ------ |
| Manuel WAM 6.1 | retirés **en Joomla 6** |
| Code 6.1.3 | encore présentes ; @deprecated **4.3**, retrait **7.0** |
| Ce cursus | enseigner le WAM ; **ne pas** dire « retiré en 6 » |

**Analogie concrète** : Un panneau dit « porte murée en 6 ». La poignée tourne encore. Un second panneau dit « déconseillée depuis 4.3, murée en 7.0 ».

**Ce que `addScript` n'est PAS en 6.1.3** :

- Ce n'est pas une méthode déjà retirée, ni l'API recommandée pour du code neuf (le JSON WAM l'est).

---

## Étapes Pratiques

### Étape 1 : Lire le JSON parent, sans l'éditer

```bash
ls templates/cassiopeia/joomla.asset.json
```

**Résultat attendu** :

```text
templates/cassiopeia/joomla.asset.json
```

Fichier **parent** : lecture seule (`user.css` / `user.js` via WAM, après LTR/RTL).

---

### Étape 2 : Poser un JSON enfant (ajout, pas homonyme)

Un chemin sans fichier n'est pas enfilé. Exemple pédagogique (`type`, `name`, `uri`), pas une copie du JSON Cassiopeia :

```json
{
  "assets": [
    { "name": "exemple.style", "type": "style", "uri": "css/exemple.css" }
  ]
}
```

**Résultat attendu** :

```text
dispatch() enregistre ce JSON après le parent.
exemple.style est un ajout (pas un homonyme parent).
```

---

### Étape 3 : Remplacer un homonyme (item entier)

Même `type` et même `name` qu'un item **réellement lu** dans le parent. Fournis **tout** l'item (URI, dépendances, attributs). Pas de fusion.

```json
{
  "name": "NOM_PARENT_A_REMPLACER",
  "type": "style",
  "uri": "css/remplacement.css"
}
```

**Résultat attendu** :

```text
Seul l'item enfant reste sous cette clé type+name.
Les autres items parent restent.
Les dépendances non recopiées ont disparu de cet item.
```

---

### Étape 4 : Vérifier que `addScript` est encore là

```bash
grep -n "function addScript" libraries/src/Document/Document.php
```

**Résultat attendu** :

```text
Une méthode addScript est présente dans Document.php du tag 6.1.3.
```

Note : @deprecated 4.3, retrait 7.0. **Pas** : « retiré en Joomla 6 ». Idem `addStyleSheet`.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `ls templates/cassiopeia/joomla.asset.json` | JSON parent (lecture seule) |
| `ls templates/*/joomla.asset.json` | JSON des templates site |
| `grep -n "function addScript" libraries/src/Document/Document.php` | Méthode encore présente en 6.1.3 |
| `grep -n "function addStyleSheet" libraries/src/Document/Document.php` | Idem pour les CSS |

---

## Pièges Fréquents

### Piège 1 : Attendre une fusion champ à champ

⚠️ **Problème** : Tu déclares seulement une URI enfant. `add()` remplace l'item **entier**.

✅ **Solution** : Recopier tout ce qui doit survivre, ou choisir un `name` **nouveau**.

---

### Piège 2 : Éditer le `joomla.asset.json` parent

⚠️ **Problème** : Fichier livré, écrasé à l'update.

✅ **Solution** : JSON sur l'enfant. Parent d'abord, enfant ensuite, homonyme enfant gagne.

---

### Piège 3 : Dire « `addScript` a été retiré en Joomla 6 »

⚠️ **Problème** : Phrase du **manuel** WAM 6.1. Le code 6.1.3 la contredit.

✅ **Solution** : Enseigner l'écart. Code neuf : WAM. Code 6.1.3 : `addScript` existe encore (@deprecated 4.3, retrait 7.0).

---

### Piège 4 : Fusionner l'ordre WAM et l'ordre `html/`

⚠️ **Problème** : « Enfant avant parent » est vrai pour les PHP. Pour le JSON : parent **puis** enfant. Un JSON enfant vide n'efface pas le parent.

✅ **Solution** : Deux phrases distinctes. Pas de fichier = pas d'enregistrement enfant. Assets parent sans homonyme = conservés.

---

## Checklist de Validation

- [ ] Chemins : template site/admin, `media/{name}`
- [ ] Homonyme `type`+`name` = remplacement entier ; parent puis enfant ; sans homonyme le parent reste
- [ ] `addScript` / `addStyleSheet` existent en 6.1.3 (@deprecated 4.3, retrait 7.0) : je ne dis pas « retiré en Joomla 6 »
- [ ] `user.css` / `user.js` passent par le WAM après LTR/RTL

---

## Exercice Pratique

**Énoncé** : Le JSON parent déclare un style `template.exemple` avec une dépendance `font.exemple`. Tu veux changer **seulement** l'URI CSS sur l'enfant, en gardant la dépendance.

- A : item enfant `{ "name": "template.exemple", "type": "style", "uri": "css/local.css" }` sans `dependencies`
- B : « `addScript` est retiré en Joomla 6, donc impossible »

Dis ce que A fait vraiment, pourquoi B est faux, et propose l'item corrigé.

**Indications** :

- Homonyme = remplacement entier
- Manuel WAM vs `Document.php` 6.1.3

**Résultat attendu** : Trois paragraphes : A, B, item avec dépendance recopiée.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**A** : A ne garde **pas** la dépendance. Même `type`+`name` : remplacement **entier**. `font.exemple` disparaît de cet item.

**B** : B est **faux**. Le manuel dit « retiré en Joomla 6 ». En 6.1.3, `addScript` / `addStyleSheet` sont encore là, @deprecated 4.3, retrait 7.0. Pour ce CSS : JSON WAM, pas `addScript`.

**Item corrigé** :

```json
{
  "name": "template.exemple",
  "type": "style",
  "uri": "css/local.css",
  "dependencies": [
    "font.exemple"
  ]
}
```

Les autres assets parent restent. Alternative : un **nouveau** `name` pour un ajout.

---

## Navigation

← Fiche précédente : **[Overrides, layouts et JLayout](04-overrides-layouts-jlayout.md)**

→ Fiche suivante : **[Favicons et limites d'accessibilité](06-favicons-et-accessibilite.md)**
