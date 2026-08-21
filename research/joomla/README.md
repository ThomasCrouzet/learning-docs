# Dossier source - Cursus Joomla CMS

**Statut** : Partial (passages 1 à 4D vérifiés ; restes = limites OWASP, ZIP Full non listé, événements non exhaustifs)
**Date de consultation des sources** : 20 août 2026
**Produit** : CMS Joomla! (pas le Joomla! Framework comme produit séparé)
**Ancre des exemples** : tag `joomla-cms` **6.1.3** (18 août 2026)
**Manuel programmeur** : 6.1 Current
**Guide utilisateur** : guide.joomla.org
**Hors cursus principal** : 5.x Legacy (correctifs), 4.x et 3.x (héritage)

Ce dossier n'est **pas** le cursus. Il fournit une matière versionnée pour rédiger ensuite les fiches. Dossier de travail interne : hors `docs/`, donc hors surface wiki MkDocs.

Les cinq parcours (intégrateur, administrateur, templates, extensions, expert) sont un **overlay pédagogique**. Aucune source officielle 6.1 ne les nomme.

## Fichiers

| Fichier | Contenu |
| ------- | ------- |
| [passage-1.md](passage-1.md) | Versions, bootstrap, CSRF, templates pérennes, extensions, packaging, API `/v1` |
| [passage-2.md](passage-2.md) | ACL, cache, scheduler, médias, SEF, Finder, workflows, CLI, XSS, uploads, secrets, CORS, jalons |
| [passage-3a.md](passage-3a.md) | Champs (`{field 1}`), langues/associations, menus, Itemid, modules, chrome |
| [passage-3b.md](passage-3b.md) | SameSite (absent), uploads OWASP, XSS layouts `com_content`, favicons, `joomla.asset.json` enfant |
| [passage-3c.md](passage-3c.md) | 36 commandes CLI, `finder:index`, 24 groupes plugins, TUF MariaDB 10.4, tests TODO |
| [passage-4a.md](passage-4a.md) | `{loadmodule}` / `{loadposition}` / `{loadmoduleid}`, associations modules 6.1.0, types News Feeds/Tags, overlays langue |
| [passage-4b.md](passage-4b.md) | SameSite php.ini préservé, `filterText`, uploads taille/nom, `com_contact`, extract web |
| [passage-4c.md](passage-4c.md) | ZIP Update listé, CLI `list`/`help`, pas de plugin console cœur, substitut Writing Tests |
| [passage-4d.md](passage-4d.md) | Catalogue événements `getSubscribedEvents` (convention code, 24 groupes, partiel) |
| [glossaire.md](glossaire.md) | Classes, fichiers, commandes, type (API / reco / interne / dépréciation) |
| [lacunes.md](lacunes.md) | Lacunes tranchées, encore ouvertes, contradictions doc/code |
| [sources.md](sources.md) | Bibliographie S1-S24, P2, P3A-C, P4A-D |

## Décisions de cadrage

- Distinguer CMS et Framework : l'un n'exige pas d'installer l'autre. Le CMS 6.1.3 **vend** toutefois le Framework **4.x** (`joomla/*` ^4.0).
- Cibler 6.x ; figer le code des exemples sur le tag 6.1.3, pas sur `HEAD` de `5.4-dev`.
- Entrée officielle en 6.x : mise à niveau in-place depuis **5.4.x**. Pas de saut 4.4 vers 6.x (passer par 5.x).
- PHP : minimum et supported **8.3.0**, recommended **8.4**. PHP **8.5** est absent du tableau 6.1 mais la CI du tag exécute 8.3/8.4/8.5.
- MariaDB : minimum **forcé à l'install** = 10.4 ; ligne Supported et guide 5 vers 6 = 10.6. TUF 6.x déclare aussi `mariadb=10.4`. `com_joomlaupdate` **n'occulte pas** l'offre 6.x pour 10.4.x. Flux XML 6.x : 404 (TUF seul).
- Personnalisation pérenne : templates enfants, `user.css` / `user.js`, overrides `html/` (enfant **avant** parent).
- Remplacer les getters Factory historiques par le conteneur DI (retrait prévu en 7.0). `getContainer()` n'est pas un substitut 1:1 de `getDbo()`.
- Le cœur ne fournit ni sauvegarde/staging/déploiement, ni commandes `debug:*`/`log:*`/`perf:*`, ni niveau WCAG pour Cassiopeia/Atum, **ni option SameSite**. Enseigner ces absences, ne pas les inventer.
- `joomla.asset.json` enfant : homonyme `type`+`name` **remplace** l'item parent entier (pas de fusion). Favicons livrés = `media/system/images` (écrasables) ; copies sous `media/templates/.../images` = scénario « will not be affected ».

## Versions (rappel)

| Série | Dernier paquet | PHP min / reco | Support |
| ----- | -------------- | -------------- | ------- |
| 6.x | 6.1.3, 18 août 2026 | 8.3.0 / 8.4 | 14 oct. 2025 · 17 oct. 2028 · 16 oct. 2029 (2028/2029 inférés) |
| 5.x | 5.4.8, 18 août 2026 | 8.1.0 / 8.3 | bugfix 13 oct. 2026, sécu 12 oct. 2027 |
| 4.x | 4.4.14, 30 sept. 2025 | 7.2.5 / 8.2 | hors support |
| 3.x | - | - | fin 17 août 2023 ; LTS 17 fév. 2025 |

Montée 5.4 vers 6 : désactiver **Behaviour - Backward Compatibility** (J4 vers J5) **avant** J6 ; **Behaviour - Backward Compatibility 6** est essentiel (activé tout seul en 5.4.x ; install neuve 6 : installé, désactivé).

## Cinq parcours (overlay)

1. **Intégrateur** : enfant Cassiopeia, `user.css` / `user.js`, positions, overrides `html/`, WAM
2. **Administrateur** : groupes et view levels, `authorise`, trois caches, scheduler Lazy vs Web Cron, SEF + htaccess, workflows, Finder (`finder:index`), Mail Templates, champs `{field 1}`, multilangue (filtre + associations + switcher), montée 5.4 vers 6, backups **tiers**
3. **Créateur de templates** : ordre enfant vers parent, layouts alternatifs, JLayout, e-mails, positions y compris `error-403`/`error-404`, limites a11y (pas de skip-link Cassiopeia, pas de niveau WCAG)
4. **Développeur d'extensions** : manifeste, PSR-4, `provider.php`, schémas SQL, package, update server, plugin console, `authorise`
5. **Expert** : front controllers, événements HTTP et `BEFORE_EXECUTE`, DI, API `/v1`, CORS 6.1.3, CLI, PHPUnit/Cypress du tag, dépréciations 7.0, plugin compat, Framework 4.x vendu

## Progression

- **Rapide** : tag 6.1.3 + PHP 8.3 + enfant Cassiopeia + un override + un jeton de formulaire + `user:list` en CLI
- **Approfondie** : DI à la place de `Factory::getDbo()`, composant namespacé `com_example`, plugin console, plugin de compatibilité 6, endpoint API authentifié, `canUpload` / `escape()`, spec Cypress (Writing Tests encore TODO dans le manuel)

## Fil rouge (jalons vérifiés)

| Jalon | Réussite | Piège |
| ----- | -------- | ----- |
| Template enfant Cassiopeia | Create Child Template + `user.css` | Éditer le parent |
| Module puis `com_example` | Install + `option=com_example`, namespace + `provider.php` | `<files>` incomplet |
| Plugin console | `group="console"`, `php cli/joomla.php hello:world` | `$defaultName` manquant |
| ACL | `authorise('core.edit', 'com_content.article.22')` ≠ view levels | Confondre action et visibilité |
| CLI cœur | `user:list`, `scheduler:run`, `finder:index`, `extension:list` | Chercher `debug:*` (n'existe pas) |
| API `/v1` | `X-Joomla-Token` + `core.login.api` et `core.login.site` (passage 1) | Page Web Services 6.1 encore inachevée / titrée 4.x |
| Tests | CI tag : PHPUnit + Cypress, MariaDB 10.4 | Pas de tutoriel d'écriture officiel |
| Packaging | ZIP + `pkg_*.xml` + `<updateservers>` | `id` ≠ `element` ; `config:get` dump les secrets |

Détail : [passage-2.md](passage-2.md).

## Assez solide pour rédiger

Installation 6.1.3, montée 5.4 vers 6, bootstrap (flux observé), DI vs Factory, CSRF, XSS `escape()` et pièges `com_content`, uploads `canUpload`, ACL, cache (moteurs du tag), scheduler, SEF, Finder `finder:index`, workflows, **36 commandes CLI**, child templates, `joomla.asset.json` homonyme = remplacement, favicons, champs `{field 1}`, multilangue, menus/Itemid/modules/chrome, manifeste PSR-4, packages, API `/v1` (page conceptuelle, pas le tutoriel TODO).

## Enseigner comme absence (ne pas inventer)

Sauvegarde/staging/déploiement cœur, `debug:*`/`log:*`/`perf:*`, option SameSite **CMS** (l'INI php peut encore poser l'attribut, préservé), niveau WCAG Cassiopeia/Atum, `finder_indexer.php`, PHPUnit `HtmlView::escape` / `MediaHelper`, pages manuel Templates / Web Services API / Unit Testing / wcag (stubs ou 404), flux XML 6.x, plugin console cœur, page catalogue d'événements hors 5 pages 6.1 (enseigner le **code** comme convention interne, voir [passage-4d.md](passage-4d.md)).

## Bords encore ouverts

ZIP Full non listé (l'Update l'est) ; couverture OWASP non complète ; fichiers plugins restants non ouverts ; liste `deleteUnexistingFiles()` non énumérée. Détail : [lacunes.md](lacunes.md).
