---
tags:
  - Joomla
  - Architecture
  - Avancé
description: "Flux observé index.php vers SiteApplication::execute(), Factory::createContainer, getters Factory dépréciés 7.0, événements HTTP et catalogue getSubscribedEvents."
estimated_time: "50 min"
fiche_number: 22
total_fiches: 24
cursus: "Joomla CMS"
id: "web.joomla.architecture-di-evenements"
course_id: "web.joomla"
content_type: "lesson"
order: 22
---

# 22 - Architecture : DI et événements

> **En bref** : Suivre le flux observé `index.php` vers `includes/app.php` vers `SiteApplication::execute()` (ce n'est pas un contrat d'API), remplacer les getters Factory par le conteneur sans confondre `getContainer()` et `getDbo()`, et lire les événements hors manuel via `getSubscribedEvents`. Lecture estimée : 50 min.

## Prérequis

- Avoir lu [Sécurité : escape, uploads, SameSite](21-securite-escape-uploads-samesite.md)
- Avoir lu [Plugin console et CLI](19-plugin-console-et-cli.md) (`BEFORE_EXECUTE`, absence du groupe console cœur)
- CMS 6.1.3, lecture des fichiers `index.php` et `includes/app.php` du tag

## Objectif de cette fiche

À la fin de cette fiche, tu sauras raconter le bootstrap site comme convention de code, résoudre une dépendance via le conteneur DI, et chercher un événement hors des 5 pages manuelles dans `getSubscribedEvents`.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Le flux `index.php` → `execute()` est observé, pas un contrat

**Définition** : Au tag 6.1.3, une requête site suit cette chaîne **lue dans le code**. La page manuelle 6.1 _Lifecycle_ est un stub inachevé. Tu enseignes ce flux comme convention observée, pas comme API garantie.

**Le problème que cette distinction résout** :

Sans elle, voici les problèmes rencontrés :

1. **Prendre un dump de call stack pour une promesse de stabilité** : le cœur peut changer l'ordre interne avant 7.0.
2. **Confondre site, admin, API et CLI** : quatre front controllers, un schéma analogue, des classes différentes.
3. **Chercher la vérité dans l'archive J3** : `docs.joomla.org/Plugin/Events` est libellé Joomla 3.x, pages souvent « does not exist ».

**Chaîne site observée** :

```text
index.php
  PHP >= 8.3.0, constante _JEXEC
includes/app.php
  Factory::createContainer()
  alias session / session.web / SessionInterface -> session.web.site
  instancie SiteApplication
  assigne Factory::$application
  appelle execute()
```

L'admin reprend le schéma avec `AdministratorApplication` (`administrator/includes/app.php`). L'API avec `ApiApplication` (`api/includes/app.php`). Le CLI (`cli/joomla.php`) résout `Joomla\Console\Application` et alias la session vers `session.cli`.

**`CMSApplication::execute()` observé** :

1. Import des plugins `behaviour` et `system`.
2. Dispatch `onBeforeExecute`.
3. `doExecute()` : `initialiseApp()`, `route()` (`SiteRouter::parse`, `onAfterRoute`, autorisation du menu `Itemid`), `dispatch()`.
4. `dispatch()` enregistre les `joomla.asset.json` composant/template puis `ComponentHelper::renderComponent()` : `bootComponent($option)->getDispatcher($app)->dispatch()`.
5. `ComponentDispatcher::dispatch()` : `core.manage` en administrateur, `task` au format `controller.task`, contrôleur via `MVCFactory`, `execute()` / `redirect()`.
6. `render()` / `respond()` : `onBeforeRender`, `onAfterRender`, `onBeforeRespond`, `onAfterRespond`.

Le manuel 6.1 des événements application décrit le même ordre HTTP : `onAfterInitialise` … `onAfterRespond`.

**Analogie concrète** : C'est le trajet filmé d'un colis dans **cet** entrepôt (tag 6.1.3) : quai `index.php`, bureau `includes/app.php`, chef d'équipe `execute()`. Ce n'est pas le contrat public de la poste. La brochure _Lifecycle_ 6.1 est encore une page blanche.

**Ce que ce flux n'est PAS** :

- Ce n'est pas une API versionnée. Ne pas écrire « Joomla garantit `execute()` ligne à ligne ».
- Ce n'est pas le contrat d'écoute J3 (méthodes `on*` à arguments positionnels) : encore présent, **@deprecated, retrait 7.0**. Le contrat 6.1 documenté est `SubscriberInterface` plus une classe d'événement nommée.

---

### Qu'est-ce que `Factory::createContainer` ?

**Définition** : `Factory::createContainer()` (recommandation DI depuis Joomla 4) enregistre notamment Application, Authentication, CacheController, Config, Console, Database, Dispatcher, Document, Form, Input, Language, Mailer, Menu, Pathway, Session, WebAssetRegistry, Router, User.

**Le problème que le conteneur résout** :

Sans lui, voici les problèmes rencontrés :

1. **Getters historiques** : `Factory::getDbo()`, `getConfig()`, `getSession()`, `getLanguage()`, `getDocument()`, `getUser()`, `getCache()` sont `@deprecated 4.3`, retrait prévu **7.0**. `getMailer()` est `@deprecated 4.4.0`, retrait **7.0**.
2. **Substitution 1:1 fausse** : `Factory::getContainer()` **n'est pas** un substitut 1:1 de `getDbo()`. Le conteneur n'est pas l'objet base de données.
3. **Doc WAM vs code** : le manuel Web Asset Manager 6.1 dit que `Document::addScript` / `addStyleSheet` disparaissent **en Joomla 6**. Dans 6.1.3 elles existent encore, `@deprecated 4.3`, retrait **7.0**.

**Comment tu remplaces `getDbo()`** :

```php
// Déprécié 4.3, retrait 7.0 : retourne la base.
$db = Factory::getDbo();

// PAS un substitut 1:1 : retourne le conteneur, pas la base.
$container = Factory::getContainer();

// Remplacement nommé dans le corpus : résoudre DatabaseInterface
// depuis le conteneur, ou passer par Factory::getApplication().
$db = Factory::getContainer()->get(\Joomla\Database\DatabaseInterface::class);
```

**Analogie concrète** : `getDbo()` demandait « passe-moi le marteau ». `getContainer()` demande « passe-moi l'atelier entier ». L'atelier n'enfonce pas un clou. Tu prends le marteau (`DatabaseInterface`) **dans** l'atelier.

**Ce que le conteneur n'est PAS** :

- Ce n'est pas `CMSApplication::getInstance()` / `getRouter()` (dépréciés 4.0/4.3, retrait 7.0).
- Ce n'est pas `Cache::getInstance()` : déprécié 4.2, retrait 7.0, au profit de `CacheControllerFactoryInterface`.
- Ce n'est pas `getCfg()` : encore présent, annotation 7.0, message runtime « removed in 6.0 » (hors cursus principal).

---

### Événements HTTP vs catalogue `getSubscribedEvents`

**Définition** : Le manuel programmeur 6.1 Current ne versionne des événements de plugins que sur **5 pages** : Application/System, Content, Installer, Module, User/Authentication. Hors ces pages, les noms observés dans le code via `getSubscribedEvents()` / `SubscriberInterface` sont une **convention interne**, liste **partielle**, pas une API publiée.

**Le problème que cette règle de lecture résout** :

Sans elle, voici les problèmes rencontrés :

1. **Archive J3 comme contrat 6.1** : index Plugin/Events périmé, Cloudflare, pages vides.
2. **Inventer une table complète** : des arbres n'ont pas été ouverts (task `globalcheckin` / `rotatelogs`, majorité `fields/*` et `webservices/*`).
3. **Copier les noms J3** : les exemples 6.1 (editors, editors-xtd, captcha, console, filesystem) ne reprennent pas `onInit` / `onSave` / `onSetContent` / `onDisplay` / `onGetContent` / `onGetInsertMethod`.

**Échantillon code 6.1.3 (convention interne)** :

| Groupe | Événements observés (extrait) |
| ------ | ----------------------------- |
| HTTP documenté | `onAfterInitialise` … `onAfterRespond` (5e page application) |
| task | `onTaskOptionsList`, `onExecuteTask`, souvent `onContentPrepareForm` |
| finder | `onFinderAfterSave`, `onFinderBeforeSave`, `onFinderAfterDelete`, `onFinderChangeState` |
| webservices | `onBeforeApiRoute` (Content, Media, Users inspectés) |
| console | `application.before_execute` (tutoriel seulement ; pas de plugin cœur) |
| behaviour | compat6 : `onAfterInitialiseDocument` ; pas de `plugins/behaviour/compat` au tag (seulement compat6, taggable, versionable) |

24 dossiers sous `plugins/` au tag, **sans** `console`. Le groupe `ajax` apparaît dans des exemples et est **absent** de ces 24 dossiers.

**Analogie concrète** : Les 5 pages manuelles sont le programme officiel d'un spectacle (annonces numérotées). Le reste se lit sur les feuilles de service collées dans les coulisses (`getSubscribedEvents` dans chaque plugin). Photocopier l'ancienne feuille J3, c'est coller le programme d'une autre décennie.

**Ce que ce catalogue n'est PAS** :

- Ce n'est pas exhaustif. Rate-limit GitHub : fichiers non ouverts.
- Ce n'est pas `onGetIcon` (singulier dans `CoreEventAware`) : le nom dispatché inspecté est `onGetIcons`.
- Ce n'est pas `$allowLegacyListeners` comme nom d'événement : c'est un style d'écoute @deprecated 4.3, retrait 7.0 (plugins MFA).

---

## Étapes Pratiques

### Étape 1 : Lire le bootstrap site dans le tag

Ouvre `index.php` puis `includes/app.php` du tag 6.1.3. Coche :

1. Garde PHP >= 8.3.0 et `_JEXEC`.
2. Création du conteneur, alias de session site, `SiteApplication::execute()`.
3. Aucune phrase « contrat public » dans tes notes : tu écris « flux observé 6.1.3 ».

**Résultat attendu** : un schéma texte identique à celui du concept, daté du tag.

---

### Étape 2 : Remplacer un `getDbo()`

Repère un `Factory::getDbo()` dans **ton** extension (pas un patch cœur). Remplace-le par une résolution `DatabaseInterface` depuis `Factory::getContainer()`, ou par `Factory::getApplication()` selon le besoin réel (base vs application).

**Résultat attendu** : plus aucun commentaire du type « `getContainer()` = `getDbo()` ».

---

### Étape 3 : Trouver un événement hors des 5 pages

1. Ouvre `plugins/task/checkfiles/src/Extension/Checkfiles.php` : `onExecuteTask`.
2. Ouvre un plugin `finder` : `onFinderAfterSave`.
3. Ouvre `plugins/webservices/content` : `onBeforeApiRoute`.
4. Vérifie que ces noms n'ont pas de page plugin-events 6.1 (404).

**Résultat attendu** : tu cites le fichier + `getSubscribedEvents`, pas l'archive J3.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| Lire `index.php` + `includes/app.php` | Flux site observé |
| `Factory::createContainer()` | Enregistrement DI (liste ci-dessus) |
| `Factory::getContainer()` | Obtenir le conteneur (**pas** la base) |
| `Factory::getDbo()` | Getter @deprecated 4.3, retrait 7.0 |
| `getSubscribedEvents()` | Catalogue interne d'un plugin |
| `ApplicationEvents::BEFORE_EXECUTE` | Enregistrement des commandes console |

---

## Pièges Fréquents

### Piège 1 : Enseigner le flux comme API

⚠️ **Problème** : tu copies `execute()` / `dispatch()` dans une doc d'extension comme garantie.

✅ **Solution** : « convention observée tag 6.1.3 ». La page Lifecycle 6.1 est inachevée.

---

### Piège 2 : `getContainer()` à la place de `getDbo()`

⚠️ **Problème** : tu écris `$db = Factory::getContainer();` puis tu appelles des méthodes de base.

✅ **Solution** : le conteneur n'est pas `DatabaseInterface`. Résous le service, ou passe par l'application.

---

### Piège 3 : Archive Plugin/Events J3

⚠️ **Problème** : tu documentes `onDisplay` editors comme contrat 6.1.

✅ **Solution** : exemples 6.1 = `onEditorSetup` / `onEditorButtonsSetup`. Signatures positionnelles J3 : retrait 7.0.

---

### Piège 4 : Table d'événements « complète »

⚠️ **Problème** : tu inventes les fichiers non ouverts.

✅ **Solution** : enseigner l'échantillon et l'absence de page manuelle, pas une encyclopédie.

---

## Checklist de Validation

- [ ] Je raconte `index.php` → `includes/app.php` → `execute()` comme flux observé
- [ ] Je liste les services de `createContainer()` sans les confondre avec les getters
- [ ] Je n'utilise plus `getContainer()` comme synonyme de `getDbo()`
- [ ] Je cherche un événement hors manuel dans `getSubscribedEvents`
- [ ] Je refuse l'archive J3 comme contrat 6.1

---

## Exercice Pratique

**Énoncé** : Réponds en trois blocs courts.

1. Dessine le flux site en 6 lignes maximum, avec la mention « observé, pas contrat ».
2. Explique en deux phrases pourquoi `$db = Factory::getContainer();` est faux.
3. Donne un événement `task`, un événement `finder` et un événement `webservices` **absents** des 5 pages manuelles, avec le fichier exemple.

**Résultat attendu** : pas de nom inventé hors tableau de cette fiche.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

1. **Flux** : `index.php` (_JEXEC, PHP 8.3) → `includes/app.php` (conteneur, alias session site, `SiteApplication`) → `execute()` (plugins behaviour/system, `doExecute`, render/respond). Mention obligatoire : convention tag 6.1.3, page Lifecycle inachevée.
2. **DI** : `getContainer()` retourne l'atelier (conteneur). `getDbo()` retournait le marteau (base), @deprecated 4.3 / 7.0. Il faut résoudre `DatabaseInterface` (ou l'application), pas traiter le conteneur comme une base.
3. **Événements** : `onExecuteTask` (`plugins/task/checkfiles/.../Checkfiles.php`) ; `onFinderAfterSave` (`plugins/finder/content/.../Content.php`) ; `onBeforeApiRoute` (`plugins/webservices/content/.../Content.php`). Catalogue interne, partiel.

---

## Navigation

← Fiche précédente : **[Sécurité : escape, uploads, SameSite](21-securite-escape-uploads-samesite.md)**

→ Fiche suivante : **[Tests Cypress et dépréciations](23-tests-cypress-et-deprecations.md)**
