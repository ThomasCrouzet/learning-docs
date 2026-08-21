---
tags:
  - Joomla
  - Intermédiaire
  - Pratique
description: "Schémas SQL install, uninstall et update/schémas, première install sans fichiers update, version manifeste distincte de #__schemas, pkg_*.xml, updateservers extension ou collection."
estimated_time: "45 min"
fiche_number: 18
total_fiches: 24
cursus: "Joomla CMS"
---

# 18 - SQL, packages et update servers

> **En bref** : Tu sépares SQL d'install, de désinstall et de mise à jour (`<update><schemas>`), tu n'attends pas les fichiers update à la première install, tu ne confonds pas `<version>` et `#__schemas.version_id`, et tu publies un `pkg_*.xml` avec un updateserver `extension` ou `collection`. Lecture estimée : 45 min.

## Prérequis

- Fiche [17 - Manifeste PSR-4 et com_example](17-manifeste-psr4-com-example.md) : manifeste namespacé, `<files>`, `com_example`
- Fiche [07 - Montée de 5.4 vers 6](07-montee-5-4-vers-6.md) : mise à jour d'un CMS déjà installé (autre sujet : le cœur, pas ton ZIP)
- Fiche [13 - Finder, CLI et absences](13-finder-cli-et-absences.md) : `extension:install`, `extension:list`
- Un outil pour zipper des archives (ZIP)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras déclarer les trois blocs SQL d'un manifeste, expliquer pourquoi la première install n'exécute pas les fichiers d'update, distinguer `<version>` et `version_id`, et assembler un package `pkg_*.xml` avec un serveur de mises à jour.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que `<install>`, `<uninstall>` et `<update><schemas>` ?

**Définition** : Le manifeste d'extension sépare trois familles de SQL :

- `<install>` : scripts exécutés à la **première installation**
- `<uninstall>` : scripts exécutés à la **désinstallation**
- `<update><schemas>` : scripts de **mise à jour de schéma** pour une extension **déjà** installée

**Le problème que ces trois blocs résolvent** :

Sans eux, voici les problèmes rencontrés :

1. **Création et migration mélangées** : un seul SQL « fait tout », cassant soit l'install neuve, soit la montée de version.
2. **Désinstall sale** : tables orphelines après `extension:remove`.
3. **Schéma figé** : tu publies 1.0.1 sans chemin SQL depuis 1.0.0.

**Comment les trois blocs résolvent ces problèmes** :

| Bloc | Quand il s'exécute |
| ---- | ------------------ |
| `<install>` | Première install |
| `<uninstall>` | Désinstallation |
| `<update><schemas>` | Updates suivants, pas la première install |

**Analogie concrète** : Un meuble en kit. La notice « premier montage » (`<install>`) n'est pas la liasse « pièces de rechange 2024, 2025 » (`<update><schemas>`). La notice « démontage » (`<uninstall>`) est un troisième document.

**Ce que ces blocs ne sont PAS** :

- `<update><schemas>` n'est pas un second `<install>`.
- Le SQL d'update n'est pas le lieu où poser le schéma initial « au cas où ».
- Cette séparation n'est pas le composant `com_joomlaupdate` du CMS (mise à jour du cœur).

Le détail des noms de fichiers SQL (mysql, postgresql, etc.) se lit dans le tutoriel 6.1 et `com_contact`, pas dans le tableau manifeste « Out of date » (fiche 17).

---

### Qu'est-ce que la première install (les fichiers update ne s'exécutent pas) ?

**Définition** : À la **première installation**, Joomla exécute le SQL d'`<install>`. Les fichiers déclarés sous `<update><schemas>` **ne s'exécutent pas**. Joomla **mémorise seulement le dernier** identifiant de schéma. Les prochains ZIP d'update partiront de ce cran.

**Le problème que cette règle résout** :

Sans elle, voici les problèmes rencontrés :

1. **SQL d'update « pour être sûr »** : tu mets tout le schéma dans un fichier d'update. L'install neuve ne le joue pas. Tables absentes.
2. **Double exécution imaginée** : tu crois que install + update tournent ensemble la première fois.
3. **Cran oublié** : tu ne vérifies pas ce que Joomla a mémorisé.

**Comment le cœur tranche** :

| Situation | SQL joué | Mémoire |
| --------- | -------- | ------- |
| Première install | `<install>` seulement | Dernier schéma mémorisé, **sans** jouer les fichiers update |
| Update ultérieur | Fichiers `<update><schemas>` depuis le cran mémorisé | `version_id` avance |

**Analogie concrète** : Tu achètes l'appareil neuf. Tu suis la notice « première mise en service ». Les bulletins « si le modèle 2023 est déjà en service » restent dans l'enveloppe. Le fabricant note au feutre le dernier bulletin **applicable plus tard**. Il ne les applique pas aujourd'hui.

**Ce que cette mémoire n'est PAS** :

- Ce n'est pas une exécution silencieuse des fichiers update.
- Ce n'est pas un bug si tes fichiers update « n'ont rien fait » le jour J de l'install neuve.

---

### Qu'est-ce que `<version>` vs `#__schemas.version_id` ?

**Définition** : La balise `<version>` du manifeste est la version **d'extension** affichée / comparée côté gestionnaire. La colonne `#__schemas.version_id` est le cran **SQL** mémorisé. Les deux **ne sont pas corrélés** : ce n'est pas le même champ, pas la même obligation de valeur.

**Le problème que cette distinction résout** :

Sans elle, voici les problèmes rencontrés :

1. **Égalité inventée** : tu mets `<version>1.2.0</version>` et tu crois que `version_id` vaut `1.2.0`.
2. **Mauvais cran SQL** : un fichier d'update ne part pas du `version_id` réel.
3. **Confusion d'identifiants** : tu mélanges aussi `id` et `element` dans `#__extensions`.

**Analogie concrète** : L'étiquette sur le carton (`<version>`, « modèle 1.2.0 ») et le numéro gravé **dans** le mécanisme (`version_id`, dernier bulletin SQL). On peut coller une nouvelle étiquette sans que le numéro interne soit la même chaîne.

**Ce que `<version>` n'est PAS** :

- Ce n'est pas `version_id`.
- Ce n'est pas `id` d'une ligne `#__extensions` (autre piège : `id` ≠ `element`).

---

### Qu'est-ce qu'un package `pkg_*.xml` et un updateserver ?

**Définition** : Un **package** zippe des archives filles (composant, module, plugin, ...) avec un manifeste `pkg_<packagename>.xml`. Un **update server** se déclare dans `<updateservers>` avec le type **`extension`** (un produit) ou **`collection`** (un catalogue). La publication d'updates = XML d'update + ZIP aligné sur `<downloadurl>`.

**Le problème que package + updateserver résolvent** :

Sans eux, voici les problèmes rencontrés :

1. **Cinq ZIP à la main** : l'admin installe composant, module et plugin séparément, versions désalignées.
2. **Pas de canal de mise à jour** : chaque site télécharge un ZIP à la main.
3. **XML et ZIP désalignés** : `<downloadurl>` pointe un fichier qui n'est pas le ZIP publié.

**Comment ils résolvent ces problèmes** :

| Besoin | Mécanisme |
| ------ | --------- |
| Plusieurs extensions, une install | `pkg_<packagename>.xml` + ZIP filles |
| Un produit, un flux | `<updateservers>` type `extension` |
| Un catalogue de produits | type `collection` |
| Fichier téléchargé | ZIP **aligné** sur `<downloadurl>` |

**Analogie concrète** : Un carton d'expédition (`pkg_*.xml`) contient plusieurs boîtes scellées (ZIP filles). L'étiquette du transporteur (`<downloadurl>`) doit désigner **ce** carton, pas un autre. Le type `extension` est une fiche produit unique ; `collection` est le catalogue du magasin.

**Ce qu'un package n'est PAS** :

- Ce n'est pas le manifeste du composant seul (`com_example.xml` ≠ `pkg_example.xml`).
- Un updateserver n'est pas `com_joomlaupdate` TUF du cœur.
- `blockChildUninstall` (piège de packaging) n'est pas un updateserver.

Installation d'une extension : ZIP, dossier, URL ou JED. CLI : `extension:install`.

---

## Étapes Pratiques

### Étape 1 : Déclarer les trois blocs SQL

Dans le manifeste de `com_example` (tutoriel 6.1 / modèle `com_contact`), prévoit les trois familles, sans copier le tableau « Out of date » :

```xml
<install>
</install>
<uninstall>
</uninstall>
<update>
  <schemas>
  </schemas>
</update>
```

Le schéma **initial** va dans `<install>`. Les deltas vont dans `<schemas>`.

**Résultat attendu** :

```text
Trois blocs distincts dans le XML
Le schéma de première install n'est pas seulement un fichier d'update
```

---

### Étape 2 : Vérifier la première install

Installe le ZIP sur un site qui n'a **pas** encore l'extension. Contrôle les tables créées par `<install>`. Contrôle `#__schemas` : un `version_id` est mémorisé. Les fichiers d'update **n'ont pas** besoin de s'être exécutés.

**Résultat attendu** :

```text
Tables présentes grâce à `<install>`
version_id renseigné
Aucun prétexte à coller tout le schéma dans un fichier update « pour la première fois »
```

---

### Étape 3 : Assembler un package et déclarer l'updateserver

Zippe les archives filles + `pkg_<packagename>.xml`. Dans le manifeste concerné, déclare `<updateservers>` type `extension` **ou** `collection`. Publie un XML d'update dont `<downloadurl>` est le ZIP réel.

**Résultat attendu** :

```text
Un ZIP package installable en une fois
Type extension ou collection, pas un troisième type inventé
downloadurl = fichier réellement téléchargeable
```

Vérifier après install :

```bash
php cli/joomla.php extension:list
```

---

## Commandes Utiles

| Commande / balise | Action |
| ----------------- | ------ |
| `<install>` / `<uninstall>` | SQL première install / désinstall |
| `<update><schemas>` | SQL des updates **ultérieurs** |
| `#__schemas.version_id` | Cran SQL mémorisé (≠ `<version>`) |
| `pkg_<packagename>.xml` | Manifeste de package |
| `<updateservers>` type `extension` | Flux d'un produit |
| `<updateservers>` type `collection` | Flux catalogue |
| `php cli/joomla.php extension:install` | Installer depuis un chemin ou une URL |
| `php cli/joomla.php update:extensions:check` | Vérifier les mises à jour d'extensions |

---

## Pièges Fréquents

### Piège 1 : Tout mettre dans les fichiers update

⚠️ **Problème** : Première install : les fichiers update **ne s'exécutent pas**. Tables absentes.

✅ **Solution** : Schéma initial dans `<install>`. Updates = deltas. Joomla mémorise le dernier cran sans les jouer le jour J.

---

### Piège 2 : `<version>` = `#__schemas.version_id`

⚠️ **Problème** : Tu égalises les deux chaînes dans ta tête. Le manifeste 6.1 les distingue.

✅ **Solution** : `<version>` = version d'extension. `version_id` = cran SQL. Pas corrélés.

---

### Piège 3 : Package, `id` ≠ `element`, plugin sans `group`

⚠️ **Problème** : Manifeste mal nommé (`pkg_` oublié), `id` confondu avec `element`, plugin sans `group`, `blockChildUninstall` mal compris, XML d'update dont le ZIP n'est pas celui de `<downloadurl>`.

✅ **Solution** : `pkg_<packagename>.xml` + ZIP filles. `element` = nom technique. Type d'updateserver : `extension` ou `collection`. Alignement octet du ZIP publié.

---

## Checklist de Validation

- [ ] Je sépare `<install>`, `<uninstall>` et `<update><schemas>`
- [ ] Je sais que la première install ne joue pas les fichiers update
- [ ] Je distingue `<version>` et `#__schemas.version_id`
- [ ] Je zippe un package avec `pkg_<packagename>.xml`
- [ ] Je déclare un updateserver `extension` ou `collection`
- [ ] Mon XML d'update pointe le ZIP réel (`<downloadurl>`)

---

## Exercice Pratique

**Énoncé** : Tu publies `com_example` 1.0.0 puis 1.1.0.

1. Un site **neuf** installe 1.0.0. Quel bloc SQL tourne ? Les fichiers d'update 1.0.0→1.1.0 tournent-ils ?
2. Le même site passe à 1.1.0. Quel bloc tourne ?
3. `<version>1.1.0</version>` implique-t-il `version_id = 1.1.0` ?
4. Tu veux livrer `com_example` + un module : quel manifeste enveloppe ?
5. Tu exposes un flux pour **cette** extension seule : quel type d'`<updateservers>` ?

**Indications** :

- Première install : update **non** exécuté, dernier cran mémorisé.
- Types : `extension` ou `collection`.

**Résultat attendu** : Cinq réponses courtes, sans inventer un troisième type d'updateserver.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

1. **`<install>` seulement.** Les fichiers `<update><schemas>` **ne s'exécutent pas**. Joomla mémorise le dernier cran de schéma.
2. **Les fichiers `<update><schemas>`** depuis le cran mémorisé (delta vers 1.1.0), pas un second `<install>` complet.
3. **Non.** `<version>` du manifeste ≠ `#__schemas.version_id`. Pas de corrélation obligatoire.
4. **`pkg_<packagename>.xml`** plus les ZIP filles (composant, module).
5. **`extension`.** `collection` serait un catalogue de plusieurs produits.

---

## Navigation

← Fiche précédente : **[Manifeste PSR-4 et com_example](17-manifeste-psr4-com-example.md)**

→ Fiche suivante : **[Plugin console et CLI](19-plugin-console-et-cli.md)**
