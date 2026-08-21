---
tags:
  - Joomla
  - Intermédiaire
  - Référence
description: "Poser des favicons hors des fichiers livrés du ZIP Update, et enseigner l'absence de skip-link Cassiopeia, l'absence de niveau WCAG, et les classes a11y Atum."
estimated_time: "30 min"
fiche_number: 6
total_fiches: 24
cursus: "Joomla CMS"
---

# 06 - Favicons et limites d'accessibilité

> **En bref** : Tu poses les favicons sous `media/templates/.../images` pour qu'ils survivent au ZIP Update, tu n'édites pas `logo.svg` livré, et tu enseignes les absences : pas de skip-link Cassiopeia, pas de niveau WCAG 2.x. Lecture estimée : 30 min.

## Prérequis

- Fiche 5 : [Web Asset Manager](05-web-asset-manager.md)
- Fiche 3 : [Template enfant Cassiopeia](03-template-enfant-cassiopeia.md) (ne pas éditer le parent)
- Un site 6.1.3 et, si possible, le ZIP Update `Joomla_6.1.3-Stable-Update_Package.zip` en local

## Objectif de cette fiche

À la fin de cette fiche, tu sauras où poser un favicon pour qu'il ne soit pas écrasé à l'update, et tu sauras citer trois absences : skip-link Cassiopeia, niveau WCAG 2.x, et le fait que les classes a11y utilisateur sont celles d'Atum.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que les favicons livrés dans `media/system/images` ?

**Définition** : Cassiopeia 6.1.3 enregistre `joomla-favicon.svg`, `favicon.ico` et `joomla-favicon-pinned.svg` via `HTMLHelper::_('image', ..., [], true, 1)` (`returnPath` 1 = URL du premier fichier `images/` trouvé). Ces trois fichiers sont **livrés** sous `media/system/images/`. Le ZIP Update 6.1.3 les contient. Les éditer = **écrasés** à la copie (`Folder::copy` / extract web, homonyme).

Au tag git, `media/` n'existe pas (`.gitignore`) ; les sources sont `build/media_source/system/images`. Le ZIP **Full** n'a pas été listé : tu n'inventes pas son arbre. `deleteUnexistingFiles()` n'a pas d'entrée favicon en 6.1.3 ; cette commande n'infirme ni ne prouve un écrasement.

**Le problème que connaître cet emplacement résout** :

Sans le connaître, voici les problèmes rencontrés :

1. **Écrasement à l'update** : tu édites `media/system/images/favicon.ico`.
2. **Git pris pour le paquet** : tu cherches `media/` dans le tag.
3. **Guide mal lu** : « will not be affected » ne vise **pas** ces fichiers livrés.

Listing local du ZIP Update 6.1.3 (`unzip -l`, 20 août 2026) :

| Chemin dans le ZIP Update | Présent |
| ------------------------- | ------- |
| `media/system/images/favicon.ico` | oui (2019 octets) |
| `media/system/images/joomla-favicon.svg` | oui |
| `media/system/images/joomla-favicon-pinned.svg` | oui |
| `media/templates/site/cassiopeia/images/` | oui (dossier) |
| `media/templates/site/cassiopeia/images/favicon.ico` | **non** |
| `media/templates/site/cassiopeia/images/joomla-favicon.svg` | **non** |
| `media/templates/site/cassiopeia/images/logo.svg` | **oui** |
| `media/templates/site/cassiopeia/images/select-bg*.svg` | oui |
| `media/templates/site/cassiopeia/images/template_preview.png` | oui |
| `media/templates/site/cassiopeia/images/template_thumbnail.png` | oui |

**Analogie concrète** : `media/system/images/favicon.ico` est l'affiche du hall, réimprimée à chaque carton Update.

**Ce que ces trois fichiers ne sont PAS** :

- Ce n'est pas un fichier sous Cassiopeia `images/` (les trois noms favicon y sont absents du ZIP).
- Ce n'est pas `logo.svg` : `logo.svg` **est** dans le ZIP Update, sous Cassiopeia `images/`.

---

### Qu'est-ce que le scénario « will not be affected » ?

**Définition** : Déposer les **mêmes trois noms** sous `media/templates/site/cassiopeia/images` (ou sous les `images/` d'un enfant / autre template) est le scénario « will not be affected ». Ces noms **ne sont pas** dans le ZIP Update sous Cassiopeia `images/`. Un extra hors ZIP est **conservé**.

Pour un template héritable, la recherche va : `media/templates/{client}/{child}/images`, puis parent, puis `media/system/images`. Child Templates : les fichiers enfant « are not affected by Joomla updates » (même idée que `user.css`).

**Le problème que ce dépôt résout** :

Sans lui, voici les problèmes rencontrés :

1. **Édition des livrés** : `media/system/images/` ou `logo.svg` Cassiopeia.
2. **Conflit de guides** : « ne pas modifier les médias parents » et « will not be affected » visent des **fichiers différents**.
3. **`logo.svg` traité comme un favicon Cassiopeia** : `logo.svg` **est** dans le ZIP. L'éditer = **écrasé**.

| Phrase de guide | Fichiers visés |
| --------------- | -------------- |
| will not be affected | les **trois noms non livrés** sous Cassiopeia `images/` |
| ne pas modifier les médias parents | fichiers **livrés** (logo, CSS, favicons **system**) |
| fichiers enfant hors updates | tout fichier de l'enfant |

**Analogie concrète** : Coller ton dessin sur **ta porte** (images du template, noms absents du carton). Le carton réimprime l'affiche du hall et le logo usine.

**Ce que ce scénario n'est PAS** :

- Ce n'est pas une autorisation d'éditer `logo.svg`.
- Ce n'est pas le ZIP Full (non listé).
- Ce n'est pas une garantie éternelle via `deleteUnexistingFiles()` (liste non énumérée ici).

---

### Qu'est-ce que l'absence de skip-link dans Cassiopeia ?

**Définition** : Cassiopeia est documenté « accessible » et responsive (contraste fond/texte, WebAIM). Son `index.php` n'a **pas** de **lien d'évitement** (skip-link). Cette absence est un fait du tag.

**Le problème que nommer cette absence résout** :

Sans la nommer, voici les problèmes rencontrés :

1. **Skip-link inventé** : tu l'affirmes parce que le guide dit accessible.
2. **Skip-link ajouté dans le parent** : édition core (fiches 03-04 : l'enfant, et ce cursus n'invente pas le markup).
3. **Atum et Cassiopeia fusionnés** : tu cherches sur le site les classes a11y d'Atum.

**Analogie concrète** : La brochure dit « immeuble accessible ». Tu cherches la rampe qui contourne l'escalier d'entrée. Elle n'est pas là. Tu notes l'absence. Tu ne la dessines pas sur le plan.

**Ce que cette absence n'est PAS** :

- Ce n'est pas « Cassiopeia est inaccessible » : le guide parle d'accessible / contraste. C'est une **autre** phrase, sans skip-link.
- Ce n'est pas un skip-link Atum réutilisé par le site.

---

### Qu'est-ce que l'absence de niveau WCAG 2.x ?

**Définition** : **Aucun niveau WCAG 2.x** n'est déclaré pour Cassiopeia ou Atum dans les sources 6.1 inspectées. L'Accessibility Statement (16 décembre 2022) parle de WCAG 2.1 / ATAG 2.0 pour **Joomla 4**, pas Cassiopeia 6.1.3. Le manuel vise WCAG 2.2 AA pour les **extensions** (hub inachevé). `/docs/accessibility/wcag/` en 6.1 est **404**.

**Le problème que cette absence de niveau résout** :

Sans l'enseigner, voici les problèmes rencontrés :

1. **Badge inventé** : « Cassiopeia 6.1.3 est WCAG 2.2 AA ».
2. **Statement 2022 collé sur 6.1.3**.
3. **404 ignoré** : tu cites `/docs/accessibility/wcag/` comme page 6.1.

| Source | Niveau WCAG pour Cassiopeia / Atum 6.1.3 |
| ------ | ---------------------------------------- |
| Guide Cassiopeia | mot « accessible », **pas** de niveau 2.x |
| Statement 16 déc. 2022 | Joomla **4** / WCAG 2.1 |
| Hub Accessibility 6.1 | 2.2 AA visé pour les **extensions**, inachevé |
| `/docs/accessibility/wcag/` | **404** |

**Analogie concrète** : La notice dit « économe ». L'étiquette énergétique chiffrée n'est pas collée. Une ancienne notice (2022) parle d'un **autre** modèle.

**Ce qu'un niveau WCAG n'est PAS ici** :

- Ce n'est pas « interdit d'être accessible ». C'est « pas de niveau 2.x déclaré pour ces templates ».
- Ce n'est pas l'objectif extensions (2.2 AA visé) transféré au template site.

---

### Qu'est-ce que les classes a11y utilisateur d'Atum ?

**Définition** : **Atum** (template **administrateur**) applique des classes a11y **par utilisateur** : `a11y_mono`, `a11y_contrast`, `a11y_highlight`, `a11y_font`, plus `data-color-scheme` / `data-bs-theme`. Ces classes **ne sont pas documentées pour le template site**.

**Le problème que cette distinction résout** :

Sans elle, voici les problèmes rencontrés :

1. **Chercher `a11y_mono` sur le site public**.
2. **Promettre les mêmes options aux visiteurs**.
3. **Éditer Atum pour changer le site**.

| Template | Client | Skip-link `index.php` | Classes a11y utilisateur |
| -------- | ------ | --------------------- | ------------------------ |
| Cassiopeia | site | **non** | non documentées pour le site |
| Atum | admin | (hors skip-link site) | `a11y_mono`, `a11y_contrast`, `a11y_highlight`, `a11y_font` |

**Analogie concrète** : Les boutons contraste du **bureau** (Atum) n'existent pas au **hall** (Cassiopeia).

**Ce qu'Atum n'est PAS** :

- Ce n'est pas le template site, ni une déclaration WCAG 2.x, ni un skip-link Cassiopeia.

---

## Étapes Pratiques

### Étape 1 : Lister le ZIP Update

```bash
unzip -l Joomla_6.1.3-Stable-Update_Package.zip | grep -E "favicon|logo.svg|cassiopeia/images"
```

**Résultat attendu** (extraits) :

```text
media/system/images/favicon.ico
media/system/images/joomla-favicon.svg
media/system/images/joomla-favicon-pinned.svg
media/templates/site/cassiopeia/images/logo.svg
```

Pas de `media/templates/site/cassiopeia/images/favicon.ico` dans ce ZIP.

---

### Étape 2 : Poser les trois noms hors fichiers livrés

Copie `favicon.ico`, `joomla-favicon.svg`, `joomla-favicon-pinned.svg` vers `media/templates/site/cassiopeia/images/` **ou** `media/templates/site/TON_ENFANT/images/`. N'écrase ni `media/system/images/` ni `logo.svg` Cassiopeia.

**Résultat attendu** :

```text
Les trois noms existent sous media/templates/.../images/.
media/system/images/ et logo.svg parent sont intacts.
```

---

### Étape 3 : Constater skip-link absent et classes Atum

```bash
grep -ni "skip" templates/cassiopeia/index.php || echo "aucun skip dans index.php Cassiopeia"
grep -n "a11y_mono\|a11y_contrast\|a11y_highlight\|a11y_font" administrator/templates/atum -r | head
```

**Résultat attendu** :

```text
aucun skip dans index.php Cassiopeia
Des occurrences a11y_* dans Atum (admin seulement)
```

---

### Étape 4 : Noter l'absence WCAG

```text
1. Aucun niveau WCAG 2.x déclaré pour Cassiopeia / Atum 6.1.3.
2. Le guide dit « accessible » : ce n'est pas un niveau 2.x.
3. Statement 2022 = Joomla 4 / WCAG 2.1, pas Cassiopeia 6.1.3.
4. /docs/accessibility/wcag/ en 6.1 = 404.
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `unzip -l Joomla_6.1.3-Stable-Update_Package.zip \| grep favicon` | Favicons **livrés** dans l'Update |
| `ls media/system/images/favicon.ico` | Favicon système (écrasable) |
| `ls media/templates/site/cassiopeia/images/` | Médias Cassiopeia (`logo.svg` livré) |
| `grep -ni "skip" templates/cassiopeia/index.php` | Absence de skip-link |
| `grep -n "a11y_mono" administrator/templates/atum -r` | Classes a11y Atum |

---

## Pièges Fréquents

### Piège 1 : Éditer `media/system/images/favicon.ico`

⚠️ **Problème** : Nom livré, dans le ZIP Update, écrasé à l'update.

✅ **Solution** : Mêmes noms sous `media/templates/site/cassiopeia/images` ou sous l'enfant.

---

### Piège 2 : Éditer `logo.svg` Cassiopeia

⚠️ **Problème** : `logo.svg` **est** dans le ZIP Update. « will not be affected » ne s'applique **pas**.

✅ **Solution** : Média parent livré. Un logo durable va sur l'enfant.

---

### Piège 3 : Inventer skip-link ou WCAG 2.2 AA

⚠️ **Problème** : `index.php` Cassiopeia n'a pas de skip-link. Aucun niveau 2.x n'est déclaré. Page wcag 6.1 = 404. Statement 2022 = Joomla 4.

✅ **Solution** : Enseigner les absences. Ne pas éditer le parent pour « corriger le guide ».

---

### Piège 4 : Chercher `a11y_contrast` sur le site public

⚠️ **Problème** : Classes Atum (admin), par utilisateur, non documentées pour Cassiopeia.

✅ **Solution** : Admin = Atum. Site = Cassiopeia, sans ces classes dans la doc site.

---

## Checklist de Validation

- [ ] Favicons livrés = `media/system/images` (ZIP Update) ; mêmes noms sous Cassiopeia/enfant `images/` = conservés
- [ ] `logo.svg` Cassiopeia **est** dans le ZIP Update (écrasable)
- [ ] Pas de skip-link Cassiopeia ; aucun niveau WCAG 2.x ; `a11y_*` = Atum
- [ ] ZIP Full non listé : je n'invente pas son arbre

---

## Exercice Pratique

**Énoncé** : Un collègue veut : (1) remplacer le favicon, (2) retoucher `logo.svg` « comme le favicon », (3) écrire « Cassiopeia 6.1.3 : WCAG 2.2 AA, skip-link, classes `a11y_contrast` pour les visiteurs ». Corrige les trois points.

**Indications** :

- ZIP Update : favicons system = oui ; favicons Cassiopeia `images/` = non ; `logo.svg` = oui
- Skip-link absent ; pas de niveau WCAG 2.x ; `a11y_contrast` = Atum

**Résultat attendu** : Trois corrections, sans édition des livrés du parent.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

1. **Favicon** : ne pas éditer `media/system/images/favicon.ico`. Déposer les trois noms sous `media/templates/site/cassiopeia/images/` ou sous l'enfant (absents du ZIP sous Cassiopeia `images/`).
2. **Logo** : `logo.svg` **est** dans le ZIP Update. Pas le même cas. Le poser sur l'enfant, pas sur le parent livré.
3. **README** : pas de skip-link Cassiopeia ; pas de niveau WCAG 2.x (statement 2022 = Joomla 4 ; wcag 6.1 = 404) ; `a11y_contrast` (et `a11y_mono`, `a11y_highlight`, `a11y_font`) = Atum, pas les visiteurs.

---

## Navigation

← Fiche précédente : **[Web Asset Manager](05-web-asset-manager.md)**

→ Fiche suivante : **[Montée de 5.4 vers 6](07-montee-5-4-vers-6.md)**
