---
tags:
  - Joomla
  - Intermédiaire
  - Pratique
description: "Indexer Smart Search avec finder:index, lister les 36 commandes CMS, et enseigner les absences (finder_indexer.php, debug:*, plugin console cœur)."
estimated_time: "45 min"
fiche_number: 13
total_fiches: 24
cursus: "Joomla CMS"
id: "web.joomla.finder-cli-et-absences"
course_id: "web.joomla"
content_type: "lesson"
order: 13
---

# 13 - Finder, CLI et absences

> **En bref** : Tu reconstruis l'index Smart Search avec `php cli/joomla.php finder:index`, tu connais les 36 commandes CMS plus `list` et `help` du Framework, et tu arrêtes de chercher `cli/finder_indexer.php`, `debug:*` / `log:*` / `perf:*` ou un plugin console cœur. Lecture estimée : 45 min.

## Prérequis

- Fiche [02 - Installation de Joomla 6.1.3](02-installation-6-1-3.md) : CMS 6.1.3 installé, PHP 8.3 en ligne de commande
- Fiche [01 - CMS, Framework et versions](01-cms-vs-framework-et-versions.md) : distinguer CMS et Framework 4.x vendu dans le CMS
- Fiche [10 - Scheduler : Lazy et Web Cron](10-scheduler-lazy-et-webcron.md) : `scheduler:run` fait partie du même CLI
- Fiche [12 - Modules, chrome et loadmodule](12-modules-chrome-et-loadmodule.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras lancer l'indexation Finder par le CLI unique `php cli/joomla.php`, citer les 36 commandes CMS du tag 6.1.3, et nommer trois absences du cœur.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que `finder:index` ?

**Définition** : `finder:index` est la commande CLI de Smart Search (`com_finder`). Classe : `FinderIndexCommand`. Nom enregistré (`$defaultName`) : `finder:index`. Rôle dans le code : « Purge and rebuild the index ».

**Le problème que `finder:index` résout** :

Sans cette commande, voici les problèmes rencontrés :

1. **Index périmé** : articles, contacts, flux, tags ou catégories changent, la recherche site ne les trouve pas.
2. **Script fantôme** : d'anciens guides « Large Sites » citent `cli/finder_indexer.php`. Ce fichier n'existe plus au tag 6.1.3 (ce n'est pas un script conservé comme déprécié).
3. **Plusieurs prétendus points d'entrée** : au tag 6.1.3, `cli/` ne contient que `joomla.php` et `index.html`.

**Comment `finder:index` résout ces problèmes** : une commande unique sur `cli/joomla.php` purge et reconstruit l'index. Plus de `finder_indexer.php`.

**Analogie concrète** : Le catalogue papier d'une bibliothèque. Tu relances l'inventaire : on jette les anciennes fiches, on réécrit la liste. `cli/finder_indexer.php` est l'ancienne salle : le bâtiment 6.1.3 ne l'a plus.

**Ce que `finder:index` n'est PAS** :

- Ce n'est pas `cli/finder_indexer.php` (absent, pas déprécié).
- Ce n'est pas Solr. Solr n'est pas livré par le cœur.
- Ce n'est pas une commande `debug:*`. L'observabilité la plus proche est la durée et le pic mémoire affichés par `finder:index`.

Les plugins Finder cœur indexent `categories`, `contacts`, `content`, `newsfeeds` et `tags`. L'indexation importe le groupe `finder` et déclenche `onStartIndex`, `onBeforeIndex`, `onBuildIndex`.

---

### Qu'est-ce que le catalogue des 36 commandes CMS ?

**Définition** : Au tag `joomla-cms` 6.1.3, le provider Console et `ConsoleApplication::getDefaultCommands()` enregistrent **36 commandes distinctes**. Sauf mention contraire, les classes sont dans `Joomla\CMS\Console`. `database:export` et `database:import` sont `Joomla\Database\Command\ExportCommand` et `ImportCommand` (`joomla/database` 4.0.0).

**Le problème que ce catalogue résout** :

Sans liste close, voici les problèmes rencontrés :

1. **Commandes imaginées** : tu tapes `debug:cache` ou `log:tail`. Ces familles n'existent pas dans le CMS 6.1.3.
2. **Alias périmé** : tu utilises `core:check-updates` sans savoir que c'est un alias déprécié.
3. **Mélange CMS / Framework** : tu comptes `list` et `help` comme des commandes métier.

**Comment le catalogue résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Commandes imaginées | 36 noms stables, pas un de plus dans le cœur |
| Alias périmé | Un seul alias : `core:check-updates` (retrait 7.0) |
| Mélange CMS / Framework | `list` et `help` sont à part (concept suivant) |

**Analogie concrète** : Le menu d'un restaurant imprimé pour la saison. Si le plat n'est pas sur le menu, la cuisine ne le prépare pas.

**Ce que ce catalogue n'est PAS** :

- Ce n'est pas une exécution live de `list` (noms lus dans le code du tag).
- Ce n'est pas un audit de sécurité : `extension:list` inventorie, il n'audite pas.

Tableau des 36 commandes (tag 6.1.3) :

| Commande | Classe | Rôle |
| -------- | ------ | ---- |
| `cache:clean` | `CleanCacheCommand` | Nettoyer les entrées de cache |
| `config:get` | `GetConfigurationCommand` | Afficher la valeur d'une option de configuration |
| `config:set` | `SetConfigurationCommand` | Définir une option de configuration |
| `core:autoupdate:register` | `AutomatedUpdatesRegisterCommand` | Inscrire le site au service de mise à jour automatique du cœur |
| `core:autoupdate:unregister` | `AutomatedUpdatesUnregisterCommand` | Désinscrire le site |
| `core:update` | `UpdateCoreCommand` | Mettre à jour Joomla |
| `core:update:channel` | `CoreUpdateChannelCommand` | Gérer le canal de mise à jour du cœur |
| `core:update:check` | `CheckJoomlaUpdatesCommand` | Vérifier les mises à jour Joomla |
| `database:export` | `ExportCommand` | Exporter la base |
| `database:import` | `ImportCommand` | Importer la base |
| `extension:disable` | `ExtensionDisableCommand` | Désactiver une extension |
| `extension:discover` | `ExtensionDiscoverCommand` | Découvrir des extensions |
| `extension:discover:install` | `ExtensionDiscoverInstallCommand` | Installer les extensions découvertes |
| `extension:discover:list` | `ExtensionDiscoverListCommand` | Lister les extensions découvertes |
| `extension:enable` | `ExtensionEnableCommand` | Activer une extension |
| `extension:install` | `ExtensionInstallCommand` | Installer une extension depuis une URL ou un chemin |
| `extension:list` | `ExtensionsListCommand` | Lister les extensions installées |
| `extension:remove` | `ExtensionRemoveCommand` | Supprimer une extension |
| `finder:index` | `FinderIndexCommand` | Purger et reconstruire l'index |
| `maintenance:database` | `MaintenanceDatabaseCommand` | Maintenance de la structure de la base |
| `scheduler:list` | `TasksListCommand` | Lister les tâches planifiées |
| `scheduler:run` | `TasksRunCommand` | Exécuter une ou plusieurs tâches planifiées |
| `scheduler:state` | `TasksStateCommand` | Activer, désactiver ou mettre à la corbeille une tâche |
| `session:gc` | `SessionGcCommand` | Collecte des sessions |
| `session:metadata:gc` | `SessionMetadataGcCommand` | Collecte des métadonnées de session |
| `site:create-public-folder` | `SiteCreatePublicFolderCommand` | Créer un dossier public |
| `site:down` | `SiteDownCommand` | Passer le site hors ligne |
| `site:up` | `SiteUpCommand` | Passer le site en ligne |
| `update:extensions:check` | `CheckUpdatesCommand` | Vérifier les mises à jour d'extensions en attente |
| `update:joomla:remove-old-files` | `RemoveOldFilesCommand` | Supprimer les anciens fichiers système |
| `user:add` | `AddUserCommand` | Ajouter un utilisateur |
| `user:addtogroup` | `AddUserToGroupCommand` | Ajouter un utilisateur à un groupe |
| `user:delete` | `DeleteUserCommand` | Supprimer un utilisateur |
| `user:list` | `ListUserCommand` | Lister les utilisateurs |
| `user:removefromgroup` | `RemoveUserFromGroupCommand` | Retirer un utilisateur d'un groupe |
| `user:reset-password` | `ChangeUserPasswordCommand` | Changer le mot de passe d'un utilisateur |

Le seul alias est `core:check-updates` sur `CheckJoomlaUpdatesCommand` (nom canonique `core:update:check`), annoté `@deprecated 5.1.0 will be removed in 7.0`. `extension:enable` fait partie du catalogue depuis 6.1.0.

---

### Qu'est-ce que `list`, `help`, et les absences du cœur ?

**Définition** : Le CMS 6.1.3 épingle `joomla/console` **4.0.0**. `Joomla\Console\Application::getDefaultCommands()` n'instancie que `ListCommand` (`list`) et `HelpCommand` (`help`). Le CMS les fusionne via `parent::getDefaultCommands()` (`array_merge`). Une **absence** est un nom ou un fichier que le tag ne livre pas.

**Le problème que cette distinction résout** :

Sans elle, voici les problèmes rencontrés :

1. **Notice du four comptée comme plat** : tu ranges `list` et `help` dans les 36 commandes métier.
2. **Plugin console imaginé** : tu cherches `plugins/console` dans le cœur.
3. **Familles copiées d'un autre outil** : `debug:*`, `log:*`, `perf:*`.

**Comment le code 6.1.3 tranche** :

| Nom cherché | État au tag 6.1.3 |
| ----------- | ----------------- |
| `list` / `help` | Framework 4.0.0, fusion parent, pas des 36 |
| `cli/finder_indexer.php` | Absent (plus là du tout) |
| `debug:*` / `log:*` / `perf:*` | Aucune commande de ces familles |
| Plugin console cœur | `plugins/console` 404 ; 24 groupes, sans `console` |

`ConsoleApplication::execute()` importe `behaviour`, `system` et `console`, puis `parent::execute()`. Le parent déclenche `application.before_execute`. Le seed `#__extensions` n'insère aucune ligne `folder='console'` ni `plg_console_*`. `importPlugin('console')` n'importe rien sur une install cœur. Un plugin **tiers** peut encore s'enregistrer sur `ApplicationEvents::BEFORE_EXECUTE` : fiche [19 - Plugin console et CLI](19-plugin-console-et-cli.md).

Debug HTTP : Global Configuration et plugin DebugBar / Server-Timing. Ce n'est pas un CLI `debug:*`.

**Analogie concrète** : `list` et `help` sont la notice du fabricant du four. Les 36 commandes sont les plats. L'extincteur `debug:*` n'a jamais été installé dans cet immeuble : tu ne le dessines pas sur le plan.

**Ce que ces noms ne sont PAS** :

- `list` / `help` ne sont pas des commandes métier (utilisateurs, cache, Finder).
- Une absence n'est pas une dépréciation : `core:check-updates` est encore là (retrait 7.0) ; `finder_indexer.php` n'est plus là.

---

## Étapes Pratiques

### Étape 1 : Vérifier le dossier `cli/`

À la racine du CMS 6.1.3 :

```bash
ls cli/
```

**Résultat attendu** :

```text
index.html
joomla.php
```

Aucun `finder_indexer.php`.

---

### Étape 2 : Aide puis indexation Finder

```bash
php cli/joomla.php help finder:index
php cli/joomla.php finder:index
```

**Résultat attendu** :

```text
help reconnaît finder:index (commande Framework qui documente une commande CMS).
finder:index s'exécute : purge puis reconstruction de l'index.
Durée et pic mémoire peuvent s'afficher.
```

Contenus concernés : catégories, contacts, contenu, news feeds, tags.

---

### Étape 3 : Constater les familles absentes

```bash
php cli/joomla.php list
php cli/joomla.php debug:cache
```

**Résultat attendu** :

```text
list affiche les 36 commandes CMS plus list et help.
Aucune ligne debug:, log: ou perf:.
debug:cache n'est pas enregistrée.
```

Ne compte pas `list` et `help` dans les 36.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php cli/joomla.php list` | Lister les commandes (CMS + `list` + `help`) |
| `php cli/joomla.php help finder:index` | Aide de l'indexation Finder |
| `php cli/joomla.php finder:index` | Purger et reconstruire l'index Smart Search |
| `php cli/joomla.php user:list` | Lister les utilisateurs |
| `php cli/joomla.php scheduler:run` | Exécuter des tâches planifiées |
| `php cli/joomla.php extension:list` | Lister les extensions installées |
| `php cli/joomla.php core:update:check` | Vérifier les mises à jour du cœur |

---

## Pièges Fréquents

### Piège 1 : Lancer `cli/finder_indexer.php`

⚠️ **Problème** : Un guide ancien cite `php cli/finder_indexer.php`. Le fichier n'existe pas au tag 6.1.3.

✅ **Solution** : Uniquement `php cli/joomla.php finder:index`.

---

### Piège 2 : Chercher `debug:*`, `log:*` ou `perf:*`

⚠️ **Problème** : Tu importes des habitudes d'un autre outil PHP. Ces familles sont absentes.

✅ **Solution** : Durée / pic mémoire de `finder:index` ; `scheduler:run` pour les tâches ; debug HTTP, pas un CLI `debug:*`.

---

### Piège 3 : `list` / `help`, plugin console, `config:get`, alias

⚠️ **Problème** : Tu ajoutes `list` et `help` aux 36 noms, tu cherches `plugins/console`, tu colles une sortie `config:get` (secret, mot de passe DB, `smtppass` **sans masquage**), ou tu utilises `core:check-updates`.

✅ **Solution** : `list` / `help` = Framework. Pas de plugin console cœur. Ne pas publier `config:get`. Nom canonique : `core:update:check`.

---

## Checklist de Validation

- [ ] Je lance `php cli/joomla.php finder:index` depuis la racine du CMS
- [ ] Je sais que `cli/finder_indexer.php` n'existe plus au tag 6.1.3
- [ ] Je peux m'appuyer sur le tableau des 36 commandes CMS
- [ ] Je distingue `list` / `help` (Framework) des 36 commandes CMS
- [ ] Je ne cherche plus `debug:*`, `log:*` ni `perf:*`
- [ ] Je sais qu'il n'y a pas de plugin console cœur (`plugins/console` 404)

---

## Exercice Pratique

**Énoncé** : Classe chaque entrée : **commande CMS**, **commande Framework**, **absence**.

1. `finder:index`
2. `list`
3. `debug:cache`
4. `cli/finder_indexer.php`
5. `core:check-updates`
6. un plugin `plg_console_*` livré par l'install 6.1.3

**Indications** :

- 36 noms CMS plus un alias déprécié.
- `list` et `help` ne sont pas dans ces 36 noms.
- Une absence n'est pas un alias déprécié.

**Résultat attendu** : Six classements justifiés, sans inventer de commande hors tableau.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

| Entrée | Classe | Justification |
| ------ | ------ | ------------- |
| `finder:index` | commande CMS | Une des 36 ; `FinderIndexCommand` |
| `list` | commande Framework | `ListCommand` de `joomla/console` 4.0.0 |
| `debug:cache` | absence | Aucune famille `debug:*` |
| `cli/finder_indexer.php` | absence | Fichier absent du tag 6.1.3 |
| `core:check-updates` | commande CMS (alias déprécié) | Alias de `core:update:check`, retrait 7.0 |
| `plg_console_*` cœur | absence | Pas de plugin console dans le seed ni dans `plugins/` |

`core:check-updates` n'est pas une absence : l'alias est encore enregistré. Ne plus s'en servir comme nom principal.

---

## Navigation

← Fiche précédente : **[Modules, chrome et loadmodule](12-modules-chrome-et-loadmodule.md)**

→ Fiche suivante : **[Champs personnalisés](14-champs-personnalises.md)**
