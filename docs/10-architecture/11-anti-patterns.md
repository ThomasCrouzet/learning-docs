---
tags:
  - Architecture
  - Intermédiaire
  - Concept
description: "Anti-patterns : reconnaître et éviter les God class, spaghetti code, lava flow et autres pièges courants."
estimated_time: "60 min"
fiche_number: 11
total_fiches: 17
cursus: "Architecture et Design Patterns"
---

# 11 - Anti-patterns

> **En bref** : Reconnaître et éviter les anti-patterns les plus courants en développement logiciel : God class, spaghetti code, lava flow, golden hammer et d'autres. Lecture estimée : 60 min.

## Prérequis

- Fiche 1 : [Introduction aux design patterns](01-introduction-design-patterns.md)
- Fiche 2 : [SOLID - Principes fondamentaux](02-solid-principes.md)
- Fiche 6 : [Patterns de comportement](06-patterns-comportement.md)
- Fiche 8 : [Clean Architecture](08-clean-architecture.md)
- Fiche 9 : [Introduction au DDD](09-introduction-ddd.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras identifier les anti-patterns les plus courants dans du code existant, expliquer pourquoi chacun est problématique et appliquer les techniques de refactoring pour les corriger.

---

## Concepts

### Qu'est-ce qu'un anti-pattern ?

**Définition** : Un anti-pattern est une solution courante à un problème récurrent qui semble correcte au premier abord, mais qui génère plus de problèmes qu'elle n'en résout. C'est l'inverse d'un design pattern : au lieu de résoudre un problème, un anti-pattern en crée de nouveaux.

**Le problème que la connaissance des anti-patterns résout** :

Sans connaître les anti-patterns, voici les problèmes rencontrés :

1. **Répétition des erreurs** : les mêmes erreurs de conception sont commises de projet en projet sans être reconnues.
2. **Code difficilement maintenable** : le code fonctionne mais devient impossible à modifier sans tout casser.
3. **Discussions non productives** : lors des revues de code, on sent que "quelque chose ne va pas" mais on manque de vocabulaire pour l'expliquer.

**Comment la connaissance des anti-patterns résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Répétition des erreurs | On reconnaît l'anti-pattern avant de le commettre |
| Code difficilement maintenable | On sait quoi refactorer et comment |
| Discussions non productives | On a un vocabulaire précis : "c'est une God class" |

**Analogie concrète** : Pense à un panneau de signalisation qui indique un virage dangereux. Le panneau ne te dit pas comment conduire, mais il t'avertit d'un danger connu. Les anti-patterns sont ces panneaux : ils te préviennent que la direction que tu prends va poser des problèmes.

**Ce qu'un anti-pattern n'est PAS** :

- Un anti-pattern n'est pas du "mauvais code" au sens général. C'est une solution qui semble raisonnable mais qui a des conséquences négatives documentées.
- Un anti-pattern n'est pas un choix délibérément mauvais. Les développeurs tombent dans les anti-patterns par manque d'expérience ou de recul, pas par négligence.

---

### Qu'est-ce que la God Class ?

**Définition** : Une God class est une classe qui fait tout : elle connaît tout, contrôle tout et contient l'essentiel de la logique de l'application. Elle viole le principe de responsabilité unique (SRP) en concentrant des dizaines de responsabilités.

**Le problème que la God class crée** :

1. **Modifications risquées** : chaque modification peut impacter n'importe quelle partie de l'application car tout passe par cette classe.
2. **Tests impossibles** : la classe a tellement de dépendances qu'il faut des dizaines de mocks pour la tester.
3. **Compréhension difficile** : avec des centaines (ou des milliers) de lignes, personne ne comprend la classe entièrement.

**Comment reconnaître une God class** :

| Signal d'alerte | Seuil indicatif |
| --- | --- |
| Nombre de lignes | Plus de 500 lignes |
| Nombre de méthodes | Plus de 20 méthodes publiques |
| Nombre de dépendances | Plus de 10 services injectés |
| Nom vague | `Manager`, `Handler`, `Processor`, `Helper`, `Utils` |
| Responsabilités multiples | La classe gère à la fois des données, de la logique, du formatage et de la persistance |

**Analogie concrète** : Pense à un employé qui serait à la fois comptable, cuisinier, gardien, informaticien et secrétaire. Il fait tout, mais rien correctement. Quand il est malade, toute l'entreprise s'arrête. Une God class a le même problème : elle est indispensable et irremplaçable.

**Exemple** :

```php
<?php

// ❌ Anti-pattern : God class
// Cette classe fait TOUT : gestion des utilisateurs, emails, commandes,
// paiements, statistiques, formatage...
class ApplicationManager
{
    public function __construct(
        private EntityManagerInterface $em,
        private MailerInterface $mailer,
        private LoggerInterface $logger,
        private CacheInterface $cache,
        private PaymentGateway $payment,
        private FileUploader $uploader,
        private PdfGenerator $pdf,
        private NotificationService $notifier,
        // ... 15 autres dépendances
    ) {
    }

    // Gestion des utilisateurs (responsabilité 1)
    public function createUser(array $data): User { /* ... */ }
    public function updateUser(int $id, array $data): User { /* ... */ }
    public function deleteUser(int $id): void { /* ... */ }
    public function authenticateUser(string $email, string $password): bool { /* ... */ }
    public function resetPassword(string $email): void { /* ... */ }

    // Gestion des emails (responsabilité 2)
    public function sendWelcomeEmail(User $user): void { /* ... */ }
    public function sendOrderConfirmation(Order $order): void { /* ... */ }
    public function sendNewsletter(array $users): void { /* ... */ }

    // Gestion des commandes (responsabilité 3)
    public function createOrder(User $user, array $items): Order { /* ... */ }
    public function cancelOrder(int $orderId): void { /* ... */ }
    public function calculateTotal(Order $order): float { /* ... */ }

    // Gestion des paiements (responsabilité 4)
    public function processPayment(Order $order): bool { /* ... */ }
    public function refund(int $orderId): void { /* ... */ }

    // Statistiques (responsabilité 5)
    public function getMonthlyRevenue(): float { /* ... */ }
    public function getUserStats(): array { /* ... */ }

    // ... 30 autres méthodes
}
```

**Solution : découper en classes ciblées** :

```php
<?php

// ✅ Solution : une classe par responsabilité

// Gestion des utilisateurs
class UserService
{
    public function create(array $data): User { /* ... */ }
    public function update(int $id, array $data): User { /* ... */ }
    public function delete(int $id): void { /* ... */ }
}

// Authentification
class AuthenticationService
{
    public function authenticate(string $email, string $password): bool { /* ... */ }
    public function resetPassword(string $email): void { /* ... */ }
}

// Envoi d'emails
class EmailService
{
    public function sendWelcome(User $user): void { /* ... */ }
    public function sendOrderConfirmation(Order $order): void { /* ... */ }
}

// Gestion des commandes
class OrderService
{
    public function create(User $user, array $items): Order { /* ... */ }
    public function cancel(int $orderId): void { /* ... */ }
}

// Gestion des paiements
class PaymentService
{
    public function process(Order $order): bool { /* ... */ }
    public function refund(int $orderId): void { /* ... */ }
}
```

---

### Qu'est-ce que le Spaghetti Code ?

**Définition** : Le spaghetti code est du code dont le flux d'exécution est embrouillé, sans structure claire, avec des sauts dans tous les sens. Il est difficile à lire, à comprendre et à modifier.

**Le problème que le spaghetti code crée** :

1. **Flux de lecture impossible** : on ne peut pas suivre le chemin d'exécution sans sauter d'un endroit à l'autre.
2. **Effets de bord imprévisibles** : modifier une ligne peut casser du code à un endroit complètement différent.
3. **Duplication cachée** : des logiques similaires sont répétées à plusieurs endroits avec de légères variations.

**Comment reconnaître du spaghetti code** :

| Signal d'alerte | Description |
| --- | --- |
| Indentation profonde | Plus de 4 niveaux d'imbrication (if dans if dans for dans if) |
| Méthodes longues | Plus de 50 lignes dans une seule méthode |
| Variables réutilisées | La même variable change de sens au fil du code |
| `goto` ou équivalent | Sauts dans le flux d'exécution |
| Conditions complexes | `if` avec 5 conditions combinées par `&&` et `\|\|` |

**Analogie concrète** : Pense à un plat de spaghettis. Si tu tires sur un spaghetti, tu ne sais pas où il mène. Il peut être emmêlé avec d'autres spaghettis. Le spaghetti code fonctionne pareil : chaque morceau de code est emmêlé avec d'autres, et tirer sur un fil peut tout défaire.

**Exemple** :

```php
<?php

// ❌ Anti-pattern : spaghetti code
function processOrder($data, $db, $mailer, $config)
{
    if ($data['items']) {
        $total = 0;
        foreach ($data['items'] as $item) {
            if ($item['type'] == 'product') {
                $price = $db->query("SELECT price FROM products WHERE id = " . $item['id']);
                if ($price) {
                    if ($item['quantity'] > 0) {
                        $subtotal = $price * $item['quantity'];
                        if ($data['coupon']) {
                            if ($data['coupon'] == 'PROMO10') {
                                $subtotal = $subtotal * 0.9;
                            } elseif ($data['coupon'] == 'PROMO20') {
                                $subtotal = $subtotal * 0.8;
                            } elseif ($data['coupon'] == 'VIP') {
                                if ($data['user']['vip'] == true) {
                                    $subtotal = $subtotal * 0.7;
                                }
                            }
                        }
                        $total += $subtotal;
                    }
                }
            } elseif ($item['type'] == 'service') {
                // Code similaire mais légèrement différent...
                $price = $db->query("SELECT price FROM services WHERE id = " . $item['id']);
                if ($price) {
                    $total += $price * $item['quantity'];
                    // Les coupons ne s'appliquent pas aux services
                    // (mais c'est pas documenté, juste implicite)
                }
            }
        }
        // ... encore 100 lignes du même style
    }
}
```

**Solution : restructurer avec des méthodes claires** :

```php
<?php

// ✅ Solution : code structuré et lisible
class OrderProcessor
{
    public function __construct(
        private ProductRepository $products,
        private CouponService $coupons,
    ) {
    }

    public function process(array $data): float
    {
        $total = 0.0;

        foreach ($data['items'] as $item) {
            $subtotal = $this->calculateItemPrice($item);
            $subtotal = $this->applyCoupon($subtotal, $data['coupon'] ?? null, $data['user']);
            $total += $subtotal;
        }

        return $total;
    }

    private function calculateItemPrice(array $item): float
    {
        $price = $this->products->getPrice($item['id'], $item['type']);

        if ($price === null) {
            throw new \DomainException("Produit non trouvé : {$item['id']}");
        }

        if ($item['quantity'] <= 0) {
            throw new \DomainException('La quantité doit être positive');
        }

        return $price * $item['quantity'];
    }

    private function applyCoupon(float $subtotal, ?string $coupon, array $user): float
    {
        if ($coupon === null) {
            return $subtotal;
        }

        return $this->coupons->apply($coupon, $subtotal, $user);
    }
}
```

---

### Qu'est-ce que le Lava Flow ?

**Définition** : Le lava flow désigne du code mort ou obsolète qui reste dans le projet parce que personne n'ose le supprimer. Comme de la lave refroidie, ce code s'est "solidifié" dans le projet et personne ne sait s'il est encore utilisé.

**Le problème que le lava flow crée** :

1. **Confusion** : les nouveaux développeurs ne savent pas quel code est actif et quel code est mort.
2. **Maintenance inutile** : on met à jour du code qui n'est jamais exécuté.
3. **Complexité artificielle** : le projet semble plus gros et plus complexe qu'il ne l'est réellement.

**Comment reconnaître du lava flow** :

| Signal d'alerte | Description |
| --- | --- |
| Commentaires `// TODO: supprimer` | Datant de plusieurs mois ou années |
| Méthodes jamais appelées | Aucune référence dans le code |
| Code commenté | Des blocs entiers de code sont en commentaire |
| Variables jamais lues | Assignées mais jamais utilisées |
| Imports inutiles | Des `use` ou `import` sans utilisation |
| Fichiers orphelins | Des fichiers qui ne sont référencés nulle part |

**Analogie concrète** : Pense à un grenier rempli d'objets accumulés au fil des années. Personne ne sait ce qu'il y a dedans ni à quoi ça sert. Personne n'ose jeter quoi que ce soit "au cas où". Le grenier prend de la place et rend la maison plus difficile à gérer. Le lava flow est le grenier de ton code.

**Exemple** :

```php
<?php

class UserController
{
    // ❌ Méthode commentée : personne ne sait si elle est encore utile
    // public function oldLogin(Request $request): Response
    // {
    //     // Ancien systeme de login, remplace en mars 2024
    //     $user = $this->em->getRepository(User::class)->findByEmail($email);
    //     // ... 50 lignes de code commente
    // }

    // ❌ TODO oublié depuis des mois
    // TODO: refactorer cette methode (Jean, 15 janvier 2025)
    public function list(): Response
    {
        // ...
    }

    // ❌ Méthode jamais appelée : le code qui l'utilisait a été supprimé
    public function exportUsersToXml(): string
    {
        // Export XML qui n'est plus utilisé depuis le passage à JSON
        // Personne n'ose le supprimer car "on en aura peut-etre besoin"
        // ... 80 lignes de code mort
    }

    // ❌ Variable assignée mais jamais utilisée
    public function show(int $id): Response
    {
        $user = $this->repository->find($id);
        $createdAt = $user->getCreatedAt(); // Jamais utilisée ensuite
        $lastLogin = $user->getLastLogin(); // Jamais utilisée ensuite

        return $this->render('user/show.html.twig', [
            'user' => $user,
        ]);
    }
}
```

**Solution : nettoyer régulièrement** :

```php
<?php

// ✅ Solution : code propre, pas de mort-vivant

class UserController
{
    // Plus de code commenté : l'historique est dans Git
    // Plus de méthodes mortes : si on en a besoin, on le retrouve dans Git
    // Plus de variables inutiles : chaque ligne a un objectif

    public function list(): Response
    {
        // Code propre et actif
    }

    public function show(int $id): Response
    {
        $user = $this->repository->find($id);

        return $this->render('user/show.html.twig', [
            'user' => $user,
        ]);
    }
}
```

**Techniques de nettoyage** :

| Technique | Outil |
| --- | --- |
| Trouver les méthodes jamais appelées | PHPStan, IDE (Find Usages) |
| Trouver les imports inutiles | PHP CS Fixer (`no_unused_imports`) |
| Trouver les variables inutiles | PHPStan (niveau 5+) |
| Récupérer du code supprimé | `git log`, `git show` |
| Vérifier la couverture de code | PHPUnit + couverture |

---

### Qu'est-ce que le Golden Hammer (Marteau en or) ?

**Définition** : Le golden hammer est la tendance à utiliser un outil ou une technique favori pour résoudre tous les problèmes, même quand cet outil n'est pas adapté. "Quand on a un marteau, tout ressemble à un clou."

**Le problème que le golden hammer crée** :

1. **Solutions inadaptées** : l'outil utilisé ne correspond pas au problème, ce qui produit un code complexe et fragile.
2. **Résistance au changement** : l'équipe refuse d'apprendre de nouveaux outils ou approches.
3. **Sur-ingénierie** : on plie le problème pour qu'il corresponde à l'outil au lieu d'adapter l'outil au problème.

**Analogie concrète** : Pense à quelqu'un qui utilise un tournevis pour tout : visser, faire levier, couper du ruban adhésif, mélanger de la peinture. Le tournevis fait le travail... mal. Un marteau, des ciseaux et un bâton mélangeur feraient mieux. Le golden hammer, c'est s'obstiner à utiliser le tournevis parce qu'on le connaît bien.

**Exemples courants** :

```text
❌ Golden hammers frequents :

1. "On met tout dans une base de donnees relationnelle"
   → Même les logs, les sessions, les caches, les files d'attente
   → Solution : utiliser Redis pour le cache, RabbitMQ pour les files

2. "On fait tout en Symfony"
   → Même un simple script de 10 lignes
   → Solution : pour un besoin simple (script de migration, tâche cron), un script PHP natif suffit

3. "On met des design patterns partout"
   → Strategy pour un seul algorithme, Factory pour un seul type
   → Solution : du code simple quand le probleme est simple

4. "On utilise toujours des microservices"
   → Même pour une application avec 3 pages
   → Solution : un monolithe bien structuré suffit pour 90% des projets

5. "On ecrit tout en TypeScript"
   → Même un script shell de 5 lignes
   → Solution : utiliser l'outil adapté à chaque contexte
```

**Solution : choisir l'outil adapté** :

| Problème | Mauvais outil (golden hammer) | Bon outil |
| --- | --- | --- |
| Cache de données | PostgreSQL | Redis ou cache en mémoire |
| Script ponctuel | Application Symfony complète | Script PHP natif ou bash |
| Config simple | Base de données | Fichier YAML ou .env |
| Page statique | Application React + API | Fichier HTML |
| File d'attente | Table en base | Symfony Messenger / RabbitMQ |

---

### Qu'est-ce que le Copy-Paste Programming ?

**Définition** : Le copy-paste programming consiste à dupliquer du code existant au lieu de le factoriser dans une fonction ou un service réutilisable. Chaque copie diverge légèrement avec le temps, créant des bugs subtils.

**Le problème que le copy-paste crée** :

1. **Bugs multipliés** : un bug dans le code original doit être corrigé dans toutes les copies. On en oublie toujours une.
2. **Divergence** : les copies évoluent différemment. On se retrouve avec 5 versions légèrement différentes de la même logique.
3. **Volume de code** : le projet grossit inutilement, rendant la navigation et la compréhension plus difficiles.

**Comment reconnaître le copy-paste** :

| Signal d'alerte | Description |
| --- | --- |
| Blocs de code similaires | Deux blocs qui se ressemblent a 90% |
| Mêmes noms de variables | Les mêmes noms apparaissent dans des contextes différents |
| Corrections en série | Un bug corrigé à un endroit se retrouve à un autre |
| "Ça ressemble à..." | Lors de la lecture, on a l'impression d'avoir déjà vu ce code |

**Analogie concrète** : C'est comme photocopier un document qui contient une erreur. Tu distribues 50 copies. Quand tu découvres l'erreur, tu dois corriger les 50 copies une par une. Si tu avais gardé un seul original et fait des renvois, tu n'aurais qu'une correction à faire.

**Exemple** :

```php
<?php

// ❌ Anti-pattern : code dupliqué
class ProductController
{
    public function list(): Response
    {
        $products = $this->repository->findAll();

        // Bloc 1 : tri et pagination (copie 1)
        usort($products, fn ($a, $b) => $a->getName() <=> $b->getName());
        $page = $request->query->getInt('page', 1);
        $perPage = 10;
        $total = count($products);
        $products = array_slice($products, ($page - 1) * $perPage, $perPage);
        $totalPages = ceil($total / $perPage);

        return $this->render('product/list.html.twig', [
            'products' => $products,
            'currentPage' => $page,
            'totalPages' => $totalPages,
        ]);
    }
}

class UserController
{
    public function list(): Response
    {
        $users = $this->repository->findAll();

        // Bloc 2 : tri et pagination (copie 2, presque identique)
        usort($users, fn ($a, $b) => $a->getName() <=> $b->getName());
        $page = $request->query->getInt('page', 1);
        $perPage = 10;
        $total = count($users);
        $users = array_slice($users, ($page - 1) * $perPage, $perPage);
        $totalPages = ceil($total / $perPage);

        return $this->render('user/list.html.twig', [
            'users' => $users,
            'currentPage' => $page,
            'totalPages' => $totalPages,
        ]);
    }
}
```

**Solution : extraire un service réutilisable** :

```php
<?php

// ✅ Solution : factoriser la logique commune

class Paginator
{
    public function paginate(array $items, int $page, int $perPage = 10): array
    {
        $total = count($items);
        $items = array_slice($items, ($page - 1) * $perPage, $perPage);
        $totalPages = (int) ceil($total / $perPage);

        return [
            'items' => $items,
            'currentPage' => $page,
            'totalPages' => $totalPages,
            'total' => $total,
        ];
    }
}

class ProductController
{
    public function list(Request $request, Paginator $paginator): Response
    {
        $products = $this->repository->findAllSortedByName();
        $page = $request->query->getInt('page', 1);
        $result = $paginator->paginate($products, $page);

        return $this->render('product/list.html.twig', $result);
    }
}
```

---

### Que sont les Magic Numbers et Magic Strings ?

**Définition** : Les magic numbers (nombres magiques) et magic strings (chaînes magiques) sont des valeurs littérales écrites directement dans le code, sans nom explicatif. Leur signification n'est compréhensible que par le développeur qui les a écrites (et encore, pas toujours).

**Le problème que les magic numbers créent** :

1. **Incompréhensible** : que signifie le nombre `86400` dans le code ? Sans contexte, impossible de savoir.
2. **Fragile** : si la valeur change, il faut la modifier à chaque endroit où elle apparaît.
3. **Erreurs silencieuses** : si on modifie une occurrence sur trois, le code fonctionne dans certains cas et échoue dans d'autres, selon l'occurrence atteinte.

**Analogie concrète** : C'est comme un plan de construction où les cotes sont écrites directement ("3,50 m") sans légende. Si la hauteur sous plafond change, tu dois chercher tous les "3,50" dans le plan et espérer ne pas en oublier. Avec une légende "HAUTEUR_PLAFOND = 3,50 m", tu changes la valeur une seule fois.

**Exemple** :

```php
<?php

// ❌ Anti-pattern : magic numbers et magic strings
function processOrder(array $order): void
{
    if ($order['total'] > 100) {        // Que signifie 100 ?
        $shipping = 0;                  // Livraison gratuite, mais pourquoi ?
    } else {
        $shipping = 5.99;               // D'ou vient ce montant ?
    }

    if ($order['status'] === 'P') {     // Que signifie "P" ?
        // ...
    }

    $expiry = time() + 86400;           // 86400 quoi ?
    $tax = $order['total'] * 0.20;      // 0.20 = quelle taxe ?

    if (count($order['items']) > 50) {  // Pourquoi 50 ?
        throw new \Exception('Trop d\'articles');
    }
}
```

**Solution : utiliser des constantes nommées** :

```php
<?php

// ✅ Solution : constantes avec des noms explicites

class OrderLimits
{
    public const FREE_SHIPPING_THRESHOLD = 100.00;
    public const STANDARD_SHIPPING_COST = 5.99;
    public const MAX_ITEMS_PER_ORDER = 50;
    public const SESSION_DURATION_SECONDS = 86_400; // 24 heures
    public const VAT_RATE = 0.20; // 20% TVA
}

class OrderStatus
{
    public const PENDING = 'pending';
    public const CONFIRMED = 'confirmed';
    public const SHIPPED = 'shipped';
    public const CANCELLED = 'cancelled';
}

function processOrder(array $order): void
{
    if ($order['total'] > OrderLimits::FREE_SHIPPING_THRESHOLD) {
        $shipping = 0;
    } else {
        $shipping = OrderLimits::STANDARD_SHIPPING_COST;
    }

    if ($order['status'] === OrderStatus::PENDING) {
        // ...
    }

    $expiry = time() + OrderLimits::SESSION_DURATION_SECONDS;
    $tax = $order['total'] * OrderLimits::VAT_RATE;

    if (count($order['items']) > OrderLimits::MAX_ITEMS_PER_ORDER) {
        throw new \Exception('Trop d\'articles');
    }
}
```

---

### Qu'est-ce que la Premature Optimization ?

**Définition** : L'optimisation prématurée consiste à optimiser le code avant de savoir s'il a un problème de performance. On sacrifie la lisibilité et la maintenabilité pour des gains de performance négligeables ou inexistants.

**Le problème que l'optimisation prématurée crée** :

1. **Code illisible** : les optimisations rendent le code difficile à comprendre.
2. **Temps perdu** : on optimise du code qui ne sera peut-être jamais un goulot d'étranglement.
3. **Bugs introduits** : les optimisations complexes introduisent des bugs subtils.

**Analogie concrète** : C'est comme renforcer les fondations d'une cabane de jardin comme si c'était un immeuble de 10 étages. Tu dépenses du temps et de l'argent pour un problème qui n'existe pas. Construis d'abord la cabane, et renforce les fondations seulement si elle doit grandir.

**Citation célèbre** : "L'optimisation prématurée est la racine de tout mal." -- Donald Knuth

**Exemple** :

```php
<?php

// ❌ Anti-pattern : optimisation prématurée
// On utilise un système de cache complexe pour une requête qui prend 2ms
class ProductService
{
    private array $cache = [];
    private array $cacheTimestamps = [];
    private const CACHE_TTL = 300;

    public function getProduct(int $id): ?Product
    {
        // Système de cache maison avec TTL
        $cacheKey = "product_$id";

        if (isset($this->cache[$cacheKey])) {
            if (time() - $this->cacheTimestamps[$cacheKey] < self::CACHE_TTL) {
                return $this->cache[$cacheKey];
            }

            unset($this->cache[$cacheKey]);
            unset($this->cacheTimestamps[$cacheKey]);
        }

        $product = $this->repository->find($id);
        $this->cache[$cacheKey] = $product;
        $this->cacheTimestamps[$cacheKey] = time();

        return $product;
    }
}
```

```php
<?php

// ✅ Solution : code simple d'abord, optimiser si nécessaire
class ProductService
{
    public function getProduct(int $id): ?Product
    {
        // Simple, lisible, correct
        // On optimisera SEULEMENT si le profiling montre un problème
        return $this->repository->find($id);
    }
}
```

**Quand optimiser (et quand ne PAS optimiser)** :

| Situation | Action |
| --- | --- |
| Le code est lent et le profiling le confirme | Optimiser |
| Le code "pourrait être lent un jour" | Ne pas optimiser maintenant |
| L'algorithme est O(n^2) sur une liste de 10 éléments | Ne pas optimiser (négligeable) |
| L'algorithme est O(n^2) sur une liste de 100 000 éléments | Optimiser |
| Un utilisateur a signalé un temps de chargement lent | Mesurer d'abord, optimiser ensuite |

---

### Tableau récapitulatif des anti-patterns

| Anti-pattern | Symptôme principal | Principe SOLID violé | Solution |
| --- | --- | --- | --- |
| God class | Classe qui fait tout | SRP | Découper en classes spécialisées |
| Spaghetti code | Code embrouillé et imbriqué | SRP, OCP | Extraire des méthodes, restructurer |
| Lava flow | Code mort et obsolète | - | Supprimer, faire confiance à Git |
| Golden hammer | Même outil pour tout | - | Choisir l'outil adapté au problème |
| Copy-paste | Code dupliqué | DRY | Extraire dans un service ou une fonction |
| Magic numbers | Valeurs sans nom | - | Utiliser des constantes nommées |
| Optimisation prématurée | Complexité sans mesure | KISS | Mesurer avant d'optimiser |

---

## Étapes Pratiques

### Étape 1 : Détecter les God classes dans un projet

```bash
# Compter les lignes de chaque fichier PHP dans src/
# Les fichiers de plus de 300 lignes sont suspects
find src/ -name "*.php" -exec wc -l {} + | sort -rn | head -20
```

**Résultat attendu** :

```text
  1250 src/Controller/ProductController.php  ← God class probable
   890 src/Service/OrderManager.php           ← God class probable
   420 src/Entity/User.php                    ← A surveiller
   180 src/Service/PaymentService.php         ← Taille raisonnable
   120 src/Repository/ProductRepository.php   ← OK
```

Pour chaque fichier de plus de 300 lignes, pose-toi ces questions :

1. Combien de responsabilités différentes cette classe a-t-elle ?
2. Peut-on la découper en 2 ou 3 classes plus petites ?
3. Combien de services sont injectés dans le constructeur ?

---

### Étape 2 : Éliminer les magic numbers

Prends un fichier de ton projet et cherche les nombres écrits en dur :

```php
<?php

// Avant : chercher les valeurs "magiques"
// Critere : tout nombre qui n'est pas 0 ou 1 est suspect

// Étape 1 : identifier les magic numbers
$results = [];
$perPage = 15;                    // ← Pourquoi 15 ?
$maxRetries = 3;                  // ← Pourquoi 3 ?
$timeout = 30;                    // ← 30 quoi ? Secondes ? Minutes ?
$discountThreshold = 500;         // ← D'ou vient cette valeur ?
```

```php
<?php

// Apres : remplacer par des constantes

class PaginationConfig
{
    public const ITEMS_PER_PAGE = 15;
}

class RetryConfig
{
    public const MAX_RETRIES = 3;
    public const TIMEOUT_SECONDS = 30;
}

class DiscountConfig
{
    public const MINIMUM_ORDER_FOR_DISCOUNT = 500.00;
}
```

**Résultat attendu** :

```text
Chaque valeur numérique a un nom qui explique :
  - Ce qu'elle représente (ITEMS_PER_PAGE)
  - Son unité si pertinent (TIMEOUT_SECONDS)
  - Son contexte métier (MINIMUM_ORDER_FOR_DISCOUNT)
```

---

### Étape 3 : Refactorer du spaghetti code

Voici une méthode à refactorer. Identifie les problèmes et restructure le code :

```php
<?php

// ❌ Avant : spaghetti code
function calculatePrice($product, $user, $coupon, $options)
{
    $price = $product['price'];

    if ($user) {
        if ($user['type'] == 'premium') {
            $price = $price * 0.85;
        } elseif ($user['type'] == 'vip') {
            $price = $price * 0.75;
            if ($product['category'] == 'electronics') {
                $price = $price * 0.95;
            }
        }
    }

    if ($coupon) {
        if ($coupon['type'] == 'percent') {
            if ($coupon['value'] <= 50) {
                $price = $price * (1 - $coupon['value'] / 100);
            }
        } elseif ($coupon['type'] == 'fixed') {
            $price = $price - $coupon['value'];
            if ($price < 0) {
                $price = 0;
            }
        }
    }

    if (isset($options['gift_wrap'])) {
        $price += 4.99;
    }

    if (isset($options['express'])) {
        $price += 9.99;
    }

    return round($price, 2);
}
```

```php
<?php

// ✅ Après : code structuré

class PriceCalculator
{
    private const PREMIUM_DISCOUNT = 0.15;    // 15%
    private const VIP_DISCOUNT = 0.25;        // 25%
    private const VIP_ELECTRONICS_EXTRA = 0.05; // 5% supplementaire
    private const MAX_COUPON_PERCENT = 50;
    private const GIFT_WRAP_COST = 4.99;
    private const EXPRESS_SHIPPING_COST = 9.99;

    public function calculate(
        array $product,
        ?array $user,
        ?array $coupon,
        array $options = [],
    ): float {
        $price = (float) $product['price'];
        $price = $this->applyUserDiscount($price, $user, $product);
        $price = $this->applyCoupon($price, $coupon);
        $price = $this->addOptions($price, $options);

        return round(max(0, $price), 2);
    }

    private function applyUserDiscount(
        float $price,
        ?array $user,
        array $product,
    ): float {
        if ($user === null) {
            return $price;
        }

        return match ($user['type']) {
            'premium' => $price * (1 - self::PREMIUM_DISCOUNT),
            'vip' => $this->applyVipDiscount($price, $product),
            default => $price,
        };
    }

    private function applyVipDiscount(float $price, array $product): float
    {
        $price *= (1 - self::VIP_DISCOUNT);

        if ($product['category'] === 'electronics') {
            $price *= (1 - self::VIP_ELECTRONICS_EXTRA);
        }

        return $price;
    }

    private function applyCoupon(float $price, ?array $coupon): float
    {
        if ($coupon === null) {
            return $price;
        }

        return match ($coupon['type']) {
            'percent' => $coupon['value'] <= self::MAX_COUPON_PERCENT
                ? $price * (1 - $coupon['value'] / 100)
                : $price,
            'fixed' => $price - $coupon['value'],
            default => $price,
        };
    }

    private function addOptions(float $price, array $options): float
    {
        if (isset($options['gift_wrap'])) {
            $price += self::GIFT_WRAP_COST;
        }

        if (isset($options['express'])) {
            $price += self::EXPRESS_SHIPPING_COST;
        }

        return $price;
    }
}
```

**Résultat attendu** :

```text
Le code refactoré est :
- Lisible : chaque méthode a un nom explicite
- Testable : chaque méthode privée peut être testée via la méthode publique
- Extensible : ajouter un nouveau type de remise ne touche qu'une méthode
- Sans magic numbers : chaque valeur a un nom
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `vendor/bin/phpstan analyse src/ --level 5` | Détecter code mort, types incorrects |
| `vendor/bin/php-cs-fixer fix --rules=no_unused_imports` | Supprimer les imports inutiles |
| `find src/ -name "*.php" -exec wc -l {} +` | Compter les lignes par fichier |
| `git log --diff-filter=D -- "*.php"` | Voir les fichiers supprimés (récupérables) |

---

## Pièges Fréquents

### Piège 1 : Chasser les anti-patterns avec excès

⚠️ **Problème** : Tu veux éliminer tous les anti-patterns immédiatement et tu refactores tout le projet d'un coup, créant des régressions partout.

✅ **Solution** : Refactore progressivement. À chaque modification d'un fichier, améliore-le un peu. C'est la règle du boy scout : "Laisse le code plus propre que tu ne l'as trouvé."

### Piège 2 : Confondre anti-pattern et pragmatisme

⚠️ **Problème** : Tu refuses tout code "imparfait" et tu passes 3 jours à refactorer un script utilisé une seule fois.

✅ **Solution** : Le contexte compte. Un script ponctuel peut contenir des magic numbers. Un prototype peut avoir du spaghetti code. L'important est que le code de production soit propre.

### Piège 3 : Créer un nouvel anti-pattern en corrigeant un autre

⚠️ **Problème** : En découpant une God class, tu crées 20 classes minuscules avec une seule méthode chacune, rendant le code tout aussi difficile à naviguer.

✅ **Solution** : Trouve le bon équilibre. Le nombre de classes n'est pas un objectif en soi. L'objectif est la lisibilité et la maintenabilité.

---

## Checklist de Validation

- [ ] Je sais définir ce qu'est un anti-pattern et le distinguer d'un simple bug
- [ ] Je sais reconnaître une God class et la découper
- [ ] Je sais identifier du spaghetti code et le restructurer
- [ ] Je sais détecter du lava flow et le nettoyer
- [ ] Je comprends le golden hammer et je choisis l'outil adapté au problème
- [ ] Je sais éliminer le copy-paste en extrayant des services
- [ ] Je sais remplacer les magic numbers par des constantes nommées
- [ ] Je comprends pourquoi l'optimisation prématurée est contre-productive

---

## Exercice Pratique

**Énoncé** : Refactore le code suivant en identifiant et corrigeant tous les anti-patterns présents.

**Instructions** :

1. Lis le code ci-dessous et identifie chaque anti-pattern (il y en a au moins 5)
2. Pour chaque anti-pattern, écris son nom et explique le problème
3. Refactore le code en appliquant les solutions vues dans cette fiche

```php
<?php

class ShopManager
{
    private $db;

    public function processStuff($type, $data, $options = [])
    {
        if ($type == 'order') {
            $total = 0;
            foreach ($data['items'] as $item) {
                $price = $this->db->query("SELECT price FROM products WHERE id = " . $item['id'])[0]['price'];
                $subtotal = $price * $item['qty'];
                if ($item['qty'] > 10) {
                    $subtotal = $subtotal * 0.9;
                }
                if ($item['qty'] > 50) {
                    $subtotal = $subtotal * 0.8;
                }
                $total += $subtotal;
            }
            if ($total > 200) {
                $total = $total - 15;
            }
            $this->db->query("INSERT INTO orders ...");
            $this->sendMail($data['email'], 'Commande confirmée', "Total : $total");
            return $total;
        } elseif ($type == 'refund') {
            // Code très similaire au bloc ci-dessus...
            $total = 0;
            foreach ($data['items'] as $item) {
                $price = $this->db->query("SELECT price FROM products WHERE id = " . $item['id'])[0]['price'];
                $subtotal = $price * $item['qty'];
                $total += $subtotal;
            }
            $this->db->query("UPDATE orders SET status = 'refunded' ...");
            $this->sendMail($data['email'], 'Remboursement', "Montant : $total");
            return $total;
        } elseif ($type == 'report') {
            // Générer un rapport... dans la même classe
            $results = $this->db->query("SELECT * FROM orders WHERE ...");
            // ... 50 lignes de formatage
        }
    }

    // public function oldProcessStuff($data) {
    //     // Ancienne version, gardée "au cas où"
    //     // ... 100 lignes commentées
    // }

    private function sendMail($to, $subject, $body) { /* ... */ }
}
```

**Résultat attendu** : Un code restructuré avec des classes séparées, des constantes, pas de code mort et pas de duplication.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Anti-patterns identifiés** :

1. **God class** : `ShopManager` gère les commandes, les remboursements, les rapports et les emails.
2. **Spaghetti code** : la méthode `processStuff` est un gros `if/elseif` avec de l'imbrication profonde.
3. **Copy-paste** : le calcul du total est dupliqué entre `order` et `refund`.
4. **Magic numbers** : `0.9`, `0.8`, `10`, `50`, `200`, `15` sans explication.
5. **Lava flow** : la méthode `oldProcessStuff` commentée.
6. **Magic strings** : `'order'`, `'refund'`, `'report'` comme types sans constantes.

**Code refactoré** :

```php
<?php

// Constantes métier
class OrderDiscounts
{
    public const VOLUME_THRESHOLD_SMALL = 10;
    public const VOLUME_THRESHOLD_LARGE = 50;
    public const VOLUME_DISCOUNT_SMALL = 0.10;  // 10%
    public const VOLUME_DISCOUNT_LARGE = 0.20;  // 20%
    public const FREE_SHIPPING_THRESHOLD = 200.00;
    public const FREE_SHIPPING_DISCOUNT = 15.00;
}

// Service de calcul de prix (réutilisable)
class PriceCalculator
{
    public function __construct(
        private ProductRepository $products,
    ) {
    }

    public function calculateTotal(array $items): float
    {
        $total = 0.0;

        foreach ($items as $item) {
            $price = $this->products->getPrice($item['id']);
            $subtotal = $price * $item['qty'];
            $subtotal = $this->applyVolumeDiscount($subtotal, $item['qty']);
            $total += $subtotal;
        }

        return $this->applyOrderDiscount($total);
    }

    public function calculateRefundTotal(array $items): float
    {
        $total = 0.0;

        foreach ($items as $item) {
            $price = $this->products->getPrice($item['id']);
            $total += $price * $item['qty'];
        }

        return $total;
    }

    private function applyVolumeDiscount(float $subtotal, int $quantity): float
    {
        if ($quantity > OrderDiscounts::VOLUME_THRESHOLD_LARGE) {
            return $subtotal * (1 - OrderDiscounts::VOLUME_DISCOUNT_LARGE);
        }

        if ($quantity > OrderDiscounts::VOLUME_THRESHOLD_SMALL) {
            return $subtotal * (1 - OrderDiscounts::VOLUME_DISCOUNT_SMALL);
        }

        return $subtotal;
    }

    private function applyOrderDiscount(float $total): float
    {
        if ($total > OrderDiscounts::FREE_SHIPPING_THRESHOLD) {
            return $total - OrderDiscounts::FREE_SHIPPING_DISCOUNT;
        }

        return $total;
    }
}

// Service de commandes (une seule responsabilité)
class OrderService
{
    public function __construct(
        private PriceCalculator $calculator,
        private OrderRepository $orders,
        private EmailService $emailService,
    ) {
    }

    public function create(array $data): float
    {
        $total = $this->calculator->calculateTotal($data['items']);
        $this->orders->save($data, $total);
        $this->emailService->sendOrderConfirmation($data['email'], $total);

        return $total;
    }
}

// Service de remboursements (une seule responsabilité)
class RefundService
{
    public function __construct(
        private PriceCalculator $calculator,
        private OrderRepository $orders,
        private EmailService $emailService,
    ) {
    }

    public function process(array $data): float
    {
        $total = $this->calculator->calculateRefundTotal($data['items']);
        $this->orders->markAsRefunded($data['orderId']);
        $this->emailService->sendRefundConfirmation($data['email'], $total);

        return $total;
    }
}

// Plus de code commenté (oldProcessStuff supprimé)
// Plus de magic numbers (constantes dans OrderDiscounts)
// Plus de God class (3 services séparés)
// Plus de copy-paste (PriceCalculator réutilisé)
```

---

## Navigation

← Fiche précédente : **[Patterns JavaScript](10-patterns-javascript.md)**

→ Fiche suivante : **[Multi-tenancy : isoler les données par client](12-multi-tenancy.md)**
