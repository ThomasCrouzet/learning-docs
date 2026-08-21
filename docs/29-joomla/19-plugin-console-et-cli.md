---
tags:
  - Joomla
  - Intermédiaire
  - Pratique
description: "Plugin group=console, commande hello:world, catalogue CLI 6.1.3 (36 commandes CMS plus list/help) et fuite de secrets via config:get."
estimated_time: "50 min"
fiche_number: 19
total_fiches: 24
cursus: "Joomla CMS"
---

# 19 - Plugin console et CLI

> **En bref** : Ajouter une commande CLI via un plugin `group="console"` (événement `BEFORE_EXECUTE`, `hello:world`), distinguer les 36 commandes CMS des commandes framework `list`/`help`, et refuser de traiter `config:get` comme un affichage anodin. Lecture estimée : 50 min.

## Prérequis

- Avoir lu [SQL, packages et update servers](18-sql-packages-updateservers.md)
- Avoir lu [Finder, CLI et absences](13-finder-cli-et-absences.md) (point d'entrée `php cli/joomla.php`, absence de `debug:*`)
- Avoir lu [Manifeste PSR-4 et com_example](17-manifeste-psr4-com-example.md) (structure d'extension, `<files>`)
- PHP 8.3.0 minimum, tag CMS **6.1.3**, accès au dossier d'installation

## Objectif de cette fiche

À la fin de cette fiche, tu sauras enregistrer une commande `hello:world` dans un plugin `group="console"`, citer le catalogue CLI du cœur 6.1.3, et  expliquer pourquoi `config:get` affiche les secrets sans masquage.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un plugin `group="console"` ?

**Définition** : Un plugin `group="console"` est une extension qui, au moment de l'événement `ApplicationEvents::BEFORE_EXECUTE` (`application.before_execute`), appelle `getApplication()->addCommand()` pour ajouter une `AbstractCommand` au CLI `php cli/joomla.php`.

**Le problème que ce plugin résout** :

Sans ce groupe, voici les problèmes rencontrés :

1. **Pas d'extension du CLI** : les 36 commandes CMS sont figées dans le provider `Console` et `getDefaultCommands()`. Tu ne peux pas y ajouter `hello:world` sans modifier le cœur.
2. **Scripts hors CMS** : un fichier PHP isolé n'a pas la session `session.cli`, ni le conteneur, ni `#__extensions`.
3. **Confusion avec le web** : une tâche d'administration exposée en HTTP n'est pas une commande terminal.

**Comment le plugin console résout ces problèmes** :

| Problème | Solution apportée par le plugin console |
| -------- | --------------------------------------- |
| CLI figé du cœur | `addCommand()` pendant `BEFORE_EXECUTE` |
| Script isolé | Même application `Joomla\Console\Application` que le cœur |
| Tâche exposée en HTTP | Exécution uniquement via `php cli/joomla.php` |

**Analogie concrète** : Le CLI du CMS est un pupitre d'usine avec 36 boutons d'origine. Un plugin console visse un bouton supplémentaire, uniquement s'il est installé. L'usine ne livre pas ce bouton : `plugins/console` est absent du tag 6.1.3.

**Ce qu'un plugin console n'est PAS** :

- Ce n'est pas un plugin cœur. `plugins/console` est 404 au tag 6.1.3. Les 24 groupes sous `plugins/` n'incluent pas `console`. Le seed `#__extensions` (`installation/sql/mysql/base.sql`) n'insère aucune ligne `folder='console'` ni `plg_console_*`.
- Ce n'est pas le mécanisme des commandes cœur. Celles-ci passent par le service provider `Console` et `getDefaultCommands()`, pas par `importPlugin('console')`. Sur une install neuve, `importPlugin('console')` n'importe rien.
- Ce n'est pas documenté dans la table Plugin Events 6.1. `BEFORE_EXECUTE` est hors des 5 pages manuelles. Le tutoriel 6.1 Hello World est la source de ce branchement.

**Contrat d'enregistrement (tutoriel 6.1)** : `SubscriberInterface` ; `getSubscribedEvents()` mappe `ApplicationEvents::BEFORE_EXECUTE` vers `registerCommands()` ; `addCommand()` d'une `AbstractCommand` ; Hello World pose `$defaultName = 'hello:world'` ; `doExecute` ramène `0`.

`ConsoleApplication::execute()` importe les groupes `behaviour`, `system` et `console`, puis appelle `parent::execute()`. Le parent déclenche `BEFORE_EXECUTE` avant `doExecute()`. Un site déjà installé peut avoir un plugin console **tiers** dans `#__extensions` ; ce n'est pas le cœur.

---

### Les 36 commandes CMS, plus `list` et `help`

**Définition** : Au tag 6.1.3, le seul point d'entrée CLI post-install est `php cli/joomla.php` (PHP >= 8.3.0). Le CMS y enregistre **36 noms distincts**. Le framework `joomla/console` 4.0.0, épinglé par `composer.lock`, ajoute `list` et `help`. Ces deux noms ne sont pas des commandes métier CMS.

**Le problème que ce catalogue résout** :

Sans catalogue figé, voici les problèmes rencontrés :

1. **Chercher `debug:*` / `log:*` / `perf:*`** : ces familles n'existent pas dans le CLI 6.1.3.
2. **Compter `list` comme une 37e commande métier** : `list` et `help` viennent de `Joomla\Console\Application::getDefaultCommands()` (`ListCommand`, `HelpCommand`). Le CMS les fusionne via `parent::getDefaultCommands()` (`array_merge`) sans remplacer la liste parente.
3. **Relancer `cli/finder_indexer.php`** : ce fichier est absent (le dossier `cli/` ne contient que `joomla.php` et `index.html`). L'indexation est `finder:index`.

**Comment le catalogue 6.1.3 se construit** :

| Source | Noms |
| ------ | ---- |
| Provider `Console.php` + `WritableContainerLoader` | 24 commandes via `getDefaultName()` |
| `getDefaultCommands()` CMS | 13 autres, dont `CheckJoomlaUpdatesCommand` déjà dans le chargeur |
| Total CMS distinct | **36** (le chevauchement `core:update:check` n'est compté qu'une fois) |
| Parent framework 4.0.0 | `list`, `help` seulement |

**Familles des 36 commandes CMS** :

| Famille | Commandes |
| ------- | --------- |
| Cache / config | `cache:clean`, `config:get`, `config:set` |
| Cœur | `core:autoupdate:register`, `core:autoupdate:unregister`, `core:update`, `core:update:channel`, `core:update:check` |
| Base | `database:export`, `database:import` |
| Extensions | `extension:disable`, `extension:discover`, `extension:discover:install`, `extension:discover:list`, `extension:enable`, `extension:install`, `extension:list`, `extension:remove` |
| Finder / maintenance | `finder:index`, `maintenance:database` |
| Scheduler | `scheduler:list`, `scheduler:run`, `scheduler:state` |
| Session | `session:gc`, `session:metadata:gc` |
| Site | `site:create-public-folder`, `site:down`, `site:up` |
| Mises à jour | `update:extensions:check`, `update:joomla:remove-old-files` |
| Utilisateurs | `user:add`, `user:addtogroup`, `user:delete`, `user:list`, `user:removefromgroup`, `user:reset-password` |

**Analogie concrète** : `list` et `help` sont la légende imprimée sur le pupitre (mode d'emploi). Les 36 boutons CMS sont les commandes d'exploitation. Confondre la légende avec un 37e bouton d'exploitation fausse l'inventaire.

**Ce que ce catalogue n'est PAS** :

- Ce n'est pas une suite d'audit de sécurité d'extensions. `extension:list` inventorie, il n'audite pas.
- Ce n'est pas le script d'installation `installation/joomla.php install` documenté par le guide (autre point d'entrée, hors post-install).
- Le seul alias de nom est `core:check-updates` sur `core:update:check` (`@deprecated 5.1.0`, retrait **7.0**).

---

### `config:get` affiche les secrets sans masquage

**Définition** : `GetConfigurationCommand` (`config:get`) affiche la valeur d'une option de configuration. Sur le tag 6.1.3, cette commande affiche le tableau (secret de site, mot de passe de base, `smtppass`) **sans masquage**.

**Le problème que cette connaissance résout** :

Sans le savoir, voici les problèmes rencontrés :

1. **Fuite dans un ticket** : coller la sortie de `config:get` dans Git, un chat ou un PDF d'exercice expose `$secret` et le mot de passe DB.
2. **Fausse analogie avec la barre de debug HTTP** : celle-ci masque `password|secret|token|smtppass`. Le CLI ne masque pas.
3. **Confondre lecture et durcissement** : lire `configuration.php` via CLI n'est pas une rotation de secrets.

**Comment tu t'en sers sans fuite** :

| Situation | Conduite |
| --------- | -------- |
| Vérifier une clé non secrète | `config:get` sur cette clé, sortie locale |
| Secret / mot de passe / `smtppass` | Ne pas copier la sortie hors de la machine |
| Partage d'écran ou PDF | Rédiger à la main (`***`) avant toute capture |

**Analogie concrète** : `config:get` est un tiroir-caisse ouvert. La vitrine HTTP (barre de debug) cache les billets. Le tiroir CLI les montre tous.

**Ce que `config:get` n'est PAS** : ni un export anonyme, ni l'équivalent CLI de la rédaction HTTP.

---

## Étapes Pratiques

### Étape 1 : Lister le CLI depuis la racine CMS

Place-toi à la racine de l'installation 6.1.3 (là où se trouve `cli/joomla.php`).

```bash
php cli/joomla.php list
```

**Résultat attendu** :

- Les 36 noms CMS du tableau ci-dessus apparaissent.
- `list` et `help` apparaissent aussi (framework 4.0.0).
- Aucune commande `debug:*`, `log:*` ou `perf:*`.
- `hello:world` est **absent** sur une install cœur (pas de plugin console livré).

Le nom `list` est celui de `ListCommand::$defaultName` dans `joomla/console` 4.0.0.

---

### Étape 2 : Exécuter une commande cœur

```bash
php cli/joomla.php user:list
```

**Résultat attendu** : la liste des utilisateurs du site. C'est le jalon CLI du fil rouge, avec `scheduler:run`, `finder:index` et `extension:list`.

Pour l'aide d'une commande :

```bash
php cli/joomla.php help user:list
```

---

### Étape 3 : Enregistrer `hello:world`

Crée un plugin dont le manifeste porte `group="console"`. Dans la classe d'extension, mappe `BEFORE_EXECUTE` puis ajoute une `AbstractCommand` dont `$defaultName` vaut `hello:world`.

```php
public static function getSubscribedEvents(): array
{
    // Branchement du tutoriel 6.1 : hors table Plugin Events.
    return [
        ApplicationEvents::BEFORE_EXECUTE => 'registerCommands',
    ];
}

public function registerCommands(): void
{
    $this->getApplication()->addCommand(new HelloWorldCommand());
}
```

Dans la commande :

```php
protected static $defaultName = 'hello:world';

protected function doExecute($input, $output): int
{
    // Le tutoriel Hello World ramène doExecute à 0 (succès).
    return 0;
}
```

Installe le ZIP du plugin, active-le, puis :

```bash
php cli/joomla.php hello:world
```

**Résultat attendu** : code de sortie `0`. Si `$defaultName` est manquant, la commande n'est pas adressable sous `hello:world`.

---

### Étape 4 : Vérifier l'absence du groupe cœur

Contrôle ces faits sur le tag, pas sur un wiki J3 :

1. Le dossier `plugins/console` n'existe pas (24 groupes, sans `console`).
2. `#__extensions` d'une install neuve n'a pas `folder='console'`.
3. Les commandes `user:list` et `config:get` fonctionnent **sans** plugin console.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php cli/joomla.php list` | Lister les commandes (CMS + `list`/`help`) |
| `php cli/joomla.php help <nom>` | Afficher l'aide d'une commande |
| `php cli/joomla.php hello:world` | Commande du plugin tutoriel (absente du cœur) |
| `php cli/joomla.php user:list` | Lister les utilisateurs |
| `php cli/joomla.php scheduler:run` | Exécuter des tâches planifiées |
| `php cli/joomla.php finder:index` | Purger et reconstruire l'index Finder |
| `php cli/joomla.php extension:list` | Lister les extensions installées |
| `php cli/joomla.php config:get` | Affichage de configuration **sans masquage des secrets** |
| `php cli/joomla.php core:update:check` | Vérifier les mises à jour (pas l'alias `core:check-updates`) |

---

## Pièges Fréquents

### Piège 1 : Chercher un plugin console cœur

⚠️ **Problème** : tu ouvres `plugins/console` ou tu filtres `#__extensions` sur `folder='console'` et tu conclus que le CLI est cassé.

✅ **Solution** : le cœur n'en a pas. Les 36 commandes CMS n'ont pas besoin de ce groupe. Un plugin console est une **extension à écrire**, suivant le tutoriel Hello World 6.1.

### Piège 2 : `$defaultName` manquant

⚠️ **Problème** : `AbstractCommand` n'a pas `$defaultName = 'hello:world'`. `php cli/joomla.php hello:world` échoue.

✅ **Solution** : le constructeur d'`AbstractCommand` applique `$defaultName` si aucun nom n'est passé. Pose la propriété de classe exactement à `hello:world`.

### Piège 3 : Coller la sortie de `config:get`

⚠️ **Problème** : la commande affiche `secret`, mot de passe DB et `smtppass` en clair. La barre de debug HTTP, elle, masque `password|secret|token|smtppass`.

✅ **Solution** : ne jamais coller cette sortie dans un commit, un ticket ou une fiche. Traite `config:get` comme une lecture de secrets.

### Piège 4 : Compter `list` / `help` comme commandes métier

⚠️ **Problème** : tu ajoutes `list` au catalogue CMS des 36 noms.

✅ **Solution** : ce sont les deux seules commandes de `joomla/console` 4.0.0 (`src/Command` = `AbstractCommand`, `HelpCommand`, `ListCommand`). Le CMS les fusionne, il ne les redéfinit pas.

---

## Checklist de Validation

- [ ] Je sais que `group="console"` s'enregistre sur `BEFORE_EXECUTE`, pas via le provider `Console`
- [ ] J'ai vérifié l'absence de `plugins/console` au tag 6.1.3
- [ ] Je peux citer les 36 commandes CMS et séparer `list` / `help`
- [ ] Je n'utilise plus `core:check-updates` (alias, retrait 7.0)
- [ ] Je refuse de coller une sortie `config:get` contenant des secrets

---

## Exercice Pratique

**Énoncé** : Sur une copie locale 6.1.3, produis trois preuves écrites (sans secrets en clair) :

1. Une ligne qui confirme l'absence du groupe console cœur.
2. La commande exacte pour lancer Hello World une fois le plugin installé.
3. Pourquoi tu n'envoies pas `php cli/joomla.php config:get` dans un canal de discussion.

**Indications** :

- Pour (1), appuie-toi sur le dossier `plugins/` (24 groupes) ou sur `#__extensions`.
- Pour (2), le nom canonique est `hello:world`.
- Pour (3), compare avec le masquage HTTP `password|secret|token|smtppass`.

**Résultat attendu** : trois phrases vérifiables, aucun secret collé.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

1. **Absence cœur** : `plugins/console` n'existe pas au tag 6.1.3 ; le seed MySQL n'insère pas `folder='console'`. Les commandes CMS viennent du provider `Console`, pas d'un plugin.
2. **Lancement** : `php cli/joomla.php hello:world` après installation d'un plugin `group="console"` dont `$defaultName` vaut `hello:world` et `doExecute` ramène `0`.
3. **Secrets** : `config:get` affiche secret, mot de passe DB et `smtppass` sans masquage. Ce n'est pas l'équivalent de la barre de debug HTTP.

---

## Navigation

← Fiche précédente : **[SQL, packages et update servers](18-sql-packages-updateservers.md)**

→ Fiche suivante : **[API /v1, CSRF et CORS](20-api-v1-csrf-cors.md)**
