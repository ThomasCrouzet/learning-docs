---
tags:
  - Architecture
  - Intermédiaire
  - Pratique
description: "Patterns de comportement : Strategy, Observer, Command, Template Method et State avec exemples PHP, JS et Symfony."
estimated_time: "90 min"
fiche_number: 6
total_fiches: 17
cursus: "Architecture et Design Patterns"
---

# 06 - Patterns de comportement

> **En bref** : Comprendre et implémenter les patterns Strategy, Observer, Command, Template Method et State en PHP et JavaScript, avec des exemples concrets dans Symfony. Lecture estimée : 90 min.

## Prérequis

- Fiche 1 : [Introduction aux design patterns](01-introduction-design-patterns.md)
- Fiche 2 : [SOLID - Principes fondamentaux](02-solid-principes.md)
- Fiche 4 : [Patterns de création](04-patterns-creation.md)
- Fiche 5 : [Patterns de structure](05-patterns-structure.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras implémenter les 5 principaux patterns de comportement, expliquer quand utiliser chacun et reconnaître leurs usages dans Symfony.

---

## Concepts

### Qu'est-ce qu'un pattern de comportement ?

**Définition** : Un pattern de comportement contrôle la manière dont les objets communiquent entre eux et répartissent les responsabilités. Ces patterns définissent des protocoles de communication flexibles.

**Le problème que les patterns de comportement résolvent** :

Sans patterns de comportement, voici les problèmes rencontrés :

1. **Couplage entre objets** : un objet doit connaître les détails internes d'un autre pour communiquer avec lui.
2. **Algorithme figé** : la logique est codée en dur, impossible de la changer à l'exécution.
3. **Communication en étoile** : chaque objet communique directement avec tous les autres, créant un réseau complexe.

**Comment les patterns de comportement résolvent ces problèmes** :

| Problème | Pattern | Solution |
| --- | --- | --- |
| Choix d'algorithme | Strategy | Interchanger les algorithmes à l'exécution |
| Notification d'événements | Observer | Un objet notifie plusieurs observateurs |
| Encapsulation d'actions | Command | Une action = un objet |
| Squelette d'algorithme | Template Method | Définir les étapes, laisser les détails aux sous-classes |
| Comportement selon l'état | State | Le comportement change quand l'état change |

**Analogie concrète** : Dans une entreprise, les patterns de comportement sont les procédures de communication. Strategy est le choix de la méthode de livraison (express, standard, gratuit). Observer est la mailing list interne (un email, tous les abonnés sont notifiés). Command est un bon de commande (l'action est écrite sur papier, elle peut être exécutée plus tard).
Template Method est le modèle de rapport (même structure, contenu différent). State est le feu tricolore (le comportement de la circulation change selon la couleur).

---

### Strategy

**Définition** : Le pattern Strategy définit une famille d'algorithmes, les encapsule chacun dans une classe et les rend interchangeables. Le client choisit l'algorithme à utiliser à l'exécution.

**Le problème que Strategy résout** :

Sans Strategy, voici les problèmes rencontrés :

1. **Switch/if grandissant** : chaque nouvel algorithme ajoute un cas dans un switch de plus en plus long.
2. **Code dupliqué** : la logique de sélection est répétée à plusieurs endroits.
3. **Tests difficiles** : tester un algorithme oblige à passer par la logique de sélection.

**Analogie concrète** : Pense à une application GPS. Pour aller d'un point A à un point B, tu peux choisir la stratégie : en voiture, à pied, en vélo, en transports en commun. Chaque stratégie calcule un itinéraire différent. Tu choisis la stratégie selon tes besoins, et l'application utilise celle que tu as sélectionnée.

**Structure du pattern** :

<div class="diagram-design">
<p><a href="../../diagrams/10-architecture-06-patterns-comportement-1.html">Strategy (HTML + SVG)</a></p>
<iframe src="../../diagrams/10-architecture-06-patterns-comportement-1.html" title="Strategy" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

Le Context delegue l'exécution a la Strategy active. On peut changer de stratégie a l'exécution sans modifier le Context.

**Implémentation en PHP** :

```php
<?php

// Interface Strategy : tous les algorithmes de calcul de prix
interface PricingStrategyInterface
{
    // Chaque strategie calcule un prix final
    public function calculate(float $basePrice, int $quantity): float;

    // Chaque strategie a un nom pour l'affichage
    public function getName(): string;
}

// Strategie 1 : prix normal (pas de remise)
class RegularPricing implements PricingStrategyInterface
{
    public function calculate(float $basePrice, int $quantity): float
    {
        // Calcul simple : prix unitaire x quantite
        return $basePrice * $quantity;
    }

    public function getName(): string
    {
        return 'Prix standard';
    }
}

// Strategie 2 : remise par volume
class VolumePricing implements PricingStrategyInterface
{
    public function calculate(float $basePrice, int $quantity): float
    {
        // Plus tu achetes, plus la remise est importante
        $discount = match (true) {
            $quantity >= 100 => 0.20, // 20% de remise a partir de 100
            $quantity >= 50 => 0.15,  // 15% a partir de 50
            $quantity >= 10 => 0.10,  // 10% a partir de 10
            default => 0,             // Pas de remise en dessous de 10
        };

        $total = $basePrice * $quantity;

        // On applique la remise au total
        return $total * (1 - $discount);
    }

    public function getName(): string
    {
        return 'Prix volume';
    }
}

// Strategie 3 : prix membre premium
class PremiumPricing implements PricingStrategyInterface
{
    public function calculate(float $basePrice, int $quantity): float
    {
        // Les membres premium ont toujours 25% de remise
        return ($basePrice * $quantity) * 0.75;
    }

    public function getName(): string
    {
        return 'Prix premium';
    }
}

// Le contexte : utilise la strategie sans connaitre les details
class ShoppingCart
{
    // La strategie est injectee (peut changer a l'execution)
    private PricingStrategyInterface $pricingStrategy;

    public function __construct()
    {
        // Strategie par defaut
        $this->pricingStrategy = new RegularPricing();
    }

    // On peut changer de strategie a tout moment
    public function setPricingStrategy(PricingStrategyInterface $strategy): void
    {
        $this->pricingStrategy = $strategy;
    }

    public function calculateTotal(float $unitPrice, int $quantity): float
    {
        // Le panier delegue le calcul a la strategie active
        return $this->pricingStrategy->calculate($unitPrice, $quantity);
    }
}

// Utilisation
$cart = new ShoppingCart();

// Prix normal
echo $cart->calculateTotal(10.00, 5); // 50.00

// On change de strategie en cours de route
$cart->setPricingStrategy(new VolumePricing());
echo $cart->calculateTotal(10.00, 50); // 425.00 (15% de remise)

$cart->setPricingStrategy(new PremiumPricing());
echo $cart->calculateTotal(10.00, 50); // 375.00 (25% de remise)
```

**Strategy dans Symfony : les Voters**

```php
<?php

// Les Voters de Symfony sont des strategies de securite
// Symfony choisit automatiquement le bon Voter selon le contexte

// Voter pour les articles
class ArticleVoter extends Voter
{
    // Strategie : seul l'auteur peut modifier son article
    protected function voteOnAttribute(
        string $attribute,
        mixed $subject,
        TokenInterface $token,
    ): bool {
        return $subject->getAuthor() === $token->getUser();
    }
}

// Voter pour les commentaires
class CommentVoter extends Voter
{
    // Strategie : l'auteur OU un moderateur peut supprimer un commentaire
    protected function voteOnAttribute(
        string $attribute,
        mixed $subject,
        TokenInterface $token,
    ): bool {
        $user = $token->getUser();
        return $subject->getAuthor() === $user
            || in_array('ROLE_MODERATOR', $user->getRoles());
    }
}
```

---

### Observer

**Définition** : Le pattern Observer définit une relation un-à-plusieurs entre objets : quand un objet change d'état, tous ses observateurs sont automatiquement notifiés.

**Le problème que Observer résout** :

Sans Observer, voici les problèmes rencontrés :

1. **Polling incessant** : les objets dépendants doivent vérifier régulièrement si l'objet source a changé.
2. **Couplage fort** : l'objet source doit connaître et appeler directement chaque objet dépendant.
3. **Ajout de réactions impossible** : pour réagir à un événement, on doit modifier l'objet qui émet l'événement.

**Analogie concrète** : Pense à un abonnement à une newsletter. Tu t'abonnes (tu deviens un observateur). Quand un nouvel article est publié (changement d'état), tous les abonnés reçoivent un email (notification). Tu peux te désabonner à tout moment sans que le journal change quoi que ce soit.

**Comparaison Observer vs polling** :

| Polling (vérifier régulièrement) | Observer (être notifié) |
| --- | --- |
| Gaspille des ressources | Notifie uniquement quand c'est nécessaire |
| Le client doit connaître le serveur | Le serveur notifie sans connaître les détails du client |
| Retard entre le changement et la détection | Notification immédiate |

**Flux de notification** :

<div class="diagram-design">
<p><a href="../../diagrams/10-architecture-06-patterns-comportement-2.html">Observer (HTML + SVG)</a></p>
<iframe src="../../diagrams/10-architecture-06-patterns-comportement-2.html" title="Observer" style="width:100%;min-height:520px;border:0;background:transparent"></iframe>
</div>

Le Subject notifie tous les observateurs inscrits. Chaque observateur réagit indépendamment sans connaître les autres.

**Implémentation en PHP** :

```php
<?php

// Interface Observer : chaque observateur sait reagir a un evenement
interface EventListenerInterface
{
    public function handle(array $eventData): void;
}

// Interface Subject : l'objet qui emet les evenements
class EventEmitter
{
    // Liste des observateurs, groupes par evenement
    private array $listeners = [];

    // S'abonner a un evenement
    public function on(string $event, EventListenerInterface $listener): void
    {
        $this->listeners[$event][] = $listener;
    }

    // Se desabonner d'un evenement
    public function off(string $event, EventListenerInterface $listener): void
    {
        if (!isset($this->listeners[$event])) {
            return;
        }

        $this->listeners[$event] = array_filter(
            $this->listeners[$event],
            fn (EventListenerInterface $l) => $l !== $listener,
        );
    }

    // Emettre un evenement : notifier tous les observateurs
    public function emit(string $event, array $data = []): void
    {
        if (!isset($this->listeners[$event])) {
            return;
        }

        foreach ($this->listeners[$event] as $listener) {
            $listener->handle($data);
        }
    }
}

// Observateur 1 : log les evenements
class LogListener implements EventListenerInterface
{
    public function handle(array $eventData): void
    {
        echo 'LOG: ' . json_encode($eventData) . "\n";
    }
}

// Observateur 2 : envoie des notifications
class NotificationListener implements EventListenerInterface
{
    public function handle(array $eventData): void
    {
        echo "NOTIFICATION: Evenement recu pour {$eventData['email']}\n";
    }
}

// Utilisation
$emitter = new EventEmitter();

// Abonnement
$logListener = new LogListener();
$notifListener = new NotificationListener();

$emitter->on('user.created', $logListener);
$emitter->on('user.created', $notifListener);

// Emission : les deux listeners sont notifies
$emitter->emit('user.created', [
    'email' => 'alice@example.com',
    'name' => 'Alice',
]);
// Affiche :
// LOG: {"email":"alice@example.com","name":"Alice"}
// NOTIFICATION: Evenement recu pour alice@example.com
```

**Observer dans Symfony : EventDispatcher**

```php
<?php

// Symfony fournit un EventDispatcher complet
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

// L'attribut #[AsEventListener] enregistre automatiquement le listener
#[AsEventListener(event: OrderPlacedEvent::class, priority: 10)]
class SendReceiptListener
{
    public function __invoke(OrderPlacedEvent $event): void
    {
        // Ce listener est notifie quand une commande est passee
        $order = $event->getOrder();
        echo "Envoi du recu pour la commande #{$order->getId()}\n";
    }
}
```

---

### Command

**Définition** : Le pattern Command encapsule une requête sous forme d'objet, ce qui permet de paramétrer les clients avec différentes requêtes, de mettre les requêtes en file d'attente et de supporter l'annulation.

**Le problème que Command résout** :

Sans Command, voici les problèmes rencontrés :

1. **Actions non réversibles** : impossible d'annuler une action une fois exécutée.
2. **Actions non différées** : une action est exécutée immédiatement, pas possible de la planifier.
3. **Actions non sérialisables** : impossible de sauvegarder une action pour la ré-exécuter plus tard.

**Analogie concrète** : Pense à un bon de commande au restaurant. Le serveur prend ta commande sur un papier (objet Command). Ce papier peut être transmis au cuisinier, mis en file d'attente, annulé si tu changes d'avis. Le papier contient tout ce qu'il faut pour préparer le plat, sans que le cuisinier ait besoin de te parler directement.

**Implémentation en PHP** :

```php
<?php

// Interface Command : chaque commande sait s'executer et s'annuler
interface CommandInterface
{
    public function execute(): void;
    public function undo(): void;
}

// Commande concrete : ajouter un produit au panier
class AddToCartCommand implements CommandInterface
{
    public function __construct(
        private Cart $cart,
        private Product $product,
        private int $quantity,
    ) {
    }

    public function execute(): void
    {
        // Ajouter le produit au panier
        $this->cart->addItem($this->product, $this->quantity);
        echo "Ajoute : {$this->quantity}x {$this->product->getName()}\n";
    }

    public function undo(): void
    {
        // Annuler : retirer le produit du panier
        $this->cart->removeItem($this->product, $this->quantity);
        echo "Annule : {$this->quantity}x {$this->product->getName()}\n";
    }
}

// Commande concrete : appliquer un code promo
class ApplyDiscountCommand implements CommandInterface
{
    private float $previousDiscount = 0;

    public function __construct(
        private Cart $cart,
        private string $code,
        private float $discount,
    ) {
    }

    public function execute(): void
    {
        // Sauvegarder l'etat actuel pour pouvoir annuler
        $this->previousDiscount = $this->cart->getDiscount();

        // Appliquer la remise
        $this->cart->setDiscount($this->discount);
        echo "Code promo $this->code applique : {$this->discount}%\n";
    }

    public function undo(): void
    {
        // Restaurer l'ancienne remise
        $this->cart->setDiscount($this->previousDiscount);
        echo "Code promo $this->code annule\n";
    }
}

// Invocateur : gere l'historique des commandes
class CommandHistory
{
    // Pile des commandes executees (pour le undo)
    private array $history = [];

    public function execute(CommandInterface $command): void
    {
        // Executer la commande
        $command->execute();

        // L'ajouter a l'historique
        $this->history[] = $command;
    }

    public function undo(): void
    {
        if (empty($this->history)) {
            echo "Rien a annuler\n";
            return;
        }

        // Retirer la derniere commande de l'historique
        $command = array_pop($this->history);

        // L'annuler
        $command->undo();
    }
}

// Utilisation
$cart = new Cart();
$history = new CommandHistory();

// Executer des commandes
$history->execute(new AddToCartCommand($cart, $laptop, 1));
$history->execute(new AddToCartCommand($cart, $mouse, 2));
$history->execute(new ApplyDiscountCommand($cart, 'PROMO10', 10));

// Annuler la derniere commande
$history->undo(); // Annule le code promo
$history->undo(); // Annule l'ajout de la souris
```

**Command dans Symfony : Messenger**

```php
<?php

// Symfony Messenger est une implementation du pattern Command

// La commande (Message)
class SendEmailCommand
{
    public function __construct(
        public readonly string $to,
        public readonly string $subject,
        public readonly string $body,
    ) {
    }
}

// Le handler (execute la commande)
#[AsMessageHandler]
class SendEmailHandler
{
    public function __construct(
        private MailerInterface $mailer,
    ) {
    }

    public function __invoke(SendEmailCommand $command): void
    {
        // Le handler execute la commande
        $email = (new Email())
            ->to($command->to)
            ->subject($command->subject)
            ->text($command->body);

        $this->mailer->send($email);
    }
}

// Utilisation dans un controleur
class ContactController extends AbstractController
{
    public function send(MessageBusInterface $bus): Response
    {
        // On cree la commande et on la dispatche
        // L'execution peut etre synchrone ou asynchrone
        $bus->dispatch(new SendEmailCommand(
            to: 'support@example.com',
            subject: 'Nouveau message',
            body: 'Contenu du message',
        ));

        return $this->json(['status' => 'sent']);
    }
}
```

---

### Template Method

**Définition** : Le pattern Template Method définit le squelette d'un algorithme dans une méthode de la classe parent, tout en laissant les sous-classes redéfinir certaines étapes.

**Le problème que Template Method résout** :

Sans Template Method, voici les problèmes rencontrés :

1. **Code dupliqué** : plusieurs classes ont le même algorithme global avec des détails différents.
2. **Structure incohérente** : chaque implémentation invente sa propre structure.
3. **Maintenance difficile** : modifier l'algorithme global oblige à modifier chaque implémentation.

**Analogie concrète** : Pense à un formulaire administratif pré-imprimé. Le formulaire a une structure fixe (nom, prénom, adresse, signature). Chaque personne remplit les champs avec ses propres informations, mais la structure reste identique. Le Template Method est le formulaire : la structure est fixe, seul le contenu varie.

**Implémentation en PHP** :

```php
<?php

// Classe abstraite : definit le squelette de l'algorithme
abstract class DataExporter
{
    // La methode template : definit les etapes dans l'ordre
    // Cette methode est finale : les sous-classes ne peuvent PAS la modifier
    final public function export(array $data): string
    {
        // Etape 1 : formater l'en-tete (variable selon le format)
        $output = $this->formatHeader($data);

        // Etape 2 : formater chaque ligne de donnees (variable)
        foreach ($data as $row) {
            $output .= $this->formatRow($row);
        }

        // Etape 3 : formater le pied de page (variable)
        $output .= $this->formatFooter($data);

        return $output;
    }

    // Methodes abstraites : les sous-classes DOIVENT les implementer
    abstract protected function formatHeader(array $data): string;
    abstract protected function formatRow(array $row): string;
    abstract protected function formatFooter(array $data): string;
}

// Implementation CSV
class CsvExporter extends DataExporter
{
    protected function formatHeader(array $data): string
    {
        // En-tete CSV : les noms des colonnes
        if (empty($data)) {
            return '';
        }
        return implode(',', array_keys($data[0])) . "\n";
    }

    protected function formatRow(array $row): string
    {
        // Chaque ligne : les valeurs separees par des virgules
        return implode(',', $row) . "\n";
    }

    protected function formatFooter(array $data): string
    {
        // Pas de pied de page en CSV
        return '';
    }
}

// Implementation HTML
class HtmlExporter extends DataExporter
{
    protected function formatHeader(array $data): string
    {
        if (empty($data)) {
            return '<table></table>';
        }

        $html = '<table><thead><tr>';
        foreach (array_keys($data[0]) as $column) {
            $html .= "<th>$column</th>";
        }
        $html .= '</tr></thead><tbody>';
        return $html;
    }

    protected function formatRow(array $row): string
    {
        $html = '<tr>';
        foreach ($row as $value) {
            $html .= "<td>$value</td>";
        }
        $html .= '</tr>';
        return $html;
    }

    protected function formatFooter(array $data): string
    {
        $count = count($data);
        return "</tbody><tfoot><tr><td colspan=\"99\">Total : $count lignes</td></tr></tfoot></table>";
    }
}

// Utilisation
$data = [
    ['name' => 'Produit A', 'price' => 29.99],
    ['name' => 'Produit B', 'price' => 49.99],
];

$csvExporter = new CsvExporter();
echo $csvExporter->export($data);
// name,price
// Produit A,29.99
// Produit B,49.99

$htmlExporter = new HtmlExporter();
echo $htmlExporter->export($data);
// <table><thead>...<tbody>...<tfoot>...</table>
```

---

### State

**Définition** : Le pattern State permet à un objet de modifier son comportement quand son état interne change. L'objet semble changer de classe.

**Le problème que State résout** :

Sans State, voici les problèmes rencontrés :

1. **Conditions partout** : chaque méthode contient des if/switch sur l'état courant.
2. **Transitions incomplètes** : on oublie certains cas, créant des bugs.
3. **États non isolés** : le code d'un état est mélangé avec celui des autres états.

**Analogie concrète** : Pense à un distributeur automatique de boissons. Son comportement change selon son état : en attente (affiche "Insérez une pièce"), pièce insérée (affiche "Sélectionnez une boisson"), distribution en cours (distribue la boisson), en panne (affiche "Hors service"). Chaque état a ses propres règles. Le pattern State isole le comportement de chaque état dans sa propre classe.

**Transitions d'états d'une commande** :

<div class="diagram-design">
<p><a href="../../diagrams/10-architecture-06-patterns-comportement-3.html">State (HTML + SVG)</a></p>
<iframe src="../../diagrams/10-architecture-06-patterns-comportement-3.html" title="State" style="width:100%;min-height:676px;border:0;background:transparent"></iframe>
</div>

Chaque état (EnAttente, Payee, etc.) est une classe qui implemente les transitions autorisées. Les transitions invalides levent une exception.

**Implémentation en PHP** :

```php
<?php

// Interface State : chaque etat sait gerer les actions possibles
interface OrderStateInterface
{
    public function pay(Order $order): void;
    public function ship(Order $order): void;
    public function cancel(Order $order): void;
    public function getStatus(): string;
}

// Etat : en attente de paiement
class PendingState implements OrderStateInterface
{
    public function pay(Order $order): void
    {
        echo "Paiement accepte. Commande en preparation.\n";
        // Transition vers l'etat suivant
        $order->setState(new PaidState());
    }

    public function ship(Order $order): void
    {
        // Action impossible dans cet etat
        echo "Impossible d'expedier : la commande n'est pas payee.\n";
    }

    public function cancel(Order $order): void
    {
        echo "Commande annulee.\n";
        $order->setState(new CancelledState());
    }

    public function getStatus(): string
    {
        return 'pending';
    }
}

// Etat : payee
class PaidState implements OrderStateInterface
{
    public function pay(Order $order): void
    {
        echo "La commande est deja payee.\n";
    }

    public function ship(Order $order): void
    {
        echo "Commande expediee.\n";
        $order->setState(new ShippedState());
    }

    public function cancel(Order $order): void
    {
        echo "Commande annulee. Remboursement en cours.\n";
        $order->setState(new CancelledState());
    }

    public function getStatus(): string
    {
        return 'paid';
    }
}

// Etat : expediee
class ShippedState implements OrderStateInterface
{
    public function pay(Order $order): void
    {
        echo "La commande est deja payee.\n";
    }

    public function ship(Order $order): void
    {
        echo "La commande est deja expediee.\n";
    }

    public function cancel(Order $order): void
    {
        echo "Impossible d'annuler : la commande est deja expediee.\n";
    }

    public function getStatus(): string
    {
        return 'shipped';
    }
}

// Etat : annulee
class CancelledState implements OrderStateInterface
{
    public function pay(Order $order): void
    {
        echo "Impossible : la commande est annulee.\n";
    }

    public function ship(Order $order): void
    {
        echo "Impossible : la commande est annulee.\n";
    }

    public function cancel(Order $order): void
    {
        echo "La commande est deja annulee.\n";
    }

    public function getStatus(): string
    {
        return 'cancelled';
    }
}

// Le contexte : la commande delegue a son etat courant
class Order
{
    private OrderStateInterface $state;

    public function __construct()
    {
        // Etat initial : en attente de paiement
        $this->state = new PendingState();
    }

    public function setState(OrderStateInterface $state): void
    {
        $this->state = $state;
    }

    // Chaque action est deleguee a l'etat courant
    public function pay(): void { $this->state->pay($this); }
    public function ship(): void { $this->state->ship($this); }
    public function cancel(): void { $this->state->cancel($this); }
    public function getStatus(): string { return $this->state->getStatus(); }
}

// Utilisation
$order = new Order();
echo $order->getStatus(); // "pending"

$order->ship();   // "Impossible d'expedier : la commande n'est pas payee."
$order->pay();    // "Paiement accepte. Commande en preparation."
echo $order->getStatus(); // "paid"

$order->ship();   // "Commande expediee."
echo $order->getStatus(); // "shipped"

$order->cancel(); // "Impossible d'annuler : la commande est deja expediee."
```

---

## Étapes Pratiques

### Étape 1 : Implémenter Strategy dans un service Symfony

```php
<?php

namespace App\Service\Shipping;

// Interface Strategy
interface ShippingCalculatorInterface
{
    public function calculate(float $weight, string $destination): float;
    public function getName(): string;
}

// Strategie 1 : livraison standard
class StandardShipping implements ShippingCalculatorInterface
{
    public function calculate(float $weight, string $destination): float
    {
        // 2 EUR par kg, minimum 5 EUR
        return max(5.00, $weight * 2.00);
    }

    public function getName(): string
    {
        return 'Standard (5-7 jours)';
    }
}

// Strategie 2 : livraison express
class ExpressShipping implements ShippingCalculatorInterface
{
    public function calculate(float $weight, string $destination): float
    {
        // 5 EUR par kg, minimum 15 EUR
        return max(15.00, $weight * 5.00);
    }

    public function getName(): string
    {
        return 'Express (1-2 jours)';
    }
}
```

Enregistrement dans Symfony avec des tags :

```yaml
# config/services.yaml
services:
    App\Service\Shipping\StandardShipping:
        tags: ['app.shipping_calculator']

    App\Service\Shipping\ExpressShipping:
        tags: ['app.shipping_calculator']
```

**Résultat attendu** :

```text
$standard = new StandardShipping();
$express = new ExpressShipping();

$standard->calculate(3.0, 'Paris'); // 6.00 EUR
$express->calculate(3.0, 'Paris');  // 15.00 EUR
```

---

### Étape 2 : Utiliser les événements Symfony (Observer)

```php
<?php

namespace App\Event;

use Symfony\Contracts\EventDispatcher\Event;

// L'evenement
class ProductViewedEvent extends Event
{
    public function __construct(
        private int $productId,
        private ?int $userId,
    ) {
    }

    public function getProductId(): int { return $this->productId; }
    public function getUserId(): ?int { return $this->userId; }
}
```

```php
<?php

namespace App\EventListener;

use App\Event\ProductViewedEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

// Listener 1 : compteur de vues
#[AsEventListener(event: ProductViewedEvent::class)]
class IncrementViewCountListener
{
    public function __invoke(ProductViewedEvent $event): void
    {
        echo "Vue +1 pour le produit #{$event->getProductId()}\n";
    }
}

// Listener 2 : recommandations
#[AsEventListener(event: ProductViewedEvent::class)]
class UpdateRecommendationsListener
{
    public function __invoke(ProductViewedEvent $event): void
    {
        if ($event->getUserId()) {
            echo "Recommandations mises a jour pour l'utilisateur #{$event->getUserId()}\n";
        }
    }
}
```

**Résultat attendu** :

```text
Quand un produit est consulté :
1. Le compteur de vues est incrémenté
2. Les recommandations sont mises à jour (si l'utilisateur est connecté)
Les deux listeners sont indépendants et peuvent être ajoutés/supprimés sans modifier le code existant.
```

---

### Étape 3 : Implémenter une commande Messenger (Command)

```php
<?php

namespace App\Message;

// La commande : generer un rapport
class GenerateReportCommand
{
    public function __construct(
        public readonly string $reportType,
        public readonly string $period,
        public readonly string $recipientEmail,
    ) {
    }
}
```

```php
<?php

namespace App\MessageHandler;

use App\Message\GenerateReportCommand;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

// Le handler : execute la commande
#[AsMessageHandler]
class GenerateReportHandler
{
    public function __invoke(GenerateReportCommand $command): void
    {
        echo "Generation du rapport {$command->reportType} "
            . "pour la periode {$command->period}\n";
        echo "Envoi a {$command->recipientEmail}\n";
    }
}
```

**Résultat attendu** :

```text
// Dans un contrôleur :
$bus->dispatch(new GenerateReportCommand(
    reportType: 'ventes',
    period: '2026-03',
    recipientEmail: 'manager@shop.com',
));

// Le rapport est généré de manière asynchrone
// Le contrôleur retourne immédiatement
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `php bin/console debug:event-dispatcher` | Lister tous les listeners (Observer) |
| `php bin/console debug:messenger` | Lister les handlers de messages (Command) |
| `php bin/console messenger:consume` | Traiter les messages en attente |
| `php bin/console debug:container --tag=app.shipping_calculator` | Lister les stratégies enregistrées |

---

## Pièges Fréquents

### Piège 1 : Strategy avec un seul algorithme

**Problème** : Tu crées une interface Strategy avec une seule implémentation. Le pattern n'apporte rien.

**Solution** : N'utilise Strategy que si tu as au moins deux algorithmes interchangeables. Si tu n'en as qu'un, un simple service suffit.

### Piège 2 : Observer avec des effets en cascade

**Problème** : Un listener modifie l'objet observé, ce qui déclenche d'autres notifications, créant une boucle infinie.

**Solution** : Ne modifie jamais l'objet observé depuis un listener. Si un listener doit déclencher un autre événement, utilise un événement différent.

### Piège 3 : State avec des transitions implicites

**Problème** : Les transitions entre états ne sont pas documentées. On ne sait pas quel état peut mener à quel autre état.

**Solution** : Documente le diagramme d'états dans un commentaire ou un fichier séparé.

```text
Diagramme d'etats de Order :
pending → paid (via pay())
pending → cancelled (via cancel())
paid → shipped (via ship())
paid → cancelled (via cancel())
shipped → (etat final, pas de transition)
cancelled → (etat final, pas de transition)
```

---

## Checklist de Validation

- [ ] Je sais implémenter le pattern Strategy avec une interface et plusieurs implémentations
- [ ] Je sais utiliser les événements Symfony pour implémenter Observer
- [ ] Je sais créer une commande Messenger (pattern Command)
- [ ] Je comprends le pattern Template Method (méthode squelette + étapes abstraites)
- [ ] Je sais implémenter le pattern State pour gérer les transitions d'états
- [ ] Je sais quand chaque pattern est utile et quand il est superflu

---

## Exercice Pratique

**Énoncé** : Implémente un système de validation de formulaire avec le pattern Strategy.

**Instructions** :

1. Crée une interface `ValidatorInterface` avec une méthode `validate(mixed $value): bool` et `getErrorMessage(): string`
2. Crée 4 stratégies : `EmailValidator`, `PhoneValidator`, `PasswordValidator`, `NotBlankValidator`
3. Crée une classe `FormField` qui accepte un tableau de validators
4. Crée une classe `Form` qui valide tous ses champs

**Résultat attendu** : Un formulaire avec des champs valides/invalides et des messages d'erreur.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php

// Interface Strategy
interface ValidatorInterface
{
    public function validate(mixed $value): bool;
    public function getErrorMessage(): string;
}

// Strategie 1 : non vide
class NotBlankValidator implements ValidatorInterface
{
    public function validate(mixed $value): bool
    {
        return $value !== null && $value !== '';
    }

    public function getErrorMessage(): string
    {
        return 'Ce champ ne peut pas etre vide.';
    }
}

// Strategie 2 : email valide
class EmailValidator implements ValidatorInterface
{
    public function validate(mixed $value): bool
    {
        return filter_var($value, FILTER_VALIDATE_EMAIL) !== false;
    }

    public function getErrorMessage(): string
    {
        return "L'adresse email n'est pas valide.";
    }
}

// Strategie 3 : telephone
class PhoneValidator implements ValidatorInterface
{
    public function validate(mixed $value): bool
    {
        // Format : 10 chiffres, avec ou sans espaces
        $cleaned = preg_replace('/\s/', '', $value);
        return preg_match('/^\+?\d{10,12}$/', $cleaned) === 1;
    }

    public function getErrorMessage(): string
    {
        return 'Le numero de telephone doit contenir 10 a 12 chiffres.';
    }
}

// Strategie 4 : mot de passe
class PasswordValidator implements ValidatorInterface
{
    public function validate(mixed $value): bool
    {
        return strlen($value) >= 8
            && preg_match('/[A-Z]/', $value)
            && preg_match('/[0-9]/', $value);
    }

    public function getErrorMessage(): string
    {
        return 'Le mot de passe doit contenir au moins 8 caracteres, '
            . 'une majuscule et un chiffre.';
    }
}

// Champ de formulaire avec ses validators
class FormField
{
    private array $errors = [];

    public function __construct(
        private string $name,
        private mixed $value,
        private array $validators,
    ) {
    }

    public function validate(): bool
    {
        $this->errors = [];

        foreach ($this->validators as $validator) {
            if (!$validator->validate($this->value)) {
                $this->errors[] = $validator->getErrorMessage();
            }
        }

        return empty($this->errors);
    }

    public function getErrors(): array { return $this->errors; }
    public function getName(): string { return $this->name; }
}

// Formulaire
class Form
{
    private array $fields = [];

    public function addField(FormField $field): void
    {
        $this->fields[] = $field;
    }

    public function validate(): bool
    {
        $valid = true;

        foreach ($this->fields as $field) {
            if (!$field->validate()) {
                $valid = false;
                echo "Champ '{$field->getName()}' invalide :\n";
                foreach ($field->getErrors() as $error) {
                    echo "  - $error\n";
                }
            }
        }

        return $valid;
    }
}

// Utilisation
$form = new Form();

$form->addField(new FormField('email', 'invalide', [
    new NotBlankValidator(),
    new EmailValidator(),
]));

$form->addField(new FormField('password', 'abc', [
    new NotBlankValidator(),
    new PasswordValidator(),
]));

$form->validate();
// Champ 'email' invalide :
//   - L'adresse email n'est pas valide.
// Champ 'password' invalide :
//   - Le mot de passe doit contenir au moins 8 caracteres, une majuscule et un chiffre.
```

---

## Navigation

← Fiche précédente : **[Patterns de structure](05-patterns-structure.md)**

→ Fiche suivante : **[MVC en profondeur](07-mvc-profondeur.md)**
