---
tags:
  - PHP
  - Avancé
  - Pratique
description: "Les classes en détail"
estimated_time: "60 min"
fiche_number: 8
total_fiches: 14
cursus: "PHP"
id: "web.php.classes-en-detail"
course_id: "web.php"
content_type: "lesson"
order: 8
---

# 08 - Les classes en détail

> **En bref** : À la fin de cette fiche, tu sauras créer des classes complètes avec constructeur, getters et setters, et tu comprendras la visibilité (public, private, protected). Ces concepts sont utilisés dans toutes les classes Symfony. Lecture estimée : 60 min.


## Prérequis

- Fiche [02-php/07 - Introduction à la programmation orientée objet](07-introduction-poo.md) (POO)
- Savoir créer une classe avec des propriétés et des méthodes
- Savoir créer des objets avec `new` et utiliser `$this`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des classes complètes avec constructeur, getters et setters, et tu comprendras la visibilité (public, private, protected). Ces concepts sont utilisés dans toutes les classes Symfony.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### La visibilité des propriétés et méthodes

**Définition** : La visibilité détermine qui peut accéder à une propriété ou une méthode. PHP propose trois niveaux de visibilité.

**Analogie concrète** : Imagine un immeuble. `public`, c'est le hall d'entrée : tout le monde peut y accéder. `private`, c'est l'intérieur de ton appartement : seul toi y as accès. `protected`, c'est les parties communes de ton étage : toi et tes voisins directs (les classes enfants) y avez accès.

Le diagramme suivant résume les trois niveaux de visibilité en PHP :

<div class="diagram-design">
<p><a href="../../diagrams/02-php-08-classes-en-detail-1.html">La visibilité des propriétés et méthodes (HTML + SVG)</a></p>
<iframe src="../../diagrams/02-php-08-classes-en-detail-1.html" title="La visibilité des propriétés et méthodes" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Les trois niveaux de visibilité** :

| Mot-clé | Accès depuis | Utilisation |
| ------- | ------------ | ----------- |
| `public` | Partout | Propriétés/méthodes accessibles de l'extérieur |
| `private` | Uniquement la classe | Données internes cachées |
| `protected` | Classe et ses enfants | Pour l'héritage (hors scope de cette fiche) |

**Pourquoi utiliser private ?**

Le problème avec `public` :

```php
<?php
class CompteBancaire
{
    public $solde = 0;
}

$compte = new CompteBancaire();
$compte->solde = -1000000;  // Problème : on peut mettre un solde négatif !
```

La solution avec `private` :

```php
<?php
class CompteBancaire
{
    private $solde = 0;  // Inaccessible directement

    public function deposer($montant)
    {
        if ($montant > 0) {
            $this->solde += $montant;
        }
    }

    public function getSolde()
    {
        return $this->solde;
    }
}

$compte = new CompteBancaire();
// $compte->solde = -1000000;  // Erreur ! Propriété privée
$compte->deposer(100);  // Seul moyen d'ajouter de l'argent
echo $compte->getSolde();  // Seul moyen de lire le solde
```

**Règle générale** : Par défaut, mets les propriétés en `private` et crée des méthodes pour y accéder de manière contrôlée.

---

### Le constructeur (__construct)

**Définition** : Le constructeur est une méthode spéciale qui s'exécute automatiquement quand tu crées un objet avec `new`. Il sert à initialiser l'objet.

**Analogie concrète** : Quand tu achètes un nouveau téléphone, il arrive avec un écran de configuration initiale qui te demande ta langue, ton compte et ton mot de passe Wi-Fi. Tu ne peux pas utiliser le téléphone tant que cette étape n'est pas terminée. Le constructeur, c'est cet écran de configuration : il s'exécute automatiquement et garantit que l'objet est prêt à l'emploi.

**Syntaxe** :

```php
<?php
class User
{
    private $nom;
    private $email;

    public function __construct($nom, $email)
    {
        $this->nom = $nom;
        $this->email = $email;
    }
}

// Le constructeur est appelé automatiquement
$user = new User("Hugo", "alex@example.com");
```

**Le problème que le constructeur résout** :

Sans constructeur, tu dois initialiser chaque propriété manuellement :

```php
<?php
// Sans constructeur (fastidieux et risque d'oublier)
$user = new User();
$user->nom = "Hugo";
$user->email = "alex@example.com";
// Risque : si tu oublies de définir nom, l'objet est incomplet
```

Avec constructeur :

```php
<?php
// Avec constructeur (obligatoire et en une ligne)
$user = new User("Hugo", "alex@example.com");
// Impossible de créer un User sans nom et email
```

**Avantages du constructeur** :

| Aspect | Sans constructeur | Avec constructeur |
| ------ | ----------------- | ----------------- |
| Initialisation | Manuelle, peut être oubliée | Automatique et obligatoire |
| Validation | Aucune | Possible dans le constructeur |
| Lisibilité | Plusieurs lignes | Une seule ligne |
| Objet valide | Risque d'objet incomplet | Toujours complet |

---

### Promotion des propriétés dans le constructeur (PHP 8+)

**Définition** : PHP 8 permet de déclarer et initialiser les propriétés directement dans les paramètres du constructeur. C'est plus concis.

**Analogie concrète** : Quand tu remplis un formulaire en ligne, certains sites te demandent de saisir ton adresse, puis de la recopier dans un second champ "adresse de livraison". D'autres sites cochent automatiquement "adresse de livraison identique". La promotion de propriétés, c'est cette case cochée : au lieu de déclarer la propriété puis de l'assigner dans le constructeur, PHP le fait en une seule étape.

**Syntaxe classique** (avant PHP 8) :

```php
<?php
class User
{
    private string $nom;
    private string $email;
    private int $age;

    public function __construct(string $nom, string $email, int $age)
    {
        $this->nom = $nom;
        $this->email = $email;
        $this->age = $age;
    }
}
```

**Syntaxe avec promotion** (PHP 8+) :

```php
<?php
class User
{
    public function __construct(
        private string $nom,
        private string $email,
        private int $age
    ) {
        // Le corps peut être vide !
        // Les propriétés sont automatiquement créées et assignées
    }
}
```

Les deux syntaxes produisent le même résultat. La promotion est plus courte.

**Note** : Symfony et Doctrine utilisent souvent la promotion de propriétés.

---

### Les getters et setters

**Définition** : Les getters et setters sont des méthodes qui permettent de lire (get) ou modifier (set) les propriétés privées de manière contrôlée.

**Analogie concrète** : Imagine un distributeur automatique de billets. Tu ne peux pas ouvrir le coffre pour te servir (accès direct). Tu passes par l'écran et le clavier (les getters et setters) qui vérifient ton code PIN et ton solde avant de te donner de l'argent. Le distributeur contrôle ce qui entre et ce qui sort.

**Pourquoi les utiliser ?**

1. **Contrôle** : Tu peux valider les données avant de les stocker
2. **Encapsulation** : Le code externe ne connaît pas la structure interne
3. **Flexibilité** : Tu peux changer l'implémentation sans casser le code qui utilise la classe

**Convention de nommage** :

| Type | Convention | Exemple |
| ---- | ---------- | ------- |
| Getter | `getNomPropriete()` | `getNom()`, `getEmail()` |
| Setter | `setNomPropriete($valeur)` | `setNom($nom)`, `setEmail($email)` |
| Getter boolean | `isNomPropriete()` | `isActif()`, `isPublie()` |

**Exemple complet** :

```php
<?php
class User
{
    private string $nom;
    private int $age;
    private bool $actif = true;

    // Getter pour nom
    public function getNom(): string
    {
        return $this->nom;
    }

    // Setter pour nom avec validation
    public function setNom(string $nom): void
    {
        if (strlen($nom) < 2) {
            throw new Exception("Le nom doit avoir au moins 2 caractères");
        }
        $this->nom = $nom;
    }

    // Getter pour age
    public function getAge(): int
    {
        return $this->age;
    }

    // Setter pour age avec validation
    public function setAge(int $age): void
    {
        if ($age < 0 || $age > 150) {
            throw new Exception("L'âge doit être entre 0 et 150");
        }
        $this->age = $age;
    }

    // Getter pour boolean (is au lieu de get)
    public function isActif(): bool
    {
        return $this->actif;
    }

    // Setter pour actif
    public function setActif(bool $actif): void
    {
        $this->actif = $actif;
    }
}
```

**Utilisation** :

```php
<?php
$user = new User();
$user->setNom("Hugo");
$user->setAge(23);

echo $user->getNom();   // Hugo
echo $user->getAge();   // 23
echo $user->isActif();  // true (1)
```

---

### Le pattern fluent (retourner `$this`)

**Définition** : En retournant `$this` dans les setters, tu peux chaîner les appels de méthodes.

**Analogie concrète** : Quand tu commandes un burger dans un fast-food, tu peux enchaîner les choix sans reprendre depuis le début : "Je veux un burger, avec supplément fromage, sans oignons, menu large." Chaque choix s'ajoute au précédent. Le pattern fluent fonctionne pareil : chaque méthode renvoie l'objet pour que tu puisses enchaîner la suivante.

**Syntaxe** :

```php
<?php
class User
{
    private string $nom;
    private string $email;

    public function setNom(string $nom): self
    {
        $this->nom = $nom;
        return $this;  // Retourne l'objet lui-même
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }
}

// Chaînage possible
$user = new User();
$user->setNom("Hugo")
     ->setEmail("alex@example.com");
```

**Note** : `self` comme type de retour signifie "la classe actuelle". C'est équivalent à retourner un `User` dans ce cas.

---

### Les constantes de classe

**Définition** : Une constante de classe est une valeur fixe qui ne peut pas changer. Elle appartient à la classe, pas aux objets.

**Analogie concrète** : Dans un immeuble, le nombre d'étages est une constante : il ne change pas selon l'appartement dans lequel tu te trouves. Que tu sois au 3e ou au 5e étage, l'immeuble a toujours le même nombre total d'étages. C'est une information qui appartient au bâtiment (la classe), pas à un appartement particulier (l'objet).

**Syntaxe** :

```php
<?php
class Configuration
{
    public const VERSION = "1.0.0";
    public const MAX_USERS = 100;
    private const SECRET_KEY = "abc123";  // Peut aussi être private
}

// Accès sans créer d'objet (utilise :: au lieu de ->)
echo Configuration::VERSION;     // 1.0.0
echo Configuration::MAX_USERS;   // 100
```

**Différence entre propriété et constante** :

| Propriété | Constante |
| --------- | --------- |
| Peut changer | Ne peut jamais changer |
| Appartient à l'objet | Appartient à la classe |
| Accès avec `$objet->prop` | Accès avec `Classe::CONST` |
| Commence par `$` | Pas de `$` |

**Utilisation courante** : Les constantes sont souvent utilisées pour les statuts, les codes d'erreur, les limites.

```php
<?php
class Article
{
    public const STATUS_DRAFT = 'draft';
    public const STATUS_PUBLISHED = 'published';
    public const STATUS_ARCHIVED = 'archived';

    private string $status = self::STATUS_DRAFT;

    public function getStatus(): string
    {
        return $this->status;
    }

    public function publish(): void
    {
        $this->status = self::STATUS_PUBLISHED;
    }
}
```

---

### Les méthodes statiques

**Définition** : Une méthode statique appartient à la classe, pas aux objets. Elle peut être appelée sans créer d'objet.

**Analogie concrète** : Une calculatrice accrochée au mur d'un bureau est partagée par tout le monde. Personne n'a besoin de l'emporter à son poste (créer un objet) pour l'utiliser : on va directement au mur (la classe) et on fait le calcul. La calculatrice n'a pas besoin de connaître qui l'utilise pour fonctionner.

**Syntaxe** :

```php
<?php
class MathUtils
{
    public static function addition(int $a, int $b): int
    {
        return $a + $b;
    }

    public static function multiplication(int $a, int $b): int
    {
        return $a * $b;
    }
}

// Appel sans créer d'objet
$somme = MathUtils::addition(5, 3);      // 8
$produit = MathUtils::multiplication(4, 7);  // 28
```

**Règle importante** : Une méthode statique ne peut pas utiliser `$this` car elle n'appartient pas à un objet.

```php
<?php
class Exemple
{
    private $valeur = 10;

    public static function methodeStatique()
    {
        // echo $this->valeur;  // ERREUR ! Pas de $this en statique
    }
}
```

**Quand utiliser les méthodes statiques** :

| Utilise statique | N'utilise pas statique |
| ---------------- | ---------------------- |
| Utilitaires (calculs, conversions) | Besoin des données de l'objet |
| Factory methods (créer des objets) | Besoin de `$this` |
| Pas besoin d'état | L'objet a un état qui change |

---

## Étapes Pratiques

### Étape 1 : Classe avec visibilité private

Crée un fichier `public/visibilite.php` :

```php
<?php
class CompteBancaire
{
    private float $solde = 0;
    private string $titulaire;

    public function __construct(string $titulaire)
    {
        $this->titulaire = $titulaire;
    }

    public function deposer(float $montant): void
    {
        if ($montant <= 0) {
            echo "<p style='color: red;'>Erreur : le montant doit être positif.</p>";
            return;
        }
        $this->solde += $montant;
        echo "<p>Dépôt de " . $montant . "€ effectué.</p>";
    }

    public function retirer(float $montant): void
    {
        if ($montant <= 0) {
            echo "<p style='color: red;'>Erreur : le montant doit être positif.</p>";
            return;
        }
        if ($montant > $this->solde) {
            echo "<p style='color: red;'>Erreur : solde insuffisant.</p>";
            return;
        }
        $this->solde -= $montant;
        echo "<p>Retrait de " . $montant . "€ effectué.</p>";
    }

    public function getSolde(): float
    {
        return $this->solde;
    }

    public function getTitulaire(): string
    {
        return $this->titulaire;
    }
}

echo "<h1>Compte bancaire avec visibilité</h1>";

$compte = new CompteBancaire("Hugo Martin");

echo "<p>Titulaire : " . $compte->getTitulaire() . "</p>";
echo "<p>Solde initial : " . $compte->getSolde() . "€</p>";

// Tentative d'accès direct (échouerait si décommentée)
// $compte->solde = 1000000;  // Erreur : propriété privée

echo "<hr>";
echo "<h2>Opérations</h2>";

$compte->deposer(500);
echo "<p>Solde : " . $compte->getSolde() . "€</p>";

$compte->retirer(200);
echo "<p>Solde : " . $compte->getSolde() . "€</p>";

$compte->retirer(1000);  // Échec : solde insuffisant
echo "<p>Solde : " . $compte->getSolde() . "€</p>";

$compte->deposer(-50);   // Échec : montant négatif
```

**Résultat attendu** :

```text
Compte bancaire avec visibilité

Titulaire : Hugo Martin
Solde initial : 0€

---

Opérations

Dépôt de 500€ effectué.
Solde : 500€

Retrait de 200€ effectué.
Solde : 300€

Erreur : solde insuffisant.
Solde : 300€

Erreur : le montant doit être positif.
```

---

### Étape 2 : Classe avec constructeur complet

Crée un fichier `public/constructeur.php` :

```php
<?php
class Produit
{
    private string $nom;
    private float $prix;
    private int $stock;
    private string $categorie;

    public function __construct(
        string $nom,
        float $prix,
        int $stock = 0,
        string $categorie = "Général"
    ) {
        $this->nom = $nom;
        $this->prix = $prix;
        $this->stock = $stock;
        $this->categorie = $categorie;
    }

    public function getNom(): string
    {
        return $this->nom;
    }

    public function getPrix(): float
    {
        return $this->prix;
    }

    public function getStock(): int
    {
        return $this->stock;
    }

    public function getCategorie(): string
    {
        return $this->categorie;
    }

    public function getPrixFormate(): string
    {
        return number_format($this->prix, 2, ",", " ") . " €";
    }

    public function estDisponible(): bool
    {
        return $this->stock > 0;
    }
}

echo "<h1>Produits avec constructeur</h1>";

// Création avec tous les paramètres
$laptop = new Produit("Laptop Pro", 1299.99, 10, "Informatique");

// Création avec paramètres par défaut
$cable = new Produit("Câble USB", 9.99);

// Création avec stock mais catégorie par défaut
$souris = new Produit("Souris sans fil", 29.99, 25);

$produits = [$laptop, $cable, $souris];

echo "<table border='1' cellpadding='10'>";
echo "<tr><th>Nom</th><th>Prix</th><th>Stock</th><th>Catégorie</th><th>Disponible</th></tr>";

foreach ($produits as $produit) {
    echo "<tr>";
    echo "<td>" . $produit->getNom() . "</td>";
    echo "<td>" . $produit->getPrixFormate() . "</td>";
    echo "<td>" . $produit->getStock() . "</td>";
    echo "<td>" . $produit->getCategorie() . "</td>";
    echo "<td>" . ($produit->estDisponible() ? "Oui" : "Non") . "</td>";
    echo "</tr>";
}

echo "</table>";
```

**Résultat attendu** : Un tableau avec les 3 produits et leurs informations.

---

### Étape 3 : Getters et Setters avec validation

Crée un fichier `public/getters-setters.php` :

```php
<?php
class Utilisateur
{
    private string $email;
    private int $age;
    private string $motDePasse;

    public function __construct(string $email)
    {
        $this->setEmail($email);  // Utilise le setter pour valider
    }

    // Getter email
    public function getEmail(): string
    {
        return $this->email;
    }

    // Setter email avec validation
    public function setEmail(string $email): self
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Email invalide : " . $email);
        }
        $this->email = $email;
        return $this;
    }

    // Getter age
    public function getAge(): int
    {
        return $this->age;
    }

    // Setter age avec validation
    public function setAge(int $age): self
    {
        if ($age < 0 || $age > 150) {
            throw new InvalidArgumentException("Âge invalide : " . $age);
        }
        $this->age = $age;
        return $this;
    }

    // Setter mot de passe (pas de getter pour sécurité)
    public function setMotDePasse(string $motDePasse): self
    {
        if (strlen($motDePasse) < 8) {
            throw new InvalidArgumentException("Le mot de passe doit avoir au moins 8 caractères");
        }
        // On hashe le mot de passe avec password_hash avant de le stocker (jamais en clair)
        $this->motDePasse = password_hash($motDePasse, PASSWORD_DEFAULT);
        return $this;
    }

    // Vérifier le mot de passe (au lieu de le retourner)
    public function verifierMotDePasse(string $motDePasse): bool
    {
        return password_verify($motDePasse, $this->motDePasse);
    }
}

echo "<h1>Getters et Setters avec validation</h1>";

// try/catch utilise InvalidArgumentException (classe fournie par PHP).
// Le détail des exceptions est dans la fiche 13.
try {
    // Création avec chaînage
    $user = new Utilisateur("alex@example.com");
    $user->setAge(23)
         ->setMotDePasse("monmotdepasse123");

    echo "<p>Email : " . $user->getEmail() . "</p>";
    echo "<p>Âge : " . $user->getAge() . " ans</p>";

    // Vérification du mot de passe
    echo "<p>Mot de passe 'test' correct ? " . ($user->verifierMotDePasse("test") ? "Oui" : "Non") . "</p>";
    echo "<p>Mot de passe 'monmotdepasse123' correct ? " . ($user->verifierMotDePasse("monmotdepasse123") ? "Oui" : "Non") . "</p>";

    echo "<hr>";
    echo "<h2>Test de validation</h2>";

    // Test avec email invalide
    echo "<p>Tentative de créer un utilisateur avec email invalide...</p>";
    $userInvalide = new Utilisateur("pas-un-email");

} catch (InvalidArgumentException $e) {
    echo "<p style='color: red;'>Erreur : " . $e->getMessage() . "</p>";
}
```

**Résultat attendu** :

```text
Getters et Setters avec validation

Email : alex@example.com
Âge : 23 ans
Mot de passe 'test' correct ? Non
Mot de passe 'monmotdepasse123' correct ? Oui

---

Test de validation

Tentative de créer un utilisateur avec email invalide...
Erreur : Email invalide : pas-un-email
```

---

### Étape 4 : Constantes et méthodes statiques

Crée un fichier `public/statique.php` :

```php
<?php
class Article
{
    // Constantes pour les statuts
    public const STATUS_DRAFT = 'draft';
    public const STATUS_REVIEW = 'review';
    public const STATUS_PUBLISHED = 'published';

    private string $titre;
    private string $status;

    public function __construct(string $titre)
    {
        $this->titre = $titre;
        $this->status = self::STATUS_DRAFT;
    }

    public function getTitre(): string
    {
        return $this->titre;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function getStatusLabel(): string
    {
        // Utilise la méthode statique
        return self::getStatusLabels()[$this->status];
    }

    public function soumettrePourRevue(): void
    {
        $this->status = self::STATUS_REVIEW;
    }

    public function publier(): void
    {
        $this->status = self::STATUS_PUBLISHED;
    }

    // Méthode statique : accessible sans objet
    public static function getStatusLabels(): array
    {
        return [
            self::STATUS_DRAFT => 'Brouillon',
            self::STATUS_REVIEW => 'En révision',
            self::STATUS_PUBLISHED => 'Publié'
        ];
    }

    // Factory method statique
    public static function creerBrouillon(string $titre): self
    {
        return new self($titre);
    }

    public static function creerEtPublier(string $titre): self
    {
        $article = new self($titre);
        $article->publier();
        return $article;
    }
}

echo "<h1>Constantes et méthodes statiques</h1>";

// Accès aux constantes sans objet
echo "<h2>Constantes de statut</h2>";
echo "<p>STATUS_DRAFT = '" . Article::STATUS_DRAFT . "'</p>";
echo "<p>STATUS_REVIEW = '" . Article::STATUS_REVIEW . "'</p>";
echo "<p>STATUS_PUBLISHED = '" . Article::STATUS_PUBLISHED . "'</p>";

// Méthode statique sans objet
echo "<h2>Labels des statuts</h2>";
echo "<pre>";
print_r(Article::getStatusLabels());
echo "</pre>";

// Création avec factory method
echo "<h2>Articles créés avec factory methods</h2>";

$article1 = Article::creerBrouillon("Mon premier article");
$article2 = Article::creerEtPublier("Article déjà publié");

echo "<p>Article 1 : " . $article1->getTitre() . " - " . $article1->getStatusLabel() . "</p>";
echo "<p>Article 2 : " . $article2->getTitre() . " - " . $article2->getStatusLabel() . "</p>";

// Progression d'un article
echo "<h2>Workflow d'un article</h2>";
$article3 = new Article("Article en progression");
echo "<p>Création : " . $article3->getStatusLabel() . "</p>";

$article3->soumettrePourRevue();
echo "<p>Après soumission : " . $article3->getStatusLabel() . "</p>";

$article3->publier();
echo "<p>Après publication : " . $article3->getStatusLabel() . "</p>";
```

**Résultat attendu** :

```text
Constantes et méthodes statiques

Constantes de statut
STATUS_DRAFT = 'draft'
STATUS_REVIEW = 'review'
STATUS_PUBLISHED = 'published'

Labels des statuts
Array
(
    [draft] => Brouillon
    [review] => En révision
    [published] => Publié
)

Articles créés avec factory methods
Article 1 : Mon premier article - Brouillon
Article 2 : Article déjà publié - Publié

Workflow d'un article
Création : Brouillon
Après soumission : En révision
Après publication : Publié
```

---

### Étape 5 : Classe complète style Doctrine

Crée un fichier `public/entite.php` :

```php
<?php
/**
 * Exemple de classe qui ressemble à une entité Doctrine
 * (sans les attributs pour l'instant)
 */
class Product
{
    private ?int $id = null;
    private string $name;
    private ?string $description = null;
    private float $price;
    private int $stock = 0;
    private bool $active = true;
    private \DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    // ID (pas de setter, géré par la BDD)
    public function getId(): ?int
    {
        return $this->id;
    }

    // Name
    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    // Description
    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;
        return $this;
    }

    // Price
    public function getPrice(): float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;
        return $this;
    }

    // Stock
    public function getStock(): int
    {
        return $this->stock;
    }

    public function setStock(int $stock): self
    {
        $this->stock = $stock;
        return $this;
    }

    // Active (boolean avec is)
    public function isActive(): bool
    {
        return $this->active;
    }

    public function setActive(bool $active): self
    {
        $this->active = $active;
        return $this;
    }

    // CreatedAt (pas de setter, défini dans le constructeur)
    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    // Méthodes métier
    public function isInStock(): bool
    {
        return $this->stock > 0;
    }

    public function decrementStock(int $quantity = 1): self
    {
        if ($quantity > $this->stock) {
            throw new \RuntimeException("Stock insuffisant");
        }
        $this->stock -= $quantity;
        return $this;
    }
}

echo "<h1>Entité Product (style Doctrine)</h1>";

$product = new Product();
$product->setName("Laptop Gaming")
        ->setDescription("Ordinateur portable haute performance pour les jeux")
        ->setPrice(1499.99)
        ->setStock(5);

echo "<h2>Informations du produit</h2>";
echo "<table border='1' cellpadding='10'>";
echo "<tr><th>Propriété</th><th>Valeur</th></tr>";
echo "<tr><td>ID</td><td>" . ($product->getId() ?? "null (non persisté)") . "</td></tr>";
echo "<tr><td>Nom</td><td>" . $product->getName() . "</td></tr>";
echo "<tr><td>Description</td><td>" . $product->getDescription() . "</td></tr>";
echo "<tr><td>Prix</td><td>" . number_format($product->getPrice(), 2) . " €</td></tr>";
echo "<tr><td>Stock</td><td>" . $product->getStock() . "</td></tr>";
echo "<tr><td>Actif</td><td>" . ($product->isActive() ? "Oui" : "Non") . "</td></tr>";
echo "<tr><td>En stock</td><td>" . ($product->isInStock() ? "Oui" : "Non") . "</td></tr>";
echo "<tr><td>Créé le</td><td>" . $product->getCreatedAt()->format("d/m/Y H:i:s") . "</td></tr>";
echo "</table>";

echo "<h2>Décrémentation du stock</h2>";
$product->decrementStock(2);
echo "<p>Après vente de 2 unités : stock = " . $product->getStock() . "</p>";
```

**Résultat attendu** : Un tableau détaillant toutes les propriétés du produit, avec la date de création actuelle.

---

## Commandes Utiles

| Concept | Syntaxe | Exemple |
| ------- | ------- | ------- |
| Propriété privée | `private $prop;` | `private string $nom;` |
| Constructeur | `public function __construct() {}` | Voir exemples |
| Getter | `public function getNom(): string` | `return $this->nom;` |
| Setter | `public function setNom(string $nom): self` | `$this->nom = $nom; return $this;` |
| Constante | `public const NOM = valeur;` | `public const MAX = 100;` |
| Méthode statique | `public static function nom()` | `ClassName::nom()` |
| Accès constante | `Classe::CONSTANTE` | `Article::STATUS_DRAFT` |

---

## Pièges Fréquents

### Piège 1 : Oublier d'appeler le setter dans le constructeur

**Problème** : Tu définis un setter avec validation mais tu ne l'utilises pas dans le constructeur.

**Solution** : Appelle le setter dans le constructeur pour profiter de la validation.

```php
<?php
// Incorrect : pas de validation dans le constructeur
class UserSansValidation
{
    private string $email;

    public function __construct(string $email)
    {
        $this->email = $email;  // Aucune validation !
    }
}

// Correct : utilise le setter dans le constructeur
class User
{
    private string $email;

    public function __construct(string $email)
    {
        $this->setEmail($email);  // Validation appliquée
    }

    public function setEmail(string $email): void
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Email invalide");
        }
        $this->email = $email;
    }
}
```

---

### Piège 2 : Confondre -> et :: pour les constantes

**Problème** : Tu utilises `->` pour accéder à une constante.

**Solution** : Les constantes s'accèdent avec `::`, pas `->`.

```php
<?php
class Config
{
    public const VERSION = "1.0";
}

$config = new Config();

// Incorrect
// echo $config->VERSION;  // Erreur

// Correct
echo Config::VERSION;
```

---

### Piège 3 : Utiliser `$this` dans une méthode statique

**Problème** : Tu essaies d'utiliser `$this` dans une méthode statique.

**Solution** : Les méthodes statiques n'ont pas accès à `$this`.

```php
<?php
class Exemple
{
    private $valeur = 10;

    // Incorrect
    public static function maMethode()
    {
        // return $this->valeur;  // Erreur !
    }

    // Si tu as besoin de la valeur, utilise une méthode non-statique
    public function maMethodeNonStatique()
    {
        return $this->valeur;  // OK
    }
}
```

---

### Piège 4 : Oublier le return `$this` pour le chaînage

**Problème** : Tu veux chaîner les setters mais tu as oublié `return $this`.

**Solution** : Retourne toujours `$this` dans les setters si tu veux chaîner.

```php
<?php
class User
{
    private string $nom;
    private int $age;

    // Sans return : pas de chaînage possible
    public function setNom(string $nom): void
    {
        $this->nom = $nom;
    }

    // Avec return : chaînage possible
    public function setAge(int $age): self
    {
        $this->age = $age;
        return $this;
    }
}

$user = new User();
// $user->setNom("Hugo")->setAge(23);  // Erreur sur setNom (retourne void)
```

---

## Checklist de Validation

- [ ] J'ai compris la différence entre public, private et protected
- [ ] J'ai compris pourquoi utiliser private pour les propriétés
- [ ] J'ai créé un constructeur avec `__construct`
- [ ] J'ai utilisé des paramètres par défaut dans le constructeur
- [ ] J'ai créé des getters et setters
- [ ] J'ai ajouté de la validation dans les setters
- [ ] J'ai utilisé `return $this` pour le chaînage
- [ ] J'ai créé et utilisé des constantes de classe
- [ ] J'ai créé et appelé une méthode statique

---

## Exercice Pratique

**Énoncé** : Crée une classe `Task` pour gérer des tâches (todo list).

**Indications** :

- Crée un fichier `public/tasks.php`
- Crée une classe `Task` avec :
  - Constantes de priorité : `PRIORITY_LOW`, `PRIORITY_MEDIUM`, `PRIORITY_HIGH`
  - Propriétés privées : `id`, `title`, `description`, `priority`, `completed`, `createdAt`
  - Constructeur qui prend le titre et initialise les valeurs par défaut
  - Getters et setters appropriés
  - Méthode `complete()` pour marquer comme terminée
  - Méthode statique `getPriorityLabel(string $priority): string`
- Crée 3 tâches et affiche-les dans un tableau

**Résultat attendu** : Un tableau avec les tâches, leur priorité et leur statut.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// Fichier : public/tasks.php
// Gestion de tâches

class Task
{
    // Constantes de priorité
    public const PRIORITY_LOW = 'low';
    public const PRIORITY_MEDIUM = 'medium';
    public const PRIORITY_HIGH = 'high';

    // Propriétés privées
    private ?int $id = null;
    private string $title;
    private ?string $description = null;
    private string $priority;
    private bool $completed = false;
    private \DateTimeImmutable $createdAt;

    // Compteur statique pour simuler l'ID auto-incrémenté
    private static int $lastId = 0;

    public function __construct(string $title)
    {
        self::$lastId++;
        $this->id = self::$lastId;
        $this->title = $title;
        $this->priority = self::PRIORITY_MEDIUM;
        $this->createdAt = new \DateTimeImmutable();
    }

    // Getters
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function getPriority(): string
    {
        return $this->priority;
    }

    public function isCompleted(): bool
    {
        return $this->completed;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    // Setters
    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function setPriority(string $priority): self
    {
        $allowed = [self::PRIORITY_LOW, self::PRIORITY_MEDIUM, self::PRIORITY_HIGH];
        if (!in_array($priority, $allowed)) {
            throw new \InvalidArgumentException("Priorité invalide : " . $priority);
        }
        $this->priority = $priority;
        return $this;
    }

    // Méthodes métier
    public function complete(): self
    {
        $this->completed = true;
        return $this;
    }

    public function reopen(): self
    {
        $this->completed = false;
        return $this;
    }

    // Méthode statique
    public static function getPriorityLabel(string $priority): string
    {
        $labels = [
            self::PRIORITY_LOW => 'Basse',
            self::PRIORITY_MEDIUM => 'Moyenne',
            self::PRIORITY_HIGH => 'Haute'
        ];
        return $labels[$priority] ?? 'Inconnue';
    }

    public static function getPriorityColor(string $priority): string
    {
        $colors = [
            self::PRIORITY_LOW => '#cccccc',
            self::PRIORITY_MEDIUM => '#ffffcc',
            self::PRIORITY_HIGH => '#ffcccc'
        ];
        return $colors[$priority] ?? '#ffffff';
    }
}

// Création des tâches
$tasks = [];

$task1 = new Task("Apprendre PHP");
$task1->setDescription("Suivre les fiches de documentation")
      ->setPriority(Task::PRIORITY_HIGH);
$tasks[] = $task1;

$task2 = new Task("Installer Docker");
$task2->setDescription("Configurer l'environnement de développement")
      ->setPriority(Task::PRIORITY_HIGH)
      ->complete();  // Déjà terminée
$tasks[] = $task2;

$task3 = new Task("Lire la doc Symfony");
$task3->setPriority(Task::PRIORITY_MEDIUM);
$tasks[] = $task3;

$task4 = new Task("Organiser le bureau");
$task4->setPriority(Task::PRIORITY_LOW);
$tasks[] = $task4;
?>
<!DOCTYPE html>
<html>
<head>
    <title>Liste de tâches</title>
</head>
<body>
    <h1>Liste de tâches</h1>

    <table border="1" cellpadding="10">
        <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Description</th>
            <th>Priorité</th>
            <th>Statut</th>
            <th>Créée le</th>
        </tr>
        <?php foreach ($tasks as $task): ?>
        <tr style="background-color: <?php echo Task::getPriorityColor($task->getPriority()); ?>;">
            <td><?php echo $task->getId(); ?></td>
            <td>
                <?php if ($task->isCompleted()): ?>
                    <s><?php echo $task->getTitle(); ?></s>
                <?php else: ?>
                    <?php echo $task->getTitle(); ?>
                <?php endif; ?>
            </td>
            <td><?php echo $task->getDescription() ?? '-'; ?></td>
            <td><?php echo Task::getPriorityLabel($task->getPriority()); ?></td>
            <td><?php echo $task->isCompleted() ? '✓ Terminée' : '○ À faire'; ?></td>
            <td><?php echo $task->getCreatedAt()->format('d/m/Y H:i'); ?></td>
        </tr>
        <?php endforeach; ?>
    </table>

    <h2>Statistiques</h2>
    <?php
    $total = count($tasks);
    $completed = 0;
    foreach ($tasks as $task) {
        if ($task->isCompleted()) {
            $completed++;
        }
    }
    ?>
    <p>Tâches terminées : <?php echo $completed; ?>/<?php echo $total; ?></p>
    <p>Progression : <?php echo round($completed / $total * 100); ?>%</p>
</body>
</html>
```

**Explication de la solution** :

| Élément | Explication |
| ------- | ----------- |
| `self::$lastId` | Variable statique pour générer des IDs uniques |
| `setPriority()` | Valide que la priorité est dans la liste autorisée |
| `complete()` et `reopen()` | Méthodes métier pour changer le statut |
| `getPriorityLabel()` | Méthode statique, appelée avec `Task::` |
| `<s>` | Balise HTML pour barrer le texte des tâches terminées |

---

## Navigation

← Fiche précédente : **[Introduction à la programmation orientée objet (POO)](07-introduction-poo.md)**

→ Fiche suivante : **[Les namespaces et le mot-clé use](09-namespaces-use.md)**
