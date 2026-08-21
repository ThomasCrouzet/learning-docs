---
tags:
  - Joomla
  - CMS
description: "Cursus Joomla CMS 6.x : intégration, administration, templates, extensions et architecture, ancré sur le tag 6.1.3."
hide:
  - toc
---

# Joomla CMS

Ce cursus porte sur le **CMS Joomla!** en branche **6.x**. Les exemples sont figés sur le tag `joomla-cms` **6.1.3** (18 août 2026), pas sur `HEAD` de la branche Git `5.4-dev`.

Le **Joomla! Framework** (bibliothèques Composer) est un produit distinct. Le CMS 6.1.3 vend toutefois des paquets `joomla/*` en version **4.x**. Tu n'installes pas le Framework à part pour utiliser le CMS.

Les cinq parcours ci-dessous sont un **overlay pédagogique**. Aucune source officielle 6.1 ne les nomme ainsi.

**Prérequis** : PHP 8.3 (minimum et supported), notions de HTML/CSS, un serveur local (Apache 2.4 ou Nginx) et MySQL 8.0.13 / MariaDB (minimum forcé 10.4) / PostgreSQL 12+.

**Durée estimée** : 24 fiches.

**Ancre de version** : Joomla CMS 6.1.3 · PHP 8.3.0 min / 8.4 reco · manuel programmeur 6.1 Current.

## Fiches du module

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [CMS, Framework et versions](01-cms-vs-framework-et-versions.md) | Distinguer CMS et Framework, figer 6.1.3 |
| 02 | [Installation de Joomla 6.1.3](02-installation-6-1-3.md) | Installer le CMS en local |
| 03 | [Template enfant Cassiopeia](03-template-enfant-cassiopeia.md) | Créer un enfant, `user.css` / `user.js` |
| 04 | [Overrides, layouts et JLayout](04-overrides-layouts-jlayout.md) | Surcharger sans toucher au core |
| 05 | [Web Asset Manager](05-web-asset-manager.md) | `joomla.asset.json`, homonyme = remplacement |
| 06 | [Favicons et limites d'accessibilité](06-favicons-et-accessibilite.md) | Où poser un favicon, ce que Cassiopeia ne promet pas |
| 07 | [Montée de 5.4 vers 6](07-montee-5-4-vers-6.md) | Upgrade in-place et plugins de compatibilité |
| 08 | [ACL : authorise et view levels](08-acl-authorise-et-view-levels.md) | Actions vs visibilité |
| 09 | [Cache : trois couches](09-cache-trois-couches.md) | Page, vue/module, cache par module |
| 10 | [Scheduler : Lazy et Web Cron](10-scheduler-lazy-et-webcron.md) | Tâches planifiées, deux modes exclusifs |
| 11 | [SEF, menus et Itemid](11-sef-menus-et-itemid.md) | URLs conviviales et item de menu |
| 12 | [Modules, chrome et loadmodule](12-modules-chrome-et-loadmodule.md) | Affichage des modules et balises dans un article |
| 13 | [Finder, CLI et absences](13-finder-cli-et-absences.md) | `finder:index`, 36 commandes, pas de `debug:*` |
| 14 | [Champs personnalisés](14-champs-personnalises.md) | `{field 1}`, pas `{field:n}` |
| 15 | [Site multilingue](15-multilingue.md) | Filtre, associations, commutateur |
| 16 | [Mail, workflows et sauvegardes](16-mail-workflows-et-sauvegardes.md) | Mail Templates, workflows, backups tiers |
| 17 | [Manifeste PSR-4 et com_example](17-manifeste-psr4-com-example.md) | Composant namespacé moderne |
| 18 | [SQL, packages et update servers](18-sql-packages-updateservers.md) | Schémas, ZIP, `pkg_*.xml` |
| 19 | [Plugin console et CLI](19-plugin-console-et-cli.md) | `group="console"`, `hello:world` |
| 20 | [API /v1, CSRF et CORS](20-api-v1-csrf-cors.md) | Web services, jeton, `isOriginAllowed` |
| 21 | [Sécurité : escape, uploads, SameSite](21-securite-escape-uploads-samesite.md) | Sortie HTML, `canUpload`, absence SameSite CMS |
| 22 | [Architecture : DI et événements](22-architecture-di-evenements.md) | Bootstrap, conteneur, événements comme convention |
| 23 | [Tests Cypress et dépréciations](23-tests-cypress-et-deprecations.md) | Substitut Writing Tests, Factory vers 7.0 |
| 24 | [Fil rouge](24-fil-rouge.md) | Enchaîner enfant, composant, plugin, ACL, CLI, API, tests, ZIP |

!!! tip "Parcours recommandé"
    Suis les fiches dans l'ordre numérique. Les fiches 01 à 06 couvrent l'intégration et les templates. Les fiches 07 à 16 couvrent l'administration. Les fiches 17 à 24 couvrent les extensions, l'architecture et le fil rouge.

!!! warning "Absences du cœur"
    Joomla 6.1.3 ne fournit pas de sauvegarde/staging/déploiement intégré, ni de commandes `debug:*` / `log:*` / `perf:*`, ni d'option SameSite dans la configuration globale, ni de niveau WCAG déclaré pour Cassiopeia ou Atum. Ces absences sont enseignées dans les fiches, pas inventées.

<!-- material/tags { scope: true } -->
