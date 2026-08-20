---
tags:
  - Symfony
  - Avancé
  - Pratique
description: "Personnaliser EasyAdmin"
estimated_time: "55 min"
fiche_number: 10
total_fiches: 21
cursus: "Symfony"
---

# 10 - Personnaliser EasyAdmin

> **En bref** : À la fin de cette fiche, tu sauras personnaliser l'interface d'administration EasyAdmin : configurer les champs affichés, modifier les formulaires et personnaliser les listes. Lecture estimée : 55 min.


## Prérequis

- Avoir lu la fiche **[05 - Créer des entités](05-creer-entites.md)**
- Avoir lu la fiche **[07 - Relations entre entités](07-relations-entites.md)**
- Avoir lu la fiche **[08 - Repository et CRUD](08-repository-crud.md)**
- Avoir EasyAdmin installé dans le projet (voir fiche **[01 - Installer EasyAdmin](../03-easyadmin/01-easyadmin-installation.md)**)

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| EasyAdmin | 4.x |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras personnaliser l'interface d'administration EasyAdmin : configurer les champs affichés, modifier les formulaires et personnaliser les listes.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'EasyAdmin ?

**Définition** : EasyAdmin est un bundle Symfony qui génère automatiquement une interface d'administration (back-office) pour gérer les entités de ta base de données.

**Le problème qu'EasyAdmin résout** :

Sans EasyAdmin, pour créer un back-office tu devrais :

1. Créer des contrôleurs CRUD pour chaque entité
2. Créer des formulaires pour chaque entité
3. Créer des templates pour lister, créer, modifier, supprimer
4. Gérer la pagination, les filtres, le tri...

**Comment EasyAdmin résout ces problèmes** :

| Tâche | Sans EasyAdmin | Avec EasyAdmin |
| ----- | -------------- | -------------- |
| CRUD complet | ~4 contrôleurs par entité | 1 classe CrudController |
| Formulaires | FormType + templates | Configuration PHP |
| Liste paginée | Code manuel | Automatique |
| Filtres et tri | À développer | Intégré |

**Analogie concrète** : Imagine un meuble en kit IKEA vs un meuble sur mesure. EasyAdmin est comme le meuble IKEA : tu assembles des pièces préfabriquées et tu peux personnaliser (couleur, poignées...) sans tout construire de zéro.

---

### L'architecture EasyAdmin

EasyAdmin repose sur deux types de contrôleurs :

```text
src/Controller/Admin/
├── DashboardController.php    # Configuration globale + menu
├── ProductCrudController.php  # CRUD pour Product
├── CategoryCrudController.php # CRUD pour Category
└── UserCrudController.php     # CRUD pour User
```

**DashboardController** :

- Configure le back-office (titre, thème, menu)
- Un seul par application
- Route principale : `/admin`

**CrudController** :

- Un par entité à administrer
- Configure l'affichage et les formulaires de cette entité
- Hérite de `AbstractCrudController`

---

### Les trois vues d'un CrudController

Chaque CrudController gère trois vues principales :

| Vue | Page | Ce qu'elle affiche |
| --- | ---- | ------------------ |
| `index` | Liste | Tableau paginé de tous les enregistrements |
| `detail` | Détail | Affichage en lecture d'un enregistrement |
| `new` / `edit` | Formulaire | Création ou modification |

Tu peux personnaliser chaque vue indépendamment.

---

### Les types de champs EasyAdmin

EasyAdmin a ses propres types de champs (différents des FormTypes Symfony) :

**Champs texte** :

| Champ | Usage |
| ----- | ----- |
| `TextField` | Texte court |
| `TextareaField` | Texte long |
| `TextEditorField` | Éditeur WYSIWYG |
| `EmailField` | Email (avec lien mailto) |
| `UrlField` | URL (avec lien cliquable) |
| `SlugField` | Slug auto-généré |

**Champs numériques** :

| Champ | Usage |
| ----- | ----- |
| `IntegerField` | Nombre entier |
| `NumberField` | Nombre décimal |
| `MoneyField` | Prix avec devise |
| `PercentField` | Pourcentage |

**Champs de choix** :

| Champ | Usage |
| ----- | ----- |
| `BooleanField` | Oui/Non (toggle switch) |
| `ChoiceField` | Liste de choix |
| `AssociationField` | Relation vers une autre entité |

**Champs de date** :

| Champ | Usage |
| ----- | ----- |
| `DateField` | Date seule |
| `DateTimeField` | Date et heure |
| `TimeField` | Heure seule |

**Autres** :

| Champ | Usage |
| ----- | ----- |
| `IdField` | ID (lecture seule) |
| `ImageField` | Image uploadée |
| `ArrayField` | Tableau de valeurs |

---

### Les options des champs

Chaque champ peut être configuré avec des méthodes chaînées :

```php
TextField::new('name')
    ->setLabel('Nom du produit')           // Libellé affiché
    ->setHelp('Maximum 255 caractères')    // Texte d'aide
    ->setRequired(true)                    // Obligatoire
    ->setColumns(6)                        // Largeur (sur 12)
    ->hideOnIndex()                        // Masquer dans la liste
    ->hideOnForm()                         // Masquer dans le formulaire
    ->hideOnDetail()                       // Masquer dans le détail
    ->setFormTypeOption('attr', ['placeholder' => 'Entrez le nom...'])
```

---

## Étapes Pratiques

### Étape 1 : Comprendre le DashboardController

Ouvre le fichier `src/Controller/Admin/DashboardController.php` :

```php
<?php

namespace App\Controller\Admin;

use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminDashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Symfony\Component\HttpFoundation\Response;

// #[AdminDashboard] est la façon recommandée depuis EasyAdmin 4.24
// (#[Route] sur index() fonctionne encore en 4.x mais est déprécié)
#[AdminDashboard(routePath: '/admin', routeName: 'admin')]
class DashboardController extends AbstractDashboardController
{
    public function index(): Response
    {
        // index() ne peut pas recevoir d'arguments : on récupère le générateur d'URL
        $adminUrlGenerator = $this->container->get(AdminUrlGenerator::class);

        // Pretty URLs (EasyAdmin 4.14+) : pas de query string crudAction/crudControllerFqcn
        return $this->redirect($adminUrlGenerator
            ->setController(ProductCrudController::class)
            ->generateUrl());

        // Ou affiche le dashboard par défaut
        // return parent::index();
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('Mon Administration');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('Accueil', 'fa fa-home');
        // Les autres éléments de menu seront ajoutés ici
    }
}
```

Si les pretty URLs ne sont pas encore actives, crée `config/routes/easyadmin.yaml` (chargeur de routes EasyAdmin 4.14+) :

```yaml
# config/routes/easyadmin.yaml
easyadmin:
    resource: .
    type: easyadmin.routes
```

---

### Étape 2 : Créer un CrudController

Utilise la commande make pour créer un CrudController :

```bash
php bin/console make:admin:crud
```

**Dialogue** :

```text
Which Doctrine entity are you going to manage with this CRUD controller?
> Product

Choose a name for your controller class [ProductCrudController]:
> ProductCrudController

created: src/Controller/Admin/ProductCrudController.php

Success!
```

---

### Étape 3 : Examiner le CrudController généré

```php
<?php
// src/Controller/Admin/ProductCrudController.php

namespace App\Controller\Admin;

use App\Entity\Product;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class ProductCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Product::class;
    }

    /*
    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id'),
            TextField::new('title'),
            TextEditorField::new('description'),
        ];
    }
    */
}
```

---

### Étape 4 : Ajouter le CRUD au menu

Dans `DashboardController`, ajoute un élément de menu :

```php
use App\Controller\Admin\ProductCrudController;

public function configureMenuItems(): iterable
{
    yield MenuItem::linkToDashboard('Accueil', 'fa fa-home');
    yield MenuItem::linkToCrud('Produits', 'fa fa-box', Product::class);
}
```

**Accède à** `/admin` dans ton navigateur. Tu verras le menu avec "Produits".

---

### Étape 5 : Configurer les champs affichés

Décommente et modifie la méthode `configureFields()` :

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\MoneyField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;

public function configureFields(string $pageName): iterable
{
    return [
        IdField::new('id')
            ->hideOnForm(),  // L'ID n'est pas modifiable

        TextField::new('name')
            ->setLabel('Nom du produit'),

        MoneyField::new('price')
            ->setCurrency('EUR')
            ->setStoredAsCents(false)  // false = prix stocké en euros (voir fiche 03-easyadmin/02)
            ->setLabel('Prix'),

        TextareaField::new('description')
            ->setLabel('Description')
            ->hideOnIndex(),  // Trop long pour la liste

        BooleanField::new('available')
            ->setLabel('Disponible'),
    ];
}
```

---

### Étape 6 : Champs différents selon la vue

Le paramètre `$pageName` indique la vue actuelle :

```php
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;

public function configureFields(string $pageName): iterable
{
    $id = IdField::new('id');
    $name = TextField::new('name')->setLabel('Nom');
    $price = MoneyField::new('price')->setCurrency('EUR')->setStoredAsCents(false);  // false = prix stocké en euros
    $description = TextareaField::new('description');
    $available = BooleanField::new('available');
    $createdAt = DateTimeField::new('createdAt')->setLabel('Créé le');

    // Champs affichés dans la liste
    if ($pageName === Crud::PAGE_INDEX) {
        return [$id, $name, $price, $available, $createdAt];
    }

    // Champs affichés dans le détail
    if ($pageName === Crud::PAGE_DETAIL) {
        return [$id, $name, $price, $description, $available, $createdAt];
    }

    // Champs dans le formulaire (new et edit)
    return [$name, $price, $description, $available];
}
```

**Constantes de page** :

| Constante | Vue |
| --------- | --- |
| `Crud::PAGE_INDEX` | Liste |
| `Crud::PAGE_DETAIL` | Détail |
| `Crud::PAGE_NEW` | Création |
| `Crud::PAGE_EDIT` | Modification |

---

### Étape 7 : Configurer une relation (AssociationField)

Pour afficher une relation vers une autre entité :

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;

public function configureFields(string $pageName): iterable
{
    return [
        TextField::new('name'),

        AssociationField::new('category')
            ->setLabel('Catégorie')
            ->setRequired(true),

        // Pour une relation ManyToMany
        AssociationField::new('tags')
            ->setLabel('Tags')
            ->setFormTypeOptions([
                'by_reference' => false,  // Important pour ManyToMany
            ]),
    ];
}
```

**Options de AssociationField** :

| Méthode | Action |
| ------- | ------ |
| `autocomplete()` | Active l'autocomplétion (pour beaucoup d'options) |
| `setCrudController()` | Lien vers le CRUD de l'entité liée |
| `renderAsNativeWidget()` | Affiche comme select natif |

---

### Étape 8 : Configurer le CRUD (tri, pagination, etc.)

Ajoute la méthode `configureCrud()` :

```php
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;

public function configureCrud(Crud $crud): Crud
{
    return $crud
        // Titre des pages
        ->setEntityLabelInSingular('Produit')
        ->setEntityLabelInPlural('Produits')

        // Titre de la page liste
        ->setPageTitle('index', 'Liste des produits')
        ->setPageTitle('new', 'Créer un produit')
        ->setPageTitle('edit', fn ($entity) => 'Modifier : ' . $entity->getName())

        // Tri par défaut
        ->setDefaultSort(['createdAt' => 'DESC'])

        // Pagination
        ->setPaginatorPageSize(20)

        // Recherche
        ->setSearchFields(['name', 'description'])

        // Format des dates
        ->setDateFormat('dd/MM/yyyy')
        ->setDateTimeFormat('dd/MM/yyyy HH:mm')
    ;
}
```

---

### Étape 9 : Configurer les filtres

Ajoute des filtres pour la liste :

```php
use EasyCorp\Bundle\EasyAdminBundle\Config\Filters;
use EasyCorp\Bundle\EasyAdminBundle\Filter\BooleanFilter;
use EasyCorp\Bundle\EasyAdminBundle\Filter\EntityFilter;
use EasyCorp\Bundle\EasyAdminBundle\Filter\NumericFilter;

public function configureFilters(Filters $filters): Filters
{
    return $filters
        ->add(BooleanFilter::new('available')->setLabel('Disponible'))
        ->add(EntityFilter::new('category')->setLabel('Catégorie'))
        ->add(NumericFilter::new('price')->setLabel('Prix'))
    ;
}
```

**Types de filtres disponibles** :

| Filtre | Usage |
| ------ | ----- |
| `BooleanFilter` | Oui/Non |
| `TextFilter` | Recherche textuelle |
| `NumericFilter` | Comparaison numérique |
| `DateTimeFilter` | Plage de dates |
| `EntityFilter` | Filtrer par relation |
| `ChoiceFilter` | Choix dans une liste |

---

### Étape 10 : Configurer les actions

Les actions sont les boutons disponibles (nouveau, modifier, supprimer...) :

```php
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;

public function configureActions(Actions $actions): Actions
{
    return $actions
        // Ajouter une action personnalisée
        ->add(Crud::PAGE_INDEX, Action::DETAIL)

        // Modifier le libellé d'une action
        ->update(Crud::PAGE_INDEX, Action::NEW, function (Action $action) {
            return $action->setLabel('Créer un produit');
        })

        // Supprimer une action
        ->remove(Crud::PAGE_INDEX, Action::DELETE)

        // Désactiver une action
        ->disable(Action::DELETE)

        // Réordonner les actions
        ->reorder(Crud::PAGE_INDEX, [Action::DETAIL, Action::EDIT, Action::DELETE])
    ;
}
```

**Actions standard** :

| Action | Description |
| ------ | ----------- |
| `Action::NEW` | Créer |
| `Action::EDIT` | Modifier |
| `Action::DELETE` | Supprimer |
| `Action::DETAIL` | Voir le détail |
| `Action::INDEX` | Retour à la liste |
| `Action::SAVE_AND_RETURN` | Sauver et retourner |
| `Action::SAVE_AND_CONTINUE` | Sauver et continuer |

---

### Étape 11 : Créer une action personnalisée

```php
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;

public function configureActions(Actions $actions): Actions
{
    // Créer une action personnalisée
    $duplicateAction = Action::new('duplicate', 'Dupliquer', 'fa fa-copy')
        ->linkToCrudAction('duplicateProduct');

    return $actions
        ->add(Crud::PAGE_INDEX, $duplicateAction)
        ->add(Crud::PAGE_DETAIL, $duplicateAction)
    ;
}

// Méthode appelée par l'action
public function duplicateProduct(
    AdminUrlGenerator $adminUrlGenerator,
    EntityManagerInterface $entityManager,
): Response {
    // Récupérer l'entité actuelle
    $context = $this->getContext();
    $product = $context->getEntity()->getInstance();

    // Créer une copie
    $newProduct = clone $product;
    $newProduct->setName($product->getName() . ' (copie)');

    // Sauvegarder via l'injection de dépendance (et non le conteneur)
    $entityManager->persist($newProduct);
    $entityManager->flush();

    // Rediriger vers la modification de la copie
    $url = $adminUrlGenerator
        ->setController(self::class)
        ->setAction(Crud::PAGE_EDIT)
        ->setEntityId($newProduct->getId())
        ->generateUrl();

    return $this->redirect($url);
}
```

---

### Étape 12 : Personnaliser le menu complet

```php
// Dans DashboardController.php

use App\Entity\Product;
use App\Entity\Category;
use App\Entity\User;

public function configureMenuItems(): iterable
{
    // Lien vers le dashboard
    yield MenuItem::linkToDashboard('Tableau de bord', 'fa fa-home');

    // Section (titre)
    yield MenuItem::section('Catalogue');

    // Liens vers les CRUD
    yield MenuItem::linkToCrud('Produits', 'fa fa-box', Product::class);
    yield MenuItem::linkToCrud('Catégories', 'fa fa-tags', Category::class);

    // Sous-menu
    yield MenuItem::subMenu('Utilisateurs', 'fa fa-users')->setSubItems([
        MenuItem::linkToCrud('Tous les utilisateurs', 'fa fa-list', User::class),
        MenuItem::linkToCrud('Administrateurs', 'fa fa-user-shield', User::class)
            ->setQueryParameter('role', 'ROLE_ADMIN'),
    ]);

    // Séparateur
    yield MenuItem::section('Autres');

    // Lien externe
    yield MenuItem::linkToUrl('Site public', 'fa fa-globe', '/');

    // Lien vers une route Symfony
    yield MenuItem::linkToRoute('Paramètres', 'fa fa-cog', 'app_settings');

    // Déconnexion
    yield MenuItem::linkToLogout('Déconnexion', 'fa fa-sign-out-alt');
}
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console make:admin:dashboard` | Créer le DashboardController |
| `php bin/console make:admin:crud` | Créer un CrudController |
| `php bin/console debug:router` | Voir les routes admin générées |

---

## Pièges Fréquents

### Piège 1 : AssociationField sans CRUD

**Problème** : Erreur "Unable to generate URL for the entity" pour une relation.

**Cause** : L'entité liée n'a pas de CrudController.

**Solution** : Créer un CrudController pour l'entité liée, ou désactiver le lien :

```php
AssociationField::new('category')
    // hideLink() n'existe pas dans EasyAdmin 4.
    // Sans CrudController pour l'entité liée, le template générique
    // affiche le libellé sans générer d'URL.
    ->setTemplateName('crud/field/generic');
```

---

### Piège 2 : ManyToMany non sauvegardée

**Problème** : Les modifications d'une relation ManyToMany ne sont pas sauvées.

**Cause** : EasyAdmin ne gère pas correctement `by_reference` par défaut.

**Solution** :

```php
AssociationField::new('tags')
    ->setFormTypeOptions([
        'by_reference' => false,
    ])
```

---

### Piège 3 : Champ qui n'existe pas dans l'entité

**Problème** : Erreur "Property 'xxx' does not exist".

**Cause** : Tu as ajouté un champ qui n'a pas de getter dans l'entité.

**Solution** : Vérifier le nom de la propriété ou créer un getter :

```php
// Dans l'entité
public function getFullName(): string
{
    return $this->firstName . ' ' . $this->lastName;
}

// Dans le CrudController
TextField::new('fullName')  // Utilise getFullName()
    ->hideOnForm()          // Pas de setter, donc pas dans les formulaires
```

---

### Piège 4 : Le cache EasyAdmin

**Problème** : Les modifications ne s'affichent pas.

**Solution** : Vider le cache :

```bash
php bin/console cache:clear
```

---

## Checklist de Validation

- [ ] Je comprends la structure DashboardController / CrudController
- [ ] Je sais créer un CrudController avec `make:admin:crud`
- [ ] Je sais configurer les champs avec `configureFields()`
- [ ] Je sais afficher des champs différents selon la vue (index, détail, form)
- [ ] Je sais configurer une relation avec `AssociationField`
- [ ] Je sais ajouter des filtres
- [ ] Je sais personnaliser le menu dans le Dashboard

---

## Exercice Pratique

**Énoncé** : Configure l'administration complète d'un blog.

**Entités à administrer** :

- `Article` (title, content, category, status, publishedAt)
- `Category` (name, description)
- `Tag` (name)

**Spécifications** :

1. **Menu** :
   - Section "Blog" avec Articles et Catégories
   - Section "Organisation" avec Tags
   - Lien "Voir le site" vers `/`

2. **ArticleCrudController** :
   - Liste : titre, catégorie, statut, date de publication
   - Formulaire : titre, contenu (TextEditor), catégorie, tags, statut (choix), date
   - Tri par défaut : date de publication décroissante
   - Filtres : catégorie, statut

3. **CategoryCrudController** :
   - Liste : nom, nombre d'articles
   - Formulaire : nom, description

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**DashboardController** :

```php
<?php

namespace App\Controller\Admin;

use App\Entity\Article;
use App\Entity\Category;
use App\Entity\Tag;
use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminDashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Symfony\Component\HttpFoundation\Response;

#[AdminDashboard(routePath: '/admin', routeName: 'admin')]
class DashboardController extends AbstractDashboardController
{
    public function index(): Response
    {
        $adminUrlGenerator = $this->container->get(AdminUrlGenerator::class);

        return $this->redirect($adminUrlGenerator
            ->setController(ArticleCrudController::class)
            ->generateUrl());
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('Administration du Blog');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('Accueil', 'fa fa-home');

        yield MenuItem::section('Blog');
        yield MenuItem::linkToCrud('Articles', 'fa fa-newspaper', Article::class);
        yield MenuItem::linkToCrud('Catégories', 'fa fa-folder', Category::class);

        yield MenuItem::section('Organisation');
        yield MenuItem::linkToCrud('Tags', 'fa fa-tags', Tag::class);

        yield MenuItem::section('');
        yield MenuItem::linkToUrl('Voir le site', 'fa fa-globe', '/');
    }
}
```

**ArticleCrudController** :

```php
<?php

namespace App\Controller\Admin;

use App\Entity\Article;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Filters;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Filter\ChoiceFilter;
use EasyCorp\Bundle\EasyAdminBundle\Filter\EntityFilter;

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
            ->setDefaultSort(['publishedAt' => 'DESC'])
            ->setSearchFields(['title', 'content'])
            ->setDateTimeFormat('dd/MM/yyyy HH:mm')
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        $id = IdField::new('id')->hideOnForm();

        $title = TextField::new('title')
            ->setLabel('Titre');

        $content = TextEditorField::new('content')
            ->setLabel('Contenu')
            ->hideOnIndex();

        $category = AssociationField::new('category')
            ->setLabel('Catégorie');

        $tags = AssociationField::new('tags')
            ->setLabel('Tags')
            ->setFormTypeOptions(['by_reference' => false])
            ->hideOnIndex();

        $status = ChoiceField::new('status')
            ->setLabel('Statut')
            ->setChoices([
                'Brouillon' => 'draft',
                'Publié' => 'published',
                'Archivé' => 'archived',
            ]);

        $publishedAt = DateTimeField::new('publishedAt')
            ->setLabel('Date de publication');

        if ($pageName === Crud::PAGE_INDEX) {
            return [$id, $title, $category, $status, $publishedAt];
        }

        return [$title, $content, $category, $tags, $status, $publishedAt];
    }

    public function configureFilters(Filters $filters): Filters
    {
        return $filters
            ->add(EntityFilter::new('category')->setLabel('Catégorie'))
            ->add(ChoiceFilter::new('status')->setLabel('Statut')->setChoices([
                'Brouillon' => 'draft',
                'Publié' => 'published',
                'Archivé' => 'archived',
            ]))
        ;
    }
}
```

**CategoryCrudController** :

```php
<?php

namespace App\Controller\Admin;

use App\Entity\Category;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class CategoryCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Category::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Catégorie')
            ->setEntityLabelInPlural('Catégories')
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        $id = IdField::new('id')->hideOnForm();

        $name = TextField::new('name')
            ->setLabel('Nom');

        $description = TextareaField::new('description')
            ->setLabel('Description')
            ->hideOnIndex();

        // Champ calculé : nombre d'articles
        $articleCount = IntegerField::new('articleCount')
            ->setLabel('Nb articles')
            ->hideOnForm();

        if ($pageName === Crud::PAGE_INDEX) {
            return [$id, $name, $articleCount];
        }

        return [$name, $description];
    }
}
```

**Note** : Pour `articleCount`, tu dois ajouter un getter dans l'entité Category :

```php
// Dans src/Entity/Category.php
public function getArticleCount(): int
{
    return $this->articles->count();
}
```

---

## Navigation

← Fiche précédente : **[Les formulaires](09-formulaires.md)**

→ Fiche suivante : **[Validation des données](11-validation-donnees.md)**
