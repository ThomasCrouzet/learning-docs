---
tags:
  - Joomla
  - Intermédiaire
  - Pratique
description: "Tâches planifiées Joomla 6.1 : Lazy XOR Web Cron, trois tâches actives à l'install, CLI scheduler:run / list / state, pas de debug:*."
estimated_time: "35 min"
fiche_number: 10
total_fiches: 24
cursus: "Joomla CMS"
---

# 10 - Scheduler : Lazy et Web Cron

> **En bref** : Le Task Scheduler 6.1 exécute des plugins `task` soit en Lazy (défaut, activité site), soit en Web Cron (`curl` + hash), jamais les deux ; trois tâches sont actives dès l'installation. Lecture estimée : 35 min.

## Prérequis

- Fiche [02 - Installation de Joomla 6.1.3](02-installation-6-1-3.md)
- Fiche [09 - Cache : trois couches](09-cache-trois-couches.md)
- PHP >= 8.3 en CLI pour `php cli/joomla.php`
- Accès Super User à **Composants** vers **Tâches planifiées**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras choisir **un seul** déclencheur (Lazy **ou** Web Cron), nommer les trois tâches actives à l'install, et lancer `scheduler:list`, `scheduler:run` et `scheduler:state` sans chercher de commande `debug:*`.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le Task Scheduler ?

**Définition** : Depuis Joomla 4.1, **Scheduled Tasks** (menu Composants) lance des actions répétées, comme un cron, **à l'intérieur** du CMS. En 6.1, ce sont des plugins du groupe `task`.

Le guide 6.1 dresse **onze** types cœur (Delete Action Logs, Privacy Consents, GET Requests, Global Check-in, Image Size Check, Update Notification, Rotate Logs, Set Site Offline / Online, Toggle Offline, Session Data Purge).

Le tag 6.1.3 aligne **neuf** dossiers `plugins/task/{checkfiles,deleteactionlogs,globalcheckin,privacyconsent,requests,rotatelogs,sessiongc,sitestatus,updatenotification}`. `sitestatus` fournit **trois** routines hors ligne : onze types pour neuf dossiers.

**Le problème que le scheduler résout** :

Sans lui, tu purges les sessions, tu tournes les logs et tu vérifies les mises à jour à la main, ou tu écris un cron PHP hors CMS.

**Analogie concrète** : Un tableau de corvées. Soit un passage dans la cuisine déclenche la prochaine corvée due (Lazy), soit une sonnerie extérieure sonne toutes les minutes (Web Cron).

**Ce que le scheduler n'est PAS** :

- Ce n'est pas un composant de sauvegarde. Le cœur n'en a pas.
- Ce n'est pas `cli/finder_indexer.php` (absent en 6.1.3).
- Ce n'est pas un groupe d'événements documenté dans les 5 pages Plugin Events du manuel 6.1 : `plugins/task` existe dans le code, hors ce catalogue.

---

### Lazy XOR Web Cron

**Définition** : Deux déclencheurs, **mutuellement exclusifs**. Tu n'en actives **qu'un**.

Le code `ScheduleRunner` (détail interne du tag, pas un contrat d'API publié) part de :

- `lazy_scheduler.enabled` = **true** (défaut)
- `webcron.enabled` = **false**

Un hash Web Cron **faux** répond **403**.

| Déclencheur | Qui lance | Garantie d'horaire | Défaut |
| ----------- | --------- | ------------------ | ------ |
| **Lazy** | Activité site (frontend ou admin) et JS associé | **Non** : une tâche due attend le prochain visiteur | Activé |
| **Web Cron** | Cron hébergeur : `curl` GET vers `com_ajax` avec un hash | Oui, à la granularité du cron (souvent 1 minute) | Désactivé |

Forme du GET Web Cron (guide 6.1, hash généré par le CMS) :

```bash
curl --request GET 'https://exemple.test/component/ajax/?plugin=RunSchedulerWebcron&group=system&format=json&hash=auto-generated-hash'
```

**Le problème que l'exclusion résout** :

Si les deux sont ON, **les deux** exécutent. Le site peut souffrir quand Lazy arrive sur une tâche prête **avant** le cron.

**Comment choisir** :

| Situation | Choix |
| --------- | ----- |
| Site avec du trafic, horaires souples (purge 24 h, logs 30 jours) | Lazy (défaut) |
| Tâche avec expression cron précise, trafic faible ou nul la nuit | Web Cron, puis **désactiver** Lazy |
| Hash copié de travers | HTTP **403** |

**Analogie concrète** : Deux réveils pour la même corvée. Un seul doit sonner.

**Ce que Lazy n'est PAS** : pas une garantie d'horaire (sans visiteur, rien ne tourne), pas un cron système.

**Ce que Web Cron n'est PAS** : l'écran Options **affiche le lien**, le cron se crée **chez l'hébergeur**. Hash inventé = 403.

---

### Trois tâches actives à l'installation

**Définition** : À l'install ou à la mise à jour 6.1, **trois** tâches cœur sont **activées** :

| Tâche | Période | Rôle |
| ----- | ------- | ---- |
| Session Data Purge | toutes les **24 heures** | Purge des sessions expirées et métadonnées |
| Joomla! Update Notification | toutes les **24 heures** | Vérifie les nouvelles versions ; il faut une liste d'e-mails Super User pour recevoir le message |
| Rotate Logs | tous les **30 jours** | Rotation des **fichiers** de logs, pas des tables d'action logs |

Les autres types existent en plugins, mais ne tournent pas tant que tu ne les as pas planifiés.

**Le problème que ces trois défauts résolvent** :

Sans elles, `#__session` grossit, tu rates une 6.1.3, les fichiers de logs s'allongent.

**Analogie concrète** : Un magasin livre trois routines dès l'ouverture : vider la caisse des tickets expirés, lire le catalogue fournisseur, classer les archives papier. D'autres routines existent dans le catalogue, mais elles ne tournent pas tant que tu ne les as pas ajoutées à l'emploi du temps.

**Ce que ces trois tâches ne sont PAS** :

- Rotate Logs **n'est pas** Delete Action Logs. Le guide insiste : fichiers, pas les tables d'action logs.
- Update Notification **n'envoie rien** tant que la liste d'e-mails Super User est vide. Avec les mises à jour automatiques du cœur, le mail est moins nécessaire, mais la tâche reste active.
- Ce n'est pas `session:gc` CLI : cette commande existe à part (`SessionGcCommand`). La tâche `sessiongc` est le plugin planifié.

---

### CLI `scheduler:*` et absence de `debug:*`

**Définition** : Le CLI unique du tag 6.1.3 est `php cli/joomla.php` (36 commandes). Trois concernent le scheduler :

| Commande | Classe | Rôle |
| -------- | ------ | ---- |
| `scheduler:list` | `TasksListCommand` | Lister les tâches planifiées |
| `scheduler:run` | `TasksRunCommand` | Exécuter une ou plusieurs tâches |
| `scheduler:state` | `TasksStateCommand` | Activer, désactiver ou mettre à la corbeille |

Il n'existe **aucune** commande `debug:*`, `log:*` ou `perf:*`. Debug et logs se règlent dans Configuration globale et le plugin HTTP DebugBar / Server-Timing. L'observabilité CLI la plus proche d'une durée est `scheduler:run` (durée par tâche) et `finder:index` (durée, pic mémoire).

**Le problème que ces trois commandes résolvent** :

Lazy attend un visiteur. En CLI tu listes, tu forces une exécution, tu changes l'état **sans** HTTP. Il n'existe pas de `debug:scheduler`. Le tag n'a pas d'arbre `plugins/console/`.

**Analogie concrète** : Le tableau d'affichage d'une gare liste les trains, lance un départ, ou met une rame hors service. Il n'y a pas de bouton « debug train ». Pour le diagnostic, tu regardes l'horloge et le journal papier, pas une commande magique `debug:*`.

---

## Étapes Pratiques

### Étape 1 : Lire les Options et n'activer qu'un déclencheur

1. **Composants** vers **Tâches planifiées**.
2. Ouvre **Options** (Lazy Scheduler / Web Cron).

**Résultat attendu sur une install neuve** :

```text
Lazy Scheduler : activé
Web Cron       : désactivé
```

Si tu actives Web Cron : copie le lien hash, crée le cron hébergeur, **puis désactive Lazy**. Ne laisse pas les deux à ON.

---

### Étape 2 : Vérifier les trois tâches actives

Dans la liste des tâches, contrôle l'état des trois défauts.

**Résultat attendu** :

```text
Session Data Purge             : active, intervalle 24 heures
Joomla! Update Notification    : active, intervalle 24 heures
Rotate Logs                    : active, intervalle 30 jours
```

Pour la notification : renseigne les e-mails Super User, sinon aucun message ne part.

---

### Étape 3 : Lister et exécuter en CLI

Depuis la racine du CMS :

```bash
php cli/joomla.php scheduler:list
php cli/joomla.php scheduler:run
```

**Résultat attendu** :

```text
scheduler:list affiche les tâches (dont les trois actives).
scheduler:run exécute les tâches dues et rapporte une durée par tâche.
Aucune commande debug:* n'apparaît dans php cli/joomla.php list.
```

Pour changer d'état (activer, désactiver, corbeille) :

```bash
php cli/joomla.php scheduler:state
```

La commande demande l'identifiant et le nouvel état (suis le `help` de la commande).

---

### Étape 4 : (Option Web Cron) Poser le curl chez l'hébergeur

Active Web Cron, copie le hash, **désactive Lazy**. Chez l'hébergeur, cron (souvent toutes les minutes) avec le GET du guide `com_ajax` / `RunSchedulerWebcron` / `hash=...`. Hash faux : **403**.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php cli/joomla.php scheduler:list` | Lister les tâches planifiées |
| `php cli/joomla.php scheduler:run` | Exécuter une ou plusieurs tâches (durée par tâche) |
| `php cli/joomla.php scheduler:state` | Activer, désactiver ou mettre à la corbeille |
| `php cli/joomla.php list` | Catalogue CLI (36 commandes) ; **pas** de `debug:*` / `log:*` / `perf:*` |
| `curl --request GET '...RunSchedulerWebcron...&hash=...'` | Déclencher le Web Cron |

---

## Pièges Fréquents

### Piège 1 : Lazy et Web Cron ensemble

⚠️ **Problème** : Les deux exécutent. Pic de charge, tâches lancées deux fois.

✅ **Solution** : XOR. Défaut = Lazy seul. Web Cron = cron hébergeur **puis** Lazy OFF.

---

### Piège 2 : Croire que Lazy tourne la nuit sans visiteur

⚠️ **Problème** : Session Data Purge « toutes les 24 h » n'a pas tourné pendant un week-end sans trafic.

✅ **Solution** : Accepter l'imprécision, ou passer en Web Cron. Lazy **n'est pas** une garantie d'horaire.

---

### Piège 3 : Chercher `debug:*`

⚠️ **Problème** : Tu tapes `php cli/joomla.php debug:scheduler` ou `debug:tasks`. Commande absente.

✅ **Solution** : Pas de `debug:*`, `log:*`, `perf:*` en 6.1.3. Debug = Configuration globale + plugin HTTP. Durée = sortie de `scheduler:run`.

---

### Piège 4 : Confondre Rotate Logs et Delete Action Logs

⚠️ **Problème** : Tu attends que la tâche 30 jours vide `#__action_logs`.

✅ **Solution** : Rotate Logs = **fichiers**. Delete Action Logs est un **autre** type, inactif tant que tu ne le planifies pas.

---

### Piège 5 : Hash Web Cron copié à la main

⚠️ **Problème** : 403. `ScheduleRunner` refuse un hash faux.

✅ **Solution** : Copier le lien généré dans Options, pas un hash inventé.

---

## Checklist de Validation

- [ ] Je traite Lazy et Web Cron comme exclusifs (XOR)
- [ ] Je nomme les trois tâches actives à l'install (sessions 24 h, notif update 24 h, rotation logs 30 jours)
- [ ] Je distingue Rotate Logs (fichiers) et Delete Action Logs (tables)
- [ ] Je lance `scheduler:list`, `scheduler:run`, `scheduler:state`
- [ ] Je sais qu'il n'existe pas de `debug:*` / `log:*` / `perf:*`
- [ ] Je sais qu'un hash Web Cron faux répond 403

---

## Exercice Pratique

**Énoncé** : Un site vitrine a peu de visites le week-end. Lazy est ON, Web Cron est ON aussi « pour être sûr ». Un administrateur cherche `php cli/joomla.php debug:tasks` pour voir pourquoi Session Data Purge n'a pas tourné samedi. Rotate Logs est censé vider les action logs.

Corrige les quatre erreurs. Propose les trois commandes CLI scheduler du cœur 6.1.3. Nomme les trois tâches actives à l'install avec leur période.

**Indications** :

- XOR des déclencheurs.
- Catalogue CLI : 36 commandes, pas de `debug:*`.

**Résultat attendu** : Liste d'erreurs corrigées + trois commandes + trois tâches.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Erreurs corrigées** :

1. Lazy **et** Web Cron ON : n'en garder **qu'un**. Pour un week-end sans visiteur, Web Cron + Lazy OFF (Lazy n'a aucune garantie d'horaire).
2. `debug:tasks` **n'existe pas**. Pas de `debug:*` / `log:*` / `perf:*`. Utiliser `scheduler:list` et `scheduler:run`.
3. Rotate Logs ne vide **pas** les tables d'action logs.
4. Session Data Purge en Lazy n'a pas tourné samedi faute de visiteur : comportement attendu du Lazy.

**Commandes** :

```bash
php cli/joomla.php scheduler:list
php cli/joomla.php scheduler:run
php cli/joomla.php scheduler:state
```

**Trois tâches actives à l'install** :

- Session Data Purge : 24 heures
- Joomla! Update Notification : 24 heures
- Rotate Logs : 30 jours

---

## Navigation

← Fiche précédente : **[Cache : trois couches](09-cache-trois-couches.md)**

→ Fiche suivante : **[SEF, menus et Itemid](11-sef-menus-et-itemid.md)**
