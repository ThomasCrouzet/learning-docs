---
tags:
  - Symfony
  - Avancé
  - Pratique
description: "Les formulaires"
estimated_time: "60 min"
fiche_number: 9
total_fiches: 21
cursus: "Symfony"
id: "web.symfony.formulaires"
course_id: "web.symfony"
content_type: "lesson"
order: 9
---

# 09 - Les formulaires

> **En bref** : À la fin de cette fiche, tu sauras créer des formulaires Symfony liés à des entités, les afficher dans Twig et gérer leur soumission. Lecture estimée : 60 min.


## Prérequis

- Avoir lu la fiche **[02 - Contrôleurs et routes](02-controleurs-routes.md)**
- Avoir lu la fiche **[03 - Templates Twig](03-templates-twig.md)**
- Avoir lu la fiche **[05 - Créer des entités](05-creer-entites.md)**
- Avoir lu la fiche **[08 - Repository et CRUD](08-repository-crud.md)**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des formulaires Symfony liés à des entités, les afficher dans Twig et gérer leur soumission.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un formulaire Symfony ?

**Définition** : Un formulaire Symfony est un objet PHP qui gère la création, l'affichage et le traitement des formulaires HTML.

**Le problème que les formulaires Symfony résolvent** :

Sans le composant Form, voici les problèmes rencontrés :

1. **HTML manuel** : Écrire chaque `<input>` à la main avec les bons attributs.
2. **Validation manuelle** : Vérifier chaque champ avec des `if`.
3. **Sécurité** : Gérer la protection CSRF manuellement.
4. **Hydratation** : Transférer les données du formulaire vers l'objet à la main.

**Comment Symfony résout ces problèmes** :

| Problème | Solution apportée par Symfony |
| -------- | ----------------------------- |
| HTML manuel | Génère le HTML automatiquement |
| Validation manuelle | Contraintes de validation déclaratives |
| Sécurité CSRF | Token CSRF automatique |
| Hydratation | Remplit automatiquement l'entité |

**Analogie concrète** : Imagine un formulaire papier pré-imprimé avec des cases. Le formulaire Symfony est comme ce modèle pré-imprimé : il définit les champs, leurs types (texte, nombre, date...), et les règles (obligatoire, format email...). Quand quelqu'un remplit le formulaire, les données sont automatiquement vérifiées et rangées au bon endroit.

---

### L'architecture des formulaires

Un formulaire Symfony se compose de trois parties :

```text
1. FormType (définition)
   └── Définit les champs et leurs options
   └── Fichier : src/Form/[Entité]Type.php

2. Contrôleur (traitement)
   └── Crée le formulaire
   └── Gère la soumission
   └── Sauvegarde les données

3. Template (affichage)
   └── Affiche le HTML du formulaire
   └── Fichier : templates/[dossier]/[action].html.twig
```

---

### Les types de champs

Symfony propose de nombreux types de champs prédéfinis :

**Champs texte** :

| Type | Rendu HTML | Usage |
| ---- | ---------- | ----- |
| `TextType` | `<input type="text">` | Texte court |
| `TextareaType` | `<textarea>` | Texte long |
| `EmailType` | `<input type="email">` | Adresse email |
| `PasswordType` | `<input type="password">` | Mot de passe |
| `UrlType` | `<input type="url">` | URL |

**Champs numériques** :

| Type | Rendu HTML | Usage |
| ---- | ---------- | ----- |
| `IntegerType` | `<input type="number">` | Nombre entier |
| `NumberType` | `<input type="text">` | Nombre décimal |
| `MoneyType` | `<input>` avec devise | Prix |
| `PercentType` | `<input>` avec % | Pourcentage |

**Champs de choix** :

| Type | Rendu HTML | Usage |
| ---- | ---------- | ----- |
| `ChoiceType` | `<select>` ou radio/checkbox | Liste de choix |
| `EntityType` | `<select>` | Choix parmi des entités |
| `CheckboxType` | `<input type="checkbox">` | Case à cocher |

**Champs de date** :

| Type | Rendu HTML | Usage |
| ---- | ---------- | ----- |
| `DateType` | 3 selects ou input date | Date |
| `DateTimeType` | Date + heure | Date et heure |
| `TimeType` | Sélecteurs d'heure | Heure seule |

**Autres** :

| Type | Rendu HTML | Usage |
| ---- | ---------- | ----- |
| `FileType` | `<input type="file">` | Upload de fichier |
| `HiddenType` | `<input type="hidden">` | Champ caché |
| `SubmitType` | `<button type="submit">` | Bouton de soumission |

---

### Le cycle de vie d'un formulaire

Le diagramme suivant illustre le flux complet d'un formulaire Symfony, de la définition du FormType jusqu'à la sauvegarde en base :

<div class="diagram-design">
<p><a href="../../diagrams/03-symfony-09-formulaires-1.html">Le cycle de vie d&#x27;un formulaire (HTML + SVG)</a></p>
<iframe src="../../diagrams/03-symfony-09-formulaires-1.html" title="Le cycle de vie d&#x27;un formulaire" style="width:100%;min-height:676px;border:0;background:transparent"></iframe>
</div>

Sous forme textuelle :

```text
1. CRÉATION
   $form = $this->createForm(ProductType::class, $product);

2. SOUMISSION
   $form->handleRequest($request);

3. VALIDATION
   if ($form->isSubmitted() && $form->isValid()) {
       // Les données sont valides
   }

4. TRAITEMENT
   $em->persist($product);
   $em->flush();
```

**Explication de chaque étape** :

| Étape | Méthode | Ce qui se passe |
| ----- | ------- | --------------- |
| Création | `createForm()` | Symfony crée l'objet formulaire |
| Soumission | `handleRequest()` | Symfony remplit le formulaire avec les données POST |
| Validation | `isSubmitted()` | Vérifie si le formulaire a été soumis |
| Validation | `isValid()` | Vérifie si les données respectent les contraintes |

---

### La protection CSRF

**Définition** : CSRF (Cross-Site Request Forgery) est une attaque où un site malveillant fait soumettre un formulaire à ton insu.

**Protection automatique** : Symfony ajoute un champ caché `_token` à chaque formulaire. Ce token est vérifié à la soumission.

Tu n'as rien à faire : la protection est active par défaut.

---

## Étapes Pratiques

### Étape 1 : Créer un formulaire avec make:form

```bash
php bin/console make:form
```

**Dialogue** :

```text
The name of the form class (e.g. GentlePizzaType):
> ProductType

The name of Entity or fully qualified model class name that the new form will be bound to (empty for none):
> Product

created: src/Form/ProductType.php

Success!
```

---

### Étape 2 : Examiner le formulaire généré

```php
<?php
// src/Form/ProductType.php

namespace App\Form;

use App\Entity\Product;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProductType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name')        // Champ pour la propriété "name"
            ->add('price')       // Champ pour la propriété "price"
            ->add('description') // Champ pour la propriété "description"
            ->add('available')   // Champ pour la propriété "available"
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Product::class,  // Lie le formulaire à l'entité
        ]);
    }
}
```

**Explication** :

- `buildForm()` : Définit les champs du formulaire
- `add('name')` : Ajoute un champ. Symfony devine le type selon l'entité
- `configureOptions()` : Configure le formulaire (ici, le lie à Product)

---

### Étape 3 : Personnaliser les types de champs

```php
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\MoneyType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

public function buildForm(FormBuilderInterface $builder, array $options): void
{
    $builder
        ->add('name', TextType::class, [
            'label' => 'Nom du produit',
            'attr' => [
                'placeholder' => 'Entrez le nom...',
                'class' => 'form-control',
            ],
        ])
        ->add('price', MoneyType::class, [
            'label' => 'Prix',
            'currency' => 'EUR',
        ])
        ->add('description', TextareaType::class, [
            'label' => 'Description',
            'required' => false,  // Champ optionnel
            'attr' => [
                'rows' => 5,
            ],
        ])
        ->add('available', CheckboxType::class, [
            'label' => 'Disponible à la vente',
            'required' => false,
        ])
        ->add('save', SubmitType::class, [
            'label' => 'Enregistrer',
            'attr' => ['class' => 'btn btn-primary'],
        ])
    ;
}
```

**Options courantes des champs** :

| Option | Type | Description |
| ------ | ---- | ----------- |
| `label` | string | Libellé du champ |
| `required` | bool | Champ obligatoire (true par défaut) |
| `attr` | array | Attributs HTML du champ |
| `data` | mixed | Valeur par défaut |
| `disabled` | bool | Champ désactivé |
| `mapped` | bool | Lié à l'entité (true par défaut) |
| `help` | string | Texte d'aide sous le champ |

---

### Étape 4 : Utiliser le formulaire dans le contrôleur

```php
// src/Controller/ProductController.php

use App\Entity\Product;
use App\Form\ProductType;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/products')]
class ProductController extends AbstractController
{
    #[Route('/new', name: 'product_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $em): Response
    {
        // 1. Créer une nouvelle entité vide
        $product = new Product();

        // 2. Créer le formulaire lié à cette entité
        $form = $this->createForm(ProductType::class, $product);

        // 3. Traiter la requête (remplit le formulaire si POST)
        $form->handleRequest($request);

        // 4. Vérifier si le formulaire est soumis ET valide
        if ($form->isSubmitted() && $form->isValid()) {
            // 5. À ce stade, $product contient les données du formulaire

            // 6. Sauvegarder en base
            $em->persist($product);
            $em->flush();

            // 7. Rediriger vers une autre page
            return $this->redirectToRoute('product_show', ['id' => $product->getId()]);
        }

        // 8. Afficher le formulaire (GET ou formulaire invalide)
        return $this->render('product/new.html.twig', [
            'form' => $form,
        ]);
    }
}
```

**Flux d'exécution** :

```text
Première visite (GET) :
1. Crée un Product vide
2. Crée le formulaire
3. handleRequest() ne fait rien (pas de POST)
4. isSubmitted() retourne false
5. Affiche le formulaire vide

Soumission (POST) :
1. Crée un Product vide
2. Crée le formulaire
3. handleRequest() remplit $product avec les données POST
4. isSubmitted() retourne true
5. isValid() vérifie les contraintes
6. Si valide : sauvegarde et redirige
7. Si invalide : réaffiche le formulaire avec les erreurs
```

---

### Étape 5 : Afficher le formulaire dans Twig

```twig
{# templates/product/new.html.twig #}

{% extends 'base.html.twig' %}

{% block title %}Nouveau produit{% endblock %}

{% block body %}
    <h1>Créer un nouveau produit</h1>

    {# Affiche le formulaire complet #}
    {{ form(form) }}
{% endblock %}
```

**C'est tout !** `{{ form(form) }}` génère :

- La balise `<form>`
- Tous les champs avec leurs labels
- Le token CSRF
- Le bouton de soumission

---

### Étape 6 : Personnaliser l'affichage du formulaire

Pour plus de contrôle, tu peux afficher chaque partie séparément :

```twig
{% extends 'base.html.twig' %}

{% block body %}
    <h1>Créer un nouveau produit</h1>

    {# Ouvre la balise form #}
    {{ form_start(form) }}

        <div class="row">
            <div class="col-md-6">
                {# Affiche un champ complet (label + input + erreurs) #}
                {{ form_row(form.name) }}
            </div>
            <div class="col-md-6">
                {{ form_row(form.price) }}
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                {{ form_row(form.description) }}
            </div>
        </div>

        {{ form_row(form.available) }}

        <button type="submit" class="btn btn-primary">Enregistrer</button>

    {# Ferme la balise form et ajoute les champs restants (CSRF, etc.) #}
    {{ form_end(form) }}
{% endblock %}
```

**Fonctions Twig pour les formulaires** :

| Fonction | Ce qu'elle affiche |
| -------- | ------------------ |
| `form(form)` | Le formulaire complet |
| `form_start(form)` | Balise `<form>` d'ouverture |
| `form_end(form)` | Balise `</form>` + champs non affichés |
| `form_row(form.field)` | Label + champ + erreurs |
| `form_label(form.field)` | Label seul |
| `form_widget(form.field)` | Champ seul (input) |
| `form_errors(form.field)` | Erreurs seules |
| `form_help(form.field)` | Texte d'aide seul |

---

### Étape 7 : Formulaire d'édition

Le formulaire d'édition est presque identique, mais on charge l'entité existante :

```php
#[Route('/{id}/edit', name: 'product_edit', methods: ['GET', 'POST'])]
public function edit(Product $product, Request $request, EntityManagerInterface $em): Response
{
    // Le formulaire est créé avec l'entité existante
    $form = $this->createForm(ProductType::class, $product);

    $form->handleRequest($request);

    if ($form->isSubmitted() && $form->isValid()) {
        // Pas besoin de persist() : l'entité est déjà gérée
        $em->flush();

        return $this->redirectToRoute('product_show', ['id' => $product->getId()]);
    }

    return $this->render('product/edit.html.twig', [
        'form' => $form,
        'product' => $product,
    ]);
}
```

---

### Étape 8 : Ajouter des contraintes de validation

Les contraintes se définissent dans l'entité avec des attributs :

```php
// src/Entity/Product.php

use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    // ...

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Le nom est obligatoire')]
    #[Assert\Length(
        min: 3,
        max: 255,
        minMessage: 'Le nom doit faire au moins {{ limit }} caractères',
        maxMessage: 'Le nom ne peut pas dépasser {{ limit }} caractères'
    )]
    private ?string $name = null;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    #[Assert\NotBlank(message: 'Le prix est obligatoire')]
    #[Assert\Positive(message: 'Le prix doit être positif')]
    private ?string $price = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Assert\Length(max: 1000, maxMessage: 'La description est trop longue')]
    private ?string $description = null;
}
```

**Contraintes courantes** :

| Contrainte | Validation |
| ---------- | ---------- |
| `#[Assert\NotBlank]` | Champ non vide |
| `#[Assert\NotNull]` | Valeur non nulle |
| `#[Assert\Length(min, max)]` | Longueur de chaîne |
| `#[Assert\Email]` | Format email valide |
| `#[Assert\Positive]` | Nombre > 0 |
| `#[Assert\PositiveOrZero]` | Nombre >= 0 |
| `#[Assert\Range(min, max)]` | Valeur dans une plage |
| `#[Assert\Choice(choices)]` | Valeur dans une liste |
| `#[Assert\Regex(pattern)]` | Correspond à une regex |
| `#[Assert\Url]` | URL valide |

---

### Étape 9 : Champ de sélection d'entité (EntityType)

Pour sélectionner une entité liée (ex: catégorie d'un produit) :

```php
use App\Entity\Category;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;

public function buildForm(FormBuilderInterface $builder, array $options): void
{
    $builder
        ->add('name', TextType::class)
        ->add('category', EntityType::class, [
            'class' => Category::class,           // L'entité à lister
            'choice_label' => 'name',             // Propriété affichée
            'placeholder' => 'Choisir une catégorie',
            'required' => true,
        ])
    ;
}
```

**Options de EntityType** :

| Option | Description |
| ------ | ----------- |
| `class` | Classe de l'entité (obligatoire) |
| `choice_label` | Propriété à afficher ou callable |
| `query_builder` | Filtre les résultats |
| `placeholder` | Option vide au début |
| `multiple` | Sélection multiple |
| `expanded` | Affiche en radio/checkbox |

**Filtrer les choix avec query_builder** :

```php
->add('category', EntityType::class, [
    'class' => Category::class,
    'choice_label' => 'name',
    'query_builder' => function (CategoryRepository $repo) {
        return $repo->createQueryBuilder('c')
            ->where('c.active = :active')
            ->setParameter('active', true)
            ->orderBy('c.name', 'ASC');
    },
])
```

---

### Étape 10 : Champ de choix simple (ChoiceType)

Pour une liste de choix prédéfinis :

```php
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;

->add('status', ChoiceType::class, [
    'label' => 'Statut',
    'choices' => [
        'Brouillon' => 'draft',
        'Publié' => 'published',
        'Archivé' => 'archived',
    ],
    'placeholder' => 'Sélectionner un statut',
])
```

**Affichage en radio buttons** :

```php
->add('status', ChoiceType::class, [
    'choices' => [
        'Brouillon' => 'draft',
        'Publié' => 'published',
    ],
    'expanded' => true,   // Radio buttons au lieu de select
    'multiple' => false,
])
```

**Affichage en checkboxes** :

```php
->add('options', ChoiceType::class, [
    'choices' => [
        'Option A' => 'a',
        'Option B' => 'b',
        'Option C' => 'c',
    ],
    'expanded' => true,   // Checkboxes
    'multiple' => true,   // Plusieurs choix possibles
])
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console make:form` | Créer un nouveau formulaire |
| `php bin/console debug:form ProductType` | Afficher les options d'un formulaire |
| `php bin/console debug:validator Product` | Afficher les contraintes d'une entité |

---

## Pièges Fréquents

### Piège 1 : Oublier handleRequest()

**Problème** : Le formulaire est toujours vide après soumission.

**Cause** : Sans `handleRequest()`, le formulaire ne traite pas les données POST.

```php
// ❌ Le formulaire ne sera jamais rempli
$form = $this->createForm(ProductType::class, $product);
if ($form->isSubmitted()) { /* Jamais vrai */ }

// ✅ Correct
$form = $this->createForm(ProductType::class, $product);
$form->handleRequest($request);
if ($form->isSubmitted()) { /* Fonctionne */ }
```

---

### Piège 2 : Mauvais ordre des vérifications

**Problème** : Tu appelles `isValid()` sans vérifier `isSubmitted()` d'abord.

```php
// ❌ Peut causer des comportements inattendus
if ($form->isValid()) {

// ✅ Toujours vérifier les deux
if ($form->isSubmitted() && $form->isValid()) {
```

---

### Piège 3 : Champ non mappé qui cause une erreur

**Problème** : Tu ajoutes un champ qui n'existe pas dans l'entité.

**Cause** : Par défaut, Symfony essaie de mapper tous les champs à l'entité.

**Solution** : Utiliser `'mapped' => false` :

```php
->add('acceptTerms', CheckboxType::class, [
    'label' => 'J\'accepte les conditions',
    'mapped' => false,  // Ce champ n'existe pas dans l'entité
    'required' => true,
])
```

---

### Piège 4 : EntityType avec entités non chargées

**Problème** : Erreur "Entity of type X is not managed" ou "Object not found".

**Cause** : L'entité dans le formulaire n'est plus gérée par Doctrine.

**Solution** : S'assurer que l'entité est chargée dans la même session EntityManager.

---

### Piège 5 : Les erreurs ne s'affichent pas

**Problème** : Le formulaire est invalide mais aucune erreur n'apparaît.

**Cause** : Tu utilises `form_widget()` sans `form_errors()`.

**Solution** : Utiliser `form_row()` qui inclut les erreurs, ou ajouter `form_errors()` :

```twig
{# ❌ Pas d'erreurs affichées #}
{{ form_widget(form.name) }}

{# ✅ Avec erreurs #}
{{ form_row(form.name) }}

{# Ou manuellement #}
{{ form_errors(form.name) }}
{{ form_widget(form.name) }}
```

### Piège 6 : Récupérer les erreurs dans le contrôleur (usage API)

**Contexte** : quand tu construis une API JSON (voir fiche 16), tu dois renvoyer les erreurs de validation sans passer par Twig.

**Solution** : `$form->getErrors(true)` retourne toutes les erreurs (y compris imbriquées) :

```php
if ($form->isSubmitted() && !$form->isValid()) {
    $erreurs = [];
    foreach ($form->getErrors(true) as $erreur) {
        // getOrigin()->getName() = nom du champ en erreur ; chaine vide si l'erreur porte sur le formulaire entier (contrainte de classe, erreur non mappee, ou echec du token CSRF)
        $erreurs[] = $erreur->getOrigin()->getName() . ' : ' . $erreur->getMessage();
    }
    return $this->json(['errors' => $erreurs], 422);
}
```

**Désactiver la protection CSRF pour les formulaires API** :

Le token CSRF est utile pour les formulaires HTML soumis par un navigateur, mais inutile (et bloquant) pour les requêtes JSON envoyées depuis un client API. Tu peux le désactiver dans le `FormType` :

```php
// Dans configureOptions()
$resolver->setDefaults([
    'data_class' => Product::class,
    'csrf_protection' => false,  // Désactive pour les endpoints API
]);
```

> **Sécurité** : désactiver le CSRF n'est acceptable **que** si l'endpoint est protégé autrement (authentification par token/Bearer, clé API, session + SameSite pour un SPA contrôlé, etc.). Un endpoint public sans CSRF ni authentification peut être abusé. Voir aussi la fiche **[16 - API JSON](16-api-json.md)** (piège « Ne pas protéger les endpoints »).

---

## Checklist de Validation

- [ ] Je sais créer un formulaire avec `make:form`
- [ ] Je comprends la structure d'un FormType (buildForm, configureOptions)
- [ ] Je sais utiliser le formulaire dans un contrôleur (createForm, handleRequest)
- [ ] Je sais afficher un formulaire dans Twig
- [ ] Je comprends le cycle isSubmitted/isValid
- [ ] Je sais ajouter des contraintes de validation à une entité
- [ ] Je sais utiliser EntityType pour les relations

---

## Exercice Pratique

**Énoncé** : Crée un formulaire complet pour gérer des articles de blog.

**Spécifications** :

1. Entité `Article` avec :
   - `title` (string, obligatoire, 3-100 caractères)
   - `content` (text, obligatoire, min 50 caractères)
   - `category` (relation ManyToOne vers Category)
   - `status` (choix : draft, published, archived)
   - `publishedAt` (datetime, nullable)

2. Formulaire `ArticleType` avec :
   - Champ titre avec placeholder
   - Champ contenu en textarea
   - Sélection de catégorie
   - Choix du statut en radio buttons
   - Date de publication

3. Contrôleur avec :
   - Route `/articles/new` pour créer
   - Route `/articles/{id}/edit` pour modifier

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Entité `src/Entity/Article.php`** :

```php
<?php

namespace App\Entity;

use App\Repository\ArticleRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ArticleRepository::class)]
class Article
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'Le titre est obligatoire')]
    #[Assert\Length(
        min: 3,
        max: 100,
        minMessage: 'Le titre doit faire au moins {{ limit }} caractères',
        maxMessage: 'Le titre ne peut pas dépasser {{ limit }} caractères'
    )]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Assert\NotBlank(message: 'Le contenu est obligatoire')]
    #[Assert\Length(min: 50, minMessage: 'Le contenu doit faire au moins {{ limit }} caractères')]
    private ?string $content = null;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull(message: 'La catégorie est obligatoire')]
    private ?Category $category = null;

    #[ORM\Column(length: 20)]
    #[Assert\Choice(choices: ['draft', 'published', 'archived'])]
    private ?string $status = 'draft';

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $publishedAt = null;

    // Getters et setters...
}
```

**Formulaire `src/Form/ArticleType.php`** :

```php
<?php

namespace App\Form;

use App\Entity\Article;
use App\Entity\Category;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ArticleType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'label' => 'Titre de l\'article',
                'attr' => [
                    'placeholder' => 'Entrez le titre de l\'article...',
                ],
            ])
            ->add('content', TextareaType::class, [
                'label' => 'Contenu',
                'attr' => [
                    'rows' => 10,
                    'placeholder' => 'Écrivez votre article ici...',
                ],
            ])
            ->add('category', EntityType::class, [
                'class' => Category::class,
                'choice_label' => 'name',
                'label' => 'Catégorie',
                'placeholder' => 'Sélectionnez une catégorie',
            ])
            ->add('status', ChoiceType::class, [
                'label' => 'Statut',
                'choices' => [
                    'Brouillon' => 'draft',
                    'Publié' => 'published',
                    'Archivé' => 'archived',
                ],
                'expanded' => true,  // Radio buttons
            ])
            ->add('publishedAt', DateTimeType::class, [
                'label' => 'Date de publication',
                'required' => false,
                'widget' => 'single_text',
            ])
            ->add('save', SubmitType::class, [
                'label' => 'Enregistrer',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Article::class,
        ]);
    }
}
```

**Contrôleur `src/Controller/ArticleController.php`** :

```php
<?php

namespace App\Controller;

use App\Entity\Article;
use App\Form\ArticleType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/articles')]
class ArticleController extends AbstractController
{
    #[Route('/new', name: 'article_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $em): Response
    {
        $article = new Article();

        $form = $this->createForm(ArticleType::class, $article);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($article);
            $em->flush();

            return $this->redirectToRoute('article_show', ['id' => $article->getId()]);
        }

        return $this->render('article/new.html.twig', [
            'form' => $form,
        ]);
    }

    #[Route('/{id}/edit', name: 'article_edit', methods: ['GET', 'POST'])]
    public function edit(Article $article, Request $request, EntityManagerInterface $em): Response
    {
        $form = $this->createForm(ArticleType::class, $article);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em->flush();

            return $this->redirectToRoute('article_show', ['id' => $article->getId()]);
        }

        return $this->render('article/edit.html.twig', [
            'form' => $form,
            'article' => $article,
        ]);
    }
}
```

**Template `templates/article/new.html.twig`** :

```twig
{% extends 'base.html.twig' %}

{% block title %}Nouvel article{% endblock %}

{% block body %}
    <h1>Créer un nouvel article</h1>

    {{ form(form) }}
{% endblock %}
```

---

## Navigation

← Fiche précédente : **[Repository et CRUD](08-repository-crud.md)**

→ Fiche suivante : **[Personnaliser EasyAdmin](10-personnaliser-easyadmin.md)**
