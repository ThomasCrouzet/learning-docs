---
tags:
  - Architecture
  - Intermédiaire
  - Pratique
description: "Patterns de création : Factory Method, Abstract Factory, Builder et Singleton avec exemples PHP et Symfony."
estimated_time: "75 min"
fiche_number: 4
total_fiches: 17
cursus: "Architecture et Design Patterns"
id: "web.architecture.patterns-creation"
course_id: "web.architecture"
content_type: "lesson"
order: 4
---

# 04 - Patterns de création

> **En bref** : Comprendre et implémenter les patterns Factory Method, Abstract Factory, Builder et Singleton en PHP, avec des exemples concrets dans Symfony. Lecture estimée : 75 min.

## Prérequis

- Fiche 1 : [Introduction aux design patterns](01-introduction-design-patterns.md)
- Fiche 2 : [SOLID - Principes fondamentaux](02-solid-principes.md)
- Programmation orientée objet en PHP (classes, interfaces, héritage)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras implémenter les 4 principaux patterns de création, expliquer quand utiliser chacun et reconnaître leurs usages dans Symfony.

---

## Concepts

### Qu'est-ce qu'un pattern de création ?

**Définition** : Un pattern de création est un design pattern qui contrôle la manière dont les objets sont instanciés. Au lieu d'appeler directement `new MaClasse()`, on délègue la création à une méthode, une classe ou un mécanisme dédié.

**Le problème que les patterns de création résolvent** :

Sans patterns de création, voici les problèmes rencontrés :

1. **Couplage fort** : le code qui utilise un objet est aussi responsable de sa création, ce qui crée une dépendance vers la classe concrète.
2. **Logique de création dupliquée** : la même logique de création est répétée à plusieurs endroits.
3. **Création complexe** : certains objets nécessitent de nombreuses étapes de configuration avant d'être utilisables.

**Comment les patterns de création résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Couplage fort | La création est isolée dans une factory ou un builder |
| Logique dupliquée | Un seul point de création centralisé |
| Création complexe | Un builder guide la construction étape par étape |

**Analogie concrète** : Dans une usine automobile, les ouvriers sur la chaîne de montage ne fabriquent pas eux-mêmes les boulons dont ils ont besoin. Il y a un fournisseur dédié (la factory) qui leur livre les boulons au bon format. Les ouvriers utilisent les boulons sans se soucier de comment ils sont fabriqués.

---

### Factory Method

**Définition** : Le pattern Factory Method définit une méthode pour créer un objet, mais laisse les sous-classes décider quelle classe instancier.

**Le problème que Factory Method résout** :

Sans Factory Method, voici les problèmes rencontrés :

1. **`new` partout** : le code client décide quelle classe instancier, ce qui crée du couplage.
2. **Switch/if répétitif** : à chaque endroit où on crée un objet, on répète la logique de sélection.
3. **Pas extensible** : pour ajouter un nouveau type, on modifie tous les endroits de création.

**Analogie concrète** : Pense à une boulangerie. Le client demande "un pain", sans préciser comment le fabriquer. Le boulanger (la factory) sait quelle recette utiliser selon le type demandé. Si la boulangerie ajoute un nouveau type de pain, le client n'a rien à changer dans sa commande.

**Ce que Factory Method n'est PAS** :

- Factory Method n'est pas un simple constructeur. Le constructeur crée toujours le même type d'objet. La factory peut créer différents types.
- Factory Method n'est pas Abstract Factory. Factory Method crée UN type d'objet. Abstract Factory crée une FAMILLE d'objets liés.

**Structure du pattern** :

<div class="diagram-design">
<p><a href="../../diagrams/10-architecture-04-patterns-creation-1.html">Factory Method (HTML + SVG)</a></p>
<iframe src="../../diagrams/10-architecture-04-patterns-creation-1.html" title="Factory Method" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

Le Creator définit la méthode de création. Chaque sous-classe décide quel produit concret instancier.

**Implémentation en PHP** :

```php
<?php

// Interface commune pour tous les produits crees par la factory
interface NotificationInterface
{
    // Chaque notification sait s'envoyer elle-meme
    public function send(string $message): void;

    // Chaque notification sait quel canal elle utilise
    public function getChannel(): string;
}

// Implementation concrete : notification par email
class EmailNotification implements NotificationInterface
{
    public function send(string $message): void
    {
        // Logique d'envoi d'email
        echo "Email envoye : $message\n";
    }

    public function getChannel(): string
    {
        return 'email';
    }
}

// Implementation concrete : notification par SMS
class SmsNotification implements NotificationInterface
{
    public function send(string $message): void
    {
        // Logique d'envoi de SMS
        echo "SMS envoye : $message\n";
    }

    public function getChannel(): string
    {
        return 'sms';
    }
}

// Implementation concrete : notification push
class PushNotification implements NotificationInterface
{
    public function send(string $message): void
    {
        // Logique d'envoi de notification push
        echo "Push envoye : $message\n";
    }

    public function getChannel(): string
    {
        return 'push';
    }
}

// La Factory : centralise la creation de notifications
class NotificationFactory
{
    // La methode factory : cree l'objet selon le type demande
    public function create(string $channel): NotificationInterface
    {
        // match est prefere a switch en PHP 8+ : plus lisible et sur
        return match ($channel) {
            'email' => new EmailNotification(),
            'sms' => new SmsNotification(),
            'push' => new PushNotification(),
            default => throw new \InvalidArgumentException(
                "Canal de notification inconnu : $channel"
            ),
        };
    }
}

// Utilisation : le code client ne connait PAS les classes concretes
$factory = new NotificationFactory();

$notification = $factory->create('email');
$notification->send('Bienvenue !');
// Affiche : "Email envoye : Bienvenue !"

$notification = $factory->create('sms');
$notification->send('Code de verification : 1234');
// Affiche : "SMS envoye : Code de verification : 1234"
```

Cette implémentation PHP est une **factory paramétrée** (souvent appelée Simple Factory) : une seule classe choisit le type via `match`. Le Factory Method du GoF, lui, laisse une **sous-classe** redéfinir la méthode de création. Les deux isolent le `new`. `createForm()` de Symfony se rapproche de la factory paramétrée, pas d'une hiérarchie de Creator.

**Factory Method dans Symfony : FormFactory**

```php
<?php

// Symfony utilise une Factory pour creer les formulaires
// Tu n'appelles JAMAIS `new PostType()` directement

// Dans un controleur Symfony :
class PostController extends AbstractController
{
    public function new(Request $request): Response
    {
        // createForm() est une Factory Method
        // Elle cree le bon objet Form selon le type demande
        $form = $this->createForm(PostType::class, new Post());

        // Le controleur ne sait pas comment le formulaire est construit
        // Il utilise juste le resultat
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // ...
        }

        return $this->render('post/new.html.twig', [
            'form' => $form,
        ]);
    }
}
```

---

### Abstract Factory

**Définition** : Le pattern Abstract Factory fournit une interface pour créer des familles d'objets liés, sans spécifier leurs classes concrètes.

**Le problème que Abstract Factory résout** :

Sans Abstract Factory, voici les problèmes rencontrés :

1. **Objets incompatibles** : on mélange accidentellement des objets qui ne sont pas conçus pour fonctionner ensemble.
2. **Création dispersée** : la création de chaque objet d'une famille est répartie dans différentes parties du code.
3. **Changement de famille** : passer d'un thème à un autre (ex: Light à Dark) oblige à modifier de nombreux fichiers.

**Comparaison Factory Method vs Abstract Factory** :

| Factory Method | Abstract Factory |
| --- | --- |
| Crée UN type d'objet | Crée une FAMILLE d'objets liés |
| Une seule méthode `create()` | Plusieurs méthodes `createX()`, `createY()` |
| Les produits sont indépendants | Les produits forment un ensemble cohérent |

**Analogie concrète** : Pense à un magasin de meubles. Un magasin "Ikea" vend des chaises Ikea, des tables Ikea et des étagères Ikea qui vont ensemble. Un magasin "Maisons du Monde" vend ses propres chaises, tables et étagères qui vont ensemble aussi. L'Abstract Factory est le magasin : tu choisis le magasin (la factory), et tu obtiens une famille cohérente de meubles.

**Implémentation en PHP** :

```php
<?php

// Interfaces pour chaque produit de la famille
interface ButtonInterface
{
    public function render(): string;
}

interface InputInterface
{
    public function render(): string;
}

interface CardInterface
{
    public function render(): string;
}

// Famille "Bootstrap" : tous les composants utilisent Bootstrap
class BootstrapButton implements ButtonInterface
{
    public function render(): string
    {
        return '<button class="btn btn-primary">Valider</button>';
    }
}

class BootstrapInput implements InputInterface
{
    public function render(): string
    {
        return '<input class="form-control" type="text" />';
    }
}

class BootstrapCard implements CardInterface
{
    public function render(): string
    {
        return '<div class="card"><div class="card-body">Contenu</div></div>';
    }
}

// Famille "Tailwind" : tous les composants utilisent Tailwind
class TailwindButton implements ButtonInterface
{
    public function render(): string
    {
        return '<button class="bg-blue-500 text-white px-4 py-2 rounded">Valider</button>';
    }
}

class TailwindInput implements InputInterface
{
    public function render(): string
    {
        return '<input class="border rounded px-3 py-2" type="text" />';
    }
}

class TailwindCard implements CardInterface
{
    public function render(): string
    {
        return '<div class="shadow rounded-lg p-4">Contenu</div>';
    }
}

// Abstract Factory : interface pour creer une famille de composants
interface UIFactoryInterface
{
    public function createButton(): ButtonInterface;
    public function createInput(): InputInterface;
    public function createCard(): CardInterface;
}

// Factory Bootstrap : cree uniquement des composants Bootstrap
class BootstrapUIFactory implements UIFactoryInterface
{
    public function createButton(): ButtonInterface
    {
        return new BootstrapButton();
    }

    public function createInput(): InputInterface
    {
        return new BootstrapInput();
    }

    public function createCard(): CardInterface
    {
        return new BootstrapCard();
    }
}

// Factory Tailwind : cree uniquement des composants Tailwind
class TailwindUIFactory implements UIFactoryInterface
{
    public function createButton(): ButtonInterface
    {
        return new TailwindButton();
    }

    public function createInput(): InputInterface
    {
        return new TailwindInput();
    }

    public function createCard(): CardInterface
    {
        return new TailwindCard();
    }
}

// Utilisation : le code client ne connait que l'interface
function renderPage(UIFactoryInterface $factory): string
{
    // Tous les composants sont automatiquement coherents
    // car ils viennent de la meme factory
    $button = $factory->createButton();
    $input = $factory->createInput();
    $card = $factory->createCard();

    return $card->render() . $input->render() . $button->render();
}

// Changer de theme = changer de factory, rien d'autre
$page = renderPage(new BootstrapUIFactory());
// ou
$page = renderPage(new TailwindUIFactory());
```

---

### Builder

**Définition** : Le pattern Builder sépare la construction d'un objet complexe de sa représentation, permettant de créer différentes représentations avec le même processus de construction.

**Le problème que Builder résout** :

Sans Builder, voici les problèmes rencontrés :

1. **Constructeur télescopique** : un constructeur avec 10+ paramètres, dont la plupart sont optionnels.
2. **Ordre d'appel** : certaines étapes de construction doivent être exécutées dans un ordre précis.
3. **Objets incomplets** : un objet peut être utilisé alors qu'il n'est pas encore totalement configuré.

**Comparaison constructeur classique vs Builder** :

| Constructeur classique | Builder |
| --- | --- |
| Tous les paramètres d'un coup | Paramètres fournis un par un |
| Difficile à lire avec beaucoup de paramètres | Lisible grâce au chaînage |
| Pas de validation intermédiaire | Validation possible à chaque étape |
| Objet mutable ou immutable selon le choix | Objet immutable après `build()` |

**Analogie concrète** : Pense à la commande d'un sandwich chez un traiteur. Tu ne donnes pas tous les ingrédients d'un coup. Tu les choisis un par un : le pain, la viande, le fromage, la sauce. À la fin, le traiteur assemble le sandwich complet. Le Builder est ce traiteur : il guide la construction étape par étape.

**Flux de construction avec Builder** :

<div class="diagram-design">
<p><a href="../../diagrams/10-architecture-04-patterns-creation-2.html">Builder (HTML + SVG)</a></p>
<iframe src="../../diagrams/10-architecture-04-patterns-creation-2.html" title="Builder" style="width:100%;min-height:560px;border:0;background:transparent"></iframe>
</div>

Le Director orchestre les étapes dans le bon ordre. Le Builder assemble le produit pièce par pièce. Le client n'a pas besoin de connaître les détails de construction.

**Implémentation en PHP** :

```php
<?php

// L'objet final : un email a envoyer
// Cette classe est immutable : une fois creee, on ne peut plus la modifier
class Email
{
    public function __construct(
        private string $from,
        private string $to,
        private string $subject,
        private string $body,
        private array $cc = [],
        private array $bcc = [],
        private array $attachments = [],
        private ?string $replyTo = null,
        private string $priority = 'normal',
    ) {
    }

    public function getFrom(): string { return $this->from; }
    public function getTo(): string { return $this->to; }
    public function getSubject(): string { return $this->subject; }
    public function getBody(): string { return $this->body; }
    public function getCc(): array { return $this->cc; }
    public function getBcc(): array { return $this->bcc; }
    public function getAttachments(): array { return $this->attachments; }
    public function getReplyTo(): ?string { return $this->replyTo; }
    public function getPriority(): string { return $this->priority; }
}

// Le Builder : construit un Email etape par etape
class EmailBuilder
{
    // Proprietes obligatoires : pas de valeur par defaut
    private string $from;
    private string $to;
    private string $subject;
    private string $body;

    // Proprietes optionnelles : valeurs par defaut
    private array $cc = [];
    private array $bcc = [];
    private array $attachments = [];
    private ?string $replyTo = null;
    private string $priority = 'normal';

    // Chaque methode retourne $this pour permettre le chainage
    public function from(string $from): self
    {
        $this->from = $from;
        return $this;
    }

    public function to(string $to): self
    {
        $this->to = $to;
        return $this;
    }

    public function subject(string $subject): self
    {
        $this->subject = $subject;
        return $this;
    }

    public function body(string $body): self
    {
        $this->body = $body;
        return $this;
    }

    public function cc(string $email): self
    {
        // On ajoute a la liste, on ne remplace pas
        $this->cc[] = $email;
        return $this;
    }

    public function bcc(string $email): self
    {
        $this->bcc[] = $email;
        return $this;
    }

    public function attachment(string $path): self
    {
        $this->attachments[] = $path;
        return $this;
    }

    public function replyTo(string $email): self
    {
        $this->replyTo = $email;
        return $this;
    }

    public function highPriority(): self
    {
        $this->priority = 'high';
        return $this;
    }

    // build() cree l'objet final et valide les donnees
    public function build(): Email
    {
        // Validation : les champs obligatoires doivent etre remplis
        if (!isset($this->from)) {
            throw new \LogicException("L'expediteur (from) est requis");
        }
        if (!isset($this->to)) {
            throw new \LogicException('Le destinataire (to) est requis');
        }
        if (!isset($this->subject)) {
            throw new \LogicException('Le sujet est requis');
        }
        if (!isset($this->body)) {
            throw new \LogicException('Le corps du message est requis');
        }

        return new Email(
            from: $this->from,
            to: $this->to,
            subject: $this->subject,
            body: $this->body,
            cc: $this->cc,
            bcc: $this->bcc,
            attachments: $this->attachments,
            replyTo: $this->replyTo,
            priority: $this->priority,
        );
    }
}

// Utilisation : construction lisible grace au chainage
$email = (new EmailBuilder())
    ->from('noreply@shop.com')
    ->to('client@example.com')
    ->subject('Votre commande')
    ->body('Merci pour votre commande #1234.')
    ->cc('manager@shop.com')
    ->attachment('/tmp/facture.pdf')
    ->highPriority()
    ->build();

// Comparaison avec un constructeur classique :
// $email = new Email(
//     'noreply@shop.com',   // from ? to ? difficile a savoir
//     'client@example.com', // lequel est lequel ?
//     'Votre commande',
//     'Merci...',
//     ['manager@shop.com'], // cc ou bcc ?
//     [],                   // que signifie ce tableau vide ?
//     ['/tmp/facture.pdf'],
//     null,                 // que signifie null ici ?
//     'high'                // high quoi ?
// );
```

**Builder dans Symfony : QueryBuilder de Doctrine**

```php
<?php

// Doctrine QueryBuilder est un exemple parfait du pattern Builder
$queryBuilder = $this->createQueryBuilder('p');

// Construction etape par etape, avec chainage
$query = $queryBuilder
    ->select('p')                          // Quoi selectionner
    ->from('App\Entity\Product', 'p')       // Depuis quelle table
    ->where('p.price > :minPrice')         // Condition
    ->andWhere('p.active = :active')       // Autre condition
    ->setParameter('minPrice', 10)         // Valeur du parametre
    ->setParameter('active', true)         // Autre valeur
    ->orderBy('p.price', 'ASC')           // Tri
    ->setMaxResults(20)                    // Limite
    ->getQuery();                          // build() : cree la requete finale

$products = $query->getResult();
```

---

### Singleton

**Définition** : Le pattern Singleton garantit qu'une classe n'a qu'une seule instance dans toute l'application et fournit un point d'accès global à cette instance.

**Le problème que Singleton résout** :

Sans Singleton, voici les problèmes rencontrés :

1. **Instances multiples** : plusieurs instances d'une ressource partagée (connexion BDD, logger) gaspillent la mémoire.
2. **État incohérent** : plusieurs instances d'une configuration peuvent avoir des valeurs différentes.
3. **Accès global** : sans point d'accès centralisé, on doit passer l'instance en paramètre partout.

**Ce que Singleton n'est PAS** :

- Singleton n'est pas une bonne pratique systématique. C'est le pattern le plus controversé car il crée un état global, rend les tests difficiles et viole le principe de responsabilité unique.
- Singleton n'est pas nécessaire dans Symfony. Le conteneur de services de Symfony gère déjà les instances uniques (services "shared" par défaut).

**Comparaison Singleton vs Service Symfony** :

| Singleton classique | Service Symfony |
| --- | --- |
| Instance gérée par la classe elle-même | Instance gérée par le conteneur |
| Accès global via méthode statique | Injection de dépendance |
| Difficile à tester (état global) | Facile à tester (injection d'un mock) |
| Viole DIP (dépendance statique) | Respecte DIP (injection par interface) |

**Analogie concrète** : Pense au président d'un pays. Il n'y en a qu'un seul à la fois. Tout le monde peut le contacter via un canal officiel (le Singleton fournit un point d'accès unique). Mais si un jour tu veux tester le fonctionnement du gouvernement avec un "faux" président, c'est impossible car le poste est "codé en dur".

**Implémentation en PHP (à éviter en Symfony)** :

```php
<?php

// ⚠️ Cet exemple montre le pattern, mais dans Symfony,
// utilise le conteneur de services a la place

class DatabaseConnection
{
    // L'instance unique est stockee dans une propriete statique
    private static ?self $instance = null;

    // Le constructeur est prive : impossible d'appeler new DatabaseConnection()
    private function __construct(
        private \PDO $pdo,
    ) {
    }

    // Point d'acces global : la seule maniere d'obtenir l'instance
    public static function getInstance(): self
    {
        // Si l'instance n'existe pas encore, on la cree
        if (self::$instance === null) {
            $pdo = new \PDO('pgsql:host=localhost;dbname=app', 'user', 'pass');
            self::$instance = new self($pdo);
        }

        // On retourne toujours la meme instance
        return self::$instance;
    }

    public function query(string $sql): array
    {
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll();
    }

    // Empecher le clonage
    private function __clone() {}
}

// Utilisation : toujours la meme instance
$db1 = DatabaseConnection::getInstance();
$db2 = DatabaseConnection::getInstance();
// $db1 === $db2 → true : c'est le meme objet
```

**L'alternative Symfony (recommandée)** :

```php
<?php

// Dans Symfony, les services sont deja des singletons par defaut
// Le conteneur ne cree qu'UNE instance par service

// services.yaml
// services:
//     App\Service\DatabaseService:
//         shared: true  ← c'est la valeur par defaut

namespace App\Service;

class DatabaseService
{
    public function __construct(
        // Doctrine gere la connexion : une seule instance
        private EntityManagerInterface $em,
    ) {
    }
}

// Dans un controleur : Symfony injecte toujours la MEME instance
class ProductController extends AbstractController
{
    public function list(DatabaseService $db): Response
    {
        // $db est toujours la meme instance dans toute l'application
        // SANS avoir besoin d'un Singleton
    }
}
```

---

## Étapes Pratiques

### Étape 1 : Implémenter une Factory dans Symfony

Crée une factory pour générer différents types d'export :

```php
<?php

namespace App\Service\Export;

// Interface commune pour tous les exporteurs
interface ExporterInterface
{
    // Chaque exporteur transforme des donnees en string
    public function export(array $data): string;

    // Chaque exporteur connait son type MIME
    public function getContentType(): string;
}
```

```php
<?php

namespace App\Service\Export;

// Exporteur CSV
class CsvExporter implements ExporterInterface
{
    public function export(array $data): string
    {
        $output = '';

        // Premiere ligne : les en-tetes (cles du premier element)
        if (!empty($data)) {
            $output .= implode(',', array_keys($data[0])) . "\n";
        }

        // Lignes suivantes : les valeurs
        foreach ($data as $row) {
            $output .= implode(',', $row) . "\n";
        }

        return $output;
    }

    public function getContentType(): string
    {
        return 'text/csv';
    }
}
```

```php
<?php

namespace App\Service\Export;

// Exporteur JSON
class JsonExporter implements ExporterInterface
{
    public function export(array $data): string
    {
        // json_encode avec indentation pour la lisibilite
        return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    public function getContentType(): string
    {
        return 'application/json';
    }
}
```

```php
<?php

namespace App\Service\Export;

// La Factory : cree le bon exporteur selon le format demande
class ExporterFactory
{
    public function create(string $format): ExporterInterface
    {
        return match ($format) {
            'csv' => new CsvExporter(),
            'json' => new JsonExporter(),
            default => throw new \InvalidArgumentException(
                "Format d'export inconnu : $format. Formats valides : csv, json"
            ),
        };
    }
}
```

**Résultat attendu** :

```text
$factory = new ExporterFactory();

$exporter = $factory->create('csv');
echo $exporter->export([
    ['name' => 'Produit A', 'price' => 29.99],
    ['name' => 'Produit B', 'price' => 49.99],
]);

// Affiche :
// name,price
// Produit A,29.99
// Produit B,49.99
```

---

### Étape 2 : Implémenter un Builder pour créer des requêtes de recherche

```php
<?php

namespace App\Service\Search;

// L'objet final : une requete de recherche immutable
class SearchQuery
{
    public function __construct(
        public readonly string $term,
        public readonly array $filters,
        public readonly string $sortBy,
        public readonly string $sortOrder,
        public readonly int $page,
        public readonly int $perPage,
    ) {
    }
}

// Le Builder
class SearchQueryBuilder
{
    private string $term = '';
    private array $filters = [];
    private string $sortBy = 'createdAt';
    private string $sortOrder = 'DESC';
    private int $page = 1;
    private int $perPage = 20;

    public function term(string $term): self
    {
        $this->term = $term;
        return $this;
    }

    public function filterBy(string $field, mixed $value): self
    {
        // Ajoute un filtre sans ecraser les precedents
        $this->filters[$field] = $value;
        return $this;
    }

    public function sortBy(string $field, string $order = 'ASC'): self
    {
        $this->sortBy = $field;
        $this->sortOrder = strtoupper($order);
        return $this;
    }

    public function page(int $page): self
    {
        if ($page < 1) {
            throw new \InvalidArgumentException(
                'Le numero de page doit etre >= 1'
            );
        }
        $this->page = $page;
        return $this;
    }

    public function perPage(int $perPage): self
    {
        if ($perPage < 1 || $perPage > 100) {
            throw new \InvalidArgumentException(
                'Le nombre par page doit etre entre 1 et 100'
            );
        }
        $this->perPage = $perPage;
        return $this;
    }

    public function build(): SearchQuery
    {
        return new SearchQuery(
            term: $this->term,
            filters: $this->filters,
            sortBy: $this->sortBy,
            sortOrder: $this->sortOrder,
            page: $this->page,
            perPage: $this->perPage,
        );
    }
}
```

**Résultat attendu** :

```text
$query = (new SearchQueryBuilder())
    ->term('smartphone')
    ->filterBy('category', 'electronics')
    ->filterBy('priceMax', 500)
    ->sortBy('price', 'ASC')
    ->page(2)
    ->perPage(10)
    ->build();

// $query->term === 'smartphone'
// $query->filters === ['category' => 'electronics', 'priceMax' => 500]
// $query->sortBy === 'price'
// $query->page === 2
```

---

### Étape 3 : Utiliser la Factory dans un contrôleur Symfony

```php
<?php

namespace App\Controller;

use App\Repository\ProductRepository;
use App\Service\Export\ExporterFactory;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ExportController extends AbstractController
{
    #[Route('/export/{format}', requirements: ['format' => 'csv|json'])]
    public function export(
        string $format,
        ExporterFactory $factory,
        ProductRepository $repository,
    ): Response {
        // La factory cree le bon exporteur selon le format
        $exporter = $factory->create($format);

        // On recupere les donnees
        $products = $repository->findAllAsArray();

        // On exporte avec le bon format
        $content = $exporter->export($products);

        // On retourne la reponse avec le bon Content-Type
        return new Response($content, 200, [
            'Content-Type' => $exporter->getContentType(),
        ]);
    }
}
```

**Résultat attendu** :

```text
GET /export/csv → réponse CSV avec Content-Type: text/csv
GET /export/json → réponse JSON avec Content-Type: application/json
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `php bin/console debug:container ExporterFactory` | Vérifier que la factory est enregistrée |
| `php bin/console debug:autowiring Exporter` | Voir les services exporteurs disponibles |
| `php bin/console debug:router` | Vérifier les routes d'export |

---

## Pièges Fréquents

### Piège 1 : Utiliser le Singleton en PHP

**Problème** : Tu implémentes un Singleton classique (avec `getInstance()`) dans un projet Symfony.

**Solution** : Dans Symfony, les services sont déjà des singletons. Le conteneur de services gère l'unicité des instances. Utilise l'injection de dépendances au lieu du pattern Singleton.

### Piège 2 : Factory avec trop de responsabilités

**Problème** : Ta factory crée l'objet ET le configure ET le valide ET le persiste.

**Solution** : La factory ne doit QUE créer l'objet. La configuration, la validation et la persistance sont des responsabilités séparées (SRP).

```php
// ❌ Factory trop chargee
class UserFactory
{
    public function create(array $data): User
    {
        $user = new User();
        $user->setName($data['name']);
        $user->setEmail($data['email']);
        $user->setPassword(password_hash($data['password'], PASSWORD_BCRYPT));
        $this->entityManager->persist($user); // ❌ Pas le role de la factory
        $this->entityManager->flush();        // ❌ Pas le role de la factory
        return $user;
    }
}

// ✅ Factory qui ne fait que creer
class UserFactory
{
    public function create(string $name, string $email): User
    {
        $user = new User();
        $user->setName($name);
        $user->setEmail($email);
        return $user;
    }
}
```

### Piège 3 : Builder sans validation dans build()

**Problème** : Ton builder crée un objet incomplet sans vérifier que les champs obligatoires sont remplis.

**Solution** : Toujours valider dans la méthode `build()` que les champs obligatoires sont présents.

---

## Checklist de Validation

- [ ] Je sais implémenter une Factory Method en PHP
- [ ] Je comprends la différence entre Factory Method et Abstract Factory
- [ ] Je sais implémenter un Builder avec chaînage et validation
- [ ] Je comprends pourquoi le Singleton est déconseillé dans Symfony
- [ ] Je sais utiliser le QueryBuilder de Doctrine (exemple de Builder)
- [ ] Je sais reconnaître Factory et Builder dans le code Symfony

---

## Exercice Pratique

**Énoncé** : Crée un système de génération de rapports avec Factory et Builder.

**Instructions** :

1. Crée une interface `ReportInterface` avec les méthodes `getTitle()`, `getContent()` et `getFormat()`
2. Crée deux implémentations : `HtmlReport` et `PdfReport`
3. Crée un `ReportBuilder` qui construit un rapport étape par étape (titre, sections, tableau de données, pied de page)
4. Crée une `ReportFactory` qui retourne le bon builder selon le format

**Résultat attendu** : Un rapport HTML ou PDF généré via le builder, choisi par la factory.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php

// Interface commune
interface ReportInterface
{
    public function getTitle(): string;
    public function getContent(): string;
    public function getFormat(): string;
}

// Rapport HTML
class HtmlReport implements ReportInterface
{
    public function __construct(
        private string $title,
        private string $content,
    ) {
    }

    public function getTitle(): string { return $this->title; }

    public function getContent(): string
    {
        return "<html><head><title>{$this->title}</title></head>"
            . "<body>{$this->content}</body></html>";
    }

    public function getFormat(): string { return 'html'; }
}

// Rapport PDF (simplifie)
class PdfReport implements ReportInterface
{
    public function __construct(
        private string $title,
        private string $content,
    ) {
    }

    public function getTitle(): string { return $this->title; }

    public function getContent(): string
    {
        // En pratique, on utiliserait une librairie PDF ici
        return "PDF: {$this->title}\n{$this->content}";
    }

    public function getFormat(): string { return 'pdf'; }
}

// Builder pour construire le contenu
class ReportBuilder
{
    private string $title = '';
    private array $sections = [];
    private string $footer = '';

    public function title(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function addSection(string $heading, string $content): self
    {
        $this->sections[] = ['heading' => $heading, 'content' => $content];
        return $this;
    }

    public function footer(string $footer): self
    {
        $this->footer = $footer;
        return $this;
    }

    public function buildHtml(): HtmlReport
    {
        $content = '';
        foreach ($this->sections as $section) {
            $content .= "<h2>{$section['heading']}</h2>";
            $content .= "<p>{$section['content']}</p>";
        }
        if ($this->footer) {
            $content .= "<footer>{$this->footer}</footer>";
        }
        return new HtmlReport($this->title, $content);
    }

    public function buildPdf(): PdfReport
    {
        $content = '';
        foreach ($this->sections as $section) {
            $content .= "== {$section['heading']} ==\n";
            $content .= "{$section['content']}\n\n";
        }
        if ($this->footer) {
            $content .= "---\n{$this->footer}\n";
        }
        return new PdfReport($this->title, $content);
    }
}

// Factory pour choisir le format
class ReportFactory
{
    public function create(string $format, ReportBuilder $builder): ReportInterface
    {
        return match ($format) {
            'html' => $builder->buildHtml(),
            'pdf' => $builder->buildPdf(),
            default => throw new \InvalidArgumentException("Format inconnu : $format"),
        };
    }
}

// Utilisation
$builder = (new ReportBuilder())
    ->title('Rapport mensuel')
    ->addSection('Ventes', 'Les ventes ont augmente de 15%.')
    ->addSection('Objectifs', 'Atteindre 1000 clients.')
    ->footer('Genere le ' . date('d/m/Y'));

$factory = new ReportFactory();
$report = $factory->create('html', $builder);

echo $report->getContent();
```

---

## Navigation

← Fiche précédente : **[SOLID - Application dans Symfony](03-solid-symfony.md)**

→ Fiche suivante : **[Patterns de structure](05-patterns-structure.md)**
