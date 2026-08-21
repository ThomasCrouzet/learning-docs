---
tags:
  - Joomla
  - Intermédiaire
  - Pratique
description: "Mail Templates depuis 5.2 (JLayout mailtemplate.php), workflows étapes/transitions (#__workflow_associations), absence de sauvegarde/staging/déploiement cœur."
estimated_time: "40 min"
fiche_number: 16
total_fiches: 24
cursus: "Joomla CMS"
id: "web.joomla.mail-workflows-et-sauvegardes"
course_id: "web.joomla"
content_type: "lesson"
order: 16
---

# 16 - Mail, workflows et sauvegardes

> **En bref** : Tu personnalises le courrier via Mail Templates et le JLayout `mailtemplate.php`, tu relies un contenu à une étape de workflow dans `#__workflow_associations`, et tu traites sauvegarde / staging / déploiement comme une **absence du cœur**. Lecture estimée : 40 min.

## Prérequis

- Fiche [04 - Overrides, layouts et JLayout](04-overrides-layouts-jlayout.md) : surcharge d'un JLayout dans le template site
- Fiche [08 - ACL : authorise et view levels](08-acl-authorise-et-view-levels.md) : changement d'étape réservé
- Fiche [10 - Scheduler : Lazy et Web Cron](10-scheduler-lazy-et-webcron.md)
- Fiche [15 - Site multilingue](15-multilingue.md)
- CMS 6.1.3 (Mail Templates existent depuis 5.2)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras où se trouvent les Mail Templates, ce que fait le chrome `mailtemplate.php`, à quoi sert `#__workflow_associations`, et comment sauvegarder un site **sans** composant cœur de backup, de staging ou de déploiement.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un Mail Template ?

**Définition** : Depuis Joomla **5.2**, le courrier cœur passe par **Mail Templates** (System Dashboard vers Templates). Le chrome HTML est le JLayout `mailtemplate.php` : un tableau à **3 rangées**, surchargeable dans le template site **sans** toucher au core.

**Le problème que les Mail Templates résolvent** :

Sans eux, voici les problèmes rencontrés :

1. **Lettre collée dans le PHP** : changer l'objet ou le corps d'un mail cœur exige d'éditer une extension livrée, écrasée à la mise à jour.
2. **Mise en page hors template** : le HTML du mail n'emprunte pas le même chemin d'override que le site.
3. **Chrome inconnu** : tu stylises le mail dans un CSS site qui n'entre jamais dans le courrier.

**Comment les Mail Templates résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Lettre collée dans le PHP | Textes éditables dans System Dashboard vers Templates |
| Mise en page hors template | JLayout `mailtemplate.php`, même famille d'overrides que la fiche 04 |
| Chrome inconnu | Tableau HTML à 3 rangées, à surcharger dans le template site |

**Analogie concrète** : Un papier à en-tête d'entreprise (trois bandes : haut, corps, pied). Toutes les lettres du siège sortent sur ce papier. Tu changes l'en-tête dans le tiroir « Templates », tu ne réécris pas chaque machine à écrire.

**Ce qu'un Mail Template n'est PAS** :

- Ce n'est pas un composant de newsletter marketing tiers.
- Ce n'est pas `user.css` du template enfant : le courrier n'est pas une page Cassiopeia.
- Ce n'est pas une nouveauté 6.1 : le mécanisme date de 5.2, il est présent en 6.1.3.

Le chemin de surcharge suit la règle JLayout déjà vue : copie sous `html/layouts` du template site. Le fichier cœur `mailtemplate.php` ne s'édite pas.

---

### Qu'est-ce qu'un workflow (étapes et transitions) ?

**Définition** : Un workflow cœur décrit des **étapes** et des **transitions** entre ces étapes. L'affectation se fait **par catégorie**. L'association contenu ↔ étape est stockée dans `#__workflow_associations`. Un changement d'étape ne se fait pas « à la main dans la table » : il passe par le lot Super User ou par ce mécanisme d'associations.

**Le problème que les workflows résolvent** :

Sans eux, voici les problèmes rencontrés :

1. **Publié ou pas** : un booléen unique ne décrit pas « brouillon → relecture → publié ».
2. **Catégorie mélangée** : toutes les catégories partagent le même chemin de validation.
3. **État orphelin** : tu ne sais plus quelle étape est collée à quel item.

**Comment les workflows résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Publié ou pas | Étapes + transitions |
| Catégorie mélangée | Affectation du workflow par catégorie |
| État orphelin | Ligne dans `#__workflow_associations` |

**Analogie concrète** : Un dossier papier qui circule avec un tampon : « à relire », « validé », « publié ». Le tampon actuel est écrit sur une fiche d'accompagnement (`#__workflow_associations`). Changer de tampon n'est pas gratter la fiche au hasard : c'est une transition prévue, ou un lot Super User.

**Ce qu'un workflow n'est PAS** :

- Ce n'est pas un outil de sauvegarde.
- Ce n'est pas le Task Scheduler (fiche [10 - Scheduler : Lazy et Web Cron](10-scheduler-lazy-et-webcron.md)).
- Les événements des plugins `workflow` (Publishing, Featuring, Notification) sont une **convention observée** dans le code 6.1.3 (`getSubscribedEvents`), pas une page manuel 6.1 Current. Ne pas les traiter comme un contrat publié.

Le groupe `plugins/workflow` existe au tag. Le manuel 6.1 Current n'a pas de page Plugin Events pour ce groupe.

---

### Qu'est-ce que l'absence de sauvegarde, staging et déploiement ?

**Définition** : Le CMS 6.1.3 **ne livre pas** de composant cœur de sauvegarde, de staging ou de déploiement. Le guide Backup parle des **fichiers plus la base**, et oriente vers des outils **tiers** : Akeeba (Install from Web), cPanel, `mysqldump`, phpMyAdmin, zip.

**Le problème que cette phrase résout** :

Sans elle, voici les problèmes rencontrés :

1. **Composant fantôme** : tu cherches « Backup » dans les composants cœur comme s'il existait.
2. **CLI pris pour un plan de reprise** : `database:export` / `database:import` exportent ou importent la **base**. Ce n'est pas un composant de sauvegarde complète (fichiers + base + procédure de restore).
3. **Staging inventé** : tu documentes un bouton « préproduction » qui n'existe pas dans le cœur.

**Comment l'absence se traite** :

| Besoin | Outil cité par le guide / le CLI |
| ------ | -------------------------------- |
| Fichiers | zip, gestionnaire de l'hébergeur |
| Base | `mysqldump`, phpMyAdmin, `database:export` (base seule) |
| Paquet tout-en-un | Akeeba (extension **tiers**, Install from Web) |
| Panneau hébergeur | cPanel |
| Staging / déploiement | Hors cœur : à construire ailleurs |

**Analogie concrète** : Un immeuble livré **sans** coffre-fort. Le règlement intérieur dit : apporte ton coffre (Akeeba), ou photocopie les dossiers (`mysqldump`) **et** les cartons de bureaux (zip des fichiers). Dessiner un coffre sur le plan ne le fait pas apparaître.

**Ce que cette absence n'est PAS** :

- Ce n'est pas « Joomla ne peut pas être sauvegardé ». C'est « le cœur ne fournit pas le composant ».
- Ce n'est pas une équivalence Akeeba = core. Akeeba est tiers.
- `database:export` n'est pas un plan de reprise complet.

Enseigner l'absence. Ne pas inventer un composant `com_backup` cœur.

---

## Étapes Pratiques

### Étape 1 : Ouvrir les Mail Templates

Dans l'admin : System Dashboard vers Templates (Mail Templates). Ouvrir un modèle cœur (création de compte, mot de passe, etc. selon ce qui est listé). Repérer objet et corps éditables.

**Résultat attendu** :

```text
Liste de Mail Templates sans édition d'un fichier PHP cœur
Textes du courrier modifiables depuis l'admin
```

---

### Étape 2 : Surcharger le chrome `mailtemplate.php`

Sans copier le fichier cœur ailleurs que dans le template site : override JLayout `mailtemplate.php` (tableau à 3 rangées), sous `html/layouts` du template, comme en fiche 04.

**Résultat attendu** :

```text
Le HTML des mails cœur passe par le JLayout mailtemplate.php
L'override vit dans le template site, pas dans le core
```

---

### Étape 3 : Relier workflow et table d'association

Identifier le workflow affecté à une catégorie d'articles. Publier ou changer d'étape par le mécanisme prévu (transition, ou lot Super User). Ne pas éditer `#__workflow_associations` à la main comme procédure normale.

**Résultat attendu** :

```text
Une ligne #__workflow_associations pour l'item concerné
Changement d'étape via transition / lot Super User, pas via SQL ad hoc
```

---

### Étape 4 : Constat d'absence et plan de sauvegarde tiers

Parcourir les composants cœur : aucun composant sauvegarde / staging / déploiement. Choisir une méthode guide : fichiers + base.

Exemple base seule (outil cité par le guide) :

```bash
mysqldump -u USER -p NOM_DE_LA_BASE > sauvegarde-base.sql
```

Compléter par une archive des fichiers du site (zip ou outil d'hébergeur). Alternative paquet : installer **Akeeba** depuis Install from Web (tiers). `database:export` reste une commande CLI de base, pas un substitut de cette procédure.

**Résultat attendu** :

```text
Pas de composant cœur Backup / Staging / Deploy
Une copie fichiers + une copie base, ou un outil tiers nommé
```

---

## Commandes Utiles

| Commande / lieu | Action |
| --------------- | ------ |
| System Dashboard vers Templates | Éditer les Mail Templates |
| JLayout `mailtemplate.php` | Chrome HTML 3 rangées du courrier |
| `#__workflow_associations` | Table interne item ↔ étape |
| `mysqldump` | Export de base (guide Backup, tiers / serveur) |
| `php cli/joomla.php database:export` | Export de base CLI (pas un backup complet) |
| Akeeba (Install from Web) | Extension **tiers** de sauvegarde |

---

## Pièges Fréquents

### Piège 1 : Éditer le PHP cœur des mails

⚠️ **Problème** : Tu modifies une classe ou un tmpl livré. La mise à jour 6.x l'écrase.

✅ **Solution** : Mail Templates + override JLayout `mailtemplate.php` dans le template site.

---

### Piège 2 : SQL manuel sur `#__workflow_associations`

⚠️ **Problème** : Tu changes l'étape en SQL. Les transitions et droits Super User sont contournés.

✅ **Solution** : Transition prévue ou lot Super User. La table est le stockage, pas l'interface.

---

### Piège 3 : Inventer un backup cœur

⚠️ **Problème** : Tu documentes `com_backup`, un staging intégré, ou tu prends `database:export` pour fichiers + base + restore.

✅ **Solution** : Enseigner l'absence. Guide = fichiers + base, Akeeba, cPanel, `mysqldump`, phpMyAdmin, zip.

---

## Checklist de Validation

- [ ] Je trouve les Mail Templates depuis System Dashboard vers Templates
- [ ] Je sais que `mailtemplate.php` est un JLayout à 3 rangées, surchargeable
- [ ] Je relie étapes / transitions à `#__workflow_associations`
- [ ] Je ne traite pas les événements `plugins/workflow` comme un contrat manuel 6.1
- [ ] Je peux dire : pas de composant cœur sauvegarde / staging / déploiement
- [ ] J'ai un plan fichiers + base (ou Akeeba tiers)

---

## Exercice Pratique

**Énoncé** : On te demande trois livrables pour un 6.1.3 de production.

1. Changer le pied des e-mails cœur sans toucher au core.
2. Savoir où est stockée l'étape de workflow d'un article.
3. Proposer une sauvegarde avant une mise à jour `core:update`.

Pour chaque livrable : outil **cœur** ou **tiers / absence**, et la manip concrète.

**Indications** :

- Mail Templates depuis 5.2 ; chrome = `mailtemplate.php`.
- Table `#__workflow_associations`.
- Guide Backup : pas de composant cœur.

**Résultat attendu** : Trois paires (outil, manip), sans inventer `com_backup`.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

1. **Cœur.** Mail Templates (System Dashboard vers Templates) pour les textes. Override JLayout `mailtemplate.php` (tableau 3 rangées) dans le template site pour le chrome. Pas d'édition du PHP livré.
2. **Cœur (table interne).** L'étape est associée dans `#__workflow_associations`. Affectation du workflow par catégorie. Changement par transition ou lot Super User.
3. **Absence de composant cœur.** Copier les fichiers (zip / cPanel) **et** la base (`mysqldump` / phpMyAdmin). Ou Akeeba (tiers, Install from Web). `database:export` = base seule, pas un plan de reprise.

---

## Navigation

← Fiche précédente : **[Site multilingue](15-multilingue.md)**

→ Fiche suivante : **[Manifeste PSR-4 et com_example](17-manifeste-psr4-com-example.md)**
