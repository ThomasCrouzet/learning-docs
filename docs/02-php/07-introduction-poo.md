---
tags:
  - PHP
  - Intermédiaire
  - Concept
description: "Introduction à la programmation orientée objet (POO)"
estimated_time: "60 min"
fiche_number: 7
total_fiches: 14
cursus: "PHP"
---

# 07 - Introduction à la programmation orientée objet (POO)

> **En bref** : À la fin de cette fiche, tu sauras ce qu'est une classe et un objet, et tu comprendras comment lire du code orienté objet. Tu sauras créer une classe simple avec des propriétés et des méthodes. Lecture estimée : 60 min.


## Prérequis

- Fiche [02-php/02 - Les variables et types de données](02-variables-types.md)
- Fiche [02-php/03 - Les tableaux](03-tableaux-arrays.md) (arrays)
- Fiche [02-php/06 - Les fonctions](06-fonctions.md)
- Savoir créer des fonctions avec paramètres et valeurs de retour

## Objectif de cette fiche

À la fin de cette fiche, tu sauras ce qu'est une classe et un objet, et tu comprendras comment lire du code orienté objet. Tu sauras créer une classe simple avec des propriétés et des méthodes.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la programmation orientée objet ?

**Définition** : La programmation orientée objet (POO) est une façon d'organiser le code en regroupant les données et les fonctions qui les manipulent dans des unités appelées "objets".

**Le problème que la POO résout** :

Sans POO, voici les problèmes rencontrés :

1. **Code éparpillé** : Les variables et fonctions liées à un même concept sont dispersées dans tout le code.

2. **Pas de structure** : Difficile de savoir quelles fonctions travaillent avec quelles données.

3. **Duplication** : Pour gérer plusieurs utilisateurs, tu crées `$user1_nom`, `$user1_age`, `$user2_nom`, `$user2_age`...

4. **Maintenance difficile** : Modifier le code d'un concept nécessite de chercher partout.

**Comment la POO résout ces problèmes** :

| Problème | Solution POO |
| -------- | ------------ |
| Code éparpillé | Tout ce qui concerne un concept est dans une classe |
| Pas de structure | La classe définit clairement données et comportements |
| Duplication | Crée autant d'objets que nécessaire à partir d'une classe |
| Maintenance difficile | Modifie uniquement la classe concernée |

**Analogie concrète** : Imagine une fiche de recette. La recette (classe) décrit les ingrédients (propriétés) et les étapes (méthodes). À partir de cette recette, tu peux préparer plusieurs gâteaux (objets), chacun étant une réalisation concrète de la recette.

---

### Qu'est-ce qu'une classe ?

**Définition** : Une classe est un modèle (ou plan) qui définit la structure et le comportement d'un type d'objet. Elle décrit quelles données l'objet contiendra et quelles actions il pourra effectuer.

**Analogie concrète** : Une classe est comme le plan d'une maison. Le plan décrit les pièces, les dimensions, les portes. À partir d'un même plan, tu peux construire plusieurs maisons identiques (les objets).

**Ce qu'une classe contient** :

| Élément | Nom technique | Description |
| ------- | ------------- | ----------- |
| Données | Propriétés | Variables appartenant à l'objet |
| Actions | Méthodes | Fonctions appartenant à l'objet |

**Syntaxe d'une classe** :

```php
<?php
class NomDeLaClasse
{
    // Propriétés (données)
    public $propriete1;
    public $propriete2;

    // Méthodes (actions)
    public function faireQuelqueChose()
    {
        // Code de la méthode
    }
}
```

**Convention de nommage** :

- Les classes utilisent le **PascalCase** : chaque mot commence par une majuscule
- Exemples : `User`, `Product`, `ShoppingCart`, `OrderItem`

Le diagramme suivant montre la structure typique d'une classe avec ses propriétés et méthodes :

<div class="diagram-design">
<p><a href="../../diagrams/02-php-07-introduction-poo-1.html">Qu&#x27;est-ce qu&#x27;une classe ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/02-php-07-introduction-poo-1.html" title="Qu&#x27;est-ce qu&#x27;une classe ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

Le signe `-` indique une propriété privée, le signe `+` indique une méthode publique.

---

### Qu'est-ce qu'un objet ?

**Définition** : Un objet est une instance concrète d'une classe. C'est la réalisation du modèle défini par la classe, avec ses propres valeurs.

**Différence entre classe et objet** :

| Classe | Objet |
| ------ | ----- |
| Modèle, plan, définition | Instance concrète |
| Existe une seule fois dans le code | Peut exister en plusieurs exemplaires |
| Définit la structure | Contient des valeurs réelles |
| Ne stocke pas de données | Stocke des données propres |

**Analogie concrète** :

- Classe = Moule à gâteau
- Objet = Gâteau fabriqué avec le moule

Tu as un seul moule, mais tu peux faire 10 gâteaux avec. Chaque gâteau est une instance du moule.

Le schéma suivant illustre la relation entre une classe et ses objets :

<div class="diagram-design">
<p><a href="../../diagrams/02-php-07-introduction-poo-2.html">Qu&#x27;est-ce qu&#x27;un objet ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/02-php-07-introduction-poo-2.html" title="Qu&#x27;est-ce qu&#x27;un objet ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

La classe `User` est le modèle unique. Chaque objet (`alice`, `bob`, `charlie`) est une instance concrète avec ses propres valeurs.

**Créer un objet** : On utilise le mot-clé `new`.

```php
<?php
class User
{
    public $nom;
    public $age;
}

// Création d'objets (instances)
$user1 = new User();  // Premier objet
$user2 = new User();  // Deuxième objet (différent du premier)
```

---

### Les propriétés

**Définition** : Une propriété est une variable qui appartient à un objet. Chaque objet a ses propres valeurs pour ses propriétés.

**Syntaxe** :

```php
<?php
class User
{
    public $nom;      // Propriété sans valeur initiale
    public $age = 0;  // Propriété avec valeur par défaut
}
```

**Accéder aux propriétés** : On utilise la flèche `->`.

```php
<?php
$user = new User();

// Définir une valeur
$user->nom = "Emma";
$user->age = 23;

// Lire une valeur
echo $user->nom;  // Affiche : Emma
echo $user->age;  // Affiche : 23
```

**Note importante** : On n'utilise pas le `$` devant le nom de la propriété après la flèche.

```php
<?php
// Correct
$user->nom = "Emma";

// Incorrect
// $user->$nom = "Emma";
```

---

### Les méthodes

**Définition** : Une méthode est une fonction qui appartient à une classe. Elle peut accéder aux propriétés de l'objet et les manipuler.

**Syntaxe** :

```php
<?php
class User
{
    public $nom;
    public $age;

    public function sePresenter()
    {
        echo "Je m'appelle " . $this->nom . " et j'ai " . $this->age . " ans.";
    }
}
```

**Appeler une méthode** :

```php
<?php
$user = new User();
$user->nom = "Emma";
$user->age = 23;

$user->sePresenter();  // Affiche : Je m'appelle Emma et j'ai 23 ans.
```

---

### Le mot-clé `$this`

**Définition** : `$this` est une référence à l'objet courant. Il permet d'accéder aux propriétés et méthodes de l'objet depuis l'intérieur de la classe.

**Quand utiliser `$this`** :

- Dans une méthode, pour accéder à une propriété : `$this->propriete`
- Dans une méthode, pour appeler une autre méthode : `$this->autreMethode()`

**Exemple** :

```php
<?php
class Compteur
{
    public $valeur = 0;

    public function incrementer()
    {
        $this->valeur = $this->valeur + 1;
    }

    public function afficher()
    {
        echo "Valeur : " . $this->valeur;
    }

    public function incrementerEtAfficher()
    {
        $this->incrementer();  // Appelle l'autre méthode
        $this->afficher();
    }
}

$compteur = new Compteur();
$compteur->incrementerEtAfficher();  // Affiche : Valeur : 1
$compteur->incrementerEtAfficher();  // Affiche : Valeur : 2
```

**Ce que `$this` n'est PAS** :

- `$this` n'est pas accessible en dehors de la classe
- `$this` n'est pas la classe, c'est l'objet spécifique

---

### Méthodes avec paramètres et retour

Les méthodes fonctionnent comme les fonctions : elles peuvent avoir des paramètres et retourner des valeurs.

```php
<?php
class Calculatrice
{
    public function additionner($a, $b)
    {
        return $a + $b;
    }

    public function multiplier($a, $b)
    {
        return $a * $b;
    }
}

$calc = new Calculatrice();
$somme = $calc->additionner(5, 3);    // 8
$produit = $calc->multiplier(4, 7);   // 28
```

---

### Plusieurs objets de la même classe

Chaque objet est indépendant. Modifier un objet n'affecte pas les autres.

```php
<?php
class User
{
    public $nom;
    public $age;
}

// Création de plusieurs objets
$user1 = new User();
$user1->nom = "Emma";
$user1->age = 23;

$user2 = new User();
$user2->nom = "John";
$user2->age = 32;

// Chaque objet a ses propres valeurs
echo $user1->nom;  // Emma
echo $user2->nom;  // John

// Modifier l'un n'affecte pas l'autre
$user1->age = 24;
echo $user1->age;  // 24
echo $user2->age;  // 32 (inchangé)
```

---

### Comparaison : avant et après la POO

**Sans POO** (procédural) :

```php
<?php
// Données dispersées
$user1_nom = "Emma";
$user1_age = 23;
$user2_nom = "John";
$user2_age = 32;

// Fonction séparée des données
function afficherUser($nom, $age)
{
    echo $nom . " a " . $age . " ans.";
}

afficherUser($user1_nom, $user1_age);
afficherUser($user2_nom, $user2_age);
```

**Avec POO** :

```php
<?php
class User
{
    public $nom;
    public $age;

    public function afficher()
    {
        echo $this->nom . " a " . $this->age . " ans.";
    }
}

$user1 = new User();
$user1->nom = "Emma";
$user1->age = 23;

$user2 = new User();
$user2->nom = "John";
$user2->age = 32;

$user1->afficher();
$user2->afficher();
```

**Avantages de la POO** :

| Aspect | Procédural | POO |
| ------ | ---------- | --- |
| Organisation | Variables éparpillées | Regroupées dans l'objet |
| Ajout d'un user | Créer N nouvelles variables | Créer un nouvel objet |
| Modification | Chercher toutes les fonctions | Modifier la classe |
| Lisibilité | `afficherUser($nom, $age)` | `$user->afficher()` |

---

## Étapes Pratiques

### Étape 1 : Créer une première classe

Crée un fichier `public/poo.php` :

```php
<?php
// Définition de la classe User
class User
{
    // Propriétés
    public $nom;
    public $email;
    public $age;
}

// Création d'un objet
$user = new User();

// Définition des valeurs
$user->nom = "Emma";
$user->email = "alex@example.com";
$user->age = 23;

// Affichage
echo "<h1>Mon premier objet</h1>";
echo "<p>Nom : " . $user->nom . "</p>";
echo "<p>Email : " . $user->email . "</p>";
echo "<p>Âge : " . $user->age . " ans</p>";

// Affichage avec var_dump pour voir la structure
echo "<h2>Structure de l'objet</h2>";
echo "<pre>";
var_dump($user);
echo "</pre>";
```

**Résultat attendu** :

```text
Mon premier objet

Nom : Emma
Email : alex@example.com
Âge : 23 ans

Structure de l'objet
object(User)#1 (3) {
  ["nom"]=>
  string(4) "Emma"
  ["email"]=>
  string(16) "alex@example.com"
  ["age"]=>
  int(23)
}
```

---

### Étape 2 : Ajouter des méthodes

Modifie `public/poo.php` :

```php
<?php
class User
{
    public $nom;
    public $email;
    public $age;

    // Méthode pour se présenter
    public function sePresenter()
    {
        return "Je suis " . $this->nom . ", " . $this->age . " ans.";
    }

    // Méthode pour vérifier si majeur
    public function estMajeur()
    {
        return $this->age >= 18;
    }

    // Méthode pour obtenir l'année de naissance approximative
    public function getAnneeNaissance()
    {
        $anneeActuelle = date("Y");
        return $anneeActuelle - $this->age;
    }
}

$user = new User();
$user->nom = "Emma";
$user->email = "alex@example.com";
$user->age = 23;

echo "<h1>Utilisation des méthodes</h1>";

// Appel des méthodes
echo "<p>" . $user->sePresenter() . "</p>";

if ($user->estMajeur()) {
    echo "<p>Statut : Majeur(e)</p>";
} else {
    echo "<p>Statut : Mineur(e)</p>";
}

echo "<p>Année de naissance : " . $user->getAnneeNaissance() . "</p>";
```

**Résultat attendu** :

```text
Utilisation des méthodes

Je suis Emma, 23 ans.

Statut : Majeur(e)

Année de naissance : 2003
```

---

### Étape 3 : Créer plusieurs objets

Crée un fichier `public/plusieurs-objets.php` :

```php
<?php
class Produit
{
    public $nom;
    public $prix;
    public $stock;

    public function afficherPrix()
    {
        return number_format($this->prix, 2, ",", " ") . " €";
    }

    public function estDisponible()
    {
        return $this->stock > 0;
    }

    public function getStatut()
    {
        if ($this->stock === 0) {
            return "Rupture";
        } elseif ($this->stock < 5) {
            return "Stock faible";
        } else {
            return "Disponible";
        }
    }
}

// Création de plusieurs produits
$produit1 = new Produit();
$produit1->nom = "Laptop";
$produit1->prix = 999.99;
$produit1->stock = 15;

$produit2 = new Produit();
$produit2->nom = "Souris";
$produit2->prix = 29.99;
$produit2->stock = 3;

$produit3 = new Produit();
$produit3->nom = "Clavier";
$produit3->prix = 79.99;
$produit3->stock = 0;

// Mettre les produits dans un tableau
$produits = [$produit1, $produit2, $produit3];

echo "<h1>Catalogue de produits</h1>";
echo "<table border='1' cellpadding='10'>";
echo "<tr><th>Produit</th><th>Prix</th><th>Stock</th><th>Statut</th></tr>";

foreach ($produits as $produit) {
    echo "<tr>";
    echo "<td>" . $produit->nom . "</td>";
    echo "<td>" . $produit->afficherPrix() . "</td>";
    echo "<td>" . $produit->stock . "</td>";
    echo "<td>" . $produit->getStatut() . "</td>";
    echo "</tr>";
}

echo "</table>";
```

**Résultat attendu** : Un tableau HTML avec les 3 produits et leurs statuts.

---

### Étape 4 : Méthodes avec paramètres

Crée un fichier `public/methodes-parametres.php` :

```php
<?php
class Panier
{
    public $articles = [];
    public $total = 0;

    // Ajouter un article au panier
    public function ajouter($nom, $prix, $quantite = 1)
    {
        $article = [
            "nom" => $nom,
            "prix" => $prix,
            "quantite" => $quantite,
            "sousTotal" => $prix * $quantite
        ];

        $this->articles[] = $article;
        $this->calculerTotal();
    }

    // Calculer le total
    public function calculerTotal()
    {
        $this->total = 0;
        foreach ($this->articles as $article) {
            $this->total += $article["sousTotal"];
        }
    }

    // Obtenir le nombre d'articles
    public function getNombreArticles()
    {
        $count = 0;
        foreach ($this->articles as $article) {
            $count += $article["quantite"];
        }
        return $count;
    }

    // Afficher le panier
    public function afficher()
    {
        echo "<h2>Contenu du panier</h2>";

        if (empty($this->articles)) {
            echo "<p>Le panier est vide.</p>";
            return;
        }

        echo "<table border='1' cellpadding='10'>";
        echo "<tr><th>Article</th><th>Prix</th><th>Qté</th><th>Sous-total</th></tr>";

        foreach ($this->articles as $article) {
            echo "<tr>";
            echo "<td>" . $article["nom"] . "</td>";
            echo "<td>" . number_format($article["prix"], 2) . " €</td>";
            echo "<td>" . $article["quantite"] . "</td>";
            echo "<td>" . number_format($article["sousTotal"], 2) . " €</td>";
            echo "</tr>";
        }

        echo "<tr>";
        echo "<td colspan='3'><strong>Total</strong></td>";
        echo "<td><strong>" . number_format($this->total, 2) . " €</strong></td>";
        echo "</tr>";
        echo "</table>";

        echo "<p>Nombre d'articles : " . $this->getNombreArticles() . "</p>";
    }
}

echo "<h1>Panier d'achat</h1>";

$panier = new Panier();

// Ajouter des articles
$panier->ajouter("Laptop", 999.99);
$panier->ajouter("Souris", 29.99, 2);
$panier->ajouter("Clavier", 79.99);
$panier->ajouter("Câble USB", 9.99, 3);

// Afficher le panier
$panier->afficher();
```

**Résultat attendu** : Un tableau montrant le contenu du panier avec le total calculé.

---

### Étape 5 : Classe avec propriétés typées (PHP 8.3)

Crée un fichier `public/typage-classe.php` :

```php
<?php
class Article
{
    public string $titre;
    public string $contenu;
    public string $auteur;
    public int $vues = 0;
    public bool $publie = false;

    public function publier(): void
    {
        $this->publie = true;
    }

    public function ajouterVue(): void
    {
        $this->vues++;
    }

    public function getResume(int $longueur = 100): string
    {
        if (strlen($this->contenu) <= $longueur) {
            return $this->contenu;
        }
        return substr($this->contenu, 0, $longueur) . "...";
    }

    public function getStatut(): string
    {
        return $this->publie ? "Publié" : "Brouillon";
    }
}

echo "<h1>Gestion d'articles</h1>";

$article = new Article();
$article->titre = "Introduction à PHP";
$article->contenu = "PHP est un langage de programmation côté serveur très populaire. Il est utilisé par des millions de sites web dans le monde, notamment WordPress, Facebook et Wikipedia.";
$article->auteur = "Emma";

// Simuler des vues
$article->ajouterVue();
$article->ajouterVue();
$article->ajouterVue();

echo "<h2>" . $article->titre . "</h2>";
echo "<p><em>Par " . $article->auteur . "</em></p>";
echo "<p>Statut : " . $article->getStatut() . " | Vues : " . $article->vues . "</p>";
echo "<p><strong>Résumé :</strong> " . $article->getResume(80) . "</p>";

echo "<hr>";

// Publier l'article
$article->publier();
echo "<p>Article publié ! Nouveau statut : " . $article->getStatut() . "</p>";
```

**Résultat attendu** :

```text
Gestion d'articles

Introduction à PHP

Par Emma

Statut : Brouillon | Vues : 3

Résumé : PHP est un langage de programmation côté serveur très populaire. Il est utili...

---

Article publié ! Nouveau statut : Publié
```

---

### Étape 6 : Tableau d'objets

Crée un fichier `public/tableau-objets.php` :

```php
<?php
class Etudiant
{
    public string $nom;
    public float $moyenne;

    public function getMention(): string
    {
        if ($this->moyenne >= 16) {
            return "Très Bien";
        } elseif ($this->moyenne >= 14) {
            return "Bien";
        } elseif ($this->moyenne >= 12) {
            return "Assez Bien";
        } elseif ($this->moyenne >= 10) {
            return "Passable";
        } else {
            return "Insuffisant";
        }
    }

    public function aReussi(): bool
    {
        return $this->moyenne >= 10;
    }
}

// Créer plusieurs étudiants
$etudiants = [];

$e1 = new Etudiant();
$e1->nom = "Emma Martin";
$e1->moyenne = 15.5;
$etudiants[] = $e1;

$e2 = new Etudiant();
$e2->nom = "John Bernard";
$e2->moyenne = 12.0;
$etudiants[] = $e2;

$e3 = new Etudiant();
$e3->nom = "Marie Dupont";
$e3->moyenne = 8.5;
$etudiants[] = $e3;

$e4 = new Etudiant();
$e4->nom = "Pierre Durand";
$e4->moyenne = 17.0;
$etudiants[] = $e4;

echo "<h1>Résultats des étudiants</h1>";

// Compter les réussites
$reussites = 0;
$sommeMoyennes = 0;

foreach ($etudiants as $etudiant) {
    if ($etudiant->aReussi()) {
        $reussites++;
    }
    $sommeMoyennes += $etudiant->moyenne;
}

$moyenneClasse = $sommeMoyennes / count($etudiants);

echo "<p>Taux de réussite : " . $reussites . "/" . count($etudiants) . "</p>";
echo "<p>Moyenne de classe : " . number_format($moyenneClasse, 2) . "/20</p>";

echo "<table border='1' cellpadding='10'>";
echo "<tr><th>Nom</th><th>Moyenne</th><th>Mention</th><th>Résultat</th></tr>";

foreach ($etudiants as $etudiant) {
    $couleur = $etudiant->aReussi() ? "#ccffcc" : "#ffcccc";

    echo "<tr style='background-color: " . $couleur . ";'>";
    echo "<td>" . $etudiant->nom . "</td>";
    echo "<td>" . number_format($etudiant->moyenne, 1) . "/20</td>";
    echo "<td>" . $etudiant->getMention() . "</td>";
    echo "<td>" . ($etudiant->aReussi() ? "Admis" : "Ajourné") . "</td>";
    echo "</tr>";
}

echo "</table>";
```

**Résultat attendu** : Un tableau coloré avec les résultats de chaque étudiant.

---

## Commandes Utiles

| Action | Syntaxe | Exemple |
| ------ | ------- | ------- |
| Déclarer une classe | `class NomClasse { }` | `class User { }` |
| Créer un objet | `$var = new Classe()` | `$user = new User()` |
| Définir une propriété | `public $nom;` | `public $email;` |
| Accéder à une propriété | `$objet->propriete` | `$user->nom` |
| Définir une méthode | `public function nom() { }` | `public function save() { }` |
| Appeler une méthode | `$objet->methode()` | `$user->save()` |
| Référencer l'objet courant | `$this` | `$this->nom` |

---

## Pièges Fréquents

### Piège 1 : Oublier le mot-clé new

**Problème** : Tu essaies d'utiliser la classe sans créer d'objet.

**Solution** : Utilise `new` pour créer une instance.

```php
<?php
class User
{
    public $nom;
}

// Incorrect
// $user = User();  // Erreur : User n'est pas une fonction
// User->nom = "Test";  // Erreur

// Correct
$user = new User();
$user->nom = "Test";
```

---

### Piège 2 : Oublier `$this` dans les méthodes

**Problème** : Tu essaies d'accéder à une propriété sans `$this`.

**Solution** : Utilise toujours `$this->` pour accéder aux propriétés de l'objet.

```php
<?php
// Incorrect
class UserIncorrect
{
    public $nom;

    public function afficher()
    {
        // echo $nom;  // Erreur : $nom n'existe pas localement
    }
}

// Correct
class User
{
    public $nom;

    public function afficher()
    {
        echo $this->nom;  // Accède à la propriété de l'objet
    }
}
```

---

### Piège 3 : Mettre `$` après la flèche

**Problème** : Tu écris `$objet->$propriete` au lieu de `$objet->propriete`.

**Solution** : Pas de `$` après la flèche pour les propriétés.

```php
<?php
$user = new User();

// Incorrect
// $user->$nom = "Test";

// Correct
$user->nom = "Test";
```

---

### Piège 4 : Confondre classe et objet

**Problème** : Tu essaies d'utiliser la classe directement comme un objet.

**Solution** : La classe est le modèle, l'objet est l'instance créée avec `new`.

```php
<?php
class User
{
    public $nom;
}

// Incorrect (essayer d'utiliser la classe directement)
// User->nom = "Test";  // Erreur

// Correct (créer d'abord un objet)
$user = new User();
$user->nom = "Test";
```

---

### Piège 5 : Ne pas initialiser les propriétés

**Problème** : Tu accèdes à une propriété qui n'a pas été définie.

**Solution** : Définis les propriétés avant de les utiliser, ou donne une valeur par défaut.

```php
<?php
class User
{
    public string $nom;  // Typée, sans valeur : reste "non initialisée"
    public int $age = 0; // Valeur par défaut
}

$user = new User();
echo $user->nom;  // Error fatale : Typed property User::$nom must not be accessed before initialization
echo $user->age;  // OK : 0
```

---

## Checklist de Validation

- [ ] J'ai compris la différence entre une classe et un objet
- [ ] J'ai compris que la classe est le modèle, l'objet est l'instance
- [ ] J'ai créé une classe avec des propriétés
- [ ] J'ai créé un objet avec `new`
- [ ] J'ai accédé aux propriétés avec `$objet->propriete`
- [ ] J'ai créé des méthodes dans une classe
- [ ] J'ai compris le rôle de `$this`
- [ ] J'ai créé plusieurs objets de la même classe
- [ ] J'ai parcouru un tableau d'objets avec `foreach`

---

## Exercice Pratique

**Énoncé** : Crée une classe `Livre` pour gérer une bibliothèque.

**Indications** :

- Crée un fichier `public/bibliotheque.php`
- Crée une classe `Livre` avec les propriétés : `titre`, `auteur`, `pages`, `lu` (boolean)
- Ajoute les méthodes :
  - `marquerCommeLu()` : met `lu` à true
  - `getTempsLecture()` : estime le temps de lecture (2 minutes par page)
  - `getStatut()` : retourne "Lu" ou "À lire"
- Crée 3 livres différents
- Affiche la liste des livres dans un tableau HTML
- Affiche le temps total de lecture pour les livres non lus

**Résultat attendu** : Un tableau avec les livres et le temps de lecture restant.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// Fichier : public/bibliotheque.php
// Gestion d'une bibliothèque

class Livre
{
    public string $titre;
    public string $auteur;
    public int $pages;
    public bool $lu = false;

    public function marquerCommeLu(): void
    {
        $this->lu = true;
    }

    public function getTempsLecture(): int
    {
        // 2 minutes par page
        return $this->pages * 2;
    }

    public function getTempsLectureFormate(): string
    {
        $minutes = $this->getTempsLecture();
        $heures = floor($minutes / 60);
        $minutesRestantes = $minutes % 60;

        if ($heures > 0) {
            return $heures . "h " . $minutesRestantes . "min";
        }
        return $minutesRestantes . " min";
    }

    public function getStatut(): string
    {
        return $this->lu ? "Lu" : "À lire";
    }
}

// Création des livres
$livres = [];

$livre1 = new Livre();
$livre1->titre = "Le Petit Prince";
$livre1->auteur = "Antoine de Saint-Exupéry";
$livre1->pages = 96;
$livres[] = $livre1;

$livre2 = new Livre();
$livre2->titre = "1984";
$livre2->auteur = "George Orwell";
$livre2->pages = 328;
$livre2->marquerCommeLu();  // Ce livre est déjà lu
$livres[] = $livre2;

$livre3 = new Livre();
$livre3->titre = "Harry Potter à l'école des sorciers";
$livre3->auteur = "J.K. Rowling";
$livre3->pages = 308;
$livres[] = $livre3;
?>
<!DOCTYPE html>
<html>
<head>
    <title>Ma bibliothèque</title>
</head>
<body>
    <h1>Ma bibliothèque</h1>

    <table border="1" cellpadding="10">
        <tr>
            <th>Titre</th>
            <th>Auteur</th>
            <th>Pages</th>
            <th>Temps de lecture</th>
            <th>Statut</th>
        </tr>
        <?php foreach ($livres as $livre): ?>
        <tr style="background-color: <?php echo $livre->lu ? '#ccffcc' : '#ffffcc'; ?>;">
            <td><?php echo $livre->titre; ?></td>
            <td><?php echo $livre->auteur; ?></td>
            <td><?php echo $livre->pages; ?></td>
            <td><?php echo $livre->getTempsLectureFormate(); ?></td>
            <td><?php echo $livre->getStatut(); ?></td>
        </tr>
        <?php endforeach; ?>
    </table>

    <h2>Statistiques</h2>

    <?php
    $tempsTotal = 0;
    $livresNonLus = 0;

    foreach ($livres as $livre) {
        if (!$livre->lu) {
            $tempsTotal += $livre->getTempsLecture();
            $livresNonLus++;
        }
    }

    $heures = floor($tempsTotal / 60);
    $minutes = $tempsTotal % 60;
    ?>

    <p>Livres à lire : <?php echo $livresNonLus; ?></p>
    <p>Temps de lecture restant : <?php echo $heures; ?>h <?php echo $minutes; ?>min</p>
</body>
</html>
```

**Explication de la solution** :

| Élément | Explication |
| ------- | ----------- |
| `public bool $lu = false` | Propriété typée avec valeur par défaut |
| `marquerCommeLu(): void` | Méthode sans retour (void) |
| `getTempsLecture(): int` | Retourne le temps en minutes |
| `getTempsLectureFormate()` | Formate en heures et minutes |
| `$livre->lu ? '#ccffcc' : '#ffffcc'` | Couleur selon le statut |

---

## Navigation

← Fiche précédente : **[Les fonctions](06-fonctions.md)**

→ Fiche suivante : **[Les classes en détail](08-classes-en-detail.md)**
