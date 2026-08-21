---
tags:
  - Symfony
  - Workflow
  - Avancé
description: "Composant Workflow et State Machine de Symfony : modéliser des transitions d'état, configurer les places et les transitions, déclencher des actions sur les événements de workflow."
estimated_time: "75 min"
fiche_number: 18
total_fiches: 21
cursus: "Symfony"
id: "web.symfony.workflow-state-machine"
course_id: "web.symfony"
content_type: "lesson"
order: 18
---

# 18 - Workflow et state machine

> **En bref** : Modéliser le cycle de vie d'une entité (commande, article, demande) avec le composant Workflow de Symfony. Configurer les états, les transitions, et déclencher des actions automatiques quand l'état change. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche **[05 - Créer des entités](05-creer-entites.md)**
- Avoir lu la fiche **[13 - Services et injection de dépendances](13-services-injection-dependances.md)**
- Avoir lu la fiche **[14 - Événements et listeners](14-evenements-listeners.md)**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras configurer un workflow Symfony en YAML, appliquer une transition sur une entité, écouter les événements de workflow, et choisir entre `workflow` et `state_machine` selon le besoin métier.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un workflow ?

**Définition** : Un workflow est une machine d'états formelle qui modélise le cycle de vie d'une entité métier. Il définit explicitement les états possibles (places) et les transitions autorisées entre ces états.

**Le problème que le workflow résout** :

Sans formalisation par un workflow, voici les problèmes rencontrés :

1. **Logique dispersée** : les changements d'état sont disséminés dans le code (contrôleurs, services, listeners), sans vue d'ensemble.
2. **Transitions aberrantes** : rien n'empêche de passer une commande de l'état `livrée` directement à `panier`, ce qui n'a aucun sens métier.
3. **Audit difficile** : aucun moyen simple de répondre à la question "quels états une commande peut-elle prendre, et comment ?".

**Comment le workflow résout ces problèmes** :

| Problème | Solution apportée par le workflow |
| --- | --- |
| Logique dispersée | Toutes les transitions sont déclarées dans un seul fichier de configuration |
| Transitions aberrantes | Une transition non déclarée est rejetée automatiquement |
| Audit difficile | La commande `workflow:dump` génère un diagramme visuel des états |

**Analogie concrète** : Pense à un feu tricolore. Il a trois états (rouge, orange, vert) et des règles strictes de transition (rouge vers vert, vert vers orange, orange vers rouge). Aucun feu ne passe directement de rouge à orange. Le workflow Symfony fonctionne pareil : il définit les états possibles et les chemins autorisés entre ces états.

**Ce qu'un workflow n'est PAS** :

- Un workflow n'est pas un simple champ `status` en base de données. Un champ `status` stocke l'état courant, mais ne définit aucune règle de transition. Le workflow ajoute la logique de validation des changements d'état.
- Un workflow n'est pas un système de tâches asynchrones. **[Symfony Messenger](19-messenger.md)** gère les tâches en arrière-plan. Le workflow gère les états d'une entité. Les deux peuvent se combiner, mais ne remplissent pas le même rôle.

---

### Workflow vs state machine

**Définition** : Le composant Symfony propose deux types de machines : `workflow` et `state_machine`. La différence centrale tient au nombre de places actives autorisées en même temps.

**Le problème que cette distinction résout** :

Certains processus métier sont strictement linéaires (une commande passe d'un état à un autre, jamais deux à la fois). D'autres processus impliquent plusieurs validations parallèles (validation juridique ET validation financière qui avancent indépendamment). Choisir le bon type évite de bricoler des contournements.

**Comparaison workflow vs state machine** :

| Caractéristique | workflow | state_machine |
| --- | --- | --- |
| Places actives simultanées | Plusieurs | Une seule |
| Cas d'usage type | Validation parallèle (juridique ET financière) | Cycle de vie linéaire (commande) |
| Type de transition | Peut nécessiter plusieurs places en entrée | Une seule place en entrée par transition |
| Représentation interne | Tableau des places actives | Chaîne unique de l'état courant |

**Analogie concrète** : Un `state_machine` ressemble à un seul curseur sur une ligne du temps : il occupe une seule position. Un `workflow` ressemble à plusieurs jetons posés sur un plateau de jeu : plusieurs cases peuvent être occupées en même temps. Si ton processus n'a qu'un seul état actif à la fois, choisis le `state_machine`.

**Ce que cette distinction n'est PAS** :

- Ce n'est pas une question de performance. Les deux types sont équivalents en performance.
- Ce n'est pas réversible facilement. Changer de type plus tard implique de migrer les données et la configuration. Choisis bien dès le départ.

---

### Places et transitions

**Définition** : Une **place** est un état possible de l'entité. Une **transition** est une règle qui permet de passer d'une ou plusieurs places vers une autre. Ensemble, places et transitions forment le graphe complet du workflow.

**Le problème que la modélisation places/transitions résout** :

1. **Vocabulaire flou** : sans terminologie précise, on parle de "statut", "état", "phase", sans accord clair.
2. **Règles implicites** : si les transitions ne sont pas listées, personne ne sait précisément ce qui est autorisé.
3. **Modifications risquées** : ajouter un nouvel état au système devient une chasse aux endroits où l'ancien état est testé.

**Comment places et transitions résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Vocabulaire flou | Places et transitions sont des termes standards du composant |
| Règles implicites | Toutes les transitions sont listées dans la configuration |
| Modifications risquées | Ajouter une place ou une transition se fait dans un seul fichier |

**Analogie concrète** : Pense à un jeu de plateau. Les cases du plateau sont les places. Les flèches qui relient les cases sont les transitions. Tu ne peux pas sauter d'une case à une autre sans flèche entre elles. Si tu veux ajouter une nouvelle case, tu dois aussi tracer les flèches d'entrée et de sortie.

**Exemple concret de places et transitions pour une commande** :

| Place | Description |
| --- | --- |
| `cart` | Le client remplit son panier |
| `paid` | Le paiement a été validé |
| `shipped` | La commande a été expédiée |
| `delivered` | La commande a été livrée |
| `cancelled` | La commande a été annulée |

| Transition | De | Vers |
| --- | --- | --- |
| `pay` | cart | paid |
| `ship` | paid | shipped |
| `deliver` | shipped | delivered |
| `cancel` | cart ou paid | cancelled |

**Ce que places et transitions ne sont PAS** :

- Une place n'est pas un objet métier. C'est juste un identifiant textuel d'un état.
- Une transition n'est pas une fonction PHP. C'est une règle de passage. La logique métier associée (envoi d'email, mise à jour de stock) est implémentée dans des listeners.

---

### Marking store

**Définition** : Le marking store est le mécanisme qui décide où Symfony stocke l'état actif de l'entité. C'est le pont entre le workflow et l'entité.

**Le problème que le marking store résout** :

L'entité doit stocker quelque part l'état dans lequel elle se trouve. Sans marking store, Symfony ne saurait pas où lire ni où écrire cet état.

**Trois options principales** :

| Type | Stockage de l'état | Cas d'usage |
| --- | --- | --- |
| `method` | Via un getter et un setter de l'entité | Recommandé, le plus courant |
| `property` | Directement dans une propriété publique | Rapide à mettre en place, moins flexible |
| Store externe | Service personnalisé (Redis, autre service) | Cas avancés où l'état est partagé entre systèmes |

**Exemple de configuration YAML** :

```yaml
marking_store:
    type: 'method'
    property: 'status'
```

Cette configuration indique : "pour lire l'état, appelle `$entity->getStatus()` ; pour l'écrire, appelle `$entity->setStatus(...)`".

**Analogie concrète** : Le marking store est comme l'adresse d'une boîte aux lettres. Symfony doit savoir où déposer le courrier (l'état) et où le récupérer. Sans adresse, le courrier ne va nulle part.

**Ce que le marking store n'est PAS** :

- Ce n'est pas une base de données séparée. Avec `type: method`, l'état est stocké dans l'entité elle-même, donc dans la même table que les autres données.
- Ce n'est pas configurable par transition. Tu choisis un seul marking store pour tout le workflow.

---

### Workflow permissif vs strict

**Définition** : Un workflow **strict** n'autorise que les transitions strictement nécessaires au processus métier. Un workflow **permissif** autorise des transitions supplémentaires de réversibilité ou de correction.

**Le problème que cette distinction résout** :

Un workflow trop strict peut bloquer un cas légitime non prévu. Un workflow trop permissif peut autoriser des transitions aberrantes. Le bon équilibre dépend du métier.

**Comparaison permissif vs strict** :

| Workflow permissif | Workflow strict |
| --- | --- |
| Un humain peut corriger une erreur de statut | Le code garantit l'intégrité métier |
| Risque de transition aberrante | Risque de blocage si un cas légitime n'a pas été prévu |
| Adapté aux processus humains révisables | Adapté aux processus automatisés normés |
| Exemple : remettre une commande livrée en `shipped` si erreur de livraison | Exemple : interdire de remettre une commande payée en `cart` |

**Analogie concrète** : Pense à une porte. Une porte stricte (à sens unique) garantit que personne ne revient en arrière. Une porte permissive (battante) permet à un employé de corriger une erreur. Ton choix dépend du contexte : un guichet de sortie d'aéroport est strict, une porte de cuisine de restaurant est permissive.

**Ce que cette distinction n'est PAS** :

- Ce n'est pas une option binaire dans la configuration. Tu modélises le caractère permissif en ajoutant ou non des transitions de retour.
- Ce n'est pas une décision technique. C'est une décision métier qui doit être documentée et validée par le responsable du processus.

---

## Étapes Pratiques

### Étape 1 : Installer le composant

Le composant Workflow n'est pas inclus par défaut. Installe-le avec Composer.

Commande :

```bash
composer require symfony/workflow
```

**Résultat attendu** :

```text
Using version ^7.4 for symfony/workflow
./composer.json has been updated
Running composer update symfony/workflow
Package operations: 1 install, 0 updates, 0 removals
  - Installing symfony/workflow (v7.4.0)
```

---

### Étape 2 : Configurer un workflow simple (commande)

Crée le fichier `config/packages/workflow.yaml` :

```yaml
framework:
    workflows:
        order_lifecycle:
            type: 'state_machine'
            marking_store:
                type: 'method'
                property: 'status'
            supports:
                - App\Entity\Order
            initial_marking: 'cart'
            places:
                - cart
                - paid
                - shipped
                - delivered
                - cancelled
            transitions:
                pay:
                    from: cart
                    to: paid
                ship:
                    from: paid
                    to: shipped
                deliver:
                    from: shipped
                    to: delivered
                cancel:
                    from: [cart, paid]
                    to: cancelled
```

Côté entité, déclare une propriété `$status` avec son getter et son setter.

```php
<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Order
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    // Initialisée à 'cart' pour correspondre à initial_marking
    #[ORM\Column(length: 20)]
    private string $status = 'cart';

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    // Setter requis par le marking_store de type 'method'
    // Symfony passe toujours un 2e argument $context (PHP 8 refuse un extra argument)
    public function setStatus(string $status, array $context = []): void
    {
        $this->status = $status;
    }
}
```

**Résultat attendu** : le workflow `order_lifecycle` est enregistré et disponible pour injection.

---

### Étape 3 : Appliquer une transition

Le workflow s'injecte par son nom en camelCase suivi d'un suffixe égal au `type` déclaré : `Workflow` pour un `type: workflow`, `StateMachine` pour un `type: state_machine`. Ici `order_lifecycle` est un `state_machine`, donc le nom d'injection est `$orderLifecycleStateMachine`.

```php
<?php

namespace App\Controller;

use App\Entity\Order;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Workflow\WorkflowInterface;

final class OrderController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {
    }

    #[Route('/order/{id}/pay', name: 'order_pay', methods: ['POST'])]
    public function pay(
        Order $order,
        WorkflowInterface $orderLifecycleStateMachine,
    ): Response {
        // Vérifie si la transition est applicable depuis l'état actuel
        if (!$orderLifecycleStateMachine->can($order, 'pay')) {
            throw new \DomainException(
                'Transition pay impossible depuis ' . $order->getStatus(),
            );
        }

        // Applique la transition (modifie l'entité en mémoire)
        $orderLifecycleStateMachine->apply($order, 'pay');

        // Persiste le changement en base
        $this->em->flush();

        return $this->redirectToRoute('order_show', ['id' => $order->getId()]);
    }
}
```

**Résultat attendu** :

```text
Avant l'appel : $order->getStatus() == 'cart'
Après l'appel : $order->getStatus() == 'paid'
```

---

### Étape 4 : Écouter les événements de transition

Le workflow émet plusieurs événements pendant chaque transition. Tu peux les écouter pour ajouter de la logique métier.

**Principaux événements émis** (dans l'ordre) :

| Événement | Quand | Usage typique |
| --- | --- | --- |
| `workflow.[name].guard` | Avant la transition (peut la bloquer) | Vérifier une autorisation |
| `workflow.[name].leave` | À la sortie d'une place | Logguer la sortie |
| `workflow.[name].transition` | Pendant la transition | Logique métier (envoi d'email) |
| `workflow.[name].enter` | À l'entrée d'une place | Préparer la nouvelle place |
| `workflow.[name].entered` | Après l'entrée d'une place | Notifier d'autres systèmes |
| `workflow.[name].completed` | Après commit complet de la transition | Hook général |

Exemple d'écoute via l'attribut `#[AsEventListener]` :

```php
<?php

namespace App\Listener;

use App\Entity\Order;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Workflow\Event\Event;

// Écoute uniquement l'entrée dans la place 'paid' du workflow order_lifecycle
#[AsEventListener(event: 'workflow.order_lifecycle.entered.paid')]
final class SendPaymentReceiptListener
{
    public function __construct(
        private MailerInterface $mailer,
    ) {
    }

    public function __invoke(Event $event): void
    {
        // Récupère l'entité concernée par la transition
        /** @var Order $order */
        $order = $event->getSubject();

        // Prépare et envoie le reçu de paiement
        $email = (new Email())
            ->to('client@exemple.test')
            ->subject('Votre paiement a été confirmé')
            ->text('Merci pour votre commande numéro ' . $order->getId());

        $this->mailer->send($email);
    }
}
```

**Résultat attendu** : à chaque fois qu'une commande entre dans l'état `paid`, le reçu est envoyé automatiquement, sans modifier le contrôleur.

---

### Étape 5 : Lister les transitions disponibles depuis l'état courant

Pour générer dynamiquement des boutons d'action dans une vue d'administration, tu as besoin de connaître les transitions applicables à un instant donné.

```php
<?php

namespace App\Service;

use App\Entity\Order;
use Symfony\Component\Workflow\WorkflowInterface;

final class OrderActionsService
{
    public function __construct(
        private WorkflowInterface $orderLifecycleStateMachine,
    ) {
    }

    /**
     * @return string[] Les noms des transitions applicables
     */
    public function getAvailableActions(Order $order): array
    {
        // getEnabledTransitions renvoie un tableau d'objets Transition
        $transitions = $this->orderLifecycleStateMachine->getEnabledTransitions($order);

        // On extrait uniquement les noms pour les passer au template
        return array_map(
            fn ($transition) => $transition->getName(),
            $transitions,
        );
    }
}
```

**Résultat attendu** :

```text
Pour une commande à l'état 'paid' :
  Actions disponibles : ['ship', 'cancel']

Pour une commande à l'état 'delivered' :
  Actions disponibles : []
```

---

### Étape 6 : Bloquer une transition avec un guard

Un guard est un événement spécial qui peut annuler une transition avant qu'elle ne se produise.

```php
<?php

namespace App\Listener;

use App\Entity\Order;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\Workflow\Event\GuardEvent;

// Ce listener s'active avant chaque tentative de transition 'ship'
#[AsEventListener(event: 'workflow.order_lifecycle.guard.ship')]
final class StockGuardListener
{
    public function __invoke(GuardEvent $event): void
    {
        /** @var Order $order */
        $order = $event->getSubject();

        // Si le stock est insuffisant, on bloque la transition
        // et on attache un message expliquant le blocage
        if (!$order->hasAllItemsInStock()) {
            $event->setBlocked(true, 'Stock insuffisant pour expédier');
        }
    }
}
```

**Résultat attendu** :

```text
Si $order->hasAllItemsInStock() retourne false :
  $orderLifecycleStateMachine->can($order, 'ship') retourne false
  $orderLifecycleStateMachine->apply($order, 'ship') lève une exception
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `composer require symfony/workflow` | Installer le composant Workflow |
| `php bin/console workflow:dump order_lifecycle \| dot -Tpng -o workflow.png` | Générer un diagramme visuel (nécessite Graphviz) |
| `$workflow->can($subject, $transition)` | Vérifier si une transition est applicable |
| `$workflow->apply($subject, $transition)` | Appliquer une transition |
| `$workflow->getEnabledTransitions($subject)` | Lister les transitions disponibles |
| `$workflow->getMarking($subject)` | Obtenir l'état actuel sous forme d'objet Marking |
| `php bin/console debug:container --tag=workflow` | Lister tous les workflows enregistrés |

---

## Pièges Fréquents

### Piège 1 : Confondre workflow et state_machine

⚠️ **Problème** : Utiliser `workflow` pour un cycle linéaire complique inutilement la configuration. Utiliser `state_machine` pour un cas parallèle empêche d'avoir deux places actives en même temps.

✅ **Solution** : Pose-toi la question "mon entité peut-elle être dans plusieurs états en même temps ?" Si non, choisis `state_machine`. Si oui, choisis `workflow`. Le bon choix dépend du métier, pas d'une préférence technique.

---

### Piège 2 : Marking store sur une propriété sans setter

⚠️ **Problème** : Avec `type: method` et `property: status`, Symfony attend un getter `getStatus()` et un setter `setStatus()`. Le `MethodMarkingStore` appelle `setStatus($places, $context)` avec **deux** arguments. Un setter qui n'accepte qu'un argument lève `ArgumentCountError` en PHP 8.

✅ **Solution** : Déclare `setStatus(string $status, array $context = []): void`. Le second paramètre peut rester inutilisé. Si tu préfères ne pas exposer de setter public, utilise un setter dédié comme `setMarking()` et configure le marking store en conséquence.

```php
<?php

class Order
{
    private string $status = 'cart';

    public function getStatus(): string
    {
        return $this->status;
    }

    // Sans ce setter (avec $context), le workflow ne peut pas appliquer de transition
    public function setStatus(string $status, array $context = []): void
    {
        $this->status = $status;
    }
}
```

---

### Piège 3 : Mettre la logique métier dans le contrôleur

⚠️ **Problème** : Un contrôleur qui appelle `apply` et qui envoie aussi un email perd la séparation des responsabilités. Si tu ajoutes une autre source de transition (commande console, API), tu dois dupliquer la logique d'envoi d'email.

✅ **Solution** : Implémente la logique métier (email, mise à jour de stock, notification) dans des listeners d'événements. Le contrôleur ne fait que déclencher la transition. Tous les effets se déclenchent automatiquement, quelle que soit l'origine de la transition.

---

### Piège 4 : Workflow permissif sans contrôle

⚠️ **Problème** : Autoriser toutes les transitions dans tous les sens peut être intentionnel pour permettre des corrections humaines. Mais sans documentation, c'est une dette technique : personne ne saura si une transition aberrante est volontaire ou un bug.

✅ **Solution** : Documente chaque transition de retour dans un commentaire YAML ou dans un fichier de documentation associé. Précise pourquoi cette réversibilité est métier (correction d'erreur, processus humain révisable).

---

### Piège 5 : Oublier de flush après apply

⚠️ **Problème** : `apply` modifie l'entité en mémoire via le marking store. Mais sans `$em->flush()`, le changement n'est jamais persisté en base. Au prochain chargement de l'entité, l'ancien état réapparaît.

✅ **Solution** : Après chaque `apply`, appelle `$em->flush()` pour persister le changement. Si tu utilises plusieurs transitions à la suite, tu peux faire un seul `flush()` à la fin.

```php
<?php

$orderLifecycleStateMachine->apply($order, 'pay');
$this->em->flush(); // Sans cette ligne, le changement est perdu
```

---

## Checklist de Validation

- [ ] J'ai installé le composant `symfony/workflow`
- [ ] Je sais configurer un workflow YAML avec places et transitions
- [ ] Je sais appliquer une transition depuis un contrôleur ou un service
- [ ] Je sais écouter les événements de workflow (guard, transition, entered)
- [ ] Je distingue `workflow` et `state_machine` et je sais lequel choisir
- [ ] Je sais générer un diagramme du workflow avec `workflow:dump`
- [ ] Je comprends quand un workflow doit être permissif et quand il doit être strict
- [ ] Je sais bloquer une transition avec un guard listener

---

## Exercice Pratique

**Énoncé** : Modélise le cycle de vie d'une demande de congé (`LeaveRequest`) en utilisant un `state_machine`.

**États à modéliser** :

- `draft` : la demande est en cours de rédaction
- `submitted` : la demande a été envoyée au manager
- `approved` : la demande a été acceptée
- `rejected` : la demande a été refusée
- `cancelled` : la demande a été annulée par le salarié

**Transitions à modéliser** :

| Transition | De | Vers |
| --- | --- | --- |
| `submit` | draft | submitted |
| `approve` | submitted | approved |
| `reject` | submitted | rejected |
| `cancel` | draft, submitted, approved | cancelled |

**Indications** :

- Configure le `state_machine` dans `config/packages/workflow.yaml`
- Crée un guard listener qui bloque `approve` si la propriété `$balance` du salarié associé est négative
- Crée un listener `entered.submitted` qui envoie un email au manager (le contenu de l'email peut être un simple texte)
- L'entité `LeaveRequest` doit exposer `getStatus()` et `setStatus()`

**Résultat attendu** : Un workflow fonctionnel où une demande de congé suit un cycle de vie strict, où l'approbation est bloquée si le solde est insuffisant, et où le manager est notifié automatiquement à chaque soumission.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1 : Configuration YAML**

```yaml
# config/packages/workflow.yaml
framework:
    workflows:
        leave_request_lifecycle:
            type: 'state_machine'
            marking_store:
                type: 'method'
                property: 'status'
            supports:
                - App\Entity\LeaveRequest
            initial_marking: 'draft'
            places:
                - draft
                - submitted
                - approved
                - rejected
                - cancelled
            transitions:
                submit:
                    from: draft
                    to: submitted
                approve:
                    from: submitted
                    to: approved
                reject:
                    from: submitted
                    to: rejected
                cancel:
                    from: [draft, submitted, approved]
                    to: cancelled
```

**Étape 2 : Entité LeaveRequest**

```php
<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class LeaveRequest
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    // Initialisé à 'draft' pour correspondre à initial_marking
    #[ORM\Column(length: 20)]
    private string $status = 'draft';

    // Lien vers le salarié associé à la demande
    #[ORM\ManyToOne]
    private ?Employee $employee = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status, array $context = []): void
    {
        $this->status = $status;
    }

    public function getEmployee(): ?Employee
    {
        return $this->employee;
    }

    public function setEmployee(?Employee $employee): void
    {
        $this->employee = $employee;
    }
}
```

**Étape 3 : Guard listener (blocage si solde négatif)**

```php
<?php

namespace App\Listener;

use App\Entity\LeaveRequest;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\Workflow\Event\GuardEvent;

// Ce listener s'active avant chaque tentative d'approbation
#[AsEventListener(event: 'workflow.leave_request_lifecycle.guard.approve')]
final class LeaveBalanceGuardListener
{
    public function __invoke(GuardEvent $event): void
    {
        /** @var LeaveRequest $request */
        $request = $event->getSubject();
        $employee = $request->getEmployee();

        // Si le solde est négatif, on bloque l'approbation
        // avec un message explicite pour l'utilisateur
        if ($employee !== null && $employee->getBalance() < 0) {
            $event->setBlocked(
                true,
                'Solde de congés négatif : approbation impossible',
            );
        }
    }
}
```

**Étape 4 : Listener de notification du manager**

```php
<?php

namespace App\Listener;

use App\Entity\LeaveRequest;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Workflow\Event\Event;

// Ce listener s'active à chaque entrée dans la place 'submitted'
#[AsEventListener(event: 'workflow.leave_request_lifecycle.entered.submitted')]
final class NotifyManagerOnSubmitListener
{
    public function __construct(
        private MailerInterface $mailer,
    ) {
    }

    public function __invoke(Event $event): void
    {
        /** @var LeaveRequest $request */
        $request = $event->getSubject();
        $employee = $request->getEmployee();

        // Préparation de l'email destiné au manager
        $email = (new Email())
            ->to('manager@entreprise.test')
            ->subject('Nouvelle demande de congé à valider')
            ->text(sprintf(
                'Demande numéro %d de %s à valider.',
                $request->getId(),
                $employee?->getName() ?? 'salarié inconnu',
            ));

        $this->mailer->send($email);
    }
}
```

**Étape 5 : Contrôleur exemple**

```php
<?php

namespace App\Controller;

use App\Entity\LeaveRequest;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Workflow\WorkflowInterface;

final class LeaveRequestController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {
    }

    #[Route('/leave/{id}/submit', name: 'leave_submit', methods: ['POST'])]
    public function submit(
        LeaveRequest $request,
        WorkflowInterface $leaveRequestLifecycleStateMachine,
    ): Response {
        if (!$leaveRequestLifecycleStateMachine->can($request, 'submit')) {
            throw new \DomainException('Transition submit impossible');
        }

        $leaveRequestLifecycleStateMachine->apply($request, 'submit');
        $this->em->flush();

        return $this->redirectToRoute('leave_show', ['id' => $request->getId()]);
    }

    #[Route('/leave/{id}/approve', name: 'leave_approve', methods: ['POST'])]
    public function approve(
        LeaveRequest $request,
        WorkflowInterface $leaveRequestLifecycleStateMachine,
    ): Response {
        // Si le guard bloque l'approbation, can() retourne false
        if (!$leaveRequestLifecycleStateMachine->can($request, 'approve')) {
            throw new \DomainException(
                'Approbation impossible (vérifie le solde de congés)',
            );
        }

        $leaveRequestLifecycleStateMachine->apply($request, 'approve');
        $this->em->flush();

        return $this->redirectToRoute('leave_show', ['id' => $request->getId()]);
    }
}
```

**Vérification du comportement** :

```text
Cas 1 : salarié avec solde positif
  - submit : draft -> submitted (email envoyé au manager)
  - approve : submitted -> approved (autorisé)

Cas 2 : salarié avec solde négatif
  - submit : draft -> submitted (email envoyé au manager)
  - approve : submitted -> approved (BLOQUÉ par le guard)
  - reject : submitted -> rejected (toujours autorisé)
```

---

## Navigation

← Fiche précédente : **[Tests fonctionnels](17-tests-fonctionnels.md)**

→ Fiche suivante : **[Symfony Messenger (messages asynchrones)](19-messenger.md)**
