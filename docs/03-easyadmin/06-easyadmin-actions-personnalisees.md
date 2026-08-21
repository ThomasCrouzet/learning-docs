---
tags:
  - EasyAdmin
  - Avancé
  - Pratique
description: "Actions personnalisées dans EasyAdmin"
estimated_time: "35 min"
fiche_number: 6
total_fiches: 7
cursus: "EasyAdmin"
id: "web.easyadmin.easyadmin-actions-personnalisees"
course_id: "web.easyadmin"
content_type: "lesson"
order: 6
---

# 06 - Actions personnalisées dans EasyAdmin

> **En bref** : À la fin de cette fiche, tu sauras créer des actions personnalisées dans EasyAdmin (dupliquer, publier/dépublier, prévisualiser) et leur associer ton propre code PHP. Lecture estimée : 35 min.


## Prérequis

- Avoir complété la fiche **[05 - Gestion des images et filtres de recherche](05-easyadmin-images-filtres.md)**
- Avoir une entité `Product` fonctionnelle avec des données
- Les conteneurs Docker doivent être en cours d'exécution (`docker compose up -d`)

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| EasyAdmin | 4.x |
| PHP | 8.3 |
| Symfony | 7.4 |

## Objectif de cette fiche

EasyAdmin fournit par défaut les actions **CRUD** (Créer, Lire, Modifier, Supprimer).
Mais souvent, tu auras besoin de plus :

- Un bouton "Dupliquer" pour copier un produit rapidement.
- Un bouton "Publier / Dépublier" pour changer le statut d'un clic.
- Un bouton "Voir sur le site" pour prévisualiser le produit.

À la fin de cette fiche, tu sauras créer ces boutons et leur associer ton propre code PHP.

---

## Concepts

### Qu'est-ce qu'une Action ?

Dans EasyAdmin, une **Action** est un bouton qui déclenche une URL.

On distingue 3 types d'emplacements pour les actions :

1. **PAGE_INDEX** : La liste des éléments (boutons "Modifier", "Supprimer" au bout de chaque ligne).
2. **PAGE_NEW / PAGE_EDIT** : Les formulaires (boutons "Sauvegarder", "Retour").
3. **GLOBAL** : En haut de la page (bouton "Créer Product").

**Analogie concrète** : Imagine la télécommande de ta télévision. Chaque bouton (action) déclenche une fonction précise : "Volume +", "Changer de chaîne", "Enregistrer". Certains boutons sont toujours visibles (les touches principales), d'autres sont cachés derrière un clapet (les touches avancées). Dans EasyAdmin, c'est pareil : les actions sont des boutons placés à différents endroits de l'interface, et chacun déclenche une opération spécifique sur tes données.

### Le Workflow d'une Action Personnalisée

Pour créer une nouvelle action, il faut suivre 2 étapes :

1. **Déclarer l'action** (Visuel) :
    - Dans `configureActions()`.
    - On définit son nom, son label, son icône, sa couleur.
    - On dit _où_ elle doit s'afficher.

2. **Créer la méthode** (Logique) :
    - On crée une fonction PHP dans le contrôleur.
    - Cette fonction reçoit l'entité concernée.
    - Elle fait le travail (ex: copier l'objet).
    - Elle redirige l'utilisateur.

**Analogie concrète** : Imagine que tu fabriques un bouton personnalisé pour ta machine à café. D'abord, tu colles une étiquette sur le bouton ("Cappuccino double", avec une icône de tasse) - c'est la déclaration visuelle. Ensuite, tu branches le bouton à un programme interne qui dit : "Moudre le café, chauffer le lait, servir en grande tasse" - c'est la méthode PHP. Le bouton sans programme ne fait rien, et le programme sans bouton est invisible pour l'utilisateur.

---

## Étapes Pratiques

### Partie 1 : Personnaliser les actions existantes

Avant de créer du neuf, apprenons à modifier l'existant. Par exemple, changer "Create Product" en "Ajouter un produit" avec une icône différente.

Ouvre `src/Controller/Admin/ProductCrudController.php`.

Ajoute les imports nécessaires :

```php
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
```

Ajoute la méthode `configureActions` :

```php
    public function configureActions(Actions $actions): Actions
    {
        return $actions
            // Personnalisation de la page INDEX (Liste)
            ->update(Crud::PAGE_INDEX, Action::NEW, function (Action $action) {
                return $action
                    ->setLabel('Ajouter un produit')
                    ->setIcon('fa fa-plus-circle')
                    ->setCssClass('btn btn-success'); // Change la couleur (vert)
            })
            
            // Personnalisation des boutons d'édition sur chaque ligne
            ->update(Crud::PAGE_INDEX, Action::EDIT, function (Action $action) {
                return $action->setIcon('fa fa-pencil-alt')->setLabel(false); // Juste l'icône
            })
            
            // Suppression du bouton "Delete" sur la page de détail (si tu l'utilises)
            // ->remove(Crud::PAGE_DETAIL, Action::DELETE)
        ;
    }
```

**Teste** : Actualise ta liste de produits. Le bouton de création doit être vert avec ton texte, et les boutons d'édition doivent être des icônes seules.

---

### Partie 2 : Créer une action "Dupliquer"

C'est une fonctionnalité très demandée : pouvoir copier un produit existant pour ne pas tout ressaisir.

#### Étape 2.1 : Préparer l'entité Product (Clonage)

Pour que la duplication fonctionne, tu dois dire à PHP de "nettoyer" l'objet quand on le copie. Sinon, la copie garde le même identifiant (ID) que l'original, et Doctrine pensera que c'est le même produit !

Ouvre `src/Entity/Product.php` et ajoute cette méthode à la fin de la classe (juste avant l'accolade fermante `}`) :

```php
    public function __clone()
    {
        // Si l'objet a un ID, on le met à null pour que Doctrine crée une nouvelle ligne
        if ($this->id) {
            $this->id = null;
        }
    }
```

#### Étape 2.2 : Déclarer l'action

Toujours dans `configureActions` (dans le contrôleur), tu vas ajouter ta nouvelle action.

```php
    public function configureActions(Actions $actions): Actions
    {
        // 1. On définit l'action
        $duplicate = Action::new('duplicate', 'Dupliquer')
            ->setIcon('fa fa-copy')
            ->linkToCrudAction('duplicateProduct') // Nom de la méthode PHP qu'on va créer
            ->setCssClass('btn btn-info');

        return $actions
            // ... (tes modifications précédentes) ...
            
            // 2. On ajoute l'action à la page INDEX (sur chaque ligne)
            ->add(Crud::PAGE_INDEX, $duplicate);
    }
```

#### Étape 2.3 : Créer la logique (La méthode PHP)

Dans le même fichier (`ProductCrudController.php`), ajoute cette nouvelle méthode publique.

Elle doit s'appeler `duplicateProduct` (comme défini dans `linkToCrudAction`) et prendre en paramètre `AdminContext`.

Ajoute ces imports en haut du fichier :

```php
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminRoute;
use EasyCorp\Bundle\EasyAdminBundle\Context\AdminContext;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
```

Puis ajoute cette méthode :

```php
    #[AdminRoute('/{entityId}/duplicate')]
    public function duplicateProduct(AdminContext $context, AdminUrlGenerator $adminUrlGenerator, EntityManagerInterface $entityManager)
    {
        /** @var Product $product */
        $product = $context->getEntity()->getInstance();

        // 1. On clone l'objet (crée une copie en mémoire)
        $newProduct = clone $product;

        // 2. On modifie la copie pour qu'elle soit unique
        // On remet l'ID à null pour que Doctrine comprenne que c'est un NOUVEL objet
        // Note : En PHP, cloner un objet garde ses propriétés mais crée une nouvelle instance.
        // Doctrine gère les ID privés, mais il vaut mieux être explicite si besoin.
        // Ici, comme l'ID est généré par la BDD, le simple fait de persister le clone suffit souvent,
        // mais changeons le nom pour éviter la confusion.
        
        $newProduct->setName('Copie de ' . $product->getName());
        $newProduct->setSlug($product->getSlug() . '-copie-' . uniqid());
        $newProduct->setCreatedAt(new \DateTimeImmutable());
        
        // Optionnel : Désactiver la copie par sécurité
        $newProduct->setIsActive(false);

        // 3. On sauvegarde
        $entityManager->persist($newProduct);
        $entityManager->flush();

        // 4. Notification visuelle
        $this->addFlash('success', 'Le produit a été dupliqué avec succès !');

        // 5. Redirection
        // On veut rediriger vers le formulaire d'édition de ce NOUVEAU produit
        
        // On génère l'URL vers la page EDIT du NOUVEAU produit
        $url = $adminUrlGenerator
            ->setController(self::class)
            ->setAction(Action::EDIT)
            ->setEntityId($newProduct->getId())
            ->generateUrl();

        return $this->redirect($url);
    }
```

> **Note sur le clonage** : Si ton entité `Product` a des relations (ex: `Category`), le clone partagera la _même_ instance de catégorie (ce qui est voulu ici : la copie est dans la même catégorie). Si tu avais une relation `OneToMany` (ex: `Images`), il faudrait cloner la collection manuellement dans la méthode `__clone` de l'entité, sinon modifier les images de la copie modifierait les images de l'original !

---

### Partie 3 : Créer une action "Voir sur le site"

Tu veux un bouton qui ouvre le produit sur la partie publique de ton site (le Front-End).

#### Étape 3.1 : Déclarer l'action

```php
    public function configureActions(Actions $actions): Actions
    {
        // ... action dupliquer ...

        $viewWebsite = Action::new('viewWebsite', 'Voir sur le site')
            ->setIcon('fa fa-external-link-alt')
            ->linkToRoute('app_product_show', function (Product $product): array {
                return [
                    'slug' => $product->getSlug() // Paramètres de la route
                ];
            })
            ->setHtmlAttributes(['target' => '_blank']); // Ouvrir dans un nouvel onglet

        return $actions
            // ...
            ->add(Crud::PAGE_INDEX, $duplicate)
            ->add(Crud::PAGE_INDEX, $viewWebsite) // Ajout à la liste
            ->add(Crud::PAGE_EDIT, $viewWebsite); // Ajout aussi dans la page d'édition !
    }
```

> **Attention** : Cette action ne fonctionnera que si tu as créé une route Symfony nommée `app_product_show` dans un contrôleur standard (pas admin). Si tu n'as pas encore de Front-End, tu peux sauter cette étape ou créer une route bidon pour tester.

---

### Partie 4 : Réorganiser les actions (Dropdown)

Si tu as trop de boutons (Modifier, Supprimer, Dupliquer, Voir...), la ligne devient illisible.
EasyAdmin permet de grouper les actions dans un menu déroulant.

```php
    public function configureActions(Actions $actions): Actions
    {
        // ... déclarations des actions ...

        return $actions
            // ... add(...) ...
            
            // Transforme les boutons en menu déroulant sur la page INDEX
            ->update(Crud::PAGE_INDEX, Action::EDIT, fn (Action $action) => $action->setIcon('fa fa-pencil-alt'))
            ->update(Crud::PAGE_INDEX, Action::DELETE, fn (Action $action) => $action->setIcon('fa fa-trash'))
            
            // Cette méthode magique ne groupe pas automatiquement,
            // il faut souvent jouer avec l'ordre d'affichage ou utiliser ->displayAsLink() vs ->displayAsButton()
            // (EasyAdmin 4 ; EasyAdmin 5 renomme en renderAsLink / renderAsButton)
            
            // reorder() ne fait que définir l'ordre d'affichage des actions, il ne crée pas de dropdown ;
            ->reorder(Crud::PAGE_INDEX, [Action::EDIT, 'duplicate', 'viewWebsite', Action::DELETE]);
            
            // Note : EasyAdmin 4 affiche souvent les actions secondaires dans un dropdown "..."
            // si elles ne tiennent pas.
    }
```

---

## Récapitulatif du contrôleur

Voici un résumé de la structure pour t'y retrouver :

```php
class ProductCrudController extends AbstractCrudController
{
    // ... configureFields, configureFilters ...

    public function configureActions(Actions $actions): Actions
    {
        $duplicate = Action::new('duplicate', 'Dupliquer')
            ->setIcon('fa fa-copy')
            ->linkToCrudAction('duplicateProduct');

        return $actions
            ->add(Crud::PAGE_INDEX, $duplicate)
            ->update(Crud::PAGE_INDEX, Action::NEW, fn(Action $a) => $a->setLabel('Créer'))
        ;
    }

    #[AdminRoute('/{entityId}/duplicate')]
    public function duplicateProduct(AdminContext $context, AdminUrlGenerator $generator, EntityManagerInterface $em)
    {
        $product = $context->getEntity()->getInstance();
        $clone = clone $product;
        $clone->setName('Copie - ' . $product->getName());
        $clone->setSlug($product->getSlug() . '-copie-' . uniqid());
        
        $em->persist($clone);
        $em->flush();
        
        $this->addFlash('success', 'Dupliqué !');
        
        return $this->redirect($generator
            ->setController(self::class)
            ->setAction(Action::EDIT)
            ->setEntityId($clone->getId())
            ->generateUrl()
        );
    }
}
```

---

## Checklist de Validation

- [ ] J'ai modifié le label du bouton "Add Product" en français.
- [ ] Je vois le bouton "Dupliquer" dans la liste des produits.
- [ ] Quand je clique sur "Dupliquer", je suis redirigé vers l'édition d'un _nouveau_ produit nommé "Copie de...".
- [ ] L'ancien produit existe toujours (je n'ai pas juste modifié l'original).
- [ ] Je comprends comment lier une action à une méthode PHP du contrôleur.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console cache:clear` | Vider le cache (obligatoire après ajout ou modification d'une action) |
| `php bin/console debug:router` | Lister les routes disponibles (vérifier les routes front-end pour `linkToRoute`) |
| `php bin/console make:admin:crud` | Générer un nouveau contrôleur CRUD EasyAdmin |
| `php bin/console debug:container --tag=controller.service_arguments` | Lister les services injectables dans les méthodes d'action |

---

## Pièges Fréquents

### Piège 1 : Oublier la méthode __clone dans l'entité

⚠️ **Problème** : Tu cliques sur "Dupliquer" et tu obtiens une erreur Doctrine du type `An entity with identifier X already exists`. Le clone essaie de sauvegarder un objet avec le même ID que l'original.

✅ **Solution** : Ajoute la méthode `__clone()` dans ton entité `Product` pour remettre l'ID à `null` lors du clonage :

```php
// Dans src/Entity/Product.php
public function __clone()
{
    if ($this->id) {
        $this->id = null;
    }
}
```

### Piège 2 : Confondre linkToCrudAction et linkToRoute

⚠️ **Problème** : Tu utilises `linkToRoute('duplicateProduct')` au lieu de `linkToCrudAction('duplicateProduct')`. L'action ne fonctionne pas ou tu obtiens une erreur "Route not found".

✅ **Solution** : Ces deux méthodes ont des usages différents :

- `linkToCrudAction('nomMethode')` : appelle une méthode **du contrôleur CRUD** EasyAdmin. C'est ce qu'il faut utiliser pour les actions personnalisées comme "Dupliquer".
- `linkToRoute('nom_route', fn($entity) => [...])` : redirige vers une route **Symfony standard** (hors EasyAdmin). C'est ce qu'il faut utiliser pour "Voir sur le site".

```php
// Pour une action dans le contrôleur CRUD (ex: dupliquer)
Action::new('duplicate', 'Dupliquer')
    ->linkToCrudAction('duplicateProduct'); // Appelle $this->duplicateProduct()

// Pour un lien vers le front-end (ex: voir le produit)
Action::new('viewSite', 'Voir sur le site')
    ->linkToRoute('app_product_show', fn(Product $p) => ['slug' => $p->getSlug()]);
```

### Piège 3 : L'action personnalisée ne reçoit pas l'entité

⚠️ **Problème** : Dans ta méthode d'action, `$context->getEntity()->getInstance()` retourne `null`.

✅ **Solution** : Vérifie que l'action est bien ajoutée sur une page qui a une entité (PAGE_INDEX ou PAGE_DETAIL). Vérifie aussi que tu utilises bien `linkToCrudAction` (et non `linkToUrl` ou `linkToRoute`). Le paramètre `AdminContext` doit être injecté en premier argument :

```php
public function duplicateProduct(
    AdminContext $context,           // Contexte EasyAdmin (contient l'entité)
    AdminUrlGenerator $urlGenerator, // Pour générer les URLs de redirection
    EntityManagerInterface $em       // Pour sauvegarder
)
{
    $product = $context->getEntity()->getInstance();
    // $product contient maintenant l'entité Product cliquée
}
```

### Piège 4 : Le bouton d'action n'apparaît pas

⚠️ **Problème** : Tu as ajouté l'action dans `configureActions` mais elle n'apparaît pas dans la liste.

✅ **Solution** : Vérifie que tu as bien utilisé `->add()` pour ajouter l'action à la bonne page :

```php
return $actions
    ->add(Crud::PAGE_INDEX, $duplicate);  // PAGE_INDEX = la liste
    // ->add(Crud::PAGE_DETAIL, $duplicate); // PAGE_DETAIL = la page de détail
```

N'oublie pas de vider le cache : `php bin/console cache:clear`.

### Piège 5 : Action personnalisée sans attribut `#[AdminRoute]` (pretty URLs)

⚠️ **Problème** : À partir d'EasyAdmin 4.29.5, avec les pretty URLs, une action CRUD personnalisée sans attribut `#[AdminRoute]` est dépréciée. En EasyAdmin 5.x, `linkToCrudAction('duplicateProduct')` ignore la méthode si l'attribut est absent.

✅ **Solution** : Annote la méthode d'action avec `#[AdminRoute]` (voir le fichier `UPGRADE.md` d'EasyAdmin 4.x) :

```php
use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminRoute;

#[AdminRoute('/{entityId}/duplicate')]
public function duplicateProduct(AdminContext $context, AdminUrlGenerator $adminUrlGenerator, EntityManagerInterface $entityManager)
{
    // ...
}
```

---

## Exercice Pratique

**Énoncé** : Crée une action "Publier/Dépublier" qui bascule le champ `isActive` d'un produit. Cette action doit être accessible depuis la liste (PAGE_INDEX) et depuis la page de détail (PAGE_DETAIL).

**Indications** :

- Crée une nouvelle action nommée `togglePublish` avec `Action::new()`
- Lie-la à une méthode `togglePublishProduct` via `linkToCrudAction`
- Dans la méthode, inverse la valeur de `isActive` (`true` devient `false` et inversement)
- Affiche un message flash indiquant le nouveau statut ("Produit publié" ou "Produit dépublié")
- Redirige vers la liste des produits après l'action
- Ajoute l'action sur PAGE_INDEX et PAGE_DETAIL

**Résultat attendu** : Un bouton "Publier/Dépublier" apparaît sur chaque ligne de la liste. Quand tu cliques dessus, le statut du produit bascule et un message de confirmation s'affiche.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### Étape 1 : Déclarer l'action dans configureActions

Dans `src/Controller/Admin/ProductCrudController.php`, modifie la méthode `configureActions` :

```php
public function configureActions(Actions $actions): Actions
{
    // Action "Dupliquer" existante
    $duplicate = Action::new('duplicate', 'Dupliquer')
        ->setIcon('fa fa-copy')
        ->linkToCrudAction('duplicateProduct')
        ->setCssClass('btn btn-info');

    // Nouvelle action "Publier/Dépublier"
    $togglePublish = Action::new('togglePublish', 'Publier/Dépublier')
        ->setIcon('fa fa-toggle-on')
        ->linkToCrudAction('togglePublishProduct')
        ->setCssClass('btn btn-warning');

    return $actions
        ->update(Crud::PAGE_INDEX, Action::NEW, function (Action $action) {
            return $action
                ->setLabel('Ajouter un produit')
                ->setIcon('fa fa-plus-circle')
                ->setCssClass('btn btn-success');
        })
        // Ajout de l'action sur la liste ET la page de détail
        ->add(Crud::PAGE_INDEX, $duplicate)
        ->add(Crud::PAGE_INDEX, $togglePublish)
        ->add(Crud::PAGE_DETAIL, $togglePublish)
    ;
}
```

### Étape 2 : Créer la méthode togglePublishProduct

Ajoute cette méthode dans le même contrôleur :

```php
public function togglePublishProduct(
    AdminContext $context,
    AdminUrlGenerator $adminUrlGenerator,
    EntityManagerInterface $entityManager
) {
    /** @var Product $product */
    $product = $context->getEntity()->getInstance();

    // On inverse la valeur de isActive
    // Si le produit est actif (true), il devient inactif (false), et inversement
    $product->setIsActive(!$product->isActive());

    // On sauvegarde la modification
    $entityManager->flush();

    // Message flash adapté au nouveau statut
    if ($product->isActive()) {
        $this->addFlash('success', sprintf(
            'Le produit "%s" a été publié.',
            $product->getName()
        ));
    } else {
        $this->addFlash('warning', sprintf(
            'Le produit "%s" a été dépublié.',
            $product->getName()
        ));
    }

    // Redirection vers la liste des produits
    $url = $adminUrlGenerator
        ->setController(self::class)
        ->setAction(Action::INDEX)
        ->generateUrl();

    return $this->redirect($url);
}
```

### Étape 3 : Tester

1. Vide le cache : `php bin/console cache:clear`
2. Va sur la liste des produits
3. Clique sur "Publier/Dépublier" sur un produit actif
4. Vérifie que le message "Le produit X a été dépublié" s'affiche
5. Clique à nouveau sur "Publier/Dépublier" sur le même produit
6. Vérifie que le message "Le produit X a été publié" s'affiche
7. Vérifie que la colonne "Actif" dans la liste reflète bien le changement

---

## Navigation

← Fiche précédente : **[Gestion des images et filtres de recherche](05-easyadmin-images-filtres.md)**

→ Fiche suivante : **[Personnalisation visuelle avancée d'EasyAdmin](07-easyadmin-personnalisation-visuelle.md)**
