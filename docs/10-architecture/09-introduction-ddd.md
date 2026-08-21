---
tags:
  - Architecture
  - Avancé
  - Concept
description: "Introduction au DDD : bounded contexts, entités, value objects, agrégats et langage ubiquitaire."
estimated_time: "90 min"
fiche_number: 9
total_fiches: 17
cursus: "Architecture et Design Patterns"
id: "web.architecture.introduction-ddd"
course_id: "web.architecture"
content_type: "lesson"
order: 9
---

# 09 - Introduction au DDD

> **En bref** : Comprendre les concepts essentiels du Domain-Driven Design : bounded contexts, entités, value objects, agrégats et langage ubiquitaire. Lecture estimée : 90 min.

## Prérequis

- Fiche 2 : [SOLID - Principes fondamentaux](02-solid-principes.md)
- Fiche 3 : [SOLID - Application dans Symfony](03-solid-symfony.md)
- Fiche 8 : [Clean Architecture](08-clean-architecture.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer les concepts fondamentaux du DDD, distinguer entités et value objects, définir un agrégat et ses invariants, identifier les bounded contexts d'une application et implémenter ces concepts dans un projet Symfony.

---

## Concepts

### Qu'est-ce que le Domain-Driven Design ?

**Définition** : Le Domain-Driven Design (DDD) est une approche de conception logicielle proposée par Eric Evans en 2003. L'idée centrale est de placer le domaine métier (les règles et processus de l'entreprise) au cœur de l'architecture, et de construire le code autour de ce domaine.

**Le problème que le DDD résout** :

Sans DDD, voici les problèmes rencontrés :

1. **Code déconnecté du métier** : les développeurs utilisent des termes techniques (Repository, Manager, Handler) au lieu des termes métier (Commande, Facture, Livraison). Le code ne reflète pas la réalité de l'entreprise.
2. **Malentendu entre équipes** : les développeurs et les experts métier ne parlent pas le même langage. Une "commande" pour le développeur est un objet technique. Pour le métier, c'est un processus avec des règles précises.
3. **Logique métier dispersée** : les règles métier sont éparpillées dans les contrôleurs, les services et les requêtes SQL. Personne ne sait où trouver "la règle de remboursement".

**Comment le DDD résout ces problèmes** :

| Problème | Solution apportée par le DDD |
| --- | --- |
| Code déconnecté du métier | Le code utilise le même vocabulaire que les experts métier |
| Malentendu entre équipes | Le langage ubiquitaire est partagé par tous |
| Logique métier dispersée | La logique est centralisée dans les entités et les agrégats |

**Analogie concrète** : Pense à un architecte qui construit un hôpital. Il ne dessine pas juste des murs et des portes. Il travaille avec les médecins pour comprendre les flux de patients, les zones stériles, les urgences. Le plan de l'hôpital reflète le fonctionnement médical. Le DDD fait la même chose : le code reflète le fonctionnement de l'entreprise.

**Ce que le DDD n'est PAS** :

- Le DDD n'est pas un framework ou une librairie. Tu ne l'installes pas avec `composer require`. C'est une façon de penser et de structurer le code.
- Le DDD n'est pas nécessaire pour tous les projets. Un simple CRUD n'a pas besoin de DDD. Le DDD est utile quand la logique métier est complexe.
- Le DDD n'est pas incompatible avec Symfony. Symfony fournit l'infrastructure, le DDD structure la logique métier.

---

### Le langage ubiquitaire (Ubiquitous Language)

**Définition** : Le langage ubiquitaire est un vocabulaire commun, utilisé par les développeurs ET les experts métier, qui se retrouve directement dans le code source (noms de classes, méthodes, variables).

**Le problème que le langage ubiquitaire résout** :

Sans langage ubiquitaire, voici les problèmes rencontrés :

1. **Traduction permanente** : les développeurs traduisent les termes métier en termes techniques, créant des erreurs d'interprétation.
2. **Documentation obsolète** : le code utilise des noms différents de la documentation métier.
3. **Réunions inefficaces** : les équipes passent du temps à clarifier des termes au lieu de résoudre des problèmes.

**Comment le langage ubiquitaire résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Traduction permanente | Le code utilise les mêmes termes que le métier |
| Documentation obsolète | Le code EST la documentation du domaine |
| Réunions inefficaces | Tout le monde utilise les mêmes mots |

**Analogie concrète** : Pense à une équipe de cuisine dans un restaurant. Quand le chef dit "mise en place", tout le monde comprend exactement la même chose : préparer tous les ingrédients avant le service. Si chaque cuisinier utilisait un mot différent pour cette étape, la cuisine serait chaotique.

**Exemples concrets** :

```text
❌ Termes techniques (sans langage ubiquitaire) :
  class DataProcessor { process($input) }
  class ItemManager { handleItem($data) }
  class EntityHelper { doStuff($entity) }

✅ Termes métier (avec langage ubiquitaire) :
  class Commande { confirmer() }
  class Facture { envoyer() }
  class Livraison { expedier() }
```

```php
<?php

// ❌ Noms techniques : on ne comprend pas le métier
class OrderService
{
    public function processOrder(array $data): void
    {
        // Que fait "process" exactement ?
    }
}

// ✅ Noms métier : le code raconte l'histoire du domaine
class Commande
{
    public function confirmer(): void
    {
        // Le nom de la méthode dit exactement ce qui se passe
    }

    public function annuler(string $motif): void
    {
        // Le paramètre "motif" vient du vocabulaire métier
    }

    public function expedier(Transporteur $transporteur): void
    {
        // Le transporteur est un concept métier, pas un "service"
    }
}
```

---

### Les entités (Entities)

**Définition** : Une entité est un objet du domaine qui possède une identité unique et persistante. Deux entités avec les mêmes attributs mais des identités différentes sont des objets différents.

**Le problème que les entités résolvent** :

Sans entités, voici les problèmes rencontrés :

1. **Confusion d'identité** : deux clients avec le même nom sont considérés comme le même client.
2. **Logique métier dans les services** : les règles métier sont dans des classes `Service` au lieu d'être dans l'objet concerné.
3. **Objets anémiques** : les objets ne contiennent que des getters/setters, sans aucune logique.

**Comment les entités résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Confusion d'identité | Chaque entité a un identifiant unique (ID) |
| Logique dans les services | La logique métier est DANS l'entité |
| Objets anémiques | L'entité contient des méthodes métier |

**Analogie concrète** : Pense à deux personnes nommées "Marie Dupont". Même si elles ont le même nom, le même âge et la même adresse, ce sont deux personnes différentes. Chacune a un numéro de sécurité sociale unique. L'entité fonctionne pareil : son identité la distingue des autres, même si ses attributs sont identiques.

**Ce qu'une entité n'est PAS** :

- Une entité n'est pas un objet Doctrine avec des annotations `@ORM`. En DDD, l'entité est un objet PHP pur. Le mapping Doctrine est dans un fichier séparé (comme vu dans la fiche 8).
- Une entité n'est pas un simple conteneur de données. Elle contient de la logique métier.

**Implémentation en PHP** :

```php
<?php

namespace App\Domain\Entity;

use App\Domain\ValueObject\Adresse;
use App\Domain\ValueObject\Email;

// Entité Client : identifiée par son ID unique
class Client
{
    private string $id;
    private string $nom;
    private Email $email;
    private Adresse $adresseFacturation;
    private \DateTimeImmutable $dateInscription;
    private string $statut = 'actif';

    public function __construct(
        string $id,
        string $nom,
        Email $email,
        Adresse $adresseFacturation,
    ) {
        $this->id = $id;
        $this->nom = $nom;
        $this->email = $email;
        $this->adresseFacturation = $adresseFacturation;
        $this->dateInscription = new \DateTimeImmutable();
    }

    // Méthode métier : changer l'adresse de facturation
    public function changerAdresseFacturation(Adresse $nouvelleAdresse): void
    {
        // Règle métier : un client désactivé ne peut pas changer d'adresse
        if ($this->statut === 'desactive') {
            throw new \DomainException(
                'Un client désactivé ne peut pas modifier ses informations'
            );
        }

        $this->adresseFacturation = $nouvelleAdresse;
    }

    // Méthode métier : désactiver le compte
    public function desactiver(): void
    {
        if ($this->statut === 'desactive') {
            throw new \DomainException('Le client est déjà désactivé');
        }

        $this->statut = 'desactive';
    }

    // L'égalité se base sur l'identité, PAS sur les attributs
    public function estLeMemeQue(self $autre): bool
    {
        return $this->id === $autre->id;
    }

    public function getId(): string { return $this->id; }
    public function getNom(): string { return $this->nom; }
    public function getEmail(): Email { return $this->email; }
    public function getStatut(): string { return $this->statut; }
}
```

---

### Les value objects (Objets valeur)

**Définition** : Un value object est un objet du domaine défini uniquement par ses attributs, sans identité propre. Deux value objects avec les mêmes attributs sont considérés comme identiques. Les value objects sont immuables : une fois créés, ils ne changent jamais.

**Le problème que les value objects résolvent** :

Sans value objects, voici les problèmes rencontrés :

1. **Validation dispersée** : la validation d'un email est faite dans le contrôleur, dans le service et dans le formulaire, avec des règles parfois différentes.
2. **Primitive obsession** : on utilise des types primitifs (`string`, `float`) pour représenter des concepts métier complexes (email, montant, adresse).
3. **Erreurs de manipulation** : on peut additionner des euros et des dollars parce que les deux sont des `float`.

**Comment les value objects résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Validation dispersée | La validation est dans le constructeur du value object |
| Primitive obsession | Chaque concept métier a sa propre classe |
| Erreurs de manipulation | Le typage empêche les erreurs (on ne peut pas additionner EUR et USD) |

**Analogie concrète** : Pense à un billet de 20 euros. Deux billets de 20 euros ont la même valeur et sont interchangeables (tu ne tiens pas à un billet en particulier). Par contre, deux personnes ne sont pas interchangeables même si elles ont le même nom. Le billet est un value object (défini par sa valeur). La personne est une entité (définie par son identité).

**Comparaison entité vs value object** :

| Entité | Value Object |
| --- | --- |
| A une identité unique (ID) | Défini uniquement par ses attributs |
| Deux entités avec les mêmes attributs sont différentes | Deux value objects avec les mêmes attributs sont identiques |
| Peut être modifiée (changement d'état) | Immuable (on crée un nouvel objet) |
| Exemple : Client, Commande, Produit | Exemple : Email, Montant, Adresse, DateRange |

**Implémentation en PHP** :

```php
<?php

namespace App\Domain\ValueObject;

// Value Object Email : immuable, défini par sa valeur
class Email
{
    private string $adresse;

    public function __construct(string $adresse)
    {
        // La validation est dans le constructeur
        // Un Email invalide ne peut PAS exister
        if (!filter_var($adresse, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException(
                "L'adresse email '$adresse' n'est pas valide"
            );
        }

        $this->adresse = mb_strtolower($adresse);
    }

    public function getAdresse(): string
    {
        return $this->adresse;
    }

    public function getDomaine(): string
    {
        // Logique métier dans le value object
        return explode('@', $this->adresse)[1];
    }

    // Égalité par valeur (pas par référence)
    public function estEgalA(self $autre): bool
    {
        return $this->adresse === $autre->adresse;
    }

    public function __toString(): string
    {
        return $this->adresse;
    }
}
```

```php
<?php

namespace App\Domain\ValueObject;

// Value Object Montant : immuable, avec devise
class Montant
{
    public function __construct(
        private readonly float $valeur,
        private readonly string $devise,
    ) {
        if ($valeur < 0) {
            throw new \DomainException(
                'Le montant ne peut pas être négatif'
            );
        }

        if (!in_array($devise, ['EUR', 'USD', 'GBP'])) {
            throw new \DomainException(
                "Devise non supportée : $devise"
            );
        }
    }

    public function additionner(self $autre): self
    {
        // Règle métier : on ne peut additionner que des montants de même devise
        if ($this->devise !== $autre->devise) {
            throw new \DomainException(
                "Impossible d'additionner {$this->devise} et {$autre->devise}"
            );
        }

        // Retourne un NOUVEL objet (immuabilité)
        return new self($this->valeur + $autre->valeur, $this->devise);
    }

    public function multiplier(int $facteur): self
    {
        return new self($this->valeur * $facteur, $this->devise);
    }

    public function estEgalA(self $autre): bool
    {
        return $this->valeur === $autre->valeur
            && $this->devise === $autre->devise;
    }

    public function getValeur(): float { return $this->valeur; }
    public function getDevise(): string { return $this->devise; }
}
```

```php
<?php

namespace App\Domain\ValueObject;

// Value Object Adresse : immuable
class Adresse
{
    public function __construct(
        private readonly string $rue,
        private readonly string $codePostal,
        private readonly string $ville,
        private readonly string $pays,
    ) {
        if (empty($rue) || empty($codePostal) || empty($ville) || empty($pays)) {
            throw new \DomainException(
                'Tous les champs de l\'adresse sont obligatoires'
            );
        }
    }

    public function formatee(): string
    {
        return "{$this->rue}\n{$this->codePostal} {$this->ville}\n{$this->pays}";
    }

    public function estEgaleA(self $autre): bool
    {
        return $this->rue === $autre->rue
            && $this->codePostal === $autre->codePostal
            && $this->ville === $autre->ville
            && $this->pays === $autre->pays;
    }

    public function getRue(): string { return $this->rue; }
    public function getCodePostal(): string { return $this->codePostal; }
    public function getVille(): string { return $this->ville; }
    public function getPays(): string { return $this->pays; }
}
```

---

### Les agrégats (Aggregates)

**Définition** : Un agrégat est un groupe d'entités et de value objects traités comme une seule unité pour les modifications de données. L'agrégat a une entité racine (aggregate root) qui contrôle l'accès à tous les objets internes.

**Le problème que les agrégats résolvent** :

Sans agrégats, voici les problèmes rencontrés :

1. **Incohérence des données** : on peut modifier une ligne de commande sans passer par la commande, ce qui casse les règles métier (ex: total incorrect).
2. **Transactions non définies** : on ne sait pas quelles entités doivent être sauvegardées ensemble.
3. **Accès direct aux objets internes** : n'importe quel code peut modifier n'importe quel objet, sans respecter les invariants.

**Comment les agrégats résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Incohérence des données | Toute modification passe par la racine de l'agrégat |
| Transactions non définies | Un agrégat = une transaction |
| Accès direct aux objets internes | Seule la racine est accessible de l'extérieur |

**Analogie concrète** : Pense à un carnet de chèques. Le carnet (agrégat) contient des chèques (entités internes). Tu ne peux pas modifier un chèque sans ouvrir le carnet. Le carnet contrôle les règles : chaque chèque a un numéro séquentiel, le solde est mis à jour à chaque émission. Si quelqu'un pouvait modifier un chèque directement, le solde du carnet serait faux.

**Règles des agrégats** :

1. **La racine contrôle tout** : seule la racine est accessible de l'extérieur.
2. **Les objets internes sont privés** : on ne retourne jamais une référence modifiable vers un objet interne.
3. **Un agrégat = une transaction** : on sauvegarde l'agrégat entier, jamais un morceau.
4. **Les références entre agrégats se font par ID** : un agrégat ne contient pas directement un autre agrégat. Il référence son ID.

**Implémentation en PHP** :

```php
<?php

namespace App\Domain\Entity;

use App\Domain\ValueObject\Montant;

// LigneCommande : entité interne de l'agrégat Commande
// Elle n'est PAS accessible directement de l'extérieur
class LigneCommande
{
    public function __construct(
        private string $id,
        private string $produitId,
        private string $nomProduit,
        private int $quantite,
        private Montant $prixUnitaire,
    ) {
        if ($quantite <= 0) {
            throw new \DomainException(
                'La quantité doit être supérieure à 0'
            );
        }
    }

    public function getSousTotal(): Montant
    {
        return $this->prixUnitaire->multiplier($this->quantite);
    }

    public function getId(): string { return $this->id; }
    public function getProduitId(): string { return $this->produitId; }
    public function getNomProduit(): string { return $this->nomProduit; }
    public function getQuantite(): int { return $this->quantite; }
    public function getPrixUnitaire(): Montant { return $this->prixUnitaire; }
}
```

```php
<?php

namespace App\Domain\Entity;

use App\Domain\ValueObject\Montant;

// Commande : racine de l'agrégat
// C'est le seul point d'entrée pour manipuler les lignes de commande
class Commande
{
    private string $id;
    /** @var LigneCommande[] */
    private array $lignes = [];
    private string $statut = 'brouillon';
    private \DateTimeImmutable $dateCreation;

    // L'agrégat référence un autre agrégat (Client) par son ID
    // Il ne contient PAS l'objet Client directement
    public function __construct(
        string $id,
        private string $clientId,
    ) {
        $this->id = $id;
        $this->dateCreation = new \DateTimeImmutable();
    }

    // Méthode métier : ajouter une ligne (passe par la racine)
    public function ajouterLigne(
        string $produitId,
        string $nomProduit,
        int $quantite,
        Montant $prixUnitaire,
    ): void {
        // Invariant : on ne peut pas modifier une commande confirmée
        if ($this->statut !== 'brouillon') {
            throw new \DomainException(
                'Impossible de modifier une commande qui n\'est plus en brouillon'
            );
        }

        // Invariant : maximum 20 lignes par commande
        if (count($this->lignes) >= 20) {
            throw new \DomainException(
                'Une commande ne peut pas avoir plus de 20 lignes'
            );
        }

        // Invariant : pas de doublon de produit
        foreach ($this->lignes as $ligne) {
            if ($ligne->getProduitId() === $produitId) {
                throw new \DomainException(
                    "Le produit '$nomProduit' est déjà dans la commande"
                );
            }
        }

        $this->lignes[] = new LigneCommande(
            id: uniqid('ligne_'),
            produitId: $produitId,
            nomProduit: $nomProduit,
            quantite: $quantite,
            prixUnitaire: $prixUnitaire,
        );
    }

    // Méthode métier : supprimer une ligne
    public function supprimerLigne(string $produitId): void
    {
        if ($this->statut !== 'brouillon') {
            throw new \DomainException(
                'Impossible de modifier une commande qui n\'est plus en brouillon'
            );
        }

        $this->lignes = array_values(array_filter(
            $this->lignes,
            fn (LigneCommande $l) => $l->getProduitId() !== $produitId,
        ));
    }

    // Méthode métier : calculer le total
    public function getTotal(): Montant
    {
        $total = new Montant(0, 'EUR');

        foreach ($this->lignes as $ligne) {
            $total = $total->additionner($ligne->getSousTotal());
        }

        return $total;
    }

    // Méthode métier : confirmer la commande
    public function confirmer(): void
    {
        if (empty($this->lignes)) {
            throw new \DomainException(
                'Impossible de confirmer une commande vide'
            );
        }

        if ($this->statut !== 'brouillon') {
            throw new \DomainException(
                "Impossible de confirmer : statut actuel = {$this->statut}"
            );
        }

        $this->statut = 'confirmee';
    }

    // Méthode métier : annuler la commande
    public function annuler(string $motif): void
    {
        if (!in_array($this->statut, ['brouillon', 'confirmee'])) {
            throw new \DomainException(
                "Impossible d'annuler : statut actuel = {$this->statut}"
            );
        }

        $this->statut = 'annulee';
    }

    // On retourne une COPIE du tableau, pas une référence
    // L'extérieur ne peut pas modifier les lignes directement
    /** @return LigneCommande[] */
    public function getLignes(): array
    {
        return $this->lignes;
    }

    public function getId(): string { return $this->id; }
    public function getClientId(): string { return $this->clientId; }
    public function getStatut(): string { return $this->statut; }
    public function getNombreLignes(): int { return count($this->lignes); }
}
```

---

### Les bounded contexts (Contextes délimités)

**Définition** : Un bounded context est une frontière explicite dans laquelle un modèle de domaine (avec son langage ubiquitaire) est défini et applicable. Un même terme peut avoir des significations différentes dans des bounded contexts différents.

**Le problème que les bounded contexts résolvent** :

Sans bounded contexts, voici les problèmes rencontrés :

1. **Modèle unique trop complexe** : une seule classe `Client` essaie de représenter le client dans tous les contextes (vente, facturation, support, livraison), avec des dizaines de propriétés et méthodes.
2. **Conflits de vocabulaire** : le mot "produit" signifie une chose pour le catalogue (nom, description, images) et autre chose pour la logistique (poids, dimensions, stock).
3. **Couplage entre équipes** : modifier le modèle pour un contexte casse le code d'un autre contexte.

**Comment les bounded contexts résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Modèle unique trop complexe | Chaque contexte a son propre modèle, simple et ciblé |
| Conflits de vocabulaire | Chaque contexte définit ses propres termes |
| Couplage entre équipes | Chaque équipe travaille dans son contexte sans impacter les autres |

**Analogie concrète** : Pense à un hôpital. Le mot "patient" a un sens différent selon le service. Pour les urgences, un patient a un niveau de gravité et un temps d'attente. Pour la facturation, un patient a un dossier d'assurance et des prestations. Pour le bloc opératoire, un patient a un dossier pré-opératoire et un planning. Chaque service (bounded context) a sa propre vision du patient, adaptée à ses besoins.

**Exemple concret** :

```text
Contexte "Catalogue" :
  Produit = { nom, description, images, categorie, prix_affiche }
  Le produit est présenté aux visiteurs.

Contexte "Logistique" :
  Produit = { reference, poids, dimensions, emplacement_stock, quantite }
  Le produit est stocké et expédié.

Contexte "Facturation" :
  Produit = { reference, prix_ht, taux_tva, remise_applicable }
  Le produit est facturé.

Ces trois "Produit" sont des classes DIFFÉRENTES dans des namespaces DIFFÉRENTS.
Ils communiquent entre eux via des identifiants (reference produit).
```

**Implémentation dans Symfony** :

```text
src/
├── Catalogue/                    ← Bounded Context "Catalogue"
│   ├── Domain/
│   │   └── Entity/
│   │       └── Produit.php       ← Produit du catalogue
│   ├── Application/
│   │   └── UseCase/
│   │       └── AjouterProduit.php
│   └── Infrastructure/
│       └── Controller/
│           └── ProduitController.php
│
├── Logistique/                   ← Bounded Context "Logistique"
│   ├── Domain/
│   │   └── Entity/
│   │       └── ArticleStock.php  ← Le "produit" vu par la logistique
│   ├── Application/
│   │   └── UseCase/
│   │       └── ExpedierColis.php
│   └── Infrastructure/
│       └── Controller/
│           └── ExpeditionController.php
│
└── Facturation/                  ← Bounded Context "Facturation"
    ├── Domain/
    │   └── Entity/
    │       └── LigneFacture.php  ← Le "produit" vu par la facturation
    ├── Application/
    │   └── UseCase/
    │       └── GenererFacture.php
    └── Infrastructure/
        └── Controller/
            └── FactureController.php
```

**Communication entre bounded contexts** :

```php
<?php

// Les bounded contexts communiquent via des événements ou des IDs
// Jamais par référence directe à un objet d'un autre contexte

// Dans le contexte Catalogue : quand un produit est créé
class ProduitCreeEvent
{
    public function __construct(
        // On partage l'ID, pas l'objet Produit
        public readonly string $produitId,
        public readonly string $nom,
        public readonly float $prixHT,
        public readonly float $poids,
    ) {
    }
}

// Dans le contexte Logistique : on écoute l'événement
class CreerArticleStockQuandProduitCree
{
    public function __invoke(ProduitCreeEvent $event): void
    {
        // On crée un ArticleStock (modèle local) à partir de l'événement
        $article = new ArticleStock(
            reference: $event->produitId,
            poids: $event->poids,
            quantiteInitiale: 0,
        );
        // ...
    }
}
```

---

### Les domain events (Événements de domaine)

**Définition** : Un domain event est un événement qui représente quelque chose d'important qui s'est passé dans le domaine métier. Les domain events sont nommés au passé ("CommandeConfirmee", "PaiementRecu") car ils décrivent un fait accompli.

**Le problème que les domain events résolvent** :

Sans domain events, voici les problèmes rencontrés :

1. **Effets de bord dans les méthodes** : confirmer une commande envoie un email, met à jour le stock et notifie le transporteur, tout dans la même méthode.
2. **Couplage entre contextes** : le contexte "Commande" doit connaître le contexte "Stock" et le contexte "Notification".
3. **Tests difficiles** : tester la confirmation oblige à mocker l'envoi d'email et la mise à jour du stock.

**Comment les domain events résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Effets de bord dans les méthodes | L'entité émet un événement, les listeners gèrent les effets |
| Couplage entre contextes | Les contextes communiquent via des événements |
| Tests difficiles | On teste l'entité sans les listeners |

**Implémentation en PHP** :

```php
<?php

namespace App\Domain\Event;

// Événement de domaine : la commande a été confirmée
class CommandeConfirmeeEvent
{
    public function __construct(
        public readonly string $commandeId,
        public readonly string $clientId,
        public readonly float $montantTotal,
        public readonly \DateTimeImmutable $dateConfirmation,
    ) {
    }
}
```

```php
<?php

namespace App\Domain\Entity;

use App\Domain\Event\CommandeConfirmeeEvent;

// L'entité collecte les événements sans les dispatcher
class Commande
{
    private array $evenements = [];

    // ... (propriétés et méthodes existantes)

    public function confirmer(): void
    {
        // Règles métier de confirmation...
        $this->statut = 'confirmee';

        // L'entité enregistre l'événement
        // Le dispatcher s'en occupera plus tard
        $this->evenements[] = new CommandeConfirmeeEvent(
            commandeId: $this->id,
            clientId: $this->clientId,
            montantTotal: $this->getTotal()->getValeur(),
            dateConfirmation: new \DateTimeImmutable(),
        );
    }

    // Les événements sont récupérés par le repository ou le use case
    public function recupererEvenements(): array
    {
        $evenements = $this->evenements;
        $this->evenements = [];
        return $evenements;
    }
}
```

---

## Étapes Pratiques

### Étape 1 : Créer les value objects du domaine

Crée les value objects suivants dans un projet Symfony :

```php
<?php

namespace App\Domain\ValueObject;

// Value Object pour une adresse email
class Email
{
    private string $adresse;

    public function __construct(string $adresse)
    {
        if (!filter_var($adresse, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException(
                "Email invalide : '$adresse'"
            );
        }

        $this->adresse = mb_strtolower($adresse);
    }

    public function estEgalA(self $autre): bool
    {
        return $this->adresse === $autre->adresse;
    }

    public function __toString(): string
    {
        return $this->adresse;
    }
}
```

```php
<?php

namespace App\Domain\ValueObject;

// Value Object pour un montant avec devise
class Montant
{
    public function __construct(
        private readonly float $valeur,
        private readonly string $devise = 'EUR',
    ) {
        if ($valeur < 0) {
            throw new \DomainException('Le montant ne peut pas être négatif');
        }
    }

    public function additionner(self $autre): self
    {
        if ($this->devise !== $autre->devise) {
            throw new \DomainException(
                "Devises incompatibles : {$this->devise} et {$autre->devise}"
            );
        }

        return new self($this->valeur + $autre->valeur, $this->devise);
    }

    public function multiplier(int $facteur): self
    {
        return new self($this->valeur * $facteur, $this->devise);
    }

    public function getValeur(): float { return $this->valeur; }
    public function getDevise(): string { return $this->devise; }
}
```

**Résultat attendu** :

```text
$email = new Email('Alice@Example.COM');
echo $email; // "alice@example.com"

$prix = new Montant(29.99, 'EUR');
$double = $prix->multiplier(2);
echo $double->getValeur(); // 59.98

// Erreur attendue :
$invalide = new Email('pas-un-email');
// Exception : "Email invalide : 'pas-un-email'"
```

---

### Étape 2 : Créer un agrégat avec ses invariants

```php
<?php

namespace App\Domain\Entity;

use App\Domain\ValueObject\Montant;

class Panier
{
    /** @var array<string, array{produitId: string, nom: string, quantite: int, prixUnitaire: Montant}> */
    private array $articles = [];

    public function __construct(
        private string $id,
        private string $clientId,
    ) {
    }

    // Invariant : quantite entre 1 et 99
    public function ajouterArticle(
        string $produitId,
        string $nom,
        int $quantite,
        Montant $prixUnitaire,
    ): void {
        if ($quantite < 1 || $quantite > 99) {
            throw new \DomainException(
                'La quantité doit être comprise entre 1 et 99'
            );
        }

        // Si l'article existe déjà, on met à jour la quantité
        if (isset($this->articles[$produitId])) {
            $nouvelleQuantite = $this->articles[$produitId]['quantite'] + $quantite;

            if ($nouvelleQuantite > 99) {
                throw new \DomainException(
                    "Quantite maximale atteinte pour '$nom'"
                );
            }

            $this->articles[$produitId]['quantite'] = $nouvelleQuantite;
            return;
        }

        // Invariant : maximum 50 articles différents
        if (count($this->articles) >= 50) {
            throw new \DomainException(
                'Le panier ne peut pas contenir plus de 50 articles différents'
            );
        }

        $this->articles[$produitId] = [
            'produitId' => $produitId,
            'nom' => $nom,
            'quantite' => $quantite,
            'prixUnitaire' => $prixUnitaire,
        ];
    }

    public function supprimerArticle(string $produitId): void
    {
        if (!isset($this->articles[$produitId])) {
            throw new \DomainException('Article non trouvé dans le panier');
        }

        unset($this->articles[$produitId]);
    }

    public function getTotal(): Montant
    {
        $total = new Montant(0, 'EUR');

        foreach ($this->articles as $article) {
            $sousTotal = $article['prixUnitaire']->multiplier($article['quantite']);
            $total = $total->additionner($sousTotal);
        }

        return $total;
    }

    public function estVide(): bool
    {
        return empty($this->articles);
    }

    public function getNombreArticles(): int
    {
        return count($this->articles);
    }

    public function getId(): string { return $this->id; }
    public function getClientId(): string { return $this->clientId; }
}
```

**Résultat attendu** :

```text
$panier = new Panier('panier_1', 'client_42');

$panier->ajouterArticle('prod_1', 'Clavier', 1, new Montant(49.99, 'EUR'));
$panier->ajouterArticle('prod_2', 'Souris', 2, new Montant(29.99, 'EUR'));

echo $panier->getTotal()->getValeur(); // 109.97
echo $panier->getNombreArticles();     // 2

// Invariant respecté :
$panier->ajouterArticle('prod_1', 'Clavier', 100, new Montant(49.99, 'EUR'));
// Exception : "Quantite maximale atteinte pour 'Clavier'"
```

---

### Étape 3 : Implémenter un repository pour l'agrégat

```php
<?php

namespace App\Application\Port;

use App\Domain\Entity\Commande;

// Port (interface) défini dans la couche Application
interface CommandeRepositoryPort
{
    public function sauvegarder(Commande $commande): void;
    public function trouverParId(string $id): ?Commande;
    public function trouverParClient(string $clientId): array;
    public function prochainId(): string;
}
```

```php
<?php

namespace App\Infrastructure\Persistence;

use App\Application\Port\CommandeRepositoryPort;
use App\Domain\Entity\Commande;

// Adapter en mémoire pour les tests
class InMemoryCommandeRepository implements CommandeRepositoryPort
{
    /** @var Commande[] */
    private array $commandes = [];
    private int $sequence = 0;

    public function sauvegarder(Commande $commande): void
    {
        $this->commandes[$commande->getId()] = $commande;
    }

    public function trouverParId(string $id): ?Commande
    {
        return $this->commandes[$id] ?? null;
    }

    public function trouverParClient(string $clientId): array
    {
        return array_filter(
            $this->commandes,
            fn (Commande $c) => $c->getClientId() === $clientId,
        );
    }

    public function prochainId(): string
    {
        $this->sequence++;
        return 'cmd_' . str_pad((string) $this->sequence, 6, '0', STR_PAD_LEFT);
    }
}
```

**Résultat attendu** :

```text
$repo = new InMemoryCommandeRepository();

$id = $repo->prochainId(); // "cmd_000001"
$commande = new Commande($id, 'client_42');
$commande->ajouterLigne('prod_1', 'Clavier', 1, new Montant(49.99, 'EUR'));

$repo->sauvegarder($commande);

$retrouvee = $repo->trouverParId('cmd_000001');
// $retrouvee est la même commande
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `php bin/console debug:container --types` | Voir les interfaces et leurs implémentations |
| `php bin/console debug:autowiring` | Vérifier le câblage des ports |
| `vendor/bin/phpunit tests/Domain/` | Tester les entités et value objects |
| `vendor/bin/phpstan analyse src/Domain/` | Vérifier que le domaine n'a pas de dépendances externes |

---

## Pièges Fréquents

### Piège 1 : Entités anémiques

⚠️ **Problème** : Tu crées des entités avec uniquement des getters et des setters, sans aucune logique métier. La logique se retrouve dans des services externes.

✅ **Solution** : Les entités doivent contenir les règles métier qui les concernent. Un setter `setStatut()` doit être remplacé par des méthodes métier `confirmer()`, `annuler()`, `expedier()`.

```php
// ❌ Entite anemique (pas de logique metier)
class Commande
{
    public function setStatut(string $statut): void
    {
        $this->statut = $statut; // Pas de validation
    }
}

// ✅ Entite riche (logique metier dans l'entite)
class Commande
{
    public function confirmer(): void
    {
        if (empty($this->lignes)) {
            throw new \DomainException('Commande vide');
        }
        $this->statut = 'confirmee';
    }
}
```

### Piège 2 : Value object mutable

⚠️ **Problème** : Tu crées un value object avec un setter qui modifie l'objet en place. Cela casse l'immuabilité et peut créer des bugs difficiles à trouver.

✅ **Solution** : Les value objects ne doivent jamais être modifiés. Chaque opération retourne un nouvel objet.

```php
// ❌ Value object mutable
class Montant
{
    public function ajouter(float $valeur): void
    {
        $this->valeur += $valeur; // Modifie l'objet existant
    }
}

// ✅ Value object immuable
class Montant
{
    public function additionner(self $autre): self
    {
        return new self($this->valeur + $autre->valeur, $this->devise);
    }
}
```

### Piège 3 : Agrégat trop gros

⚠️ **Problème** : Tu crées un agrégat qui contient tout : commande, client, produits, facture, livraison. L'agrégat devient trop gros et les performances souffrent.

✅ **Solution** : Un agrégat doit être le plus petit possible. Les références entre agrégats se font par ID, pas par objet.

```php
// ❌ Agregat trop gros
class Commande
{
    private Client $client;           // Objet complet
    private array $produits;          // Objets complets
    private Facture $facture;         // Objet complet
}

// ✅ Agregat minimal avec references par ID
class Commande
{
    private string $clientId;         // Reference par ID
    private array $lignes;            // Lignes internes (meme agregat)
    // La facture est un autre agregat, reference par ID si besoin
}
```

---

## Checklist de Validation

- [ ] Je sais expliquer ce qu'est le DDD en une phrase
- [ ] Je sais définir et utiliser le langage ubiquitaire
- [ ] Je sais créer un value object immuable avec validation dans le constructeur
- [ ] Je sais distinguer une entité d'un value object
- [ ] Je sais créer un agrégat avec une racine qui protège les invariants
- [ ] Je sais identifier les bounded contexts d'une application
- [ ] Je comprends les domain events et leur utilité
- [ ] Je sais quand le DDD est justifié et quand il est excessif

---

## Exercice Pratique

**Énoncé** : Modélise un système de réservation de salles de réunion en utilisant les concepts DDD.

**Instructions** :

1. Identifie les bounded contexts (au moins 2)
2. Crée un value object `CreneauHoraire` (date, heure début, heure fin) avec validation
3. Crée un agrégat `Salle` avec une méthode `reserver(CreneauHoraire, string $organisateurId)` qui vérifie qu'il n'y a pas de conflit
4. Crée un domain event `SalleReserveeEvent`

**Résultat attendu** : Un agrégat `Salle` qui protège l'invariant "pas de réservation en conflit".

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**1. Bounded contexts identifiés** :

```text
Contexte "Reservation" :
  Salle = { id, nom, capacite, reservations[] }
  CreneauHoraire = { date, heureDebut, heureFin }
  Reservation = { creneauHoraire, organisateurId }

Contexte "Annuaire" :
  Salle = { id, nom, etage, equipements[] }
  Les informations d'equipement (videoprojecteur, visio, etc.)
  ne concernent pas le contexte de reservation.
```

**2. Value object CreneauHoraire** :

```php
<?php

namespace App\Domain\ValueObject;

class CreneauHoraire
{
    public function __construct(
        private readonly \DateTimeImmutable $date,
        private readonly string $heureDebut,
        private readonly string $heureFin,
    ) {
        // Validation : l'heure de fin doit être après l'heure de début
        if ($heureDebut >= $heureFin) {
            throw new \DomainException(
                "L'heure de fin ($heureFin) doit être après l'heure de début ($heureDebut)"
            );
        }

        // Validation : créneaux entre 8h et 20h
        if ($heureDebut < '08:00' || $heureFin > '20:00') {
            throw new \DomainException(
                'Les réservations sont possibles entre 08:00 et 20:00'
            );
        }
    }

    // Vérifie si deux créneaux se chevauchent
    public function chevauche(self $autre): bool
    {
        // Meme date ?
        if ($this->date->format('Y-m-d') !== $autre->date->format('Y-m-d')) {
            return false;
        }

        // Chevauchement : debut1 < fin2 ET debut2 < fin1
        return $this->heureDebut < $autre->heureFin
            && $autre->heureDebut < $this->heureFin;
    }

    public function getDate(): \DateTimeImmutable { return $this->date; }
    public function getHeureDebut(): string { return $this->heureDebut; }
    public function getHeureFin(): string { return $this->heureFin; }
}
```

**3. Agrégat Salle** :

```php
<?php

namespace App\Domain\Entity;

use App\Domain\Event\SalleReserveeEvent;
use App\Domain\ValueObject\CreneauHoraire;

class Reservation
{
    public function __construct(
        private string $id,
        private CreneauHoraire $creneau,
        private string $organisateurId,
    ) {
    }

    public function getCreneau(): CreneauHoraire { return $this->creneau; }
    public function getOrganisateurId(): string { return $this->organisateurId; }
}

class Salle
{
    /** @var Reservation[] */
    private array $reservations = [];
    private array $evenements = [];

    public function __construct(
        private string $id,
        private string $nom,
        private int $capacite,
    ) {
    }

    public function reserver(
        CreneauHoraire $creneau,
        string $organisateurId,
    ): void {
        // Invariant : pas de conflit de réservation
        foreach ($this->reservations as $reservation) {
            if ($reservation->getCreneau()->chevauche($creneau)) {
                throw new \DomainException(
                    "La salle '{$this->nom}' est déjà réservée sur ce créneau"
                );
            }
        }

        $reservationId = uniqid('resa_');

        $this->reservations[] = new Reservation(
            id: $reservationId,
            creneau: $creneau,
            organisateurId: $organisateurId,
        );

        // Émettre un domain event
        $this->evenements[] = new SalleReserveeEvent(
            salleId: $this->id,
            reservationId: $reservationId,
            organisateurId: $organisateurId,
            date: $creneau->getDate()->format('Y-m-d'),
            heureDebut: $creneau->getHeureDebut(),
            heureFin: $creneau->getHeureFin(),
        );
    }

    public function recupererEvenements(): array
    {
        $evenements = $this->evenements;
        $this->evenements = [];
        return $evenements;
    }

    public function getId(): string { return $this->id; }
    public function getNom(): string { return $this->nom; }
}
```

**4. Domain event** :

```php
<?php

namespace App\Domain\Event;

class SalleReserveeEvent
{
    public function __construct(
        public readonly string $salleId,
        public readonly string $reservationId,
        public readonly string $organisateurId,
        public readonly string $date,
        public readonly string $heureDebut,
        public readonly string $heureFin,
    ) {
    }
}
```

**5. Test** :

```php
<?php

$salle = new Salle('salle_1', 'Salle A', 10);
$lundi = new \DateTimeImmutable('2026-03-23');

// Première réservation : OK
$salle->reserver(
    new CreneauHoraire($lundi, '09:00', '10:00'),
    'user_1',
);

// Deuxième réservation, pas de conflit : OK
$salle->reserver(
    new CreneauHoraire($lundi, '10:00', '11:00'),
    'user_2',
);

// Conflit : ERREUR
$salle->reserver(
    new CreneauHoraire($lundi, '09:30', '10:30'),
    'user_3',
);
// Exception : "La salle 'Salle A' est déjà réservée sur ce créneau"
```

---

## Navigation

← Fiche précédente : **[Clean Architecture](08-clean-architecture.md)**

→ Fiche suivante : **[Patterns JavaScript](10-patterns-javascript.md)**
