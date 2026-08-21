---
tags:
  - EasyAdmin
  - Intermédiaire
  - Pratique
description: "Champs avancés et organisation des formulaires EasyAdmin"
estimated_time: "145 min"
fiche_number: 2
total_fiches: 7
cursus: "EasyAdmin"
id: "web.easyadmin.easyadmin-champs-avances"
course_id: "web.easyadmin"
content_type: "lesson"
order: 2
---

# 02 - Champs avancés et organisation des formulaires EasyAdmin

> **En bref** : À la fin de cette fiche, tu sauras utiliser tous les types de champs EasyAdmin et organiser tes formulaires avec des onglets, des fieldsets et des colonnes. Lecture estimée : 145 min.


## Prérequis

- Avoir complété la fiche **[01 - Installer EasyAdmin et créer une interface d'administration](01-easyadmin-installation.md)**
- Avoir complété la fiche **[02-php/08-classes-en-détail](../02-php/08-classes-en-detail.md)** (classes et objets PHP)
- Les conteneurs Docker doivent être en cours d'exécution (`docker compose up -d`)

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| EasyAdmin | 4.x |
| PHP | 8.3 |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser tous les types de champs EasyAdmin et organiser tes formulaires avec des onglets, des fieldsets et des colonnes.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un Field dans EasyAdmin ?

**Définition** : Un Field est une classe PHP qui définit comment un champ de l'entité est affiché dans l'interface d'administration (liste, détail, formulaire).

**Le problème que les Fields résolvent** :

Sans les Fields EasyAdmin, voici les problèmes rencontrés :

1. **Affichage brut** : Les données seraient affichées telles quelles, sans mise en forme (un prix sans symbole €, une date sans formatage).

2. **Formulaires génériques** : Tous les champs utiliseraient le même type d'input HTML, même quand ce n'est pas adapté.

3. **Pas de validation visuelle** : Impossible d'avoir des toggles pour les booléens, des sélecteurs de couleur, des éditeurs de texte riche.

**Comment les Fields résolvent ces problèmes** :

| Problème | Solution apportée par les Fields |
| -------- | -------------------------------- |
| Affichage brut | Chaque Field formate les données (€, dates, liens) |
| Formulaires génériques | Chaque Field utilise le widget HTML approprié |
| Pas de validation visuelle | Widgets spécialisés (toggle, color picker, WYSIWYG) |

**Analogie concrète** : Les Fields sont comme des cadres photo de différentes tailles et formes. Tu as un cadre rectangulaire pour les portraits, un cadre carré pour les photos Instagram, un cadre panoramique pour les paysages. Chaque type de donnée a son cadre optimal.

**Ce qu'un Field n'est PAS** :

- Un Field n'est pas un FormType Symfony. C'est une couche d'abstraction au-dessus des FormTypes.
- Un Field ne modifie pas les données de l'entité. Il modifie seulement leur affichage.

---

### Le pattern Fluent Interface

**Définition** : Le Fluent Interface est un pattern de programmation où chaque méthode retourne l'objet lui-même, permettant d'enchaîner plusieurs appels de méthodes sur une seule ligne.

**Exemple concret** :

```php
// Sans Fluent Interface (verbeux)
$field = TextField::new('name');
$field->setLabel('Nom du produit');
$field->setRequired(true);
$field->setHelp('Maximum 255 caractères');

// Avec Fluent Interface (compact)
$field = TextField::new('name')
    ->setLabel('Nom du produit')
    ->setRequired(true)
    ->setHelp('Maximum 255 caractères');
```

**Pourquoi EasyAdmin utilise ce pattern** :

| Avantage | Explication |
| -------- | ----------- |
| Lisibilité | On voit toutes les options d'un champ groupées ensemble |
| Moins de code | Pas besoin de répéter le nom de la variable |
| Auto-complétion | L'IDE propose les méthodes disponibles après chaque `->` |

**Analogie concrète** : C'est comme commander un café. Au lieu de dire "Un café. Avec du lait. Et du sucre. Dans un grand verre.", tu dis "Un grand café au lait sucré". Toutes les options sont chaînées en une seule commande.

---

### Les déclarations de types en PHP

**Définition** : Les déclarations de types permettent de spécifier le type de données attendu pour les paramètres de fonction, les valeurs de retour et les propriétés de classe.

**Le problème que les types résolvent** :

Sans déclarations de types :

1. **Aucun contrôle du contrat** : PHP accepte toute valeur convertible et peut produire des résultats inattendus.

2. **Documentation manquante** : Tu ne sais pas quel type de donnée une fonction attend.

3. **Bugs difficiles à trouver** : Les erreurs apparaissent plus tard dans l'exécution.

**Exemple avec et sans types** :

```php
// Sans types : PHP convertit "abc" en 0 (coercition silencieuse)
function calculatePrice($quantity, $unitPrice)
{
    return $quantity * $unitPrice;
}

// "5" se convertit en 5 : OK mais on ne maîtrise pas ce qui rentre
echo calculatePrice("5", "3");   // Affiche 15

// Avec types : le contrat est explicite et vérifié
function calculatePrice(int $quantity, float $unitPrice): float
{
    return $quantity * $unitPrice;
}

echo calculatePrice("5", "3");   // Affiche 15 ("5"->5, "3"->3.0 par coercition)
echo calculatePrice("abc", "x"); // TypeError : "abc" n'est pas convertible en int
```

**Types disponibles en PHP 8.3** :

| Type | Exemple | Description |
| ---- | ------- | ----------- |
| `int` | `42` | Nombre entier |
| `float` | `3.14` | Nombre décimal |
| `string` | `"texte"` | Chaîne de caractères |
| `bool` | `true` / `false` | Booléen |
| `array` | `[1, 2, 3]` | Tableau |
| `?int` | `42` ou `null` | Entier ou null (nullable) |
| `int\|string` | `42` ou `"42"` | Union de types |

**Lien avec EasyAdmin** : Les Fields EasyAdmin utilisent les types déclarés dans ton entité pour valider les données. Un `IntegerField` vérifie que la valeur est bien un entier.

---

### DateTimeImmutable vs DateTime

**Définition** : `DateTimeImmutable` est une classe PHP pour représenter des dates qui ne peuvent pas être modifiées après création. `DateTime` peut être modifié.

**Le problème que DateTimeImmutable résout** :

```php
// Avec DateTime (problème)
$event = new Event();
$date = new DateTime('2024-01-15');
$event->setStartDate($date);

$date->modify('+1 day'); // Modifie aussi la date de l'événement !
echo $event->getStartDate()->format('Y-m-d'); // Affiche 2024-01-16 !

// Avec DateTimeImmutable (sécurisé)
$event = new Event();
$date = new DateTimeImmutable('2024-01-15');
$event->setStartDate($date);

$newDate = $date->modify('+1 day'); // Crée une nouvelle instance
echo $event->getStartDate()->format('Y-m-d'); // Affiche toujours 2024-01-15
```

**Comparaison** :

| DateTime | DateTimeImmutable |
| -------- | ----------------- |
| Peut être modifié | Ne peut pas être modifié |
| `modify()` change l'objet | `modify()` retourne un nouvel objet |
| Risque d'effets de bord | Pas d'effets de bord |
| Utilisation historique | Recommandé depuis PHP 5.5 |

**Recommandation** : Utilise toujours `DateTimeImmutable` dans tes entités. C'est plus sûr et EasyAdmin le supporte parfaitement.

---

### Les Enums PHP 8.1+

**Définition** : Un enum (énumération) est un type spécial qui définit un ensemble fixe de valeurs possibles.

**Le problème que les enums résolvent** :

```php
// Sans enum (problématique)
class Article
{
    private string $status; // Peut contenir n'importe quoi !
}

$article->setStatus('publié');  // Typo !
$article->setStatus('PUBLISHED'); // Majuscules différentes
$article->setStatus('banana');    // Valeur invalide acceptée

// Avec enum (sécurisé)
enum ArticleStatus: string
{
    case DRAFT = 'draft';
    case PUBLISHED = 'published';
    case ARCHIVED = 'archived';
}

class Article
{
    private ArticleStatus $status; // Seules les valeurs définies sont acceptées
}

$article->setStatus(ArticleStatus::PUBLISHED); // Correct
$article->setStatus('banana'); // Erreur immédiate !
```

**Syntaxe d'un enum** :

```php
// Enum simple (sans valeur)
enum Color
{
    case RED;
    case GREEN;
    case BLUE;
}

// Enum backed (avec valeur string)
enum ArticleStatus: string
{
    case DRAFT = 'draft';
    case PUBLISHED = 'published';
    case ARCHIVED = 'archived';
}

// Enum backed (avec valeur int)
enum Priority: int
{
    case LOW = 1;
    case MEDIUM = 2;
    case HIGH = 3;
}
```

**Lien avec EasyAdmin** : EasyAdmin 4 supporte nativement les enums PHP. Un `ChoiceField` peut afficher les options d'un enum ; par défaut, ce sont les noms des cas (`DRAFT`, `PUBLISHED`) qui s'affichent, sauf si tu fournis tes propres libellés.

---

## Récapitulatif des concepts

| Concept | À retenir |
| ------- | --------- |
| Field | Classe qui définit l'affichage d'un champ dans EasyAdmin |
| Fluent Interface | Pattern permettant de chaîner les appels de méthodes |
| Types PHP | Déclarations qui sécurisent les paramètres et retours de fonctions |
| DateTimeImmutable | Date non modifiable (plus sûr que DateTime) |
| Enum | Type qui limite les valeurs possibles à un ensemble défini |

---

## Référence complète des types de champs

### Champs texte

#### TextField

**Usage** : Texte court (titre, nom, code).

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

TextField::new('name')
    ->setLabel('Nom')
    ->setMaxLength(100)          // Limite affichée dans la liste
    ->setRequired(true)          // Obligatoire
    ->setHelp('Maximum 255 caractères')
```

**Propriété dans l'entité** :

```php
#[ORM\Column(length: 255)]
private ?string $name = null;
```

---

#### TextareaField

**Usage** : Texte long sans mise en forme (description, notes).

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;

TextareaField::new('description')
    ->setLabel('Description')
    ->setNumOfRows(5)            // Nombre de lignes du textarea
    ->hideOnIndex()              // Trop long pour la liste
```

**Propriété dans l'entité** :

```php
#[ORM\Column(type: Types::TEXT, nullable: true)]
private ?string $description = null;
```

---

#### TextEditorField

**Usage** : Texte riche avec mise en forme (article, contenu HTML).

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;

TextEditorField::new('content')
    ->setLabel('Contenu')
    ->hideOnIndex()
```

**Propriété dans l'entité** :

```php
#[ORM\Column(type: Types::TEXT)]
private ?string $content = null;
```

**Note** : Le contenu est stocké en HTML. Utilise le filtre Twig `|raw` pour l'afficher correctement sur le site public.

---

#### CodeEditorField

**Usage** : Code source avec coloration syntaxique.

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\CodeEditorField;

CodeEditorField::new('customCss')
    ->setLabel('CSS personnalisé')
    ->setLanguage('css')         // css, javascript, php, html, etc.
    ->setNumOfRows(10)
    ->hideOnIndex()
```

---

#### SlugField

**Usage** : URL-friendly généré automatiquement depuis un autre champ.

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\SlugField;

TextField::new('title')
    ->setLabel('Titre'),

SlugField::new('slug')
    ->setTargetFieldName('title')  // Génère le slug depuis 'title'
    ->setLabel('URL')
    ->hideOnIndex()
```

**Propriété dans l'entité** :

```php
#[ORM\Column(length: 255, unique: true)]
private ?string $slug = null;
```

---

### Champs numériques

#### IntegerField

**Usage** : Nombres entiers (quantité, âge, ordre).

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;

IntegerField::new('stock')
    ->setLabel('Stock')
    ->setHelp('Nombre d\'unités en stock')
```

**Propriété dans l'entité** :

```php
#[ORM\Column]
private ?int $stock = null;
```

---

#### NumberField

**Usage** : Nombres décimaux (poids, dimensions).

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;

NumberField::new('weight')
    ->setLabel('Poids (kg)')
    ->setNumDecimals(2)          // Nombre de décimales affichées
```

**Propriété dans l'entité** :

```php
#[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
private ?string $weight = null;
```

---

#### MoneyField

**Usage** : Prix avec devise.

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\MoneyField;

MoneyField::new('price')
    ->setLabel('Prix')
    ->setCurrency('EUR')         // Code ISO de la devise
    ->setStoredAsCents(false)    // false = stocké en euros, true = en centimes
```

**Propriété dans l'entité** :

```php
#[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
private ?string $price = null;
```

**Note importante** : Par défaut, EasyAdmin stocke les montants en centimes (doc officielle : 5 euros → entier `500`). Si tu stockes en euros (ex. `9.99` en `DECIMAL`), mets `setStoredAsCents(false)`. Le champ est rendu comme un `<input type="number">` ([MoneyField](https://symfony.com/bundles/EasyAdminBundle/current/fields/MoneyField.html)).

---

#### PercentField

**Usage** : Pourcentages (réduction, TVA).

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\PercentField;

PercentField::new('vatRate')
    ->setLabel('Taux TVA')
    ->setNumDecimals(1)
    ->setStoredAsFractional(false)  // false = 20 pour 20%, true = 0.20
```

---

### Champ booléen

#### BooleanField

**Usage** : Oui/Non, actif/inactif.

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;

BooleanField::new('isActive')
    ->setLabel('Actif')
    ->renderAsSwitch(true)       // Affiche un toggle switch (défaut)
    // ->renderAsSwitch(false)   // Affiche une checkbox classique
```

**Propriété dans l'entité** :

```php
#[ORM\Column]
private ?bool $isActive = true;
```

---

### Champs de choix

#### ChoiceField

**Usage** : Sélection parmi une liste de valeurs prédéfinies.

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;

ChoiceField::new('status')
    ->setLabel('Statut')
    ->setChoices([
        'Brouillon' => 'draft',        // Libellé => Valeur stockée
        'Publié' => 'published',
        'Archivé' => 'archived',
    ])
    ->renderAsBadges([                 // Couleurs des badges dans la liste
        'draft' => 'warning',
        'published' => 'success',
        'archived' => 'secondary',
    ])
```

**Avec un enum PHP** :

```php
// Dans src/Enum/ArticleStatus.php
namespace App\Enum;

enum ArticleStatus: string
{
    case DRAFT = 'draft';
    case PUBLISHED = 'published';
    case ARCHIVED = 'archived';

    public function getLabel(): string
    {
        return match($this) {
            self::DRAFT => 'Brouillon',
            self::PUBLISHED => 'Publié',
            self::ARCHIVED => 'Archivé',
        };
    }
}

// Dans le CrudController : on construit le tableau [libellé => valeur] attendu par setChoices().
// EasyAdmin n'appelle pas getLabel() tout seul, c'est à nous de l'utiliser.
$choices = [];
foreach (ArticleStatus::cases() as $status) {
    $choices[$status->getLabel()] = $status->value; // 'Brouillon' => 'draft', etc.
}

ChoiceField::new('status')
    ->setChoices($choices)
```

---

#### CountryField

**Usage** : Sélection d'un pays.

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\CountryField;

CountryField::new('country')
    ->setLabel('Pays')
```

**Propriété dans l'entité** : Stocke le code ISO du pays (FR, BE, CH, etc.).

```php
#[ORM\Column(length: 2)]
private ?string $country = null;
```

---

#### CurrencyField

**Usage** : Sélection d'une devise.

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\CurrencyField;

CurrencyField::new('currency')
    ->setLabel('Devise')
```

---

#### LanguageField

**Usage** : Sélection d'une langue.

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\LanguageField;

LanguageField::new('locale')
    ->setLabel('Langue')
```

---

#### TimezoneField

**Usage** : Sélection d'un fuseau horaire.

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\TimezoneField;

TimezoneField::new('timezone')
    ->setLabel('Fuseau horaire')
```

---

### Champs date et heure

#### DateField

**Usage** : Date seule (naissance, échéance).

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;

DateField::new('birthDate')
    ->setLabel('Date de naissance')
    ->setFormat('dd/MM/yyyy')    // Format d'affichage
```

**Propriété dans l'entité** :

```php
#[ORM\Column(type: Types::DATE_IMMUTABLE)]
private ?\DateTimeImmutable $birthDate = null;
```

---

#### DateTimeField

**Usage** : Date et heure (publication, événement).

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;

DateTimeField::new('publishedAt')
    ->setLabel('Date de publication')
    ->setFormat('dd/MM/yyyy HH:mm')
```

**Propriété dans l'entité** :

```php
#[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
private ?\DateTimeImmutable $publishedAt = null;
```

---

#### TimeField

**Usage** : Heure seule (horaire d'ouverture).

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\TimeField;

TimeField::new('openingTime')
    ->setLabel('Heure d\'ouverture')
```

---

### Champs spéciaux

#### ColorField

**Usage** : Sélection d'une couleur.

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\ColorField;

ColorField::new('backgroundColor')
    ->setLabel('Couleur de fond')
```

**Propriété dans l'entité** : Stocke le code hexadécimal (#FF5733).

```php
#[ORM\Column(length: 7, nullable: true)]
private ?string $backgroundColor = null;
```

---

#### TelephoneField

**Usage** : Numéro de téléphone.

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\TelephoneField;

TelephoneField::new('phone')
    ->setLabel('Téléphone')
```

**Note** : Dans la liste, le numéro est cliquable (lien `tel:`).

---

#### UrlField

**Usage** : Adresse web.

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\UrlField;

UrlField::new('website')
    ->setLabel('Site web')
```

**Note** : Dans la liste, l'URL est cliquable.

---

#### EmailField

**Usage** : Adresse email.

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\EmailField;

EmailField::new('email')
    ->setLabel('Email')
```

**Note** : Dans la liste, l'email est cliquable (lien `mailto:`).

---

#### IdField

**Usage** : Identifiant de l'entité.

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;

IdField::new('id')
    ->hideOnForm()    // Jamais modifiable
```

---

#### ArrayField

**Usage** : Tableau de valeurs (tags, rôles).

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\ArrayField;

ArrayField::new('roles')
    ->setLabel('Rôles')
```

**Propriété dans l'entité** :

```php
#[ORM\Column(type: Types::JSON)]
private array $roles = [];
```

---

## Organisation des formulaires avec FormField

### Qu'est-ce que FormField ?

**Définition** : FormField est un type spécial qui n'affiche pas de donnée mais organise la mise en page du formulaire.

**Types disponibles** :

| Méthode | Usage |
| ------- | ----- |
| `FormField::addTab()` | Créer un onglet |
| `FormField::addFieldset()` | Créer un groupe de champs |
| `FormField::addColumn()` | Créer une colonne |
| `FormField::addRow()` | Forcer un retour à la ligne |

---

### Onglets avec addTab()

**Usage** : Organiser un formulaire long en sections thématiques.

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\FormField;

public function configureFields(string $pageName): iterable
{
    return [
        // Onglet 1 : Informations principales
        FormField::addTab('Informations')
            ->setIcon('fa fa-info-circle'),

        TextField::new('name')->setLabel('Nom'),
        TextareaField::new('description')->setLabel('Description'),

        // Onglet 2 : Prix et stock
        FormField::addTab('Commerce')
            ->setIcon('fa fa-euro-sign'),

        MoneyField::new('price')->setCurrency('EUR'),
        IntegerField::new('stock'),

        // Onglet 3 : SEO
        FormField::addTab('SEO')
            ->setIcon('fa fa-search'),

        TextField::new('metaTitle')->setLabel('Titre SEO'),
        TextareaField::new('metaDescription')->setLabel('Description SEO'),
    ];
}
```

**Résultat** : Le formulaire affiche 3 onglets cliquables en haut.

---

### Groupes avec addFieldset()

**Usage** : Regrouper visuellement des champs liés.

```php
public function configureFields(string $pageName): iterable
{
    return [
        TextField::new('name'),

        FormField::addFieldset('Adresse')
            ->setIcon('fa fa-map-marker')
            ->collapsible()           // Peut être replié
            ->setHelp('Adresse de livraison'),

        TextField::new('street')->setLabel('Rue'),
        TextField::new('city')->setLabel('Ville'),
        TextField::new('postalCode')->setLabel('Code postal'),

        FormField::addFieldset('Contact')
            ->setIcon('fa fa-phone'),

        EmailField::new('email'),
        TelephoneField::new('phone'),
    ];
}
```

---

### Colonnes avec addColumn()

**Usage** : Afficher des champs côte à côte.

```php
public function configureFields(string $pageName): iterable
{
    return [
        TextField::new('name')
            ->setColumns(12),    // Pleine largeur

        // Colonne gauche (6/12 = 50%)
        FormField::addColumn(6),
        TextField::new('firstName')->setLabel('Prénom'),
        TextField::new('lastName')->setLabel('Nom'),

        // Colonne droite (6/12 = 50%)
        FormField::addColumn(6),
        EmailField::new('email'),
        TelephoneField::new('phone'),
    ];
}
```

**Système de grille** : EasyAdmin utilise une grille de 12 colonnes.

| Colonnes | Largeur |
| -------- | ------- |
| 12 | 100% (pleine largeur) |
| 6 | 50% |
| 4 | 33% |
| 3 | 25% |

---

### Exemple complet : formulaire Product avancé

```php
<?php

namespace App\Controller\Admin;

use App\Entity\Product;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\FormField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Field\MoneyField;
use EasyCorp\Bundle\EasyAdminBundle\Field\SlugField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class ProductCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Product::class;
    }

    public function configureFields(string $pageName): iterable
    {
        // Vue liste : champs simplifiés
        if ($pageName === Crud::PAGE_INDEX) {
            return [
                IdField::new('id'),
                TextField::new('name')->setLabel('Nom'),
                AssociationField::new('category')->setLabel('Catégorie'),
                MoneyField::new('price')->setCurrency('EUR'),
                IntegerField::new('stock'),
                BooleanField::new('isActive')->setLabel('Actif'),
            ];
        }

        // Vue formulaire : organisation complète
        return [
            // === ONGLET 1 : Informations ===
            FormField::addTab('Informations')
                ->setIcon('fa fa-info-circle'),

            FormField::addColumn(8),
            TextField::new('name')
                ->setLabel('Nom du produit')
                ->setRequired(true)
                ->setHelp('Le nom affiché sur le site'),

            SlugField::new('slug')
                ->setTargetFieldName('name')
                ->setLabel('URL'),

            TextEditorField::new('description')
                ->setLabel('Description complète'),

            FormField::addColumn(4),
            AssociationField::new('category')
                ->setLabel('Catégorie')
                ->setRequired(true),

            BooleanField::new('isActive')
                ->setLabel('Produit actif'),

            BooleanField::new('isFeatured')
                ->setLabel('Mise en avant'),

            // === ONGLET 2 : Prix et Stock ===
            FormField::addTab('Commerce')
                ->setIcon('fa fa-euro-sign'),

            FormField::addFieldset('Prix'),

            MoneyField::new('price')
                ->setCurrency('EUR')
                ->setStoredAsCents(false)
                ->setLabel('Prix de vente'),

            MoneyField::new('costPrice')
                ->setCurrency('EUR')
                ->setStoredAsCents(false)
                ->setLabel('Prix d\'achat'),

            FormField::addFieldset('Stock'),

            IntegerField::new('stock')
                ->setLabel('Quantité en stock'),

            IntegerField::new('lowStockThreshold')
                ->setLabel('Seuil d\'alerte')
                ->setHelp('Alerte quand le stock passe en dessous'),

            // === ONGLET 3 : SEO ===
            FormField::addTab('SEO')
                ->setIcon('fa fa-search'),

            TextField::new('metaTitle')
                ->setLabel('Titre SEO')
                ->setHelp('Titre affiché dans les résultats Google'),

            TextareaField::new('metaDescription')
                ->setLabel('Description SEO')
                ->setHelp('Description affichée dans les résultats Google'),
        ];
    }
}
```

---

## Étapes Pratiques

### Étape 0 : Grand Nettoyage (Transition PHP -> Symfony)

Bravo d'avoir terminé le module d'apprentissage PHP ! Avant de reprendre le développement de ta boutique, tu dois remettre le projet "au propre".

**1. Nettoyage des fichiers d'exercice PHP**
Dans le dossier `public/`, tu as créé beaucoup de fichiers (`test.php`, `poo.php`, `demo-namespace/`...).

- Supprime tous ces fichiers d'exercices.
- ⚠️ **Attention** : Ne supprime PAS le fichier `index.php`. C'est le point d'entrée de Symfony !

**2. Nettoyage des données (Base de données)**
Tu vas ajouter des champs obligatoires (comme la date de création) à tes produits.
Si tu as déjà créé des produits lors de la fiche précédente, la base de données va refuser la modification car elle ne saura pas quelle date mettre pour les anciens produits.

**Avant de toucher au code** :

1. Va sur ton interface admin : `http://localhost:8080/admin`
2. Supprime **tous** les produits existants (clique sur les 3 petits points à droite > Delete).
3. Si tu as créé des catégories, supprime-les aussi.

Une fois la liste vide et les fichiers inutiles supprimés, tu peux continuer sereinement.

---

### Étape 1 : Modifier l'entité Product

Tu vas ajouter des champs à l'entité Product pour illustrer les différents types.

Entre dans le conteneur PHP :

```bash
docker compose exec php bash
```

Modifie l'entité Product :

```bash
php bin/console make:entity Product
```

Ajoute ces nouveaux champs :

| Nom | Type | Nullable |
| --- | ---- | -------- |
| description | text | yes |
| stock | integer | no |
| isActive | boolean | no |
| slug | string(255) | no |
| createdAt | datetime_immutable | no |

---

### Étape 2 : Créer la migration

```bash
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

---

### Étape 3 : Mettre à jour ProductCrudController

Ouvre `app/src/Controller/Admin/ProductCrudController.php` et remplace son contenu par :

```php
<?php

namespace App\Controller\Admin;

use App\Entity\Product;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\FormField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Field\MoneyField;
use EasyCorp\Bundle\EasyAdminBundle\Field\SlugField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class ProductCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Product::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Produit')
            ->setEntityLabelInPlural('Produits')
            ->setDefaultSort(['createdAt' => 'DESC'])
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        // Champs pour la liste
        if ($pageName === Crud::PAGE_INDEX) {
            return [
                IdField::new('id'),
                TextField::new('name')->setLabel('Nom'),
                MoneyField::new('price')->setCurrency('EUR')->setStoredAsCents(false),
                IntegerField::new('stock'),
                BooleanField::new('isActive')->setLabel('Actif'),
                DateTimeField::new('createdAt')->setLabel('Créé le'),
            ];
        }

        // Champs pour le formulaire
        return [
            FormField::addTab('Informations')
                ->setIcon('fa fa-info-circle'),

            TextField::new('name')
                ->setLabel('Nom du produit')
                ->setRequired(true),

            SlugField::new('slug')
                ->setTargetFieldName('name')
                ->setLabel('URL'),

            TextareaField::new('description')
                ->setLabel('Description'),

            FormField::addTab('Commerce')
                ->setIcon('fa fa-euro-sign'),

            MoneyField::new('price')
                ->setCurrency('EUR')
                ->setStoredAsCents(false)
                ->setLabel('Prix'),

            IntegerField::new('stock')
                ->setLabel('Stock'),

            BooleanField::new('isActive')
                ->setLabel('Produit actif'),

            DateTimeField::new('createdAt')
                ->setLabel('Date de création')
                ->hideOnForm(),
        ];
    }
}
```

---

### Étape 4 : Initialiser createdAt automatiquement

Modifie l'entité `Product` pour initialiser `createdAt` dans le constructeur :

```php
// Dans src/Entity/Product.php

public function __construct()
{
    $this->createdAt = new \DateTimeImmutable();
}
```

---

### Étape 5 : Vider le cache et tester

```bash
php bin/console cache:clear
exit
```

Va sur `http://localhost:8080/admin` et teste :

1. Crée un nouveau produit
2. Vérifie que les onglets fonctionnent
3. Vérifie que le slug se génère automatiquement
4. Vérifie que le toggle fonctionne pour "Actif"

---

### Étape 6 : Commiter les changements

```bash
git add .
git commit -m "Add advanced fields to ProductCrudController"
git push
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console make:entity` | Ajouter des champs à une entité |
| `php bin/console make:migration` | Générer une migration |
| `php bin/console doctrine:migrations:migrate` | Exécuter les migrations |
| `php bin/console cache:clear` | Vider le cache |

---

## Pièges Fréquents

### Piège 1 : MoneyField affiche un prix incorrect

**Problème** : Le prix affiché est 100x plus grand ou plus petit que prévu.

**Cause** : Par défaut, MoneyField suppose que les prix sont stockés en centimes.

**Solution** : Si tu stockes en euros (ex: 9.99), ajoute `setStoredAsCents(false)` :

```php
MoneyField::new('price')
    ->setCurrency('EUR')
    ->setStoredAsCents(false)  // Important !
```

---

### Piège 2 : SlugField ne se met pas à jour

**Problème** : Le slug ne change pas quand tu modifies le titre.

**Cause** : En édition, EasyAdmin affiche le slug verrouillé (lecture seule) pour ne pas casser une URL déjà indexée. Il ne se régénère donc pas tout seul quand tu changes le titre.

**Solution** : Sur le formulaire d'édition, clique sur le cadenas à côté du champ slug pour le déverrouiller, puis modifie-le (ou laisse-le se régénérer). Cette possibilité existe par défaut, sans configuration. La méthode `setUnlockConfirmationMessage()` sert uniquement à personnaliser le message de confirmation affiché au moment du déverrouillage :

```php
SlugField::new('slug')
    ->setTargetFieldName('name')
    // Personnalise seulement le texte du message de confirmation au déverrouillage
    ->setUnlockConfirmationMessage('Le slug a été personnalisé. Voulez-vous le régénérer ?')
```

---

### Piège 3 : Erreur "createdAt cannot be null"

**Problème** : Erreur lors de la création d'un produit.

**Cause** : Le champ `createdAt` n'est pas initialisé et n'est pas nullable.

**Solution** : Initialise `createdAt` dans le constructeur de l'entité :

```php
public function __construct()
{
    $this->createdAt = new \DateTimeImmutable();
}
```

---

### Piège 4 : Les onglets n'apparaissent pas

**Problème** : Les onglets ne s'affichent pas, tous les champs sont sur une seule page.

**Cause** : Tu utilises `FormField::addTab()` dans la vue liste.

**Solution** : Les onglets ne fonctionnent que dans les formulaires (new/edit). Vérifie ta condition :

```php
if ($pageName === Crud::PAGE_INDEX) {
    // Pas d'onglets ici, juste les champs pour la liste
    return [...];
}

// Onglets pour les formulaires
return [
    FormField::addTab('Info'),
    ...
];
```

---

## Checklist de Validation

- [ ] Je connais les principaux types de champs (TextField, MoneyField, BooleanField, etc.)
- [ ] Je sais utiliser le Fluent Interface pour configurer les champs
- [ ] Je sais organiser un formulaire avec des onglets (FormField::addTab)
- [ ] Je sais grouper des champs avec FormField::addFieldset
- [ ] Je sais afficher des champs côte à côte avec FormField::addColumn
- [ ] Je comprends la différence entre DateTimeImmutable et DateTime
- [ ] Mon ProductCrudController utilise des onglets

---

## Exercice Pratique

**Énoncé** : Crée une entité `Article` pour un blog avec un formulaire organisé en 3 onglets.

**Champs de l'entité Article** :

| Champ | Type | Description |
| ----- | ---- | ----------- |
| title | string(255) | Titre de l'article |
| slug | string(255) | URL de l'article |
| content | text | Contenu de l'article |
| excerpt | text, nullable | Résumé court |
| status | string(20) | draft, published, archived |
| publishedAt | datetime_immutable, nullable | Date de publication |
| createdAt | datetime_immutable | Date de création |
| metaTitle | string(255), nullable | Titre SEO |
| metaDescription | text, nullable | Description SEO |
| isFeatured | boolean | Mise en avant |

**Organisation du formulaire** :

- **Onglet "Contenu"** : title, slug, excerpt, content
- **Onglet "Publication"** : status (avec choix), publishedAt, isFeatured
- **Onglet "SEO"** : metaTitle, metaDescription

**Indications** :

1. Crée l'entité avec `php bin/console make:entity Article`
2. Crée la migration et exécute-la
3. Crée le CRUD avec `php bin/console make:admin:crud`
4. Configure les champs dans `ArticleCrudController`
5. Ajoute l'article au menu dans `DashboardController`

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1 : Créer l'entité Article**

```bash
docker compose exec php bash
php bin/console make:entity Article
```

Ajoute tous les champs selon le tableau.

---

**Étape 2 : Initialiser les valeurs par défaut**

Modifie `src/Entity/Article.php` :

```php
public function __construct()
{
    $this->createdAt = new \DateTimeImmutable();
    $this->status = 'draft';
    $this->isFeatured = false;
}
```

---

**Étape 3 : Créer et exécuter la migration**

```bash
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

---

**Étape 4 : Créer le CRUD**

```bash
php bin/console make:admin:crud
```

Sélectionne `Article`.

---

**Étape 5 : Configurer ArticleCrudController**

```php
<?php

namespace App\Controller\Admin;

use App\Entity\Article;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\FormField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\SlugField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class ArticleCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Article::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Article')
            ->setEntityLabelInPlural('Articles')
            ->setDefaultSort(['createdAt' => 'DESC'])
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        // Liste
        if ($pageName === Crud::PAGE_INDEX) {
            return [
                IdField::new('id'),
                TextField::new('title')->setLabel('Titre'),
                ChoiceField::new('status')
                    ->setLabel('Statut')
                    ->setChoices([
                        'Brouillon' => 'draft',
                        'Publié' => 'published',
                        'Archivé' => 'archived',
                    ])
                    ->renderAsBadges([
                        'draft' => 'warning',
                        'published' => 'success',
                        'archived' => 'secondary',
                    ]),
                BooleanField::new('isFeatured')->setLabel('À la une'),
                DateTimeField::new('publishedAt')->setLabel('Publié le'),
            ];
        }

        // Formulaire
        return [
            // === Onglet Contenu ===
            FormField::addTab('Contenu')
                ->setIcon('fa fa-file-alt'),

            TextField::new('title')
                ->setLabel('Titre')
                ->setRequired(true),

            SlugField::new('slug')
                ->setTargetFieldName('title')
                ->setLabel('URL'),

            TextareaField::new('excerpt')
                ->setLabel('Résumé')
                ->setHelp('Affiché dans la liste des articles')
                ->setNumOfRows(3),

            TextEditorField::new('content')
                ->setLabel('Contenu'),

            // === Onglet Publication ===
            FormField::addTab('Publication')
                ->setIcon('fa fa-calendar'),

            ChoiceField::new('status')
                ->setLabel('Statut')
                ->setChoices([
                    'Brouillon' => 'draft',
                    'Publié' => 'published',
                    'Archivé' => 'archived',
                ]),

            DateTimeField::new('publishedAt')
                ->setLabel('Date de publication'),

            BooleanField::new('isFeatured')
                ->setLabel('Mettre à la une'),

            // === Onglet SEO ===
            FormField::addTab('SEO')
                ->setIcon('fa fa-search'),

            TextField::new('metaTitle')
                ->setLabel('Titre SEO')
                ->setHelp('Titre dans les résultats Google (max 60 caractères)'),

            TextareaField::new('metaDescription')
                ->setLabel('Description SEO')
                ->setHelp('Description dans les résultats Google (max 160 caractères)')
                ->setNumOfRows(3),
        ];
    }
}
```

---

**Étape 6 : Ajouter au menu**

Dans `DashboardController.php`, ajoute :

```php
use App\Entity\Article;

// Dans configureMenuItems()
yield MenuItem::linkToCrud('Articles', 'fa fa-newspaper', Article::class);
```

---

**Étape 7 : Vider le cache et tester**

```bash
php bin/console cache:clear
exit
```

Va sur `/admin` et teste le formulaire Article avec ses 3 onglets.

---

## Navigation

← Fiche précédente : **[Installer EasyAdmin et créer une interface d'administration](01-easyadmin-installation.md)**

→ Fiche suivante : **[Sécuriser l'administration avec l'authentification](03-easyadmin-authentification.md)**
