---
tags:
  - Docker
  - PHP
  - Symfony
  - PostgreSQL
description: "De Docker à PostgreSQL en passant par PHP et Symfony."
hide:
  - toc
---

# Stack Symfony

Ce cursus te guide à travers toute la stack technique nécessaire pour développer une application web avec Symfony. Tu progresseras dans cet ordre : conteneurisation avec Docker, fondamentaux PHP, framework Symfony, puis base de données PostgreSQL.


!!! tip "Ordre de lecture recommandé"
    1. Docker  2. **PHP**  3. **Symfony**  4. PostgreSQL  5. EasyAdmin  6. JavaScript
    EasyAdmin est listé plus bas dans le sommaire pour le détail des fiches, mais il suppose PHP + Symfony déjà acquis. Ne commence pas EasyAdmin avant d'avoir suivi PHP et les bases Symfony.


**61 fiches** réparties sur 7 modules.

---

## Commencer - Outils IA (2 fiches)

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Utiliser l'IA pour apprendre](../00-outils-ia/01-utiliser-ia-pour-apprendre.md) | Apprendre à formuler des questions et exploiter l'IA comme outil d'apprentissage |
| 02 | [Rechercher efficacement](../00-outils-ia/02-rechercher-efficacement.md) | Trouver rapidement des réponses fiables dans la documentation et sur le web |

---

## Docker (2 fiches)

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Docker Compose pour Symfony](../01-docker/01-docker-compose-symfony.md) | Créer un environnement Docker Compose pour Symfony |
| 02 | [Lancement du projet et Git](../01-docker/02-lancement-projet-git.md) | Lancer le projet et initialiser Git |

---

## EasyAdmin (7 fiches)

| # | Fiche | Description |
| - | ----- | ----------- |
| 03 | [Installer EasyAdmin](../03-easyadmin/01-easyadmin-installation.md) | Installer et configurer le bundle EasyAdmin |
| 04 | [Champs avancés EasyAdmin](../03-easyadmin/02-easyadmin-champs-avances.md) | Personnaliser les champs des formulaires d'administration |
| 05 | [Authentification EasyAdmin](../03-easyadmin/03-easyadmin-authentification.md) | Sécuriser l'accès au tableau de bord EasyAdmin |
| 06 | [Gestion des utilisateurs](../03-easyadmin/04-easyadmin-utilisateurs.md) | Gérer les utilisateurs et les rôles depuis EasyAdmin |
| 07 | [Images et filtres](../03-easyadmin/05-easyadmin-images-filtres.md) | Gérer l'upload d'images et les filtres de recherche |
| 08 | [Actions personnalisées](../03-easyadmin/06-easyadmin-actions-personnalisees.md) | Créer des actions personnalisées dans EasyAdmin |
| 09 | [Personnalisation visuelle](../03-easyadmin/07-easyadmin-personnalisation-visuelle.md) | Adapter l'apparence du tableau de bord EasyAdmin |

---

## PHP (14 fiches)

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Découvrir PHP](../02-php/01-introduction-php.md) | Introduction à PHP et premiers pas |
| 02 | [Variables et types de données](../02-php/02-variables-types.md) | Les variables et types de données |
| 03 | [Tableaux (arrays)](../02-php/03-tableaux-arrays.md) | Les tableaux (arrays) |
| 04 | [Conditions](../02-php/04-conditions.md) | Les conditions (if, else, switch) |
| 05 | [Boucles](../02-php/05-boucles.md) | Les boucles (for, foreach, while) |
| 06 | [Fonctions](../02-php/06-fonctions.md) | Les fonctions |
| 07 | [Programmation orientée objet](../02-php/07-introduction-poo.md) | Introduction à la programmation orientée objet (POO) |
| 08 | [Classes en détail](../02-php/08-classes-en-detail.md) | Les classes en détail |
| 09 | [Namespaces et use](../02-php/09-namespaces-use.md) | Les namespaces et le mot-clé use |
| 10 | [Attributs PHP](../02-php/10-attributs-php.md) | Les attributs PHP (annotations modernes) |
| 11 | [Interfaces et classes abstraites](../02-php/11-interfaces-classes-abstraites.md) | Les interfaces et les classes abstraites |
| 12 | [Traits](../02-php/12-traits.md) | Les traits |
| 13 | [Exceptions et gestion d'erreurs](../02-php/13-exceptions-gestion-erreurs.md) | Les exceptions et la gestion d'erreurs |
| 14 | [Typage strict et énumérations](../02-php/14-typage-strict-enumerations.md) | Typage strict et énumérations |

---

## Symfony (21 fiches)

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Architecture Symfony](../03-symfony/01-architecture-symfony.md) | Comprendre l'architecture Symfony |
| 02 | [Controleurs et routes](../03-symfony/02-controleurs-routes.md) | Les contrôleurs et les routes |
| 03 | [Templates Twig](../03-symfony/03-templates-twig.md) | Templates Twig |
| 04 | [Introduction à Doctrine](../03-symfony/04-introduction-doctrine.md) | Introduction à Doctrine |
| 05 | [Créer des entités](../03-symfony/05-creer-entites.md) | Créer des entités |
| 06 | [Migrations](../03-symfony/06-migrations.md) | Les migrations |
| 07 | [Relations entre entités](../03-symfony/07-relations-entites.md) | Relations entre entités |
| 08 | [Repository et CRUD](../03-symfony/08-repository-crud.md) | Repository et CRUD |
| 09 | [Formulaires](../03-symfony/09-formulaires.md) | Les formulaires |
| 10 | [Personnaliser EasyAdmin](../03-symfony/10-personnaliser-easyadmin.md) | Personnaliser EasyAdmin |
| 11 | [Validation des données](../03-symfony/11-validation-donnees.md) | Valider les données avec les contraintes Assert |
| 12 | [Sécurité et utilisateurs](../03-symfony/12-securite-utilisateurs.md) | Sécurité et utilisateurs |
| 13 | [Services et injection de dépendances](../03-symfony/13-services-injection-dependances.md) | Services et injection de dépendances |
| 14 | [Événements et listeners](../03-symfony/14-evenements-listeners.md) | Événements et listeners dans Symfony |
| 15 | [Commandes console](../03-symfony/15-commandes-console.md) | Commandes console personnalisées dans Symfony |
| 16 | [API JSON](../03-symfony/16-api-json.md) | Créer des endpoints API JSON dans Symfony |
| 17 | [Tests fonctionnels](../03-symfony/17-tests-fonctionnels.md) | Les tests fonctionnels avec PHPUnit |
| 18 | [Workflow et state machine](../03-symfony/18-workflow-state-machine.md) | Modéliser des processus métier avec le composant Workflow |
| 19 | [Symfony Messenger](../03-symfony/19-messenger.md) | Messages asynchrones avec Symfony Messenger |
| 20 | [Traductions et i18n](../03-symfony/20-traductions.md) | Traductions et internationalisation |
| 21 | [Pagination](../03-symfony/21-pagination.md) | Pagination des résultats |

---

## PostgreSQL (8 fiches)

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Introduction à PostgreSQL](../04-postgresql/01-introduction-postgresql.md) | Introduction à PostgreSQL |
| 02 | [Requêtes SELECT](../04-postgresql/02-requetes-select.md) | Requêtes SELECT |
| 03 | [Jointures](../04-postgresql/03-jointures.md) | Les jointures |
| 04 | [INSERT, UPDATE, DELETE](../04-postgresql/04-insert-update-delete.md) | INSERT, UPDATE et DELETE |
| 05 | [Fonctions d'agrégation](../04-postgresql/05-fonctions-agregation.md) | Les fonctions d'agrégation |
| 06 | [Contraintes et index](../04-postgresql/06-contraintes-index.md) | Les contraintes et les index |
| 07 | [Sous-requêtes et vues](../04-postgresql/07-sous-requetes-vues.md) | Les sous-requêtes et les vues |
| 08 | [Transactions](../04-postgresql/08-transactions.md) | Les transactions |

---

## JavaScript (7 fiches)

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [JavaScript dans Symfony](../05-javascript/01-javascript-dans-symfony.md) | JavaScript dans Symfony |
| 02 | [Webpack Encore - Installation](../05-javascript/02-webpack-encore-installation.md) | Webpack Encore - Installation |
| 03 | [Webpack Encore - Utilisation](../05-javascript/03-webpack-encore-utilisation.md) | Webpack Encore - Utilisation |
| 04 | [Introduction à jQuery](../05-javascript/04-introduction-jquery.md) | Introduction à jQuery |
| 05 | [jQuery et AJAX dans Symfony](../05-javascript/05-jquery-ajax-symfony.md) | jQuery et AJAX dans Symfony |
| 06 | [Stimulus et Symfony UX](../05-javascript/06-stimulus-symfony.md) | Stimulus et Symfony UX |
| 07 | [Symfony AssetMapper](../05-javascript/07-assetmapper-symfony.md) | Symfony AssetMapper |

---

!!! tip "Ordre suggéré"
    Commence par les fiches **Commencer** pour apprendre à utiliser les outils à ta disposition, puis suis les modules dans l'ordre numérique. Chaque module s'appuie sur les connaissances du précédent.

<!-- material/tags { scope: true } -->
