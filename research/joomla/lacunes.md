# Lacunes - dossier source Joomla CMS

**Date** : 20 août 2026  
**Règle** : une lacune explicite vaut mieux qu'une invention. Confiance = confiance dans l'**état** (y compris une absence confirmée).

## Tranchées par le passage 2 (enseigner l'absence ou l'écart)

| Sujet | Réponse vérifiée | Confiance | Sources |
| ----- | ---------------- | --------- | ------- |
| Sauvegarde / staging / déploiement cœur | Pas de composant cœur ; guide = fichiers + base, Akeeba, cPanel, mysqldump, phpMyAdmin, zip | élevée | P2-S6 |
| Commandes `debug:*` / `log:*` / `perf:*` | Absentes du CLI 6.1.3 | élevée | P2-S7 |
| Audit de sécurité d'extensions | Inventaire CLI ≠ suite d'audit | élevée | P2-S12 |
| Niveau WCAG Cassiopeia / Atum | Aucun niveau 2.x déclaré ; guide dit « accessible » ; statement projet 2022 = Joomla 4 / WCAG 2.1 | élevée (absence) | P2-S20, P2-S23 |
| Carte officielle 5 parcours | Absente du manuel, du guide et du tag | élevée (absence) | P2-S21 |
| PHP 8.5 dans le tableau 6.1 | Absent (reco 8.4, min 8.3.0) ; CI 6.1.3 exécute 8.3/8.4/8.5 ; page 5.4 new-features documente le support 8.5 | élevée (écart doc/CI) | P2-S19 |
| MariaDB 10.4 vs 10.6 | Minimum forcé installateur = 10.4 ; Supported / guide 5 vers 6 = 10.6 ; `UpdateModel::getPhpOptions` ne teste pas MariaDB | élevée | P2-S16 |
| Chemin 4.4 vers 6.x | Inexistant : 4.4.x vers 5.x puis 5.4.x vers 6.x | élevée | P2-S17 |
| Framework dans CMS 6 | Packages `joomla/*` ^4.0, pas un Framework 6 | élevée | P2-S18 |
| Ordre overrides enfant | Enfant avant parent (`HtmlView`, `ModuleHelper`, `FileLayout`) | élevée | P2-S13 |
| Tests sur le tag 6.1.3 | `tests/Unit/bootstrap.php` présent ; CI PHPUnit + Cypress ; Writing Tests TODO | élevée | P2-S23 |
| CORS `isOriginAllowed` | `@since 6.1.3`, CVE-2026-71573 | élevée | P2-S15 |
| `initialiseTemplate` | `@since 6.1.0` dans le code, pas dans le changelog utilisateur 6.1.0 | élevée | P2-S14 |

## Tranchées par les passages 3A / 3B / 3C

| Sujet | Réponse vérifiée | Confiance | Sources |
| ----- | ---------------- | --------- | ------- |
| Champs personnalisés | 21 noms / 18 plugins ; câblage content, contact, users seulement ; jeton `{field 1}` (espace) pas `{field:n}` ; tables `#__fields*` ; `core.edit.value` ; CVE-2026-72531 corrigée en 6.1.3 | élevée | P3A-S1-S6 |
| Langues / associations | Packs UI vs content languages ; Language Filter + `#__associations` ; switcher (pack + home + ACL) ; overrides `.override.ini` après en-GB puis langue active | élevée | P3A-S7-S12 |
| Menus / modules hors SEF | Itemid = `#__menu.id` ; `#__modules_menu` ; `bootModule` vers dispatcher vers chrome ; cache module en secondes, coupé si connecté | élevée | P3A-S13-S18 |
| SameSite | Aucune option CMS ; `httpheaders` sans Set-Cookie ; `NativeStorage` ignore `cookie_samesite` | élevée (absence) | P3B-S1-S6 |
| Favicons vs update | Livrés `media/system/images` (écrasables) ; mêmes noms sous `media/templates/.../images` = « will not be affected ». ZIP non décompressé | élevée (mécanisme CLI) | P3B-S13-S17 |
| `joomla.asset.json` enfant | Parent puis enfant ; homonyme remplace l'item entier | élevée | P3B-S18-S23 |
| Catalogue CLI | 36 commandes `php cli/joomla.php` ; seul alias déprécié `core:check-updates` | élevée (cœur CMS) | P3C-S1-S3 |
| Finder | `finder:index` seulement ; `cli/finder_indexer.php` absent | élevée | P3C-S4-S5 |
| `com_joomlaupdate` vs MariaDB 10.4 | TUF `mariadb=10.4` ; **n'occulte pas** l'offre 6.x pour 10.4.x ; XML 6.x 404 (TUF seul) | élevée (code+TUF, pas live) | P3C-S12-S17 |
| Pages manuel TODO | Stubs Templates / Web Services API / Unit Testing ; wcag 404 ; substituts = guide, Cypress, `tests/Unit/README.md` | élevée (absence) | P3C-S20-S23 |
| Tests `escape` / `MediaHelper` | PHPUnit absents ; Cypress `Media.cy.js` + `Files.cy.js` | élevée (absence) | P3C-S18-S19 |
| Groupes d'événements | 24 dossiers `plugins/` ; manuel 6.1 = 5 pages seulement ; le reste = archive ou hors catalogue (`task`, `multifactorauth`, console) | élevée (périmètre doc) | P3C-S6-S11 |

## Tranchées par les passages 4A / 4B / 4C / 4D

| Sujet | Réponse vérifiée | Confiance | Sources |
| ----- | ---------------- | --------- | ------- |
| `{loadmodule}` / associations modules | Trois balises via `plg_content_loadmodule` ; associations `com_modules.item` 6.1.0 sans substitution frontend | élevée | P4A |
| Overlay langue template | Aucun overlay cœur ; `\|\|` sans merge | élevée | P4A |
| Types News Feeds / Tags | 3+3 XML site (`tag/list.xml` = compact) | élevée | P4A |
| SameSite php.ini | Préservé par l'appel 5 args PHP 8.3 ; remember-me sans attribut | élevée | P4B |
| Uploads taille/nom + `articletext` + `com_contact` | Plafond par fichier ; nom sanitizé ; `filterText` puis echo brut ; contact sans escape gabarit | élevée (périmètre) | P4B |
| Extract web joomlaupdate | Homonyme écrasé ; extra hors ZIP conservé | élevée | P4B |
| ZIP Update 6.1.3 | Favicons dans `media/system/images/` ; absents de Cassiopeia `images/` | élevée | unzip -l local + P4C |
| CLI `list`/`help` + plugin console | Framework seulement ; pas de plugin console cœur | élevée | P4C |
| Writing Tests | Stub + `tests/System/README.md` Cypress | élevée | P4C |
| Événements hors 5 pages 6.1 | Catalogue code `getSubscribedEvents` (partiel, convention interne) | élevée (échantillon) | P4D |

## Encore ouvertes (limites, pas le socle)

| Sujet | État | Confiance |
| ----- | ---- | --------- |
| ZIP Full 6.1.3 | Non listé (seul l'Update l'a été) | lacune mineure |
| Couverture OWASP complète | Non revendiquée (périmètre borné) | - |
| Catalogue événements exhaustif | Fichiers non ouverts (task globalcheckin/rotatelogs, majorité fields/webservices) | partielle |
| Liste `deleteUnexistingFiles()` | Non énumérée | partielle |
| Exploitabilité echo `com_contact` après filtre STRING | Non testée | lacune |

## Contradictions doc/code à figer dans toute fiche concernée

| Doc | Code 6.1.3 | Conséquence pédagogique |
| --- | ---------- | ----------------------- |
| WAM : `addScript` / `addStyleSheet` retirés en Joomla 6 | Encore là, @deprecated 4.3, retrait 7.0 | Enseigner WAM, ne pas dire « retiré en 6 » |
| `CMSApplication::getCfg()` message runtime « removed in 6.0 » | Méthode encore présente, annotation 7.0 | Hors cursus principal |
| Guide Cache : APC, Eaccelerator, Memcache, XCache, `JCache` | Seulement APCu, File, Memcached, Redis | Citer le tag, pas la liste du guide |
| Guide Media Options : `file_path` = `images` | `config.xml` : `file_path` = `files`, `image_path` = `images` | Citer `config.xml` |
| Guide Cassiopeia : polices None/local/web, positions jusqu'à `debug` | System font + `error-403` / `error-404` | Citer le XML du tag |
| Tableau manifeste 6.1 « Out of date » ; config composants = tutoriel J3.x | Tutoriel `com_example` 6.1 namespacé | S'appuyer sur le tutoriel 6.1 et `com_contact`, pas le tableau périmé |
| ACL programmeur = tutoriel J3.x | `User::authorise` / `Access::check` inchangés selon la page | Enseigner `authorise` depuis le code + guide niveaux |
| Lifecycle 6.1 = TODO | Flux lu dans CMSApplication | Flux = convention observée, pas contrat |
| Help61 Fields : 16 types ; joomla.center `{field:n}` | 21 noms ; regex `{field 1}` (espace) | Enseigner le tag et l'ini en-GB, pas Help/joomla.center |
| Guide Large Sites `finder_indexer.php` | Absent du tag 6.1.3 | Enseigner `php cli/joomla.php finder:index` |
| Guide 5 vers 6 : MariaDB 10.6 | TUF `supported_databases.mariadb = 10.4` ; Update n'occulte pas 6.x | Distinguer reco guide vs borne TUF réelle |
