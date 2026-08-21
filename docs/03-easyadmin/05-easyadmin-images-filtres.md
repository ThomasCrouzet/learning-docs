---
tags:
  - EasyAdmin
  - Intermédiaire
  - Pratique
description: "Gestion des images et filtres de recherche"
estimated_time: "30 min"
fiche_number: 5
total_fiches: 7
cursus: "EasyAdmin"
---

# 05 - Gestion des images et filtres de recherche

> **En bref** : À la fin de cette fiche, tu sauras ajouter des images aux produits dans EasyAdmin et utiliser les filtres pour rechercher efficacement dans le catalogue. Lecture estimée : 30 min.


## Prérequis

- Avoir complété la fiche **[02 - Champs avancés et organisation des formulaires EasyAdmin](02-easyadmin-champs-avances.md)**
- Avoir l'entité `Product` créée et configurée
- Les conteneurs Docker doivent être en cours d'exécution (`docker compose up -d`)

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| EasyAdmin | 4.x |
| PHP | 8.3 |
| Symfony | 7.4 |

## Objectif de cette fiche

Pour l'instant, ton entité `Product` ne contient que du texte. Une boutique sans images n'est pas très vendeuse !
Dans cette fiche, tu vas **ajouter des images** aux produits et apprendre à **filtrer et rechercher** efficacement dans le catalogue.

---

## Concepts

### Le stockage des images (Fichiers vs Base de données)

C'est une confusion fréquente chez les débutants.

**Question** : Stocke-t-on l'image dans la base de données ?
**Réponse** : **NON**.

On ne stocke jamais le fichier image (les données binaires) directement dans la base de données (sauf cas très rares et spécifiques).

**Comment ça marche alors ?**

1. **Le Fichier** : L'image (`mon-produit.jpg`) est stockée sur le disque dur du serveur, dans un dossier public (ex: `public/uploads/products/`).
2. **La Base de Données** : On stocke seulement le **nom du fichier** (une chaîne de caractères : `"mon-produit.jpg"`).

**Analogie** :
Imagine une bibliothèque.

- Les **livres** (les fichiers images) sont rangés sur les étagères.
- Le **catalogue informatique** (la base de données) ne contient pas le livre entier, mais juste son emplacement et son titre pour le retrouver.

### Path (Chemin) vs URL

Pour qu'une image s'affiche, il faut distinguer deux chemins :

1. **Upload Dir (Chemin interne)** : C'est l'endroit où PHP doit écrire le fichier sur le disque dur.
    - Exemple : `/var/www/html/public/uploads/images/products`
    - C'est pour le **Serveur**.

2. **Base Path (Chemin public)** : C'est le début de l'adresse web que le navigateur utilisera pour télécharger l'image.
    - Exemple : `/uploads/images/products`
    - Le navigateur combinera ça pour faire : `http://localhost/uploads/images/products/photo.jpg`
    - C'est pour le **Client**.

**Analogie concrète** : Imagine un entrepôt de livraison. L'adresse interne de l'entrepôt (Upload Dir), c'est l'adresse que les employés utilisent pour ranger les colis sur les étagères : "Bâtiment B, allée 3, étagère 7". L'adresse de livraison (Base Path), c'est l'adresse que le client voit sur son colis pour savoir où le récupérer : "Point relais, 12 rue du Commerce". Les deux mènent au même objet, mais l'un est pour le travail interne (le serveur), l'autre pour l'accès public (le navigateur).

### Les Filtres de recherche

Quand tu as 10 produits, tu peux tout voir d'un coup. Quand tu en as 1000, c'est impossible.
EasyAdmin permet d'ajouter des filtres dynamiques (comme sur Amazon : "Prix entre 10€ et 50€", "Catégorie : Informatique").

**Analogie concrète** : Imagine un classeur à tiroirs contenant 1000 fiches de recettes de cuisine. Sans filtre, tu dois feuilleter toutes les fiches une par une. Avec des intercalaires de couleur (filtres), tu peux dire : "Montre-moi uniquement les desserts (catégorie) qui se préparent en moins de 30 minutes (temps) avec du chocolat (ingrédient)". Les filtres EasyAdmin fonctionnent exactement comme ces intercalaires : ils réduisent la liste pour ne montrer que ce qui correspond à tes critères.

---

## Étapes Pratiques

### Partie 1 : Préparer l'entité Product

Tu dois ajouter une propriété pour stocker le nom du fichier image.

#### Étape 1.1 : Modifier l'entité

Dans le conteneur PHP :

```bash
docker compose exec php bash
php bin/console make:entity Product
```

Ajoute le champ suivant :

- Nom : `imageFilename`
- Type : `string`
- Longueur : `255`
- Nullable : `yes` (pour ne pas casser les produits existants)

#### Étape 1.2 : Migration

```bash
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

---

### Partie 2 : Configurer le champ ImageField

Tu vas ajouter le champ image dans ton contrôleur EasyAdmin.

Ouvre `src/Controller/Admin/ProductCrudController.php`.

Ajoute les `use` en haut :

```php
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use Symfony\Component\Validator\Constraints\Image;
```

Le second import (`Crud`) sert ici pour `Crud::PAGE_NEW`, mais il servira aussi à la méthode `configureCrud` de la Partie 5. Un seul `use` en tête de fichier suffit pour tout le contrôleur. L'import `Image` sert à la contrainte de validation du fichier uploadé.

Dans la méthode `configureFields`, ajoute la configuration de l'image.
Tu vas la placer juste avant la description.

```php
    public function configureFields(string $pageName): iterable
    {
        // ... (tes champs existants : nom, slug...)

        // Configuration de l'image
        // setFileConstraints(Image) : refuse les fichiers non image (évite d'uploader un .php renommé)
        $image = ImageField::new('imageFilename')
            ->setLabel('Image du produit')
            // Où stocker le fichier (chemin physique sur le serveur)
            // 'public' est le dossier racine web standard de Symfony
            ->setUploadDir('public/uploads/images/products')
            // Quel chemin afficher dans le HTML (chemin relatif pour le navigateur)
            ->setBasePath('uploads/images/products')
            // Pour ne pas avoir des noms de fichiers bizarres (doublons)
            ->setUploadedFileNamePattern('[year]-[month]-[day]-[contenthash].[extension]')
            // Valide le type MIME réel du fichier (pas seulement l'extension)
            ->setFileConstraints(new Image(maxSize: '5M'))
            // Requis uniquement à la création
            ->setRequired($pageName === Crud::PAGE_NEW);

        // ... (suite de tes champs : description, prix...)

        // Intégrons ce champ dans notre tableau de retour
        // (Adapte selon ton code existant, voici un exemple d'insertion)
        
        return [
             // ... onglet Info ...
             TextField::new('name'),
             // ...
             $image, // On insère l'image ici
             // ...
        ];
    }
```

**⚠️ Important** :

- Le dossier `public/uploads/images/products` doit pouvoir être créé par PHP. Symfony le fait automatiquement, mais assure-toi que les permissions sont bonnes.
- **Sécurité** : un dossier d'upload public sans contrainte de type MIME peut accepter un fichier dangereux (ex. script). Utilise toujours `setFileConstraints(new Image(...))` (ou une contrainte équivalente). Ne laisse jamais Nginx/PHP exécuter des scripts dans `public/uploads/`.

---

### Partie 3 : Tester l'upload

1. Vide le cache : `php bin/console cache:clear`
2. Va sur ton admin : `http://localhost:8080/admin`
3. Modifie un produit existant.
4. Tu devrais voir un champ d'upload. Choisis une image (jpg/png) depuis ton ordinateur.
5. Sauvegarde.

**Résultat attendu** :

- Dans la liste des produits, tu vois une miniature de l'image !
- Si tu inspectes le dossier `app/public/uploads/images/products` (depuis ton éditeur de code), tu verras le fichier.

---

### Partie 4 : Ajouter des Filtres de Recherche

Pour l'instant, EasyAdmin propose une barre de recherche globale (la loupe en haut). C'est bien, mais on veut plus précis.

Tu vas ajouter des filtres pour :

1. La Catégorie (Afficher tous les ordinateurs)
2. Le Prix (Produits entre X et Y euros)
3. Le Stock (Produits en rupture de stock)

Toujours dans `ProductCrudController.php`, ajoute ces imports en haut du fichier :

```php
use EasyCorp\Bundle\EasyAdminBundle\Config\Filters;
use EasyCorp\Bundle\EasyAdminBundle\Filter\BooleanFilter;
use EasyCorp\Bundle\EasyAdminBundle\Filter\EntityFilter;
use EasyCorp\Bundle\EasyAdminBundle\Filter\NumericFilter;
use EasyCorp\Bundle\EasyAdminBundle\Filter\TextFilter;
```

Puis ajoute cette nouvelle méthode :

```php
    public function configureFilters(Filters $filters): Filters
    {
        return $filters
            // Filtre par texte (recherche partielle sur le nom)
            ->add(TextFilter::new('name', 'Nom du produit'))
            
            // Filtre par relation (liste déroulante des catégories)
            ->add(EntityFilter::new('category', 'Catégorie'))
            
            // Filtre numérique (supérieur à, inférieur à, entre...)
            ->add(NumericFilter::new('price', 'Prix'))
            
            // Filtre booléen (Oui/Non)
            ->add(BooleanFilter::new('isActive', 'Actif uniquement'))
            
            // Tu peux même filtrer sur le stock
            ->add(NumericFilter::new('stock', 'Stock'));
    }
```

#### Test des filtres

1. Actualise la page liste des produits.
2. Tu devrais voir une petite icône "Entonnoir" (Filtres) à droite de la barre de recherche.
3. Clique dessus. Un panneau latéral s'ouvre.
4. Essaie de filtrer :
    - Prix > 500
    - Catégorie = [Choisis en une]
5. Le tableau se met à jour automatiquement.

---

### Partie 5 : Améliorer la barre de recherche globale

Par défaut, la barre de recherche (la loupe) cherche sur l'ensemble des champs de l'entité.
On peut restreindre cette recherche à une liste précise de champs (pour éviter de fausses correspondances ou améliorer les performances), ou au contraire l'étendre à un champ qui ne serait pas affiché dans la liste.

Ajoute ou modifie la méthode `configureCrud` dans `ProductCrudController.php` :

```php
    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Produit')
            ->setEntityLabelInPlural('Produits')
            ->setDefaultSort(['createdAt' => 'DESC'])
            // Définit les champs consultés quand on tape dans la barre de recherche
            ->setSearchFields(['name', 'description', 'id', 'slug']);
    }
```

Maintenant, la recherche est limitée explicitement à ces quatre champs (`name`, `description`, `id`, `slug`) : tu contrôles précisément où la loupe va chercher.

---

### Récapitulatif complet du ProductCrudController

Voici à quoi devrait ressembler ton contrôleur maintenant (version simplifiée pour la lisibilité) :

```php
class ProductCrudController extends AbstractCrudController
{
    // ...

    public function configureFields(string $pageName): iterable
    {
        // ... tes champs ...
        yield ImageField::new('imageFilename')
            ->setBasePath('uploads/images/products')
            ->setUploadDir('public/uploads/images/products')
            ->setUploadedFileNamePattern('[year]-[month]-[day]-[contenthash].[extension]')
            ->setFileConstraints(new Image(maxSize: '5M'));
        // ...
    }

    public function configureFilters(Filters $filters): Filters
    {
        return $filters
            ->add(EntityFilter::new('category'))
            ->add(NumericFilter::new('price'))
            ->add(BooleanFilter::new('isActive'));
    }
    
    // ...
}
```

---

## Checklist de Validation

- [ ] J'ai ajouté le champ `imageFilename` à l'entité Product.
- [ ] Je peux uploader une image depuis le formulaire EasyAdmin.
- [ ] L'image s'affiche correctement (miniature) dans la liste des produits.
- [ ] Je vois le bouton "Filtres" dans la liste des produits.
- [ ] Je peux filtrer mes produits par prix et par catégorie.
- [ ] La recherche globale fonctionne sur le nom et la description.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console make:entity Product` | Ajouter des propriétés à l'entité Product (ex: `imageFilename`) |
| `php bin/console make:migration` | Créer une migration après ajout du champ image |
| `php bin/console doctrine:migrations:migrate` | Exécuter la migration pour créer la colonne en base |
| `php bin/console cache:clear` | Vider le cache (obligatoire après modification des champs ou filtres) |
| `php bin/console debug:router` | Vérifier les routes admin générées (EasyAdmin 4 se configure surtout en PHP, pas en YAML) |
| `ls -la public/uploads/images/products/` | Vérifier que les images uploadées sont bien sur le disque |

---

## Pièges Fréquents

### Piège 1 : Permissions sur le dossier uploads

⚠️ **Problème** : L'upload d'image échoue avec une erreur de type `Unable to create the directory "public/uploads/images/products"` ou `Permission denied`.

✅ **Solution** : Le serveur web (PHP) doit avoir les droits d'écriture sur le dossier `public/uploads/`. Dans le conteneur Docker, exécute :

```bash
# Créer le dossier s'il n'existe pas
mkdir -p public/uploads/images/products

# Donner les droits d'écriture
chown -R www-data:www-data public/uploads/ && chmod -R 775 public/uploads/
```

### Piège 2 : Confusion entre setBasePath et setUploadDir

⚠️ **Problème** : L'image est uploadée mais ne s'affiche pas (image cassée dans la liste). Ou inversement, l'affichage fonctionne mais l'upload échoue.

✅ **Solution** : Ces deux méthodes ont des rôles différents :

- `setUploadDir('public/uploads/images/products')` : le chemin **physique** sur le disque, relatif à la racine du projet. C'est là que PHP écrit le fichier. Ce chemin commence par `public/`.
- `setBasePath('uploads/images/products')` : le chemin **URL** que le navigateur utilise pour afficher l'image. Ce chemin ne contient **pas** `public/` (car `public/` est déjà la racine web).

```php
// Correct
ImageField::new('imageFilename')
    ->setUploadDir('public/uploads/images/products')  // Pour le serveur (avec public/)
    ->setBasePath('uploads/images/products');           // Pour le navigateur (sans public/)

// Incorrect : le navigateur cherchera public/uploads/... dans l'URL
ImageField::new('imageFilename')
    ->setUploadDir('public/uploads/images/products')
    ->setBasePath('public/uploads/images/products');  // Ne pas mettre public/ ici
```

### Piège 3 : L'image précédente disparaît après modification du produit

⚠️ **Problème** : Tu modifies un produit (par exemple son nom) sans toucher à l'image. Après sauvegarde, l'image a disparu.

✅ **Solution** : Vérifie que le champ `imageFilename` est bien `nullable: true` dans l'entité et que `setRequired(false)` est configuré pour la page d'édition :

```php
ImageField::new('imageFilename')
    ->setUploadDir('public/uploads/images/products')
    ->setBasePath('uploads/images/products')
    ->setRequired($pageName === Crud::PAGE_NEW); // Requis seulement à la création
```

---

## Exercice Pratique

**Énoncé** : Ajoute un filtre sur la **date de création** (`createdAt`) pour retrouver les produits créés "Cette semaine" ou "Ce mois-ci". Ajoute aussi un filtre de type `TextFilter` sur le champ `imageFilename` pour trouver les produits qui n'ont pas d'image.

**Indications** :

- Utilise `DateTimeFilter` pour le filtre de date (import : `EasyCorp\Bundle\EasyAdminBundle\Filter\DateTimeFilter`)
- Ajoute le filtre dans la méthode `configureFilters` du `ProductCrudController`
- Pour trouver les produits sans image, utilise le filtre texte sur `imageFilename` et cherche les valeurs vides
- Teste en créant des produits à différentes dates et en utilisant les filtres

**Résultat attendu** : Le panneau de filtres affiche un filtre "Date de création" avec un sélecteur de dates (avant, après, entre). Tu peux filtrer les produits par période.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### Étape 1 : Ajouter les imports

Dans `src/Controller/Admin/ProductCrudController.php`, ajoute l'import en haut du fichier :

```php
use EasyCorp\Bundle\EasyAdminBundle\Filter\DateTimeFilter;
```

### Étape 2 : Modifier la méthode configureFilters

Ajoute les nouveaux filtres dans la méthode `configureFilters` :

```php
public function configureFilters(Filters $filters): Filters
{
    return $filters
        // Filtres existants
        ->add(TextFilter::new('name', 'Nom du produit'))
        ->add(EntityFilter::new('category', 'Catégorie'))
        ->add(NumericFilter::new('price', 'Prix'))
        ->add(BooleanFilter::new('isActive', 'Actif uniquement'))
        ->add(NumericFilter::new('stock', 'Stock'))

        // Nouveau filtre : Date de création
        ->add(DateTimeFilter::new('createdAt', 'Date de création'))

        // Nouveau filtre : Produits avec/sans image
        ->add(TextFilter::new('imageFilename', 'Image'))
    ;
}
```

### Étape 3 : Tester

1. Vide le cache : `php bin/console cache:clear`
2. Va sur la liste des produits dans l'admin
3. Clique sur l'icône "Filtres" (entonnoir)
4. Sélectionne "Date de création"
5. Choisis une plage de dates (par exemple "après" une date donnée)
6. Vérifie que seuls les produits correspondants s'affichent

Le filtre `DateTimeFilter` propose automatiquement les opérateurs : "avant", "après", "entre", "exactement".

---

## Navigation

← Fiche précédente : **[Gestion avancée des utilisateurs dans EasyAdmin](04-easyadmin-utilisateurs.md)**

→ Fiche suivante : **[Actions personnalisées dans EasyAdmin](06-easyadmin-actions-personnalisees.md)**
