---
tags:
  - Joomla
  - Intermédiaire
  - Pratique
description: "Composant namespacé 6.1 : namespace path src, services/provider.php (MVCFactory, DispatcherFactory, ComponentInterface), tutoriel com_example, modèle com_contact."
estimated_time: "45 min"
fiche_number: 17
total_fiches: 24
cursus: "Joomla CMS"
---

# 17 - Manifeste PSR-4 et com_example

> **En bref** : Tu déclares `<namespace path="src">`, tu enregistres MVCFactory, DispatcherFactory et ComponentInterface dans `services/provider.php`, et tu t'appuies sur le tutoriel `com_example` 6.1 plus `com_contact`, pas sur le tableau de manifeste marqué « Out of date ». Lecture estimée : 45 min.

## Prérequis

- Fiche [01 - CMS, Framework et versions](01-cms-vs-framework-et-versions.md) : types d'extensions et CMS 6.1.3
- Fiche [08 - ACL : authorise et view levels](08-acl-authorise-et-view-levels.md) : `authorise` dans un composant
- Fiche [16 - Mail, workflows et sauvegardes](16-mail-workflows-et-sauvegardes.md)
- PHP 8.3 et un CMS 6.1.3 sur lequel installer un ZIP

## Objectif de cette fiche

À la fin de cette fiche, tu sauras lire un manifeste de composant namespacé 6.1, citer les trois services de `provider.php`, prendre `com_example` (tutoriel) et `com_contact` (cœur) comme modèles, et ignorer le tableau de balises 6.1 marqué « Out of date ».

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un manifeste avec `<namespace path="src">` ?

**Définition** : Un composant (ou module) moderne déclare dans son XML d'extension :

```xml
<namespace path="src">My\Component\Example</namespace>
```

Le namespace PHP est PSR-4 sous le dossier `src/`. La classe disque doit correspondre au namespace. L'élément du composant tutoriel est `com_example`. Après install, l'entrée site est `index.php?option=com_example`.

**Le problème que ce manifeste résout** :

Sans lui, voici les problèmes rencontrés :

1. **Ancien layout J3** : classes à la racine du composant, sans namespace, incompatibles avec le boot 6.x attendu.
2. **Tableau officiel périmé** : la page manifeste 6.1 porte la mention « Out of date » ; la config composants pointe encore un tutoriel J3.x.
3. **`<files>` incomplet** : un dossier oublié n'est pas copié à l'install ; la classe n'existe pas sur le disque.

**Comment le manifeste namespacé résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Ancien layout J3 | PSR-4 sous `src/` + balise `<namespace path="src">` |
| Tableau périmé | Tutoriel `com_example` 6.1 + composant cœur `com_contact` |
| `<files>` incomplet | Lister chaque dossier à installer, dont `src` et `services` |

**Analogie concrète** : Une adresse postale (namespace) et une rue réelle (`src/`). Si l'adresse dit `My\Component\Example\Hello` et que le fichier n'est pas `src/Hello.php` dans ce quartier, le facteur (autoloader) ne livre pas.

**Ce qu'un manifeste namespacé n'est PAS** :

- Ce n'est pas le tableau de balises 6.1 « Out of date ».
- Ce n'est pas un tutoriel J3.x de configuration de composant.
- Ce n'est pas le Framework installé à part : le CMS vend déjà `joomla/*` 4.x.

Cinq types courants : composants, modules, plugins, templates, langues ; plus packages, files, libraries. Cette fiche : **composant**. Packages et SQL : fiche [18 - SQL, packages et update servers](18-sql-packages-updateservers.md).

---

### Qu'est-ce que `services/provider.php` ?

**Définition** : `services/provider.php` enregistre dans le conteneur DI au moins trois contrats pour un composant : **MVCFactory**, **DispatcherFactory**, **ComponentInterface**. C'est le contrat du tutoriel `com_example` 6.1. Un module enregistre l'équivalent Module au lieu de ComponentInterface.

**Le problème que `provider.php` résout** :

Sans ce fichier, voici les problèmes rencontrés :

1. **Composant non bootable** : `bootComponent()` ne trouve pas de `ComponentInterface`.
2. **MVC à la main** : pas de factory pour instancier modèle / vue / contrôleur namespacés.
3. **Dispatcher manquant** : `getDispatcher()->dispatch()` n'a rien à instancier.

**Comment `provider.php` résout ces problèmes** :

| Service | Rôle |
| ------- | ---- |
| `MVCFactory` | Crée les classes MVC du namespace |
| `DispatcherFactory` | Crée le dispatcher du composant |
| `ComponentInterface` | Point d'entrée `bootComponent()` |

**Analogie concrète** : L'accueil d'un immeuble. Trois badges : qui fabrique les bureaux (MVC), qui oriente les visiteurs (dispatcher), qui représente l'entreprise dans le hall (`ComponentInterface`). Sans accueil, l'immeuble n'ouvre pas.

**Ce que `provider.php` n'est PAS** :

- Ce n'est pas un script CLI. Le plugin console est la fiche [19 - Plugin console et CLI](19-plugin-console-et-cli.md).
- Ce n'est pas `Factory::getDbo()`. Le provider parle au conteneur DI.
- Ce n'est pas un fichier optionnel sur un composant 6.1 namespacé : sans lui, le boot décrit ci-dessus n'a pas les trois services.

Le contenu PHP exact du tutoriel n'est pas recopié ici (source : tutoriel 6.1 `com_example`, pas le tableau manifeste périmé). Tu ouvres le fichier du tutoriel ou celui de `com_contact` et tu y retrouves **ces trois enregistrements**.

---

### Qu'est-ce que `com_example` vs `com_contact` ?

**Définition** : **`com_example`** est le composant **tutoriel** 6.1 namespacé. **`com_contact`** est le **modèle cœur** déjà installé dans 6.1.3. Les deux illustrent manifeste PSR-4 + `provider.php`. Le tableau de balises du manuel 6.1 est marqué « Out of date » : on ne s'en sert pas comme checklist.

**Le problème que ce choix de sources résout** :

Sans lui, voici les problèmes rencontrés :

1. **Tableau tamponné périmé** : le manuel 6.1 marque le tableau de balises « Out of date ».
2. **Tutoriel J3.x** : la page config composants pointe encore un modèle non namespacé.
3. **ZIP qui n'ouvre pas** : sans `com_example` 6.1 ni `com_contact`, tu omets `provider.php`.

**Analogie concrète** : Deux maisons témoins. `com_contact` est la maison déjà construite dans la résidence (cœur). `com_example` est le plan du promoteur pour 6.1 (tutoriel). Le plan affiché dans le hall avec un tampon « Out of date » (tableau manifeste) n'est plus la référence.

**Ce que ces modèles ne sont PAS** :

- `com_example` n'est pas un composant livré par défaut comme `com_contact`.
- `com_contact` n'est pas un tutoriel pas-à-pas ; c'est le code cœur à lire.
- Le jalon fil rouge « Module puis `com_example` » réussit si l'install répond à `option=com_example` avec namespace + `provider.php`. Échec typique : dossier oublié dans `<files>` ; classe ≠ chemin disque.

---

## Étapes Pratiques

### Étape 1 : Lire le modèle cœur `com_contact`

Dans l'arbre 6.1.3, ouvre le manifeste de `com_contact` et `services/provider.php`. Repère :

```xml
<namespace path="src">
```

Puis, dans `provider.php`, les enregistrements MVCFactory, DispatcherFactory, ComponentInterface.

**Résultat attendu** :

```text
Balise namespace path="src" présente
provider.php enregistre les trois services
Le chemin src/ correspond au namespace (PSR-4)
```

---

### Étape 2 : Recopier le contrat dans un manifeste `com_example`

Pour un composant tutoriel, le namespace documenté du jalon est :

```xml
<namespace path="src">My\Component\Example</namespace>
```

Inclus `src` et `services` dans `<files>`. Place `services/provider.php` à la racine d'extension attendue par le tutoriel 6.1.

**Résultat attendu** :

```text
Le XML porte namespace path="src"
Aucun dossier MVC namespacé n'est omis de `<files>`
provider.php existe dans le ZIP
```

Ne complète pas les autres balises depuis le tableau 6.1 « Out of date ». Ouvre le tutoriel `com_example` 6.1.

---

### Étape 3 : Installer et appeler `option=com_example`

ZIP (ou dossier / URL / JED). Installer. Appeler :

```text
index.php?option=com_example
```

**Résultat attendu** :

```text
Le composant répond (pas une page d'option inconnue)
Les classes PSR-4 se chargent depuis src/
```

Si une classe manque : `<files>` incomplet ou namespace ≠ chemin disque.

---

## Commandes Utiles

| Commande / balise | Action |
| ----------------- | ------ |
| `<namespace path="src">…</namespace>` | Déclarer le PSR-4 du composant |
| `services/provider.php` | Enregistrer MVCFactory, DispatcherFactory, ComponentInterface |
| `index.php?option=com_example` | Entrer dans le composant tutoriel |
| `php cli/joomla.php extension:install` | Installer une extension depuis un chemin ou une URL |
| `php cli/joomla.php extension:list` | Vérifier que `com_example` est installé |
| Tutoriel `com_example` 6.1 + `com_contact` | Sources à jour, pas le tableau « Out of date » |

---

## Pièges Fréquents

### Piège 1 : Tableau manifeste 6.1 « Out of date »

⚠️ **Problème** : Tu listes les balises depuis le tableau officiel périmé, ou depuis un tutoriel de config J3.x.

✅ **Solution** : Tutoriel `com_example` 6.1 namespacé et code `com_contact`.

---

### Piège 2 : Dossier oublié dans `<files>`

⚠️ **Problème** : `src/` ou `services/` absent du ZIP. L'install réussit à moitié ; le boot échoue.

✅ **Solution** : Chaque dossier nécessaire est nommé dans `<files>`. Contrôle post-install : fichiers présents sur le disque.

---

### Piège 3 : Classe ≠ chemin disque

⚠️ **Problème** : Namespace `My\Component\Example` et fichier hors `src/` ou mauvais sous-dossier.

✅ **Solution** : PSR-4 strict : namespace + `path="src"` = arborescence réelle.

---

## Checklist de Validation

- [ ] Je déclare `<namespace path="src">` dans le manifeste
- [ ] Je place les classes sous `src/` (PSR-4)
- [ ] `services/provider.php` enregistre MVCFactory, DispatcherFactory, ComponentInterface
- [ ] Je prends `com_example` 6.1 et `com_contact` comme modèles
- [ ] J'ignore le tableau manifeste 6.1 « Out of date »
- [ ] Après install, `option=com_example` répond

---

## Exercice Pratique

**Énoncé** : Un développeur te donne trois sources pour écrire `com_example` en 6.1.3. Pour chacune, **garder** ou **écarter**, avec une phrase.

1. Tableau des balises de manifeste du manuel 6.1, bandeau « Out of date »
2. Tutoriel composant J3.x encore lié depuis la page config composants
3. `administrator/components/com_contact/services/provider.php` du tag 6.1.3
4. Un manifeste sans `<namespace>` mais avec des fichiers PHP à la racine « comme en J3 »
5. Un ZIP où `<files>` omet le dossier `services`

**Indications** :

- Contrats 6.1 : namespace `path="src"` + trois services.
- `com_contact` = modèle cœur ; `com_example` = tutoriel 6.1.

**Résultat attendu** : Cinq décisions garder / écarter.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

1. **Écarter.** Tableau 6.1 marqué « Out of date » : pas une checklist.
2. **Écarter.** Tutoriel J3.x : pas le contrat namespacé 6.1.
3. **Garder.** `com_contact` est le modèle cœur : y lire MVCFactory, DispatcherFactory, ComponentInterface.
4. **Écarter.** Sans `<namespace path="src">`, ce n'est pas le composant moderne du tutoriel 6.1.
5. **Écarter (ZIP incomplet).** Sans `services/`, `provider.php` n'est pas installé ; le boot n'a pas les trois services.

Source à utiliser en plus du (3) : tutoriel **`com_example` 6.1** namespacé.

---

## Navigation

← Fiche précédente : **[Mail, workflows et sauvegardes](16-mail-workflows-et-sauvegardes.md)**

→ Fiche suivante : **[SQL, packages et update servers](18-sql-packages-updateservers.md)**
