---
tags:
  - Référence
  - Débutant
description: "Aide-mémoire Symfony"
estimated_time: "30 min"
fiche_number: 2
total_fiches: 18
cursus: "Fiches de référence"
id: "references.quick-reference.aide-memoire-symfony"
course_id: "references.quick-reference"
content_type: "reference"
order: 2
---

# Aide-mémoire Symfony

> **En bref** : Aide-mémoire Symfony. Lecture estimée : 30 min.

Fiche de référence rapide pour les commandes `bin/console`.

**Version** : Symfony 7.4 LTS

---

## Exécuter une commande

**Avec Docker** :

```bash
docker compose exec php php bin/console [commande]
```

**Raccourci** (si tu es dans le conteneur) :

```bash
php bin/console [commande]
```

---

## Commandes de génération (make:)

| Commande | Crée |
| -------- | ---- |
| `make:controller NomController` | Contrôleur + template |
| `make:entity Nom` | Entité Doctrine |
| `make:form NomType` | Formulaire |
| `make:migration` | Migration de base de données |
| `make:admin:crud` | CrudController EasyAdmin |

---

## Commandes Doctrine (base de données)

### Migrations

| Commande | Action |
| -------- | ------ |
| `make:migration` | Créer une migration |
| `doctrine:migrations:migrate` | Exécuter les migrations |
| `doctrine:migrations:status` | État des migrations |
| `doctrine:migrations:list` | Liste des migrations |

### Schéma

| Commande | Action |
| -------- | ------ |
| `doctrine:schema:validate` | Vérifier la synchronisation |
| `doctrine:schema:update --dump-sql` | Voir le SQL à exécuter |
| `doctrine:schema:update --force` | Appliquer (dev uniquement) |

### Base de données

| Commande | Action |
| -------- | ------ |
| `doctrine:database:create` | Créer la base |
| `doctrine:database:drop --force` | Supprimer la base |
| `doctrine:query:sql "SELECT..."` | Exécuter du SQL |

---

## Commandes de debug

| Commande | Affiche |
| -------- | ------- |
| `debug:router` | Toutes les routes |
| `debug:router nom_route` | Détail d'une route |
| `debug:container` | Services disponibles |
| `debug:container NomService` | Détail d'un service |
| `debug:twig` | Fonctions/filtres Twig |
| `debug:form NomType` | Options d'un formulaire |

---

## Cache

| Commande | Action |
| -------- | ------ |
| `cache:clear` | Vider le cache |
| `cache:warmup` | Préchauffer le cache |

---

## Commandes courantes

### Créer une nouvelle entité

```bash
php bin/console make:entity Product
```

### Mettre à jour la base après modification d'entité

```bash
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

### Créer un contrôleur

```bash
php bin/console make:controller ProductController
```

### Créer un formulaire pour une entité

```bash
php bin/console make:form ProductType Product
```

### Vérifier si tout est synchronisé

```bash
php bin/console doctrine:schema:validate
```

### Voir toutes les routes

```bash
php bin/console debug:router
```

### Vider le cache

```bash
php bin/console cache:clear
```

---

## Options utiles

| Option | Action |
| ------ | ------ |
| `--help` | Aide sur une commande |
| `--no-interaction` | Pas de questions |
| `-v` / `-vv` / `-vvv` | Mode verbose |

**Exemple** :

```bash
php bin/console doctrine:migrations:migrate --no-interaction
php bin/console make:entity --help
```

---

## Raccourcis de commandes

Certaines commandes ont des raccourcis :

| Raccourci | Commande complète |
| --------- | ----------------- |
| `d:m:m` | `doctrine:migrations:migrate` |
| `d:s:v` | `doctrine:schema:validate` |
| `c:c` | `cache:clear` |

**Exemple** :

```bash
php bin/console d:m:m
```

---

## Workflow typique

### Ajouter une fonctionnalité

```bash
# 1. Créer/modifier l'entité
php bin/console make:entity Product

# 2. Créer la migration
php bin/console make:migration

# 3. Vérifier le SQL généré (ouvrir le fichier)
# migrations/Version*.php

# 4. Exécuter la migration
php bin/console doctrine:migrations:migrate

# 5. Créer le contrôleur si nécessaire
php bin/console make:controller ProductController

# 6. Créer le formulaire si nécessaire
php bin/console make:form ProductType Product
```

### Débugger un problème de route

```bash
# Voir toutes les routes
php bin/console debug:router

# Chercher une route spécifique
php bin/console debug:router | grep product
```

### Après un git pull

```bash
# Installer les dépendances si composer.json a changé
composer install

# Exécuter les migrations
php bin/console doctrine:migrations:migrate

# Vider le cache
php bin/console cache:clear
```

---

## Navigation

← Fiche précédente : **[Aide-mémoire Docker](01-aide-memoire-docker.md)**

→ Fiche suivante : **[Guide de Debug](03-guide-debug.md)**
