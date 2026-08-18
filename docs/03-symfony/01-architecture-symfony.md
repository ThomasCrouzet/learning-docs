---
tags:
  - Symfony
  - Débutant
  - Concept
description: "Comprendre l'architecture Symfony"
estimated_time: "60 min"
fiche_number: 1
total_fiches: 21
cursus: "Symfony"
---

# 01 - Comprendre l'architecture Symfony

> **En bref** : À la fin de cette fiche, tu sauras naviguer dans la structure d'un projet Symfony et tu comprendras le rôle de chaque dossier. Tu comprendras aussi comment une requête HTTP est traitée par Symfony. Lecture estimée : 60 min.


## Prérequis

- Toutes les fiches du [cursus PHP](../02-php/index.md)
- Fiche [01-docker/01 - Créer un environnement Docker Compose pour Symfony](../01-docker/01-docker-compose-symfony.md)
- Savoir utiliser les namespaces et les attributs PHP

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Symfony | 7.4 LTS |
| PHP | 8.3 |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras naviguer dans la structure d'un projet Symfony et tu comprendras le rôle de chaque dossier. Tu comprendras aussi comment une requête HTTP est traitée par Symfony.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Symfony ?

**Définition** : Symfony est un framework PHP. Un framework est un ensemble d'outils, de conventions et de code pré-écrit qui te permet de construire des applications web plus rapidement et de manière structurée.

**Le problème que Symfony résout** :

Sans framework, voici les problèmes rencontrés :

1. **Tout réinventer** : Tu dois écrire toi-même le routage, la gestion des formulaires, la sécurité, etc.

2. **Pas de structure** : Chaque développeur organise son code différemment. Difficile de travailler en équipe.

3. **Sécurité fragile** : Sans expertise, tu risques de créer des failles de sécurité.

4. **Code spaghetti** : Sans conventions, le code devient vite difficile à maintenir.

**Comment Symfony résout ces problèmes** :

| Problème | Solution Symfony |
| -------- | ---------------- |
| Tout réinventer | Composants prêts à l'emploi (routing, forms, security...) |
| Pas de structure | Conventions strictes, structure de dossiers définie |
| Sécurité fragile | Protection intégrée (CSRF, XSS, SQL injection...) |
| Code spaghetti | Architecture MVC claire |

**Analogie concrète** : Symfony est comme un kit de construction LEGO pour adultes. Au lieu de fabriquer chaque brique toi-même, tu utilises des briques standardisées qui s'emboîtent parfaitement. Tu te concentres sur ce que tu veux construire, pas sur la fabrication des briques.

---

### L'architecture MVC

**Définition** : MVC signifie Model-View-Controller. C'est un pattern (modèle de conception) qui sépare le code en trois parties distinctes.

**Les trois parties** :

| Partie | Rôle | Dossier Symfony |
| ------ | ---- | --------------- |
| **Model** | Données et logique métier | `src/Entity/`, `src/Repository/` |
| **View** | Affichage (HTML) | `templates/` |
| **Controller** | Logique de l'application, fait le lien | `src/Controller/` |

**Flux de traitement** :

<div class="diagram-design">
<p><a href="../../diagrams/03-symfony-01-architecture-symfony-1.html">L&#x27;architecture MVC (HTML + SVG)</a></p>
<iframe src="../../diagrams/03-symfony-01-architecture-symfony-1.html" title="L&#x27;architecture MVC" style="width:100%;min-height:532px;border:0;background:transparent"></iframe>
</div>

1. L'utilisateur envoie une **requête** (Request)
2. Le **Controller** reçoit la requête
3. Le Controller demande les données au **Model**
4. Le Controller passe les données à la **View**
5. La View génère le HTML
6. Le Controller renvoie la **réponse** (Response)

---

### Structure des dossiers Symfony

Voici l'arborescence d'un projet Symfony standard :

```text
mon-projet/
├── bin/                    # Commandes (console)
├── config/                 # Configuration
├── migrations/             # Migrations de base de données
├── public/                 # Racine web (accessible par le navigateur)
├── src/                    # TON CODE PHP
├── templates/              # Templates Twig (HTML)
├── tests/                  # Tests automatisés
├── translations/           # Fichiers de traduction
├── var/                    # Cache et logs
├── vendor/                 # Dépendances (Composer)
├── .env                    # Variables d'environnement
├── composer.json           # Dépendances du projet
└── symfony.lock            # Versions exactes des dépendances
```

---

### Détail de chaque dossier

#### Le dossier `public/`

**Rôle** : C'est la racine web. Seul ce dossier est accessible depuis le navigateur.

**Contenu** :

| Fichier | Rôle |
| ------- | ---- |
| `index.php` | Point d'entrée unique (front controller) |
| `assets/` | CSS, JS, images compilés |

**Important** : Ne mets jamais de code PHP sensible dans `public/`. Seul `index.php` doit y être.

---

#### Le dossier `src/`

**Rôle** : C'est ici que tu écris ton code PHP. C'est le cœur de ton application.

**Structure** :

```text
src/
├── Controller/             # Contrôleurs (gèrent les requêtes)
├── Entity/                 # Entités Doctrine (représentent les données)
├── Repository/             # Repositories (requêtes à la base de données)
├── Form/                   # Classes de formulaires
├── Service/                # Services métier
└── Kernel.php              # Noyau de l'application
```

**Namespace** : Toutes les classes dans `src/` ont le namespace `App\`.

| Fichier | Namespace |
| ------- | --------- |
| `src/Controller/ProductController.php` | `App\Controller` |
| `src/Entity/Product.php` | `App\Entity` |
| `src/Repository/ProductRepository.php` | `App\Repository` |

---

#### Le dossier `config/`

**Rôle** : Contient toute la configuration de l'application.

**Structure** :

```text
config/
├── packages/               # Configuration des packages
│   ├── doctrine.yaml       # Configuration Doctrine
│   ├── twig.yaml           # Configuration Twig
│   └── ...
├── routes/                 # Routes (si pas d'attributs)
├── bundles.php             # Liste des bundles activés
├── routes.yaml             # Configuration des routes
└── services.yaml           # Configuration des services
```

**Format** : Les fichiers de configuration sont en YAML (un format simple de données).

---

#### Le dossier `templates/`

**Rôle** : Contient les templates Twig pour générer le HTML.

**Structure** :

```text
templates/
├── base.html.twig          # Template de base (layout)
├── product/                # Templates pour Product
│   ├── index.html.twig     # Liste des produits
│   ├── show.html.twig      # Détail d'un produit
│   └── _form.html.twig     # Formulaire partiel
└── ...
```

**Convention** : Les templates sont organisés par contrôleur. `ProductController` utilise le dossier `templates/product/`.

---

#### Le dossier `var/`

**Rôle** : Stockage temporaire géré par Symfony.

**Contenu** :

| Dossier | Rôle |
| ------- | ---- |
| `var/cache/` | Cache de l'application (compilé) |
| `var/log/` | Fichiers de logs |

**Important** : Ce dossier est généré automatiquement. Ne modifie jamais son contenu manuellement.

---

#### Le dossier `vendor/`

**Rôle** : Contient toutes les dépendances installées par Composer.

**Important** :

- Ne modifie **jamais** les fichiers dans `vendor/`
- Ce dossier est ignoré par Git (`.gitignore`)
- Il est recréé avec `composer install`

---

#### Le dossier `bin/`

**Rôle** : Contient les commandes exécutables.

**Principal fichier** : `bin/console` - La console Symfony.

```bash
# Exemples de commandes
php bin/console cache:clear          # Vider le cache
php bin/console make:controller      # Créer un contrôleur
php bin/console doctrine:migrations:migrate  # Exécuter les migrations
```

---

### Le fichier .env

**Rôle** : Contient les variables d'environnement (configuration sensible ou spécifique à l'environnement).

**Exemple** :

```env
# Mode de l'application
APP_ENV=dev
APP_SECRET=votre_secret_ici

# Base de données
DATABASE_URL="postgresql://user:password@database:5432/app?serverVersion=16"
```

**Variables importantes** :

| Variable | Rôle | Valeurs |
| -------- | ---- | ------- |
| `APP_ENV` | Environnement | `dev`, `prod`, `test` |
| `APP_SECRET` | Clé de sécurité | Chaîne aléatoire |
| `DATABASE_URL` | Connexion BDD | URL de connexion |

**Fichiers .env** :

| Fichier | Rôle | Git |
| ------- | ---- | --- |
| `.env` | Valeurs par défaut | Oui |
| `.env.local` | Tes valeurs locales | Non (ignoré) |
| `.env.prod` | Valeurs de production | Selon le projet |

---

### Le cycle requête/réponse

Quand un utilisateur accède à une URL, voici ce qui se passe :

**Étape 1 : Réception de la requête**

```text
Navigateur → http://localhost:8080/products
                         │
                         ▼
                    public/index.php
```

**Étape 2 : Routing**

Symfony cherche quel contrôleur correspond à l'URL `/products`.

```php
#[Route('/products', name: 'product_list')]
public function list(): Response
```

**Étape 3 : Exécution du contrôleur**

Le contrôleur s'exécute et prépare les données.

```php
public function list(ProductRepository $repository): Response
{
    $products = $repository->findAll();

    return $this->render('product/index.html.twig', [
        'products' => $products,
    ]);
}
```

**Étape 4 : Rendu du template**

Twig génère le HTML avec les données.

**Étape 5 : Envoi de la réponse**

Le HTML est envoyé au navigateur.

---

### Les bundles

**Définition** : Un bundle est un paquet de code réutilisable qui ajoute des fonctionnalités à Symfony.

**Bundles courants** :

| Bundle | Rôle |
| ------ | ---- |
| `DoctrineBundle` | Intégration de Doctrine (ORM) |
| `TwigBundle` | Moteur de templates Twig |
| `SecurityBundle` | Gestion de l'authentification |
| `MakerBundle` | Génération de code |

**Où sont-ils configurés** : Dans `config/bundles.php`.

---

## Étapes Pratiques

### Étape 1 : Explorer la structure de ton projet

Dans ton terminal, navigue dans ton projet Symfony et liste les dossiers :

```bash
# Liste les dossiers principaux
ls -la
```

**Résultat attendu** :

```text
drwxr-xr-x   bin/
drwxr-xr-x   config/
drwxr-xr-x   migrations/
drwxr-xr-x   public/
drwxr-xr-x   src/
drwxr-xr-x   templates/
drwxr-xr-x   var/
drwxr-xr-x   vendor/
-rw-r--r--   .env
-rw-r--r--   composer.json
```

---

### Étape 2 : Explorer le dossier src/

```bash
# Voir le contenu de src/
ls -la src/
```

**Résultat attendu** :

```text
drwxr-xr-x   Controller/
drwxr-xr-x   Entity/
drwxr-xr-x   Repository/
-rw-r--r--   Kernel.php
```

---

### Étape 3 : Examiner le point d'entrée

Lis le fichier `public/index.php` :

```bash
# Dans Docker
docker compose exec php cat public/index.php
```

**Contenu** :

```php
<?php

use App\Kernel;

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

return function (array $context) {
    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};
```

**Explication** :

| Ligne | Rôle |
| ----- | ---- |
| `require autoload_runtime.php` | Charge l'autoloader Composer et prépare le lancement de l'application |
| `return function (array $context)` | Retourne une fonction qui sera appelée par Symfony pour démarrer l'application |
| `new Kernel(...)` | Crée le noyau Symfony avec l'environnement (`APP_ENV`) et le mode debug (`APP_DEBUG`) |

Depuis Symfony 5.3, ce fichier ne crée plus directement la requête : il se contente de retourner le noyau. Symfony s'occupe en interne de créer la Request, d'appeler le noyau puis d'envoyer la réponse au navigateur.

---

### Étape 4 : Lister les routes existantes

Utilise la console Symfony pour voir les routes :

```bash
# Dans Docker
docker compose exec php php bin/console debug:router
```

**Résultat exemple** :

```text
 ------------------- -------- -------- ------ -------------------------
  Name                Method   Scheme   Host   Path
 ------------------- -------- -------- ------ -------------------------
  _preview_error      ANY      ANY      ANY    /_error/{code}.{_format}
  product_index       GET      ANY      ANY    /products
  product_show        GET      ANY      ANY    /products/{id}
 ------------------- -------- -------- ------ -------------------------
```

---

### Étape 5 : Examiner la configuration

Regarde le fichier de configuration principal :

```bash
# Dans Docker
docker compose exec php cat config/services.yaml
```

**Contenu typique** :

```yaml
services:
    _defaults:
        autowire: true
        autoconfigure: true

    App\:
        resource: '../src/'
        exclude:
            - '../src/DependencyInjection/'
            - '../src/Entity/'
            - '../src/Kernel.php'
```

**Explication** :

| Ligne | Signification |
| ----- | ------------- |
| `autowire: true` | Injection automatique des dépendances |
| `autoconfigure: true` | Configuration automatique des services |
| `App\:` | Toutes les classes dans `src/` sont des services |
| `exclude:` | Sauf ces dossiers/fichiers |

---

### Étape 6 : Vérifier l'environnement

```bash
# Dans Docker
docker compose exec php php bin/console about
```

**Résultat exemple** :

```text
 -------------------- -------------------------------------------
  Symfony
 -------------------- -------------------------------------------
  Version              7.4.x
  Long-Term Support    Yes
  End of maintenance   11/2028
 -------------------- -------------------------------------------
  Kernel
 -------------------- -------------------------------------------
  Type                 App\Kernel
  Environment          dev
  Debug                true
  Charset              UTF-8
  Cache directory      ./var/cache/dev
  Log directory        ./var/log
 -------------------- -------------------------------------------
```

---

### Étape 7 : Vider le cache

Le cache Symfony stocke les routes compilées, les templates, etc. Pour le vider :

```bash
# Dans Docker
docker compose exec php php bin/console cache:clear
```

**Résultat attendu** :

```text
 // Clearing the cache for the dev environment with debug true

 [OK] Cache for the "dev" environment (debug=true) was successfully cleared.
```

---

## Commandes Utiles

| Commande | Description |
| -------- | ----------- |
| `php bin/console` | Liste toutes les commandes disponibles |
| `php bin/console about` | Informations sur l'environnement |
| `php bin/console debug:router` | Liste des routes |
| `php bin/console debug:container` | Liste des services |
| `php bin/console cache:clear` | Vider le cache |
| `php bin/console make:controller` | Créer un contrôleur |
| `php bin/console make:entity` | Créer une entité |

---

## Pièges Fréquents

### Piège 1 : Modifier des fichiers dans vendor/

**Problème** : Tes modifications sont perdues au prochain `composer install`.

**Solution** : Ne modifie jamais `vendor/`. Crée tes propres classes dans `src/`.

---

### Piège 2 : Oublier de vider le cache

**Problème** : Tes modifications ne sont pas prises en compte.

**Solution** : En développement, le cache se vide souvent automatiquement. En cas de doute, lance `php bin/console cache:clear`.

---

### Piège 3 : Mettre du code PHP dans public/

**Problème** : Risque de sécurité, le code est accessible directement.

**Solution** : Seul `index.php` doit être dans `public/`. Le reste de ton code va dans `src/`.

---

### Piège 4 : Confondre les fichiers .env

**Problème** : Tes variables d'environnement ne sont pas lues.

**Solution** : `.env.local` surcharge `.env`. Vérifie quel fichier contient tes valeurs.

```bash
# Voir les variables chargées
docker compose exec php php bin/console debug:container --env-vars
```

---

### Piège 5 : Namespace incorrect

**Problème** : Erreur "Class not found".

**Solution** : Le namespace doit correspondre au chemin du fichier.

| Fichier | Namespace correct |
| ------- | ----------------- |
| `src/Controller/ProductController.php` | `App\Controller` |
| `src/Entity/Product.php` | `App\Entity` |
| `src/Service/CartService.php` | `App\Service` |

---

## Checklist de Validation

- [ ] Je connais le rôle de chaque dossier principal (src/, public/, config/, templates/, var/, vendor/)
- [ ] Je comprends que seul public/ est accessible par le navigateur
- [ ] Je sais que mon code PHP va dans src/
- [ ] Je comprends le pattern MVC (Model-View-Controller)
- [ ] Je sais utiliser la console Symfony (php bin/console)
- [ ] Je sais vider le cache avec cache:clear
- [ ] Je comprends le rôle du fichier .env
- [ ] Je sais lister les routes avec debug:router

---

## Exercice Pratique

**Énoncé** : Explore ton projet Symfony et crée un document récapitulatif.

**Indications** :

- Liste tous les contrôleurs présents dans `src/Controller/`
- Liste toutes les entités présentes dans `src/Entity/`
- Liste toutes les routes avec `debug:router`
- Note la version de Symfony avec `about`
- Vérifie les variables d'environnement avec `debug:container --env-vars`

**Résultat attendu** : Tu connais le contenu de ton projet Symfony.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# 1. Lister les contrôleurs
docker compose exec php ls -la src/Controller/

# Exemple de résultat :
# ProductController.php
# HomeController.php

# 2. Lister les entités
docker compose exec php ls -la src/Entity/

# Exemple de résultat :
# Product.php
# Category.php

# 3. Lister les routes
docker compose exec php php bin/console debug:router

# Exemple de résultat :
#  product_index    GET    /products
#  product_show     GET    /products/{id}
#  home             GET    /

# 4. Informations sur Symfony
docker compose exec php php bin/console about

# Note la version : Symfony 7.4.x

# 5. Variables d'environnement
docker compose exec php php bin/console debug:container --env-vars

# Exemple de résultat :
# APP_ENV          dev
# APP_SECRET       ****
# DATABASE_URL     postgresql://...
```

**Récapitulatif type** :

| Élément | Valeur |
| ------- | ------ |
| Version Symfony | 7.4.x |
| Environnement | dev |
| Contrôleurs | ProductController, HomeController |
| Entités | Product, Category |
| Routes | 3 routes définies |

---

## Navigation

→ Fiche suivante : **[Les contrôleurs et les routes](02-controleurs-routes.md)**
