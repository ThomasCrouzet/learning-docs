---
tags:
  - Symfony
  - Avancé
  - Pratique
description: "Services et injection de dépendances"
estimated_time: "85 min"
fiche_number: 13
total_fiches: 21
cursus: "Symfony"
---

# 13 - Services et injection de dépendances

> **En bref** : À la fin de cette fiche, tu sauras ce qu'est le container de services, comment fonctionne l'autowiring, et comment créer tes propres services dans Symfony 7.4. Lecture estimée : 85 min.


## Prérequis

- Avoir lu la fiche **[01 - Comprendre l'architecture Symfony](01-architecture-symfony.md)**
- Avoir lu la fiche **[09 - Les namespaces et le mot-clé use](../02-php/09-namespaces-use.md)** (PHP)
- Savoir créer un contrôleur Symfony

## Objectif de cette fiche

À la fin de cette fiche, tu sauras ce qu'est le container de services, comment fonctionne l'autowiring, et comment créer tes propres services dans Symfony 7.4.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un service ?

**Définition** : Un service est un objet PHP qui effectue une tâche précise. Par exemple : envoyer un email, générer un slug, écrire dans les logs ou interroger la base de données.

**Le problème que les services résolvent** :

Sans services, voici les problèmes rencontrés :

1. **Code dupliqué** : Tu copies la même logique dans plusieurs contrôleurs (ex : générer un slug à partir d'un titre).
2. **Couplage fort** : Chaque contrôleur crée lui-même les objets dont il a besoin, ce qui rend le code difficile à modifier.
3. **Tests impossibles** : Tu ne peux pas remplacer un objet par un faux objet (mock) pour les tests.

**Comment les services résolvent ces problèmes** :

| Problème | Solution apportée par les services |
| -------- | ---------------------------------- |
| Code dupliqué | La logique est centralisée dans une seule classe |
| Couplage fort | Les dépendances sont injectées, pas créées en dur |
| Tests impossibles | Tu peux remplacer un service par un mock dans les tests |

**Analogie concrète** : Un service est comme un service postal. Tu lui donnes une lettre avec une adresse, et il s'occupe de tout : transport, tri, distribution. Tu n'as pas besoin de savoir comment il fonctionne en interne. Tu lui fournis une entrée, il fait le travail et te retourne un résultat.

**Ce qu'un service n'est PAS** :

- Un service n'est pas une entité. Une entité représente une donnée (un article, un utilisateur). Un service effectue une action (envoyer un email, générer un PDF).
- Un service n'est pas un contrôleur. Un contrôleur gère une requête HTTP et retourne une réponse. Un service contient la logique métier réutilisable.

**Comparaison service vs entité** :

| Service | Entité |
| ------- | ------ |
| Effectue une action | Représente une donnée |
| N'est pas stocké en base | Est stocké en base |
| Exemple : `MailerInterface` | Exemple : `User` |
| Logique métier | Structure de données |

---

### Le container de services

**Définition** : Le container de services est le registre central de Symfony qui crée, configure et distribue tous les services de l'application.

**Le problème que le container résout** :

Sans container, voici les problèmes :

1. **Création manuelle** : Tu dois créer chaque objet toi-même et gérer ses dépendances.
2. **Gestion des dépendances** : Si un service a besoin d'un autre service, tu dois tout chaîner manuellement.

```php
// ❌ Sans container : création manuelle des objets
$logger = new Logger('app');
$mailer = new Mailer($transport);
$notifier = new NotificationService($mailer, $logger);
```

**Comment le container résout ce problème** :

```php
// ✅ Avec container : Symfony crée et injecte automatiquement
public function __construct(
    private NotificationService $notifier,  // Symfony crée tout seul
) {
}
```

**Analogie concrète** : Le container est comme un entrepôt central de fournitures. Au lieu d'aller acheter chaque fourniture toi-même (papier, stylos, enveloppes), tu passes commande à l'entrepôt et il te livre exactement ce dont tu as besoin. L'entrepôt sait quelles fournitures existent et comment les assembler.

Le diagramme suivant montre comment le container résout les dépendances et injecte un service dans un contrôleur :

<div class="diagram-design">
<p><a href="../../diagrams/03-symfony-13-services-injection-dépendances-1.html">Le container de services (HTML + SVG)</a></p>
<iframe src="../../diagrams/03-symfony-13-services-injection-dépendances-1.html" title="Le container de services" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### L'injection de dépendances

**Définition** : L'injection de dépendances est un pattern où un objet reçoit ses dépendances de l'extérieur au lieu de les créer lui-même.

**Le problème que l'injection résout** :

```php
// ❌ Sans injection : le service crée sa dépendance
class NotificationService
{
    private Mailer $mailer;

    public function __construct()
    {
        // Le service crée lui-même le mailer
        // Impossible de le remplacer ou de le configurer différemment
        $this->mailer = new Mailer('smtp://localhost');
    }
}
```

```php
// ✅ Avec injection : le service reçoit sa dépendance
class NotificationService
{
    public function __construct(
        private MailerInterface $mailer,  // Reçu de l'extérieur
    ) {
    }
}
```

**Analogie concrète** : Sans injection, c'est comme aller au magasin acheter tes ingrédients toi-même avant de cuisiner. Avec injection, c'est comme se faire livrer les ingrédients à domicile : tu reçois exactement ce dont tu as besoin, prêt à l'emploi.

**Les deux types d'injection** :

| Type | Comment | Quand l'utiliser |
| ---- | ------- | ---------------- |
| Par constructeur | `__construct(private Service $service)` | Pour les dépendances obligatoires |
| Par méthode | `maMethode(Service $service)` | Pour les dépendances occasionnelles |

---

### L'autowiring

**Définition** : L'autowiring est la capacité de Symfony à deviner automatiquement quel service injecter en se basant sur le type-hint (le type déclaré) du paramètre.

**Comment ça fonctionne** :

```text
1. Tu déclares un paramètre avec un type : EntityManagerInterface $em
2. Symfony regarde le type : EntityManagerInterface
3. Symfony cherche dans le container un service qui implémente cette interface
4. Symfony injecte automatiquement le bon service
```

**Exemple concret** :

```php
// Tu écris ceci :
public function __construct(
    private EntityManagerInterface $em,
    private LoggerInterface $logger,
)

// Symfony comprend :
// - EntityManagerInterface → injecter le service Doctrine EntityManager
// - LoggerInterface → injecter le service Monolog Logger
```

**Ce que l'autowiring n'est PAS** :

- L'autowiring n'est pas de la magie. Symfony se base uniquement sur le type-hint PHP pour trouver le bon service.
- L'autowiring ne fonctionne pas si plusieurs services implémentent la même interface sans configuration supplémentaire.

---

### Le fichier config/services.yaml

**Définition** : Le fichier `config/services.yaml` configure le container de services. Il définit les règles par défaut et les configurations spécifiques.

**Structure du fichier** :

```yaml
# config/services.yaml

# Paramètres globaux de l'application
parameters:
    app.admin_email: 'admin@example.com'
    app.items_per_page: 20

services:
    # Règles par défaut pour tous les services
    _defaults:
        autowire: true       # Active l'autowiring
        autoconfigure: true  # Active l'autoconfiguration

    # Enregistre automatiquement toutes les classes de src/ comme services
    App\:
        resource: '../src/'
        exclude:
            - '../src/DependencyInjection/'
            - '../src/Entity/'       # Les entités ne sont pas des services
            - '../src/Kernel.php'
```

**Explication de chaque section** :

| Clé | Rôle |
| --- | ---- |
| `parameters` | Définit des valeurs de configuration réutilisables |
| `_defaults.autowire` | Active l'injection automatique par type-hint |
| `_defaults.autoconfigure` | Détecte automatiquement les tags (contrôleurs, commandes...) |
| `App\` | Enregistre toutes les classes de `src/` comme services |
| `exclude` | Exclut les classes qui ne sont pas des services (entités, kernel) |

---

### Les services courants de Symfony

Voici les services que tu utiliseras le plus souvent :

| Interface | Service | Rôle |
| --------- | ------- | ---- |
| `EntityManagerInterface` | Doctrine EntityManager | Gérer les entités en base |
| `LoggerInterface` | Monolog Logger | Écrire des logs |
| `MailerInterface` | Symfony Mailer | Envoyer des emails |
| `CacheInterface` | Symfony Cache | Mettre en cache des données |
| `RequestStack` | Request Stack | Accéder à la requête HTTP |
| `RouterInterface` | Symfony Router | Générer des URLs |
| `EventDispatcherInterface` | Event Dispatcher | Dispatcher des événements |
| `ValidatorInterface` | Symfony Validator | Valider des objets |
| `Security` | Symfony Security | Accéder à l'utilisateur connecté |

---

### Injection par constructeur vs injection par méthode

**Injection par constructeur** (recommandée pour les dépendances obligatoires) :

```php
class MonService
{
    // Le service est disponible dans toute la classe
    public function __construct(
        private EntityManagerInterface $em,
        private LoggerInterface $logger,
    ) {
    }

    public function maMethode(): void
    {
        $this->em->flush();
        $this->logger->info('Données sauvegardées.');
    }
}
```

**Injection par méthode** (pour les contrôleurs, où Symfony injecte dans chaque action) :

```php
class ArticleController extends AbstractController
{
    // Le service est injecté uniquement dans cette méthode
    #[Route('/articles', name: 'article_index')]
    public function index(EntityManagerInterface $em): Response
    {
        $articles = $em->getRepository(Article::class)->findAll();
        // ...
    }
}
```

**Quand utiliser quel type** :

| Situation | Type d'injection |
| --------- | ---------------- |
| Service personnalisé | Constructeur |
| Contrôleur | Méthode (chaque action reçoit ses dépendances) |
| Dépendance utilisée partout dans la classe | Constructeur |
| Dépendance utilisée dans une seule méthode | Méthode |

---

## Étapes Pratiques

### Étape 1 : Lister les services disponibles

Pour voir tous les services enregistrés dans le container :

```bash
php bin/console debug:container
```

**Résultat attendu** (extrait) :

```text
 --------------------------------- ---------------------------------------------------
  Service ID                        Class name
 --------------------------------- ---------------------------------------------------
  App\Controller\ArticleController  App\Controller\ArticleController
  App\Repository\ArticleRepository  App\Repository\ArticleRepository
  doctrine.orm.entity_manager       Doctrine\ORM\EntityManager
  logger                            Symfony\Bridge\Monolog\Logger
  mailer                            Symfony\Component\Mailer\Mailer
 --------------------------------- ---------------------------------------------------
```

Pour chercher un service précis :

```bash
php bin/console debug:container EntityManager
```

**Résultat attendu** :

```text
 Select one of the following services to display its information:
  [0] doctrine.orm.default_entity_manager
  [1] Doctrine\ORM\EntityManagerInterface
```

Pour voir les détails d'un service :

```bash
php bin/console debug:container doctrine.orm.default_entity_manager
```

---

### Étape 2 : Injecter un service dans un contrôleur

L'injection dans un contrôleur se fait directement dans les paramètres de la méthode :

```php
<?php
// src/Controller/ArticleController.php

namespace App\Controller;

use App\Entity\Article;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ArticleController extends AbstractController
{
    #[Route('/articles', name: 'article_index')]
    public function index(
        EntityManagerInterface $em,  // Symfony injecte le EntityManager
        LoggerInterface $logger,     // Symfony injecte le Logger
    ): Response {
        // Utiliser le EntityManager pour récupérer les articles
        $articles = $em->getRepository(Article::class)->findAll();

        // Utiliser le Logger pour écrire un log
        $logger->info('Liste des articles consultée.', [
            'count' => count($articles),
        ]);

        return $this->render('article/index.html.twig', [
            'articles' => $articles,
        ]);
    }
}
```

**Comment Symfony sait quel service injecter** :

```text
1. Symfony lit le type-hint : EntityManagerInterface
2. Il cherche dans le container un service de ce type
3. Il trouve doctrine.orm.default_entity_manager
4. Il l'injecte dans le paramètre $em
```

---

### Étape 3 : Créer un service personnalisé

**Objectif** : Créer un service `SlugGenerator` qui transforme un titre en slug (URL-friendly).

```php
<?php
// src/Service/SlugGenerator.php

namespace App\Service;

class SlugGenerator
{
    /**
     * Transforme un texte en slug.
     *
     * Exemple : "Mon Article de Blog" → "mon-article-de-blog"
     */
    public function generate(string $text): string
    {
        // 1. Convertir en minuscules
        $slug = strtolower($text);

        // 2. Remplacer les caractères accentués
        $slug = transliterator_transliterate(
            'Any-Latin; Latin-ASCII; Lower()',
            $slug
        );

        // 3. Remplacer tout ce qui n'est pas une lettre ou un chiffre par un tiret
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);

        // 4. Supprimer les tirets en début et fin
        $slug = trim($slug, '-');

        return $slug;
    }
}
```

**Le service est automatiquement disponible** : Grâce à la configuration `App\` dans `services.yaml`, toute classe dans `src/` est automatiquement enregistrée comme service. Tu n'as rien d'autre à configurer.

---

### Étape 4 : Injecter un service dans un autre service

**Objectif** : Créer un service `ArticleManager` qui utilise `SlugGenerator` et `EntityManagerInterface`.

```php
<?php
// src/Service/ArticleManager.php

namespace App\Service;

use App\Entity\Article;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

class ArticleManager
{
    // Injection par constructeur : les services sont reçus automatiquement
    public function __construct(
        private EntityManagerInterface $em,
        private SlugGenerator $slugGenerator,
        private LoggerInterface $logger,
    ) {
    }

    /**
     * Crée un nouvel article avec un slug auto-généré.
     */
    public function createArticle(string $title, string $content): Article
    {
        $article = new Article();
        $article->setTitle($title);
        $article->setContent($content);

        // Utiliser le service SlugGenerator
        $slug = $this->slugGenerator->generate($title);
        $article->setSlug($slug);

        // Sauvegarder en base avec le EntityManager
        $this->em->persist($article);
        $this->em->flush();

        // Écrire un log
        $this->logger->info('Article créé.', [
            'title' => $title,
            'slug' => $slug,
        ]);

        return $article;
    }

    /**
     * Publie un article (change son statut).
     */
    public function publish(Article $article): void
    {
        $article->setStatus('published');
        $article->setPublishedAt(new \DateTimeImmutable());

        $this->em->flush();

        $this->logger->info('Article publié.', [
            'id' => $article->getId(),
        ]);
    }
}
```

**Utiliser ce service dans un contrôleur** :

```php
<?php
// src/Controller/ArticleController.php

namespace App\Controller;

use App\Service\ArticleManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ArticleController extends AbstractController
{
    #[Route('/articles/new', name: 'article_new', methods: ['GET', 'POST'])]
    public function new(Request $request, ArticleManager $articleManager): Response
    {
        if ($request->isMethod('POST')) {
            $title = $request->request->get('title');
            $content = $request->request->get('content');

            // Utiliser le service ArticleManager
            $article = $articleManager->createArticle($title, $content);

            return $this->redirectToRoute('article_show', [
                'id' => $article->getId(),
            ]);
        }

        return $this->render('article/new.html.twig');
    }
}
```

**Chaîne d'injection** :

```text
Contrôleur
  └── reçoit ArticleManager
        └── reçoit EntityManagerInterface
        └── reçoit SlugGenerator
        └── reçoit LoggerInterface
```

Symfony crée et injecte automatiquement toute la chaîne.

---

### Étape 5 : Configurer un paramètre dans services.yaml (bind)

Tu peux passer des valeurs de configuration à tes services avec `bind` :

```yaml
# config/services.yaml
services:
    _defaults:
        autowire: true
        autoconfigure: true
        bind:
            # Tous les services avec un paramètre $adminEmail recevront cette valeur
            $adminEmail: 'admin@example.com'
            # Tous les services avec un paramètre $itemsPerPage recevront cette valeur
            $itemsPerPage: 20
```

**Utiliser le paramètre dans un service** :

```php
<?php
// src/Service/NotificationService.php

namespace App\Service;

use Psr\Log\LoggerInterface;

class NotificationService
{
    public function __construct(
        private LoggerInterface $logger,
        private string $adminEmail,   // Injecté par bind
        private int $itemsPerPage,    // Injecté par bind
    ) {
    }

    public function notifyAdmin(string $message): void
    {
        $this->logger->info('Notification envoyée à {email}.', [
            'email' => $this->adminEmail,
            'message' => $message,
        ]);

        // Envoyer un email à $this->adminEmail...
    }
}
```

**Alternative : utiliser des paramètres nommés** :

```yaml
# config/services.yaml
parameters:
    app.admin_email: 'admin@example.com'
    app.items_per_page: 20

services:
    _defaults:
        autowire: true
        autoconfigure: true
        bind:
            $adminEmail: '%app.admin_email%'
            $itemsPerPage: '%app.items_per_page%'
```

---

### Étape 6 : Utiliser #[Autowire] pour des paramètres spécifiques

L'attribut `#[Autowire]` permet d'injecter des paramètres ou des services spécifiques directement dans le constructeur :

```php
<?php
// src/Service/FileUploader.php

namespace App\Service;

use Symfony\Component\DependencyInjection\Attribute\Autowire;

class FileUploader
{
    public function __construct(
        // Injecter un paramètre de configuration
        #[Autowire('%kernel.project_dir%/public/uploads')]
        private string $uploadDir,

        // Injecter une variable d'environnement
        #[Autowire(env: 'APP_UPLOAD_MAX_SIZE')]
        private string $maxSize,

        // Injecter un paramètre défini dans parameters
        #[Autowire('%app.admin_email%')]
        private string $adminEmail,
    ) {
    }

    public function upload(string $filename, string $content): string
    {
        // Vérifier que le dossier existe
        if (!is_dir($this->uploadDir)) {
            mkdir($this->uploadDir, 0755, true);
        }

        // Sauvegarder le fichier
        $path = $this->uploadDir . '/' . $filename;
        file_put_contents($path, $content);

        return $path;
    }

    public function getUploadDir(): string
    {
        return $this->uploadDir;
    }
}
```

**Options de l'attribut #[Autowire]** :

| Syntaxe | Ce qui est injecté | Exemple |
| ------- | ------------------ | ------- |
| `#[Autowire('%param%')]` | Un paramètre du container | `%kernel.project_dir%` |
| `#[Autowire(env: 'VAR')]` | Une variable d'environnement | `APP_SECRET` |
| `#[Autowire(service: 'id')]` | Un service par son ID | `logger` |

---

### Étape 7 : Décorer un service existant

**Objectif** : Modifier le comportement d'un service existant sans changer son code source.

**Exemple** : Ajouter un log automatique à chaque appel du `SlugGenerator`.

```php
<?php
// src/Service/LoggingSlugGenerator.php

namespace App\Service;

use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\AsDecorator;
use Symfony\Component\DependencyInjection\Attribute\AutowireDecorated;

#[AsDecorator(decorates: SlugGenerator::class)]
class LoggingSlugGenerator extends SlugGenerator
{
    public function __construct(
        #[AutowireDecorated]
        private SlugGenerator $inner,  // Le service original
        private LoggerInterface $logger,
    ) {
    }

    public function generate(string $text): string
    {
        // Appeler le service original
        $slug = $this->inner->generate($text);

        // Ajouter un log
        $this->logger->debug('Slug généré.', [
            'input' => $text,
            'output' => $slug,
        ]);

        return $slug;
    }
}
```

**Comment ça fonctionne** :

```text
1. L'attribut #[AsDecorator] indique à Symfony que cette classe remplace SlugGenerator
2. Quand un service demande SlugGenerator, il reçoit LoggingSlugGenerator
3. LoggingSlugGenerator reçoit le SlugGenerator original via #[AutowireDecorated]
4. Il appelle le service original et ajoute un log
```

**Analogie concrète** : Un décorateur est comme un emballage cadeau. Le cadeau à l'intérieur ne change pas, mais l'emballage ajoute quelque chose en plus (ici, un log). Tu peux empiler plusieurs emballages (décorateurs) autour du même objet.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console debug:container` | Lister tous les services |
| `php bin/console debug:container MonService` | Chercher un service par nom |
| `php bin/console debug:container --tag=controller.service_arguments` | Lister les services par tag |
| `php bin/console debug:autowiring` | Lister tous les types autowirables |
| `php bin/console debug:autowiring Mailer` | Chercher un type autowirable |
| `php bin/console debug:container --parameters` | Lister tous les paramètres |

---

## Pièges Fréquents

### Piège 1 : Service non trouvé (classe pas dans src/)

**Problème** : Erreur `Cannot autowire service "App\Service\MonService": argument "$dependency" of method "__construct()" has type "App\Lib\MaClasse" but no such service exists.`

**Cause** : La classe `MaClasse` n'est pas dans le dossier `src/`, ou elle est dans un dossier exclu.

**Solution** : Vérifier que la classe est dans `src/` et qu'elle n'est pas exclue dans `services.yaml` :

```yaml
# config/services.yaml
services:
    App\:
        resource: '../src/'
        exclude:
            - '../src/Entity/'  # Les entités sont exclues, c'est normal
            # Vérifier que ton dossier n'est pas listé ici
```

---

### Piège 2 : Confondre service et entité

**Problème** : Tu essaies d'injecter une entité dans un constructeur.

**Cause** : Les entités ne sont pas des services. Elles sont créées par Doctrine, pas par le container.

```php
// ❌ Une entité ne peut pas être injectée
public function __construct(
    private User $user,  // Erreur : User est une entité, pas un service
)

// ✅ Injecter le repository pour accéder aux entités
public function __construct(
    private UserRepository $userRepository,
)
```

---

### Piège 3 : Injection circulaire

**Problème** : Erreur `Circular reference detected for service "App\Service\ServiceA"`.

**Cause** : ServiceA dépend de ServiceB, et ServiceB dépend de ServiceA.

```text
ServiceA → dépend de → ServiceB
ServiceB → dépend de → ServiceA
→ Boucle infinie !
```

**Solution** : Revoir l'architecture. Extraire la logique commune dans un troisième service :

```text
ServiceA → dépend de → ServiceC
ServiceB → dépend de → ServiceC
→ Pas de boucle
```

---

### Piège 4 : Service stateful vs stateless

**Problème** : Un service conserve des données d'une requête à l'autre.

**Cause** : Tu stockes des données dans des propriétés du service. Les services sont des singletons : une seule instance est créée et réutilisée pour toutes les requêtes.

```php
// ❌ Stateful : le compteur s'incrémente à chaque requête
class Counter
{
    private int $count = 0;

    public function increment(): int
    {
        return ++$this->count;  // 1, 2, 3... entre les requêtes
    }
}

// ✅ Stateless : pas de données conservées entre les requêtes
class Counter
{
    public function count(array $items): int
    {
        return count($items);  // Résultat basé uniquement sur l'entrée
    }
}
```

**Règle** : Un service ne doit pas stocker de données liées à une requête. Il reçoit ses données en paramètre de méthode et retourne un résultat.

---

### Piège 5 : Plusieurs services implémentent la même interface

**Problème** : Erreur `Cannot autowire service: argument "$logger" of method "__construct()" references interface "Psr\Log\LoggerInterface" but no such service exists. You should maybe alias this interface to one of these existing services: "monolog.logger", "monolog.logger.request"`.

**Cause** : Plusieurs services implémentent `LoggerInterface`. Symfony ne sait pas lequel injecter.

**Solution** : Utiliser `#[Autowire]` pour préciser le service :

```php
use Symfony\Component\DependencyInjection\Attribute\Autowire;

public function __construct(
    #[Autowire(service: 'monolog.logger.request')]
    private LoggerInterface $logger,
)
```

---

## Checklist de Validation

- [ ] Je sais ce qu'est un service et la différence avec une entité
- [ ] Je comprends le rôle du container de services
- [ ] Je sais injecter un service dans un contrôleur (par méthode)
- [ ] Je sais injecter un service dans un autre service (par constructeur)
- [ ] Je sais créer un service personnalisé dans `src/Service/`
- [ ] Je comprends le fichier `config/services.yaml`
- [ ] Je sais utiliser `bind` et `#[Autowire]` pour les paramètres
- [ ] Je sais utiliser `debug:container` et `debug:autowiring`

---

## Exercice Pratique

**Énoncé** : Crée un service `NotificationService` qui envoie des notifications par email et écrit un log.

**Spécifications** :

1. Crée un service `src/Service/NotificationService.php` :

   **Dépendances à injecter** :

   - `MailerInterface` (pour envoyer des emails)
   - `LoggerInterface` (pour écrire des logs)
   - Un paramètre `$adminEmail` via bind (ex : `admin@example.com`)

   **Méthode à implémenter** : `notifyNewArticle(Article $article): void`

   - Envoie un email à l'admin pour le prévenir qu'un nouvel article a été créé
   - Écrit un log avec le titre de l'article

2. Crée un service `src/Service/ArticleWorkflow.php` :

   **Dépendances à injecter** :

   - `EntityManagerInterface`
   - `SlugGenerator` (créé à l'étape 3)
   - `NotificationService`

   **Méthode à implémenter** : `createAndNotify(string $title, string $content): Article`

   - Crée un article avec un slug auto-généré
   - Sauvegarde en base
   - Envoie une notification via `NotificationService`
   - Retourne l'article créé

3. Utilise `ArticleWorkflow` dans un contrôleur sur la route `/articles/new`

**Résultat attendu** :

- Quand tu crées un article, un email est envoyé à l'admin et un log est écrit
- La commande `php bin/console debug:container NotificationService` affiche le service avec ses dépendances

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Configuration `config/services.yaml`** :

```yaml
# config/services.yaml
parameters:
    app.admin_email: 'admin@example.com'

services:
    _defaults:
        autowire: true
        autoconfigure: true
        bind:
            $adminEmail: '%app.admin_email%'

    App\:
        resource: '../src/'
        exclude:
            - '../src/DependencyInjection/'
            - '../src/Entity/'
            - '../src/Kernel.php'
```

**Service `src/Service/SlugGenerator.php`** :

```php
<?php

namespace App\Service;

class SlugGenerator
{
    public function generate(string $text): string
    {
        $slug = strtolower($text);
        $slug = transliterator_transliterate(
            'Any-Latin; Latin-ASCII; Lower()',
            $slug
        );
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
        $slug = trim($slug, '-');

        return $slug;
    }
}
```

**Service `src/Service/NotificationService.php`** :

```php
<?php

namespace App\Service;

use App\Entity\Article;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class NotificationService
{
    public function __construct(
        private MailerInterface $mailer,
        private LoggerInterface $logger,
        private string $adminEmail,  // Injecté via bind
    ) {
    }

    /**
     * Envoie une notification par email quand un article est créé.
     */
    public function notifyNewArticle(Article $article): void
    {
        // Créer l'email
        $email = (new Email())
            ->from('noreply@example.com')
            ->to($this->adminEmail)
            ->subject('Nouvel article : ' . $article->getTitle())
            ->text(sprintf(
                "Un nouvel article a été créé :\n\nTitre : %s\nSlug : %s",
                $article->getTitle(),
                $article->getSlug()
            ));

        // Envoyer l'email
        $this->mailer->send($email);

        // Écrire un log
        $this->logger->info('Notification envoyée pour le nouvel article.', [
            'title' => $article->getTitle(),
            'admin_email' => $this->adminEmail,
        ]);
    }
}
```

**Service `src/Service/ArticleWorkflow.php`** :

```php
<?php

namespace App\Service;

use App\Entity\Article;
use Doctrine\ORM\EntityManagerInterface;

class ArticleWorkflow
{
    public function __construct(
        private EntityManagerInterface $em,
        private SlugGenerator $slugGenerator,
        private NotificationService $notificationService,
    ) {
    }

    /**
     * Crée un article, génère son slug, le sauvegarde et envoie une notification.
     */
    public function createAndNotify(string $title, string $content): Article
    {
        // Créer l'article
        $article = new Article();
        $article->setTitle($title);
        $article->setContent($content);
        $article->setStatus('draft');

        // Générer le slug
        $slug = $this->slugGenerator->generate($title);
        $article->setSlug($slug);

        // Sauvegarder en base
        $this->em->persist($article);
        $this->em->flush();

        // Envoyer une notification
        $this->notificationService->notifyNewArticle($article);

        return $article;
    }
}
```

**Contrôleur `src/Controller/ArticleController.php`** :

```php
<?php

namespace App\Controller;

use App\Form\ArticleType;
use App\Service\ArticleWorkflow;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ArticleController extends AbstractController
{
    #[Route('/articles/new', name: 'article_new', methods: ['GET', 'POST'])]
    public function new(
        Request $request,
        ArticleWorkflow $articleWorkflow,
    ): Response {
        if ($request->isMethod('POST')) {
            $title = $request->request->get('title');
            $content = $request->request->get('content');

            $article = $articleWorkflow->createAndNotify($title, $content);

            $this->addFlash('success', 'Article créé et notification envoyée.');

            return $this->redirectToRoute('article_show', [
                'id' => $article->getId(),
            ]);
        }

        return $this->render('article/new.html.twig');
    }
}
```

**Vérifier que tout fonctionne** :

```bash
php bin/console debug:container SlugGenerator
php bin/console debug:container NotificationService
php bin/console debug:container ArticleWorkflow
```

---

## Navigation

← Fiche précédente : **[Sécurité et utilisateurs](12-securite-utilisateurs.md)**

→ Fiche suivante : **[Événements et listeners](14-evenements-listeners.md)**
