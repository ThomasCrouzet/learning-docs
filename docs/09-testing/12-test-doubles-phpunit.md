---
tags:
  - Testing
  - PHPUnit
  - Avancé
description: "Test doubles avec PHPUnit : dummy, stub, fake, spy, mock. Quand et comment les utiliser sans coupler ton test à l'implémentation."
estimated_time: "75 min"
fiche_number: 12
total_fiches: 15
cursus: "Testing et Qualité"
---

# 12 - Test doubles avec PHPUnit

> **En bref** : Comprendre les cinq familles de test doubles (dummy, stub, fake, spy, mock) selon la taxonomie de Fowler. Utiliser createMock, willReturn, expects et with pour isoler tes tests sans les coupler à l'implémentation. Lecture estimée : 75 min.

## Prérequis

- Fiche 2 : [Tests unitaires PHP (PHPUnit)](02-tests-unitaires-php.md)
- Fiche 6 : [Introduction au TDD](06-introduction-tdd.md)
- Cursus PHP, notions de classes, interfaces et injection de dépendances

## Objectif de cette fiche

À la fin de cette fiche, tu sauras choisir le bon type de test double, l'instancier avec PHPUnit, vérifier les appels et leurs arguments, et éviter le piège de la sur-mockification.

---

## Concepts

Cette section explique toutes les familles de test doubles. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un test double ?

**Définition** : Un test double est un objet qui remplace une dépendance réelle pendant l'exécution d'un test, dans le but d'isoler le code testé de ses collaborateurs. Le terme vient de "stunt double" (cascadeur de cinéma) et regroupe cinq familles précises selon la taxonomie de Martin Fowler : dummy, stub, fake, spy, mock.

**Le problème que les test doubles résolvent** :

Sans test doubles, voici les problèmes rencontrés :

1. **Tests lents** : chaque test ouvre une vraie connexion à la base de données ou envoie un vrai email.
2. **Tests instables** : un service externe est indisponible et tes tests échouent sans que ton code soit en cause.
3. **Tests non isolés** : un test modifie l'état global et fait échouer les tests suivants.
4. **Cas limites impossibles à provoquer** : tu ne peux pas forcer une vraie API à renvoyer une erreur réseau.

**Comment les test doubles résolvent ces problèmes** :

| Problème | Solution apportée par les test doubles |
| --- | --- |
| Tests lents | Pas d'appel réseau ni d'I/O disque |
| Tests instables | Aucune dépendance à un service externe |
| Tests non isolés | Chaque test reçoit ses propres doubles, neufs |
| Cas limites impossibles | On force le double à renvoyer ce que l'on veut |

**Analogie concrète** : Pense au cascadeur de cinéma. Quand une scène nécessite une chute dangereuse, l'acteur principal n'est pas mis en danger : un cascadeur prend sa place. Le cascadeur ressemble à l'acteur, il porte les mêmes habits, mais c'est un substitut entraîné pour une mission précise. Un test double remplit le même rôle pour ton code : il prend la place d'une dépendance réelle pendant le temps du test.

**Ce qu'un test double n'est PAS** :

- Un test double n'est pas un mensonge. Il respecte le contrat (la signature de la méthode ou l'interface) de la dépendance qu'il remplace, sinon le code testé ne compilerait pas.
- Un test double n'est pas réservé aux tests unitaires. On peut aussi en utiliser dans des tests d'intégration pour isoler la partie externe non testable.

**Les cinq familles selon Fowler** :

| Famille | Rôle principal | Vérifie les appels ? |
| --- | --- | --- |
| Dummy | Remplir une signature de méthode | Non |
| Stub | Renvoyer des valeurs prédéfinies | Non |
| Fake | Implémentation simplifiée mais fonctionnelle | Non |
| Spy | Enregistrer les appels reçus | Oui, après coup |
| Mock | Vérifier que les bons appels sont faits | Oui, avec attentes préalables |

---

### Qu'est-ce qu'un dummy ?

**Définition** : Un dummy est un objet passé en paramètre mais jamais utilisé par le code testé. Il sert uniquement à satisfaire la signature d'une méthode ou d'un constructeur.

**Le problème que les dummies résolvent** :

1. **Signatures contraignantes** : une méthode exige un objet en paramètre, même si ton test ne s'en sert pas.
2. **Construction d'objets complexes** : un constructeur exige plusieurs dépendances, et tu n'as besoin que d'une seule pour ton test.

**Comment les dummies résolvent ces problèmes** :

| Problème | Solution apportée par le dummy |
| --- | --- |
| Signature contraignante | On passe un objet vide qui respecte le type |
| Construction complexe | On remplit les paramètres inutilisés avec des dummies |

**Analogie concrète** : Pense à un mannequin de couture. Il a la forme d'un être humain, on peut lui mettre une veste, mais il ne marche pas, ne parle pas et ne fait rien. Il sert à présenter le vêtement. Un dummy fait pareil : il a la forme attendue par le code, mais il n'agit pas.

**Ce qu'un dummy n'est PAS** :

- Un dummy n'est pas un stub. Un stub renvoie des valeurs. Un dummy n'est jamais appelé, donc il ne renvoie rien.
- Un dummy n'est pas `null`. Si la signature accepte `null`, autant passer `null`. Le dummy est utilisé quand la signature exige un objet non nul.

**Exemple** :

```php
<?php

namespace App\Tests\Service;

use App\Service\OrderNotifier;
use App\Service\MailerInterface;
use App\Service\LoggerInterface;
use App\Entity\Order;
use PHPUnit\Framework\TestCase;

final class OrderNotifierTest extends TestCase
{
    public function testNotifyDoesNothingWhenOrderIsEmpty(): void
    {
        // Dummy : le logger est exigé par le constructeur,
        // mais on sait que dans ce cas il ne sera jamais utilisé.
        $logger = $this->createMock(LoggerInterface::class);
        $mailer = $this->createMock(MailerInterface::class);

        $notifier = new OrderNotifier($mailer, $logger);
        $emptyOrder = new Order();

        // Le test vérifie juste que la méthode ne lève pas d'exception
        // sur une commande vide. Le logger n'a aucun rôle à jouer ici.
        $notifier->notify($emptyOrder);

        static::assertTrue(true); // Pas d'exception levée
    }
}
```

---

### Qu'est-ce qu'un stub ?

**Définition** : Un stub est un test double qui renvoie des valeurs prédéfinies quand on appelle ses méthodes. Il sert à contrôler les entrées du code testé sans vérifier comment on l'appelle.

**Le problème que les stubs résolvent** :

1. **Données externes imprévisibles** : une API renvoie des résultats différents selon l'heure ou l'état du serveur.
2. **Cas limites difficiles à provoquer** : tu veux tester ce qui se passe quand le repository renvoie `null`, mais il faudrait vider la base.
3. **Dépendances lentes** : un appel à un service externe prend 2 secondes par test.

**Comment les stubs résolvent ces problèmes** :

| Problème | Solution apportée par le stub |
| --- | --- |
| Données imprévisibles | On force la valeur de retour |
| Cas limites difficiles | On configure le stub pour renvoyer la valeur voulue |
| Dépendances lentes | Le stub répond instantanément, en mémoire |

**Analogie concrète** : Pense à un distributeur de boissons truqué pour une démonstration. Quel que soit le bouton appuyé, il renvoie toujours la même cannette. Pendant la démo, on contrôle ce qui sort. Le stub fait la même chose : on contrôle ce qu'il renvoie, peu importe comment on l'interroge.

**Ce qu'un stub n'est PAS** :

- Un stub n'est pas un mock. Un mock vérifie qu'il a bien été appelé. Un stub se contente de répondre.
- Un stub n'est pas un fake. Un fake a une vraie logique interne. Un stub renvoie des valeurs codées en dur.

**Exemple** :

```php
<?php

namespace App\Tests\Service;

use App\Service\PriceCalculator;
use App\Repository\ProductRepository;
use PHPUnit\Framework\TestCase;

final class PriceCalculatorTest extends TestCase
{
    public function testCalculateTotalReturnsZeroWhenProductNotFound(): void
    {
        // On crée un stub du repository (createStub, pas createMock)
        $repository = $this->createStub(ProductRepository::class);

        // On force la méthode getPrice à renvoyer null
        // (cas où le produit n'existe pas en base)
        $repository->method('getPrice')->willReturn(null);

        $calculator = new PriceCalculator($repository);
        $total = $calculator->calculateTotal([
            ['id' => 42, 'qty' => 3],
        ]);

        // On vérifie le comportement du SUT face à cette entrée
        static::assertSame(0.0, $total);
    }
}
```

---

### Qu'est-ce qu'un fake ?

**Définition** : Un fake est une implémentation simplifiée mais fonctionnelle d'une dépendance, écrite pour les tests. Contrairement au stub qui renvoie des valeurs codées en dur, le fake a une vraie logique interne, généralement stockée en mémoire.

**Le problème que les fakes résolvent** :

1. **Stubs trop rigides** : configurer un stub pour gérer 10 scénarios différents devient illisible.
2. **Tests qui dépendent d'une vraie base** : tester un repository implique normalement une base de données réelle, ce qui ralentit les tests.
3. **Logique partagée entre tests** : plusieurs tests ont besoin du même comportement réaliste (stockage, lecture, suppression).

**Comment les fakes résolvent ces problèmes** :

| Problème | Solution apportée par le fake |
| --- | --- |
| Stubs trop rigides | Le fake gère naturellement tous les scénarios |
| Dépendance à une vraie base | Le fake stocke en mémoire, sans I/O |
| Logique partagée | Le fake encapsule la logique réutilisable |

**Analogie concrète** : Pense à une cuisine de démonstration dans un magasin d'électroménager. L'eau coule, le four chauffe, le frigo refroidit, mais ce n'est pas une vraie cuisine : il n'y a pas de raccordement aux égouts, pas de gaz, pas de réserve alimentaire. C'est fonctionnel pour la démonstration, sans l'infrastructure complète. Un fake fonctionne pareil : il imite le comportement, sans l'infrastructure réelle.

**Ce qu'un fake n'est PAS** :

- Un fake n'est pas un stub. Un stub renvoie des valeurs fixes. Un fake a une logique : ce qu'il renvoie dépend de ce qu'on a fait avant.
- Un fake n'est pas un mock. Un fake ne vérifie rien ; il se contente de fonctionner correctement comme une vraie implémentation simplifiée.

**Comparaison stub vs fake** :

| Stub | Fake |
| --- | --- |
| Renvoie des valeurs codées en dur | A une vraie logique interne |
| Configuration test par test | Comportement cohérent entre tests |
| Idéal pour un seul cas de retour | Idéal pour plusieurs scénarios |

**Exemple** :

```php
<?php

namespace App\Tests\Fake;

use App\Entity\User;
use App\Repository\UserRepositoryInterface;

// Implémentation fake : stocke les utilisateurs en mémoire
final class InMemoryUserRepository implements UserRepositoryInterface
{
    /** @var array<int, User> */
    private array $users = [];

    private int $nextId = 1;

    public function save(User $user): void
    {
        // On simule l'attribution d'un identifiant par la base
        if ($user->getId() === null) {
            $user->setId($this->nextId++);
        }

        // On stocke par identifiant pour pouvoir le retrouver
        $this->users[$user->getId()] = $user;
    }

    public function find(int $id): ?User
    {
        // On renvoie l'utilisateur si présent, null sinon
        return $this->users[$id] ?? null;
    }

    public function findByEmail(string $email): ?User
    {
        // Recherche linéaire : suffisant en test
        foreach ($this->users as $user) {
            if ($user->getEmail() === $email) {
                return $user;
            }
        }

        return null;
    }

    public function delete(User $user): void
    {
        // On supprime du tableau interne
        unset($this->users[$user->getId()]);
    }
}
```

Utilisation dans un test :

```php
<?php

namespace App\Tests\Service;

use App\Entity\User;
use App\Service\UserRegistration;
use App\Tests\Fake\InMemoryUserRepository;
use PHPUnit\Framework\TestCase;

final class UserRegistrationTest extends TestCase
{
    public function testRegisterPersistsTheUser(): void
    {
        // Le fake remplace la vraie base de données
        $repository = new InMemoryUserRepository();
        $registration = new UserRegistration($repository);

        $user = $registration->register('alice@example.com', 'secret');

        // Le fake permet de vérifier que l'utilisateur est bien retrouvable
        $retrieved = $repository->findByEmail('alice@example.com');
        static::assertNotNull($retrieved);
        static::assertSame($user->getEmail(), $retrieved->getEmail());
    }
}
```

---

### Qu'est-ce qu'un spy ?

**Définition** : Un spy est un test double qui enregistre les appels qu'il reçoit (méthode appelée, arguments fournis) sans imposer d'attentes préalables. On vérifie après coup ce qui s'est passé, comme un détective qui consulte une caméra de surveillance.

**Le problème que les spies résolvent** :

1. **Mocks trop stricts** : configurer toutes les attentes à l'avance rend le test fragile aux refactorings internes.
2. **Vérifications optionnelles** : on veut savoir combien de fois une méthode a été appelée, sans imposer un nombre exact.
3. **Tests qui couvrent plusieurs scénarios** : on veut une seule série d'assertions à la fin, pas une configuration éparpillée.

**Comment les spies résolvent ces problèmes** :

| Problème | Solution apportée par le spy |
| --- | --- |
| Mocks trop stricts | Pas d'attente préalable, vérification après coup |
| Vérifications optionnelles | On lit le journal des appels et on l'analyse |
| Assertions éparpillées | Toutes les vérifications sont à la fin du test |

**Analogie concrète** : Pense à une caméra de surveillance dans un magasin. Elle n'arrête personne, elle ne dit rien, elle ne juge rien. Elle enregistre. À la fin de la journée, le gérant visionne l'enregistrement pour vérifier ce qui s'est passé. Un spy fonctionne pareil : il enregistre les appels, et tu décides après coup ce qui compte.

**Ce qu'un spy n'est PAS** :

- Un spy n'est pas un mock. Un mock impose des attentes avant l'exécution et échoue si elles ne sont pas respectées. Un spy enregistre passivement.
- Un spy n'est pas un stub. Un stub ne mémorise rien des appels reçus ; un spy garde une trace de tout.

**Exemple de spy maison** :

```php
<?php

namespace App\Tests\Spy;

use App\Service\LoggerInterface;

// Spy : enregistre tous les appels reçus
final class LoggerSpy implements LoggerInterface
{
    /** @var array<int, array{level: string, message: string, context: array<string, mixed>}> */
    public array $calls = [];

    public function log(string $level, string $message, array $context = []): void
    {
        // On enregistre l'appel sans rien renvoyer ni rien faire
        $this->calls[] = [
            'level' => $level,
            'message' => $message,
            'context' => $context,
        ];
    }

    public function callsForLevel(string $level): array
    {
        // Méthode utilitaire pour filtrer le journal
        return array_filter($this->calls, fn ($call) => $call['level'] === $level);
    }
}
```

Utilisation dans un test :

```php
<?php

namespace App\Tests\Service;

use App\Service\OrderProcessor;
use App\Tests\Spy\LoggerSpy;
use PHPUnit\Framework\TestCase;

final class OrderProcessorTest extends TestCase
{
    public function testProcessLogsExactlyOneErrorOnFailure(): void
    {
        $loggerSpy = new LoggerSpy();
        $processor = new OrderProcessor($loggerSpy);

        $processor->processInvalidOrder();

        // Vérifications après coup, à partir du journal du spy
        $errors = $loggerSpy->callsForLevel('error');
        static::assertCount(1, $errors);
        static::assertStringContainsString('invalide', array_values($errors)[0]['message']);
    }
}
```

---

### Qu'est-ce qu'un mock ?

**Définition** : Un mock est un test double qui vérifie activement que les bonnes méthodes sont appelées, avec les bons arguments et le bon nombre de fois. La vérification est définie avant l'exécution et le test échoue immédiatement si les attentes ne sont pas respectées.

**Le problème que les mocks résolvent** :

1. **Vérification de comportement** : tu veux prouver que ton service envoie bien un email, pas juste qu'il renvoie `true`.
2. **Interactions invisibles** : la méthode testée ne renvoie rien, mais elle doit appeler une dépendance ; comment vérifier l'appel ?
3. **Détection précoce d'erreurs** : un appel manqué doit faire échouer le test immédiatement, pas en silence.

**Comment les mocks résolvent ces problèmes** :

| Problème | Solution apportée par le mock |
| --- | --- |
| Vérification de comportement | Le mock impose la présence et la signature de l'appel |
| Interactions invisibles | Le mock observe les appels au moment où ils arrivent |
| Détection précoce | Le mock échoue dès que l'attente est violée |

**Analogie concrète** : Pense à un contrôleur dans un train. Il a une liste précise de billets attendus (les attentes). Quand un voyageur présente son billet, le contrôleur vérifie immédiatement qu'il correspond. Si quelqu'un n'a pas de billet ou présente le mauvais billet, le contrôle échoue tout de suite. Un mock fonctionne pareil : tu déclares à l'avance ce qui doit arriver, et le mock vérifie en temps réel.

**Ce qu'un mock n'est PAS** :

- Un mock n'est pas un spy. Le spy enregistre passivement et on vérifie à la fin. Le mock impose des attentes avant l'exécution et échoue en cours de route.
- Un mock n'est pas un stub. Un stub se contente de renvoyer des valeurs. Un mock vérifie en plus que les appels arrivent comme attendu.

**Comparaison stub vs mock** :

| Stub | Mock |
| --- | --- |
| Renvoie des valeurs | Vérifie les appels |
| Pas d'assertion implicite | Assertion intégrée |
| `willReturn(...)` | `expects(...)->method(...)` |
| Test échoue uniquement sur l'assertion finale | Test échoue dès qu'une attente est violée |

**Exemple** :

```php
<?php

namespace App\Tests\Service;

use App\Service\OrderNotifier;
use App\Service\MailerInterface;
use App\Service\LoggerInterface;
use App\Entity\Order;
use PHPUnit\Framework\TestCase;

final class OrderNotifierTest extends TestCase
{
    public function testNotifySendsExactlyOneEmail(): void
    {
        $mailer = $this->createMock(MailerInterface::class);
        $logger = $this->createMock(LoggerInterface::class);

        // Attente préalable : send sera appelée exactement une fois
        $mailer->expects(static::once())
            ->method('send');

        $notifier = new OrderNotifier($mailer, $logger);
        $order = new Order();
        $order->setEmail('client@example.com');

        $notifier->notify($order);

        // Si send n'est pas appelée, ou appelée 2 fois, le test échoue
    }
}
```

---

### Tableau récapitulatif stub vs spy vs mock

| Critère | Stub | Spy | Mock |
| --- | --- | --- | --- |
| But principal | Contrôler les retours | Enregistrer les appels | Vérifier les appels |
| Configuration | `willReturn(...)` | Aucune attente, méthodes utilitaires | `expects(...)->method(...)` |
| Moment de la vérification | Aucune | Après l'exécution | Pendant l'exécution |
| Échec en cas d'appel manquant | Non | Non (sauf assertion finale) | Oui, immédiat |
| Couplage à l'implémentation | Faible | Moyen | Élevé |
| Quand l'utiliser | Tu testes un retour | Tu vérifies une trace | Tu testes une interaction obligatoire |

---

## Étapes Pratiques

### Étape 1 : Préparer un service à tester

Crée un service `OrderNotifier` qui dépend de deux interfaces. Ce service sera la cible de tous les exemples suivants.

Code complet du service :

```php
<?php

namespace App\Service;

use App\Entity\Order;

interface MailerInterface
{
    public function send(string $to, string $subject, string $body): bool;
}

interface LoggerInterface
{
    public function log(string $level, string $message, array $context = []): void;
}

final class OrderNotifier
{
    public function __construct(
        private MailerInterface $mailer,
        private LoggerInterface $logger,
    ) {
    }

    public function notify(Order $order): void
    {
        // On ne notifie pas une commande sans email
        if ($order->getEmail() === null) {
            $this->logger->log('warning', 'Commande sans email', ['id' => $order->getId()]);
            return;
        }

        // On envoie l'email de confirmation
        $sent = $this->mailer->send(
            $order->getEmail(),
            'Confirmation de commande',
            'Votre commande a été reçue.',
        );

        // On trace le résultat
        if ($sent) {
            $this->logger->log('info', 'Email envoyé', ['email' => $order->getEmail()]);
        } else {
            $this->logger->log('error', 'Échec envoi email', ['email' => $order->getEmail()]);
        }
    }
}
```

**Résultat attendu** :

```text
Le service compile sans erreur et expose une seule méthode publique notify().
Les deux dépendances sont injectées via le constructeur.
Les interfaces MailerInterface et LoggerInterface peuvent être mockées par PHPUnit.
```

---

### Étape 2 : Créer un stub avec createMock + willReturn

Tu vas créer un stub qui force le mailer à renvoyer `true`, puis vérifier le comportement du `OrderNotifier`.

Code complet du test :

```php
<?php

namespace App\Tests\Service;

use App\Entity\Order;
use App\Service\LoggerInterface;
use App\Service\MailerInterface;
use App\Service\OrderNotifier;
use PHPUnit\Framework\TestCase;

final class OrderNotifierStubTest extends TestCase
{
    public function testNotifyLogsInfoWhenMailerSucceeds(): void
    {
        // Création du stub : on force send() à toujours renvoyer true
        $mailer = $this->createMock(MailerInterface::class);
        $mailer->method('send')->willReturn(true);

        // Le logger est aussi un double, mais on ne configure rien
        $logger = $this->createMock(LoggerInterface::class);

        $notifier = new OrderNotifier($mailer, $logger);
        $order = new Order();
        $order->setEmail('client@example.com');

        // Si le code lève une exception, le test échoue
        $notifier->notify($order);

        static::assertTrue(true); // Pas de vérification d'interaction ici
    }
}
```

**Résultat attendu** :

```text
PHPUnit 11.x by Sebastian Bergmann and contributors.

.                                                                   1 / 1 (100%)

Time: 00:00.003, Memory: 8.00 MB

OK (1 test, 1 assertion)
```

---

### Étape 3 : Vérifier qu'une méthode est appelée

Tu vas créer un mock qui vérifie le nombre exact d'appels à `send()`. PHPUnit fournit plusieurs matchers d'invocation.

Code complet avec quatre exemples :

```php
<?php

namespace App\Tests\Service;

use App\Entity\Order;
use App\Service\LoggerInterface;
use App\Service\MailerInterface;
use App\Service\OrderNotifier;
use PHPUnit\Framework\TestCase;

final class OrderNotifierCallCountTest extends TestCase
{
    public function testNotifySendsExactlyOneEmail(): void
    {
        $mailer = $this->createMock(MailerInterface::class);
        $logger = $this->createMock(LoggerInterface::class);

        // Attente : send doit être appelée exactement une fois
        $mailer->expects(static::once())
            ->method('send')
            ->willReturn(true);

        $notifier = new OrderNotifier($mailer, $logger);
        $order = new Order();
        $order->setEmail('client@example.com');

        $notifier->notify($order);
    }

    public function testNotifyNeverSendsEmailWhenOrderHasNoEmail(): void
    {
        $mailer = $this->createMock(MailerInterface::class);
        $logger = $this->createMock(LoggerInterface::class);

        // Attente : send ne doit jamais être appelée
        $mailer->expects(static::never())
            ->method('send');

        $notifier = new OrderNotifier($mailer, $logger);
        $order = new Order(); // Pas d'email

        $notifier->notify($order);
    }

    public function testNotifyLogsTwoMessagesPerCall(): void
    {
        $mailer = $this->createMock(MailerInterface::class);
        $logger = $this->createMock(LoggerInterface::class);

        $mailer->method('send')->willReturn(true);

        // Attente : log doit être appelée exactement 2 fois
        // (une fois dans notify, une fois indirectement, selon ton code)
        $logger->expects(static::exactly(1))
            ->method('log');

        $notifier = new OrderNotifier($mailer, $logger);
        $order = new Order();
        $order->setEmail('client@example.com');

        $notifier->notify($order);
    }

    public function testNotifyLogsAtLeastOnce(): void
    {
        $mailer = $this->createMock(MailerInterface::class);
        $logger = $this->createMock(LoggerInterface::class);

        $mailer->method('send')->willReturn(true);

        // Attente : log doit être appelée au moins une fois
        $logger->expects(static::atLeastOnce())
            ->method('log');

        $notifier = new OrderNotifier($mailer, $logger);
        $order = new Order();
        $order->setEmail('client@example.com');

        $notifier->notify($order);
    }
}
```

**Matchers d'invocation principaux** :

| Matcher | Signification |
| --- | --- |
| `static::once()` | Exactement une fois |
| `static::never()` | Jamais |
| `static::exactly(N)` | Exactement N fois |
| `static::atLeastOnce()` | Au moins une fois |
| `static::atLeast(N)` | Au moins N fois |
| `static::atMost(N)` | Au plus N fois |
| `static::any()` | N'importe quel nombre (utile combiné avec `with`) |

**Résultat attendu** :

```text
PHPUnit 11.x by Sebastian Bergmann and contributors.

....                                                                4 / 4 (100%)

Time: 00:00.012, Memory: 8.00 MB

OK (4 tests, 4 assertions)
```

---

### Étape 4 : Contrôler les arguments avec with()

Tu vas ajouter une vérification sur les arguments passés à la méthode mockée. Cette étape utilise les contraintes PHPUnit (`equalTo`, `stringContains`, `isInstanceOf`, etc.).

Code complet :

```php
<?php

namespace App\Tests\Service;

use App\Entity\Order;
use App\Service\LoggerInterface;
use App\Service\MailerInterface;
use App\Service\OrderNotifier;
use PHPUnit\Framework\TestCase;

final class OrderNotifierArgumentsTest extends TestCase
{
    public function testNotifySendsEmailToTheCorrectAddress(): void
    {
        $mailer = $this->createMock(MailerInterface::class);
        $logger = $this->createMock(LoggerInterface::class);

        // Attente : send est appelée avec l'email exact et un sujet
        // contenant le mot "Confirmation"
        $mailer->expects(static::once())
            ->method('send')
            ->with(
                static::equalTo('client@example.com'),
                static::stringContains('Confirmation'),
                static::isType('string'),
            )
            ->willReturn(true);

        $notifier = new OrderNotifier($mailer, $logger);
        $order = new Order();
        $order->setEmail('client@example.com');

        $notifier->notify($order);
    }

    public function testNotifyAcceptsAnyValueForBody(): void
    {
        $mailer = $this->createMock(MailerInterface::class);
        $logger = $this->createMock(LoggerInterface::class);

        // On vérifie le destinataire, mais on accepte n'importe quel sujet et corps
        $mailer->expects(static::once())
            ->method('send')
            ->with(
                static::equalTo('client@example.com'),
                static::anything(),
                static::anything(),
            )
            ->willReturn(true);

        $notifier = new OrderNotifier($mailer, $logger);
        $order = new Order();
        $order->setEmail('client@example.com');

        $notifier->notify($order);
    }
}
```

**Contraintes d'argument courantes** :

| Contrainte | Vérification |
| --- | --- |
| `static::equalTo($v)` | Égalité (==) avec `$v` |
| `static::identicalTo($v)` | Identité stricte (===) avec `$v` |
| `static::stringContains($s)` | La chaîne contient `$s` |
| `static::isType('string')` | Le type correspond |
| `static::isInstanceOf(Class::class)` | L'argument est une instance de Class |
| `static::greaterThan($n)` | Strictement supérieur |
| `static::anything()` | N'importe quelle valeur acceptée |

**Résultat attendu** :

```text
PHPUnit 11.x by Sebastian Bergmann and contributors.

..                                                                  2 / 2 (100%)

Time: 00:00.006, Memory: 8.00 MB

OK (2 tests, 2 assertions)
```

---

### Étape 5 : Utiliser un fake (InMemoryRepository)

Tu vas écrire un fake repository qui stocke les données en mémoire et l'utiliser dans un test plutôt qu'un mock complexe.

Code complet du fake et du test :

```php
<?php

namespace App\Tests\Fake;

use App\Entity\User;
use App\Repository\UserRepositoryInterface;

// Fake : implémentation complète mais simplifiée du repository
final class InMemoryUserRepository implements UserRepositoryInterface
{
    /** @var array<int, User> */
    private array $users = [];

    private int $nextId = 1;

    public function save(User $user): void
    {
        // Si l'utilisateur n'a pas encore d'identifiant, on en attribue un
        if ($user->getId() === null) {
            $user->setId($this->nextId);
            $this->nextId++;
        }

        // On stocke par identifiant
        $this->users[$user->getId()] = $user;
    }

    public function find(int $id): ?User
    {
        // Récupération directe par clé
        return $this->users[$id] ?? null;
    }

    public function findByEmail(string $email): ?User
    {
        // Recherche linéaire, suffisante pour les tests
        foreach ($this->users as $user) {
            if ($user->getEmail() === $email) {
                return $user;
            }
        }

        return null;
    }

    public function count(): int
    {
        // Utilitaire pour les assertions de test
        return count($this->users);
    }
}
```

Utilisation dans plusieurs tests :

```php
<?php

namespace App\Tests\Service;

use App\Entity\User;
use App\Service\UserRegistration;
use App\Tests\Fake\InMemoryUserRepository;
use PHPUnit\Framework\TestCase;

final class UserRegistrationTest extends TestCase
{
    private InMemoryUserRepository $repository;
    private UserRegistration $registration;

    protected function setUp(): void
    {
        // Un fake neuf pour chaque test
        $this->repository = new InMemoryUserRepository();
        $this->registration = new UserRegistration($this->repository);
    }

    public function testRegisterStoresTheUser(): void
    {
        $this->registration->register('alice@example.com', 'secret');

        // Le fake garde la trace, on peut interroger l'état final
        static::assertSame(1, $this->repository->count());
        static::assertNotNull($this->repository->findByEmail('alice@example.com'));
    }

    public function testRegisterAttributesAnId(): void
    {
        $user = $this->registration->register('alice@example.com', 'secret');

        // Le fake simule l'auto-increment de la base
        static::assertNotNull($user->getId());
        static::assertSame(1, $user->getId());
    }

    public function testRegisterTwoUsersGivesDifferentIds(): void
    {
        $alice = $this->registration->register('alice@example.com', 'secret');
        $bob = $this->registration->register('bob@example.com', 'secret');

        // Comportement réaliste sans mock à reconfigurer
        static::assertNotSame($alice->getId(), $bob->getId());
    }
}
```

**Résultat attendu** :

```text
PHPUnit 11.x by Sebastian Bergmann and contributors.

...                                                                 3 / 3 (100%)

Time: 00:00.008, Memory: 8.00 MB

OK (3 tests, 5 assertions)
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `php bin/phpunit` | Lance toute la suite |
| `php bin/phpunit --filter testNomDuTest` | Lance un seul test |
| `$this->createMock(Class::class)` | Crée un test double avec toutes les méthodes mockées (renvoie null par défaut) |
| `$this->createStub(Interface::class)` | Crée un stub léger (PHPUnit 9+), interdit les assertions sur les appels |
| `$this->createPartialMock(Class::class, ['method1'])` | Mocke seulement certaines méthodes |
| `->method('x')->willReturn($v)` | Stub : renvoie `$v` |
| `->method('x')->willReturnCallback(fn ($a) => ...)` | Stub : logique dynamique |
| `->method('x')->willThrowException(new Exception())` | Stub : lance une exception |
| `->expects(static::once())` | Mock : exactement une fois |
| `->with(static::equalTo($v))` | Mock : argument attendu |

---

## Pièges Fréquents

### Piège 1 : Sur-mocker

⚠️ **Problème** : Tu mockes 8 dépendances pour tester un seul service. Chaque refactoring interne du service casse plusieurs tests, même quand le comportement observable n'a pas changé. Tu testes alors l'implémentation au lieu du comportement.

✅ **Solution** : Si un service a besoin de plus de 4 ou 5 dépendances pour fonctionner, c'est probablement le service qui devrait être découpé. Applique le principe de responsabilité unique : un service avec une seule responsabilité a peu de dépendances et est facile à tester.

```php
<?php

// ❌ Mauvais : 8 dépendances mockées, test fragile
$service = new OrderProcessor(
    $this->createMock(MailerInterface::class),
    $this->createMock(LoggerInterface::class),
    $this->createMock(PaymentGateway::class),
    $this->createMock(StockManager::class),
    $this->createMock(InvoiceGenerator::class),
    $this->createMock(NotificationService::class),
    $this->createMock(AnalyticsService::class),
    $this->createMock(CacheInterface::class),
);

// ✅ Bon : un service ciblé, 2 dépendances
$service = new OrderConfirmer(
    $this->createMock(MailerInterface::class),
    $this->createMock(LoggerInterface::class),
);
```

---

### Piège 2 : Mocker des classes finales ou des entités Doctrine

⚠️ **Problème** : PHPUnit ne peut pas générer de mock pour une classe déclarée `final` sans extension dédiée (`dg/bypass-finals` par exemple). Les entités Doctrine sont parfois marquées `final` et ne sont pas mockables. Tu essaies `createMock(MaClasseFinale::class)` et tu obtiens une erreur.

✅ **Solution** : Mocke des interfaces plutôt que des classes concrètes. Si tu dois absolument remplacer une classe finale, extrais une interface ou utilise un fake (sous-classe ou implémentation simplifiée). Évite l'extension `bypass-finals` qui contourne le système de types et masque les vrais problèmes de conception.

```php
<?php

// ❌ Mauvais : on essaie de mocker une classe finale
$gateway = $this->createMock(StripePaymentGateway::class);
// Erreur : Cannot mock final class

// ✅ Bon : on mocke l'interface
$gateway = $this->createMock(PaymentGatewayInterface::class);
```

---

### Piège 3 : Mocker la classe sous test

⚠️ **Problème** : Tu mockes le SUT (System Under Test) lui-même pour contrôler une de ses méthodes internes. Le test ne teste plus rien : il vérifie que ton mock renvoie ce que tu as configuré.

✅ **Solution** : On ne mocke jamais le SUT. On mocke ses dépendances. Si une méthode privée du SUT est complexe à tester, c'est probablement le signe qu'elle mérite d'être extraite dans un autre service, qui pourra alors être mocké de l'extérieur.

```php
<?php

// ❌ Mauvais : on mocke le service que l'on teste
$service = $this->createPartialMock(OrderProcessor::class, ['calculateTax']);
$service->method('calculateTax')->willReturn(20.0);
// On ne teste plus le vrai calcul, on teste notre propre mock

// ✅ Bon : on extrait le calcul dans un service séparé
$calculator = $this->createMock(TaxCalculator::class);
$calculator->method('calculate')->willReturn(20.0);
$service = new OrderProcessor($calculator);
```

---

### Piège 4 : Confondre stub et mock

⚠️ **Problème** : Tu mélanges `willReturn` et `expects` sur la même méthode sans comprendre les rôles distincts. Le test devient confus : on ne sait plus si l'intention est de fournir une valeur de retour ou de vérifier l'appel.

✅ **Solution** : Sépare clairement les deux usages. Un `method()->willReturn()` configure un retour (stub). Un `expects()->method()` ajoute une vérification d'appel (mock). On peut combiner les deux, mais la lecture doit rester claire : `expects(...)->method('x')->with(...)->willReturn(...)`.

```php
<?php

// ❌ Confus : intention mélangée
$mailer->method('send')->willReturn(true);
$mailer->expects(static::once())->method('send'); // Deux configurations sur la même méthode

// ✅ Clair : tout en une chaîne
$mailer->expects(static::once())
    ->method('send')
    ->with(static::equalTo('client@example.com'))
    ->willReturn(true);
```

---

### Piège 5 : Oublier l'ordre des appels

⚠️ **Problème** : Tu attends que `save()` soit appelée avant `commit()`, mais PHPUnit n'impose pas l'ordre par défaut. Le test passe même si l'ordre est inversé, ce qui masque un bug réel.

✅ **Solution** : Si l'ordre importe, utilise `InvocationOrder` ou des assertions explicites via un spy. Le plus simple est souvent de remplacer le mock par un fake (ou un spy) qui enregistre la séquence, puis de vérifier la séquence dans une assertion finale.

```php
<?php

// ❌ Mauvais : l'ordre n'est pas vérifié
$repository->expects(static::once())->method('save');
$repository->expects(static::once())->method('commit');
// Si commit() est appelée avant save(), le test passe quand même

// ✅ Bon : on utilise un spy avec une séquence explicite
$repositorySpy = new RepositorySpy();
$service->process();
static::assertSame(['save', 'commit'], $repositorySpy->callOrder);
```

---

## Checklist de Validation

- [ ] Je sais distinguer dummy, stub, fake, spy, mock
- [ ] Je sais créer un stub avec `createMock` et `willReturn`
- [ ] Je sais vérifier qu'une méthode est appelée avec `expects(static::once())`
- [ ] Je sais contrôler les arguments avec `with(static::equalTo())`
- [ ] Je sais quand utiliser un fake plutôt qu'un mock
- [ ] Je reconnais le piège de la sur-mockification
- [ ] Je n'écris pas d'assertion sur le SUT lui-même

---

## Exercice Pratique

**Énoncé** : Tu disposes d'un service `OrderProcessor` qui dépend d'un `PaymentGatewayInterface` et d'un `OrderRepositoryInterface`. Sa méthode `process(Order $order): bool` doit :

1. Sauvegarder la commande (`$repository->save($order)`)
2. Demander le paiement (`$gateway->charge($order->getTotal())`)
3. Marquer la commande comme `paid` si le paiement réussit, ou comme `failed` sinon
4. Sauvegarder à nouveau

**Indications** :

- Définis d'abord les interfaces `PaymentGatewayInterface` et `OrderRepositoryInterface` ainsi que la classe `Order` avec les méthodes `getTotal()`, `markAsPaid()`, `markAsFailed()` et `getStatus()`.
- Implémente `OrderProcessor::process()` en respectant exactement les quatre étapes ci-dessus.
- Écris deux tests dans `OrderProcessorTest` :
  1. `testProcessSavesPayAndUpdatesOrderWhenPaymentSucceeds` : utilise des mocks pour vérifier la séquence d'appels.
  2. `testProcessMarksOrderAsFailedWhenPaymentFails` : utilise des stubs qui simulent un échec de paiement.

**Résultat attendu** : Les deux tests passent. Le premier vérifie via `expects()` que `save()` est appelée deux fois et que `charge()` est appelée une fois avec le bon montant. Le second vérifie via `assertSame()` que le statut final de la commande est `failed` quand le paiement échoue.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Interfaces et entité** :

```php
<?php

namespace App\Service;

use App\Entity\Order;

interface PaymentGatewayInterface
{
    public function charge(float $amount): bool;
}

interface OrderRepositoryInterface
{
    public function save(Order $order): void;
}
```

```php
<?php

namespace App\Entity;

final class Order
{
    private string $status = 'pending';

    public function __construct(
        private float $total,
    ) {
    }

    public function getTotal(): float
    {
        return $this->total;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function markAsPaid(): void
    {
        // On passe au statut payé
        $this->status = 'paid';
    }

    public function markAsFailed(): void
    {
        // On passe au statut échec
        $this->status = 'failed';
    }
}
```

**Implémentation du service** :

```php
<?php

namespace App\Service;

use App\Entity\Order;

final class OrderProcessor
{
    public function __construct(
        private OrderRepositoryInterface $repository,
        private PaymentGatewayInterface $gateway,
    ) {
    }

    public function process(Order $order): bool
    {
        // Étape 1 : sauvegarde initiale
        $this->repository->save($order);

        // Étape 2 : tentative de paiement
        $success = $this->gateway->charge($order->getTotal());

        // Étape 3 : mise à jour du statut
        if ($success) {
            $order->markAsPaid();
        } else {
            $order->markAsFailed();
        }

        // Étape 4 : sauvegarde finale
        $this->repository->save($order);

        return $success;
    }
}
```

**Test 1 : paiement réussi (mocks pour vérifier la séquence)** :

```php
<?php

namespace App\Tests\Service;

use App\Entity\Order;
use App\Service\OrderProcessor;
use App\Service\OrderRepositoryInterface;
use App\Service\PaymentGatewayInterface;
use PHPUnit\Framework\TestCase;

final class OrderProcessorTest extends TestCase
{
    public function testProcessSavesPayAndUpdatesOrderWhenPaymentSucceeds(): void
    {
        // Mock du repository : on attend exactement 2 appels à save()
        $repository = $this->createMock(OrderRepositoryInterface::class);
        $repository->expects(static::exactly(2))
            ->method('save')
            ->with(static::isInstanceOf(Order::class));

        // Mock du gateway : on attend exactement 1 appel à charge()
        // avec le montant exact de la commande
        $gateway = $this->createMock(PaymentGatewayInterface::class);
        $gateway->expects(static::once())
            ->method('charge')
            ->with(static::equalTo(150.00))
            ->willReturn(true);

        $processor = new OrderProcessor($repository, $gateway);
        $order = new Order(150.00);

        $result = $processor->process($order);

        // Vérifications finales sur l'état observable
        static::assertTrue($result);
        static::assertSame('paid', $order->getStatus());
    }

    public function testProcessMarksOrderAsFailedWhenPaymentFails(): void
    {
        // Stub du repository : on n'impose pas de nombre d'appels,
        // on accepte que save() soit appelée plusieurs fois
        $repository = $this->createMock(OrderRepositoryInterface::class);

        // Stub du gateway : on force charge() à renvoyer false
        $gateway = $this->createMock(PaymentGatewayInterface::class);
        $gateway->method('charge')->willReturn(false);

        $processor = new OrderProcessor($repository, $gateway);
        $order = new Order(75.00);

        $result = $processor->process($order);

        // Vérifications sur le comportement attendu en cas d'échec
        static::assertFalse($result);
        static::assertSame('failed', $order->getStatus());
    }
}
```

**Résultat attendu de l'exécution** :

```text
PHPUnit 11.x by Sebastian Bergmann and contributors.

..                                                                  2 / 2 (100%)

Time: 00:00.009, Memory: 8.00 MB

OK (2 tests, 6 assertions)
```

**Points clés de la solution** :

1. Le premier test utilise `expects(static::exactly(2))` et `expects(static::once())` pour imposer une séquence d'appels précise.
2. Le second test n'utilise que `method()->willReturn(false)` parce qu'il s'intéresse au comportement de la commande, pas aux interactions.
3. Les deux tests vérifient l'état final via `assertSame()` sur `getStatus()`, ce qui rend le test moins couplé à l'implémentation interne.

---

## Navigation

← Fiche précédente : **[Stratégie de test en équipe](11-strategie-test-equipe.md)**

→ Fiche suivante : **[Réflexion pour les tests](13-reflection-tests.md)**
